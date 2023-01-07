/**
 * Requires pages to be handled with an input element of type `nav`,
 * immediately followed by a container element with a class of `page`.
 */
( (root, udf) => {
  let firstPage = null;

  function onPageChange () {
    window.scroll(0, 0);
  }
  function configureRadio (el) {
    el.classList.add("nav");
    el.type = "radio";
    el.name = "nav";
    el.onchange = onPageChange;
    firstPage = firstPage ?? el;
  }
  window.configureRadio = configureRadio;
  document.querySelectorAll("input[type=nav]").forEach(configureRadio);
  firstPage.checked = true;
}) (this);