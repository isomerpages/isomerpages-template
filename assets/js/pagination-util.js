// Populate the pagination elements
function displayPagination() {
  document.querySelector(".pagination").style.display = "block";
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

function changePageUtil(curr, index) {
  let prev = document.querySelector("#paginator-pages .selected-page");
  prev.className = "";
  prev.style.pointerEvents = "auto";
  currentPageIndex = index;
  setCurrentPage(curr);
  displayNavArrows(index);
  scrollToTop();
}

function displayNavArrows(i) {
  let left = document.querySelector(".pagination .sgds-icon.sgds-icon-arrow-left");
  let right = document.querySelector(".pagination .sgds-icon.sgds-icon-arrow-right");

  if (i === 0) {
    left.classList.add("sgds-icon-disabled");
  } else {
    left.classList.remove("sgds-icon-disabled");
  }
  if (i === pageResults.length - 1) {
    right.classList.add("sgds-icon-disabled")
  } else {
    right.classList.remove("sgds-icon-disabled");
  }
}

function setCurrentPage(ele) {
  ele.className = "selected-page";
  ele.style.pointerEvents = "none";
}

function splitPages(results, pageSize) {
  var tempArray = [];

  for (let i = 0; i < results.length; i += pageSize) {
      var chunk = results.slice(i, i + pageSize);
      tempArray.push(chunk);
  }

  return tempArray;
}

function scrollToTop() {
  // scroll to top of results
  window.scroll({top: 0, left: 0, behavior: 'smooth' })
}
