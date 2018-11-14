---
---
let CHUNK_SIZE = 10;
let chunkArray;
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
    chunkArray = splitPages(data.result.records, CHUNK_SIZE);
    displayTable(chunkArray[currentPageIndex], fieldArray);
    if (!chunkArray || data.result.records.length < CHUNK_SIZE) return;
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
  document.querySelector(".pagination").style.display = "block";
  var pagination = document.getElementById('paginator-pages');

  for (let i = 0; i < chunkArray.length; i++) {
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
  let prev = document.querySelector("#paginator-pages .selected-page");
  prev.className = "";
  prev.style.pointerEvents = "auto";
  currentPageIndex = index;
  setCurrentPage(curr);
  displayNavArrows(index);

  // Use the number in the paginated button to figure out next page index
  var selectedIndex = parseInt(curr.innerHTML);
  displayTable(chunkArray[selectedIndex-1], fieldArray);
}

// Set click handlers for nav arrows
function setNavArrowHandlers() {
  let left = document.querySelector(".pagination .sgds-icon.sgds-icon-arrow-left");
  let right = document.querySelector(".pagination .sgds-icon.sgds-icon-arrow-right");
  let sel = document.querySelector("#paginator-pages .selected-page");

  left.onclick = function(e) {
    let sel = document.querySelector("#paginator-pages .selected-page");
    changePage(sel.previousSibling, currentPageIndex - 1)
  }

  right.onclick = function(e) {
    let sel = document.querySelector("#paginator-pages .selected-page");
    changePage(sel.nextSibling, currentPageIndex + 1)
  }
}

function displayNavArrows(i) {
  let left = document.querySelector(".pagination .sgds-icon.sgds-icon-arrow-left");
  let right = document.querySelector(".pagination .sgds-icon.sgds-icon-arrow-right");

  if (i === 0) {
    left.classList.add("sgds-icon-disabled");
  } else {
    left.classList.remove("sgds-icon-disabled");
  }
  if (i === chunkArray.length - 1) {
    right.classList.add("sgds-icon-disabled")
  } else {
    right.classList.remove("sgds-icon-disabled");
  }
}

function setCurrentPage(ele) {
  ele.className = "selected-page";
  ele.style.pointerEvents = "none";
}

function splitPages(resourceCardArray, pageSize) {
  var tempArray = [];

  for (let i = 0; i < resourceCardArray.length; i += pageSize) {
      var chunk = resourceCardArray.slice(i, i + pageSize);
      tempArray.push(chunk);
  }

  return tempArray;
}