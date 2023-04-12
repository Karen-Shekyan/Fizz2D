const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

function getMousePos() {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function drawAt() {
  var pos = getMousePos();
  ctx.beginPath();
  ctx.arc(pox.x, pos.y, 20, 0, MATH.PI * 2, true);
  ctx.stroke();
}
