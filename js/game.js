//initial animate function
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
  window.setTimeout(callback, 1000 / 60);
};

//canvas-based var declaration
var canvas = $("#game-canvas")[0];
var context = canvas.getContext('2d');
var width = 1250;
var height = 600;

//declare key related array
var keysDown = {};

//declare game related empties/start content
var started = false;


function rect(x,y,w,h) {
  context.beginPath();
  context.rect(x,y,w,h);
  context.closePath();
  context.fill();
  context.stroke();
}

class Player {
  constructor(x,y,jumping,falling){
    this.x = x;
    this.y = y;
    this.jumping = jumping;
    this.falling = falling;
  }
  move(deltax, deltay){
    this.x += deltax;
    this.y += deltay;
  }
  jump(){
    if (this.jumping === false){
      console.log("START JUMP");
      this.jumping = true;
      this.move(0,-5);
      setTimeout(this.jumpOver(),1000);
    }
  }
  jumpOver(){
    console.log("END JUMP");
    this.jumping = false;
  }
  update(map){
    for (var key in keysDown) {
      var value = Number(key);
      if (value == 38){
        this.jump();
      }
      else if (value == 37) {
        if (this.x - 5 > 0){
          this.move(-5, 0);
        }
      } else if (value == 39) {
        if (this.x + 55 < width){
          this.move(5, 0);
        }
      }
    }
    if (this.jumping === false){
      if (map[(Math.floor(this.x/50))+(Math.floor(this.y/50)+1)*25] == 0){
        this.move(0,5);
      }
    }
  }
  draw(){
    context.drawImage(playerImage, this.x, this.y);
  }
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

function beginGame(){
  started = true;
}

//player declaration
var player = new Player(0,0,false,false);

//map elements
var goldBlock = new Image();
goldBlock.src = "resources/goldBlock.png";

var grassBlock = new Image();
grassBlock.src = "resources/grassBlock.png";

var skyBlock = new Image();
skyBlock.src = "resources/skyBlock.png";

var playerImage = new Image();
playerImage.src = "resources/player.gif";

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
  if (started === true){
    player.update(levelMap);
  }
};

var render = function () {
  if (started === false){
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
  }
  else{
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
    renderMap(levelMap);
    player.draw();
  }
};

var step = function () {
  update();
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
