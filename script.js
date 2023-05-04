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
const masses = [];
const radii = [];      // CURRENTLY UNUSED
var requestID;
var grav = 0.5;

// Update methods
function getPosition(event) {
  coord.x = event.clientX - canvas.offsetLeft;
  coord.y = event.clientY - canvas.offsetTop;
}

function addObject(event) {
  getPosition(event);

  positions.push([coord.x, coord.y]);

  // MOVING COLLISION TESTS
  positions.push([ctx.canvas.width - coord.x, coord.y]);
  masses.push(50);

  masses.push(50);
  if (coord.x < ctx.canvas.width / 2) {
    velocities.push([5,0]);
    velocities.push([-3,0]);
  } else {
    velocities.push([-5,0]);
    velocities.push([3,0]);
  }

  // velocities.push([0,0]);
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
  window.cancelAnimationFrame(requestID);

  clear();

  for (let i = 0; i < positions.length; i++) {
    console.log(velocities[i]);
    var collided = false;
    // apply gravity. MOVE TO METHOD LATER?
    velocities[i][1] += grav;

    var v = velocities[i];
    var n = getNorm(v);
    var distancePercent = 1;

    var collidedWith = -1;

    // collide with other stuff
    for (let j = 0; j < positions.length; j++) {
      if (i != j) {
        var relativeV = [v[0] - velocities[j][0], v[1] - velocities[j][1]];
        // console.log(relativeV);
        var nRel = getNorm(relativeV);
        var c = [positions[j][0] - positions[i][0], positions[j][1] - positions[i][1]];

        if (dot(relativeV,c) > 0) { // check direction
          // proj c on v
          var d = dot(nRel,c);
          // closest approach
          var magcSQ = getSqMag(c);
          var f = magcSQ - d * d;
          // console.log(magcSQ, d, v);

          if (f < 100 * 100) { // check closest distance
            // distance to be travelled to collide
            var t = 100 * 100 - f;
            var newDistance = d - Math.sqrt(t);

            if (newDistance * newDistance <= getSqMag(relativeV)) { // check distance travelable
              // distance = newDistance;
              // positions[i][0] += n[0] * distance;
              // positions[i][1] += n[1] * distance;
              if (newDistance * newDistance / getSqMag(relativeV) < distancePercent) {
                distancePercent = newDistance * newDistance / getSqMag(relativeV);
                collidedWith = j;
                console.log(collidedWith);
              }
              // distancePercent = Math.min(distancePercent, newDistance * newDistance / getSqMag(relativeV));
              collided = true;
            }
          }
        }
      }
    }
    // console.log(masses);


    if (!collided) {
      positions[i][0] += velocities[i][0];
      positions[i][1] += velocities[i][1];
    }
    else {
      // positions[i][0] += velocities[i][0] * Math.sqrt(distancePercent);
      // positions[i][1] += velocities[i][1] * Math.sqrt(distancePercent);
      // console.log(distancePercent);
      // console.log(collidedWith);
      var centersV = [positions[collidedWith][0] - positions[i][0], positions[collidedWith][1] - positions[i][1]];
      // var centersV = [positions[i][0] - positions[collidedWith][0], positions[i][1] - positions[collidedWith][1]];
      centersV = getNorm(centersV);

      var a1 = dot(velocities[i], centersV);
      var a2 = dot(velocities[collidedWith], centersV);
      var optimizedP = 2.0 * (a1 - a2) / (masses[i] + masses[collidedWith]);

      velocities[i] = [velocities[i][0] - optimizedP * masses[collidedWith] * centersV[0],
                       velocities[i][1] - optimizedP * masses[collidedWith] * centersV[1]];

      positions[i][0] += velocities[i][0];
      positions[i][1] += velocities[i][1];
      // console.log(mass);
    }

    // floor collision          // note the radius here is 50
    if (positions[i][1] >= canvas.height - 50) {
      positions[i][1] = canvas.height - 50;
    }
    // console.log(distance);


    ctx.beginPath();
    ctx.arc(positions[i][0], positions[i][1], 50, 0, Math.PI * 2, true);
    ctx.stroke();
  }

  requestID = window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);
