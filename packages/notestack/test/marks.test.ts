import { describe, expect, it } from 'vitest';
import { markedLines, plainText } from '../src/config/marks.js';

describe('plainText (name and description outside the hero)', () => {
  it('turns a line break into a space', () => {
    expect(plainText('AWS SAA-C03\nHandbook')).toBe('AWS SAA-C03 Handbook');
  });

  it('drops the accent marks and keeps the words', () => {
    expect(plainText('Publish a site that reads *beautifully*.')).toBe('Publish a site that reads beautifully.');
    expect(plainText('发布一个*读起来舒服*的网站。')).toBe('发布一个读起来舒服的网站。');
  });

  it('leaves text without marks as it is', () => {
    expect(plainText('Networking Notes')).toBe('Networking Notes');
  });

  it('keeps a lone asterisk', () => {
    expect(plainText('5 * 3 = 15')).toBe('5 * 3 = 15');
  });
});

describe('markedLines (name and description in the hero)', () => {
  it('splits lines at the line break', () => {
    expect(markedLines('AWS SAA-C03\nHandbook')).toEqual([
      [{ text: 'AWS SAA-C03', accent: false }],
      [{ text: 'Handbook', accent: false }],
    ]);
  });

  it('marks the accented words', () => {
    expect(markedLines('Associate *(SAA-C03)* exam')).toEqual([
      [
        { text: 'Associate ', accent: false },
        { text: '(SAA-C03)', accent: true },
        { text: ' exam', accent: false },
      ],
    ]);
  });

  it('works with both marks together', () => {
    expect(markedLines('AWS SAA-C03\n*Handbook*')).toEqual([
      [{ text: 'AWS SAA-C03', accent: false }],
      [{ text: 'Handbook', accent: true }],
    ]);
  });

  it('gives plain text as one line with one part', () => {
    expect(markedLines('Networking Notes')).toEqual([[{ text: 'Networking Notes', accent: false }]]);
  });
});
