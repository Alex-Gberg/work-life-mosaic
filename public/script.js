let gridWidth = 13;

function randomColorCode() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function reset() {
  resetForm();
  resetTable();
  resetGrid();

  sessionStorage.setItem("categories", JSON.stringify([]));
}

function resetForm() {
  document.getElementById("category").value = "";
  document.getElementById("hours").value = "";
  document.getElementById("color").value = randomColorCode();
}

function resetTable() {
  let table = document.getElementById("table");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  addRow("...", "...", "white", true);
}

function addCategory() {
  let arr = JSON.parse(sessionStorage.getItem("categories"));
  if (arr.reduce((a,b) => a + parseInt(b[1]), 0) + parseInt(document.getElementById("hours").value) <= gridWidth * gridWidth - 1) {
    let cat = document.getElementById("category").value;
    let hours = document.getElementById("hours").value;
    let color = document.getElementById("color").value;
    arr.push([cat, hours, color]);
    sessionStorage.setItem("categories", JSON.stringify(arr));
    resetForm();
    addRow(cat, hours, color);
  }
}

function addRow(category, hours, color, placeholder=false) {
  let table = document.getElementById("table");
  if (!placeholder && table.rows.item(1).cells.item(0).innerHTML == "...") {
    table.deleteRow(1);
  }

  let row = table.insertRow(-1);
  row.style = "background-color: " + color + ";";
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);

  cell1.innerHTML = category;
  cell2.innerHTML = hours;
  if (placeholder) {
    cell3.innerHTML = "...";
  }
  else {
    cell3.innerHTML = '<button class="btn btn-danger" onclick="removeEntry(this)">X</button>';
  }
}

function removeEntry(btn) {
  let row = btn.parentNode.parentNode;
  let index = row.rowIndex;
  removeRow(index);
  removeCategory(index);
}

function removeRow(index) {
  let table = document.getElementById("table");
  table.deleteRow(index);
}

function removeCategory(index) {
  let arr = JSON.parse(sessionStorage.getItem("categories"));
  arr.splice(index-1, 1);
  sessionStorage.setItem("categories", JSON.stringify(arr));
}

function resetGrid() {
  let c = document.getElementById("myCanvas");
  let ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  
  let xvalue = 0;
  let yvalue = 0;
  
  ctx.strokeStyle = "black";
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
  resetGrid();
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
