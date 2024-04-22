const searchClient = algoliasearch(
  "1V7DZGZJKK",
  "0ba2c5f100ff5fd004415e4abbcf9b9c"
);

const PROD_URL = "https://www.egazette.gov.sg";
const isProd = window.location.origin === PROD_URL;
const algoliaIndexName = isProd
  ? "ogp_egazettes_index"
  : "staging_ogp_egazettes_index";

const searchIndex = searchClient.initIndex(algoliaIndexName);

const searchCategories = ["category", "publishYear"] // TODO: add agency

async function fetchCategoryEntries(categoryName) {
  try {
    const { facetHits } = await searchIndex.searchForFacetValues(categoryName, "", { maxFacetHits: 100, sortFacetValuesBy: "alpha" } );
    const categories = facetHits.map(hit => hit.value);
    return categories;
  } catch (error) {
    console.error('Error fetching categories and entries:', error);
    return {};
  }
}

// Function to populate options for each category
async function populateOptions() {
  await Promise.all(searchCategories.map(async (category) => {
    const categoryContent = await fetchCategoryEntries(category)
    const categoryFieldset = document.getElementById(category);
    categoryContent.forEach(categoryItem => {
      const itemWrapper = document.createElement('div');
      itemWrapper.classList.add("algolia-search-category-item")
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = categoryItem;
      checkbox.value = categoryItem;
      checkbox.id = `${categoryItem}_${categoryItem}`;
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = categoryItem;
      categoryFieldset.appendChild(itemWrapper)
      itemWrapper.appendChild(checkbox);
      itemWrapper.appendChild(label);
      // itemWrapper.appendChild(document.createElement('br'));
    })
  }));
}

populateOptions();

document.getElementById("submitButton").addEventListener("click", function() {
  let selectedCategories = {};
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach(checkbox => {
    const category = checkbox.parentNode.parentNode.id;
    const entry = checkbox.value;
    if (!selectedCategories[category]) {
      selectedCategories[category] = [];
    }
    selectedCategories[category].push(entry);
  });
  
  // Construct URL with query params
  const categoryFormElement = document.querySelector("#categoryForm");
  const searchPageUrl = categoryFormElement.dataset.url
  let url = searchPageUrl.endsWith("/") ? `${searchPageUrl}?` : `${searchPageUrl}/?`

  // Search term
  const queryInput = document.getElementById("algolia-search-box-landing")
  url += `query=${queryInput.value ? queryInput.value : ""}`

  // Category filters
  for (const [category, values] of Object.entries(selectedCategories)) {
    url += `&${category}=${values.map(entry => encodeURIComponent(entry)).join(",")}`
  }
      
  // Redirect to results page
  window.location.href = url;
});