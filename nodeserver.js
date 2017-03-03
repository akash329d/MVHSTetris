/*global TetrisGame*/
var express = require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var JavaScriptObfuscator = require('javascript-obfuscator');
var $;

var compressor = require('node-minify');


var fs = require("fs");
var vm = require('vm');
var gameRunning = false;
var gameUpdateInterval;
var gameProcessInterval;

vm.runInThisContext(fs.readFileSync(__dirname + "/serverGameHandler.js"));
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    $ = require("jquery")(window);
});

var adjectives= ["aback","abaft","abandoned","abashed","aberrant","abhorrent","abiding","abject","ablaze","able","abnormal","aboard","aboriginal","abortive","abounding","abrasive","abrupt","absent","absorbed","absorbing","abstracted","absurd","abundant","abusive","acceptable","accessible","accidental","accurate","acid","acidic","acoustic","acrid","actually","adHoc","adamant","adaptable","addicted","adhesive","adjoining","adorable","adventurous","afraid","aggressive","agonizing","agreeable","ahead","ajar","alcoholic","alert","alike","alive","alleged","alluring","aloof","amazing","ambiguous","ambitious","amuck","amused","amusing","ancient","angry","animated","annoyed","annoying","anxious","apathetic","aquatic","aromatic","arrogant","ashamed","aspiring","assorted","astonishing","attractive","auspicious","automatic","available","average","awake","aware","awesome","awful","axiomatic","bad","barbarous","bashful","bawdy","beautiful","befitting","belligerent","beneficial","bent","berserk","best","better","bewildered","big","billowy","bite-Sized","bitter","bizarre","black","black-And-White","bloody","blue","blue-Eyed","blushing","boiling","boorish","bored","boring","bouncy","boundless","brainy","brash","brave","brawny","breakable","breezy","brief","bright","bright","broad","broken","brown","bumpy","burly","bustling","busy","cagey","calculating","callous","calm","capable","capricious","careful","careless","caring","cautious","ceaseless","certain","changeable","charming","cheap","cheerful","chemical","chief","childlike","chilly","chivalrous","chubby","chunky","clammy","classy","clean","clear","clever","cloistered","cloudy","closed","clumsy","cluttered","coherent","cold","colorful","colossal","combative","comfortable","common","complete","complex","concerned","condemned","confused","conscious","cooing","cool","cooperative","coordinated","courageous","cowardly","crabby","craven","crazy","creepy","crooked","crowded","cruel","cuddly","cultured","cumbersome","curious","curly","curved","curvy","cut","cute","cute","cynical","daffy","daily","damaged","damaging","damp","dangerous","dapper","dark","dashing","dazzling","dead","deadpan","deafening","dear","debonair","decisive","decorous","deep","deeply","defeated","defective","defiant","delicate","delicious","delightful","demonic","delirious","dependent","depressed","deranged","descriptive","deserted","detailed","determined","devilish","didactic","different","difficult","diligent","direful","dirty","disagreeable","disastrous","discreet","disgusted","disgusting","disillusioned","dispensable","distinct","disturbed","divergent","dizzy","domineering","doubtful","drab","draconian","dramatic","dreary","drunk","dry","dull","dusty","dusty","dynamic","dysfunctional","eager","early","earsplitting","earthy","easy","eatable","economic","educated","efficacious","efficient","eight","elastic","elated","elderly","electric","elegant","elfin","elite","embarrassed","eminent","empty","enchanted","enchanting","encouraging","endurable","energetic","enormous","entertaining","enthusiastic","envious","equable","equal","erect","erratic","ethereal","evanescent","evasive","even","excellent","excited","exciting","exclusive","exotic","expensive","extra-Large","extra-Small","exuberant","exultant","fabulous","faded","faint","fair","faithful","fallacious","false","familiar","famous","fanatical","fancy","fantastic","far","far-Flung","fascinated","fast","fat","faulty","fearful","fearless","feeble","feigned","female","fertile","festive","few","fierce","filthy","fine","finicky","first","five","fixed","flagrant","flaky","flashy","flat","flawless","flimsy","flippant","flowery","fluffy","fluttering","foamy","foolish","foregoing","forgetful","fortunate","four","frail","fragile","frantic","free","freezing","frequent","fresh","fretful","friendly","frightened","frightening","full","fumbling","functional","funny","furry","furtive","future","futuristic","fuzzy","gabby","gainful","gamy","gaping","garrulous","gaudy","general","gentle","giant","giddy","gifted","gigantic","glamorous","gleaming","glib","glistening","glorious","glossy","godly","good","goofy","gorgeous","graceful","grandiose","grateful","gratis","gray","greasy","great","greedy","green","grey","grieving","groovy","grotesque","grouchy","grubby","gruesome","grumpy","guarded","guiltless","gullible","gusty","guttural","habitual","half","hallowed","halting","handsome","handsomely","handy","hanging","hapless","happy","hard","hard-To-Find","harmonious","harsh","hateful","heady","healthy","heartbreaking","heavenly","heavy","hellish","helpful","helpless","hesitant","hideous","high","highfalutin","high-Pitched","hilarious","hissing","historical","holistic","hollow","homeless","homely","honorable","horrible","hospitable","hot","huge","hulking","humdrum","humorous","hungry","hurried","hurt","hushed","husky","hypnotic","hysterical","icky","icy","idiotic","ignorant","ill","illegal","ill-Fated","ill-Informed","illustrious","imaginary","immense","imminent","impartial","imperfect","impolite","important","imported","impossible","incandescent","incompetent","inconclusive","industrious","incredible","inexpensive","infamous","innate","innocent","inquisitive","insidious","instinctive","intelligent","interesting","internal","invincible","irate","irritating","itchy","jaded","jagged","jazzy","jealous","jittery","jobless","jolly","joyous","judicious","juicy","jumbled","jumpy","juvenile","kaput","keen","kind","kindhearted","kindly","knotty","knowing","knowledgeable","known","labored","lackadaisical","lacking","lame","lamentable","languid","large","last","late","laughable","lavish","lazy","lean","learned","left","legal","lethal","level","lewd","light","like","likeable","limping","literate","little","lively","lively","living","lonely","long","longing","long-Term","loose","lopsided","loud","loutish","lovely","loving","low","lowly","lucky","ludicrous","lumpy","lush","luxuriant","lying","lyrical","macabre","macho","maddening","madly","magenta","magical","magnificent","majestic","makeshift","male","malicious","mammoth","maniacal","many","marked","massive","married","marvelous","material","materialistic","mature","mean","measly","meaty","medical","meek","mellow","melodic","melted","merciful","mere","messy","mighty","military","milky","mindless","miniature","minor","miscreant","misty","mixed","moaning","modern","moldy","momentous","motionless","mountainous","muddled","mundane","murky","mushy","mute","mysterious","naive","nappy","narrow","nasty","natural","naughty","nauseating","near","neat","nebulous","necessary","needless","needy","neighborly","nervous","new","next","nice","nifty","nimble","nine","nippy","noiseless","noisy","nonchalant","nondescript","nonstop","normal","nostalgic","nosy","noxious","null","numberless","numerous","nutritious","nutty","oafish","obedient","obeisant","obese","obnoxious","obscene","obsequious","observant","obsolete","obtainable","oceanic","odd","offbeat","old","old-Fashioned","omniscient","one","onerous","open","opposite","optimal","orange","ordinary","organic","ossified","outgoing","outrageous","outstanding","oval","overconfident","overjoyed","overrated","overt","overwrought","painful","painstaking","pale","paltry","panicky","panoramic","parallel","parched","parsimonious","past","pastoral","pathetic","peaceful","penitent","perfect","periodic","permissible","perpetual","petite","petite","phobic","physical","picayune","pink","piquant","placid","plain","plant","plastic","plausible","pleasant","plucky","pointless","poised","polite","political","poor","possessive","possible","powerful","precious","premium","present","pretty","previous","pricey","prickly","private","probable","productive","profuse","protective","proud","psychedelic","psychotic","public","puffy","pumped","puny","purple","purring","pushy","puzzled","puzzling","quack","quaint","quarrelsome","questionable","quick","quickest","quiet","quirky","quixotic","quizzical","rabid","racial","ragged","rainy","rambunctious","rampant","rapid","rare","raspy","ratty","ready","real","rebel","receptive","recondite","red","redundant","reflective","regular","relieved","remarkable","reminiscent","repulsive","resolute","resonant","responsible","rhetorical","rich","right","righteous","rightful","rigid","ripe","ritzy","roasted","robust","romantic","roomy","rotten","rough","round","royal","ruddy","rude","rural","rustic","ruthless","sable","sad","safe","salty","same","sassy","satisfying","savory","scandalous","scarce","scared","scary","scattered","scientific","scintillating","scrawny","screeching","second","second-Hand","secret","secretive","sedate","seemly","selective","selfish","separate","serious","shaggy","shaky","shallow","sharp","shiny","shivering","shocking","short","shrill","shut","shy","sick","silent","silent","silky","silly","simple","simplistic","sincere","six","skillful","skinny","sleepy","slim","slimy","slippery","sloppy","slow","small","smart","smelly","smiling","smoggy","smooth","sneaky","snobbish","snotty","soft","soggy","solid","somber","sophisticated","sordid","sore","sore","sour","sparkling","special","spectacular","spicy","spiffy","spiky","spiritual","spiteful","splendid","spooky","spotless","spotted","spotty","spurious","squalid","square","squealing","squeamish","staking","stale","standing","statuesque","steadfast","steady","steep","stereotyped","sticky","stiff","stimulating","stingy","stormy","straight","strange","striped","strong","stupendous","stupid","sturdy","subdued","subsequent","substantial","successful","succinct","sudden","sulky","super","superb","superficial","supreme","swanky","sweet","sweltering","swift","symptomatic","synonymous","taboo","tacit","tacky","talented","tall","tame","tan","tangible","tangy","tart","tasteful","tasteless","tasty","tawdry","tearful","tedious","teeny","teeny-Tiny","telling","temporary","ten","tender","tense","tense","tenuous","terrible","terrific","tested","testy","thankful","therapeutic","thick","thin","thinkable","third","thirsty","thirsty","thoughtful","thoughtless","threatening","three","thundering","tidy","tight","tightfisted","tiny","tired","tiresome","toothsome","torpid","tough","towering","tranquil","trashy","tremendous","tricky","trite","troubled","truculent","true","truthful","two","typical","ubiquitous","ugliest","ugly","ultra","unable","unaccountable","unadvised","unarmed","unbecoming","unbiased","uncovered","understood","undesirable","unequal","unequaled","uneven","unhealthy","uninterested","unique","unkempt","unknown","unnatural","unruly","unsightly","unsuitable","untidy","unused","unusual","unwieldy","unwritten","upbeat","uppity","upset","uptight","used","useful","useless","utopian","utter","uttermost","vacuous","vagabond","vague","valuable","various","vast","vengeful","venomous","verdant","versed","victorious","vigorous","violent","violet","vivacious","voiceless","volatile","voracious","vulgar","wacky","waggish","waiting","wakeful","wandering","wanting","warlike","warm","wary","wasteful","watery","weak","wealthy","weary","well-Groomed","well-Made","well-Off","well-To-Do","wet","whimsical","whispering","white","whole","wholesale","wicked","wide","wide-Eyed","wiggly","wild","willing","windy","wiry","wise","wistful","witty","woebegone","womanly","wonderful","wooden","woozy","workable","worried","worthless","wrathful","wretched","wrong","wry","yellow","yielding","young","youthful","yummy","zany","zealous","zesty","zippy","zonked"];
var nouns= ["ninja","chair","pancake","statue","unicorn","rainbows","laser","senor","bunny","captain","nibblets","cupcake","carrot","gnomes","glitter","potato","salad","toejam","curtains","beets","toilet","exorcism","stickfigures","mermaideggs","seabarnacles","dragons","jellybeans","snakes","dolls","bushes","cookies","apples","icecream","ukulele","kazoo","banjo","operasinger","circus","trampoline","carousel","carnival","locomotive","hotairballoon","prayingmantis","animator","artisan","artist","colorist","inker","coppersmith","director","designer","flatter","stylist","leadman","limner","make-upartist","model","musician","penciller","producer","scenographer","setdecorator","silversmith","teacher","automechanic","beader","bobbinboy","clerkofthechapel","fillingstationattendant","foreman","maintenanceengineering","mechanic","miller","moldmaker","panelbeater","patternmaker","plantoperator","plumber","sawfiler","shopforeman","soaper","stationaryengineer","wheelwright","woodworkers"];

var users = {undefined:{name: '', socket: '', game: '', index: ''}};
var orderedSockets = [];
var usernamevalid = /^[a-zA-Z0-9_-]+( [a-zA-Z0-9_-]+)*$/;
var usersPlaying = [];
var countdownStarted = false;
var gamejs;
var doObfuscate = true;

console.log('Obfuscating/Protecting Javascript...')
function obfuscate(){
gamejs = JavaScriptObfuscator.obfuscate(
    fs.readFileSync(__dirname + '/public/game.js', "utf8"),
    {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1,	
    debugProtection: true,
    debugProtectionInterval: true,
    disableConsoleOutput: false,
    rotateStringArray: true,
    selfDefending: true,
    stringArray: true,
    stringArrayEncoding: 'rc4',
    stringArrayThreshold: 1,
    unicodeEscapeSequence: false
});
    
}
obfuscate();
    
console.log('Obfuscation Finished! Ready to serve!');

app.get('/game.js',function(req,res){
	if(doObfuscate){
   res.send(gamejs.getObfuscatedCode());
	}else{
		res.send(fs.readFileSync(__dirname + '/public/game.js', "utf8"));
	}
});


app.use("/favicon.png", express.static(__dirname + '/public/favicon.ico'));

app.get('/*', function(req, res) {
	res.sendFile(__dirname + '/public/');
});

http.listen(process.env.PORT, process.env.IP);

io.on('connection', function(socket) {
	
	socket.on('gameUpdate', function(data){
	users[socket.id].gameBoard = data[0];	
	users[socket.id].gameBoardStatic = data[1];	
	});
  
  
	socket.on('userLogon', function(username) {
		if(Object.size(users) - 1 >= 5){
		    socket.emit("update", 'Server has to many people! People: ' + Object.size(users) - 1);
			socket.disconnect();
		}else if(username == null || username == undefined){
		    //This means they didn't select a username, most likely blocked alerts.
		    socket.emit("update", "No username recieved or null, random username assigned.");
			username = adjectives[Math.floor(Math.random() * adjectives.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)];
			submitUsernameValidation(socket, username);
		}else if(username.length > 35 || username.length < 3){
		    socket.emit("update", 'Username too short/long, please choose a different one!');
			socket.disconnect();
		}else{
		    submitUsernameValidation(socket, username);
		}
	});
	
	socket.on('chatMsg', function(data) {
		if (users[socket.id] != undefined)
			if (data.length > 150) {
				socket.emit("update", "Chat message too long, please stay under 150 characters");
			} 
			else if(data.charAt(0) == "/") {
				switch(data){
					case "/ready":
							if (gameRunning) {
								socket.emit("update", "Game already running!");
							} else {
								if (users[socket.id].ready == false) {
									users[socket.id].ready = true;
									var amountReady = $.grep(Object.keys(users), function(k) {
										return users[k].ready == true;
									}).length;
									io.sockets.emit("update", users[socket.id].name + " is ready to play! (" + amountReady + "/" + (Object.size(users) - 1) + ")");
									if (amountReady > (Object.size(users) - 1) / 2 && !countdownStarted) {
										if (amountReady > 1) {
											io.sockets.emit("update", "Get ready to start the game!");
											countdownStarted = true;
											var mult = 10;
											for (var m = 0; m < 10; m++) {
												setTimeout(function() {
													io.sockets.emit("update", mult);
													mult--;
												}, m * 1000);
											}
											setTimeout(function() {
												countdownStarted = false;
												gameRunning = true;
												var randNum = Math.floor(Math.random() * (1000000));
												usersPlaying = $.grep(Object.keys(users), function(k) {
													return users[k].ready == true;
												});
												for (var i = 0; i < usersPlaying.length; i++) {
													users[usersPlaying[i]].socket.emit("ready", randNum);
													users[usersPlaying[i]].ready = false;
												}
												
											}, 5000);
											setTimeout(function(){
												gameProcessInterval = setInterval(function(){
													io.sockets.emit('gameInterval');
												}, 20);
												gameUpdateInterval = setInterval(function() {
													updateGameViews();
												}, 250);
												
											},10000);
										} else {
											io.sockets.emit("update", "Need more than 1 person to start the game!");
										}
									}
								} else {
									socket.emit("update", "You already readied up! Stop spamming!");
								}
							}
						break;
						default:
							socket.emit("update", "Sorry, that command wasn't recognized!");
				}
			}
			else {
				io.sockets.emit("updateChat", users[socket.id].name + ": " + data);
			}
	});
	
	socket.on("lost", function(){
		if(usersPlaying.length > 1 && $.inArray(socket.id, usersPlaying) != -1){
			usersPlaying.remove(socket.id);
			io.sockets.emit("update", users[socket.id].name + " lost the game!");
			users[socket.id].gameBoard = "LOST";
			if(usersPlaying.length == 1){
			gameRunning = false;
			clearInterval(gameUpdateInterval);
			clearInterval(gameProcessInterval);
			io.sockets.emit("gameOver");
			io.sockets.emit("update", users[usersPlaying[0]].name + " won the game!");
			for(var x = 0; x < 5; x++){
			if(users[orderedSockets[x]].name != 0){
				users[orderedSockets[x]].gameBoard = null;	
				updateGameViews();
			}
			}
			usersPlaying = [];
			
			}
			}
	});
	
	socket.on("power", function(data){
		var powerUpName;
		switch(data[0]){
            case "A":
                powerUpName = "Add Line";
                break;
            case "N":
                powerUpName = "Nuke";
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
            case "default":
            	powerUpName = "unknown";
            	break;
        }
		
		for(var k = 0; k < data[2]; k ++) {
			data[3 + k] = Math.random();
		}
		if(data[1] == "all"){
		socket.broadcast.emit("clientPower", data);
		}else{
			var targetSocket = $.grep(Object.keys(users), function (k) {
				return users[k].name == data[1];
			});
			io.sockets.emit("update", users[socket.id].name + " used " + powerUpName + " on " + users[targetSocket[0]].name + "!");
			if(data[0] == "S"){
				var gameBoard1 =users[targetSocket[0]].gameBoardStatic;
				var gameBoard2 = users[socket.id].gameBoardStatic;
				data[2] = gameBoard1;
				socket.emit("clientPower", data);
				data[2] = gameBoard2;
				users[targetSocket[0]].socket.emit("clientPower", data);
			}else{
				users[targetSocket[0]].socket.emit("clientPower", data);	
			}
			
		}
	});
	
	socket.on("serverLog", function(data){
		console.log(data);
	});
	
	socket.on("disconnect", function() {
		if (users[socket.id] != undefined) {
			if(usersPlaying.length > 1 && $.inArray(socket.id, usersPlaying) != -1){
			usersPlaying.remove(socket.id);
			io.sockets.emit("update", users[socket.id].name + " lost the game!");
			if(usersPlaying.length == 1){
			gameRunning = false;
			io.sockets.emit("gameOver");
			io.sockets.emit("update", users[usersPlaying[0]].name + " won the game!");
			usersPlaying = [];
			}
			}
			io.sockets.emit("update", users[socket.id].name + " has left the server.");
			orderedSockets.splice(orderedSockets.indexOf(socket.id), 1);
			delete users[socket.id];
			updateUsernameLabels();
			
		}	
	});
	
});


function submitUsernameValidation(socket, username){
        if(($.grep(Object.keys(users), function (k) {return users[k].name == username; }).length == 0)){
            if(username.match(usernamevalid)){
                users[socket.id] = {name: username, socket: socket, ready: false};
                orderedSockets[orderedSockets.length] = socket.id;
				socket.emit("update", "Welcome " + users[socket.id].name + ", server communication established.");
				socket.emit("update", 'To ready up, type /ready!')
				socket.broadcast.emit("update", users[socket.id].name + " connected to the server!");
				updateUsernameLabels();
            }else{
                socket.emit("update", "Illegal Username, please use normal characters.");
				socket.disconnect();
            }
        }else{
            socket.emit("update", "Username already in use, please choose something else.");
			socket.disconnect();
        }
}

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



function updateUsernameLabels(){
	for(var x = 0; x < 5; x++){
		if(users[orderedSockets[x]].name != 0){
		switch(x){
			case 0:
				users[orderedSockets[0]].socket.emit("updateLabels", [users[orderedSockets[0]].name, users[orderedSockets[1]].name, users[orderedSockets[2]].name, users[orderedSockets[3]].name, users[orderedSockets[4]].name]);
				break;
			case 1:
				users[orderedSockets[1]].socket.emit("updateLabels", [users[orderedSockets[1]].name, users[orderedSockets[0]].name, users[orderedSockets[2]].name, users[orderedSockets[3]].name, users[orderedSockets[4]].name]);
				break;
			case 2:
				users[orderedSockets[2]].socket.emit("updateLabels", [users[orderedSockets[2]].name, users[orderedSockets[0]].name, users[orderedSockets[1]].name, users[orderedSockets[3]].name, users[orderedSockets[4]].name]);
				break;
			case 3:
				users[orderedSockets[3]].socket.emit("updateLabels", [users[orderedSockets[3]].name, users[orderedSockets[0]].name, users[orderedSockets[1]].name, users[orderedSockets[2]].name, users[orderedSockets[4]].name]);
				break;
			case 4:
				users[orderedSockets[4]].socket.emit("updateLabels", [users[orderedSockets[4]].name, users[orderedSockets[0]].name, users[orderedSockets[1]].name, users[orderedSockets[2]].name, users[orderedSockets[3]].name]);
				break;
		}	
	}
	}
}

function updateGameViews(){
	for(var x = 0; x < 5; x++){
		if(users[orderedSockets[x]].name != 0){
		switch(x){
			case 0:
				users[orderedSockets[0]].socket.emit("updateViews", [users[orderedSockets[1]].gameBoard, users[orderedSockets[2]].gameBoard, users[orderedSockets[3]].gameBoard, users[orderedSockets[4]].gameBoard]);
				break;
			case 1:
				users[orderedSockets[1]].socket.emit("updateViews", [users[orderedSockets[0]].gameBoard, users[orderedSockets[2]].gameBoard, users[orderedSockets[3]].gameBoard, users[orderedSockets[4]].gameBoard]);
				break;
			case 2:
				users[orderedSockets[2]].socket.emit("updateViews", [users[orderedSockets[0]].gameBoard, users[orderedSockets[1]].gameBoard, users[orderedSockets[3]].gameBoard, users[orderedSockets[4]].gameBoard]);
				break;
			case 3:
				users[orderedSockets[3]].socket.emit("updateViews", [users[orderedSockets[0]].gameBoard, users[orderedSockets[1]].gameBoard, users[orderedSockets[2]].gameBoard, users[orderedSockets[4]].gameBoard]);
				break;
			case 4:
				users[orderedSockets[4]].socket.emit("updateViews", [users[orderedSockets[0]].gameBoard, users[orderedSockets[1]].gameBoard, users[orderedSockets[2]].gameBoard, users[orderedSockets[3]].gameBoard]);
				break;
		}	
	}
	}
}