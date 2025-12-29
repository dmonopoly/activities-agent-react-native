#!/usr/bin/env python3
"""
Create placeholder PNG assets for Expo app.
Run this script from the project root:
    python3 scripts/create-assets.py
"""

import base64
import os

# Minimal 1x1 rose-colored PNG (placeholder)
PNG_DATA = base64.b64decode(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4z8DwHwAFAAH/plvxnQAAAABJRU5ErkJggg=='
)

def main():
    assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets')
    os.makedirs(assets_dir, exist_ok=True)
    
    files = ['icon.png', 'splash-icon.png', 'adaptive-icon.png', 'favicon.png']
    
    for filename in files:
        filepath = os.path.join(assets_dir, filename)
        with open(filepath, 'wb') as f:
            f.write(PNG_DATA)
        print(f'Created: {filepath}')
    
    print('\nPlaceholder assets created! Replace with real icons before production.')

if __name__ == '__main__':
    main()

