const searchClient = algoliasearch(
  "1V7DZGZJKK",
  "0ba2c5f100ff5fd004415e4abbcf9b9c"
);

const search = instantsearch({
  indexName: "ogp-egazettes",
  searchClient,
});

// search.index.setSettings({
//   paginationLimitedTo: 1,
// });

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#searchbox",
    autofocus: true,
    // templates: {
    //   loadingIndicator({ cssClasses }, { html }) {
    //     return html`<div id="loading-spinner" class="col is-full">
    //       <div class="lds-default">
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //         <div></div>
    //       </div>
    //     </div>`;
    //   },
    // },
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
            <p class="search-content permalink">Notification number: ${instantsearch.highlight(
              {
                attribute: "notificationNum",
                highlightedTagName: "mark",
                hit,
              }
            )}</p>
            <p class="search-content permalink">Publish date: ${new Date(
              hit.publishTimestamp
            ).toLocaleDateString("en-GB")}</p>
            <p>
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

// TODO: Loading spinner
// search.on("render", () => {
//   const container = document.getElementById("#loading-spinner");
//   const searchDisplay = document.getElementsByClassName(
//     "search-results-display"
//   )[0];
//   if (search.status === "loading" || search.status === "stalled") {
//     container.innerHTML = `<div class="lds-default">
//       <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
//   </div>`;
//     container.style.display = "inline";
//     searchDisplay.style.display = "none";
//   } else {
//     container.style.display = "none";
//     searchDisplay.style.display = "inline";
//   }
// });

search.start();

// const searchbox = document.getElementById("searchbox");
// searchbox.addEventListener("keyup", () => {
//   console.log(searchbox.value);
// });
