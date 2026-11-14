// The home screen widget is drawn natively, but its tree is built in JS: check it builds,
// shows the newest CERT-MU alert, opens the right links, and follows the language and Shield setting.

import type { ReactElement } from 'react';

import { latestAlert, VerifyeWidget } from '../verifye-widget';

// The library's own tree builder (not in its public types).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { buildWidgetTree } = require('react-native-android-widget/lib/commonjs/api/build-widget-tree') as {
  buildWidgetTree: (widget: ReactElement) => unknown;
};

function texts(node: unknown): string[] {
  const n = node as { props?: { text?: string }; children?: unknown[] };
  return [...(n.props?.text ? [n.props.text] : []), ...(n.children ?? []).flatMap(texts)];
}

function uris(node: unknown): string[] {
  const n = node as { props?: { clickActionData?: { uri?: string } }; children?: unknown[] };
  const uri = n.props?.clickActionData?.uri;
  return [...(uri ? [uri] : []), ...(n.children ?? []).flatMap(uris)];
}

test('latest alert is the newest CERT-MU alert in our data', () => {
  expect(latestAlert().alert_date).toBe('2026-10-30');
});

test('widget builds in English with the check button, the alert and the Shield status', () => {
  const tree = buildWidgetTree(<VerifyeWidget scheme="dark" language="en" shieldOn />);
  const all = texts(tree);
  expect(all).toContain('Check copied message');
  expect(all).toContain(latestAlert().campaign);
  expect(all).toContain('Automatic checking: on');
  expect(uris(tree)).toEqual(['fraudlens://check', 'fraudlens://sources']);
});

test('widget follows the language and the Shield setting', () => {
  const all = texts(buildWidgetTree(<VerifyeWidget scheme="light" language="mfe" shieldOn={false} />));
  expect(all).toContain('Verifye mesaz kopye');
  expect(all).toContain('Verifikasion otomatik: pa pe marse');
});
