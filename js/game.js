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

var levelMap = [];
var level = 0;
var stage = 0;

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
  constructor(x,y,width,height,jumping,falling){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.jumping = jumping;
    this.falling = falling;
  }
  move(deltax, deltay){
    this.x += deltax;
    this.y += deltay;
  }

  moveTo(x,y){
    this.x = x;
    this.y = y;
  }

  jump(){
    if (this.jumping === false){
      //console.log("START JUMP");
      this.jumping = true;
      this.move(0,-10);
      window.setTimeout(this.jumpOver(),1000);
    }
  }
  jumpOver(){
    if (this.jumping === true){
      //console.log("END JUMP");
      this.jumping = false;
    }
  }

  update(map){
    if (this.jumping === false){
      if (map[(Math.floor(this.x/50))+(Math.floor((this.y+this.height)/50))*25] === 0 && map[(Math.floor((this.x+this.width-5)/50))+(Math.floor((this.y+this.height)/50))*25] === 0){
        this.move(0,5);
      }
    }
    for (var key in keysDown) {
      var value = Number(key);
      if (value == 38){ // up
        if (this.y -5 > 0){
          if (map[(Math.floor(this.x/50))+(Math.floor((this.y-1)/50))*25] === 0){
            this.jump();
          }
        }
      }
      else if (value == 37) { // left
        if (this.x - 5 > 0){
          if (map[(Math.floor(this.x/50))+(Math.floor(this.y/50))*25] === 0){
            this.move(-5, 0);
          }
        }
        else{
          console.log("Hit the edge.");
        }
      } else if (value == 39) { // right
        if (this.x + this.width + 5 < width){
          if (map[(Math.floor((this.x+this.width)/50))+(Math.floor(this.y/50))*25] === 0){
            this.move(5, 0);
          }
        }
        else{
          stage += 1;
          updateMap(1,level,stage);
        }
      }
    }
    /*
    if (map[(Math.floor((this.x)/50))+(Math.floor((this.y)/50))*25] === 2){
      this.moveTo(this.x,Math.floor((this.y-50)/50)*50);
    }
    */
  }
  draw(){
    //context.drawImage(playerImage, this.x, this.y);
    context.fillStyle = "#000000";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Block {
  constructor (x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  assign(newx,newy){
    this.x = newx;
    this.y = newy;
  }
  draw(map){
    context.fillStyle = "#000000";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Platform extends Block {
  constructor (x,y,width,height,image){
    super(x,y,width,height);
    this.image = image;
  }
  draw(map){
    context.drawImage(this.image, (i%25)*50,(Math.floor(i/25))*50,50,50);
  }
}

//map functions

function updateMap(world,stage,level){
  if (world == 1){
    levelMap = world1[stage][level];
  }
}

function renderMap(map){
  for (i = 0; i < map.length; i++){
    if (map[i] == 1){
      grassBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      grassBlock.draw(map);
    }
    else if (map[i] == 2){
      goldBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      goldBlock.draw(map);
    }
    else{
      context.fillStyle = "lightblue";
      context.strokeStyle = "lightblue";
      rect((i%25)*50,(Math.floor(i/25)*50),50,50);
    }
  }
}

function beginGame(){
  updateMap(1,level,stage);
  started = true;
}

//image imports

var goldBlockImage = new Image();
goldBlockImage.src = "resources/goldBlock.png";

var grassBlockImage = new Image();
grassBlockImage.src = "resources/grassBlock.png";

/*
var skyBlockImage = new Image();
skyBlockImage.src = "resources/skyBlock.png";

var playerImage = new Image();
playerImage.src = "resources/player.gif";
*/

//player declaration
var player = new Player(0,0,25,50,false,false);

//other class declarations
var goldBlock = new Platform(0,0,50,50,goldBlockImage);
var grassBlock = new Platform(0,0,50,50,grassBlockImage);

// animation steps
var update = function(){
  if (started === true){
    player.update(levelMap);
  }
};

var render = function () {
  if (started === false){ //start game screen
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#000000";
    context.font = "30px Arial";
    context.fillText("Welcome to team Scrum Half's game! Press the Start Game button!",100,300);
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
