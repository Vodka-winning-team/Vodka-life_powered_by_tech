import { looksLikeMessage } from '@/lib/input-check';

test('random typing is not a message', () => {
  expect(looksLikeMessage('t4rcndfrnoif')).toBe(false);
  expect(looksLikeMessage('asdkjh')).toBe(false);
  expect(looksLikeMessage('zxcvbnm qwrtp')).toBe(false);
  expect(looksLikeMessage('!!!! ???? ....')).toBe(false);
  expect(looksLikeMessage('hello')).toBe(false);
  expect(looksLikeMessage('')).toBe(false);
});

test('real messages are accepted, in English, French and Kreol', () => {
  expect(looksLikeMessage('MCB: Your OTP is 553201')).toBe(true);
  expect(looksLikeMessage('Pay the processing fee of Rs 50,000 today by Juice.')).toBe(true);
  expect(looksLikeMessage('Collez ci-dessous un message suspect')).toBe(true);
  expect(looksLikeMessage('Bonzour, nou ena travay dan lotel Canada')).toBe(true);
  expect(looksLikeMessage('ok bye')).toBe(true);
});

test('a link or a phone number on its own is worth checking', () => {
  expect(looksLikeMessage('https://bit.ly/parcel-mu')).toBe(true);
  expect(looksLikeMessage('mcb-login-secure.net')).toBe(true);
  expect(looksLikeMessage('+230 5256 8074')).toBe(true);
});
