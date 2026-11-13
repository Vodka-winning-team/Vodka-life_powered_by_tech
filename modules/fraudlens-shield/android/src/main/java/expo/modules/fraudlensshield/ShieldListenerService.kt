package expo.modules.fraudlensshield

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

/**
 * Android calls this service for every new notification, but ONLY after the user has turned on
 * notification access for FraudLens (Settings → Notification access). We pass on the text of
 * WhatsApp and SMS notifications only; everything else is ignored and nothing is stored.
 */
class ShieldListenerService : NotificationListenerService() {
  companion object {
    /** WhatsApp, WhatsApp Business, Google Messages, Samsung Messages (+ adb test notifications). */
    val MESSAGE_APPS = setOf(
      "com.whatsapp",
      "com.whatsapp.w4b",
      "com.google.android.apps.messaging",
      "com.samsung.android.messaging",
      "com.android.shell"
    )

    /** Set by the module while the app's JavaScript is running; receives (app package, message text). */
    @Volatile
    var onMessage: ((String, String) -> Unit)? = null
  }

  override fun onNotificationPosted(sbn: StatusBarNotification) {
    if (sbn.packageName !in MESSAGE_APPS) return
    val notification = sbn.notification ?: return
    // "3 new messages" summary notifications carry no message text.
    if (notification.flags and Notification.FLAG_GROUP_SUMMARY != 0) return

    val extras = notification.extras ?: return
    val text = (extras.getCharSequence(Notification.EXTRA_BIG_TEXT)
      ?: extras.getCharSequence(Notification.EXTRA_TEXT))?.toString()?.trim()
    if (text.isNullOrEmpty()) return

    onMessage?.invoke(sbn.packageName, text)
  }
}
