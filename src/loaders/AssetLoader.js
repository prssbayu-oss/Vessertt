/**
 * AssetLoader fetches JSON metadata, color palettes, and manifests.
 */
class AssetLoader {

	constructor() {

		this.cache = new Map();

	}

	async loadJSON( url ) {

		if ( this.cache.has( url ) ) {

			return this.cache.get( url );

		}

		const response = await fetch( url );

		if ( ! response.ok ) {

			throw new Error( `AssetLoader: HTTP ${response.status} loading ${url}` );

		}

		const data = await response.json();
		this.cache.set( url, data );
		return data;

	}

	async loadText( url ) {

		const response = await fetch( url );
		return await response.text();

	}

}

export { AssetLoader };
