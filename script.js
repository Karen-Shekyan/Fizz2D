// wait for the content of the window element to load, then performs the operations.
window.addEventListener('load', ()=>{

    resize(); // Resizes the canvas once the window loads
    document.addEventListener('mousedown', startPainting);
    // document.addEventListener('mouseup', stopPainting);
    // document.addEventListener('mousemove', sketch);
    window.addEventListener('resize', resize);
});

const canvas = document.querySelector('#canvas');

// Context for the canvas for 2 dimensional operations
const ctx = canvas.getContext('2d');

// Resizes the canvas to the available size of the window.
function resize() {
  ctx.canvas.width = window.innerWidth - 300;
  ctx.canvas.height = window.innerHeight - 100;
}


let coord = {x:0 , y:0};
let paint = false;
const positions = [];
const velocities = [];

// Updates the coordianates of the cursor when
// an event e is triggered to the coordinates where
// the said event is triggered.
function getPosition(event) {
  coord.x = event.clientX - canvas.offsetLeft;
  coord.y = event.clientY - canvas.offsetTop;
}

// The following functions toggle the flag to start
// and stop drawing
function startPainting(event) {
  // paint = true;
  // getPosition(event);
  // ctx.beginPath();
  //
  getPosition(event);
  // ctx.arc(coord.x, coord.y, 50, 0, Math.PI * 2, true);
  //
  // ctx.stroke();

  positions.push([coord.x, coord.y]);
  velocities.push([0,0]);
}

var clear = (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

function stopPainting() {
  paint = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function sketch(event) {
  if (!paint) return;
  ctx.beginPath();

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'black';

  ctx.moveTo(coord.x, coord.y);

  getPosition(event);

  ctx.lineTo(coord.x , coord.y);

  ctx.stroke();
}


///////////////////////////////////
///////// ANIMATION STUFF /////////
///////////////////////////////////

var requestID;
var grav = 5;

var step = () => {
  // window.cancelAnimationFrame(requestID);

  clear();

  for (let i = 0; i < velocities.length; i++) {
    ctx.beginPath();
    ctx.arc(positions[i][0], positions[i][1], 50, 0, Math.PI * 2, true);
    ctx.stroke();

    // apply gravity. MOVE TO METHOD LATER
    velocities[i][1] += grav;
    positions[i][1] += velocities[i][1];

    //floor collision           //note the radius here is 50
    if (positions[i][1] >= canvas.height - 50) {
      positions[i][1] = canvas.height - 50;
    }
  }

  requestID = window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);
