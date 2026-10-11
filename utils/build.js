import fs from 'fs';
import path from 'path';

const BUILD_DIR = path.resolve('build');
fs.mkdirSync(BUILD_DIR, { recursive: true });

const bundleHeader = `/**
 * VessertID — The Social Media Engine & Creative Asset Architecture
 * Version: 2026.1.0
 * (c) 2026 VessertID Creative Studio. Released under MIT License.
 * Architecture inspired by Three.js by Mr. Doob
 */
`;

const srcFiles = [
  'src/constants/SocialPresets.js',
  'src/core/Layer.js',
  'src/core/Canvas.js',
  'src/audio/SoundEngine.js',
  'src/typography/FontManager.js'
];

let moduleCode = bundleHeader + '\n';
let cjsCode = bundleHeader + '\n';

for (const file of srcFiles) {
  let content = fs.readFileSync(file, 'utf8');
  // Strip relative imports for single bundle
  content = content.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');
  moduleCode += content + '\n';
}

moduleCode += `export const REVISION = '2026.1';\n`;

// Also generate CJS version
cjsCode = moduleCode.replace(/export\s+const\s+(\w+)\s*=/g, 'const $1 =');
cjsCode = cjsCode.replace(/export\s+class\s+(\w+)/g, 'class $1');
cjsCode += `\nmodule.exports = { AspectRatios, SafeZones, LayerTypes, Layer, ImageLayer, TextLayer, SocialCanvas, SoundEngine, FontManager, REVISION };\n`;

fs.writeFileSync(path.join(BUILD_DIR, 'vessertid.module.js'), moduleCode);
fs.writeFileSync(path.join(BUILD_DIR, 'vessertid.cjs'), cjsCode);

console.log('Successfully built VessertID distributions in build/!');
