var data = {
  resource_id: 'a41ce851-728e-4d65-8dc5-e0515a01ff31', // the resource id
  limit: 5,
  q: 'tan' // query for 'jones'
};

var request = $.ajax({
  url: 'https://data.gov.sg/api/action/datastore_search',
  data: data,
  dataType: 'json',
});

request.done(function(data){
	var fieldArray = remove(data.result.fields, ["_id", "_full_count", "rank"])
	console.log(fieldArray);

  	var resultString = "<table class=\"table-h\"><tr>";
  	for (index in data.result.records) {
  		console.log(data.result.records[index])
  		resultString += '<tr>'
  		for (fieldArrayIndex in fieldArray) {
  			var fieldId = fieldArray[fieldArrayIndex].id;
  			resultString += '<td>' + data.result.records[index][fieldId] + '</td>';
  		}
  		resultString += '</tr>'
  	}
  	resultString += '</table>'
  	document.getElementsByClassName("content")[0].innerHTML = resultString;
});

function remove(array, elements) {
	return array.filter(e => !elements.includes(e.id));
}