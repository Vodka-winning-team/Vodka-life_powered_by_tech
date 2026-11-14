'use no memo'; // drawn outside the app's React tree: the React Compiler must leave this file alone
// Home screen widget (Android APK only). Drawn by react-native-android-widget, not by the app's screens.
//
//   (V) Verifye                     • Automatic checking: on
//   [    Check copied message    ]   -> opens fraudlens://check: the app checks what was copied
//   | LATEST SECURITY ALERT · CERT-MU · 30 Oct 2026
//   | Fake Divali cash gift on WhatsApp   -> opens Our sources
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

// Colours follow Android's own widgets: a soft tonal surface, a slightly lighter inner card,
// and one filled pill for the main action.
const PALETTE: Record<
  'light' | 'dark',
  Record<'surface' | 'inner' | 'text' | 'muted' | 'primary' | 'onPrimary' | 'alert' | 'on' | 'off', HexColor>
> = {
  light: {
    surface: '#EEF2FB',
    inner: '#FFFFFF',
    text: '#14171F',
    muted: '#5B6170',
    primary: '#1F4FD8',
    onPrimary: '#FFFFFF',
    alert: '#9A5B00',
    on: '#1A7F4B',
    off: '#8A8D93',
  },
  dark: {
    surface: '#1C2029',
    inner: '#272C37',
    text: '#F2F4F8',
    muted: '#A7AEBB',
    primary: '#7EA2FF',
    onPrimary: '#0E1116',
    alert: '#F2B84B',
    on: '#5FD39A',
    off: '#7C8494',
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
        backgroundColor: c.surface,
        borderRadius: 28,
        padding: 16,
      }}>
      {/* Top row, like Android's own widgets: a small app badge and name, and the status on the right. */}
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 'match_parent' }}>
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FlexWidget
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: c.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
            }}>
            <TextWidget text="V" style={{ fontSize: 13, fontWeight: '700', color: c.onPrimary }} />
          </FlexWidget>
          <TextWidget text="Verifye" style={{ fontSize: 14, fontWeight: '600', color: c.text }} />
        </FlexWidget>

        {/* Automatic checking (Shield) status: a coloured dot and a short line. */}
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FlexWidget style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: shieldOn ? c.on : c.off, marginRight: 6 }} />
          <TextWidget
            text={t(shieldOn ? 'widgetShieldOn' : 'widgetShieldOff', language)}
            style={{ fontSize: 11, color: c.muted }}
            maxLines={1}
            truncate="END"
          />
        </FlexWidget>
      </FlexWidget>

      {/* The main action: check what the user just copied in WhatsApp or SMS. */}
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: 'fraudlens://check' }}
        style={{
          width: 'match_parent',
          height: 52,
          backgroundColor: c.primary,
          borderRadius: 26,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextWidget text={t('widgetCheck', language)} style={{ fontSize: 16, fontWeight: '700', color: c.onPrimary }} maxLines={1} />
      </FlexWidget>

      {/* The newest official alert in its own inner card, with its source and date. Tap: Our sources. */}
      {alert && (
        <FlexWidget
          clickAction="OPEN_URI"
          clickActionData={{ uri: 'fraudlens://sources' }}
          style={{
            flexDirection: 'column',
            width: 'match_parent',
            backgroundColor: c.inner,
            borderRadius: 18,
            paddingVertical: 10,
            paddingHorizontal: 14,
          }}>
          <TextWidget
            text={`${t('widgetAlertLabel', language).toUpperCase()} · CERT-MU · ${prettyDate(alert.alert_date)}`}
            style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.05, color: c.alert }}
            maxLines={1}
            truncate="END"
          />
          <TextWidget text={alert.campaign} style={{ fontSize: 13, color: c.text }} maxLines={2} truncate="END" />
        </FlexWidget>
      )}
    </FlexWidget>
  );
}
