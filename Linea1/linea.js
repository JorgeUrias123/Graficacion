document.addEventListener('DOMContentLoaded', function(){
  // Obtener referencias a elementos del DOM
  var canvas = document.getElementById('canvas_id');
  var ctx = canvas.getContext('2d');
  var colorPicker = document.getElementById('colorPicker');
  var lineBtn = document.getElementById('btnRecta1');
  var ddalineBtn = document.getElementById('btnRectaDDA');
  var freehandBtn = document.getElementById('btnLapiz');
  var bresenhamBtn = document.getElementById('btnBresenham');  // Nuevo botón para Bresenham
  var lineas = [];
  var Dibujando = false;
  var mode = 'lapiz';  // Modo inicial

  // Función para obtener las coordenadas del mouse en el canvas
  function coordenadasMouse(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  // Función para dibujar una línea a mano alzada (freehand)
  function dibujar(puntos) {
    var color = colorPicker.value;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (var i = 0; i < puntos.length - 1; i++) {
      dibujarLinea(puntos[i], puntos[i + 1]);
    }
  }

  // Función para dibujar una línea recta
  function dibujarLinea(puntoInicio, puntoFinal) {
    var color = colorPicker.value;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    var deltax = puntoFinal.x - puntoInicio.x;
    var deltay = puntoFinal.y - puntoInicio.y;
    var steps = Math.max(Math.abs(deltax), Math.abs(deltay));

    for (var t = 0; t <= steps; t++) {
      var x = puntoInicio.x + t * (deltax / steps);
      var y = puntoInicio.y + t * (deltay / steps);
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Función para dibujar una línea usando el algoritmo DDA
  function dibujarDDALinea(puntoInicio, puntoFinal) {
    var color = colorPicker.value;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    var dx = puntoFinal.x - puntoInicio.x;
    var dy = puntoFinal.y - puntoInicio.y;
    var steps = Math.max(Math.abs(dx), Math.abs(dy));

    var xINC = dx / steps;
    var yINC = dy / steps;

    var x = puntoInicio.x;
    var y = puntoInicio.y;

    for (var k = 0; k < steps; k++) {
      ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
      x += xINC;
      y += yINC;
    }
  }

  // Función para dibujar una línea usando el algoritmo de Bresenham
  function dibujarBresenhamLinea(puntoInicio, puntoFinal) {
    var color = colorPicker.value;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    var x1 = puntoInicio.x;
    var y1 = puntoInicio.y;
    var x2 = puntoFinal.x;
    var y2 = puntoFinal.y;

    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;

    while (true) {
      ctx.fillRect(x1, y1, 2, 2);

      if (x1 === x2 && y1 === y2) break;

      var e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }


  // Función para iniciar el dibujo
  function iniciarDibujo(event) {
    Dibujando = true;
    var puntoInicio = coordenadasMouse(canvas, event);
    lineas.push({ type: mode, points: [puntoInicio] });
  }

  // Función para continuar el dibujo
  function continuarDibujo(event) {
    if (!Dibujando) return;
    var puntoActual = coordenadasMouse(canvas, event);
    lineas[lineas.length - 1].points.push(puntoActual);

    // Limpiar el canvas y dibujar todas las líneas actuales
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < lineas.length; i++) {
      var currentLine = lineas[i];
      if (currentLine.type === 'linea1') {
        dibujarLinea(currentLine.points[0], currentLine.points[currentLine.points.length - 1]);
      } else if (currentLine.type === 'dda') {
        dibujarDDALinea(currentLine.points[0], currentLine.points[currentLine.points.length - 1]);
      } else if (currentLine.type === 'bresenham') {
        dibujarBresenhamLinea(currentLine.points[0], currentLine.points[currentLine.points.length - 1]);
      } else if (currentLine.type === 'lapiz') {
        dibujar(currentLine.points);
      }
    }
  }

  // Función para detener el dibujo
  function detenerDibujo() {
    Dibujando = false;
  }

  // Eventos mouse para el canvas
  canvas.addEventListener('mousedown', iniciarDibujo);
  canvas.addEventListener('mousemove', continuarDibujo);
  canvas.addEventListener('mouseup', detenerDibujo);

  // Eventos para los botones
  lineBtn.addEventListener('click', function() {
    Dibujando = false;
    mode = 'linea1';
    lineas = [];
  });

  ddalineBtn.addEventListener('click', function() {
    Dibujando = false;
    mode = 'dda';
    lineas = [];
  });

  bresenhamBtn.addEventListener('click', function() {
    Dibujando = false;
    mode = 'bresenham';
    lineas = [];
  });

  freehandBtn.addEventListener('click', function() {
    Dibujando = false;
    mode = 'lapiz';
    lineas = [];
  });
});
