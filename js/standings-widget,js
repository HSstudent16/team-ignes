var standingsWidget = ((root, udf) => {
  root = root ?? this ?? {};
  if (!root.document) return;

  let doc = root.document, exports = {};

  const cnv = doc.querySelector("#main-standing-canvas");
  const ctx = cnv.getContext('2d');

  let hovering = false,
      mouseIsOver = false,
      looping = false,
      mayPause = true,
      mouseX = 0,
      mouseY = 0;

  function lerp (a, b, c) {
    return a + c * (b - a);
  }
  function loadImage (id) {
    let img = new Image();
    img.src = "https://www.khanacademy.org/computer-programming/i/"+id+"/latest.png";
    return img;
  }

  var maximum, bars = [];

  class Blurb {
    constructor (config) {
      this.message = config.message;
      this.x = config.x;
      this.y = config.y;
      this.width = config.width;
      this.height = config.height;
      if (this.width > this.height) {
        this.y -= this.width * 1.1;
      }
      this.fadeVal = 0;
      this.active = false;
    }

    display () {
      if (this.fadeVal < 0.0001) {
        return;
      }
      ctx.fillStyle = "rgba(0, 0, 0, " + Math.pow(this.fadeVal, 2) + ")";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.font = "16px Sans-serif";

      ctx.lineWidth = 2;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.beginPath();
      ctx.moveTo(200, 35);
      if (this.y > 40) {
        ctx.lineTo(200, Math.max(this.y - this.width * 0.5, 40));
        ctx.lineTo(this.x, Math.max(this.y - this.width * 0.5, 40));
        ctx.lineTo(this.x, this.y - 5);
      } else {
        ctx.lineTo(200, Math.max(this.y + this.width * 0.5, 40));
        ctx.lineTo(
          this.x > 200 ? this.x - this.width * 0.5 - 5 : this.x + this.width * 0.5 + 5,
            Math.max(this.y + this.width * 0.5, 40)
        );
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillText (this.message, 200, 30);
    }

    manage () {
      this.display ();

      if (this.active) {
        this.fadeVal = lerp(this.fadeVal, 1, 0.2);
      } else {
        this.fadeVal = lerp(this.fadeVal, 0, 0.2);
        if (this.fadeVal > 0.0001) {
          mayPause = false;
        }
      }
    }
  }

  class Bar {
    constructor (config) {
      this.x = config.index * 55 + 40;
      this.height = config.points * 300 / maximum;
      this.y = 350 - this.height;
      this.width = 45;

      this.points = config.points;
      this.image = config.image;
      this.name = config.name;
      this.color = config.color;
      this.rank = config.rank;

      this.fadeVal = 1;
      this.message = (
        "#" + this.rank + " - " + this.name.toUpperCase() + " with " + this.points + " points!"
      );
      this.blurb = new Blurb(this);
    }

    isMouseOver () {
      return (
        mouseX >= this.x - this.width * 0.5 - 5 &&
        mouseX < this.x + this.width * 0.5 + 5 &&
        mouseY > (this.width > this.height ? this.y - this.width * 1.1 : this.y) &&
        mouseY < 350
      );
    }

    display () {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = "black";

      ctx.beginPath();
      ctx.roundRect(
        this.x - this.width * 0.5, this.y,
        this.width, this.height,
        [5, 5, 0, 0]
      );
      ctx.fill();

      ctx.shadowBlur = 5;
      ctx.fillStyle = "white";
      ctx.translate(
        this.x,
        this.height > this.width ?
        this.y + this.width * 0.5 :
        this.y - this.width * 0.65
      );
      ctx.beginPath();

      if (this.height > this.width) {
        ctx.ellipse(
          0, 0,
          this.width * 0.45, this.width * 0.45,
          0, 0, Math.PI * 2
        );
      } else {
        ctx.ellipse(
          0, 0,
          this.width * 0.45, this.width * 0.45,
          0, 0, Math.PI * 2
        );
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fill();

      ctx.clip();
      ctx.drawImage(
        this.image,
        -this.width * 0.45, -this.width * 0.45,
        this.width * 0.9, this.width * 0.9
      );
      ctx.restore();
      ctx.translate(
        this.x,
        this.height > this.width ?
        this.y + this.width * 0.5 :
        this.y - this.width * 0.65
      );
      ctx.fillStyle = "rgba(255, 255, 255, " + this.fadeVal + ")";
      if (this.height < this.width) {
        ctx.beginPath();
        ctx.ellipse(
          0, 0,
          this.width * 0.45 + 5, this.width * 0.45 + 5,
          0, 0, Math.PI * 2
        );
        ctx.fill();
      }
      ctx.resetTransform();
      ctx.fillRect (
        this.x - this.width * 0.5 - 5,
        this.y - 5,
        this.width + 10,
        this.height + 5
      );
    }

    manage () {
      if (this.isMouseOver()) {
        hovering = true;
        this.fadeVal = lerp(this.fadeVal, 0, 0.2);
        this.blurb.active = true;
      } else {
        if (mouseIsOver) {
          this.fadeVal = lerp(this.fadeVal, 0.9, 0.2);
        } else {
          this.fadeVal = lerp(this.fadeVal, 0, 0.2);
          if (this.fadeVal > 0.0001) {
            mayPause = false;
          }
        }
        this.blurb.active = false;
      }
      this.display();
    }
  }

  function main () {
    mayPause = true;

    ctx.clearRect(0, 0, 400, 400);
    ctx.save();
    ctx.beginPath();
    ctx.rect (0, 0, 400, 350);
    ctx.clip();
    hovering = false;
    ctx.fillStyle = "black";
    ctx.shadowBlur = 0;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.font = "14px Sans-serif";
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "grey";
    for (var i = maximum / 10; i <= maximum; i += maximum / 10) {
      if (!Number.isInteger(i)) {
        continue;
      }
      ctx.fillText(i, 385, 350 - i * 300 / maximum);
      ctx.beginPath();
      ctx.moveTo(0, 350 - i * 300 / maximum);
      ctx.lineTo(400, 350 - i * 300 / maximum);
      ctx.stroke();
    }

    for (var i = 0; i < 6; i++) {
      bars[i].manage ();
    }
    for (var i = 0; i < 6; i++) {
      bars[i].blurb.manage();
    }

    mouseIsOver = hovering;
    if (mouseIsOver) {
      ctx.canvas.style.cursor = "pointer";
    } else {
      ctx.canvas.style.cursor = "default";
    }
    ctx.shadowBlur = 20;
    ctx.shadowColor = "black";
    ctx.fillStyle = "black";
    ctx.fillRect(0, 350, 400, 3);
    ctx.restore();


    if (!mayPause || looping) {
      window.requestAnimationFrame(main);
    }
  }

  function loop () {
    window.requestAnimationFrame(main);
    looping = true;
  }
  exports.loop = loop;

  function noLoop () {
    looping = false;
  }
  exports.noLoop = noLoop;

  function setMouseCoords (evt) {
    /* Adapted from p5.js */
    var a = cnv.getBoundingClientRect();
    mouseX = (
      cnv.width ?? cnv.scrollWidth) * (
      evt.clientX - a.left
    ) / cnv.scrollWidth | 0;
    mouseY = (
      cnv.height ?? cnv.scrollHeight) * (
      evt.clientY - a.top
    ) / cnv.scrollHeight | 0;
  }

  function init (teams) {
    var i, j;
    var ranks = [];
    maximum = 0;
    for (i = 0; i < 6; i++) {
      maximum = Math.max(maximum, teams[i].points);
      ranks.push(i);
      teams[i].index = i;
      teams[i].image = loadImage(teams[i].seedID);
    }

    maximum = Math.min(
      Math.pow(10, Math.ceil(Math.log(maximum / 25) / Math.log(10))) * 25,
      Math.pow(10, Math.ceil(Math.log(maximum) / Math.log(10)))
    );
    ranks.sort((a, b) => {
      return teams[b].points - teams[a].points;
    });

    for (i = 0; i < 6; i++) {
      j = ranks[i];
      teams[j].rank = i + 1;
      bars.push(new Bar(teams[j]));
    }

    cnv.addEventListener("mouseenter", loop);
    cnv.addEventListener("mouseleave", noLoop);
    cnv.addEventListener("mousemove", setMouseCoords);

    loop();
  }
  exports.init = init;

  return root.standingsWidget = exports;

}) (this);