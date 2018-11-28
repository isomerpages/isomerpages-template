---
---
const RESULTS_PER_PAGE = 10;
const MAX_ADJACENT_PAGE_BTNS = 2;
const MAX_ADJACENT_MOBILE_PAGE_BTNS = 1;
let pageResults;
let fieldArray;
let currentPageIndex = 0;

var searchTerm = getQueryVariable('query');
if (searchTerm) {
  databaseSearch(searchTerm);
} else {
  databaseSearch('');
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] === variable) {
      const dirtyString = decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      return DOMPurify.sanitize(dirtyString, {ALLOWED_TAGS: [], ALLOWED_ATTR: []});
    }
  }
}

function databaseSearch(searchTerm){
  var data = {
    resource_id: resourceId, // the resource id
    q: searchTerm
  };

  var request = $.ajax({
    url: 'https://data.gov.sg/api/action/datastore_search',
    data: data,
    dataType: 'json',
  });

  request.done(function(data){
    document.getElementById("loading-spinner").style.display = 'none';
    hideAllPostsAndPagination();
    fieldArray = remove(data.result.fields, ["_id", "_full_count", "rank"])
    pageResults = splitPages(data.result.records, RESULTS_PER_PAGE);
    displayTable(pageResults[currentPageIndex], fieldArray);
    if (!pageResults || data.result.records.length < RESULTS_PER_PAGE) return;
    displayPagination();
  });
}

function displayTable(chunk, fields) {
  if (!chunk || chunk.length === 0) {
    document.getElementsByClassName("content")[0].innerHTML = '<center>No results found</center>';
    return;
  }

  var resultString = "<table class=\"table-h\"><tr>";
  for (fieldIndex in fields) {
    var fieldId = fields[fieldIndex].id;
    resultString += '<td><b>' + fieldId.replace(/_/g, ' ').toUpperCase() + '</b></td>';
  }
  resultString += '</tr>'

  for (var chunkIndex = 0; chunkIndex < chunk.length; chunkIndex++) {
    resultString += '<tr>'
    for (fieldIndex in fields) {
      var fieldId = fields[fieldIndex].id;
      resultString += '<td>' + chunk[chunkIndex][fieldId] + '</td>';
    }
    resultString += '</tr>'
  }
  resultString += '</table>'

  document.getElementsByClassName("content")[0].innerHTML = resultString;
  document.getElementsByClassName("content")[0].style.display = 'block';

}

function hideAllPostsAndPagination() {

  var paginationElement = document.getElementById("paginator-pages");
  while (paginationElement.firstChild) {
      paginationElement.removeChild(paginationElement.firstChild);
  }

  document.querySelector(".pagination").style.display = "none";
}

function remove(array, elements) {
	return array.filter(e => !elements.includes(e.id));
}

// Populate the pagination elements
function displayPagination() {
  document.querySelector(".pagination").style.display = "flex";
  var pagination = document.getElementById('paginator-pages');

  for (let i = 0; i < pageResults.length; i++) {
    let ele = document.createElement("span");
    let text = document.createTextNode(i + 1);
    
    ele.appendChild(text);
    ele.onclick = function(e) {
      changePage(e.target, i)
    }
    pagination.appendChild(ele);
  }

  // Initialise selected page and nav arrows
  setCurrentPage(pagination.firstChild);
  displayNavArrows(currentPageIndex);
  setNavArrowHandlers();
}

function changePage(curr, index) {
  changePageUtil(curr, index);
  displayTable(pageResults[currentPageIndex], fieldArray);
}
