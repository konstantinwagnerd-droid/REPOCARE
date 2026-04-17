# Assets

## Icons

- `icon.svg` — Quell-Icon (Brand-Petrol + Orange-Akzent).
- `icon.png` / `splash.png` werden aus dem SVG generiert, z. B.:

```bash
# ImageMagick
magick icon.svg -resize 1024x1024 icon.png
magick -size 1242x2436 xc:#0F766E splash.png
# oder via expo-cli:
npx expo-optimize
```

Bis PNGs generiert sind, wird `splash.png` automatisch aus der `app.json`
`backgroundColor` als solider Brand-Teal-Screen gerendert.

## Fonts

Geist Sans ist über `expo-font` ladbar. Fallback: System.
