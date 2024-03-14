---
layout: blank
---
'use strict';

const PAGINATION_DISPLAY_RESULTS_PER_PAGE = 10; // Must be smaller than size of datagov pagination (100)
const DATAGOV_API_RESULTS_PER_PAGE = 100; // Fixed by datagov
var MAX_ADJACENT_PAGE_BTNS = 2;
var MAX_ADJACENT_MOBILE_PAGE_BTNS = 1;
var pageResults = [];
var fieldArray = void 0;
var startIndex = 0;
const defaultFieldElement = document.getElementById('default-field');
const defaultField = defaultFieldElement ? defaultFieldElement.getAttribute('data-title') : "";

var datagovsgOffset = 0;
// The datagovsg API only retrieves 100 rows at a go.
// If users want to view more than 100 rows, we need to call the
// API with an offset to obtain the right slice of data.

var datagovsgTotal = void 0; // The total number of rows of data in the datagovsg API

var currentPageIndex = 0;

var searchTerm = getQueryVariable('query');
var searchField = getQueryVariable('field');
var hasPopulatedFields = false
if (!searchTerm || searchTerm === ' ') {
  searchTerm = '';
}
else {
  document.getElementById("search-box-datagovsg").value = searchTerm;
}
if (!searchField) {
  searchField = ''
} else {
  document.getElementById("field-selector-desktop").value = searchField;
}
databaseSearch(searchTerm, startIndex, searchField);

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] === variable) {
      var dirtyString = decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      return DOMPurify.sanitize(dirtyString, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    }
  }
}

function getOffset(pageIndex) {
  // Retrieves the offset required for the first item in the page
  // pageIndex is 0-indexed
  const firstElemIndex = pageIndex * PAGINATION_DISPLAY_RESULTS_PER_PAGE
  const offsetRequired = Math.floor(firstElemIndex / DATAGOV_API_RESULTS_PER_PAGE) * DATAGOV_API_RESULTS_PER_PAGE
  return offsetRequired
}

function deslugify(str) {
  return str.split(/_| /).map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")
}

function databaseSearch(searchTerm, index, callback) {
  const isFirstRender = pageResults.length === 0
  const resourceId = document.getElementById("resourceId").innerHTML;
  const offset = getOffset(index)
  var data = {
    resource_id: resourceId, // the resource id
    offset
  };

  // columnMetadata:
  //   id: represents searchable field
  //   title: represents human readable field
  let request, columnMetadata
  let formattedSearchField = searchField ? searchField.replace(" ", "_") : ""
  if (!!defaultField) {
    // Datagov-v2 search - query for dataset metadata first to retrieve column info
    request = $.ajax({
      url: `https://api-production.data.gov.sg/v2/public/api/datasets/${resourceId}/metadata`,
      dataType: 'json'
    }).then((resp) => {
      const respData = Object.values(resp.data.columnMetadata.metaMapping)
      columnMetadata = respData.map(item => ({
        id: item.name,
        title: item.columnTitle
      }))
      if (formattedSearchField) {
        const filteredSearchColumn = columnMetadata.filter((col) => col.title.toLowerCase() === formattedSearchField.toLowerCase())
        formattedSearchField = filteredSearchColumn[0].id
        data.q = JSON.stringify({[formattedSearchField]: searchTerm})
      } else {
        data.q = searchTerm
      }
      return $.ajax({
        url: 'https://data.gov.sg/api/action/datastore_search',
        data: data,
        dataType: 'json',
        success: callback
      })
    })
    
  } else {
    data.q = searchTerm
    request = $.ajax({
      url: 'https://data.gov.sg/api/action/datastore_search',
      data: data,
      dataType: 'json',
      success: callback
    });
  }
  

  request.done(function (data) {
    datagovsgTotal = data.result.total;
    if (!columnMetadata) {
      // V1 search, id and title are the same
      columnMetadata = data.result.fields.map(field => ({
        id: field.id,
        title: field.id,
      }))
    }
    if (isFirstRender) {
      pageResults = Array(Math.ceil(datagovsgTotal / PAGINATION_DISPLAY_RESULTS_PER_PAGE)).fill(null);
    } else {
      // Delay loading spinner disappearing for first render
      document.getElementById("loading-spinner").style.display = 'none';
    }

    // The fieldArray is the array containing the field names in the data.gov.sg table
    const removableFields = ["_id", "_full_count", "rank", `rank ${formattedSearchField}`]
    fieldArray = remove(columnMetadata, removableFields);
    const pageResultArray = splitPages(data.result.records, PAGINATION_DISPLAY_RESULTS_PER_PAGE)
    const startingPage = offset / PAGINATION_DISPLAY_RESULTS_PER_PAGE
    const possibleSearchField = formattedSearchField || defaultField
    if (!hasPopulatedFields && possibleSearchField) {
      displaySearchFilterDropdown(fieldArray, possibleSearchField);
      hasPopulatedFields = true
    }
    pageResultArray.forEach((pageData, idx) => {
      pageResults[startingPage + idx] = pageData
    })
    if (isFirstRender) {
      // Also preload the last set of pages if applicable
      const finalPage = Math.ceil(datagovsgTotal / PAGINATION_DISPLAY_RESULTS_PER_PAGE) - 1
      const renderDisplay = () => {
        document.getElementById("loading-spinner").style.display = 'none';
        displayTable(pageResults[currentPageIndex], fieldArray);
        if (pageResults.length === 0) return;
        displayPagination(index);
      }
      if (getOffset(finalPage) !== 0) {
        databaseSearch(searchTerm, finalPage, renderDisplay)
      } else {
        renderDisplay()
      }
    }
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
    var fieldId = fields[fieldIndex].title;
    resultString += '<td><h6 class=\"margin--none\"><b>' + fieldId.replace(/_/g, ' ').toUpperCase() + '</b></h6></td>';
  }
  resultString += '</tr>';

  for (var chunkIndex = 0; chunkIndex < chunk.length; chunkIndex++) {
    resultString += '<tr>';
    for (var fieldIndex in fields) {
      var _fieldId = fields[fieldIndex].id;
      resultString += '<td><h6 class=\"margin--none datagov-search-element\">' + chunk[chunkIndex][_fieldId] + '</h6></td>';
    }
    resultString += '</tr>';
  }
  resultString += '</table></div>';

  document.getElementsByClassName("content")[0].innerHTML = DOMPurify.sanitize(resultString);
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

function displaySearchFilterDropdown(fields, startingField) {
  var fieldFilterDesktop = document.getElementById('field-filter-desktop');
  var fieldFilterMobile = document.getElementById('field-filter-mobile');

  for (let fieldMetadata of fields) {
    const field = deslugify(fieldMetadata.title)
    const deslugifiedStartingField = deslugify(startingField)
    // Creating the select element for mobile view
    var option = document.createElement("option");
    option.value = field;
    option.text = field;
    if (field === deslugifiedStartingField) option.selected = true
    fieldFilterMobile.appendChild(option);

    // Creating the a tags for desktop view
    var a_element = document.createElement("a");
    a_element.id = field;
    a_element.classList.add("bp-dropdown-item", "py-0");
    a_element.onclick = function () {
      return function () {
        var filterDropdownDesktop = document.getElementById('field-selector-desktop');
        filterDropdownDesktop.value = field;
      };
    }();
    if (field === deslugifiedStartingField) {
      var filterDropdownDesktop = document.getElementById('field-selector-desktop');
      filterDropdownDesktop.value = field;
    }

    fieldFilterDesktop.appendChild(a_element);
    var p_element = document.createElement("p");
    p_element.innerHTML = field.replace("_", " ");
    p_element.classList.add("is-size-6")
    a_element.appendChild(p_element);
  }
}

// Populate the pagination elements
function displayPagination(index) {
  document.querySelector(".pagination").style.display = "flex";
  var pagination = document.getElementById('paginator-pages');
  const paginationMobile = document.getElementById('paginator-pages-mobile')
  const totalPages = Math.ceil(datagovsgTotal / PAGINATION_DISPLAY_RESULTS_PER_PAGE)

  for (var i = 0; i < totalPages; i++) {
    var ele = document.createElement("span");
    var text = document.createTextNode(i + 1);
    ele.appendChild(text);
    ele.onclick = function () {
      var index = i;
      return function (e) {
        changePage(e.target, index);
      };
    }();
    pagination.appendChild(ele);
  }

  // Create page display for mobile
  if (paginationMobile) {
    const ele = document.createElement("span")
    const text = document.createTextNode(`Page ${index}`)
    ele.classList.add("is-full-height", "is-full-width", "remove-border")
    ele.style.width = "100%"
    ele.appendChild(text)
    paginationMobile.appendChild(ele)
  }
  
  // Initialise selected page and nav arrows
  setCurrentPage(pagination.childNodes[index]);
  displayNavArrows(currentPageIndex);
  setNavArrowHandlers();
}

function changePage(curr, index) {
  if (shouldCallAPI(index)) {
    datagovsgOffset += 100;
    databaseSearch(searchTerm, index, searchField);
  }
  // Always also look 5 pages ahead and behind
  const forwardIndex = index + 5
  const backwardIndex = index - 5
  if (shouldCallAPI(forwardIndex)) {
    databaseSearch(searchTerm, forwardIndex);
  }
  if (shouldCallAPI(backwardIndex)) {
    databaseSearch(searchTerm, backwardIndex);
  }

  changePageUtil(curr, index);
  displayTable(pageResults[currentPageIndex], fieldArray);
}

// Evaluates to true if we should call the datagovsg API
function shouldCallAPI(index) {
  if (pageResults[index] !== null) return false
  if (index < 0) return false
  if (index > datagovsgTotal / PAGINATION_DISPLAY_RESULTS_PER_PAGE) return false
  return true
}
