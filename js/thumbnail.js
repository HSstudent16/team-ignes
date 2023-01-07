((root, udf) => {
  root = root ?? this ?? {};
  if (!root.parent || !root.document) return;
  let doc = root.document;
  function handleSave (size, callback) {
    let source = doc.querySelector("canvas[data-thumbnail],canvas.thumbnail,canvas#thumbnail");
    let cnv = doc.createElement("canvas");
    let ctx = cnv.getContext("2d");
    let isSafe = false;

    cnv.width = cnv.height = size;


    if (source) {
      try {
        source.toBlob();
        isSafe = true;
      } catch (err) {
        alert ("Oh Noes! The canvas you are using for a thumbnail has been tainted!  Make sure any images you've drawn there follow the proper Cross-Origin protocol.");
      }
    }
    if (isSafe) {
      let r = source.width / source.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, cnv.width, cnv.height);
      ctx.drawImage(
        source,
        Math.min(0.5 * (size - size / r), 0),
        Math.min(0.5 * (size - size * r), 0),
        Math.max(source.width, size),
        Math.max(source.height, size)
      );
    } else {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, cnv.width, cnv.height);
      ctx.fillStyle = "grey";
      ctx.textAlign = "center";
      ctx.textBaseline = "center";
      ctx.font = (size * 2 / 3) + "px monospace bold";
      ctx.fillText("?", size / 2, size / 2);
    }

    callback(cnv.toDataURL());
  }
  root.parent.WebpageOutput.prototype.getScreenshot = handleSave;
}) (this);