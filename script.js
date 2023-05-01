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
const radii = [];      // CURRENTLY UNUSED
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

// Helper methods
var dot = (v1,v2) => {
  var ans = 0;
  for (let i = 0; i < v1.length; i++) {
    ans += v1[i] * v2[i];
  }

  return ans;
};

var getSqMag = (v) => {
  ans = 0;
  for (let i = 0; i < v.length; i++) {
    ans += v[i] * v[i];
  }

  return ans;
};

var getNorm = (v) => {
  var m = Math.sqrt(getSqMag(v));             // NOT GOOD; how to avoid root?
  var n = [];

  for (let i = 0; i < v.length; i++) {
    n.push(v[i] / m);
  }
  return n;
};

///////////////////////////////////
///////// ANIMATION STUFF /////////
///////////////////////////////////

var step = () => {
  // window.cancelAnimationFrame(requestID);

  clear();

  for (let i = 0; i < positions.length; i++) {
    var collided = false;
    // apply gravity. MOVE TO METHOD LATER
    velocities[i][1] += grav;
    // positions[i][1] += velocities[i][1];

    var v = velocities[i];

    // collide with other stuff
    for (let j = 0; j < positions.length; j++) {
      if (i != j) {
        var c = [positions[j][0] - positions[i][0], positions[j][1] - positions[i][1]];
        if (dot(v,c) > 0) { // check direction
          // proj c on v
          var n = getNorm(v);
          var d = dot(n,c);
          // closest approach
          var magcSQ = getSqMag(c);
          var f = magcSQ - d * d;
          // console.log(magcSQ, d, v);

          if (f < 100 * 100) { // check closest distance
            // distance to be travelled to collide
            var t = 100 * 100 - f;
            var distance = d - Math.sqrt(t);
            if (distance * distance <= getSqMag(v)) { // check distance travelable
              positions[i][0] += n[0] * distance;
              positions[i][1] += n[1] * distance;
              collided = true;
              // console.log(collided);
            }
          }
        }
      }
    }

    if (!collided) {
      positions[i][0] += velocities[i][0];
      positions[i][1] += velocities[i][1];
    }

    // floor collision          // note the radius here is 50
    if (positions[i][1] >= canvas.height - 50) {
      positions[i][1] = canvas.height - 50;
    }

    ctx.beginPath();
    ctx.arc(positions[i][0], positions[i][1], 50, 0, Math.PI * 2, true);
    ctx.stroke();
  }

  requestID = window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);
