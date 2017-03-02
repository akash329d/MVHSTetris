/* global socket */
"use strict";

console.log('Server Game Handler Loaded.');

var KEY = { ESC: 27, SPACE: 32, LEFT: 65 , UP: 87, RIGHT: 68, DOWN: 83};

class Block {
	constructor(row1, row2, row3, row4, color, idNum) {
		this.represent = [];
		this.l1 = row1;
		this.l2 = row2;
		this.l3 = row3;
		this.l4 = row4;
		this.rotated = 0;
		this.color = color;
		this.idNum = idNum;
		this.represent[0] = this.arrayify(("0000" + this.l1.toString(2)).slice(-4));
		this.represent[1] = this.arrayify(("0000" + this.l2.toString(2)).slice(-4));
		this.represent[2] = this.arrayify(("0000" + this.l3.toString(2)).slice(-4));
		this.represent[3] = this.arrayify(("0000" + this.l4.toString(2)).slice(-4));
		this.xpos = 2;
		this.ypos = 0;
	}
	
	get updateRotation(){
	    this.represent[0] = this.arrayify(("0000" + this.l1.toString(2)).slice(-4));
		this.represent[1] = this.arrayify(("0000" + this.l2.toString(2)).slice(-4));
		this.represent[2] = this.arrayify(("0000" + this.l3.toString(2)).slice(-4));
		this.represent[3] = this.arrayify(("0000" + this.l4.toString(2)).slice(-4));
	}
	
	arrayify(string) {
    var outArray = [];
    for(var c = 0; c < 4; c ++) {
        outArray[3 - c] = string.charAt(string.length - 1 - c);
    }
    outArray = outArray.map(Number);
    return outArray;
    }
}

class TetrisGame {
	constructor(interval, seed) {
	    Math.seed = seed;
		this.keysToProcess = [];
		this.board = [];
		this.boardStatic = [];
		this.timeToFall = 600;
		this.fallTimer = new Date();
		this.clearTimer = new Date();
		this.board = [];
		this.bag = [];
		this.hasLost = false;
		for (var c = 0; c < 20; c++) {
			this.board[c] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.boardStatic[c] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		}
		this.thispiece = this.nextPiece;
		this.keysToProcess = [];
		this.powerUpArray = [];
	}
	
	getBlocks(piece,curBoard, fn){
	    var blocks = [];
	    
	    for(var f = 0; f < piece.represent.length; f++) {
            var cube = piece.represent[f];
            for(var k = 0; k < cube.length; k++) {
                if(cube[k] == 1){
                    fn(k + piece.xpos, f + piece.ypos, curBoard, piece);
                    blocks[blocks.length] = {x: k + piece.xpos, y: f + piece.ypos};
                }
            }
	    
	    }
	
	    return blocks;
	}
	
	get rotate(){
        switch(this.thispiece.idNum) {
            case 1:
                switch(this.thispiece.rotated) {
                    case 0:
                        this.thispiece.rotated = 1;
                        this.thispiece.l1 = 0;
                        this.thispiece.l2 = 0xf;
                        this.thispiece.l3 = 0;
                        this.thispiece.l4 = 0;
                        break;
                    case 1:
                        this.thispiece.rotated = 0;
                        this.thispiece.l1 = 4;
                        this.thispiece.l2 = 4;
                        this.thispiece.l3 = 4;
                        this.thispiece.l4 = 4;
                        break;
                }
                break;
            case 2:
                break;
            case 3:
                switch(this.thispiece.rotated) {
                    case 0:
                        this.thispiece.rotated = 1;
                        this.thispiece.l1 = 0;
                        this.thispiece.l2 = 7;
                        this.thispiece.l3 = 4;
                        break;
                    case 1:
                        this.thispiece.rotated = 2;
                        this.thispiece.l1 = 6;
                        this.thispiece.l2 = 2;
                        this.thispiece.l3 = 2;
                        break;
                    case 2:
                        this.thispiece.rotated = 3;
                        this.thispiece.l1 = 1;
                        this.thispiece.l2 = 7;
                        this.thispiece.l3 = 0;
                        break;
                    case 3:
                        this.thispiece.rotated = 0;
                        this.thispiece.l1 = 2;
                        this.thispiece.l2 = 2;
                        this.thispiece.l3 = 3;
                        break;
                }
                break;
            case 4:
                switch(this.thispiece.rotated) {
                    case 0:
                        this.thispiece.rotated = 1;
                        this.thispiece.l1 = 4;
                        this.thispiece.l2 = 7;
                        this.thispiece.l3 = 0;
                        break;
                    case 1:
                        this.thispiece.rotated = 2;
                        this.thispiece.l1 = 3;
                        this.thispiece.l2 = 2;
                        this.thispiece.l3 = 2;
                        break;
                    case 2:
                        this.thispiece.rotated = 3;
                        this.thispiece.l1 = 0;
                        this.thispiece.l2 = 7;
                        this.thispiece.l3 = 1;
                        break;
                    case 3:
                        this.thispiece.rotated = 0;
                        this.thispiece.l1 = 2;
                        this.thispiece.l2 = 2;
                        this.thispiece.l3 = 6;
                        break;
                }
                break;
            case 5:
                switch(this.thispiece.rotated) {
                    case 0:
                        this.thispiece.rotated = 1;
                        this.thispiece.l1 = 2;
                        this.thispiece.l2 = 6;
                        this.thispiece.l3 = 2;
                        break;
                    case 1:
                        this.thispiece.rotated = 2;
                        this.thispiece.l1 = 2;
                        this.thispiece.l2 = 7;
                        this.thispiece.l3 = 0;
                        break;
                    case 2:
                        this.thispiece.rotated = 3;
                        this.thispiece.l1 = 2;
                        this.thispiece.l2 = 3;
                        this.thispiece.l3 = 2;
                        break;
                    case 3:
                        this.thispiece.rotated = 0;
                        this.thispiece.l1 = 0;
                        this.thispiece.l2 = 7;
                        this.thispiece.l3 = 2;
                        break;
                }
                break;
            case 6:
                switch(this.thispiece.rotated) {
                    case 0:
                        this.thispiece.rotated = 1;
                        this.thispiece.l1 = 2;
                        this.thispiece.l2 = 3;
                        this.thispiece.l3 = 1;
                        break;
                    case 1:
                        this.thispiece.rotated = 0;
                        this.thispiece.l1 = 0;
                        this.thispiece.l2 = 3;
                        this.thispiece.l3 = 6;
                        break;
                }
                break;
            case 7:
                switch(this.thispiece.rotated) {
                    case 0:
                        this.thispiece.rotated = 1;
                        this.thispiece.l1 = 1;
                        this.thispiece.l2 = 3;
                        this.thispiece.l3 = 2;
                        break;
                    case 1:
                        this.thispiece.rotated = 0;
                        this.thispiece.l1 = 0;
                        this.thispiece.l2 = 6;
                        this.thispiece.l3 = 3;
                        break;
                }
                break;
        }
        this.thispiece.updateRotation;
        
	}
	
	canMove(dir) {
	    var canMove = true;
	    var block = this.getBlocks(this.thispiece,this.board, function(x, y, theboard, curPiece){});
	    switch(dir){
	        case 'right':
	            for(var p = 0; p < block.length; p++){
	                if(this.isOccupied(block[p].x + 1, block[p].y) == true){
	                    canMove = false;
	                }
	            }
	            break;
	        case 'left': 
	            for(p = 0; p < block.length; p++){
	                if(this.isOccupied(block[p].x - 1, block[p].y) == true){
	                    canMove = false;
	                }
	            }
	            break;
	       case 'down': 
	            for(p = 0; p < block.length; p++){
	                if(this.isOccupied(block[p].x, block[p].y + 1) == true){
	                    canMove = false;
	                }
	            }
	            break;
	    }
	    return canMove;
	}
	
	getNextPiece(){
        var seed1 = (Math.seed * 9301 + 49297) % 233280;
        var rnd = seed1 / 233280.0;
        var randumNumber = rnd;
        var randNum = Math.floor(randumNumber * (this.bag.length));
	    return this.bag[randNum];
	}
	
	newBlock(blockType){
	    switch(blockType){
	        case 'i':
	           return (new Block(2, 2, 2, 2, "#0000ff", 1));
	        case 'o': 
	           return (new Block(6, 6, 0, 0, "#ff0000", 2));
	       case 'l':
	           return (new Block(2, 2, 3, 0, "#00aa00", 3));
	       case 'j':
	           return (new Block(2, 2, 6, 0, "#ffff00", 4));
	       case 't':
	           return (new Block(7, 2, 0, 0, "#00aaff", 5));
	       case 's':
	           return (new Block(3, 6, 0, 0, "#7700ff", 6));
	       case 'z':
	           return (new Block(6, 3, 0, 0, "#ff7700", 7));
	    }
	}
	
	get nextPiece(){
		if (this.bag.length === 0) {
			this.bag = [this.newBlock('i'), this.newBlock('i'), this.newBlock('i'), this.newBlock('i'),
    			this.newBlock('j'), this.newBlock('j'), this.newBlock('j'), this.newBlock('j'), 
	    		this.newBlock('o'), this.newBlock('o'), this.newBlock('o'), this.newBlock('o'), 
		    	this.newBlock('l'), this.newBlock('l'), this.newBlock('l'), this.newBlock('l'), 
	    		this.newBlock('s'), this.newBlock('s'), this.newBlock('s'), this.newBlock('s'),
		    	this.newBlock('z'), this.newBlock('z'), this.newBlock('z'), this.newBlock('z'),
		    	this.newBlock('t'), this.newBlock('t'), this.newBlock('t'), this.newBlock('t')];
		}
		var randNum = Math.floor(Math.seededRandom() * (this.bag.length));
		var chosen = this.bag.splice(randNum, 1);
		if (this.bag.length === 0) {
			this.bag = [this.newBlock('i'), this.newBlock('i'), this.newBlock('i'), this.newBlock('i'),
    			this.newBlock('j'), this.newBlock('j'), this.newBlock('j'), this.newBlock('j'), 
	    		this.newBlock('o'), this.newBlock('o'), this.newBlock('o'), this.newBlock('o'), 
		    	this.newBlock('l'), this.newBlock('l'), this.newBlock('l'), this.newBlock('l'), 
	    		this.newBlock('s'), this.newBlock('s'), this.newBlock('s'), this.newBlock('s'),
		    	this.newBlock('z'), this.newBlock('z'), this.newBlock('z'), this.newBlock('z'),
		    	this.newBlock('t'), this.newBlock('t'), this.newBlock('t'), this.newBlock('t')];
		}
		return chosen[0];

	}
	
	get boardVar(){
	    return this.board;
	}
	
	updateDynamicBoard(){
	    var staticBoardString = JSON.stringify(this.boardStatic);
		this.board = JSON.parse(staticBoardString);
		    this.getBlocks(this.thispiece,this.board, function(x, y, theboard, curPiece){
		        theboard[y][x] = curPiece.color;
		    });
	}
	
	process() {
		this.updateDynamicBoard();
		if((new Date()) - this.clearTimer > 100){
		    this.clearTimer = new Date(this.fallTimer.getTime() + 100);
		    this.clearLines();
		}
		if ((new Date()) - this.fallTimer > this.timeToFall) {
		this.fallTimer = new Date(this.fallTimer.getTime() + 400);
		if(this.canMove('down')){
		    //Move Block Down
			this.moveBlock(this.thispiece,'down');
		}else{
		    //Get new piece because block can't move down on timer :P.
		    this.getBlocks(this.thispiece,this.boardStatic, function(x, y, theboard, curPiece){
		        theboard[y][x] = curPiece.color;
		    });
			this.thispiece = this.nextPiece; 
		}
		}
		//If the top row has a block in it, they have lost
		if(!(JSON.stringify(this.boardStatic[0]) == JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]))){
            this.hasLost = true;
        }
        this.keyPressHandler(this.keysToProcess.shift());
	}
	
	clearLines(){
	    var amountOfLinesCleared = 0;
	    for(var z = 0; z < this.boardStatic.length; z++){
	        var amountOfBlocksInRow = 0;
	        this.boardStatic[z].forEach(function(element) {
             if(element != 0){
                 amountOfBlocksInRow++;
             }
            });
            if(amountOfBlocksInRow == 10){
                this.boardStatic.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                var lineRemoved = this.boardStatic.splice(z + 1, 1)[0];
                for(var l = 0; l < 10; l ++) {
                    switch(lineRemoved[l]) {
                        case "addLine":
                            this.powerUpArray.push("A");
                            break;
                        case "clearLine":
                            this.powerUpArray.push("C");
                            break;
                        case "switch":
                            this.powerUpArray.push("S");
                            break;
                        case "gravity":
                            this.powerUpArray.push("G");
                            break;
                        case "earthquake":
                            this.powerUpArray.push("E");
                            break;
                        case "nuke":
                            this.powerUpArray.push("N");
                            break;
                        case "randomClear":
                            this.powerUpArray.push("R");
                            break;
                        case "darkness":
                            this.powerUpArray.push("D");
                            break;
                        default:
                            break;
                    }
                }
                amountOfLinesCleared++;
            }
	        
	    }
	    if(amountOfLinesCleared > 1){
	        var powerUpsToSpawn = Math.floor((Math.random()) * (amountOfLinesCleared));
	        this.spawnPowerUps(powerUpsToSpawn);
	        socket.emit("power", ["addLines", amountOfLinesCleared - 1]);
	    }
	}
	
	
	spawnPowerUps(amount){
	    var blocksAvailable = [];
	    var powerUps = ["addLine", "clearLine", "switch", "gravity", "earthquake", "nuke", "randomClear", "darkness"];
	    for(var x = 0; x < 20; x++){
        for(var p = 0; p < 10; p++){
         if(this.boardStatic[x][p] != 0 && this.boardStatic[x][p].charAt(0) == "#"){
             blocksAvailable.push({xPos: x, yPos: p});
         }
        }
	    }
	    blocksAvailable = shuffle(blocksAvailable);
	    for (var l = 0; l < amount; l++){
	        if(blocksAvailable.length != 0){
	            var randNum = Math.floor(Math.random() * (powerUps.length));
		        var chosen = JSON.stringify(powerUps[randNum]);
		        this.boardStatic[blocksAvailable[l].xPos][blocksAvailable[l].yPos] = JSON.parse(chosen);
	        }
	    }
	}
	
	handlePower(data){
	    switch(data[0]){
            case "addLines":
                for(var k = 0; k < data[1]; k ++) {
                    this.boardStatic.splice(0,1);
                    var shaded = "#cccccc";
                    var placeExcluded = Math.floor(data[2 + k] * 10);
                    var arrayToPush = [shaded, shaded, shaded, shaded, shaded, shaded, shaded, shaded, shaded, shaded];
                    arrayToPush[placeExcluded] = 0;
                    this.boardStatic.push(arrayToPush);
                }
                break;
        }
	}
	
	
	moveBlock(piece, dir){
	    switch(dir){
	        case 'right':
	            if(this.canMove('right')){
		            piece.xpos++;
	            }
	            break;
	        case 'left': 
	           if(this.canMove('left')){
		            piece.xpos--;
	            }
	            break;
	       case 'down': 
	            if(this.canMove('down')){
		            piece.ypos++;
	            }
	            break;
	    }
	}
	
	
	
	isOccupied(xpos, ypos){
	    if(this.boardStatic[ypos] == undefined){
	        return 1;
	    }else{
	    if(this.boardStatic[ypos][xpos] != 0){
	        return 1;
	    }
	    else{
	        return 0;
	    }
	    }
	}
	
	keyPressHandler(key){
        switch(key){
            case KEY.DOWN:
                this.moveBlock(this.thispiece,'down');
                break;
            case KEY.UP:
                var backUpPiece = JSON.stringify(this.thispiece);
                this.rotate;
                if(!this.canMove('down')){
                    this.thispiece = JSON.parse(backUpPiece);
                    Object.setPrototypeOf(this.thispiece, Block.prototype);
                }
                break;
            case KEY.LEFT:
                this.moveBlock(this.thispiece,'left');
                break;
            case KEY.RIGHT:
                this.moveBlock(this.thispiece,'right');
                break;
            case KEY.SPACE:
                while(this.canMove("down")) {
                    this.moveBlock(this.thispiece, "down");
                }
		        this.getBlocks(this.thispiece,this.boardStatic, function(x, y, theboard, curPiece){
		            theboard[y][x] = curPiece.color;
		        });
		    	this.thispiece = this.nextPiece; 
                break;
        }
    }
}

Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280.0;

    return min + rnd * (max - min);
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

