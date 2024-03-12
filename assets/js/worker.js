
let loaded = false;

async function loadcontext() {
	if (loaded) return;
	if( 'function' !== typeof importScripts) throw new Error("Unable to load context")
	const scriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/lunr.js/2.3.9/lunr.min.js';
	const integrityHash = 'sha512-4xUl/d6D6THrAnXAwGajXkoWaeMNwEKK4iNfq5DotEbLPAfk6FSxSP3ydNxqDgCw1c/0Z1Jg6L8h2j+++9BZmg=='; // retrieved from cdnjs

	await fetch(scriptUrl, { integrity: integrityHash });
	// We use fetch only to verify integrity - we still use importScripts to avoid inline script
	importScripts(scriptUrl);

	loaded = true;
}

onmessage = async function(event) {
	try {
		await loadcontext();
	} catch (err) {
		console.log(err)
		return
	}

	var documents = event.data;

	var index = lunr(function () {
		this.ref('id');
		this.field('url');
		this.field('title');
		this.field('content');
		this.metadataWhitelist = ['position'];

		documents.forEach(function(doc) {
			this.add(doc);
		}, this);
	});

	postMessage(JSON.stringify(index));
}