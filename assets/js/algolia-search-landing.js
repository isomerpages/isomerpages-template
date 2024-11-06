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
  "0ba2c5f100ff5fd004415e4abbcf9b9c"
);

const PROD_URL = "https://www.egazette.gov.sg";
const isProd = window.location.origin === PROD_URL;
const algoliaIndexName = isProd
  ? "prod_ogp_egazettes_index"
  : "staging_ogp_egazettes_index";

const searchIndex = searchClient.initIndex(algoliaIndexName);

const searchCategories = [] // TODO: add agency
const governmentGazetteSubcategories = ["Advertisements", "Appointments", "Audited Reports", "Cessation of Service", "Corrigendum", "Death", "Dismissals", "Leave", "Bankruptcy Act Notice", "Companies Act Notice", "Notices under the Constitution", "Notices under other Acts", "Revocation", "Tenders", "Termination of Service", "Vacation of Service", "Others"]
const legislativeSupplementsSubcategories = ["Bills Supplement", "Acts Supplement", "Subsidiary Legislation Supplement", "Revised Acts", "Revised Subsidiary Legislation"]
const otherSupplementsSubcategories = ["Government Gazette Supplement", "Industrial Relations Supplement", "Trade Marks Supplement", "Treaties Supplement"]
const subcategoryMapping = {}
governmentGazetteSubcategories.forEach(subcat => subcategoryMapping[subcat] = "Government Gazette")
legislativeSupplementsSubcategories.forEach(subcat => subcategoryMapping[subcat] = "Legislative Supplements")
otherSupplementsSubcategories.forEach(subcat => subcategoryMapping[subcat] = "Other Supplements")
const gazetteCategories = ["Government Gazette", "Legislative Supplements", "Other Supplements"]

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

function createCheckboxes(container, categories, searchCategoryName) {
  categories.forEach(categoryItem => {
    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add("algolia-search-category-item")
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = categoryItem;
    checkbox.value = categoryItem;
    checkbox.id = `${categoryItem}_${categoryItem}`;
    checkbox.dataset.category = searchCategoryName
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = CATEGORY_INTERNAL_MAPPING[categoryItem];
    container.appendChild(itemWrapper)
    itemWrapper.appendChild(checkbox);
    itemWrapper.appendChild(label);
  })
}

// Function to populate options for each category
async function populateOptions() {
  for (const category of searchCategories) {
    const categoryContent = await fetchCategoryEntries(category)
    const categoryFieldset = document.getElementById(category);
    createCheckboxes(categoryFieldset, categoryContent, category)
  }
  const governmentGazetteContainerElement = document.getElementById("government-gazette");
  const legislativeSupplementsContainerElement = document.getElementById("legislative-supplements");
  const otherSupplementsContainerElement = document.getElementById("other-supplements");
  createCheckboxes(governmentGazetteContainerElement, governmentGazetteSubcategories, "subCategory")
  createCheckboxes(legislativeSupplementsContainerElement, legislativeSupplementsSubcategories, "subCategory")
  createCheckboxes(otherSupplementsContainerElement, otherSupplementsSubcategories, "subCategory")
}

populateOptions();

function processSearch() {
  let selectedCategories = {};
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  checkboxes.forEach(checkbox => {
    const category = checkbox.dataset.category;
    const entry = checkbox.value;
    if (!selectedCategories[category]) {
      selectedCategories[category] = [];
    }
    selectedCategories[category].push(entry);
  });
  if (selectedCategories.subCategory) {
    if (!selectedCategories.category) selectedCategories.category = []
    selectedCategories.subCategory.forEach(selectedSubcategory => {
      const parentCat = subcategoryMapping[selectedSubcategory]
      if (!(parentCat in selectedCategories["category"])) {
        selectedCategories["category"].push(parentCat)
      }
    })
  }

  const startDateInput = document.getElementById("input-start-date").value
  const endDateInput = document.getElementById("input-end-date").value
  const startMonthInput = document.getElementById("input-start-month").value
  const endMonthInput = document.getElementById("input-end-month").value

  // Construct URL with query params
  const categoryFormElement = document.querySelector("#categoryForm");
  const searchPageUrl = categoryFormElement.dataset.url
  let url = searchPageUrl.endsWith("/") ? `${searchPageUrl}?` : `${searchPageUrl}/?`

  // Search term
  const queryInput = document.getElementById("algolia-search-box-landing")
  url += `q=${queryInput.value ? encodeURIComponent(queryInput.value) : ""}`

  // Category filters
  for (const [category, values] of Object.entries(selectedCategories)) {
    values.map((entry, index) => {
      url += `&${category}%5B${index}%5D=${encodeURIComponent(entry)}`
    })
  }

  // Date range filters
  if (startDateInput) url += `&minYear=${encodeURIComponent(startDateInput)}`
  if (endDateInput) url += `&maxYear=${encodeURIComponent(endDateInput)}`
  if (startMonthInput) url += `&minMonth=${encodeURIComponent(startMonthInput)}`
  if (endMonthInput) url += `&maxMonth=${encodeURIComponent(endMonthInput)}`

  // Redirect to results page
  window.location.href = url;
}

function clearFilters() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false;
  });
  const textInput = document.querySelectorAll('input[type="text"]');
  textInput.forEach(function(textInput) {
    textInput.value = "";
  });
}

function generateCheckChildren(parentCheckbox, category) {
  return () => {
      const categoryContainerElement = document.getElementById(category);
      const childCheckboxes = categoryContainerElement.querySelectorAll('input[type="checkbox"]');
      childCheckboxes.forEach((checkbox) => {
        checkbox.checked = parentCheckbox.checked
      })
  }
}

const governmentCheckbox = document.getElementById('category-government');
const legislativeCheckbox = document.getElementById('category-legislative');
const otherCheckbox = document.getElementById('category-other');
document.getElementById("clearFiltersButton").addEventListener("click", clearFilters)
document.getElementById("submitButton").addEventListener("click", processSearch);
document.getElementById("algolia-search-box-landing").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default form submission behavior
    processSearch();
  }
});
governmentCheckbox.addEventListener('click', generateCheckChildren(governmentCheckbox, "government-gazette"))
legislativeCheckbox.addEventListener('click', generateCheckChildren(legislativeCheckbox, "legislative-supplements"))
otherCheckbox.addEventListener('click', generateCheckChildren(otherCheckbox, "other-supplements"))