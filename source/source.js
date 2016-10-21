'use-strict';
var gl;
var canvas;

var puntos = [];
var colores = [];
var vob;
var cob;

var vPosition;
var vColor;


var tetaX = 0;
var matRotX = getMatrizIdentidad();

var tetaY = 0;
var matRotY = getMatrizIdentidad();

var tetaZ = 0;
var matRotZ = getMatrizIdentidad();


window.onload = function main(){
    //alert(combinatoria(5, 0));
    //alert(bernstein(5, 0, 3));
  canvas = document.getElementById('lienzo');
  if(!canvas){alert("Canvas no esta disponible");}

  //...Canvas Tamaño.....
  canvas.width = 600;
  canvas.height = 600;
  //.....................

  gl = getWebGLContext(canvas);
  if(!gl){alert("WebGL no esta disponible");}

  //Tamaño del viewport
  gl.viewport(0, 0, canvas.width, canvas.height);
  //Color del repintado
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var programa = initShaders(gl, "vertexShader", "fragmentShader");
  gl.useProgram(programa);

  vPosition = gl.getAttribLocation(programa, "vPosition");
  //
  gl.enableVertexAttribArray(vPosition);

  vColor = gl.getAttribLocation(programa, "aVertexColor");
  //
  gl.enableVertexAttribArray(vColor);


  vob = gl.createBuffer();

  //Buffer de Color
  cob = gl.createBuffer();
  //initBuffers();

  eventos();

  render();

};

function render(){

  puntos = [];
  getEjes();
    puntos.push(vec4(0.1, 0.1, 0.0, 1.0));
    colores.push(vec4(1, 1, 1, 1.0));
    puntos.push(vec4(0.4, 0.9, 0.0, 1.0));
    colores.push(vec4(1, 1, 1, 1.0));
    puntos.push(vec4(0.8, 0.2, 0.0, 1.0));
    colores.push(vec4(1, 1, 1, 1.0));
    puntos.push(vec4(-0.5, -0.2, 0.0, 1.0));
    colores.push(vec4(1, 1, 1, 1.0));


    bezier([vec4(0.1, 0.1, 0.0, 1.0),
            vec4(0.4, 0.9, 0.0, 1.0),
            vec4(0.8, 0.2, 0.0, 1.0),
            vec4(-0.5, -0.2, 0.0, 1.0)]);
  //console.log(puntos);
  puntos = rotarX(puntos);
  puntos = rotarY(puntos);

  gl.bindBuffer(gl.ARRAY_BUFFER, vob);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(puntos), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, cob);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colores), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, vob);
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, cob);
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINES, 0, 6);
    gl.drawArrays(gl.POINTS, 6, 3);

  gl.drawArrays(gl.POINTS, 9, puntos.length-9);

}


function eventos(){
  //Para rotar con la teclas direccionales:
  document.addEventListener("keydown", function(e)  {
    var codigoTecla = e.keyCode;
    switch (codigoTecla) {
      case 37:
                tetaY = tetaY - 0.01;
                matRotY[0][0] = Math.cos(tetaY);
                matRotY[0][2] = Math.sin(tetaY);
                matRotY[2][0] = -Math.sin(tetaY);
                matRotY[2][2] = Math.cos(tetaY);
                render();
                break;
      case 38:
                tetaX = tetaX + 0.01;
                matRotX[1][1] = Math.cos(tetaX);
                matRotX[1][2] = -Math.sin(tetaX);
                matRotX[2][1] = Math.sin(tetaX);
                matRotX[2][2] = Math.cos(tetaX);
                render();
                break;
      case 39:
                tetaY = tetaY + 0.01;
                matRotY[0][0] = Math.cos(tetaY);
                matRotY[0][2] = Math.sin(tetaY);
                matRotY[2][0] = -Math.sin(tetaY);
                matRotY[2][2] = Math.cos(tetaY);
                render();
                break;
      case 40:
                tetaX = tetaX - 0.01;
                matRotX[1][1] = Math.cos(tetaX);
                matRotX[1][2] = -Math.sin(tetaX);
                matRotX[2][1] = Math.sin(tetaX);
                matRotX[2][2] = Math.cos(tetaX);
                render();
                break;

      default: render();break;
    }
    render();
  }, false);
  //.......................................

  render();
}


function rotarX(vertices){
  var puntosRotados = [];
  var x; var y; var z;
  //alert("rotar1");
  for(var i = 0; i < vertices.length; i++){
    x = matRotX[0][0]*vertices[i][0] + matRotX[0][1]*vertices[i][1] + matRotX[0][2]*vertices[i][2] + matRotX[0][3]*vertices[i][3];
    y = matRotX[1][0]*vertices[i][0] + matRotX[1][1]*vertices[i][1] + matRotX[1][2]*vertices[i][2] + matRotX[1][3]*vertices[i][3];
    z = matRotX[2][0]*vertices[i][0] + matRotX[2][1]*vertices[i][1] + matRotX[2][2]*vertices[i][2] + matRotX[2][3]*vertices[i][3];
    //alert(x+","+ y+","+ z);
    puntosRotados.push(vec4(x, y, z, 1));
  }
  return puntosRotados;
}

function rotarY(vertices){
  var puntosRotados = [];
  var x; var y; var z;
  //alert("rotar1");
  for(var i = 0; i < vertices.length; i++){
    x = matRotY[0][0]*vertices[i][0] + matRotY[0][1]*vertices[i][1] + matRotY[0][2]*vertices[i][2] + matRotY[0][3]*vertices[i][3];
    y = matRotY[1][0]*vertices[i][0] + matRotY[1][1]*vertices[i][1] + matRotY[1][2]*vertices[i][2] + matRotY[1][3]*vertices[i][3];
    z = matRotY[2][0]*vertices[i][0] + matRotY[2][1]*vertices[i][1] + matRotY[2][2]*vertices[i][2] + matRotY[2][3]*vertices[i][3];
    //alert(x+","+ y+","+ z);
    puntosRotados.push(vec4(x, y, z, 1));
  }
  return puntosRotados;
}

function rotarZ(vertices){
  var puntosRotados = [];
  var x; var y; var z;
  //alert("rotar1");
  for(var i = 0; i < vertices.length; i++){
    x = matRotZ[0][0]*vertices[i][0] + matRotZ[0][1]*vertices[i][1] + matRotZ[0][2]*vertices[i][2] + matRotZ[0][3]*vertices[i][3];
    y = matRotZ[1][0]*vertices[i][0] + matRotZ[1][1]*vertices[i][1] + matRotZ[1][2]*vertices[i][2] + matRotZ[1][3]*vertices[i][3];
    z = matRotZ[2][0]*vertices[i][0] + matRotZ[2][1]*vertices[i][1] + matRotZ[2][2]*vertices[i][2] + matRotZ[2][3]*vertices[i][3];
    //alert(x+","+ y+","+ z);
    puntosRotados.push(vec4(x, y, z, 1));
  }
  return puntosRotados;
}


function getEjes(){
  puntos = [];
  colores = [];
  puntos.push(vec4(-1.0, 0.0, 0.0, 1.0));
  colores.push(vec4(1.0, 0.0, 0.0, 1.0));
  puntos.push(vec4(1.0, 0.0, 0.0, 1.0));
  colores.push(vec4(1.0, 0.0, 0.0, 1.0));
  //Eje y: Green
  puntos.push(vec4(0.0, 1.0, 0.0, 1.0));
  colores.push(vec4(0.0, 1.0, 0.0, 1.0));
  puntos.push(vec4(0.0, -1.0, 0.0, 1.0));
  colores.push(vec4(0.0, 1.0, 0.0, 1.0));
  //Eje z: Blue
  puntos.push(vec4(0.0, 0.0, 1.0, 1.0));
  colores.push(vec4(0.0, 0.0, 1.0, 1.0));
  puntos.push(vec4(0.0, 0.0, -1.0, 1.0));
  colores.push(vec4(0.0, 0.0, 1.0, 1.0));
}

function getMatrizIdentidad(){
  return [
      vec4(1.0, 0.0, 0.0, 0.0),
      vec4(0.0, 1.0, 0.0, 0.0),
      vec4(0.0, 0.0, 1.0, 0.0),
      vec4(0.0, 0.0, 0.0, 1.0)];
}

/*function factorial(num)
{
    if (num == 0)
      { return 1; }
    else
      { return num * factorial( num - 1 ); }
}

function combinatoria(n, i){
  if(i >= 0 && i <= n ){
    return (factorial(n)/(factorial(i) * factorial(n-i)));
  }else {
    return 0;
  }
}

function bernstein(n, i, t){ //B[n,i](t)
  return combinatoria(n, i) * Math.pow(t, i) * Math.pow( (1 - t), (n - i));
}*/


/**
 * @return {number}
 */
function B(points, t, eje) {
    if(points.length == 1){
        switch (eje){
            case 'x':   return points[0][0];break;
            case 'y':   return points[0][1];break;
            case 'z':   return points[0][2];break;
        }
    }
    else{
        switch (eje){
            case 'x':   return (1-t)*B(points.slice(0,points.length-1), t, 'x') + t * B(points.slice(1, points.length), t, 'x');break;
            case 'y':   return (1-t)*B(points.slice(0,points.length-1), t, 'y') + t * B(points.slice(1, points.length), t, 'y');break;
            case 'z':   return (1-t)*B(points.slice(0,points.length-1), t, 'z') + t * B(points.slice(1, points.length), t, 'z');break;
        }
    }
}

function bezier(points){//llega como argumento el conjunto de puntos.
    var x, y, z;

    for(var t = 0; t<=1; t += 0.01){
        x = B(points, t, 'x');
        y = B(points, t, 'y');
        z = B(points, t, 'z');

        puntos.push(vec4(x, y, z, 1.0));
        colores.push(vec4(1.0, 1.0, 1.0, 1.0));
        console.log(x + ', ' + y + ', ', z);
    }
}