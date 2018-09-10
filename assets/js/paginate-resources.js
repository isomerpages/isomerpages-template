---
---

let PAGE_SIZE = {{site.paginate}};
let chunkArray;
let currentPageIndex = 0;
let resourceCardArray;
let filteredArray;

paginateResources();

// Main function to paginate resource page
function paginateResources() {
  resourceCardArray = Array.from(document.getElementsByClassName("resource-card-element")); // Convert NodeList into Array
  
  // 1. Display the years that are available
  var earliestYear = findEarliestYear();
  var currYear = (new Date()).getFullYear();
  displayFilterDropdown(earliestYear, currYear);

  var selectedYear = "Recent";
  applyFilter(selectedYear);
}

function applyFilter(selectedYear) {
  hideAllPostsAndPagination();

  // Only keep posts in the selected year
  filteredArray = extractPostsByYear(selectedYear);

  chunkArray = splitPages(filteredArray, PAGE_SIZE);
  unhideChunk(currentPageIndex, currentPageIndex);

  var filterDropdownDesktop = document.getElementById('sgds-selector-text-desktop');
  filterDropdownDesktop.innerHTML = selectedYear;

  if (!filteredArray.length || filteredArray.length <= PAGE_SIZE) return;
  displayPagination();
}

function displayFilterDropdown(earliestYear, currYear) {
  var yearFilterDesktop = document.getElementById('year-filter-desktop');
  var yearFilterMobile = document.getElementById('year-filter-mobile');

  for (var year = earliestYear; year <= currYear; year++) {
    // Creating the select element for mobile view
    var option = document.createElement("option");
    option.value = year;
    option.text = year;
    yearFilterMobile.appendChild(option);

    // Creating the a tags for desktop view
    var a_element = document.createElement("a");
    a_element.id = year;
    a_element.classList.add("bp-dropdown-item", "padding--top--sm", "padding--bottom--none");
    a_element.onclick = function(){
        var closureYear = year.toString();
        return function(){applyFilter(closureYear);}
    }();

    yearFilterDesktop.appendChild(a_element);
    var p_element = document.createElement("p");
    p_element.innerHTML = year;
    a_element.appendChild(p_element);
  }
}

function hideAllPostsAndPagination(){
  for (let postIndex = 0; postIndex < resourceCardArray.length; postIndex ++) {
      if (!resourceCardArray[postIndex].classList.contains("hide")) {
        resourceCardArray[postIndex].classList.add("hide");
      }
  }

  var paginationElement = document.getElementById("paginator-pages");
  while (paginationElement.firstChild) {
      paginationElement.removeChild(paginationElement.firstChild);
  }

  document.querySelector(".pagination").style.display = "none";
}

function findEarliestYear() {
  if (resourceCardArray.length === 0) { return null; }

  var earliestYear = parseInt(resourceCardArray[0].id);
  if (resourceCardArray.length === 1) { return earliestYear; }

  for (let i = 1; i < resourceCardArray.length; i++) {
    earliestYear = (earliestYear < parseInt(resourceCardArray[i].id) ? earliestYear : parseInt(resourceCardArray[i].id));
  }

  return earliestYear;

}

// If the year is set to 'All', return all posts; else filter only the posts in that year
function extractPostsByYear(year){
  if (year === 'Recent'){
    return resourceCardArray;
  }
  var tempArray = [];

  for (let i = 0; i < resourceCardArray.length; i++) {
      var post = resourceCardArray[i];
      if (post.id === year){
        tempArray.push(post);
      }
  }

  return tempArray;
}

// Unhide the chunk of resource posts that user wants to see and hides the currently displayed chunk
function unhideChunk(hidePageIndex, unhidePageIndex){
  for (var cardIndex = 0; cardIndex < chunkArray[hidePageIndex].length; cardIndex++){
    chunkArray[hidePageIndex][cardIndex].classList.add("hide");
  }
  for (var cardIndex = 0; cardIndex < chunkArray[unhidePageIndex].length; cardIndex++){
    chunkArray[unhidePageIndex][cardIndex].classList.remove("hide");
  }
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

  // Use the number in the paginated button to figure out current page index and next page index
  var currentIndex = parseInt(prev.innerHTML);
  var selectedIndex = parseInt(curr.innerHTML);
  unhideChunk(currentIndex-1, selectedIndex-1);
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