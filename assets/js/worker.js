onmessage = async function(event) {
	if( 'function' !== typeof importScripts) return
	const scriptUrl = 'https://unpkg.com/lunr/lunr.js';
  const integrityHash = 'sha256-lDFybwXA6uKm5U3Bl3CUIoafJcrUTyQw0vt92ugMxxc=';

	try {
		await fetch(scriptUrl, { integrity: integrityHash });
	} catch (err) {
		console.log(err)
		return
	}
	// We use fetch only to verify integrity - we still use importScripts to avoid inline script
	importScripts(scriptUrl);

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