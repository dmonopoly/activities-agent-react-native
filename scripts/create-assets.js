#!/usr/bin/env node
/**
 * Creates valid placeholder PNG assets for Expo.
 * Run: node scripts/create-assets.js
 */

const fs = require('fs');
const path = require('path');

// Minimal valid 1x1 rose-colored PNG (base64 encoded)
// This is a valid PNG that Expo can process
const VALID_PNG_BASE64 = 
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8' +
  'z8DwHwAFAAH/plvxnQAAAABJRU5ErkJggg==';

const assetsDir = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const files = ['icon.png', 'splash-icon.png', 'adaptive-icon.png', 'favicon.png'];
const pngBuffer = Buffer.from(VALID_PNG_BASE64, 'base64');

files.forEach(filename => {
  const filepath = path.join(assetsDir, filename);
  fs.writeFileSync(filepath, pngBuffer);
  console.log(`Created: ${filepath}`);
});

console.log('\nPlaceholder assets created!');
console.log('Replace with real icons (1024x1024 for icon/splash, 48x48 for favicon) before production.');

