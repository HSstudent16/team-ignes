((root, udf) => {
  root = root ?? this ?? {};
  if (!root.document) return;

  let doc = root.document;

  let data = {};

  doc.querySelectorAll("x-sources > x-link").forEach(el => {
    data[el.dataset.name] = el.innerText;
  });

  doc.querySelectorAll("*[data-bg-src]").forEach(el => {
    let n = el.dataset.bgSrc;
    if (n in data)
      el.style.backgroundImage = `url(${data[n]})`;
  });
  doc.querySelectorAll("img[data-src]").forEach(el => {
    let n = el.dataset.src;
    if (n in data)
      el.src = data[n];
  });
  doc.querySelectorAll("*[data-href]").forEach(el => {
    let n = el.dataset.href;
    if (n in data)
      el.href = data[n];
      el.target = "_blank";
  });

}) (this);
