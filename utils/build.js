import fs from 'fs';
import path from 'path';

const BUILD_DIR = path.resolve( 'build' );
fs.mkdirSync( BUILD_DIR, { recursive: true } );

const bundleHeader = `/**
 * VessertID — The Social Media Engine & Creative Asset Architecture
 * Version: 2026.1.0
 * (c) 2026 VessertID Creative Studio
 * All rights reserved.
 */
`;

const filesToBundle = [
	'src/constants.js',
	'src/core/Layer.js',
	'src/core/MediaLayer.js',
	'src/core/TextLayer.js',
	'src/core/SocialCanvas.js',
	'src/loaders/FontLoader.js',
	'src/loaders/AssetLoader.js',
	'src/audio/AudioEngine.js'
];

let moduleCode = bundleHeader + '\n';

for ( const file of filesToBundle ) {

	let content = fs.readFileSync( file, 'utf8' );
	content = content.replace( /import\s+.*?from\s+['"].*?['"];?\n?/g, '' );
	content = content.replace( /export\s*\{[^}]*\};?\n?/g, '' );
	moduleCode += content + '\n';

}

moduleCode += `export { REVISION, AspectRatios, SafeZones, LayerTypes, Layer, MediaLayer, TextLayer, SocialCanvas, FontLoader, AssetLoader, AudioEngine };\n`;

// Generate CJS version
let cjsCode = moduleCode.replace( /export\s+const\s+(\w+)\s*=/g, 'const $1 =' );
cjsCode = cjsCode.replace( /export\s*\{[^}]*\};?\n?/g, '' );
cjsCode += `\nmodule.exports = { REVISION, AspectRatios, SafeZones, LayerTypes, Layer, MediaLayer, TextLayer, SocialCanvas, FontLoader, AssetLoader, AudioEngine };\n`;

fs.writeFileSync( path.join( BUILD_DIR, 'vessertid.module.js' ), moduleCode );
fs.writeFileSync( path.join( BUILD_DIR, 'vessertid.cjs' ), cjsCode );

console.log( 'VessertID distribution bundles successfully built in build/!' );
