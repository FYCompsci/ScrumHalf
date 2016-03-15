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
var started = false;

var level = 0;
var stage = 0;

var levelMap = [];
var puzzleMap = [
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0]
];

//image imports

var goldBlockImage = new Image();
goldBlockImage.src = "resources/goldBlock.png";

var grassBlockImage = new Image();
grassBlockImage.src = "resources/grassBlock.png";

var puzzleBlockImage = new Image();
puzzleBlockImage.src = "resources/skyBlock.png";

var ladderBlockImage = new Image();
ladderBlockImage.src = "resources/ladderBlock.png";

var fireBlockImage = new Image();
fireBlockImage.src = "resources/player.gif";

var skyBackgroundImage = new Image();
skyBackgroundImage.src = "resources/skyBackground.jpg";

var playerImage = new Image();

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
  constructor(x,y,width,height,lives,image){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.lives = lives;
    this.pieces = 0;
    this.jumping = false;
    this.climbing = false;
    this.falling = false;
    this.running = false;
    this.direction = "right";
    this.anim_frame = 0;
    this.image = image;
  }
  getLives(){
    return this.lives;
  }
  setLives(n){
    this.lives = n;
  }
  getPieces(){
    return this.pieces;
  }
  setPieces(n){
    this.pieces = n;
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
      this.move(0,-50);
    }
  }


  die(type){
    if (this.lives - 1 < 1){
      restartGame();
    }
    else{
      this.lives -= 1;
      alertText.setText("Oh no, you died by " + type + "!");
      alertText.setActivated(1);
      this.moveTo(5,7*50);
    }
  }

  checkCollision(x,y,width,height,direction,map){
    if (direction == "up"){
      if(map[(Math.floor(x/50))+(Math.floor((y-1)/50))*25] === 4){
        if (puzzleMap[level][stage] === 0){
          return 4;
        }
        else{
          return 0;
        }
      }
      else if(map[(Math.floor(x/50))+(Math.floor((y-1)/50))*25] === 5){
        return 5;
      }
      else if(map[(Math.floor(x/50))+(Math.floor((y-1)/50))*25] === 0 && y -5 > 0){
        return 0;
      }
      else{
        return 1;
      }
    }
    else if (direction == "down"){
      if(map[(Math.floor(x/50))+(Math.floor((y+height)/50))*25] == 4 || map[(Math.floor((x+width-5)/50))+(Math.floor((y+height)/50))*25] == 4){
        if (puzzleMap[level][stage] === 0){
          return 4;
        }
        else{
          return 0;
        }
      }
      else if(map[(Math.floor(x/50))+(Math.floor((y+height)/50))*25] == 5 || map[(Math.floor((x+width-5)/50))+(Math.floor((y+height)/50))*25] == 5){
        return 5;
      }
      else if (map[(Math.floor(x/50))+(Math.floor((y+height)/50))*25] === 0 && map[(Math.floor((x+width-5)/50))+(Math.floor((y+height)/50))*25] === 0){
        return 0;
      }
      else{
        return 1;
      }
    }
    else if (direction == "left"){
      if (map[(Math.floor((x)/50))+(Math.floor(y/50))*25] === 4 || map[(Math.floor((x-1)/50))+(Math.floor((y+height-1)/50))*25] === 4) {
        if (puzzleMap[level][stage] === 0){
          return 4;
        }
        else{
          return 0;
        }
      }
      else if (map[(Math.floor((x)/50))+(Math.floor(y/50))*25] === 5 || map[(Math.floor((x-1)/50))+(Math.floor((y+height-1)/50))*25] === 5) {
        return 5;
      }
      else if (map[(Math.floor((x)/50))+(Math.floor(y/50))*25] === 3 || map[(Math.floor((x-1)/50))+(Math.floor((y+height-1)/50))*25] === 3) {
        return 3;
      }
      else if (map[(Math.floor((x)/50))+(Math.floor(y/50))*25] === 0 && map[(Math.floor((x-1)/50))+(Math.floor((y+height-1)/50))*25] === 0) {
        return 0;
      }
      else{
        return 1;
      }
    }
    else if (direction == "right"){
      if(map[(Math.floor((x+width)/50))+(Math.floor(y/50))*25] === 4 || map[(Math.floor((x+width)/50))+(Math.floor((y+height-1)/50))*25] === 4){
        if (puzzleMap[level][stage] === 0){
          return 4;
        }
        else{
          return 0;
        }
      }
      else if(map[(Math.floor((x+width)/50))+(Math.floor(y/50))*25] === 5 || map[(Math.floor((x+width)/50))+(Math.floor((y+height-1)/50))*25] === 5){
        return 5;
      }
      else if(map[(Math.floor((x+width)/50))+(Math.floor(y/50))*25] === 3 || map[(Math.floor((x+width)/50))+(Math.floor((y+height-1)/50))*25] === 3){
        return 3;
      }
      else if (map[(Math.floor((x+width)/50))+(Math.floor(y/50))*25] === 0 && map[(Math.floor((x+width)/50))+(Math.floor((y+height-1)/50))*25] === 0){
        return 0;
      }
      else{
        return 1;
      }
    }
  }

  update(map){
    if (this.climbing === false){// falling code
      if (this.y + this.height + 5 > cheight){
        this.die("falling out of the world");
      }
      else if (this.checkCollision(this.x,this.y,this.width,this.height,"down",map) === 5){
        this.die("burning to death");
      }
      else if (this.checkCollision(this.x,this.y,this.width,this.height,"down",map) === 4){
        puzzleMap[level][stage] = 1;
        this.pieces += 1;
      }
      else if (this.checkCollision(this.x,this.y,this.width,this.height,"down",map) === 0){
        this.move(0,5);
        this.falling = true;
      }
      else{
        this.falling = false;
        this.jumping = false;
      }
    }
    this.climbing = false;
    this.running = false;
    for (var key in keysDown) { // n-key rollover movement code
      var value = Number(key);
      if (value == 38){ // up
        if (this.checkCollision(this.x,this.y,this.width,this.height,"up",map) === 5){
          this.die("burning to death");
        }
        else if (this.checkCollision(this.x,this.y,this.width,this.height,"up",map) === 4){
          puzzleMap[level][stage] = 1;
          this.pieces += 1;
        }
        else if (this.checkCollision(this.x,this.y,this.width,this.height,"left",map) === 3){
          if (this.checkCollision(this.x,this.y,this.width,this.height,"up",map) != 1){
            this.move(0,-5);
            this.climbing = true;
          }
        }
        else if (this.checkCollision(this.x,this.y,this.width,this.height,"right",map) === 3 && this.checkCollision(this.x,this.y,this.width,this.height,"up",map) === 0){
          this.move(0,-5);
          this.climbing = true;
        }
        else if (this.checkCollision(this.x,this.y,this.width,this.height,"up",map) === 0){
          this.jump();
        }
      }
      else if (value == 37) { // left
        if (this.x - 5 > 0){
          if (this.checkCollision(this.x,this.y,this.width,this.height,"left",map) === 5){
            this.die("burning to death");
          }
          else if (this.checkCollision(this.x,this.y,this.width,this.height,"left",map) === 4){
            puzzleMap[level][stage] = 1;
            this.pieces += 1;
          }
          else if (this.checkCollision(this.x,this.y,this.width,this.height,"left",map) === 0){
            this.move(-5,0);
          }
        }
        else{
          if (stage > 0){
            stage -= 1;
            alertText.setActivated(0);
            this.moveTo(cwidth-this.width-5,this.y);
          }
        }
        this.direction = "left";
        this.running = true;
      } else if (value == 39) { // right
        if (this.x + this.width + 5 < cwidth){
          if (this.checkCollision(this.x,this.y,this.width,this.height,"right",map) === 5){
            this.die("burning to death");
          }
          else if (this.checkCollision(this.x,this.y,this.width,this.height,"right",map) === 4){
            puzzleMap[level][stage] = 1;
            this.pieces += 1;
          }
          else if (this.checkCollision(this.x,this.y,this.width,this.height,"right",map) === 0){
            this.move(5,0);
          }
        }
        else{
          if (stage < 8){
            stage += 1;
            alertText.setActivated(0);
            this.moveTo(0,this.y);
          }
          else{
            if (this.pieces == 9){
              this.moveTo(0,this.y);
              newLevel();
            }
            else{
              alertText.setText("You don't have all 9 puzzle pieces!");
              alertText.setActivated(1);
            }
          }
        }
        this.direction = "right";
        this.running = true;
      }
    }
  }
  draw(){
    /*
    context.fillStyle = "#000000";
    context.fillRect(this.x, this.y, this.width, this.height);
    */
    var srcString = "resources/player/kirby";
    var needs_sprite = false;
    if (this.jumping === true || this.climbing === true){
      srcString += "Up";
    }
    else if (this.falling === true){
      srcString += "Down";
    }
    else if (this.running === true){
      srcString += "Run";
      needs_sprite = true;
    }
    else{
      srcString += "Normal";
      needs_sprite = true;
    }
    if (this.direction == "right"){
      srcString += "Right";
    }
    else{
      srcString += "Left";
    }
    this.image.src = srcString;
    context.drawImage(this.image, this.x,this.y);

    if (needs_sprite === true){
      srcString += "Spritesheet.png";
      this.image.src = srcString;
      context.drawImage(this.image, (Math.floor((this.anim_frame)/30)%(this.image.width/32))*32,0,32,32,this.x,this.y,32,32);
      this.anim_frame += 1;
    }
    else{
      srcString += ".png"
      this.image.src = srcString;
      context.drawImage(this.image, this.x,this.y);
      this.anim_frame = 0;
    }
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
  draw(){
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
  draw(){
    context.drawImage(this.image, (i%25)*50,(Math.floor(i/25))*50,50,50);
  }
}

//puzzle child class
class Puzzle extends Block{
  constructor (x,y,width,height,image){
    super(x,y,width,height);
    this.image = image;
  }
  draw(){
    context.drawImage(this.image, (i%25)*50,(Math.floor(i/25))*50,50,50);
  }
}

//obstacle child class
class Obstacle extends Block{
  constructor (x,y,width,height,image){
    super(x,y,width,height);
    this.image = image;
  }
  draw(){
    context.drawImage(this.image, (i%25)*50,(Math.floor(i/25))*50,50,50);
  }
}

class Alert{
  constructor(){
    this.text = "";
    this.x = 625;;
    this.y = 25;
    this.activated = false;
  }
  setActivated(key){
    if (key === 0){
      this.activated = false;
    }
    else{
      this.activated = true;
    }
  }
  setText(newText){
    this.text = newText;
  }
  draw(){
    context.fillStyle = "#d9534f";
    context.strokeStyle = "#d9534f";
    rect(150,3,950,32);
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.fillText(this.text,this.x,this.y);
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
      grassBlock.draw();
    }
    else if (map[i] == 2){
      goldBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      goldBlock.draw();
    }
    else if (map[i] == 3){
      goldBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      goldBlock.draw();
      ladderBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      ladderBlock.draw();
    }
    else if (map[i] == 4 && puzzleMap[level][stage] === 0){
      puzzleBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      puzzleBlock.draw();
    }
    else if (map[i] == 5){
      fireBlock.assign((i%25)*50,(Math.floor(i/25))*50);
      fireBlock.draw();
    }
    /*
    else{
      context.fillStyle = "lightblue";
      context.strokeStyle = "lightblue";
      rect((i%25)*50,(Math.floor(i/25)*50),50,50);
    }
    */
  }
}

function restartMap(){
  level = 0;
  stage = 0;
  player.setLives(3);
  player.moveTo(5,0);
  player.setPieces(0);
  puzzleMap = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
  ];
  alertText.setActivated(0);
}

function newLevel(){
  level += 1;
  stage = 0;
  player.setPieces(0);
  player.setLives(3);
}
//text functions

function renderText(){
  context.fillStyle = "black";
  context.font = "16px Arial";
  context.textAlign = "start";

  context.fillText(String(level+1) + "-" + String(stage+1),20,20);
  context.fillText("Lives: " + player.getLives(),1150,20);
  context.fillText("Pieces: " + player.getPieces(),1150,40);

  context.textAlign = "center";

  for (i = 0; i < world1_text[level][stage].length; i ++){
    context.fillText(world1_text[level][stage][i][0],world1_text[level][stage][i][1],world1_text[level][stage][i][2]);
  }

  if (alertText.activated === true){
    alertText.draw();
  }
}

// game functions
function beginGame(){
  started = true;
}
function restartGame(){
  restartMap();
  started = false;
}

// update button funciton
function updateButton(){
  if (started === true){
    $("#game-button").attr("onclick","restartGame()");
    $("#game-button").html("Restart Game");
  }
  else{
    $("#game-button").attr("onclick","beginGame()");
    $("#game-button").html("Start Game");
  }
}

//player declaration
var player = new Player(0,0,25,25,3,playerImage);

//other class declarations
var goldBlock = new Platform(0,0,50,50,goldBlockImage);
var grassBlock = new Platform(0,0,50,50,grassBlockImage);
var puzzleBlock = new Platform(0,0,50,50,puzzleBlockImage);
var ladderBlock = new Platform(0,0,50,50,ladderBlockImage);
var fireBlock = new Obstacle(0,0,50,50,fireBlockImage);

var alertText = new Alert();

// animation steps
var update = function(){
  updateButton();
  if (started === true){
    updateMap(1,level,stage);
    player.update(levelMap);
  }
};

var render = function () {
  if (started === false){ //start game screen
    context.textAlign = "center";
    context.fillStyle = "pink";
    context.fillRect(0, 0, cwidth, cheight);
    context.fillStyle = "#000000";
    context.font = "30px Arial";
    context.fillText("Welcome to team Scrum Half's game! Press the Start Game button!",625,285);
  }
  else{

    context.fillStyle = "lightblue";
    context.strokeStyle = "lightblue";
    rect(0,0,cwidth,cheight);

    //context.drawImage(skyBackgroundImage,0,0,cwidth,cheight);
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
