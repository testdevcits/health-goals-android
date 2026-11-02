package com.vitality

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.ReactPackage
import com.facebook.react.uimanager.ViewManager
import android.content.Intent
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import androidx.core.content.FileProvider
import java.io.File

class HealthAppConfigModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "HealthAppConfig"
  override fun getConstants(): MutableMap<String, Any> = hashMapOf(
    "apiBaseUrl" to BuildConfig.HEALTH_API_BASE_URL,
    "googleWebClientId" to BuildConfig.GOOGLE_WEB_CLIENT_ID
  )

  @ReactMethod
  fun sharePdf(title: String, content: String) {
    val document = PdfDocument()
    val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { textSize = 12f; color = android.graphics.Color.DKGRAY }
    var pageNumber = 1
    var page = document.startPage(PdfDocument.PageInfo.Builder(595, 842, pageNumber).create())
    var canvas = page.canvas
    canvas.drawText(title.take(80), 48f, 56f, Paint(paint).apply { textSize = 20f; color = android.graphics.Color.BLACK })
    var y = 90f
    val lines = content.split('\n').flatMap { line ->
      val words = line.split(' '); val out = mutableListOf<String>(); var current = ""
      for (word in words) { val next = if (current.isEmpty()) word else "$current $word"; if (paint.measureText(next) > 500f) { out.add(current); current = word } else current = next }
      if (current.isNotEmpty()) out.add(current); out
    }
    for (line in lines) {
      if (y > 790f) { document.finishPage(page); pageNumber += 1; page = document.startPage(PdfDocument.PageInfo.Builder(595, 842, pageNumber).create()); canvas = page.canvas; y = 55f }
      canvas.drawText(line.take(140), 48f, y, paint); y += 20f
    }
    document.finishPage(page)
    val file = File(reactApplicationContext.cacheDir, "health-report-${System.currentTimeMillis()}.pdf")
    file.outputStream().use { document.writeTo(it) }
    document.close()
    val uri = FileProvider.getUriForFile(reactApplicationContext, "${reactApplicationContext.packageName}.fileprovider", file)
    val intent = Intent(Intent.ACTION_SEND).apply {
      type = "application/pdf"
      putExtra(Intent.EXTRA_STREAM, uri)
      putExtra(Intent.EXTRA_SUBJECT, title)
      addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
    }
    currentActivity?.startActivity(Intent.createChooser(intent, "Share health report"))
  }
}

class HealthAppConfigPackage : ReactPackage {
  override fun createNativeModules(context: ReactApplicationContext) = listOf(HealthAppConfigModule(context))
  override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
