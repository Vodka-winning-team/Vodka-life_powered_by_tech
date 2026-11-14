// Before you pay: type who you are about to pay and how much. Our server checks the account or
// number against reports from other users and tells you to go ahead, be careful, or pause.
// Verifye never makes a payment: this is only a check before you open your banking app.

import { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Button, Card, Label, Screen, Status } from '@/components/ui';
import { t } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useLook } from '@/hooks/use-look';
import { useTheme } from '@/hooks/use-theme';
import { checkPayment, type PaymentAnswer } from '@/lib/online';
import { useStore } from '@/lib/store';

export default function PayScreen() {
  const theme = useTheme();
  const { scale } = useLook();
  const { serverUrl } = useStore();
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<PaymentAnswer | null>(null);
  // Seconds left of the "pause" the server asks for.
  const [wait, setWait] = useState(0);

  // Count the pause down, one second at a time.
  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  async function check() {
    const value = Number(amount.replace(/[^\d.]/g, ''));
    if (account.trim().length < 4 || !(value > 0)) {
      setError(t('payMissing'));
      return;
    }
    setError('');
    setBusy(true);
    const result = await checkPayment(serverUrl, { payee_name: name.trim() || null, payee_account: account.trim(), amount: value });
    setBusy(false);
    if (result === null) {
      setError(t('onlineOffline'));
      return;
    }
    setAnswer(result);
    setWait(result.cooldown_seconds);
  }

  const inputStyle = [
    styles.input,
    { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border, fontSize: FontSize.body * scale },
  ];

  return (
    <Screen>
      <Label>{t('payHint')}</Label>

      <Label variant="label">{t('payName')}</Label>
      <TextInput value={name} onChangeText={setName} accessibilityLabel={t('payName')} style={inputStyle} />

      <Label variant="label">{t('payAccount')}</Label>
      <TextInput value={account} onChangeText={setAccount} accessibilityLabel={t('payAccount')} style={inputStyle} />

      <Label variant="label">{t('payAmount')}</Label>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        accessibilityLabel={t('payAmount')}
        style={inputStyle}
      />

      {error !== '' && <Label variant="label">{error}</Label>}
      <Button title={busy ? t('onlineLoading') : t('payButton')} onPress={check} />

      {answer && (
        <Card>
          <Status>{answer.headline}</Status>
          {answer.reasons.map((reason) => (
            <Label key={reason.text} variant="small">
              • {reason.text}
            </Label>
          ))}
          {answer.safe_actions.map((action) => (
            <Label key={action.id}>
              {action.title}: {action.detail}
            </Label>
          ))}
          {wait > 0 && (
            <Label variant="label">
              {t('payWait')}: {wait}s
            </Label>
          )}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: Radius, padding: Spacing.three, minHeight: 52 },
});
