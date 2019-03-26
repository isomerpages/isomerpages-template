(function() {
  var json_data = '';

  if (window.Worker) {
    var indexBuilderWorker = new Worker('../assets/js/worker.js');

    indexBuilderWorker.onmessage = function(event) {
      var json_data = event.data;
      runSearch(json_data, posts_json);
    }

    indexBuilderWorker.postMessage(posts_json);
  }
})();
