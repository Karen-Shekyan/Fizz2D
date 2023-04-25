// Setup
window.addEventListener('load', () => {
    resize();
    document.addEventListener('mousedown', addObject);
    window.addEventListener('resize', resize);
});

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

function resize() {
  ctx.canvas.width = window.innerWidth - 300;
  ctx.canvas.height = window.innerHeight - 100;
}

// Globals
let coord = {x:0 , y:0};
const positions = [];
const velocities = [];
var requestID;
var grav = 5;

// Update methods
function getPosition(event) {
  coord.x = event.clientX - canvas.offsetLeft;
  coord.y = event.clientY - canvas.offsetTop;
}

function addObject(event) {
  getPosition(event);

  positions.push([coord.x, coord.y]);
  velocities.push([0,0]);
}

var clear = (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

///////////////////////////////////
///////// ANIMATION STUFF /////////
///////////////////////////////////

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
