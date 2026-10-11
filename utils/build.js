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

function collectFiles( dir ) {
	let results = [];
	const list = fs.readdirSync( dir );
	for ( const file of list ) {
		const full = path.join( dir, file );
		const stat = fs.statSync( full );
		if ( stat.isDirectory() ) {
			results = results.concat( collectFiles( full ) );
		} else if ( file.endsWith( '.js' ) && ! [ 'VessertID.js', 'VessertID.Core.js', 'index.js' ].includes( file ) ) {
			results.push( full );
		}
	}
	return results;
}

const allSrcFiles = collectFiles( path.resolve( 'src' ) );

let moduleCode = bundleHeader + '\n';

for ( const file of allSrcFiles ) {
	let content = fs.readFileSync( file, 'utf8' );
	content = content.replace( /import\s+.*?from\s+['"].*?['"];?\n?/g, '' );
	content = content.replace( /export\s*\{[^}]*\};?\n?/g, '' );
	content = content.replace( /export\s+default\s+.*?;?\n?/g, '' );
	moduleCode += `// [${path.relative('src', file)}]\n` + content + '\n\n';
}

// Read exports from src/VessertID.js
const mainVessert = fs.readFileSync( path.resolve( 'src/VessertID.js' ), 'utf8' );
const exportMatches = mainVessert.match( /export\s*\{([^}]+)\}/g ) || [];
let allExportedSymbols = new Set();
for ( const m of exportMatches ) {
	const inner = m.replace( /export\s*\{/, '' ).replace( /\}/, '' );
	inner.split( ',' ).forEach( s => allExportedSymbols.add( s.trim() ) );
}
allExportedSymbols.add( 'REVISION' );

const exportList = Array.from( allExportedSymbols ).filter( Boolean ).join( ', ' );
moduleCode += `export { ${exportList} };\n`;

// Generate CJS
let cjsCode = moduleCode.replace( /export\s+const\s+(\w+)\s*=/g, 'const $1 =' );
cjsCode = cjsCode.replace( /export\s*\{[^}]*\};?\n?/g, '' );
cjsCode += `\nmodule.exports = { ${exportList} };\n`;

fs.writeFileSync( path.join( BUILD_DIR, 'vessertid.module.js' ), moduleCode );
fs.writeFileSync( path.join( BUILD_DIR, 'vessertid.cjs' ), cjsCode );

console.log( `Successfully compiled ${allSrcFiles.length} source modules into build/vessertid.module.js & build/vessertid.cjs!` );
