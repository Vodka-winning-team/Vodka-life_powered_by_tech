// Home screen widget (Android APK only). Drawn by react-native-android-widget, not by the app's screens.
//
//   Verifye · avan ou peye
//   [ Check copied message ]      -> opens fraudlens://check: the app checks what was copied
//   LATEST SECURITY ALERT · CERT-MU · 30 Oct 2026
//   Fake Divali cash gift on WhatsApp   -> opens Our sources
//   Automatic checking: on
//
// Everything comes from data bundled in the app, so the widget works offline and sends nothing.

import { FlexWidget, TextWidget } from 'react-native-android-widget';

import { t, type Language } from '@/constants/strings';
import { prettyDate } from '@/engine';

type HexColor = `#${string}`;

const certAlerts: { campaign: string; alert_date: string }[] = require('../../app/src/main/assets/data/cert_alerts.json');

/** The newest CERT-MU alert in our data (dates are YYYY-MM-DD, so they sort as text). */
export function latestAlert() {
  return [...certAlerts].sort((a, b) => b.alert_date.localeCompare(a.alert_date))[0];
}

const PALETTE: Record<'light' | 'dark', Record<'background' | 'text' | 'muted' | 'primary' | 'onPrimary' | 'alert', HexColor>> = {
  light: {
    background: '#FFFFFF',
    text: '#14171F',
    muted: '#5B6170',
    primary: '#1F4FD8',
    onPrimary: '#FFFFFF',
    alert: '#B26A00',
  },
  dark: {
    background: '#181C23',
    text: '#F2F4F8',
    muted: '#A7AEBB',
    primary: '#7EA2FF',
    onPrimary: '#0E1116',
    alert: '#F2A900',
  },
};

export const WIDGET_NAME = 'Verifye';

export function VerifyeWidget({
  scheme,
  language,
  shieldOn,
}: {
  scheme: 'light' | 'dark';
  language: Language;
  shieldOn: boolean;
}) {
  const c = PALETTE[scheme];
  const alert = latestAlert();

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: c.background,
        borderRadius: 24,
        padding: 14,
      }}>
      {/* Name and tagline */}
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', width: 'match_parent' }}>
        <TextWidget text="Verifye" style={{ fontSize: 17, fontWeight: '700', color: c.text }} />
        <TextWidget text="  ·  avan ou peye" style={{ fontSize: 13, color: c.muted }} />
      </FlexWidget>

      {/* The main action: check what the user just copied in WhatsApp or SMS. */}
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: 'fraudlens://check' }}
        style={{
          width: 'match_parent',
          backgroundColor: c.primary,
          borderRadius: 999,
          paddingVertical: 11,
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextWidget text={t('widgetCheck', language)} style={{ fontSize: 15, fontWeight: '700', color: c.onPrimary }} />
      </FlexWidget>

      {/* The newest official alert, with its source and date. Tap: Our sources. */}
      {alert && (
        <FlexWidget
          clickAction="OPEN_URI"
          clickActionData={{ uri: 'fraudlens://sources' }}
          style={{ flexDirection: 'column', width: 'match_parent' }}>
          <TextWidget
            text={`${t('widgetAlertLabel', language).toUpperCase()} · CERT-MU · ${prettyDate(alert.alert_date)}`}
            style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.05, color: c.alert }}
            maxLines={1}
            truncate="END"
          />
          <TextWidget text={alert.campaign} style={{ fontSize: 13, color: c.text }} maxLines={2} truncate="END" />
        </FlexWidget>
      )}

      {/* Automatic checking (Shield) status, so the user knows if they are covered. */}
      <TextWidget
        text={t(shieldOn ? 'widgetShieldOn' : 'widgetShieldOff', language)}
        style={{ fontSize: 11, color: c.muted }}
        maxLines={1}
      />
    </FlexWidget>
  );
}
