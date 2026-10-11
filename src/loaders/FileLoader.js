import { Loader } from './Loader.js';

class FileLoader extends Loader {
	async load( url ) {
		const fullUrl = this.path + url;
		const resp = await fetch( fullUrl );
		if ( ! resp.ok ) throw new Error( `FileLoader: ${resp.status} ${resp.statusText}` );
		return await resp.text();
	}
}

export { FileLoader };
