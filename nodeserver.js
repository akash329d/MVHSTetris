/*global TetrisGame
global gameServer
*/
"use strict";
var express = require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {'pingInterval': 7500, 'pingTimeout': 15000});
var fs = require("fs");
var JavaScriptObfuscator = require('javascript-obfuscator');
var didYouMean = require("didyoumean");
var censorjs = require('censorjs');
var htmlspecialchars = require('htmlspecialchars');
didYouMean.threshold = null;
var $;

//Intialize nodeServer jQuery.
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    $ = require("jquery")(window);
});


//Github Adjective/Noun library.
var adjectives= ["aback","abaft","abandoned","abashed","aberrant",
    "abhorrent","abiding","abject","ablaze","able","abnormal","aboard",
    "aboriginal","abortive","abounding","abrasive","abrupt","absent",
    "absorbed","absorbing","abstracted","absurd","abundant","abusive",
    "acceptable","accessible","accidental","accurate","acid","acidic",
    "acoustic","acrid","actually","adHoc","adamant","adaptable","addicted",
    "adhesive","adjoining","adorable","adventurous","afraid","aggressive",
    "agonizing","agreeable","ahead","ajar","alcoholic","alert","alike",
    "alive","alleged","alluring","aloof","amazing","ambiguous","ambitious",
    "amuck","amused","amusing","ancient","angry","animated","annoyed",
    "annoying","anxious","apathetic","aquatic","aromatic","arrogant",
    "ashamed","aspiring","assorted","astonishing","attractive","auspicious",
    "automatic","available","average","awake","aware","awesome","awful",
    "axiomatic","bad","barbarous","bashful","bawdy","beautiful",
    "befitting","belligerent","beneficial","bent","berserk","best","better",
    "bewildered","big","billowy","bite-Sized","bitter","bizarre","black",
    "black-And-White","bloody","blue","blue-Eyed","blushing","boiling",
    "boorish","bored","boring","bouncy","boundless","brainy","brash","brave",
    "brawny","breakable","breezy","brief","bright","bright","broad","broken",
    "brown","bumpy","burly","bustling","busy","cagey","calculating","callous",
    "calm","capable","capricious","careful","careless","caring","cautious",
    "ceaseless","certain","changeable","charming","cheap","cheerful",
    "chemical","chief","childlike","chilly","chivalrous","chubby","chunky",
    "clammy","classy","clean","clear","clever","cloistered","cloudy","closed",
    "clumsy","cluttered","coherent","cold","colorful","colossal","combative",
    "comfortable","common","complete","complex","concerned","condemned",
    "confused","conscious","cooing","cool","cooperative","coordinated",
    "courageous","cowardly","crabby","craven","crazy","creepy","crooked",
    "crowded","cruel","cuddly","cultured","cumbersome","curious","curly",
    "curved","curvy","cut","cute","cute","cynical","daffy","daily","damaged",
    "damaging","damp","dangerous","dapper","dark","dashing","dazzling","dead",
    "deadpan","deafening","dear","debonair","decisive","decorous","deep","deeply",
    "defeated","defective","defiant","delicate","delicious","delightful","demonic",
    "delirious","dependent","depressed","deranged","descriptive","deserted","detailed",
    "determined","devilish","didactic","different","difficult","diligent","direful",
    "dirty","disagreeable","disastrous","discreet","disgusted","disgusting","disillusioned",
    "dispensable","distinct","disturbed","divergent","dizzy","domineering","doubtful",
    "drab","draconian","dramatic","dreary","drunk","dry","dull","dusty","dusty","dynamic",
    "dysfunctional","eager","early","earsplitting","earthy","easy","eatable","economic",
    "educated","efficacious","efficient","eight","elastic","elated","elderly","electric",
    "elegant","elfin","elite","embarrassed","eminent","empty","enchanted","enchanting",
    "encouraging","endurable","energetic","enormous","entertaining","enthusiastic","envious",
    "equable","equal","erect","erratic","ethereal","evanescent","evasive","even","excellent",
    "excited","exciting","exclusive","exotic","expensive","extra-Large","extra-Small","exuberant",
    "exultant","fabulous","faded","faint","fair","faithful","fallacious","false","familiar",
    "famous","fanatical","fancy","fantastic","far","far-Flung","fascinated","fast","fat",
    "faulty","fearful","fearless","feeble","feigned","female","fertile","festive","few",
    "fierce","filthy","fine","finicky","first","five","fixed","flagrant","flaky","flashy","flat",
    "flawless","flimsy","flippant","flowery","fluffy","fluttering","foamy","foolish","foregoing",
    "forgetful","fortunate","four","frail","fragile","frantic","free","freezing","frequent",
    "fresh","fretful","friendly","frightened","frightening","full","fumbling","functional",
    "funny","furry","furtive","future","futuristic","fuzzy","gabby","gainful","gamy","gaping",
    "garrulous","gaudy","general","gentle","giant","giddy","gifted","gigantic","glamorous","gleaming",
    "glib","glistening","glorious","glossy","godly","good","goofy","gorgeous","graceful","grandiose",
    "grateful","gratis","gray","greasy","great","greedy","green","grey","grieving","groovy","grotesque",
    "grouchy","grubby","gruesome","grumpy","guarded","guiltless","gullible","gusty","guttural",
    "habitual","half","hallowed","halting","handsome","handsomely","handy","hanging","hapless","happy","hard",
    "hard-To-Find","harmonious","harsh","hateful","heady","healthy","heartbreaking","heavenly","heavy","hellish",
    "helpful","helpless","hesitant","hideous","high","highfalutin","high-Pitched","hilarious","hissing",
    "historical","holistic","hollow","homeless","homely","honorable","horrible","hospitable","hot",
    "huge","hulking","humdrum","humorous","hungry","hurried","hurt","hushed","husky","hypnotic","hysterical",
    "icky","icy","idiotic","ignorant","ill","illegal","ill-Fated","ill-Informed","illustrious","imaginary",
    "immense","imminent","impartial","imperfect","impolite","important","imported","impossible","incandescent",
    "incompetent","inconclusive","industrious","incredible","inexpensive","infamous","innate","innocent",
    "inquisitive","insidious","instinctive","intelligent","interesting","internal","invincible","irate",
    "irritating","itchy","jaded","jagged","jazzy","jealous","jittery","jobless","jolly","joyous","judicious",
    "juicy","jumbled","jumpy","juvenile","kaput","keen","kind","kindhearted","kindly","knotty","knowing",
    "knowledgeable","known","labored","lackadaisical","lacking","lame","lamentable","languid","large","last",
    "late","laughable","lavish","lazy","lean","learned","left","legal","lethal","level","lewd","light","like",
    "likeable","limping","literate","little","lively","lively","living","lonely","long","longing","long-Term",
    "loose","lopsided","loud","loutish","lovely","loving","low","lowly","lucky","ludicrous","lumpy","lush",
    "luxuriant","lying","lyrical","macabre","macho","maddening","madly","magenta","magical","magnificent",
    "majestic","makeshift","male","malicious","mammoth","maniacal","many","marked","massive","married","marvelous",
    "material","materialistic","mature","mean","measly","meaty","medical","meek","mellow","melodic","melted",
    "merciful","mere","messy","mighty","military","milky","mindless","miniature","minor","miscreant","misty",
    "mixed","moaning","modern","moldy","momentous","motionless","mountainous","muddled","mundane","murky","mushy",
    "mute","mysterious","naive","nappy","narrow","nasty","natural","naughty","nauseating","near","neat","nebulous",
    "necessary","needless","needy","neighborly","nervous","new","next","nice","nifty","nimble","nine","nippy",
    "noiseless","noisy","nonchalant","nondescript","nonstop","normal","nostalgic","nosy","noxious","null",
    "numberless","numerous","nutritious","nutty","oafish","obedient","obeisant","obese","obnoxious","obscene",
    "obsequious","observant","obsolete","obtainable","oceanic","odd","offbeat","old","old-Fashioned","omniscient",
    "one","onerous","open","opposite","optimal","orange","ordinary","organic","ossified","outgoing","outrageous",
    "outstanding","oval","overconfident","overjoyed","overrated","overt","overwrought","painful","painstaking",
    "pale","paltry","panicky","panoramic","parallel","parched","parsimonious","past","pastoral","pathetic","peaceful",
    "penitent","perfect","periodic","permissible","perpetual","petite","petite","phobic","physical","picayune","pink",
    "piquant","placid","plain","plant","plastic","plausible","pleasant","plucky","pointless","poised","polite","political",
    "poor","possessive","possible","powerful","precious","premium","present","pretty","previous","pricey","prickly","private",
    "probable","productive","profuse","protective","proud","psychedelic","psychotic","public","puffy","pumped","puny",
    "purple","purring","pushy","puzzled","puzzling","quack","quaint","quarrelsome","questionable","quick","quickest",
    "quiet","quirky","quixotic","quizzical","rabid","racial","ragged","rainy","rambunctious","rampant","rapid",
    "rare","raspy","ratty","ready","real","rebel","receptive","recondite","red","redundant","reflective",
    "regular","relieved","remarkable","reminiscent","repulsive","resolute","resonant","responsible","rhetorical",
    "rich","right","righteous","rightful","rigid","ripe","ritzy","roasted","robust","romantic","roomy","rotten",
    "rough","round","royal","ruddy","rude","rural","rustic","ruthless","sable","sad","safe","salty","same","sassy",
    "satisfying","savory","scandalous","scarce","scared","scary","scattered","scientific","scintillating","scrawny",
    "screeching","second","second-Hand","secret","secretive","sedate","seemly","selective","selfish","separate","serious",
    "shaggy","shaky","shallow","sharp","shiny","shivering","shocking","short","shrill","shut","shy","sick","silent","silent",
    "silky","silly","simple","simplistic","sincere","six","skillful","skinny","sleepy","slim","slimy","slippery","sloppy",
    "slow","small","smart","smelly","smiling","smoggy","smooth","sneaky","snobbish","snotty","soft","soggy","solid",
    "somber","sophisticated","sordid","sore","sore","sour","sparkling","special","spectacular","spicy","spiffy","spiky",
    "spiritual","spiteful","splendid","spooky","spotless","spotted","spotty","spurious","squalid","square","squealing",
    "squeamish","staking","stale","standing","statuesque","steadfast","steady","steep","stereotyped","sticky","stiff",
    "stimulating","stingy","stormy","straight","strange","striped","strong","stupendous","stupid","sturdy","subdued","subsequent",
    "substantial","successful","succinct","sudden","sulky","super","superb","superficial","supreme","swanky","sweet","sweltering",
    "swift","symptomatic","synonymous","taboo","tacit","tacky","talented","tall","tame","tan","tangible","tangy","tart","tasteful",
    "tasteless","tasty","tawdry","tearful","tedious","teeny","teeny-Tiny","telling","temporary","ten","tender","tense","tense",
    "tenuous","terrible","terrific","tested","testy","thankful","therapeutic","thick","thin","thinkable","third","thirsty",
    "thirsty","thoughtful","thoughtless","threatening","three","thundering","tidy","tight","tightfisted","tiny","tired","tiresome",
    "toothsome","torpid","tough","towering","tranquil","trashy","tremendous","tricky","trite","troubled","truculent","true",
    "truthful","two","typical","ubiquitous","ugliest","ugly","ultra","unable","unaccountable","unadvised","unarmed","unbecoming",
    "unbiased","uncovered","understood","undesirable","unequal","unequaled","uneven","unhealthy","uninterested","unique","unkempt",
    "unknown","unnatural","unruly","unsightly","unsuitable","untidy","unused","unusual","unwieldy","unwritten","upbeat","uppity",
    "upset","uptight","used","useful","useless","utopian","utter","uttermost","vacuous","vagabond","vague","valuable","various","vast",
    "vengeful","venomous","verdant","versed","victorious","vigorous","violent","violet","vivacious","voiceless","volatile",
    "voracious","vulgar","wacky","waggish","waiting","wakeful","wandering","wanting","warlike","warm","wary","wasteful","watery",
    "weak","wealthy","weary","well-Groomed","well-Made","well-Off","well-To-Do","wet","whimsical","whispering","white","whole",
    "wholesale","wicked","wide","wide-Eyed","wiggly","wild","willing","windy","wiry","wise","wistful","witty","woebegone","womanly",
    "wonderful","wooden","woozy","workable","worried","worthless","wrathful","wretched","wrong","wry","yellow","yielding","young",
    "youthful","yummy","zany","zealous","zesty","zippy","zonked"];
var nouns= ["ninja","chair","pancake","statue","unicorn","rainbows","laser","senor",
    "bunny","captain","nibblets","cupcake","carrot","gnomes","glitter","potato","salad",
    "toejam","curtains","beets","toilet","exorcism","stickfigures","mermaideggs","seabarnacles",
    "dragons","jellybeans","snakes","dolls","bushes","cookies","apples","icecream","ukulele","kazoo",
    "banjo","operasinger","circus","trampoline","carousel","carnival","locomotive","hotairballoon",
    "prayingmantis","animator","artisan","artist","colorist","inker","coppersmith","director","designer",
    "flatter","stylist","leadman","limner","make-upartist","model","musician","penciller","producer","scenographer",
    "setdecorator","silversmith","teacher","automechanic","beader","bobbinboy","clerkofthechapel","fillingstationattendant",
    "foreman","maintenanceengineering","mechanic","miller","moldmaker","panelbeater","patternmaker","plantoperator","plumber",
    "sawfiler","shopforeman","soaper","stationaryengineer","wheelwright","woodworkers"];
var gamejs;
var doObfuscate = true;

//GAME SERVER CLASSES
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

class gameServer{
	//Created By reddituser329
    constructor(gameID){
    	this.gameID = gameID;
        this.voting = false;
        this.kickVotesYes = 0;
        this.kickVotesNo = 0;
        this.gameRunning = false;
        this.gameUpdateInterval;
        this.gameProcessInterval;
        this.userToKick;
        this.users = {undefined:{name: '', socket: '', game: '', index: '', voted: false}};
        this.orderedSockets = [];
        this.usernamevalid = /^[a-zA-Z0-9_-]+( [a-zA-Z0-9_-]+)*$/;
        this.usersPlaying = [];
        this.countdownStarted = false;
    }
    //Created By reddituser329
    gameUpdate(socket, data){
        if (this.users[socket.id] != undefined){
	    this.users[socket.id].gameBoard = data[0];	
	    this.users[socket.id].gameBoardStatic = data[1];	
	}
    }
    //Created By reddituser329
    userAmount(){
    	return (Object.size(this.users) - 1);
    }
    //Created By reddituser329
    userLogon(socket, data){
        if((Object.size(this.users) - 1) >= 5){
		    socket.emit("update", 'Server has too many people!');
			socket.disconnect();
		}else if(data == null || data == undefined){
		    //This means they didn't select a username, most likely blocked alerts.
		    socket.emit("update", "No username recieved or null, random username assigned.");
			data = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)];
			this.submitUsernameValidation(socket, data);
		}else if(data.length > 35 || data.length < 3){
		    socket.emit("update", 'Username too short/long, please choose a different one!');
			socket.disconnect();
		}else{
		    this.submitUsernameValidation(socket, data);
		}
    }
    //Created By reddituser329
    hackingDetected(socket, data){
        if (this.users[socket.id] != undefined){
		socket.broadcast.to(this.gameID).emit("update", 'Server detected "' + this.users[socket.id].name + '" hacking, was kicked!');
		socket.emit("update", "You were suspected of hacking, kicked!");
		socket.disconnect();
		}
    }
    //Created By reddituser329
    chatMessage(socket, data){
        if (this.users[socket.id] != undefined){
			if (data.length > 150) {
				socket.emit("update", "Chat message too long, please stay under 150 characters");
			} 
			else if(data.charAt(0) == "/") {
				switch(data.substring(0,6)){
					case "/ready":
							if (this.gameRunning) {
								socket.emit("update", "Game already running!");
							} else {
								if (this.users[socket.id].ready == false) {
									this.users[socket.id].ready = true;
									var users = this.users;
									var amountReady = $.grep(Object.keys(this.users), function(k) {
										return users[k].ready == true; 
									}).length;
									io.sockets.in(this.gameID).emit("update", this.users[socket.id].name + " is ready to play! (" + amountReady + "/" + (Object.size(this.users) - 1) + ")");
									if (amountReady > (Object.size(this.users) - 1) / 2 && !this.countdownStarted) {
										if (amountReady > 1) {
											io.sockets.in(this.gameID).emit("update", "Get ready to start the game!");
											this.countdownStarted = true;
											var mult = 10;
											for (var m = 0; m < 10; m++) {
												setTimeout(()  => {
													io.sockets.in(this.gameID).emit("update", mult);
													mult--;
												}, m * 1000);
											}
											setTimeout(()  => {
												this.countdownStarted = false;
												this.gameRunning = true;
												var randNum = Math.floor(Math.random() * (1000000));
												var users = this.users;
												this.usersPlaying = $.grep(Object.keys(users), function(k) {
													return users[k].ready == true;
												});
												for (var i = 0; i < this.usersPlaying.length; i++) {
													this.users[this.usersPlaying[i]].socket.emit("ready", randNum);
													this.users[this.usersPlaying[i]].ready = false;
													this.users[this.usersPlaying[i]].lastUpdate = new Date();
												}
												
											}, 5000);
											setTimeout(()  => {
												for (var i = 0; i < this.usersPlaying.length; i++) {
													this.users[this.usersPlaying[i]].lastUpdate = new Date();
												}
												this.gameProcessInterval = setInterval(()  => {
													io.sockets.in(this.gameID).emit('gameInterval');
												}, 20);
												this.gameUpdateInterval = setInterval(()  => {
													this.updateGameViews();
												}, 250);
												
											},10000);
										} else {
											io.sockets.in(this.gameID).emit("update", "Need more than 1 person to start the game!");
										}
									}
								} else {
									socket.emit("update", "You already readied up! Stop spamming!");
								}
							}
						break;
					case "/kick ":
						if((Object.size(this.users) - 1) > 2){
						if(!this.voting){
							for(var x = 0; x < 5; x++){
								if(this.users[this.orderedSockets[x]].name != 0){
									this.users[this.orderedSockets[x]].voted = false;	
								}
							}
							var theUsers = this.users;
							var arrayOfObject =  Object.keys(this.users).map(function(key) {return theUsers[key];});
							didYouMean.returnWinningObject = true;
							this.userToKick = null;
							this.userToKick = didYouMean(data.slice(6), arrayOfObject, "name");
							if(this.userToKick != null){
								this.voting = true;
								this.users[socket.id].voted = true;
								setTimeout(()   => {
									if(this.voting == true){
										io.sockets.in(this.gameID).emit("update", "Kick vote was cancelled, ran out of time!");
										this.voting = false;
										this.kickVotesYes = 0;
										this.kickVotesNo = 0;
									}
								}, 20000);
								io.sockets.in(this.gameID).emit("update", "A vote to kick " + this.userToKick.name + " has begun!");
								io.sockets.in(this.gameID).emit("update", "Type /y to vote yes and /n to vote no!");
								this.kickVotesYes = 1;
								this.kickVotesNo = 0;
								io.sockets.in(this.gameID).emit("update", this.kickVotesYes + " out of " + (Object.size(this.users) - 1) + " users voted to kick " + this.userToKick.name);
								if(this.kickVotesYes >= (Object.size(this.users) / 2)) {
									io.sockets.in(this.gameID).emit("update" , this.userToKick.name + " was kicked!");
									this.userToKick.socket.disconnect();
									this.voting = false;
								}
							}
							else{
								socket.emit("update", "That username wasn't recognized!");
							}
						}
						else{
							socket.emit("update", "Kick vote already in progress!");
						}
						}else{
							socket.emit("update", "Can't start a kick with less than 3 people!");
						}
						break;
					case "/y":
						if(this.voting && !this.users[socket.id].voted) {
							socket.emit("update", "You voted yes to the kick vote!");
							this.kickVotesYes += 1;
							io.sockets.in(this.gameID).emit("update", this.kickVotesYes + " out of " + (Object.size(this.users) - 1) + " users voted to kick " + this.userToKick.name);
							this.users[socket.id].voted = true;
							if(this.kickVotesYes == (Object.size(this.users) - 1) - 1) {
								this.userToKick.socket.disconnect();
								this.voting = false;
								io.sockets.in(this.gameID).emit("update", this.userToKick.name + " was kicked!");
							}
						}
						else if (!this.voting) {
							socket.emit("update", "There is no kick vote!");
						}
						else {
							socket.emit("update", "You have already voted!");
						}
						break;
					case "/n":
						if(this.voting && !this.users[socket.id].voted) {
							this.kickVotesNo += 1;
							socket.emit("update", "You voted no to the kick vote!");
							io.sockets.in(this.gameID).emit("update", this.kickVotesNo + " out of " + (Object.size(this.users) - 1) + " users voted not to kick " + this.userToKick.name);
							this.users[socket.id].voted = true;
							if(this.kickVotesNo > this.kickVotesYes){
								io.sockets.in(this.gameID).emit("update", "Kick vote was cancelled!");
										this.voting = false;
										this.kickVotesYes = 0;
										this.kickVotesNo = 0;
							}
						}
						else if(!this.voting) {
							socket.emit("update", "There is no kick vote!");
						}
						else {
							socket.emit("update", "You have already voted!");
						}
						break;
					default:
							socket.emit("update", "Sorry, that command wasn't recognized!");
							break;
				}
			}
			else {
				data = censorjs.clean(data);
				data = htmlspecialchars(data);
				io.sockets.in(this.gameID).emit("updateChat", this.users[socket.id].name + ": " + data);
			}
		}
    }
    
    //Created By reddituser329
    lost(socket, data){
        if (this.users[socket.id] != undefined){
		if(this.usersPlaying.length > 1 && $.inArray(socket.id, this.usersPlaying) != -1){
			this.usersPlaying.remove(socket.id);
			io.sockets.in(this.gameID).emit("update", this.users[socket.id].name + " lost the game!");
			this.users[socket.id].gameBoard = "LOST";
			if(this.usersPlaying.length == 1){
			this.gameRunning = false;
			clearInterval(this.gameUpdateInterval);
			clearInterval(this.gameProcessInterval);
			io.sockets.in(this.gameID).emit("gameOver");
			io.sockets.in(this.gameID).emit("update", this.users[this.usersPlaying[0]].name + " won the game!");
			for(var x = 0; x < 5; x++){
			if(this.users[this.orderedSockets[x]].name != 0){
				this.users[this.orderedSockets[x]].gameBoard = null;	
				this.updateGameViews();
			}
			}
			this.usersPlaying = [];
			
			}
			}
		}
    }
    
    //Created by reddituser329.
    power(socket, data){
        if (this.users[socket.id] != undefined){
		var powerUpName;
		switch(data[0]){
            case "A":
                powerUpName = "Add Line";
                break;
            case "N":
                powerUpName = "Nuke";
                break;
            case "E":
            	powerUpName = "Earthquake";
            	break;
            case "C":
                powerUpName = "Clear Line";
                break;
            case "S":
                powerUpName = "Switch Fields";
                break;
            case "D":
                powerUpName = "Darkness";
                break;
            case "I":
            	powerUpName = "Inverted Controls";
            	break;
            case "R":
            	powerUpName = "Random Clear";
            	break;
            case "default":
            	powerUpName = "unknown";
            	break;
        }
		
		for(var k = 0; k < data[2]; k ++) {
			data[3 + k] = Math.random();
		}
		if(data[1] == "all"){
		socket.broadcast.to(this.gameID).emit("clientPower", data);
		}else{
			var users = this.users;
			var targetSocket = $.grep(Object.keys(this.users), function (k) {
				return users[k].name == data[1];
			});
			io.sockets.in(this.gameID).emit("update", this.users[socket.id].name + " used " + powerUpName + " on " + this.users[targetSocket[0]].name + "!");
			if(data[0] == "S"){
				var gameBoard1 = this.users[targetSocket[0]].gameBoardStatic;
				var gameBoard2 = this.users[socket.id].gameBoardStatic;
				data[2] = gameBoard1;
				socket.emit("clientPower", data);
				data[2] = gameBoard2;
				this.users[targetSocket[0]].socket.emit("clientPower", data);
			}else{
				this.users[targetSocket[0]].socket.emit("clientPower", data);	
			}
			
		}
		}
    }
    
    //Created By reddituser329
    disconnect(socket, data){
        if (this.users[socket.id] != undefined) {
			if(this.usersPlaying.length > 1 && $.inArray(socket.id, this.usersPlaying) != -1){
			this.usersPlaying.remove(socket.id);
			io.sockets.in(this.gameID).emit("update", this.users[socket.id].name + " lost the game!");
			this.users[socket.id].gameBoard = "LOST";
			if(this.usersPlaying.length == 1){
			this.gameRunning = false;
			clearInterval(this.gameUpdateInterval);
			clearInterval(this.gameProcessInterval);
			io.sockets.in(this.gameID).emit("gameOver");
			io.sockets.in(this.gameID).emit("update", this.users[this.usersPlaying[0]].name + " won the game!");
			for(var x = 0; x < 5; x++){
			if(this.users[this.orderedSockets[x]].name != 0){
				this.users[this.orderedSockets[x]].gameBoard = null;	
				this.updateGameViews();
			}
			}
			this.usersPlaying = [];
			
			}
			}
			io.sockets.in(this.gameID).emit("update", this.users[socket.id].name + " has left the server.");
			this.orderedSockets.splice(this.orderedSockets.indexOf(socket.id), 1);
			delete this.users[socket.id];
			this.updateUsernameLabels();
			
		}
    }
    
    //Created By reddituser329
    updateGameViews(){
	for(var x = 0; x < 5; x++){
		if(this.users[this.orderedSockets[x]].name != 0){
		switch(x){
			case 0:
				this.users[this.orderedSockets[0]].socket.emit("updateViews", [this.users[this.orderedSockets[1]].gameBoard, this.users[this.orderedSockets[2]].gameBoard, this.users[this.orderedSockets[3]].gameBoard, this.users[this.orderedSockets[4]].gameBoard]);
				break;
			case 1:
				this.users[this.orderedSockets[1]].socket.emit("updateViews", [this.users[this.orderedSockets[0]].gameBoard, this.users[this.orderedSockets[2]].gameBoard, this.users[this.orderedSockets[3]].gameBoard, this.users[this.orderedSockets[4]].gameBoard]);
				break;
			case 2:
				this.users[this.orderedSockets[2]].socket.emit("updateViews", [this.users[this.orderedSockets[0]].gameBoard, this.users[this.orderedSockets[1]].gameBoard, this.users[this.orderedSockets[3]].gameBoard, this.users[this.orderedSockets[4]].gameBoard]);
				break;
			case 3:
				this.users[this.orderedSockets[3]].socket.emit("updateViews", [this.users[this.orderedSockets[0]].gameBoard, this.users[this.orderedSockets[1]].gameBoard, this.users[this.orderedSockets[2]].gameBoard, this.users[this.orderedSockets[4]].gameBoard]);
				break;
			case 4:
				this.users[this.orderedSockets[4]].socket.emit("updateViews", [this.users[this.orderedSockets[0]].gameBoard, this.users[this.orderedSockets[1]].gameBoard, this.users[this.orderedSockets[2]].gameBoard, this.users[this.orderedSockets[3]].gameBoard]);
				break;
		}	
	}
	}
}

//Created By reddituser329
    submitUsernameValidation(socket, username){
    	var usersArray = this.users;
        if(($.grep(Object.keys(this.users), function (k) {return usersArray[k].name == username; }).length == 0)){
            if(username.match(this.usernamevalid)){
            	username = censorjs.clean(username);
                this.users[socket.id] = {name: username, socket: socket, ready: false};
                this.orderedSockets[this.orderedSockets.length] = socket.id;
				socket.emit("update", "Welcome " + this.users[socket.id].name + ", server communication established.");
				socket.emit("update", 'To ready up, type /ready!')
				socket.broadcast.to(this.gameID).emit("update", this.users[socket.id].name + " connected to the server!");
				this.updateUsernameLabels();
            }else{
                socket.emit("update", "Illegal Username, please use normal characters.");
				socket.disconnect();
            }
        }else{
            socket.emit("update", "Username already in use, please choose something else.");
			socket.disconnect();
        }
    }
    
    //Created By reddituser329
    updateUsernameLabels(){
	for(var x = 0; x < 5; x++){
		if(this.users[this.orderedSockets[x]].name != 0){
		switch(x){
			case 0:
				this.users[this.orderedSockets[0]].socket.emit("updateLabels", [this.users[this.orderedSockets[0]].name, this.users[this.orderedSockets[1]].name, this.users[this.orderedSockets[2]].name, this.users[this.orderedSockets[3]].name, this.users[this.orderedSockets[4]].name]);
				break;
			case 1:
				this.users[this.orderedSockets[1]].socket.emit("updateLabels", [this.users[this.orderedSockets[1]].name, this.users[this.orderedSockets[0]].name, this.users[this.orderedSockets[2]].name, this.users[this.orderedSockets[3]].name, this.users[this.orderedSockets[4]].name]);
				break;
			case 2:
				this.users[this.orderedSockets[2]].socket.emit("updateLabels", [this.users[this.orderedSockets[2]].name, this.users[this.orderedSockets[0]].name, this.users[this.orderedSockets[1]].name, this.users[this.orderedSockets[3]].name, this.users[this.orderedSockets[4]].name]);
				break;
			case 3:
				this.users[this.orderedSockets[3]].socket.emit("updateLabels", [this.users[this.orderedSockets[3]].name, this.users[this.orderedSockets[0]].name, this.users[this.orderedSockets[1]].name, this.users[this.orderedSockets[2]].name, this.users[this.orderedSockets[4]].name]);
				break;
			case 4:
				this.users[this.orderedSockets[4]].socket.emit("updateLabels", [this.users[this.orderedSockets[4]].name, this.users[this.orderedSockets[0]].name, this.users[this.orderedSockets[1]].name, this.users[this.orderedSockets[2]].name, this.users[this.orderedSockets[3]].name]);
				break;
		}	
	}
	}
}



}


console.log('Obfuscating/Protecting Javascript...');
//Node Library (JavaScriptObfuscator).
function obfuscate(){
gamejs = JavaScriptObfuscator.obfuscate(
    fs.readFileSync(__dirname + '/public/game.js', "utf8"),
    {
    compact: true,
    controlFlowFlattening: false,
    debugProtection: false,
    debugProtectionInterval: false,
    disableConsoleOutput: false,
    rotateStringArray: true,
    selfDefending: true,
    stringArray: false,
    stringArrayEncoding: false,
    unicodeEscapeSequence: true
});
    
}
obfuscate();
    
console.log('Obfuscation Finished! Ready to serve!');

//Created by reddituser329
app.get('/game.js',function(req,res){
	if(doObfuscate){
   res.send(gamejs.getObfuscatedCode());
	}else{
		res.send(fs.readFileSync(__dirname + '/public/game.js', "utf8"));
	}
});

//app.use("/game.js", express.static(__dirname + '/public/game.js'));

//Created by reddituser329
app.use("/favicon.png", express.static(__dirname + '/public/favicon.ico'));

app.get('/', function(req, res) {
	var string = fs.readFileSync(__dirname + '/public/gameselector.html', "utf8");
	string = string.replace('01923843290game1amount', gameServer1.userAmount());
	string = string.replace('01923843290game2amount', gameServer2.userAmount());
	res.send(string);
});

//Created by reddituser329
app.get('/*', function(req, res) {
	console.log(req.headers['x-forwarded-for'] + " Logged on at " + new Date());
	res.sendFile(__dirname + '/public/');
});

//Created by reddituser329
http.listen(process.env.PORT, process.env.IP);

var gameServer1 = new gameServer('game1');
var gameServer2 = new gameServer('game2');

var people = [];

//Created by reddituser329
io.on('connection', function(socket) {
	
	socket.on('gameUpdate', function(data){
		switch(people[socket.id]){
			case 'game1':
				gameServer1.gameUpdate(socket, data);
				break;
			case 'game2':
				gameServer2.gameUpdate(socket, data);
				break;
		}
	});
  
  //Created by reddituser329.
	socket.on('userLogon', function(data) {
		if(data[1] == '/8wyphr287ybtvo8r7y2r8y2r78horgb28lgk62r'){
			socket.join('game1');
			people[socket.id] = 'game1';
		}else if(data[1] == '/9034iueoasjdklasasdiowadiojsaoieufu90'){
			socket.join('game2');
			people[socket.id] = 'game2';
		}else{
			socket.emit('update', 'invalid game URL');
			socket.disconnect();
		}
		switch(people[socket.id]){
			case 'game1':
				gameServer1.userLogon(socket, data[0]);
				break;
			case 'game2':
				gameServer2.userLogon(socket, data[0]);
				break;
		}
	});
	
	//Created by reddituser329.
	socket.on('hackingDetected', function(data){
		switch(people[socket.id]){
			case 'game1':
				gameServer1.hackingDetected(socket, data);
				break;
			case 'game2':
				gameServer2.hackingDetected(socket, data);
				break;
		}
	});
	
	//Created By reddituser329
	socket.on('chatMsg', function(data) {
		switch(people[socket.id]){
			case 'game1':
				gameServer1.chatMessage(socket, data);
				break;
			case 'game2':
				gameServer2.chatMessage(socket, data);
				break;
		}
	});
	
	//Created reddituser329.
	socket.on("lost", function(data){
		switch(people[socket.id]){
			case 'game1':
				gameServer1.lost(socket, data);
				break;
			case 'game2':
				gameServer2.lost(socket, data);
				break;
		}
	});
	
	//Created By reddituser329
	socket.on("power", function(data){
		switch(people[socket.id]){
			case 'game1':
				gameServer1.power(socket, data);
				break;
			case 'game2':
				gameServer2.power(socket, data);
				break;
		}
	});
	
	//Created By reddituser329
	socket.on("disconnect", function(data) {
		switch(people[socket.id]){
			case 'game1':
				gameServer1.disconnect(socket, data);
				break;
			case 'game2':
				gameServer2.disconnect(socket, data);
				break;
		}
		delete people[socket.id];
	});
	
});







