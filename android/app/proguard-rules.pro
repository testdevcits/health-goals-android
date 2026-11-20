# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ── PDFBox / react-native-html-to-pdf ─────────────────────────────────
-dontwarn com.gemalto.jp2.**
-dontwarn com.tom_roush.pdfbox.**
-keep class com.tom_roush.pdfbox.** { *; }
-dontwarn org.bouncycastle.**
-dontwarn org.apache.harmony.javax.security.auth.**

# ── react-native-ble-plx ──────────────────────────────────────────────
-dontwarn com.polidea.rxandroidble2.**
-keep class com.polidea.rxandroidble2.** { *; }

# ── react-native-health-connect ───────────────────────────────────────
-keep class androidx.health.connect.** { *; }
-dontwarn androidx.health.connect.**

# ── Background Geolocation & Fetch ────────────────────────────────────
-keep class com.transistorsoft.** { *; }
-dontwarn com.transistorsoft.**

# ── Nitro SQLite & Modules ────────────────────────────────────────────
-keep class com.margelo.nitro.** { *; }
-dontwarn com.margelo.nitro.**

