---

---
var url = [
    "{{site.baseurl}}{{site.custom_print_css_path}}",
    "https://datagovsg.github.io/blueprint-css/blueprint.css"
]

function printContent() {
    window.printJS({
        printable: 'main-content',
        type: 'html',
        css: url,
        scanStyles: false,
        font: 'Source Sans Pro',
    });
}