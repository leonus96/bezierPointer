//+++CONTEXTO WEBGL+++
function getWebGLContext(canvas){
  var gl;
  var nombres = ["webgl",
                 "experimental-webgl",
                 "webkit-3d",
                 "moz-webgl"];
  for(var i = 0; i < nombres.length; i++){
    try {
      gl = canvas.getContext(nombres[i]);
    } catch (e) {}
    if(gl) break;
  }
  return gl;
}

function convAWebGLCoordenadas(canvas, mousePos){
  return{
    x: (mousePos.x*2/canvas.width) - 1,

    y: ((canvas.height - mousePos.y)*2/canvas.height) -1
  }
}


function convCartesianasCoordenadasInt(canvas, mousePos){
  return{
    x: mousePos.x - canvas.width/2,

    y: canvas.height/2 - mousePos.y
  }
}
