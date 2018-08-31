---
---

let PAGE_SIZE = {{site.paginate}};
let chunkArray;
let currentPageIndex = 0;

paginateResources();

// Main function to paginate resource page
function paginateResources() {
  var resourceCardArray = Array.from(document.getElementsByClassName("resource-card-element")); // Convert NodeList into Array
  chunkArray = splitPages(resourceCardArray, PAGE_SIZE);
  unhideChunk(currentPageIndex, currentPageIndex);

  if (!resourceCardArray.length || resourceCardArray.length <= PAGE_SIZE) return;
  displayPagination();
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
  console.log(prev);
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