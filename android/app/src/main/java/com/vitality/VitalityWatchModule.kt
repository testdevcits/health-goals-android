package com.vitality

import android.annotation.SuppressLint
import android.bluetooth.*
import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.ViewManager
import java.util.UUID

class VitalityWatchModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "VitalityWatchManager"

    private var bluetoothGatt: BluetoothGatt? = null
    private var connectedMacAddress: String? = null
    private var connectedDeviceName: String? = null
    private var isConnected = false

    private var currentBatteryLevel: Int = -1
    private var currentHeartRate: Int = -1
    private var currentSteps: Int = 0
    private var currentCalories: Double = 0.0
    private var currentDistanceMeters: Double = 0.0
    private var lastSyncedTimestamp: Long = 0

    private val mainHandler = Handler(Looper.getMainLooper())

    companion object {
        private const val TAG = "VitalityWatch"

        // Standard Bluetooth SIG UUIDs
        val SERVICE_BATTERY: UUID = UUID.fromString("0000180f-0000-1000-8000-00805f9b34fb")
        val CHAR_BATTERY_LEVEL: UUID = UUID.fromString("00002a19-0000-1000-8000-00805f9b34fb")

        val SERVICE_HEART_RATE: UUID = UUID.fromString("0000180d-0000-1000-8000-00805f9b34fb")
        val CHAR_HEART_RATE: UUID = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb")

        val SERVICE_RSC: UUID = UUID.fromString("00001814-0000-1000-8000-00805f9b34fb")
        val CHAR_RSC_MEASUREMENT: UUID = UUID.fromString("00002a53-0000-1000-8000-00805f9b34fb")

        // WeChat / Tencent Health Pedometer (Standard on boAt, Noise, Fire-Boltt, Realtek)
        val SERVICE_FEE7: UUID = UUID.fromString("0000fee7-0000-1000-8000-00805f9b34fb")
        val CHAR_FEC7_STEPS: UUID = UUID.fromString("0000fec7-0000-1000-8000-00805f9b34fb")
        val CHAR_FEC8_TARGET: UUID = UUID.fromString("0000fec8-0000-1000-8000-00805f9b34fb")
        val CHAR_FEC9_CAL_DIST: UUID = UUID.fromString("0000fec9-0000-1000-8000-00805f9b34fb")

        // CCCD descriptor
        val CLIENT_CHARACTERISTIC_CONFIG: UUID = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
    }

    private val gattCallback = object : BluetoothGattCallback() {
        @SuppressLint("MissingPermission")
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            val device = gatt.device
            Log.d(TAG, "Connection state change: status=$status, newState=$newState for ${device.address}")

            if (newState == BluetoothProfile.STATE_CONNECTED) {
                isConnected = true
                connectedMacAddress = device.address
                connectedDeviceName = device.name ?: "Smartwatch"

                // High priority for fast discovery & notifications
                gatt.requestConnectionPriority(BluetoothGatt.CONNECTION_PRIORITY_HIGH)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    gatt.requestMtu(512)
                } else {
                    gatt.discoverServices()
                }

                emitState("CONNECTED", device.address, connectedDeviceName)
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                isConnected = false
                emitState("DISCONNECTED", device.address, connectedDeviceName)
                try {
                    gatt.close()
                } catch (e: Exception) {
                    Log.w(TAG, "Error closing gatt", e)
                }
                if (bluetoothGatt === gatt) {
                    bluetoothGatt = null
                }
            }
        }

        @SuppressLint("MissingPermission")
        override fun onMtuChanged(gatt: BluetoothGatt, mtu: Int, status: Int) {
            Log.d(TAG, "MTU changed to $mtu, discovering services...")
            gatt.discoverServices()
        }

        @SuppressLint("MissingPermission")
        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            if (status != BluetoothGatt.GATT_SUCCESS) {
                Log.w(TAG, "Service discovery failed with status $status")
                return
            }

            Log.d(TAG, "Services discovered for ${gatt.device.address}: ${gatt.services.size} services")
            val services = gatt.services

            // 1. Explore Battery Service
            val batteryService = services.firstOrNull { it.uuid == SERVICE_BATTERY || it.uuid.toString().contains("180f", ignoreCase = true) }
            val batteryChar = batteryService?.getCharacteristic(CHAR_BATTERY_LEVEL)
            if (batteryChar != null) {
                gatt.readCharacteristic(batteryChar)
                enableNotification(gatt, batteryChar)
            }

            // 2. Explore Heart Rate Service
            val hrService = services.firstOrNull { it.uuid == SERVICE_HEART_RATE || it.uuid.toString().contains("180d", ignoreCase = true) }
            val hrChar = hrService?.getCharacteristic(CHAR_HEART_RATE)
            if (hrChar != null) {
                enableNotification(gatt, hrChar)
            }

            // 3. Explore WeChat / Tencent Health Pedometer (FEE7)
            val fee7 = services.firstOrNull { it.uuid == SERVICE_FEE7 || it.uuid.toString().contains("fee7", ignoreCase = true) }
            if (fee7 != null) {
                val stepChar = fee7.getCharacteristic(CHAR_FEC7_STEPS)
                if (stepChar != null) {
                    gatt.readCharacteristic(stepChar)
                    enableNotification(gatt, stepChar)
                }
                val calDistChar = fee7.getCharacteristic(CHAR_FEC9_CAL_DIST)
                if (calDistChar != null) {
                    gatt.readCharacteristic(calDistChar)
                    enableNotification(gatt, calDistChar)
                }
            }

            // 4. Explore RSC Service (1814)
            val rsc = services.firstOrNull { it.uuid == SERVICE_RSC || it.uuid.toString().contains("1814", ignoreCase = true) }
            val rscChar = rsc?.getCharacteristic(CHAR_RSC_MEASUREMENT)
            if (rscChar != null) {
                enableNotification(gatt, rscChar)
            }

            // 5. Explore Vendor Sports Notifiers (FFE0, FFE5, FFF0)
            services.forEach { service ->
                val sUuid = service.uuid.toString().lowercase()
                if (sUuid.contains("ffe0") || sUuid.contains("ffe5") || sUuid.contains("fff0") || sUuid.contains("fea0")) {
                    service.characteristics.forEach { ch ->
                        if ((ch.properties and BluetoothGattCharacteristic.PROPERTY_NOTIFY) != 0 ||
                            (ch.properties and BluetoothGattCharacteristic.PROPERTY_INDICATE) != 0) {
                            enableNotification(gatt, ch)
                        }
                    }
                }
            }

            emitTelemetry()
        }

        override fun onCharacteristicRead(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic, status: Int) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                val value = getCharacteristicValue(characteristic)
                handleCharacteristicUpdate(characteristic.uuid, value)
            }
        }

        // For Android 13+ (API 33+)
        override fun onCharacteristicChanged(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic, value: ByteArray) {
            handleCharacteristicUpdate(characteristic.uuid, value)
        }

        // For older Android versions (< API 33)
        @Deprecated("Deprecated in Java")
        override fun onCharacteristicChanged(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic) {
            val value = getCharacteristicValue(characteristic)
            handleCharacteristicUpdate(characteristic.uuid, value)
        }
    }

    private fun getCharacteristicValue(ch: BluetoothGattCharacteristic): ByteArray {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                ch.value ?: ByteArray(0)
            } else {
                @Suppress("DEPRECATION")
                ch.value ?: ByteArray(0)
            }
        } catch (e: Exception) {
            ByteArray(0)
        }
    }

    @SuppressLint("MissingPermission")
    private fun enableNotification(gatt: BluetoothGatt, characteristic: BluetoothGattCharacteristic): Boolean {
        try {
            val success = gatt.setCharacteristicNotification(characteristic, true)
            if (!success) return false

            val descriptor = characteristic.getDescriptor(CLIENT_CHARACTERISTIC_CONFIG) ?: return true
            val properties = characteristic.properties
            val value = if ((properties and BluetoothGattCharacteristic.PROPERTY_INDICATE) != 0) {
                BluetoothGattDescriptor.ENABLE_INDICATION_VALUE
            } else {
                BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                gatt.writeDescriptor(descriptor, value)
            } else {
                @Suppress("DEPRECATION")
                descriptor.value = value
                @Suppress("DEPRECATION")
                gatt.writeDescriptor(descriptor)
            }
            return true
        } catch (e: Exception) {
            Log.w(TAG, "Could not enable notification on ${characteristic.uuid}", e)
            return false
        }
    }

    private fun handleCharacteristicUpdate(uuid: UUID, value: ByteArray) {
        if (value.isEmpty()) return

        when {
            uuid == CHAR_BATTERY_LEVEL || uuid.toString().contains("2a19", ignoreCase = true) -> {
                val level = value[0].toInt() and 0xFF
                if (level in 0..100) {
                    currentBatteryLevel = level
                    emitTelemetry()
                }
            }
            uuid == CHAR_HEART_RATE || uuid.toString().contains("2a37", ignoreCase = true) -> {
                val hr = parseHeartRate(value)
                if (hr > 0) {
                    currentHeartRate = hr
                    emitTelemetry()
                }
            }
            uuid == CHAR_FEC7_STEPS || uuid.toString().contains("fec7", ignoreCase = true) -> {
                val steps = parseSteps(value)
                if (steps > 0) {
                    currentSteps = steps
                    if (currentDistanceMeters == 0.0) {
                        currentDistanceMeters = steps * 0.75
                    }
                    if (currentCalories == 0.0) {
                        currentCalories = Math.round(steps * 0.04 * 10.0) / 10.0
                    }
                    lastSyncedTimestamp = System.currentTimeMillis()
                    emitTelemetry()
                }
            }
            uuid == CHAR_FEC9_CAL_DIST || uuid.toString().contains("fec9", ignoreCase = true) -> {
                parseCalDist(value)
                emitTelemetry()
            }
            uuid == CHAR_RSC_MEASUREMENT || uuid.toString().contains("2a53", ignoreCase = true) -> {
                parseRsc(value)
                emitTelemetry()
            }
        }
    }

    private fun parseHeartRate(value: ByteArray): Int {
        if (value.isEmpty()) return -1
        val flags = value[0].toInt() and 0xFF
        val is16Bit = (flags and 0x01) != 0
        val hr = if (is16Bit && value.size >= 3) {
            (value[1].toInt() and 0xFF) or ((value[2].toInt() and 0xFF) shl 8)
        } else if (value.size >= 2) {
            value[1].toInt() and 0xFF
        } else {
            -1
        }
        return if (hr in 30..240) hr else -1
    }

    private fun parseSteps(value: ByteArray): Int {
        if (value.size >= 4) {
            // 1. Little Endian uint32
            val le = ((value[0].toInt() and 0xFF) or
                    ((value[1].toInt() and 0xFF) shl 8) or
                    ((value[2].toInt() and 0xFF) shl 16) or
                    ((value[3].toInt() and 0xFF) shl 24))
            if (le in 1..250000) return le

            // 2. Big Endian uint32
            val be = (((value[0].toInt() and 0xFF) shl 24) or
                    ((value[1].toInt() and 0xFF) shl 16) or
                    ((value[2].toInt() and 0xFF) shl 8) or
                    (value[3].toInt() and 0xFF))
            if (be in 1..250000) return be

            // 3. Command/flag byte prefix (e.g. Realtek / Jieli)
            val flagLE = ((value[1].toInt() and 0xFF) or
                    ((value[2].toInt() and 0xFF) shl 8) or
                    ((value[3].toInt() and 0xFF) shl 16))
            if (flagLE in 1..250000) return flagLE
        } else if (value.size >= 3) {
            val val3 = ((value[0].toInt() and 0xFF) or
                    ((value[1].toInt() and 0xFF) shl 8) or
                    ((value[2].toInt() and 0xFF) shl 16))
            if (val3 in 1..250000) return val3
        }
        return 0
    }

    private fun parseCalDist(value: ByteArray) {
        if (value.size >= 4) {
            val dist = ((value[0].toInt() and 0xFF) or
                    ((value[1].toInt() and 0xFF) shl 8) or
                    ((value[2].toInt() and 0xFF) shl 16)).toDouble()
            if (dist > 0 && dist < 100000) {
                currentDistanceMeters = dist
            }
            if (value.size >= 6) {
                val cal = ((value[3].toInt() and 0xFF) or
                        ((value[4].toInt() and 0xFF) shl 8)).toDouble()
                if (cal > 0 && cal < 10000) {
                    currentCalories = cal
                }
            }
        }
    }

    private fun parseRsc(value: ByteArray) {
        if (value.size < 4) return
        val flags = value[0].toInt() and 0xFF
        val hasStride = (flags and 0x01) != 0
        val hasDistance = (flags and 0x02) != 0
        var offset = 4
        if (hasStride) offset += 2
        if (hasDistance && value.size >= offset + 4) {
            val distDeci = ((value[offset].toInt() and 0xFF) or
                    ((value[offset + 1].toInt() and 0xFF) shl 8) or
                    ((value[offset + 2].toInt() and 0xFF) shl 16) or
                    ((value[offset + 3].toInt() and 0xFF) shl 24))
            val distMeters = distDeci / 10.0
            if (distMeters > 0) {
                currentDistanceMeters = distMeters
                val calculatedSteps = Math.round(distMeters / 0.75).toInt()
                if (calculatedSteps > currentSteps) {
                    currentSteps = calculatedSteps
                    currentCalories = Math.round(calculatedSteps * 0.04 * 10.0) / 10.0
                }
            }
        }
    }

    private fun emitState(state: String, macAddress: String?, deviceName: String?) {
        val params = Arguments.createMap().apply {
            putString("state", state)
            putBoolean("isConnected", state == "CONNECTED")
            putString("macAddress", macAddress ?: "")
            putString("deviceName", deviceName ?: "")
        }
        sendEvent("VitalityWatchState", params)
    }

    private fun emitTelemetry() {
        val params = Arguments.createMap().apply {
            putBoolean("isConnected", isConnected)
            putString("macAddress", connectedMacAddress ?: "")
            putString("deviceName", connectedDeviceName ?: "")
            putInt("batteryLevel", currentBatteryLevel)
            putInt("liveHeartRate", currentHeartRate)
            putInt("steps", currentSteps)
            putDouble("calories", currentCalories)
            putDouble("distanceKm", Math.round((currentDistanceMeters / 1000.0) * 100.0) / 100.0)
            putDouble("timestamp", System.currentTimeMillis().toDouble())
        }
        sendEvent("VitalityWatchTelemetry", params)
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        mainHandler.post {
            try {
                if (reactContext.hasActiveReactInstance()) {
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        ?.emit(eventName, params)
                }
            } catch (e: Exception) {
                Log.w(TAG, "Error emitting event $eventName", e)
            }
        }
    }

    // ──────────────────────────────────────────────
    // React Methods
    // ──────────────────────────────────────────────

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun connectWatch(macAddress: String, promise: Promise) {
        try {
            val bluetoothManager = reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
            val adapter = bluetoothManager?.adapter
            if (adapter == null || !adapter.isEnabled) {
                promise.reject("BLUETOOTH_DISABLED", "Bluetooth is turned off")
                return
            }

            val device = adapter.getRemoteDevice(macAddress)
            if (device == null) {
                promise.reject("DEVICE_NOT_FOUND", "No device found for address $macAddress")
                return
            }

            bluetoothGatt?.close()
            bluetoothGatt = null

            emitState("CONNECTING", macAddress, device.name)

            bluetoothGatt = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                device.connectGatt(reactContext, false, gattCallback, BluetoothDevice.TRANSPORT_LE)
            } else {
                device.connectGatt(reactContext, false, gattCallback)
            }

            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("macAddress", macAddress)
                putString("name", device.name ?: "Smartwatch")
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("CONNECT_ERROR", e.message, e)
        }
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    fun disconnectWatch(promise: Promise) {
        try {
            bluetoothGatt?.disconnect()
            bluetoothGatt?.close()
            bluetoothGatt = null
            isConnected = false
            emitState("DISCONNECTED", connectedMacAddress, connectedDeviceName)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("DISCONNECT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getLatestTelemetry(promise: Promise) {
        val result = Arguments.createMap().apply {
            putBoolean("isConnected", isConnected)
            putString("macAddress", connectedMacAddress ?: "")
            putString("deviceName", connectedDeviceName ?: "")
            putInt("batteryLevel", currentBatteryLevel)
            putInt("liveHeartRate", currentHeartRate)
            putInt("steps", currentSteps)
            putDouble("calories", currentCalories)
            putDouble("distanceKm", Math.round((currentDistanceMeters / 1000.0) * 100.0) / 100.0)
            putDouble("timestamp", lastSyncedTimestamp.toDouble())
        }
        promise.resolve(result)
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RN event emitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RN event emitter
    }
}

class VitalityWatchPackage : ReactPackage {
    override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> =
        listOf(VitalityWatchModule(context))

    override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> =
        emptyList()
}
