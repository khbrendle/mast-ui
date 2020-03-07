import App from './App.svelte';
import { ObjectCache } from "./utils/object_cache.js"

// initialize session storage
sessionStorage.setItem('databaseCache', JSON.stringify(new ObjectCache()));
sessionStorage.setItem('tableCache', JSON.stringify(new ObjectCache()));
sessionStorage.setItem('fieldCache', JSON.stringify(new ObjectCache()));

const app = new App({
	target: document.body
	// hydrate: true
});

export default app;
