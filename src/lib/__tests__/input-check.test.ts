import { looksLikeMessage } from '@/lib/input-check';

test('random typing is not a message', () => {
  expect(looksLikeMessage('t4rcndfrnoif')).toBe(false);
  expect(looksLikeMessage('asdkjh')).toBe(false);
  expect(looksLikeMessage('zxcvbnm qwrtp')).toBe(false);
  expect(looksLikeMessage('!!!! ???? ....')).toBe(false);
  expect(looksLikeMessage('hello')).toBe(false);
  expect(looksLikeMessage('')).toBe(false);
});

test('test typing is not a message either (found by Pushkar)', () => {
  for (const text of ['asdf asdf', 'qwerty qwerty', 'blah blah', 'xyz xyz', 'AAAAA BBBBB', 'test.test', 'asdkjh.qwkjzx', 'foo.bar', '1111111', '0000 0000']) {
    expect(looksLikeMessage(text)).toBe(false);
  }
});

test('a Chinese message (no spaces) is accepted', () => {
  expect(looksLikeMessage('您的包裹无法派送，请点击链接更新地址')).toBe(true);
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
  expect(looksLikeMessage('Visit mcb-login.sbs')).toBe(true);
  expect(looksLikeMessage('mcb-login.net.')).toBe(true);
  expect(looksLikeMessage('+230 5256 8074')).toBe(true);
});
