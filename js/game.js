//initial animate function
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
  window.setTimeout(callback, 1000 / 60);
};

//canvas-based var declarations
var canvas = $("#game-canvas")[0];
var context = canvas.getContext('2d');
var cwidth = 1250;
var cheight = 600;

//declare key related array
var keysDown = {};

//game-related var declarations
var levelMap = [];
var level = 0;
var stage = 0;
var started = false;

//make rectangle function
function rect(x,y,w,h) {
  context.beginPath();
  context.rect(x,y,w,h);
  context.closePath();
  context.fill();
  context.stroke();
}

//player class
class Player {
  constructor(x,y,width,height,lives,jumping,climbing){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.lives = lives;
    this.jumping = jumping;
    this.climbing = climbing;
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
      this.jumping = true;
      this.move(0,-10);
      setTimeout(this.jumpOver(),1000);
    }
  }
  jumpOver(){
    if (this.jumping === true){
      this.jumping = false;
    }
  }

  die(){
    if (this.lives - 1 < 1){
      this.gameOver();
    }
    else{
      this.lives -= 1;
      this.moveTo(5,7*50);
    }
  }

  gameOver(){
    level = 0;
    stage = 0;
    this.lives = 3;
    this.moveTo(5,0);
  }

  update(map){
    if (this.jumping === false && this.climbing === false){// falling code
      if (this.y + this.height + 5 > cheight){
        this.die();
      }
      else if (map[(Math.floor(this.x/50))+(Math.floor((this.y+this.height)/50))*25] === 0 && map[(Math.floor((this.x+this.width-5)/50))+(Math.floor((this.y+this.height)/50))*25] === 0){
        this.move(0,5);
      }
    }
    for (var key in keysDown) { // n-key rollover movement code
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
          if (map[(Math.floor((this.x)/50))+(Math.floor(this.y/50))*25] === 0 && map[(Math.floor((this.x-1)/50))+(Math.floor((this.y+this.height-1)/50))*25] === 0) {
            this.move(-5, 0);
          }
        }
        else{
          if (stage > 0){
            stage -= 1;
            this.moveTo(cwidth-this.width-5,this.y);
          }
        }
      } else if (value == 39) { // right
        if (this.x + this.width + 5 < cwidth){
          if (map[(Math.floor((this.x+this.width)/50))+(Math.floor(this.y/50))*25] === 0 && map[(Math.floor((this.x+this.width)/50))+(Math.floor((this.y+this.height-1)/50))*25] === 0){
            this.move(5, 0);
          }
        }
        else{
          if (stage < 8){
            stage += 1;
          }
          else{
            level += 1;
            stage = 0;
          }
          this.moveTo(0,this.y);
        }
      }
    }
  }
  draw(){
    context.fillStyle = "#000000";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

// block default class
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

//platform child class
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

function updateMap(world,stg,lvl){
  if (world == 1){
    levelMap = world1_map[stg][lvl];
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
    else if (map[i] == 3){
      ladderBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      ladderBlock.draw(map);
    }
    else if (map[i] == 4){
      puzzleBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      puzzleBlock.draw(map);
    }
    else{
      context.fillStyle = "lightblue";
      context.strokeStyle = "lightblue";
      rect((i%25)*50,(Math.floor(i/25)*50),50,50);
    }
  }
}

//text functions

function renderText(){
  context.fillStyle = "#000000";
  context.font = "16px Arial";
  context.fillText(String(level+1) + "-" + String(stage+1),20,20);
  context.fillText("Lives: " + player.lives,1150,20);
  context.fillText("Pieces: 0",1150,40);
  //for (i = 0; i < world1_text[level][stage].length, i ++;){
    context.fillText(world1_text[level][stage][0],world1_text[level][stage][1],world1_text[level][stage][2]);
  //}
}

function beginGame(){
  started = true;
}

//image imports

var goldBlockImage = new Image();
goldBlockImage.src = "resources/goldBlock.png";

var grassBlockImage = new Image();
grassBlockImage.src = "resources/grassBlock.png";

var puzzleBlockImage = new Image();
puzzleBlockImage.src = "resources/skyBlock.png";

var ladderBlockImage = new Image();
ladderBlockImage.src = "resources/ladderBlock.jpg";


/*
var skyBlockImage = new Image();
skyBlockImage.src = "resources/skyBlock.png";

var playerImage = new Image();
playerImage.src = "resources/player.gif";
*/

//player declaration
var player = new Player(0,0,25,50,3,false,false);

//other class declarations
var goldBlock = new Platform(0,0,50,50,goldBlockImage);
var grassBlock = new Platform(0,0,50,50,grassBlockImage);
var puzzleBlock = new Platform(0,0,50,50,puzzleBlockImage);
var ladderBlock = new Platform(0,0,50,50,ladderBlockImage);

// animation steps
var update = function(){
  if (started === true){
    updateMap(1,level,stage);
    player.update(levelMap);
  }
};

var render = function () {
  if (started === false){ //start game screen
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, cwidth, cheight);
    context.fillStyle = "#000000";
    context.font = "30px Arial";
    context.fillText("Welcome to team Scrum Half's game! Press the Start Game button!",100,300);
  }
  else{
    renderMap(levelMap);
    player.draw();
    renderText();
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
