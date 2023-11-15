"use strict";

// Populate the pagination elements
function displayPagination() {
  document.querySelector(".pagination").style.display = "flex";
  var pagination = document.getElementById('paginator-pages');

  var _loop = function _loop(i) {
    var ele = document.createElement("span");
    var text = document.createTextNode(i + 1);

    ele.appendChild(text);
    ele.onclick = function (e) {
      changePage(e.target, i);
    };
    pagination.appendChild(ele);
  };

  for (var i = 0; i < pageResults.length; i++) {
    _loop(i);
  }

  // Initialise selected page and nav arrows
  setCurrentPage(pagination.firstElementChild);
  displayNavArrows(currentPageIndex);
  setNavArrowHandlers();
}

// Set click handlers for nav arrows
function setNavArrowHandlers() {
  var farLeft = document.querySelector(".pagination .bx.bx-chevrons-left");
  var left = document.querySelector(".pagination .sgds-icon.sgds-icon-arrow-left");
  var farRight = document.querySelector(".pagination .bx.bx-chevrons-right");
  var right = document.querySelector(".pagination .sgds-icon.sgds-icon-arrow-right");
  var sel = document.querySelector("#paginator-pages .selected-page");
  var pagination = document.getElementById('paginator-pages');

  if (farLeft) farLeft.onclick = function (e) {
    changePage(pagination.firstElementChild, 0);
  };
  left.onclick = function (e) {
    var sel = document.querySelector("#paginator-pages .selected-page");
    changePage(sel.previousElementSibling, currentPageIndex - 1);
  };

  if (farRight) farRight.onclick = function (e) {
    changePage(pagination.lastElementChild, Math.ceil(datagovsgTotal / RESULTS_PER_PAGE) - 1);
  };
  right.onclick = function (e) {
    var sel = document.querySelector("#paginator-pages .selected-page");
    changePage(sel.nextElementSibling, currentPageIndex + 1);
  };
}

function changePageUtil(curr, index) {
  var prev = document.querySelector("#paginator-pages .selected-page");
  prev.className = "";
  prev.style.pointerEvents = "auto";
  currentPageIndex = index;
  setCurrentPage(curr);
  displayNavArrows(index);
  scrollToTop();
}

function displayNavArrows(i) {
  var farLeft = document.querySelector(".pagination .bx.bx-chevrons-left");
  var left = document.querySelector(".pagination .sgds-icon.sgds-icon-arrow-left");
  var farRight = document.querySelector(".pagination .bx.bx-chevrons-right");
  var right = document.querySelector(".pagination .sgds-icon.sgds-icon-arrow-right");

  if (i === 0) {
    if (farLeft) farLeft.classList.add("sgds-icon-disabled");
    left.classList.add("sgds-icon-disabled");
  } else {
    if (farLeft) farLeft.classList.remove("sgds-icon-disabled");
    left.classList.remove("sgds-icon-disabled");
  }
  if (i === pageResults.length - 1) {
    if (farRight) farRight.classList.add("sgds-icon-disabled");
    right.classList.add("sgds-icon-disabled");
  } else {
    if (farRight) farRight.classList.remove("sgds-icon-disabled");
    right.classList.remove("sgds-icon-disabled");
  }
}

function resetDisplayPages(pages) {
  for (var p = 0; p < pages.length; p++) {
    pages[p].classList.add("is-hidden-mobile");
    pages[p].style.display = "none";
  }
}

// function to ensure that number of pagination btns 
// displayed are constant
function computeAdjacentPages(max) {
  var btns = max;
  if (currentPageIndex < max) {
    btns += max - currentPageIndex;
  }
  if (pageResults.length - currentPageIndex - 1 < max) {
    btns += max - (pageResults.length - currentPageIndex - 1);
  }
  return btns;
}

function setCurrentPage(ele) {
  var pages = document.getElementById('paginator-pages').children;
  resetDisplayPages(pages);

  ele.className = "selected-page";
  ele.style.display = "inline-block";
  ele.style.pointerEvents = "none";

  for (var i = 1; i <= computeAdjacentPages(MAX_ADJACENT_PAGE_BTNS); i++) {
    if (pages[currentPageIndex + i]) {
      pages[currentPageIndex + i].style.display = "inline-block";
    }
    if (pages[currentPageIndex - i]) {
      pages[currentPageIndex - i].style.display = "inline-block";
    }
  }
  for (var _i = 1; _i <= computeAdjacentPages(MAX_ADJACENT_MOBILE_PAGE_BTNS); _i++) {
    if (pages[currentPageIndex + _i]) {
      pages[currentPageIndex + _i].classList.remove("is-hidden-mobile");
    }
    if (pages[currentPageIndex - _i]) {
      pages[currentPageIndex - _i].classList.remove("is-hidden-mobile");
    }
  }
}

function splitPages(results, pageSize) {
  var tempArray = [];

  for (var i = 0; i < results.length; i += pageSize) {
    var chunk = results.slice(i, i + pageSize);
    tempArray.push(chunk);
  }

  return tempArray;
}

function scrollToTop() {
  // scroll to top of results
  window.scroll({ top: 0, left: 0, behavior: 'smooth' });
}