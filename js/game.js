//template
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
  window.setTimeout(callback, 1000 / 60);
};
var canvas = $("#game-canvas")[0];
var context = canvas.getContext('2d');
var width = 1250;
var height = 600;

var keysDown = {};

var update = function(){
    // template update function
}

var render = function () {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, width, height);
};

var step = function () {
    //update();
    render();
    animate(step);
};

animate(step);

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});
