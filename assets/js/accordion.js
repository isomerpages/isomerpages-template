"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var accordionArray = document.getElementsByClassName("accordion");

var _loop = function _loop(accordion) {
	var toggleAccordionBody = function toggleAccordionBody() {
		var _accordion$getElement = accordion.getElementsByClassName("bp-accordion-body"),
		    _accordion$getElement2 = _slicedToArray(_accordion$getElement, 1),
		    accordionBody = _accordion$getElement2[0];

		var _accordion$getElement3 = accordion.getElementsByClassName("bp-accordion-button"),
		    _accordion$getElement4 = _slicedToArray(_accordion$getElement3, 1),
		    accordionButton = _accordion$getElement4[0];

		if (accordionBody.style.display === "" || accordionBody.style.display === "none") {
			accordionBody.style.display = "block";
			accordionButton.classList.remove("sgds-icon-plus");
			accordionButton.classList.add("sgds-icon-minus");
		} else {
			accordionBody.style.display = "none";
			accordionButton.classList.remove("sgds-icon-minus");
			accordionButton.classList.add("sgds-icon-plus");
		}
	};

	accordion.getElementsByClassName("bp-accordion-header")[0].addEventListener("click", toggleAccordionBody);
};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
	for (var _iterator = accordionArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
		var accordion = _step.value;

		_loop(accordion);
	}
} catch (err) {
	_didIteratorError = true;
	_iteratorError = err;
} finally {
	try {
		if (!_iteratorNormalCompletion && _iterator.return) {
			_iterator.return();
		}
	} finally {
		if (_didIteratorError) {
			throw _iteratorError;
		}
	}
}
