var data = {
  resource_id: 'a41ce851-728e-4d65-8dc5-e0515a01ff31', // the resource id
  limit: 5,
  q: 'tan' // query for 'jones'
};
$.ajax({
  url: 'https://data.gov.sg/api/action/datastore_search',
  data: data,
  dataType: 'json',
  success: function(data) {
  	console.log(data.result);

  	var resultString = "";
  	for (index in data.result.records) {
  		console.log(data.result.records[index])
  		resultString += data.result.records[index];
  	}
  	document.getElementsByClassName("content")[0].innerHTML = resultString;
  }
});
