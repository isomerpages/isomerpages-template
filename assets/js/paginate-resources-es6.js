---
layout: blank
---
"use strict";

var PAGE_SIZE = {{site.paginate}};
var MAX_ADJACENT_PAGE_BTNS = 4;
var MAX_ADJACENT_MOBILE_PAGE_BTNS = 1;
var pageResults = void 0;
var currentPageIndex = 0;
var resourceCardArray = void 0;
var filteredArray = void 0;

paginateResources();

document.getElementById('apply-filter-recent').addEventListener('click', () => applyFilter('Recent'));
document.getElementById('year-filter-mobile').addEventListener('change', (event) => applyFilter(event.target.value));

// Main function to paginate resource page
function paginateResources() {
  resourceCardArray = Array.prototype.slice.call(document.getElementsByClassName("resource-card-element")); // Convert NodeList into Array
  console.log(resourceCardArray)
  // 1. Display the years that are available
  var earliestYear = findEarliestYear();
  var currYear = new Date().getFullYear();
  displayFilterDropdown(earliestYear, currYear);

  var selectedYear = "Recent";
  applyFilter(selectedYear);
}

function applyFilter(selectedYear) {
  hideAllPostsAndPagination();

  // Only keep posts in the selected year
  filteredArray = extractPostsByYear(selectedYear);

  pageResults = splitPages(filteredArray, PAGE_SIZE);
  unhideChunk(currentPageIndex, currentPageIndex);

  var filterDropdownDesktop = document.getElementById('sgds-selector-text-desktop');
  filterDropdownDesktop.innerHTML = selectedYear;

  if (!filteredArray.length || filteredArray.length <= PAGE_SIZE) return;
  displayPagination();
}

function yearHasPosts(year) {
  for (var i = 0; i < resourceCardArray.length; i++) {
    var post = resourceCardArray[i];
    if (Number(post.id) === year) {
      return true;
    }
  }
  return false;
}

function displayFilterDropdown(earliestYear, currYear) {
  var yearFilterDesktop = document.getElementById('year-filter-desktop');
  var yearFilterMobile = document.getElementById('year-filter-mobile');

  for (var year = earliestYear; year <= currYear; year++) {
    if (!yearHasPosts(year)) continue;
    // Creating the select element for mobile view
    var option = document.createElement("option");
    option.value = year;
    option.text = year;
    yearFilterMobile.appendChild(option);

    // Creating the a tags for desktop view
    var a_element = document.createElement("a");
    a_element.id = year;
    a_element.classList.add("sgds-dropdown-item", "padding--top--sm", "padding--bottom--none");
    a_element.onclick = function () {
      var closureYear = year.toString();
      return function () {
        applyFilter(closureYear);
      };
    }();

    yearFilterDesktop.appendChild(a_element);
    var p_element = document.createElement("p");
    p_element.innerHTML = year;
    a_element.appendChild(p_element);
  }
}

function hideAllPostsAndPagination() {
  for (var postIndex = 0; postIndex < resourceCardArray.length; postIndex++) {
    if (!resourceCardArray[postIndex].classList.contains("hide")) {
      resourceCardArray[postIndex].classList.add("hide");
    }
  }

  var paginationElement = document.getElementById("paginator-pages");
  while (paginationElement.firstElementChild) {
    paginationElement.removeChild(paginationElement.firstElementChild);
  }

  document.querySelector(".pagination").style.display = "none";
}

function findEarliestYear() {
  if (resourceCardArray.length === 0) {
    return null;
  }

  var earliestYear = parseInt(resourceCardArray[0].id);
  if (resourceCardArray.length === 1) {
    return earliestYear;
  }

  for (var i = 1; i < resourceCardArray.length; i++) {
    earliestYear = earliestYear < parseInt(resourceCardArray[i].id) ? earliestYear : parseInt(resourceCardArray[i].id);
  }

  return earliestYear;
}

// If the year is set to 'All', return all posts; else filter only the posts in that year
function extractPostsByYear(year) {
  if (year === 'Recent') {
    return resourceCardArray;
  }
  var tempArray = [];

  for (var i = 0; i < resourceCardArray.length; i++) {
    var post = resourceCardArray[i];
    if (post.id === year) {
      tempArray.push(post);
    }
  }

  return tempArray;
}

// Unhide the chunk of resource posts that user wants to see and hides the currently displayed chunk
function unhideChunk(hidePageIndex, unhidePageIndex) {
  for (var cardIndex = 0; cardIndex < pageResults[hidePageIndex].length; cardIndex++) {
    pageResults[hidePageIndex][cardIndex].classList.add("hide");
  }
  for (var cardIndex = 0; cardIndex < pageResults[unhidePageIndex].length; cardIndex++) {
    pageResults[unhidePageIndex][cardIndex].classList.remove("hide");
  }
}

function changePage(curr, index) {
  var prev = document.querySelector("#paginator-pages .selected-page");
  changePageUtil(curr, index);

  // Use the number in the paginated button to figure out current page index and next page index
  var currentIndex = parseInt(prev.innerHTML);
  var selectedIndex = parseInt(curr.innerHTML);
  unhideChunk(currentIndex - 1, selectedIndex - 1);
}