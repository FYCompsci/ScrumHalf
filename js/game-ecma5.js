var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
  var canvas = $("#game-canvas")[0];
  var context = canvas.getContext('2d');
  var width = 1250;
  var height = 600;
  var keysDown = {};
  var started = false;
  function rect(x, y, w, h) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.closePath();
    context.fill();
    context.stroke();
  }
  var Player = function() {
    function Player(x, y, jumping, falling) {
      this.x = x;
      this.y = y;
      this.jumping = jumping;
      this.falling = falling;
    }
    return ($traceurRuntime.createClass)(Player, {
      move: function(deltax, deltay) {
        this.x += deltax;
        this.y += deltay;
      },
      update: function(map) {
        for (var key in keysDown) {
          var value = Number(key);
          if (value == 38) {} else if (value == 37) {
            if (this.x - 5 > 0) {
              this.move(-5, 0);
            }
          } else if (value == 39) {
            if (this.x + 55 < width) {
              this.move(5, 0);
            }
          }
        }
        if (this.jumping === false) {
          if (map[(Math.floor(this.x / 50)) + (Math.floor(this.y / 50) + 1) * 25] === 0) {
            this.move(0, 5);
          }
        }
      },
      draw: function() {
        context.drawImage(playerImage, this.x, this.y);
      }
    }, {});
  }();
  function renderMap(map) {
    for (i = 0; i < map.length; i++) {
      if (map[i] == 1) {
        context.drawImage(grassBlock, (i % 25) * 50, (Math.floor(i / 25)) * 50, 50, 50);
      } else if (map[i] == 2) {
        context.drawImage(goldBlock, (i % 25) * 50, (Math.floor(i / 25)) * 50, 50, 50);
      } else {
        context.fillStyle = "lightblue";
        context.strokeStyle = "lightblue";
        rect((i % 25) * 50, (Math.floor(i / 25) * 50), 50, 50);
      }
    }
  }
  function beginGame() {
    started = true;
  }
  var player = new Player(0, 0, false, false);
  var goldBlock = new Image();
  goldBlock.src = "resources/goldBlock.png";
  var grassBlock = new Image();
  grassBlock.src = "resources/grassBlock.png";
  var skyBlock = new Image();
  skyBlock.src = "resources/skyBlock.png";
  var playerImage = new Image();
  playerImage.src = "resources/player.gif";
  var levelMap = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  var update = function() {
    if (started === true) {
      player.update(levelMap);
    }
  };
  var render = function() {
    if (started === false) {
      context.fillStyle = "#000000";
      context.fillRect(0, 0, width, height);
    } else {
      context.fillStyle = "#000000";
      context.fillRect(0, 0, width, height);
      renderMap(levelMap);
      player.draw();
    }
  };
  var step = function() {
    update();
    render();
    animate(step);
  };
  animate(step);
  window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
  });
  window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
  });
