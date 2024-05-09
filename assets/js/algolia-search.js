const searchClient = algoliasearch(
  "1V7DZGZJKK",
  "0ba2c5f100ff5fd004415e4abbcf9b9c"
);

const PROD_URL = "https://www.egazette.gov.sg";
const isProd = window.location.origin === PROD_URL;
// const algoliaIndexName = isProd
//   ? "ogp_egazettes_index"
//   : "staging_ogp_egazettes_index";
const algoliaIndexName = "test_snippet_1";

const search = instantsearch({
  indexName: algoliaIndexName,
  searchClient,
  routing: {
    stateMapping: {
      stateToRoute(uiState) {
        const indexUiState = uiState[algoliaIndexName];
        return {
          q: indexUiState.query,
          category: indexUiState.refinementList && indexUiState.refinementList.category,
          subCategory:
          indexUiState.refinementList && indexUiState.refinementList.subCategory,
          publishYear: indexUiState.refinementList && indexUiState.refinementList.publishYear,
        }
      },
      routeToState(routeState) {
        return {
          [algoliaIndexName]: {
            query: routeState.q,
            refinementList: {
              category: routeState.category,
              subCategory:
                routeState.subCategory,
              publishYear: routeState.publishYear,
            },
          },
        };
      },
    },
  }
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
          content += `No results found for ${data.query}`;
        }

        return html`<p>${content}</p>`;
      },
    },
  }),

  instantsearch.widgets.refinementList({
    container: "#refinement-list-category",
    attribute: "category",
    limit: 20,
  }),
  instantsearch.widgets.refinementList({
    container: "#refinement-list-subcategory",
    attribute: "subCategory",
  }),
  instantsearch.widgets.refinementList({
    container: "#refinement-list-year",
    attribute: "publishYear",
  }),
  instantsearch.widgets.currentRefinements({
    container: "#current-refinements",
    cssClasses: {
      delete: "currentRefinementsIsomer",
    },
  }),
  instantsearch.widgets.clearRefinements({
    container: "#clear-refinements",
  }),

  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item(hit) {
        console.log({ hit });
        console.log(instantsearch.snippet.toString());
        return `
            <h5 class="search-results">
            <a class="search-content mb-4" href=${
              hit.fileUrl
            } type="application/pdf">${instantsearch.highlight({
          attribute: "title",
          highlightedTagName: "mark",
          hit,
        })}</a>
            <p class="search-content description ml-9 body-2">Category: ${instantsearch.highlight(
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
            <p class="search-content description ml-9 body-2">Notification number: ${instantsearch.highlight(
              {
                attribute: "notificationNum",
                highlightedTagName: "mark",
                hit,
              }
            )}</p>
            <p class="search-content description ml-9 body-2">Publish date: ${new Date(
              hit.publishTimestamp
            ).toLocaleDateString("fr-CA")}</p>
            ${
              hit.text
                ? `<p class="search-content description ml-9 body-2">Content: ${instantsearch.snippet(
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

const toggleSortedVisibility = () => {
  const component = document.querySelector('#sorted-by');
  if (searchInput.value.trim() === '') {
    component.textContent = 'Sorted by most recent';
  } else {
    component.textContent = 'Sorted by relevancy';
  }
}

const searchInput = document.querySelector('.ais-SearchBox-input');
searchInput.addEventListener('input', toggleSortedVisibility)
toggleSortedVisibility()