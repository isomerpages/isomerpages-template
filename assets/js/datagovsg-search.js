---
---
'use strict';

var RESULTS_PER_PAGE = 10;
var MAX_ADJACENT_PAGE_BTNS = 2;
var MAX_ADJACENT_MOBILE_PAGE_BTNS = 1;
var pageResults = [];
var fieldArray = void 0;
var startIndex = 0;

var datagovsgOffset = 0;
// The datagovsg API only retrieves 100 rows at a go.
// If users want to view more than 100 rows, we need to call the
// API with an offset to obtain the right slice of data.

var datagovsgTotal = void 0; // The total number of rows of data in the datagovsg API

var currentPageIndex = 0;

var searchTerm = getQueryVariable('query');
if (!searchTerm || searchTerm === ' ') {
  searchTerm = '';
}
databaseSearch(searchTerm, startIndex);

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] === variable) {
      var dirtyString = decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      console.log(DOMPurify.sanitize(dirtyString, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }))
      return DOMPurify.sanitize(dirtyString, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    }
  }
}

function databaseSearch(searchTerm, index) {
  var data = {
    resource_id: resourceId, // the resource id
    offset: datagovsgOffset
  };

  if (searchTerm !== '') {
    data.q = searchTerm;
  }

  var request = $.ajax({
    url: 'https://data.gov.sg/api/action/datastore_search',
    data: data,
    dataType: 'json'
  });

  request.done(function (data) {
    document.getElementById("loading-spinner").style.display = 'none';
    hideAllPostsAndPagination();

    // The fieldArray is the array containing the field names in the data.gov.sg table
    fieldArray = remove(data.result.fields, ["_id", "_full_count", "rank"]);
    pageResults = pageResults.concat(splitPages(data.result.records, RESULTS_PER_PAGE));
    datagovsgTotal = data.result.total;
    displayTable(pageResults[currentPageIndex], fieldArray);
    if (!pageResults || pageResults.length <= 1) return;
    displayPagination(index);
  })
  .fail(function () { // Displays no results if the AJAX call fails
    document.getElementById("loading-spinner").style.display = 'none';
    hideAllPostsAndPagination();
    displayTable(null, []);
  })
}

function displayTable(chunk, fields) {
  if (!chunk || chunk.length === 0) {
    document.getElementsByClassName("content")[0].innerHTML = '<center>No results found</center>';
    document.getElementsByClassName("content")[0].style.display = 'block';
    return;
  }

  var resultString = "<div><table class=\"table-h\"><tr>";
  for (var fieldIndex in fields) {
    var fieldId = fields[fieldIndex].id;
    resultString += '<td><h6 class=\"margin--none\"><b>' + fieldId.replace(/_/g, ' ').toUpperCase() + '</b></h6></td>';
  }
  resultString += '</tr>';

  for (var chunkIndex = 0; chunkIndex < chunk.length; chunkIndex++) {
    resultString += '<tr>';
    for (var fieldIndex in fields) {
      var _fieldId = fields[fieldIndex].id;
      resultString += '<td><h6 class=\"margin--none\">' + chunk[chunkIndex][_fieldId] + '</h6></td>';
    }
    resultString += '</tr>';
  }
  resultString += '</table></div>';

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
  return array.filter(function (e) {
    return !elements.includes(e.id);
  });
}

// Populate the pagination elements
function displayPagination(index) {
  document.querySelector(".pagination").style.display = "flex";
  var pagination = document.getElementById('paginator-pages');

  for (var i = 0; i < pageResults.length; i++) {
    var ele = document.createElement("span");
    var text = document.createTextNode(i + 1);
    ele.appendChild(text);
    ele.onclick = function () {
      var index = i;
      return function (e){
        changePage(e.target, index);
      };
    }();
    pagination.appendChild(ele);
  }

  // Initialise selected page and nav arrows
  setCurrentPage(pagination.childNodes[index]);
  displayNavArrows(currentPageIndex);
  setNavArrowHandlers();
}

function changePage(curr, index) {
  if (shouldCallAPI(index)) {
    datagovsgOffset += 100;
    databaseSearch(searchTerm, index);
  }

  changePageUtil(curr, index);
  displayTable(pageResults[currentPageIndex], fieldArray);
}

// Evaluates to true if we should call the datagovsg API for the 
// next 100 rows of data
function shouldCallAPI(index) {
  // Checks to make sure that the last digit of the page number is greater than 5.
  // i.e. we should call the API for the next 100 rows if the user is currently at 
  // page number 26.
  // Note: the index starts from 0, so a page index of 14 corresponds to a page number of 15.
  if (index % 10 < 4) return false;

  // Makes sure that there is more data to be retrieved from the API.
  if (datagovsgOffset + 100 > datagovsgTotal) return false;

  // Makes sure that we haven't already called the API for the next 100 rows.
  if (index * RESULTS_PER_PAGE < datagovsgOffset) return false;

  return true;
}