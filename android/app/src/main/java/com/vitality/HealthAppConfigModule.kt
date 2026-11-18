package com.vitality

import android.content.ClipData
import android.content.ContentValues
import android.content.Intent
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.ReactPackage
import com.facebook.react.uimanager.ViewManager
import java.io.File
import java.io.FileOutputStream

class HealthAppConfigModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "HealthAppConfig"
  override fun getConstants(): MutableMap<String, Any> = hashMapOf(
    "apiBaseUrl" to BuildConfig.HEALTH_API_BASE_URL,
    "chatSocketUrl" to BuildConfig.HEALTH_CHAT_SOCKET_URL
  )

  @ReactMethod
  fun generateAndSavePdf(options: ReadableMap, promise: Promise) {
    try {
      val title = if (options.hasKey("title")) options.getString("title") ?: "Vitality Health Report" else "Vitality Health Report"
      val fileName = if (options.hasKey("fileName")) options.getString("fileName") ?: "Vitality_Health_Report" else "Vitality_Health_Report"
      val safeFileName = if (fileName.endsWith(".pdf")) fileName else "$fileName.pdf"
      val metric = if (options.hasKey("metric")) options.getString("metric") ?: "Health" else "Health"
      val period = if (options.hasKey("period")) options.getString("period") ?: "" else ""
      val total = if (options.hasKey("total")) options.getString("total") ?: "-" else "-"
      val avg = if (options.hasKey("avg")) options.getString("avg") ?: "-" else "-"
      val max = if (options.hasKey("max")) options.getString("max") ?: "-" else "-"
      val activeDays = if (options.hasKey("activeDays")) options.getString("activeDays") ?: "-" else "-"
      val coins = if (options.hasKey("coins")) options.getString("coins") ?: "0" else "0"

      val document = PdfDocument()
      val pageWidth = 595
      val pageHeight = 842
      var pageNumber = 1

      var pageInfo = PdfDocument.PageInfo.Builder(pageWidth, pageHeight, pageNumber).create()
      var page = document.startPage(pageInfo)
      var canvas = page.canvas

      val paintTitle = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        textSize = 22f
        color = Color.parseColor("#4338CA")
        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
      }
      val paintSubtitle = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        textSize = 10f
        color = Color.parseColor("#6B7280")
      }
      val paintBodyBold = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        textSize = 10f
        color = Color.parseColor("#111827")
        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
      }
      val paintBody = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        textSize = 10f
        color = Color.parseColor("#374151")
      }
      val paintCardBg = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.parseColor("#F9FAFB")
        style = Paint.Style.FILL
      }
      val paintBorder = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.parseColor("#E5E7EB")
        style = Paint.Style.STROKE
        strokeWidth = 1f
      }

      // Brand Header
      canvas.drawText("VITALITY", 40f, 50f, paintTitle)
      canvas.drawText("Official Health & Activity Performance Summary", 40f, 66f, paintSubtitle)
      canvas.drawLine(40f, 78f, 555f, 78f, paintBorder)

      // Meta Banner
      val metaRect = RectF(40f, 88f, 555f, 122f)
      paintCardBg.color = Color.parseColor("#EEF2FF")
      canvas.drawRoundRect(metaRect, 6f, 6f, paintCardBg)
      canvas.drawRoundRect(metaRect, 6f, 6f, paintBorder)

      canvas.drawText("Metric: $metric", 52f, 108f, paintBodyBold)
      canvas.drawText("Period: $period", 200f, 108f, paintBody)

      // KPI Grid (5 cards)
      val kpiWidth = 97f
      val kpiHeight = 52f
      val kpiY = 132f
      val kpis = listOf(
        Pair(total, "Total $metric"),
        Pair(avg, "Daily Avg"),
        Pair(max, "Best Day"),
        Pair(activeDays, "Active Days"),
        Pair(coins, "Coins Earned")
      )

      paintCardBg.color = Color.parseColor("#F9FAFB")
      for (i in kpis.indices) {
        val left = 40f + i * (kpiWidth + 7f)
        val rect = RectF(left, kpiY, left + kpiWidth, kpiY + kpiHeight)
        canvas.drawRoundRect(rect, 4f, 4f, paintCardBg)
        canvas.drawRoundRect(rect, 4f, 4f, paintBorder)

        val valPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
          textSize = 12f
          typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
          color = if (i == 4) Color.parseColor("#D97706") else Color.parseColor("#1F2937")
        }
        canvas.drawText(kpis[i].first.take(18), left + 8f, kpiY + 22f, valPaint)
        canvas.drawText(kpis[i].second, left + 8f, kpiY + 40f, paintSubtitle)
      }

      // Table Header
      var currentY = 205f
      val tableHeaderRect = RectF(40f, currentY, 555f, currentY + 24f)
      paintCardBg.color = Color.parseColor("#F3F4F6")
      canvas.drawRect(tableHeaderRect, paintCardBg)
      canvas.drawLine(40f, currentY + 24f, 555f, currentY + 24f, paintBorder)

      canvas.drawText("Date", 50f, currentY + 16f, paintBodyBold)
      canvas.drawText("Recorded Activity", 280f, currentY + 16f, paintBodyBold)
      canvas.drawText("Status", 470f, currentY + 16f, paintBodyBold)
      currentY += 24f

      // Rows
      if (options.hasKey("rows")) {
        val rows = options.getArray("rows")
        if (rows != null) {
          for (i in 0 until rows.size()) {
            if (currentY > 770f) {
              document.finishPage(page)
              pageNumber++
              pageInfo = PdfDocument.PageInfo.Builder(pageWidth, pageHeight, pageNumber).create()
              page = document.startPage(pageInfo)
              canvas = page.canvas

              // Re-draw table header on subsequent pages
              currentY = 40f
              val subHeaderRect = RectF(40f, currentY, 555f, currentY + 24f)
              paintCardBg.color = Color.parseColor("#F3F4F6")
              canvas.drawRect(subHeaderRect, paintCardBg)
              canvas.drawLine(40f, currentY + 24f, 555f, currentY + 24f, paintBorder)
              canvas.drawText("Date", 50f, currentY + 16f, paintBodyBold)
              canvas.drawText("Recorded Activity", 280f, currentY + 16f, paintBodyBold)
              canvas.drawText("Status", 470f, currentY + 16f, paintBodyBold)
              currentY += 24f
            }

            val row = rows.getMap(i)
            val dateStr = if (row != null && row.hasKey("date")) row.getString("date") ?: "" else ""
            val dayName = if (row != null && row.hasKey("day")) row.getString("day") ?: "" else ""
            val valueStr = if (row != null && row.hasKey("value")) row.getString("value") ?: "" else ""
            val statusStr = if (row != null && row.hasKey("status")) row.getString("status") ?: "" else ""

            if (i % 2 == 1) {
              val zebraRect = RectF(40f, currentY, 555f, currentY + 22f)
              paintCardBg.color = Color.parseColor("#F9FAFB")
              canvas.drawRect(zebraRect, paintCardBg)
            }
            canvas.drawLine(40f, currentY + 22f, 555f, currentY + 22f, paintBorder)

            canvas.drawText("$dateStr  $dayName", 50f, currentY + 15f, paintBody)
            canvas.drawText(valueStr, 280f, currentY + 15f, paintBodyBold)

            val statusPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
              textSize = 9f
              typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
              color = if (statusStr.contains("Goal") || statusStr.contains("Recorded")) Color.parseColor("#15803D") else Color.parseColor("#6B7280")
            }
            canvas.drawText(statusStr, 470f, currentY + 15f, statusPaint)

            currentY += 22f
          }
        }
      }

      // Footer
      val footerY = 810f
      canvas.drawLine(40f, footerY - 14f, 555f, footerY - 14f, paintBorder)
      canvas.drawText(
        "Vitality Health App • Generated for personal tracking and wellness. Not intended for clinical diagnosis.",
        40f,
        footerY,
        paintSubtitle
      )

      document.finishPage(page)

      // 1. Save to public Downloads directory
      var publicDownloadSuccess = false
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        val contentValues = ContentValues().apply {
          put(MediaStore.MediaColumns.DISPLAY_NAME, safeFileName)
          put(MediaStore.MediaColumns.MIME_TYPE, "application/pdf")
          put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Vitality")
        }
        val resolver = reactApplicationContext.contentResolver
        val downloadUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
        if (downloadUri != null) {
          resolver.openOutputStream(downloadUri)?.use { out ->
            document.writeTo(out)
            publicDownloadSuccess = true
          }
        }
      } else {
        val publicDir = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "Vitality")
        if (!publicDir.exists()) publicDir.mkdirs()
        val targetFile = File(publicDir, safeFileName)
        FileOutputStream(targetFile).use { out ->
          document.writeTo(out)
          publicDownloadSuccess = true
        }
      }

      // 2. Also save to cacheDir for immediate FileProvider launch
      val cacheFile = File(reactApplicationContext.cacheDir, safeFileName)
      FileOutputStream(cacheFile).use { out ->
        document.writeTo(out)
      }
      document.close()

      // 3. Open directly with Intent.ACTION_VIEW
      val contentUri = FileProvider.getUriForFile(
        reactApplicationContext,
        "${reactApplicationContext.packageName}.fileprovider",
        cacheFile
      )
      val viewIntent = Intent(Intent.ACTION_VIEW).apply {
        setDataAndType(contentUri, "application/pdf")
        clipData = ClipData.newRawUri(title, contentUri)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }

      val chooser = Intent.createChooser(viewIntent, "Open health report").apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }

      val activity = reactApplicationContext.currentActivity
      try {
        if (activity != null) {
          activity.startActivity(chooser)
        } else {
          reactApplicationContext.startActivity(chooser)
        }
      } catch (_: Exception) {
        // Fallback to share intent if no viewer app is installed
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
          type = "application/pdf"
          putExtra(Intent.EXTRA_STREAM, contentUri)
          putExtra(Intent.EXTRA_SUBJECT, title)
          clipData = ClipData.newRawUri(title, contentUri)
          addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        reactApplicationContext.startActivity(Intent.createChooser(shareIntent, "Share health report").apply {
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        })
      }

      val result: WritableMap = Arguments.createMap()
      result.putString("filePath", cacheFile.absolutePath)
      result.putString("downloadPath", "Downloads/Vitality/$safeFileName")
      result.putBoolean("publicDownloaded", publicDownloadSuccess)
      result.putString("uri", contentUri.toString())
      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject("PDF_ERROR", e.message ?: "Failed to generate PDF", e)
    }
  }

  @ReactMethod
  fun sharePdf(title: String, content: String) {
    try {
      val document = PdfDocument()
      val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { textSize = 12f; color = Color.DKGRAY }
      var pageNumber = 1
      var page = document.startPage(PdfDocument.PageInfo.Builder(595, 842, pageNumber).create())
      var canvas = page.canvas
      canvas.drawText(title.take(80), 48f, 56f, Paint(paint).apply { textSize = 20f; color = Color.BLACK })
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
        clipData = ClipData.newRawUri(title, uri)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      val chooser = Intent.createChooser(intent, "Share health report").apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      val activity = reactApplicationContext.currentActivity
      if (activity != null) {
        activity.startActivity(chooser)
      } else {
        reactApplicationContext.startActivity(chooser)
      }
    } catch (_: Exception) {
      // Ignored
    }
  }

  @ReactMethod
  fun viewPdf(filePath: String, title: String) {
    try {
      val file = File(filePath)
      if (!file.exists()) {
        sharePdf(title, "Health report file could not be found.")
        return
      }
      val uri = FileProvider.getUriForFile(
        reactApplicationContext,
        "${reactApplicationContext.packageName}.fileprovider",
        file
      )
      val intent = Intent(Intent.ACTION_VIEW).apply {
        setDataAndType(uri, "application/pdf")
        clipData = ClipData.newRawUri(title, uri)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      val chooser = Intent.createChooser(intent, "Open health report").apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      val activity = reactApplicationContext.currentActivity
      if (activity != null) {
        activity.startActivity(chooser)
      } else {
        reactApplicationContext.startActivity(chooser)
      }
    } catch (e: Exception) {
      sharePdfFile(filePath, title)
    }
  }

  @ReactMethod
  fun sharePdfFile(filePath: String, title: String) {
    try {
      val file = File(filePath)
      val uri = FileProvider.getUriForFile(
        reactApplicationContext,
        "${reactApplicationContext.packageName}.fileprovider",
        file
      )
      val intent = Intent(Intent.ACTION_SEND).apply {
        type = "application/pdf"
        putExtra(Intent.EXTRA_STREAM, uri)
        putExtra(Intent.EXTRA_SUBJECT, title)
        clipData = ClipData.newRawUri(title, uri)
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      val chooser = Intent.createChooser(intent, "Share health report").apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      val activity = reactApplicationContext.currentActivity
      if (activity != null) {
        activity.startActivity(chooser)
      } else {
        reactApplicationContext.startActivity(chooser)
      }
    } catch (e: Exception) {
      sharePdf(title, "Vitality Health Report: $title")
    }
  }
}

class HealthAppConfigPackage : ReactPackage {
  override fun createNativeModules(context: ReactApplicationContext) = listOf(HealthAppConfigModule(context))
  override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
