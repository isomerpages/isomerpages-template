const CATEGORY_INTERNAL_MAPPING = {
  "Government Gazette": "Government Gazette",
  "Legislative Supplements": "Legislation Supplements",
  "Other Supplements": "Other Supplements",
  "Advertisements": "Advertisements",
  "Appointments": "Appointments",
  "Audited Reports": "Audited Reports",
  "Cessation of Service": "Cessation of Service",
  "Corrigendum": "Corrigendum",
  "Death": "Death",
  "Dismissals": "Dismissals",
  "Leave": "Leave",
  "Bankruptcy Act Notice": "Notices (Bankruptcy Act)",
  "Companies Act Notice": "Notices (Companies Act)",
  "Notices under the Constitution": "Notices (Constitution)",
  "Notices under other Acts": "Notices (other Acts)",
  "Revocation": "Revocation",
  "Tenders": "Tenders",
  "Termination of Service": "Termination of Service",
  "Vacation of Service": "Vacation of Service",
  "Others": "Others",
  "Bills Supplement": "Bills Supplement",
  "Acts Supplement": "Acts Supplement",
  "Subsidiary Legislation Supplement": "Subsidiary Legislation Supplement",
  "Revised Acts": "Revised Acts",
  "Revised Subsidiary Legislation": "Revised Subsidiary Legislation",
  "Government Gazette Supplement": "Government Gazette Supplement",
  "Industrial Relations Supplement": "Industrial Relations Supplement",
  "Trade Marks Supplement": "Trade Marks Supplement",
  "Treaties Supplement": "Treaties Supplement"
}

const searchClient = algoliasearch(
  "1V7DZGZJKK",
  isProd ? "ff6219a3539653aa48773bf03199b95e" : "bbc5751b3f9b7fdfc08c99712adfa397"
);

const PROD_URL = "https://www.egazette.gov.sg";
const isProd = window.location.origin === PROD_URL;
const algoliaIndexName = isProd
  ? "prod_ogp_egazettes_index"
  : "staging_ogp_egazettes_index";

const categories = ["Government Gazette", "Legislative Supplements", "Other Supplements"]
const governmentGazetteSubcategories = ["Advertisements", "Appointments", "Audited Reports", "Cessation of Service", "Corrigendum", "Death", "Dismissals", "Leave", "Bankruptcy Act Notice", "Companies Act Notice", "Notices under the Constitution", "Notices under other Acts", "Revocation", "Tenders", "Termination of Service", "Vacation of Service", "Others"]
const legislativeSupplementsSubcategories = ["Bills Supplement", "Acts Supplement", "Subsidiary Legislation Supplement", "Revised Acts", "Revised Subsidiary Legislation"]
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

// Used for debouncing
let timerId;
let timeout = 250;

const createToggleVisibilityWidget = (containerSelector, attribute) => ({
  init({ helper }) {
    this.container = document.querySelector(containerSelector);
    this.attribute = attribute;
    this.helper = helper;
    this.render();
  },
  render(_renderOptions) {
    const hasResults = search.renderState[algoliaIndexName].currentRefinements.items.filter(item => item.attribute === "category").length > 0
    
    this.container.style.display = hasResults ? 'block' : 'none';
  },
});

const search = instantsearch({
  indexName: algoliaIndexName,
  searchClient,
  routing: {
    stateMapping: {
      stateToRoute(uiState) {
        const indexUiState = uiState[algoliaIndexName];
        const yearData = indexUiState.range?.publishYear ? indexUiState.range.publishYear.split(":") : undefined
        const minYear = (yearData && yearData[0]) ? yearData[0] : undefined
        const maxYear = (yearData && yearData[1]) ? yearData[1] : undefined
        const monthData = indexUiState.range?.publishMonth ? indexUiState.range.publishMonth.split(":") : undefined
        const minMonth = (monthData && monthData[0]) ? monthData[0] : undefined
        const maxMonth = (monthData && monthData[1]) ? monthData[1] : undefined
        return {
          q: indexUiState.query ? encodeURIComponent(indexUiState.query) : undefined,
          category:
            indexUiState.refinementList && indexUiState.refinementList.category,
          subCategory:
            indexUiState.refinementList &&
            indexUiState.refinementList.subCategory,
          minYear,
          maxYear,
          minMonth,
          maxMonth
        };
      },
      routeToState(routeState) {
        const hasPublishYear = routeState.minYear || routeState.maxYear
        const publishYear = hasPublishYear ? `${routeState.minYear || ""}: ${routeState.maxYear || ""}` : ""
        const hasPublishMonth = routeState.minMonth || routeState.maxMonth
        const publishMonth = hasPublishMonth ? `${routeState.minMonth || ""}: ${routeState.maxMonth || ""}` : ""
        return {
          [algoliaIndexName]: {
            query: routeState.q,
            refinementList: {
              category: routeState.category,
              subCategory: routeState.subCategory,
            },
            range: {
              publishYear,
              publishMonth
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
    queryHook(query, refine) {
      clearTimeout(timerId);
      timerId = setTimeout(() => refine(query), timeout);
    },
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
      const currentCategoryRefinements = search.renderState[algoliaIndexName].currentRefinements.items.filter(item => item.attribute === "category")
      let selectedCategories = []
      if (currentCategoryRefinements.length > 0) {
        selectedCategories = currentCategoryRefinements[0].refinements.map(item => item.label)
      }
      const currentItemsMap = new Map(items.map(item => [item.label, item]));

      // Map all possible values to their corresponding item or a default item with count 0
      const orderedItems = categories.map(value => {
        if (currentItemsMap.has(value)) {
          const adjustedMapping = { ...currentItemsMap.get(value), highlighted: CATEGORY_INTERNAL_MAPPING[value] }
          return adjustedMapping
        } else if (selectedCategories.includes(value)) {
          return { highlighted:value, value, label: value, count: 0, isRefined: true }
        }
        return { highlighted:value, value, label: value, count: 0, isRefined: false }
      });

      return orderedItems;
    }
  }),
  instantsearch.widgets.refinementList({
    container: "#refinement-list-subcategory",
    attribute: "subCategory",
    limit: 100,
    transformItems(items, { results }) {
      const currentSubcategoryRefinements = search.renderState[algoliaIndexName].currentRefinements.items.filter(item => item.attribute === "subCategory")
      let selectedSubcategories = []
      if (currentSubcategoryRefinements.length > 0) {
        selectedSubcategories = currentSubcategoryRefinements[0].refinements.map(item => item.label)
      }
      const currentItemsMap = new Map(items.map(item => [item.label, item]));

      const selectedCategories = results._state.disjunctiveFacetsRefinements.category;
      const availableSubcategories = getSubcategories(selectedCategories)
      const orderedItems = availableSubcategories.map(value => {
        const res = currentItemsMap.get(value)
        if (currentItemsMap.has(value)) {
          return { ...res, highlighted: `${res.count === 0 ? `${CATEGORY_INTERNAL_MAPPING[value]} (No results)` : CATEGORY_INTERNAL_MAPPING[value]}`}
        } else if (selectedSubcategories.includes(value)) {
          return { highlighted: `${CATEGORY_INTERNAL_MAPPING[value]} (No results)`, value, label: value, count: 0, isRefined: true }
        }
        return { highlighted: `${CATEGORY_INTERNAL_MAPPING[value]} (No results)`, value, label: value, count: 0, isRefined: false }
      });
      return orderedItems;
    }
  }),
  instantsearch.widgets.rangeInput({
    container: '#refinement-list-year',
    attribute: 'publishYear',
  }),
  instantsearch.widgets.rangeInput({
    container: '#refinement-list-month',
    attribute: 'publishMonth',
  }),
  instantsearch.widgets.currentRefinements({
    container: "#current-refinements",
    cssClasses: {
      delete: "currentRefinementsIsomer",
    },
    transformItems(items) {
      return items.map(item => ({
        ...item,
        refinements: item.refinements.map(refinement => ({
          ...refinement,
          label: CATEGORY_INTERNAL_MAPPING[refinement.label] || refinement.label, // Map the label using internalMapping
        }))
      }));
    }
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
            } target="_blank" type="application/pdf">${instantsearch.highlight({
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
            <p class="search-content description ml-9 body-2">Number: ${instantsearch.highlight(
              {
                attribute: "notificationNum",
                highlightedTagName: "mark",
                hit,
              }
            )}</p>
            <p class="search-content description ml-9 body-2">Date of publication: ${new Date(
              hit.publishTimestamp
            ).toLocaleDateString("en-SG")}</p>
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
    padding: 2
  }),
]);
search.addWidget(
  createToggleVisibilityWidget('#refinement-list-subcategory-container', 'subcategory')
);


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
