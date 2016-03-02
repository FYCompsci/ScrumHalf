//template
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
  window.setTimeout(callback, 1000 / 60);
};
var canvas = $("#game-canvas")[0];
var context = canvas.getContext('2d');
var width = 1250;
var height = 600;

var keysDown = {};

function rect(x,y,w,h) {
  context.beginPath();
  context.rect(x,y,w,h);
  context.closePath();
  context.fill();
  context.stroke();
}
function renderMap(map){
  for (i = 0; i < map.length; i++){
    //console.log((i%25)*50);
    //console.log((i/25)*50);
    if (map[i] == 1){
      /*
      context.fillStyle = "green";
      context.strokeStyle = "black";
      rect((i%25)*50,(Math.floor(i/25))*50,50,50);
      */
      context.drawImage(grassBlock, (i%25)*50,(Math.floor(i/25))*50,50,50);
    }
    else if (map[i] == 2){
      context.drawImage(goldBlock, (i%25)*50,(Math.floor(i/25))*50,50,50);
    }
    else{

      context.fillStyle = "lightblue";
      context.strokeStyle = "lightblue";
      rect((i%25)*50,(Math.floor(i/25)*50),50,50);

      //context.drawImage(skyBlock, (i%25)*50,(Math.floor(i/25))*50,50,50);
    }
  }
}

//map elements
var goldBlock = new Image();
goldBlock.src = "resources/goldBlock.png";

var grassBlock = new Image();
grassBlock.src = "resources/grassBlock.png";

var skyBlock = new Image();
skyBlock.src = "resources/skyBlock.png";

var levelMap = [
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,
  0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];


// animation steps
var update = function(){
    // template update function
}

var render = function () {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    renderMap(levelMap);
};

var step = function () {
    //update();
    render();
    animate(step);
};

animate(step);


// key listeners

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});
