let gridWidth = 13;

function randomColorCode() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function reset() {
  resetForm();

  sessionStorage.setItem("categories", JSON.stringify([]));

  let c = document.getElementById("myCanvas");
  let ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  drawGrid();
}

function resetForm() {
  document.getElementById("category").value = "";
  document.getElementById("hours").value = "";
  document.getElementById("color").value = randomColorCode();
}

function addCategory() {
  let arr = JSON.parse(sessionStorage.getItem("categories"));
  if (arr.reduce((a,b) => a + parseInt(b[1]), 0) + parseInt(document.getElementById("hours").value) <= gridWidth * gridWidth - 1) {
    arr.push([document.getElementById("category").value, document.getElementById("hours").value, document.getElementById("color").value]);
    sessionStorage.setItem("categories", JSON.stringify(arr));
    resetForm();
  }
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
  for (cat of JSON.parse(sessionStorage.getItem("categories")).sort((a,b) => {
    return b[1] - a[1];
  })) {
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

document.getElementById('form').addEventListener('submit', event => {
  addCategory();
  event.preventDefault();
});
