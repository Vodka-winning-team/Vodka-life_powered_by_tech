package expo.modules.fraudlensshield

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

private const val CHANNEL_ID = "message-checks"

class FraudlensShieldModule : Module() {
  private val context: Context
    get() = requireNotNull(appContext.reactContext)

  override fun definition() = ModuleDefinition {
    Name("FraudlensShield")

    // JavaScript receives { app, text } for each new WhatsApp/SMS notification.
    Events("onMessage")

    OnStartObserving("onMessage") {
      ShieldListenerService.onMessage = { app, text ->
        sendEvent("onMessage", mapOf("app" to app, "text" to text))
      }
    }

    OnStopObserving("onMessage") {
      ShieldListenerService.onMessage = null
    }

    /** True when the user has turned on notification access for FraudLens. */
    Function("isAccessEnabled") {
      val enabled = Settings.Secure.getString(context.contentResolver, "enabled_notification_listeners") ?: ""
      enabled.contains(context.packageName)
    }

    /** True when FraudLens may show alerts (Android 13+ asks the user). */
    Function("canShowAlerts") {
      notificationManager().areNotificationsEnabled()
    }

    Function("openAccessSettings") {
      context.startActivity(
        Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      )
    }

    /** App info page, where the user sets battery use to "Unrestricted". */
    Function("openAppSettings") {
      context.startActivity(
        Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + context.packageName))
          .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      )
    }

    Function("createChannel") { name: String, description: String ->
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val channel = NotificationChannel(CHANNEL_ID, name, NotificationManager.IMPORTANCE_HIGH)
        channel.description = description
        notificationManager().createNotificationChannel(channel)
      }
    }

    /**
     * Shows "Stop – warning signs found / Tap to see why". Tapping it opens FraudLens with the message,
     * the same way as sharing it (share-in), so the Result screen shows the full check.
     */
    Function("showAlert") { id: Int, title: String, body: String, message: String ->
      val open = (context.packageManager.getLaunchIntentForPackage(context.packageName) ?: Intent())
        .setAction(Intent.ACTION_SEND)
        .setType("text/plain")
        .putExtra(Intent.EXTRA_TEXT, message)
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      val tap = PendingIntent.getActivity(
        context, id, open, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
      )
      val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        Notification.Builder(context, CHANNEL_ID)
      } else {
        @Suppress("DEPRECATION")
        Notification.Builder(context)
      }
      val alert = builder
        .setSmallIcon(android.R.drawable.ic_dialog_alert)
        .setContentTitle(title)
        .setContentText(body)
        .setContentIntent(tap)
        .setAutoCancel(true)
        .build()
      notificationManager().notify(id, alert)
    }
  }

  private fun notificationManager(): NotificationManager =
    context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
}
