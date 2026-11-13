import { isPhoneQuery } from '@/lib/phone';

test('phone numbers are recognised, names are not', () => {
  expect(isPhoneQuery('5256 8074')).toBe(true);
  expect(isPhoneQuery('+230 202 6060')).toBe(true);
  expect(isPhoneQuery('8971')).toBe(true);
  expect(isPhoneQuery('(230) 463-7800')).toBe(true);
  expect(isPhoneQuery('think')).toBe(false);
  expect(isPhoneQuery('MCB 202')).toBe(false);
  expect(isPhoneQuery('12')).toBe(false);
  expect(isPhoneQuery('')).toBe(false);
});
