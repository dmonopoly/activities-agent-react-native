# Required Assets

This folder should contain the following image assets:

## Required Files

1. **icon.png** (1024x1024)
   - App icon for iOS and Android
   - Solid background recommended

2. **splash-icon.png** (1024x1024)
   - Splash screen icon
   - Will be centered on splash background

3. **adaptive-icon.png** (1024x1024)
   - Android adaptive icon foreground
   - Include padding for safe area

4. **favicon.png** (48x48)
   - Web browser favicon

## Quick Setup

For development, you can create simple placeholder images:

```bash
# Using ImageMagick
convert -size 1024x1024 xc:#F43F5E -fill white -pointsize 200 \
  -gravity center -annotate 0 "AA" icon.png
cp icon.png splash-icon.png
cp icon.png adaptive-icon.png
convert -size 48x48 xc:#F43F5E -fill white -pointsize 20 \
  -gravity center -annotate 0 "AA" favicon.png
```

Or download Expo's default assets and customize them.
