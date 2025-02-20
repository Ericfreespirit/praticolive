'use strict';

(function() {

  var socket = io();
  const canvas = document.getElementsByClassName('whiteboard')[0];
  var pencil = document.getElementById('tool_pencil');
  var eraser = document.getElementById('tool_eraser');
  const context = canvas.getContext('2d');

  var current = {
    color: 'blue'
  };
  var drawing = false;

  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  
  //Touch support for mobile devices
  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

  pencil.addEventListener('click',function(){
    current.color = "blue"
  },false);
  eraser.addEventListener('click',function(){
    current.color = "white"
  },false);

  socket.on('drawing', onDrawingEvent);

  window.addEventListener('resize', onResize, false);
  onResize();

  function drawLine(x0, y0, x1, y1, color, emit){
    context.beginPath();
    context.moveTo(x0 - (canvas.offsetLeft), y0 - (canvas.offsetTop));
    context.lineTo(x1 - (canvas.offsetLeft), y1 - (canvas.offsetTop));
    context.strokeStyle = color;
    context.lineCap = "round";

    if (color == "blue")
    {
      context.lineWidth = 2;
    }
    else if(color == "white")
    {
      context.lineWidth = 70;
    }  
    context.stroke();
    context.closePath();

    if (!emit) { return;}
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('drawing', {
      x0: x0  / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1/ h,
      color: color
    });
  }

  function onMouseDown(e){
    drawing = true;
    e.preventDefault();
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);

  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    e.preventDefault();
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    e.preventDefault();
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth - 25;
    canvas.height = window.innerHeight - 150;
  }
})();
