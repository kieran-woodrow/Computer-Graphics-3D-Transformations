"use strict";

var canvas;
var gl;

var numVertices  = 36;

var axis = 0;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;

var rotateLoc;
var scaleLoc;
var translateLoc;

var vertices = [
    vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ),
    vec3(  0.5,  0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 )
];

var vertexColors = [
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 )  // blue
];

// indices of the 12 triangles that compise the cube

var indices = [
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5
];

//GET THE KEY THAT THE USER ENTERS IN ON THEIR KEYBOARD
let rx=parseFloat(document.getElementById('rotateX').innerHTML);
let ry=parseFloat(document.getElementById('rotateY').innerHTML);
let rz=parseFloat(document.getElementById('rotateZ').innerHTML);

let sx=parseFloat(document.getElementById('scaleX').innerHTML);
let sy=parseFloat(document.getElementById('scaleY').innerHTML);
let sz=parseFloat(document.getElementById('scaleZ').innerHTML);

let tx=parseFloat(document.getElementById('translateX').innerHTML);
let ty=parseFloat(document.getElementById('translateY').innerHTML);
let tz=parseFloat(document.getElementById('translateZ').innerHTML);

//THESE ARRAYS ARE GOING TO HOLD THE VALUES AND WILL BE PASSED INTO THE VERTEX SHADER IN THE C++ SIDE OF THE HTML FILE
let rotateArray = [rx, ry, rz, 0];
let translateArray = [tx, ty, tz, 0.1];
let scaleArray = [sx, sy, sz, 1];


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);;

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    rotateLoc = gl.getUniformLocation(program, "rotate");
    scaleLoc = gl.getUniformLocation(program, "scale");
    translateLoc = gl.getUniformLocation(program, "translate");


//GET THE KEY AND DO THE CALCULATIONS. THIS EVENTLISTNER WILL SEE WHAT KEY WAS PRESSED 
//AND INCREASE OR DECREASE THE RESPECTIVE VALUE
    document.addEventListener('keydown', function(e){

    //WILL HOLD THE KEY VALUE
    const key = e.key;

    //DO A GIANT SWITCH/IF STATEMENT 

//-------------------------------------------------------------------------------

                    //THE KEYS FOR THE ROTATE FUNCTION 
//-------------------------------------------------------------------------------
    if(key === 'q' || key ==='Q'){
        let rdelta=parseFloat(document.getElementById('rotateDelta').innerHTML);
        let x1 =(((rotateArray[0] += rdelta)*100)/100).toPrecision(2);
        document.getElementById('rotateX').innerHTML = x1;
        render();
    }
        
    if(key === 'w' || key ==='W'){
        let rdelta=parseFloat(document.getElementById('rotateDelta').innerHTML);
        let x2 =(((rotateArray[0] -= rdelta)*100)/100).toPrecision(2);
        document.getElementById('rotateX').innerHTML = x2;
        render();
    }
        
    if(key === 'e' || key ==='E'){
        let rdelta=parseFloat(document.getElementById('rotateDelta').innerHTML);
        let y1 =(((rotateArray[1] += rdelta)*100)/100).toPrecision(2);
        document.getElementById('rotateY').innerHTML = y1;
        render();
    }
        
    if(key === 'r' || key ==='R'){
        let rdelta=parseFloat(document.getElementById('rotateDelta').innerHTML);
        let y2 =(((rotateArray[1] -= rdelta)*100)/100).toPrecision(2);
        document.getElementById('rotateY').innerHTML = y2;
        render();
    }

    if(key === 't' || key ==='T'){
        let rdelta=parseFloat(document.getElementById('rotateDelta').innerHTML);
        let z1 =(((rotateArray[2] += rdelta)*100)/100).toPrecision(2);
        document.getElementById('rotateZ').innerHTML = z1;
    }
   
    if(key === 'y' || key ==='Y'){
        let rdelta=parseFloat(document.getElementById('rotateDelta').innerHTML);
        let z2 =(((rotateArray[2] -= rdelta)*100)/100).toPrecision(2);
        document.getElementById('rotateZ').innerHTML = z2;
    }

    if(key === 'u' || key ==='U'){
        let d1 =(((rotateArray[3] += 0.1)*100)/100).toPrecision(2);
        document.getElementById('rotateDelta').innerHTML = d1;
    }

    if(key === 'i' || key ==='I'){
        let d2=(((rotateArray[3] -= 0.1)*100)/100).toPrecision(2);
        document.getElementById('rotateDelta').innerHTML = d2;
    }
//-------------------------------------------------------------------------------


                    //THE KEYS FOR THE TRANSLATE FUNCTION 
//-------------------------------------------------------------------------------
    if(key === 'a' || key ==='A'){
        let tdelta=parseFloat(document.getElementById('translateDelta').innerHTML);
        let x1=(((translateArray[0] += tdelta)*100)/100).toPrecision(2);
        document.getElementById('translateX').innerHTML = x1;
    }
        
    if(key === 's' || key ==='S'){
        let tdelta=parseFloat(document.getElementById('translateDelta').innerHTML);
        let x2=(((translateArray[0] -= tdelta)*100)/100).toPrecision(2);
        document.getElementById('translateX').innerHTML = x2;
    }

    if(key === 'd' || key ==='D'){
        let tdelta=parseFloat(document.getElementById('translateDelta').innerHTML);
        let y1=(((translateArray[1] += tdelta)*100)/100).toPrecision(2);
        document.getElementById('translateY').innerHTML = y1;
    }
        
    if(key === 'f' || key ==='F'){
        let tdelta=parseFloat(document.getElementById('translateDelta').innerHTML);
        let y2=(((translateArray[1] -= tdelta)*100)/100).toPrecision(2);
        document.getElementById('translateY').innerHTML = y2;
    }
    
    if(key === 'g' || key ==='G'){
        let tdelta=parseFloat(document.getElementById('translateDelta').innerHTML);
        let z1=(((translateArray[2] += tdelta)*100)/100).toPrecision(2);
        document.getElementById('translateZ').innerHTML = z1;
    }
    
    if(key === 'h' || key ==='H'){
        let tdelta=parseFloat(document.getElementById('translateDelta').innerHTML);
        let z2=(((translateArray[2] -= tdelta)*100)/100).toPrecision(2);
        document.getElementById('translateZ').innerHTML = z2;
    }
        
    if(key === 'j' || key ==='J'){
        let d1=(((translateArray[3] += 0.1)*100)/100).toPrecision(2);
        document.getElementById('translateDelta').innerHTML = d1;
    }
        
    if(key === 'k' || key ==='K'){
        let d2=(((translateArray[3] -= 0.1)*100)/100).toPrecision(2);
        document.getElementById('translateDelta').innerHTML = d2;
    }
//-------------------------------------------------------------------------------
    
                         //THE KEYS FOR THE SCALE FUNCTION 
//-------------------------------------------------------------------------------
    if(key === 'z' || key ==='Z'){
        let sdelta=parseFloat(document.getElementById('scaleDelta').innerHTML);
        let x1=(((scaleArray[0] += sdelta)*100)/100).toPrecision(2);
        document.getElementById('scaleX').innerHTML = x1;
    }
        
    if(key === 'x' || key ==='X'){
        let sdelta=parseFloat(document.getElementById('scaleDelta').innerHTML);
        let x2=(((scaleArray[0] -= sdelta)*100)/100).toPrecision(2);
        document.getElementById('scaleX').innerHTML = x2;
    }
        
    if(key === 'c' || key ==='C'){
        let sdelta=parseFloat(document.getElementById('scaleDelta').innerHTML);
        let y1=(((scaleArray[1] += sdelta)*100)/100).toPrecision(2);
        document.getElementById('scaleY').innerHTML = y1;
    }
        
    if(key === 'v' || key ==='V'){
        let sdelta=parseFloat(document.getElementById('scaleDelta').innerHTML);
        let y2=(((scaleArray[1] -= sdelta)*100)/100).toPrecision(2);
        document.getElementById('scaleY').innerHTML = y2;
    }
        
    if(key === 'b' || key ==='B'){
        let sdelta=parseFloat(document.getElementById('scaleDelta').innerHTML);
        let z1=(((scaleArray[2] += sdelta)*100)/100).toPrecision(2);
        document.getElementById('scaleZ').innerHTML = z1;
    }
        
    if(key === 'n' || key ==='N'){
        let sdelta=parseFloat(document.getElementById('scaleDelta').innerHTML);
        let z2=(((scaleArray[2] -= sdelta)*100)/100).toPrecision(2);
        document.getElementById('scaleZ').innerHTML = z2;
    }

    if(key === 'm' || key ==='M'){
        let d1=(((scaleArray[3] += 0.1)*100)/100).toPrecision(2);
        document.getElementById('scaleDelta').innerHTML = d1;
    }
        
    if(key === '<' || key ===','){
        let d2=(((scaleArray[3] -= 0.1)*100)/100).toPrecision(2);
        document.getElementById('scaleDelta').innerHTML = d2;
    }
//-------------------------------------------------------------------------------

                        //KEYS FOR THE RESET FUNCTION
//-------------------------------------------------------------------------------

    if(key === 'p' || key === 'P'){
        document.getElementById('rotateX').innerHTML = 0;
        document.getElementById('rotateY').innerHTML = 0;
        document.getElementById('rotateZ').innerHTML = 0;
        document.getElementById('rotateDelta').innerHTML = 0.1;
        document.getElementById('translateX').innerHTML = 0;
        document.getElementById('translateY').innerHTML = 0;
        document.getElementById('translateZ').innerHTML = 0;
        document.getElementById('translateDelta').innerHTML = 0.1;
        document.getElementById('scaleX').innerHTML = 1;
        document.getElementById('scaleY').innerHTML = 1;
        document.getElementById('scaleZ').innerHTML = 1;
        document.getElementById('scaleDelta').innerHTML = 0.1;

        rotateArray = [0, 0, 0, 0.1];
        translateArray = [0, 0, 0, 0.1];
        scaleArray = [1, 1, 1, 0.1];

    //IF THE USER CALLS THE RESET FUNCTION, YOU HAVE TO RENDER AGAIN
        render();
    
    }

});
//-------------------------------------------------------------------------------

                            //RENDER EVERYTHING AT THE END
//-------------------------------------------------------------------------------
    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//-------------------------------------------------------------------------------

                //THESE VALUES WILL BE PASSED TOTHE C++ CODE
//-------------------------------------------------------------------------------
    gl.uniform3fv(rotateLoc, rotateArray.slice(0,3));
    gl.uniform3fv(scaleLoc, scaleArray.slice(0,3));
    gl.uniform3fv(translateLoc, translateArray.slice(0,3));

    gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 );

    requestAnimFrame( render );
}