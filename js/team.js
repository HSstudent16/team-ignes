var initUserData = ((root, udf) => {
  root = root ?? this ?? {};
  if (!root.document) return;

  let doc = root.document;

  let members_dump = doc.querySelector("#members-output");
  let program_drawer = doc.querySelector("#query-output");
  let footer = doc.querySelector("footer");
  let form = doc.querySelector("#query");

  let programs = [], data;

  const aliases = {
    "home": "Homepage",
    "wint": "Winter",
    "crea": "Creative",
    "lear": "Learning",
    "coll": "Collab",
    "fina": "Final"
  };

  function createPage (m) {
    let radio = doc.createElement("input");
    let page = doc.createElement("div");
    let content = doc.createElement("div");
    let widget = doc.createElement("div");

    root.configureRadio(radio);
    radio.id = "team-" + m.username;

    page.classList.add("page",  "bg-right", "bg-fixed");
    page.style.backgroundImage = (
      `url(https://cdn.kastatic.org/images/profile/backgrounds/bg-${m.background}.jpg)`
    );

    content.classList.add("page-content");

    widget.classList.add("widget", "padded");

    widget.innerHTML = `
      <div class = "flex middle">
        <div class = "panel">
          <img src = "${m.icon}" class = "micro avatar" />
        </div>
        <div class = "panel">
          <h1>${m.name}</h1>
          <p class = "small-text right lightspaced"><a href = "https://www.khanacademy.org/profile/${m.username}" target = "_blank">@${m.username}</a></p>
          <p><span class = "skill tag">${m.skill}</span>${m.tags&&m.tags.length>0?'<span class = "tag">'+m.tags.join('</span><span class = "tag">'):''}</span></p>
        </div>
      </div>
      <div class = "border"></div>
      <div class = "space-content">
        ${root.MarkdownToHtml.parse(m.blurb)}
      </div>
    `;

    content.appendChild(widget);
    page.appendChild(content);
    doc.body.insertBefore(page, footer);
    doc.body.insertBefore(radio, page);
  }

  function addToTable (m) {
    let trow = doc.createElement("tr");

    trow.innerHTML = `
    <td><label class = "link" for = "team-${m.username}">${m.name}</label></td>
    <td>${m.skill}</td>
    <td>${m.points}</td>
  `;
    members_dump.appendChild(trow);
  }

  function createThumb (p) {
    let thumb = doc.createElement("a");
    let url = `https://www.khanacademy.org/computer-programming/i/${p.id}`;

    thumb.classList.add("thumb", "small", "lightspaced", "zoom");
    thumb.href = url;
    thumb.target = "_blank";

    thumb.innerHTML = `
      <img src = "${url}/${p.thumbID || "latest"}.png" class = "fill" />
      ${p.new?'<span class = "new">New!</span>':''}
      <div class = "centered hoverfade">
        <h3 class = "center-text lightspaced ellipsis">${p.title}</h3>
        <p><b>Author:</b> ${p.author}</p>
        <p><b>Challenge:</b> ${p.challenge}</p>
        <p><b>Points:</b> ${p.points}</p>
      </div>
    `;

    program_drawer.appendChild(thumb);
    programs.push(thumb);
  }

  function manageQuery (q) {
    let {title = '', author = '', challenge = ''}  = q ?? {};
    let i, p, t, display;

    title = title.toLowerCase();
    author = author.toLowerCase();
    challenge = aliases[challenge];

    for (i = 0; i < programs.length; i++) {
      t = programs[i];
      p = data.programs[i];

      display = 'block';
      if (title) {
        display = "none";
        if (p.title.toLowerCase().indexOf(title) > -1) {
          display = "block";
        }
      }
      if (author) {
        display = "none";
        if (p.author.toLowerCase().indexOf(author) > -1) {
          display = "block";
        }
      }
      if (challenge) {
        display = "none";
        if (p.challenge === challenge) {
          display = "block";
        }
      }
      t.style.display = display;
    }
  }

  function findPrograms (evt) {
    let input_data = new root.FormData(form);

    manageQuery({
      title: input_data.get("search-title"),
      author: input_data.get("search-author"),
      challenge: input_data.get("search-tag")
    });

    evt.preventDefault();
  }

  function init (in_data) {
    let i;
    data = in_data;
    for (i = 0; i < data.members.length; i++) {
      let m = data.members[i];
      createPage(m);
      addToTable(m);
    }
    for (i = 0; i < data.programs.length; i++) {
      let p = data.programs[i];
      createThumb(p);
    }

    form.addEventListener("submit", findPrograms);

    manageQuery ();
  }

  return root.initUserData = init;
}) (this);
