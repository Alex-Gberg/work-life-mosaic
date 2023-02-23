let gridWidth = 13;

function reset() {
  sessionStorage.setItem("categories", JSON.stringify([]));

  let c = document.getElementById("myCanvas");
  let ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  drawGrid();
}

function addCategory() {
  let arr = JSON.parse(sessionStorage.getItem("categories"));
  arr.push([document.getElementById("category").value, document.getElementById("hours").value, document.getElementById("color").value]);
  sessionStorage.setItem("categories", JSON.stringify(arr));
}

function drawGrid() {
  let c = document.getElementById("myCanvas");
  let ctx = c.getContext('2d');
  ctx.strokeStyle = "black";

  let xvalue = 0;
  let yvalue = 0;

  for (let x = 0; x <= gridWidth * gridWidth; x++) {
    ctx.strokeRect(xvalue, yvalue, c.width/gridWidth, c.width/gridWidth);
    xvalue += c.width / gridWidth;
    if (xvalue > c.width - c.width / gridWidth) {
      xvalue = 0;
      yvalue += c.width / gridWidth;
    }
  }

  ctx.fillStyle = "black";
  ctx.fillRect(c.width-c.width/gridWidth, c.width-c.width/gridWidth, c.width/gridWidth, c.width/gridWidth);
}

function fillMosaic() {
  let c = document.getElementById("myCanvas");
  let ctx = c.getContext('2d');
  ctx.strokeStyle = "black";
  
  let xvalue = 0;
  let yvalue = 0;
  
  let drawn = 0;
  for (cat of JSON.parse(sessionStorage.getItem("categories"))) {
    ctx.fillStyle = cat[2];
    for (let x = 0; x < cat[1]; x++) {
      ctx.fillRect(xvalue, yvalue, c.width/gridWidth, c.width/gridWidth);
      ctx.strokeRect(xvalue, yvalue, c.width/gridWidth, c.width/gridWidth);
      drawn++;
      if (drawn >= gridWidth*gridWidth-1) {
        break;
      }

      xvalue += c.width/gridWidth;
      if (xvalue > c.width-c.width/gridWidth) {
        xvalue = 0;
        yvalue += c.width/gridWidth;
      }
    }

    if (drawn >= gridWidth * gridWidth - 1) {
      break;
    }
  }
}
