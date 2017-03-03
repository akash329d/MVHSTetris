/* 
  global io 
  global $
  */
"use strict";
(function(){
var KEY = { ESC: 27, SPACE: 32, LEFT: 65 , UP: 87, RIGHT: 68, DOWN: 83, ARROWLEFT: 37, ARROWDOWN: 40, ARROWUP: 38, ARROWRIGHT: 39, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53};
  
console.log('MVHS Tetris Loaded!');

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
		this.darknessEnabled = false;
		this.board = [];
		this.boardStatic = [];
		this.timeToFall = 500;
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
		this.fallTimer = new Date(this.fallTimer.getTime() + this.timeToFall);
		if(this.timeToFall > 150){
		this.timeToFall = this.timeToFall - 0.05;
		}
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
        if(this.darknessEnabled){
            for (var c = 0; c < 20; c++) {
			this.board[c] = ["grey", "grey", "grey", "grey", "grey", "grey", "grey", "grey", "grey", "grey"];
		}
        }
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
	        socket.emit("power", ["A", "all", amountOfLinesCleared - 1]);
	    }
	}
	
	
	spawnPowerUps(amount){
	    //Only have implemented A, N, C, S, D so only spawn those for now.
	    var blocksAvailable = [];
	    //var powerUps = ["addLine", "clearLine", "switch", "gravity", "earthquake", "nuke", "randomClear", "darkness"];
	    var powerUps = ["addLine", "clearLine", "switch", "nuke", "darkness"];
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
            case "A":
                for(var k = 0; k < data[2]; k ++) {
                    this.boardStatic.splice(0,1);
                    var shaded = "#cccccc";
                    var placeExcluded = Math.floor(data[3 + k] * 10);
                    var arrayToPush = [shaded, shaded, shaded, shaded, shaded, shaded, shaded, shaded, shaded, shaded];
                    arrayToPush[placeExcluded] = 0;
                    this.boardStatic.push(arrayToPush);
                }
                break;
            case "N":
                for (var c = 0; c < 20; c++) {
			        this.boardStatic[c] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		        }
                break;
            case "C":
                this.boardStatic.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                this.boardStatic.splice(20, 1)[0];
                break;
            case "S":
                this.boardStatic = data[2];
                break;
            case "D":
                this.darknessEnabled = true;
                setTimeout(function (){
                    game.darknessEnabled = false;
                }, 2000);
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


    
    var adjectives= ["aback","abaft","abandoned","abashed","aberrant","abhorrent","abiding","abject","ablaze","able","abnormal","aboard","aboriginal","abortive","abounding","abrasive","abrupt","absent","absorbed","absorbing","abstracted","absurd","abundant","abusive","acceptable","accessible","accidental","accurate","acid","acidic","acoustic","acrid","actually","adHoc","adamant","adaptable","addicted","adhesive","adjoining","adorable","adventurous","afraid","aggressive","agonizing","agreeable","ahead","ajar","alcoholic","alert","alike","alive","alleged","alluring","aloof","amazing","ambiguous","ambitious","amuck","amused","amusing","ancient","angry","animated","annoyed","annoying","anxious","apathetic","aquatic","aromatic","arrogant","ashamed","aspiring","assorted","astonishing","attractive","auspicious","automatic","available","average","awake","aware","awesome","awful","axiomatic","bad","barbarous","bashful","bawdy","beautiful","befitting","belligerent","beneficial","bent","berserk","best","better","bewildered","big","billowy","bite-Sized","bitter","bizarre","black","black-And-White","bloody","blue","blue-Eyed","blushing","boiling","boorish","bored","boring","bouncy","boundless","brainy","brash","brave","brawny","breakable","breezy","brief","bright","bright","broad","broken","brown","bumpy","burly","bustling","busy","cagey","calculating","callous","calm","capable","capricious","careful","careless","caring","cautious","ceaseless","certain","changeable","charming","cheap","cheerful","chemical","chief","childlike","chilly","chivalrous","chubby","chunky","clammy","classy","clean","clear","clever","cloistered","cloudy","closed","clumsy","cluttered","coherent","cold","colorful","colossal","combative","comfortable","common","complete","complex","concerned","condemned","confused","conscious","cooing","cool","cooperative","coordinated","courageous","cowardly","crabby","craven","crazy","creepy","crooked","crowded","cruel","cuddly","cultured","cumbersome","curious","curly","curved","curvy","cut","cute","cute","cynical","daffy","daily","damaged","damaging","damp","dangerous","dapper","dark","dashing","dazzling","dead","deadpan","deafening","dear","debonair","decisive","decorous","deep","deeply","defeated","defective","defiant","delicate","delicious","delightful","demonic","delirious","dependent","depressed","deranged","descriptive","deserted","detailed","determined","devilish","didactic","different","difficult","diligent","direful","dirty","disagreeable","disastrous","discreet","disgusted","disgusting","disillusioned","dispensable","distinct","disturbed","divergent","dizzy","domineering","doubtful","drab","draconian","dramatic","dreary","drunk","dry","dull","dusty","dusty","dynamic","dysfunctional","eager","early","earsplitting","earthy","easy","eatable","economic","educated","efficacious","efficient","eight","elastic","elated","elderly","electric","elegant","elfin","elite","embarrassed","eminent","empty","enchanted","enchanting","encouraging","endurable","energetic","enormous","entertaining","enthusiastic","envious","equable","equal","erect","erratic","ethereal","evanescent","evasive","even","excellent","excited","exciting","exclusive","exotic","expensive","extra-Large","extra-Small","exuberant","exultant","fabulous","faded","faint","fair","faithful","fallacious","false","familiar","famous","fanatical","fancy","fantastic","far","far-Flung","fascinated","fast","fat","faulty","fearful","fearless","feeble","feigned","female","fertile","festive","few","fierce","filthy","fine","finicky","first","five","fixed","flagrant","flaky","flashy","flat","flawless","flimsy","flippant","flowery","fluffy","fluttering","foamy","foolish","foregoing","forgetful","fortunate","four","frail","fragile","frantic","free","freezing","frequent","fresh","fretful","friendly","frightened","frightening","full","fumbling","functional","funny","furry","furtive","future","futuristic","fuzzy","gabby","gainful","gamy","gaping","garrulous","gaudy","general","gentle","giant","giddy","gifted","gigantic","glamorous","gleaming","glib","glistening","glorious","glossy","godly","good","goofy","gorgeous","graceful","grandiose","grateful","gratis","gray","greasy","great","greedy","green","grey","grieving","groovy","grotesque","grouchy","grubby","gruesome","grumpy","guarded","guiltless","gullible","gusty","guttural","habitual","half","hallowed","halting","handsome","handsomely","handy","hanging","hapless","happy","hard","hard-To-Find","harmonious","harsh","hateful","heady","healthy","heartbreaking","heavenly","heavy","hellish","helpful","helpless","hesitant","hideous","high","highfalutin","high-Pitched","hilarious","hissing","historical","holistic","hollow","homeless","homely","honorable","horrible","hospitable","hot","huge","hulking","humdrum","humorous","hungry","hurried","hurt","hushed","husky","hypnotic","hysterical","icky","icy","idiotic","ignorant","ill","illegal","ill-Fated","ill-Informed","illustrious","imaginary","immense","imminent","impartial","imperfect","impolite","important","imported","impossible","incandescent","incompetent","inconclusive","industrious","incredible","inexpensive","infamous","innate","innocent","inquisitive","insidious","instinctive","intelligent","interesting","internal","invincible","irate","irritating","itchy","jaded","jagged","jazzy","jealous","jittery","jobless","jolly","joyous","judicious","juicy","jumbled","jumpy","juvenile","kaput","keen","kind","kindhearted","kindly","knotty","knowing","knowledgeable","known","labored","lackadaisical","lacking","lame","lamentable","languid","large","last","late","laughable","lavish","lazy","lean","learned","left","legal","lethal","level","lewd","light","like","likeable","limping","literate","little","lively","lively","living","lonely","long","longing","long-Term","loose","lopsided","loud","loutish","lovely","loving","low","lowly","lucky","ludicrous","lumpy","lush","luxuriant","lying","lyrical","macabre","macho","maddening","madly","magenta","magical","magnificent","majestic","makeshift","male","malicious","mammoth","maniacal","many","marked","massive","married","marvelous","material","materialistic","mature","mean","measly","meaty","medical","meek","mellow","melodic","melted","merciful","mere","messy","mighty","military","milky","mindless","miniature","minor","miscreant","misty","mixed","moaning","modern","moldy","momentous","motionless","mountainous","muddled","mundane","murky","mushy","mute","mysterious","naive","nappy","narrow","nasty","natural","naughty","nauseating","near","neat","nebulous","necessary","needless","needy","neighborly","nervous","new","next","nice","nifty","nimble","nine","nippy","noiseless","noisy","nonchalant","nondescript","nonstop","normal","nostalgic","nosy","noxious","null","numberless","numerous","nutritious","nutty","oafish","obedient","obeisant","obese","obnoxious","obscene","obsequious","observant","obsolete","obtainable","oceanic","odd","offbeat","old","old-Fashioned","omniscient","one","onerous","open","opposite","optimal","orange","ordinary","organic","ossified","outgoing","outrageous","outstanding","oval","overconfident","overjoyed","overrated","overt","overwrought","painful","painstaking","pale","paltry","panicky","panoramic","parallel","parched","parsimonious","past","pastoral","pathetic","peaceful","penitent","perfect","periodic","permissible","perpetual","petite","petite","phobic","physical","picayune","pink","piquant","placid","plain","plant","plastic","plausible","pleasant","plucky","pointless","poised","polite","political","poor","possessive","possible","powerful","precious","premium","present","pretty","previous","pricey","prickly","private","probable","productive","profuse","protective","proud","psychedelic","psychotic","public","puffy","pumped","puny","purple","purring","pushy","puzzled","puzzling","quack","quaint","quarrelsome","questionable","quick","quickest","quiet","quirky","quixotic","quizzical","rabid","racial","ragged","rainy","rambunctious","rampant","rapid","rare","raspy","ratty","ready","real","rebel","receptive","recondite","red","redundant","reflective","regular","relieved","remarkable","reminiscent","repulsive","resolute","resonant","responsible","rhetorical","rich","right","righteous","rightful","rigid","ripe","ritzy","roasted","robust","romantic","roomy","rotten","rough","round","royal","ruddy","rude","rural","rustic","ruthless","sable","sad","safe","salty","same","sassy","satisfying","savory","scandalous","scarce","scared","scary","scattered","scientific","scintillating","scrawny","screeching","second","second-Hand","secret","secretive","sedate","seemly","selective","selfish","separate","serious","shaggy","shaky","shallow","sharp","shiny","shivering","shocking","short","shrill","shut","shy","sick","silent","silent","silky","silly","simple","simplistic","sincere","six","skillful","skinny","sleepy","slim","slimy","slippery","sloppy","slow","small","smart","smelly","smiling","smoggy","smooth","sneaky","snobbish","snotty","soft","soggy","solid","somber","sophisticated","sordid","sore","sore","sour","sparkling","special","spectacular","spicy","spiffy","spiky","spiritual","spiteful","splendid","spooky","spotless","spotted","spotty","spurious","squalid","square","squealing","squeamish","staking","stale","standing","statuesque","steadfast","steady","steep","stereotyped","sticky","stiff","stimulating","stingy","stormy","straight","strange","striped","strong","stupendous","stupid","sturdy","subdued","subsequent","substantial","successful","succinct","sudden","sulky","super","superb","superficial","supreme","swanky","sweet","sweltering","swift","symptomatic","synonymous","taboo","tacit","tacky","talented","tall","tame","tan","tangible","tangy","tart","tasteful","tasteless","tasty","tawdry","tearful","tedious","teeny","teeny-Tiny","telling","temporary","ten","tender","tense","tense","tenuous","terrible","terrific","tested","testy","thankful","therapeutic","thick","thin","thinkable","third","thirsty","thirsty","thoughtful","thoughtless","threatening","three","thundering","tidy","tight","tightfisted","tiny","tired","tiresome","toothsome","torpid","tough","towering","tranquil","trashy","tremendous","tricky","trite","troubled","truculent","true","truthful","two","typical","ubiquitous","ugliest","ugly","ultra","unable","unaccountable","unadvised","unarmed","unbecoming","unbiased","uncovered","understood","undesirable","unequal","unequaled","uneven","unhealthy","uninterested","unique","unkempt","unknown","unnatural","unruly","unsightly","unsuitable","untidy","unused","unusual","unwieldy","unwritten","upbeat","uppity","upset","uptight","used","useful","useless","utopian","utter","uttermost","vacuous","vagabond","vague","valuable","various","vast","vengeful","venomous","verdant","versed","victorious","vigorous","violent","violet","vivacious","voiceless","volatile","voracious","vulgar","wacky","waggish","waiting","wakeful","wandering","wanting","warlike","warm","wary","wasteful","watery","weak","wealthy","weary","well-Groomed","well-Made","well-Off","well-To-Do","wet","whimsical","whispering","white","whole","wholesale","wicked","wide","wide-Eyed","wiggly","wild","willing","windy","wiry","wise","wistful","witty","woebegone","womanly","wonderful","wooden","woozy","workable","worried","worthless","wrathful","wretched","wrong","wry","yellow","yielding","young","youthful","yummy","zany","zealous","zesty","zippy","zonked"];
var nouns= ["ninja","chair","pancake","statue","unicorn","rainbows","laser","senor","bunny","captain","nibblets","cupcake","carrot","gnomes","glitter","potato","salad","toejam","curtains","beets","toilet","exorcism","stickfigures","mermaideggs","seabarnacles","dragons","jellybeans","snakes","dolls","bushes","cookies","apples","icecream","ukulele","kazoo","banjo","operasinger","circus","trampoline","carousel","carnival","locomotive","hotairballoon","prayingmantis","animator","artisan","artist","colorist","inker","coppersmith","director","designer","flatter","stylist","leadman","limner","make-upartist","model","musician","penciller","producer","scenographer","setdecorator","silversmith","teacher","automechanic","beader","bobbinboy","clerkofthechapel","fillingstationattendant","foreman","maintenanceengineering","mechanic","miller","moldmaker","panelbeater","patternmaker","plantoperator","plumber","sawfiler","shopforeman","soaper","stationaryengineer","wheelwright","woodworkers"];
var users = [];

  var socket = io();
  var user = prompt("Please enter a username", adjectives[Math.floor(Math.random() * adjectives.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)]);
  socket.emit('userLogon', user);
  
  
  socket.on("updateLabels", function(names){
    users = names;
    updatePlayerLabels(names[0], names[1], names[2], names[3], names[4]);
  });
  
  socket.on("update", function(msg) {
			 addChatMessageServer(msg);
			 document.getElementById("textBox").scrollTop = document.getElementById("textBox").scrollHeight;
		});
		
		  socket.on("updateChat", function(msg) {
			 addChatMessage(msg);
			 document.getElementById("textBox").scrollTop = document.getElementById("textBox").scrollHeight;
		});
		
		
		
		$( document ).ready(function() {
		  $(document).on("keypress", "#chat", function(e) {
     if (e.which == 13 && ($('#chat').val() != '')) {
       socket.emit('chatMsg', $('#chat').val());
      $('#chat').val('');
     }
});
		  document.getElementById("textBox").scrollTop = document.getElementById("textBox").scrollHeight;
});

  socket.on('disconnect', function(){
      addChatMessageServer('You disconnected!');
  });

function addChatMessageServer(message){
  $("#messageList").append('<li class="blue-text text-darken-2">' + message + '</li>');
}

function addChatMessage(message){
  $("#messageList").append('<li>' + message + '</li>');
}

function updatePlayerLabels(main, player2, player3, player4, player5){
  if(player2 == null || player2 == undefined){
    player2 = "";
  }
  if(player3 == null || player2 == undefined){
    player3 = "";
  }
  if(player4 == null || player2 == undefined){
    player4 = "";
  }
  if(player5 == null || player2 == undefined){
    player5 = "";
  }
  $("#player1label").html("1. " + main);
  $("#player2label").html("2. " + player2);
  $("#player3label").html("3. " + player3);
  $("#player4label").html("4. " + player4);
  $("#player5label").html("5. " + player5);
}

    
var game;
var interval; 
var counter;
var gameRunning = false;
var canvasObj = [document.getElementById("mainCanvas"),
                document.getElementById("player2Canvas"),
                document.getElementById("player3Canvas"),
                document.getElementById("player4Canvas"),
               document.getElementById("player5Canvas"),
               document.getElementById("nextPieceCanvas"),
               document.getElementById("powerUpsCanvas")];

socket.on('ready', function(data){
	counter = 0;
	setTimeout(function(){
	 canvasObj[0].addEventListener('keydown', keydown, false);
	 game = new TetrisGame(interval, data);
	interval = setInterval(process, 1);
	canvasObj[0].focus();
	gameRunning = true;
	}, 5000);
});

  socket.on('gameInterval', function(){
     if(gameRunning){
         process();
     } 
  });
  
  socket.on("gameOver", function(){
      gameRunning = false;
    if(game.hasLost){
        clearInterval(interval);
        drawLost(canvasObj[0]);
        clearCanvas(canvasObj[1]);
        clearCanvas(canvasObj[2]);
        clearCanvas(canvasObj[3]);
        clearCanvas(canvasObj[4]);
        clearCanvas(canvasObj[5]);
        clearCanvas(canvasObj[6]);
    }else{
        clearInterval(interval);
        drawWon(canvasObj[0]);
        clearCanvas(canvasObj[1]);
        clearCanvas(canvasObj[2]);
        clearCanvas(canvasObj[3]);
        clearCanvas(canvasObj[4]);
        clearCanvas(canvasObj[5]);
        clearCanvas(canvasObj[6]);
        
    }
  });
  
socket.on("clientPower", function(data) {
    game.handlePower(data);
});

function process(){
    counter++;
    if(counter >= 50){
        counter = 0;
    socket.emit('gameUpdate', [game.boardVar, game.boardStatic]);
    }
    game.process();
    drawPowerUps(canvasObj[6], game.powerUpArray);
    clearCanvas(canvasObj[0]);
    updateCanvasFromArray(game.boardVar, canvasObj[0]);
    drawNextPiece(game.getNextPiece());
    if(game.hasLost){
        gameRunning = false;
        socket.emit("lost");
        clearInterval(interval);
        clearCanvas(canvasObj[6]);
        drawLost(canvasObj[0]);
    }
}


function drawPowerUps(canvas1, array){
    clearCanvas(canvas1);
    for(var o = 0; o < array.length; o++){
        var height = canvas1.height;
        var width = canvas1.width;
        var textString;
        var textWidth;
        var ctx = canvas1.getContext("2d");
                
        
        switch(array[o]) {
                case "A":
                    ctx.fillStyle = "grey";
                    ctx.fillRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.strokeRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "A";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, o*(width/8) + (((width/8)/2.5) - (textWidth/2)), height - 7.5);
                    break;
                case "C":
                    ctx.fillStyle = "grey";
                    ctx.fillRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.strokeRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "C";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, o*(width/8) + (((width/8)/2.5) - (textWidth/2)), height - 7.5);
                    break;
                case "S":
                    ctx.fillStyle = "grey";
                    ctx.fillRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.strokeRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "S";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, o*(width/8) + (((width/8)/2.5) - (textWidth/2)), height - 7.5);
                    break;
                case "G":
                    ctx.fillStyle = "grey";
                    ctx.fillRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.strokeRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "G";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, o*(width/8) + (((width/8)/2.5) - (textWidth/2)), height - 7.5);
                    break;
                case "E":
                    ctx.fillStyle = "grey";
                    ctx.fillRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.strokeRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "E";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, o*(width/8) + (((width/8)/2.5) - (textWidth/2)), height - 7.5);
                    break;
                case "N":
                    ctx.fillStyle = "grey";
                    ctx.fillRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.strokeRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "N";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, o*(width/8) + (((width/8)/2.5) - (textWidth/2)), height - 7.5);
                    break;
                case "R":
                    ctx.fillStyle = "grey";
                    ctx.fillRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.strokeRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "R";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, o*(width/8) + (((width/8)/2.5) - (textWidth/2)), height - 7.5);
                    break;
                case "D":
                    ctx.fillStyle = "grey";
                    ctx.fillRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.strokeRect(o*(width/8), 0*(height/20), width/10, height);
                    ctx.fillStyle = "#000000";
                    ctx.font = '30px roboto';
                    textString = "D";
                    textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, o*(width/8) + (((width/8)/2.5) - (textWidth/2)), height - 7.5);
                    break;
	        }
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
    var extraVar;
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
      case KEY.ONE:
          if(users[0] != ""){
        var powerUp = game.powerUpArray.splice(0, 1)[0];
        if(powerUp != null){
        socket.emit("power", [powerUp, users[0], 1]);
        }
          }
        break;
      case KEY.TWO:
          if(users[1] != ""){
        var powerUp = game.powerUpArray.splice(0, 1)[0];
        if(powerUp != null){
        socket.emit("power", [powerUp, users[1], 1]);
        }
          }
          break;
      case KEY.THREE:
          if(users[2] != ""){
        var powerUp = game.powerUpArray.splice(0, 1)[0];
        if(powerUp != null){
        socket.emit("power", [powerUp, users[2], 1]);
        }
          }
          break;
      case KEY.FOUR:
          if(users[3] != ""){
        var powerUp = game.powerUpArray.splice(0, 1)[0];
        if(powerUp != null){
        socket.emit("power", [powerUp, users[3], 1]);
        }
          }
          break;
      case KEY.FIVE:
          if(users[4] != ""){
        var powerUp = game.powerUpArray.splice(0, 1)[0];
        if(powerUp != null){
        socket.emit("power", [powerUp, users[4], 1]);
        }
          }
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
    clearCanvas(canvasObj[1]);
    clearCanvas(canvasObj[2]);
     clearCanvas(canvasObj[3]);
     clearCanvas(canvasObj[4]);
    if(data[0] != null) {
        if(data[0] != "LOST"){
        updateCanvasFromArray(data[0], canvasObj[1]);
        }else{
            drawLost(canvasObj[1]);
        }
    }
    if(data[1] != null) {
        if(data[1] != "LOST"){
        updateCanvasFromArray(data[1], canvasObj[2]);
        }else{
            drawLost(canvasObj[2]);
        }
    }
    if(data[2] != null) {
        if(data[2] != "LOST"){
        updateCanvasFromArray(data[2], canvasObj[3]);
        }else{
            drawLost(canvasObj[3]);
        }
    }
    if(data[3] != null) {
        if(data[3] != "LOST"){
        updateCanvasFromArray(data[3], canvasObj[4]);
        }else{
            drawLost(canvasObj[4]);
        }
    }
});

})();
