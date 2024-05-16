const searchClient = algoliasearch(
  "1V7DZGZJKK",
  "0ba2c5f100ff5fd004415e4abbcf9b9c"
);

const PROD_URL = "https://www.egazette.gov.sg";
const isProd = window.location.origin === PROD_URL;
const algoliaIndexName = isProd
  ? "ogp_egazettes_index"
  : "staging_ogp_egazettes_index";

const categories = ["Government Gazette", "Legislative Supplements", "Other Supplements"]
const governmentGazetteSubcategories = ["Advertisements", "Appointments", "Audited Reports", "Cessation of Service", "Corrigendum", "Death", "Dismissals", "Leave", "Bankruptcy Act Notice", "Companies Act Notice", "Notices under the Constitution", "Notices under other Acts", "Others", "Revocation", "Tenders", "Termination of Service", "Vacation of Service"]
const legislativeSupplementsSubcategories = ["Bills Supplement", "Acts Supplement", "Revised Acts", "Subsidiary Legislation Supplement", "Revised Subsidiary Legislation"]
const otherSupplementsSubcategories = ["Government Gazette Supplement", "Industrial Relations Supplement", "Trade Marks Supplement", "Treaties Supplement"]

const categoryMapping = {
  "Government Gazette": governmentGazetteSubcategories,
  "Legislative Supplements": legislativeSupplementsSubcategories,
  "Other Supplements": otherSupplementsSubcategories
}

function getSubcategories(selectedCategories) {
  let filteredValues = [];

  selectedCategories.forEach(value => {
    filteredValues = filteredValues.concat(categoryMapping[value])
  });

  return filteredValues;
}

const search = instantsearch({
  indexName: algoliaIndexName,
  searchClient,
  routing: {
    stateMapping: {
      stateToRoute(uiState) {
        const indexUiState = uiState[algoliaIndexName];
        return {
          q: indexUiState.query,
          category:
            indexUiState.refinementList && indexUiState.refinementList.category,
          subCategory:
            indexUiState.refinementList &&
            indexUiState.refinementList.subCategory,
          publishYear:
            indexUiState.refinementList &&
            indexUiState.refinementList.publishYear,
        };
      },
      routeToState(routeState) {
        return {
          [algoliaIndexName]: {
            query: routeState.q,
            refinementList: {
              category: routeState.category,
              subCategory: routeState.subCategory,
              publishYear: routeState.publishYear,
            },
          },
        };
      },
    },
  },
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
    transformItems(items) {
      const currentItemsMap = new Map(items.map(item => [item.label, item]));
      console.log(currentItemsMap) 

      // Map all possible values to their corresponding item or a default item with count 0
      const orderedItems = categories.map(value => 
        currentItemsMap.get(value) || { highlighted:value, value, label: value, count: 0, isRefined: false }
      );

      return orderedItems;
    }
  }),
  instantsearch.widgets.refinementList({
    container: "#refinement-list-subcategory",
    attribute: "subCategory",
    limit: 100,
    transformItems(items, { results }) {
      const currentItemsMap = new Map(items.map(item => [item.label, item]));
      console.log(currentItemsMap)

      const selectedCategories = results._state.disjunctiveFacetsRefinements.category;
      const availableSubcategories = getSubcategories(selectedCategories)
      const orderedItems = availableSubcategories.map(value => {
        const res = currentItemsMap.get(value)
        if (!res) {
          return { highlighted: `${value} (No results)`, value, label: value, count: 0, isRefined: false }
        }
        if (res.count === 0) {
          return { ...res, highlighted: `${value} (No results)`}
        }
        return res
      }
      );
      return orderedItems;
    }
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

search.on('render', () => {
  document.querySelectorAll('#refinement-list-subcategory .ais-RefinementList-item').forEach(item => {
    const count = parseInt(item.querySelector('.ais-RefinementList-count').textContent, 10);
    if (count === 0) {
      item.classList.add('algolia-search-item-disabled');
    }
  });
});
// const searchbox = document.getElementById("searchbox");
// searchbox.addEventListener("keyup", () => {
//   console.log(searchbox.value);
// });

const toggleSortedVisibility = () => {
  const component = document.querySelector("#sorted-by");
  if (searchInput.value.trim() === "") {
    component.textContent = "Sorted by most recent";
  } else {
    component.textContent = "Sorted by relevancy";
  }
};

const searchInput = document.querySelector(".ais-SearchBox-input");
searchInput.addEventListener("input", toggleSortedVisibility);
toggleSortedVisibility();
