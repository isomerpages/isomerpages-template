const searchClient = algoliasearch("", "");

const search = instantsearch({
  indexName: "ogp-egazettes",
  searchClient,
  searchParameters: {
    hitsPerPage: 1, // Only return 1 hit (result) per page
  },
});

// search.index.setSettings({
//   paginationLimitedTo: 1,
// });

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#searchbox",
    autofocus: true,
    templates: {
      loadingIndicator({ cssClasses }, { html }) {
        return html`<div id="loading-spinner" class="col is-full">
          <div class="lds-default">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>`;
      },
    },
  }),
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item(hit) {
        return `
            <h5 class="search-results">
            <a class="search-content" href=${
              hit.fileUrl
            } type="application/pdf">${instantsearch.highlight({
          attribute: "title",
          highlightedTagName: "mark",
          hit,
        })}</a>
            <p class="search-content permalink">${hit.fileUrl}</p>
              <p class="search-content permalink">Category: ${instantsearch.highlight(
                {
                  attribute: "category",
                  highlightedTagName: "mark",
                  hit,
                }
              )}${
          hit.subCategory
            ? `, Sub-Category: ${instantsearch.highlight({
                attribute: "subCategory",
                highlightedTagName: "mark",
                hit,
              })}`
            : ""
        }</p>
             
             </h5>
          `;
      },
    },
  }),
  instantsearch.widgets.hitsPerPage({
    container: "#hits-per-page",
    items: [
      { value: 10, label: "10 per page", default: true },
      { value: 20, label: "20 per page" },
      { value: 30, label: "30 per page" },
      { value: 40, label: "40 per page" },
      { value: 50, label: "50 per page" },
    ],
  }),
  instantsearch.widgets.pagination({
    container: "#pagination",
    showFirst: true,
    showLast: true,
  }),
]);

search.start();

// const searchbox = document.getElementById("searchbox");
// searchbox.addEventListener("keyup", () => {
//   console.log(searchbox.value);
// });
