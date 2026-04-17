import { lightTheme, darkTheme, palette, touchTarget } from '../lib/theme';

describe('theme', () => {
  it('hat Petrol-Teal als Primärfarbe im Light-Theme', () => {
    expect(lightTheme.primary).toBe(palette.brand[700]);
    expect(lightTheme.primary).toBe('#0F766E');
  });

  it('hat Warm Orange als Akzentfarbe', () => {
    expect(lightTheme.accent).toBe('#F97316');
  });

  it('Dark-Theme nutzt helleren Brand-Ton für Kontrast', () => {
    expect(darkTheme.primary).toBe(palette.brand[400]);
  });

  it('Touch-Target min. 48dp (A11y)', () => {
    expect(touchTarget.min).toBeGreaterThanOrEqual(48);
  });
});
