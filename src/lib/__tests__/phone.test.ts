import { dialNumber, formatPhone } from '../phone';

test('formats Mauritian mobile and landline numbers', () => {
  expect(formatPhone('+23052568074')).toBe('+230 5256 8074');
  expect(formatPhone('+2302026060')).toBe('+230 202 6060');
  expect(formatPhone('+230 202 6060')).toBe('+230 202 6060');
});

test('leaves short and unknown numbers alone', () => {
  expect(formatPhone('8971')).toBe('8971');
  expect(formatPhone('')).toBe('');
});

test('dial number keeps + and digits only', () => {
  expect(dialNumber('+230 5256 8074')).toBe('+23052568074');
});
