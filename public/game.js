/* 
  global socket
  global TetrisGame
  */
"use strict";
var KEY = { ESC: 27, SPACE: 32, LEFT: 65 , UP: 87, RIGHT: 68, DOWN: 83, ARROWLEFT: 37, ARROWDOWN: 40, ARROWUP: 38, ARROWRIGHT: 39 };

var game;
var interval; 
var counter;
var canvasObj = [document.getElementById("mainCanvas"),
                document.getElementById("player2Canvas"),
                document.getElementById("player3Canvas"),
                document.getElementById("player4Canvas"),
               document.getElementById("player5Canvas"),
               document.getElementById("nextPieceCanvas")];

socket.on('ready', function(data){
    if(data == 1.3243402349832493){
    counter = 0;
	canvasObj[0].addEventListener('keydown', keydown, false);
	game = new TetrisGame(interval, Math.floor(Math.random() * (1000000)));
	interval = setInterval(process, 1);
	canvasObj[0].focus();
    }else{
	counter = 0;
	setTimeout(function(){
	 canvasObj[0].addEventListener('keydown', keydown, false);
	 game = new TetrisGame(interval, data);
	interval = setInterval(process, 1);
	canvasObj[0].focus();
	}, 5000);
    }
	
});
  
  socket.on("gameOver", function(){
    if(game.hasLost){
        clearInterval(interval);
        drawLost(canvasObj[0]);
        clearCanvas(canvasObj[1]);
        clearCanvas(canvasObj[2]);
        clearCanvas(canvasObj[3]);
        clearCanvas(canvasObj[4]);
        clearCanvas(canvasObj[5]);
    }else{
        clearInterval(interval);
        drawWon(canvasObj[0]);
        clearCanvas(canvasObj[1]);
        clearCanvas(canvasObj[2]);
        clearCanvas(canvasObj[3]);
        clearCanvas(canvasObj[4]);
        clearCanvas(canvasObj[5]);
        
    }
  });
  
socket.on("clientPower", function(data) {
    game.handlePower(data);
});

function process(){
    counter++;
    if(counter >= 50){
        counter = 0;
    socket.emit('gameUpdate', JSON.stringify(game.boardVar));
    }
    game.process();
    clearCanvas(canvasObj[0]);
    updateCanvasFromArray(game.boardVar, canvasObj[0]);
    drawNextPiece(game.getNextPiece());
    if(game.hasLost){
        socket.emit("lost");
        clearInterval(interval);
        drawLost(canvasObj[0]);
    }
}

function drawLost(canvas){
    var ctx = canvas.getContext("2d");
    clearCanvas(canvas);
    ctx.font = '50px roboto';
    ctx.fillStyle = "#003300";
    var textString = "Lost!",
    textWidth = ctx.measureText(textString).width;
    ctx.fillText(textString , (canvas.width/2) - (textWidth / 2), canvas.height/2);
}

function drawWon(canvas){
    var ctx = canvas.getContext("2d");
    clearCanvas(canvas);
    ctx.font = '50px roboto';
    ctx.fillStyle = "#003300";
    var textString = "Won!",
    textWidth = ctx.measureText(textString).width;
    ctx.fillText(textString , (canvas.width/2) - (textWidth / 2), canvas.height/2);
}

function drawNextPiece(piece){
    clearCanvas(canvasObj[5]);
    switch(piece.idNum) {
            case 1:
                drawBlockNextPiece(1.5,0,canvasObj[5], piece.color);
                drawBlockNextPiece(1.5,1,canvasObj[5], piece.color);
                drawBlockNextPiece(1.5,2,canvasObj[5], piece.color);
                drawBlockNextPiece(1.5,3,canvasObj[5], piece.color);
                break;
            case 2:
                drawBlockNextPiece(1,1,canvasObj[5], piece.color);
                drawBlockNextPiece(1,2,canvasObj[5], piece.color);
                drawBlockNextPiece(2,1,canvasObj[5], piece.color);
                drawBlockNextPiece(2,2,canvasObj[5], piece.color);
                break;
            case 3:
                drawBlockNextPiece(1,.5,canvasObj[5], piece.color);
                drawBlockNextPiece(1,1.5,canvasObj[5], piece.color);
                drawBlockNextPiece(1,2.5,canvasObj[5], piece.color);
                drawBlockNextPiece(2,2.5,canvasObj[5], piece.color);
                break;
            case 4:
                drawBlockNextPiece(2,.5,canvasObj[5], piece.color);
                drawBlockNextPiece(2,1.5,canvasObj[5], piece.color);
                drawBlockNextPiece(2,2.5,canvasObj[5], piece.color);
                drawBlockNextPiece(1,2.5,canvasObj[5], piece.color);
                break;
            case 5:
                drawBlockNextPiece(0.5,2,canvasObj[5], piece.color);
                drawBlockNextPiece(1.5,2,canvasObj[5], piece.color);
                drawBlockNextPiece(2.5,2,canvasObj[5], piece.color);
                drawBlockNextPiece(1.5,1,canvasObj[5], piece.color);
                break;
            case 6:
                drawBlockNextPiece(0.5,2,canvasObj[5], piece.color);
                drawBlockNextPiece(1.5,2,canvasObj[5], piece.color);
                drawBlockNextPiece(1.5,1,canvasObj[5], piece.color);
                drawBlockNextPiece(2.5,1,canvasObj[5], piece.color);
                break;
            case 7:
                drawBlockNextPiece(0.5,1,canvasObj[5], piece.color);
                drawBlockNextPiece(1.5,1,canvasObj[5], piece.color);
                drawBlockNextPiece(1.5,2,canvasObj[5], piece.color);
                drawBlockNextPiece(2.5,2,canvasObj[5], piece.color);
                break;
        }
}

function drawBlockNextPiece(x,y, canvas, color){
    var height = canvas.height;
    var width = canvas.width;
    canvas = canvas.getContext("2d");
    canvas.fillStyle = color;
    canvas.fillRect(x*(width/4), y*(height/4), width/4, height/4);
    canvas.strokeRect(x*(width/4), y*(height/4), width/4, height/4);
}

function keydown(e){
    switch(e.keyCode){
      case KEY.LEFT:
          game.keysToProcess.push(KEY.LEFT);
          break;
      case KEY.RIGHT:
          game.keysToProcess.push(KEY.RIGHT);
          break;
      case KEY.UP:     
          game.keysToProcess.push(KEY.UP);
          break;
      case KEY.DOWN:   
          game.keysToProcess.push(KEY.DOWN);
          break;
      case KEY.SPACE:
          game.keysToProcess.push(KEY.SPACE);
          break;
      case KEY.ARROWLEFT: 
          game.keysToProcess.push(KEY.LEFT);
          break;
      case KEY.ARROWRIGHT:
          game.keysToProcess.push(KEY.RIGHT);
          break;
      case KEY.ARROWDOWN:
          game.keysToProcess.push(KEY.DOWN);
          break;
      case KEY.ARROWUP:
         game.keysToProcess.push(KEY.UP);
          break;
        
    }
    e.preventDefault();
}

function clearCanvas(canvas){
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function drawBlock(x,y, canvas, color){
    var height = canvas.height;
    var width = canvas.width;
    canvas = canvas.getContext("2d");
    canvas.fillStyle = color;
    canvas.fillRect(x*(width/10), y*(height/20), width/10, height/20);
    canvas.strokeRect(x*(width/10), y*(height/20), width/10, height/20);
}

function updateCanvasFromArray(board, canvas){
    var height = canvas.height;
    var width = canvas.width;
    var textString;
    var textWidth;
    var ctx = canvas.getContext("2d");
    for(var x = 0; x < 20; x++){
        for(var p = 0; p < 10; p++){
            switch(board[x][p]) {
                case "addLine":
                    drawBlock([p],[x], canvas, "#cccccc");
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "A";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, p*(width/10) + (((width/10)/2) - (textWidth/2)), (x + 0.85) *(height/20));
                    break;
                case "clearLine":
                    drawBlock([p],[x], canvas, "#cccccc");
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "C";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, p*(width/10) + (((width/10)/2) - (textWidth/2)), (x + 0.85) *(height/20));
                    break;
                case "switch":
                    drawBlock([p],[x], canvas, "#cccccc");
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "S";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, p*(width/10) + (((width/10)/2) - (textWidth/2)), (x + 0.85) *(height/20));
                    break;
                case "gravity":
                    drawBlock([p],[x], canvas, "#cccccc");
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "G";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, p*(width/10) + (((width/10)/2) - (textWidth/2)), (x + 0.85) *(height/20));
                    break;
                case "earthquake":
                    drawBlock([p],[x], canvas, "#cccccc");
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "E";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, p*(width/10) + (((width/10)/2) - (textWidth/2)), (x + 0.85) *(height/20));
                    break;
                case "nuke":
                    drawBlock([p],[x], canvas, "#cccccc");
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "N";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, p*(width/10) + (((width/10)/2) - (textWidth/2)), (x + 0.85) *(height/20));
                    break;
                case "randomClear":
                    drawBlock([p],[x], canvas, "#cccccc");
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "R";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, p*(width/10) + (((width/10)/2) - (textWidth/2)), (x + 0.85) *(height/20));
                    break;
                case "darkness":
                    drawBlock([p],[x], canvas, "#cccccc");
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "D";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, p*(width/10) + (((width/10)/2) - (textWidth/2)), (x + 0.85) *(height/20));
                    break;
                case 0:
                    break;
                default:
                    drawBlock([p],[x], canvas, board[x][p]);
                    break;
	        }
	    }
	}
}


socket.on('updateViews', function(data) {
    if(data[0] != null) {
        clearCanvas(canvasObj[1]);
        if(data[0] != "LOST"){
        updateCanvasFromArray(data[0], canvasObj[1]);
        }else{
            drawLost(canvasObj[1]);
        }
    }
    if(data[1] != null) {
        clearCanvas(canvasObj[2]);
        if(data[1] != "LOST"){
        updateCanvasFromArray(data[1], canvasObj[2]);
        }else{
            drawLost(canvasObj[2]);
        }
    }
    if(data[2] != null) {
        clearCanvas(canvasObj[3]);
        if(data[2] != "LOST"){
        updateCanvasFromArray(data[2], canvasObj[3]);
        }else{
            drawLost(canvasObj[3]);
        }
    }
    if(data[3] != null) {
        clearCanvas(canvasObj[4]);
        if(data[3] != "LOST"){
        updateCanvasFromArray(data[3], canvasObj[4]);
        }else{
            drawLost(canvasObj[4]);
        }
    }
});