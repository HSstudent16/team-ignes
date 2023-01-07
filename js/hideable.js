( (root, udf) => {
  root = root ?? this ?? {};
  if (!root.document) return;

  let doc = root.document;
  doc.querySelectorAll(".hideable > .hideable-content").forEach(el => {
    let checkbox = el.parentElement.previousElementSibling;

    if (!checkbox || checkbox.type !== "checkbox") return;

    let maxHeight = el.getBoundingClientRect().height + "px";

    checkbox.checked = false;
    checkbox.onchange = e => el.style.height = checkbox.checked ? maxHeight : "0px";
    checkbox.onchange();
  });
}) (this);