const searchClient = algoliasearch(
  "1V7DZGZJKK",
  "0ba2c5f100ff5fd004415e4abbcf9b9c"
);

const search = instantsearch({
  indexName: "kishore_test_ogp_egazettes_index", //"staging_ogp_egazettes_index",
  searchClient,
});

// Note: Publish date is formatted as YYYY-MM-DD
search.addWidgets([
  instantsearch.widgets.searchBox({
    container: "#searchbox",
    autofocus: true,
    placeholder: "Start typing to search",
  }),
  instantsearch.widgets.stats({
    container: "#stats",
    templates: {
      text(data, { html }) {
        let content = "";

        if (data.hasManyResults) {
          if (data.nbHits > 1000) {
            content += `More than 1000 results found`;
          } else {
            content += `${data.nbHits} results found`;
          }
        } else if (data.hasOneResult) {
          content += `1 result found`;
        } else {
          content += `no result found`;
        }

        return html`<h2>${content}</h2>`;
      },
    },
  }),

  instantsearch.widgets.poweredBy({
    container: "#poweredby",
    theme: "dark",
  }),
  instantsearch.widgets.refinementList({
    container: "#refinement-list-category",
    attribute: "category",
  }),
  instantsearch.widgets.refinementList({
    container: "#refinement-list-subcategory",
    attribute: "subCategory",
  }),
  instantsearch.widgets.refinementList({
    container: "#refinement-list-day",
    attribute: "publishDay",
  }),
  instantsearch.widgets.refinementList({
    container: "#refinement-list-month",
    attribute: "publishMonth",
  }),
  instantsearch.widgets.refinementList({
    container: "#refinement-list-year",
    attribute: "publishYear",
  }),
  instantsearch.widgets.refinementList({
    container: "#refinement-list-number",
    attribute: "notificationNum",
  }),
  // instantsearch.widgets.currentRefinements({
  //   container: "#current-refinements",
  // }),
  // instantsearch.widgets.clearRefinements({
  //   container: "#clear-refinements",
  // }),
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item(hit) {
        return `
            <h5 class="search-results">
            <a class="search-content mb-4" href=${
              hit.fileUrl
            } type="application/pdf">${instantsearch.highlight({
          attribute: "title",
          highlightedTagName: "mark",
          hit,
        })}</a>
            <p class="search-content description ml-9">Category: ${instantsearch.highlight(
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
            <p class="search-content description ml-9">Notification number: ${instantsearch.highlight(
              {
                attribute: "notificationNum",
                highlightedTagName: "mark",
                hit,
              }
            )}</p>
            <p class="search-content description ml-9">Publish date: ${new Date(
              hit.publishTimestamp
            ).toLocaleDateString("fr-CA")}</p>
            ${
              hit.text
                ? `<p class="search-content description ml-9">Content: ${instantsearch.snippet(
                    {
                      attribute: "text",
                      highlightedTagName: "mark",
                      hit,
                    }
                  )}</p>`
                : ""
            }
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
