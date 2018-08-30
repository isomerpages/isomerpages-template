var runSearch = function(json_data, posts_data) {

  const RESULTS_PER_PAGE = 10;
  const PREVIEW_SIZE = 300;
  const NUM_LEADING_CHARS = 30;
  let results;
  let pageResults;
  let currentPageIndex = 0;

  // Bolds the keywords in the preview string
  function highlightKeywords(content, previewStartPosition, matchMetadata) {
    var matchMap = {};

    // Create an object containing search hit position and length of search hit in the document (for content within preview)
    for (var keyword in matchMetadata) {
      var positionArray;

      if (!matchMetadata[keyword]['content']) {
        return;
      }

      positionArray = matchMetadata[keyword]['content']['position'];

      for (var positionIndex = 0; positionIndex < positionArray.length; positionIndex++) {
        var hitPosition = positionArray[positionIndex][0];
        if ((hitPosition >= previewStartPosition) && (hitPosition < previewStartPosition+PREVIEW_SIZE)) {
          matchMap[hitPosition] = positionArray[positionIndex][1];
        }
      }
    }

    // Go through each search hit and bold it
    if (Object.keys(matchMap).length !== 0) {
      var processedPreview = '';
      var currPosition = previewStartPosition;
      for (var wordPosition in matchMap) {
        var wordEnd = parseInt(wordPosition) + parseInt(matchMap[wordPosition]) + 1;
        processedPreview += content.substring(currPosition, wordPosition) + '<b>' + content.substring(wordPosition, wordEnd) + '</b>';
        currPosition = wordEnd;
      }

      if (wordEnd < previewStartPosition+PREVIEW_SIZE) {
        processedPreview += content.substring(currPosition, previewStartPosition+PREVIEW_SIZE);
      }
      return processedPreview;
    }

    return content.substring(previewStartPosition, previewStartPosition+PREVIEW_SIZE);
  }

  // Find the earliest space in the preview closest to (firstPosition - NUM_LEADING_CHARS)
  function returnStartOfPreview(content, firstPosition) {
    if (firstPosition-NUM_LEADING_CHARS <= 0) {
      return 0;
    } else {
      for (var index = firstPosition-NUM_LEADING_CHARS; index < firstPosition; index++) {
        if (content.charAt(index) === ' ') {
          return index;
        }
      }
      return firstPosition;
    }
  }

  // Find the position of the first keyword match in the document
  function returnFirstKeywordPosition(matchMetadata) {
    var firstPosition = -1;

    // Iterate over each keyword in the search query
    for (var keyword in matchMetadata) {

      if (matchMetadata[keyword]['content'] !== undefined) {
        var positionArray = matchMetadata[keyword]['content']['position'];
        
        // Find the earliest first position across all keywords
        for (var positionIndex = 0; positionIndex < positionArray.length; positionIndex++) {
          if (firstPosition == -1 || (firstPosition > positionArray[positionIndex][0])) {
            firstPosition = positionArray[positionIndex][0];
          }
        }
      }
    }

    return firstPosition;
  }

  // Return the preview content for each search result - returns the snippet that has the first hit in the document (up to 300 chars)
  function returnResultsList(results) {
    var searchPara = '';
    var post_data = posts_data; // Obtain JSON var of all the posts in the site


    // Iterate over the results
    for (var i = 0; i < results.length; i++) {
      var key = parseInt(results[i]['ref']);
      var resultObject = post_data[key];


      var matchMetadata = results[i]['matchData']['metadata'];
      var keywordSet = new Set();

      var titleTruncateLength = 90;
      var resultTitle = resultObject['title'].substring(0, titleTruncateLength);

      if (resultObject['title'].length > titleTruncateLength) {
        var indexOfLastWord = resultObject['title'].substring(0,titleTruncateLength).lastIndexOf(" ");
        var resultTitle = resultObject['title'].substring(0, indexOfLastWord);
        resultTitle += ' ...';
      }
      searchPara += '<a class="search-content" href="' + resultObject['url']  + '">' + ' ' + resultTitle + '</a>';
      
      // Find the position of the earliest keyword in the document
      var firstPosition = returnFirstKeywordPosition(matchMetadata);

      // Find the preview start position
      var previewStartPosition = returnStartOfPreview(resultObject['content'], firstPosition);

      // Process the preview to embolden keywords
      var processedPreview = highlightKeywords(resultObject['content'], previewStartPosition, matchMetadata);
      // var postDate = new Date(resultObject['datestring']).toDateString().substring(4);
      searchPara += '<p class="search-content permalink">' + resultObject['url'] + '</p><br>';
      // searchPara += '<p class="search-content" > '+ postDate + ' ...' + processedPreview + '...</p><br>';
      
      if (processedPreview) {
        searchPara += '<p class="search-content" > ' + ' ...' + processedPreview + '...</p><br>';
      }
    }

    return searchPara;
  }

  // Display search results if there are results, else, state that there are no results found
  function displaySearchResults(searchTerm) {
    var searchResultsCount = document.getElementById('search-results-count');
    searchResultsCount.innerHTML = results.length + " results for '" + searchTerm + "'";
    // document.getElementById('search-bar').setAttribute("value", searchTerm);
    document.getElementsByName('query')[1].setAttribute("value", searchTerm);
    
    paginateSearchResults();
    if (!results.length || pageResults.length <= 1) return;
    displayPagination();
  }

  function paginateSearchResults() {
    var searchResults = document.getElementById('search-results');
    searchResults.innerHTML = returnResultsList(pageResults[currentPageIndex]);
  }

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

  function changePage(curr, index) {
    let prev = document.querySelector("#paginator-pages .selected-page");
    prev.className = "";
    prev.style.pointerEvents = "auto";
    currentPageIndex = index;
    setCurrentPage(curr);
    displayNavArrows(index);
    paginateSearchResults();
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

  // Obtain the query string, load the pre-built lunr index, and perform search
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

  var searchTerm = getQueryVariable('query');
  if (searchTerm) {

    // Load the pre-built lunr index
    var idx = lunr.Index.load(JSON.parse(json_data));

    // Get lunr to perform a search
    results = idx.search(searchTerm);
    pageResults = splitPages(results, RESULTS_PER_PAGE);

    window.onload = displaySearchResults(searchTerm);
  }
};