// Initialize Phaser
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

var waitTime = 22000;

function startGame(lineOn, reactionsOn, blocksOn, colorReactionsOn, shapeReactionsOn, message, gameLength) {
	game.gameOver = false;

	game.rightShape;
	game.flyingLevel = 0;
	game.reactionLevel = 0;
	game.loggingArray = [];
	game.lineOn = lineOn;
	game.reactionsOn = reactionsOn;
	game.blocksOn = blocksOn;
	game.reactionParameters = {colorReactions:colorReactionsOn, shapeReactions:shapeReactionsOn};

	game.startingMessage = message;
	game.gameLength = gameLength;

	// Define all the states
	game.state.add('load', loadState);  
	game.state.add('menu', menuState);  
	game.state.add('play', playState);  
	game.state.add('end', endState);

	// Start with the 'load' state
	game.state.start('load');  
}

//startGame(true,true,true,true,true,"Press Space to start", 90);

phaseOne();

function phaseOne(){
	startGame(false,false,true,false,false,"Go through the gaps", 20);
	setTimeout(phaseTwo,waitTime);
}

function phaseTwo(){
	if(game.gameOver){
    	startGame(true,false,false,false,false,"Stay on the line", 20);
		setTimeout(phaseThree,waitTime);
	} else {
		setTimeout(phaseTwo, 1000);
	}
}

function phaseThree(){
    if(game.gameOver){
    	startGame(true,false,true,false,false,"Gaps AND line",20);
		setTimeout(phaseFour,waitTime);
	} else {
		setTimeout(phaseThree, 1000);
	}
}

function phaseFour(){
	if(game.gameOver){
    	startGame(false,true,false,false,false,"Press any WASD key when you see a shape",20);
		setTimeout(phaseFive,waitTime);
	} else {
		setTimeout(phaseFour, 1000);
	}
}

function phaseFive(){
	if(game.gameOver){
	    startGame(false,true,false,true,false,"Press A for red, D for Green",20);
		setTimeout(phaseSix,waitTime);
	} else {
		setTimeout(phaseFive, 1000);
	}
}

function phaseSix(){
	if(game.gameOver){
    	startGame(false,true,false,false,true,"Press W for given shape. S for any other",20);
		setTimeout(phaseSeven,waitTime);
	} else {
		setTimeout(phaseSix, 1000);
	}
}

function phaseSeven(){
	if(game.gameOver){
	    startGame(false,true,false,true,true,"Now both color and shape",20);
		setTimeout(phaseEight,waitTime);
	} else {
		setTimeout(phaseSeven, 1000);
	}
}

function phaseEight(){
    startGame(true,true,true,true,true,"Everything at once", 90);
}

function tutorial(){
    // Phase 1, Just go through stuff, don't hit the things
 	//    while(!game.gameOver){
 	//    	console.log("TÖÖT");
	// }
    // Phase 2, Follow the line
    // Phase 3, Follow the line AND go through stuff
    // Phase 4, Lines and obstacles gone. Now react to stuff. Press any key of WASD when you see a shape.
    // Phase 5, Press A for red things and D for green things
    // Phase 6, Press W for the right shape, S for the wrong one.
    // Phase 7, Now press for color and shape. So W+A for right red things, S + D for green wrong things.
    // Phase 8, The real thing. Everything at once. Play for 2 minutes. Then it sends data. Thanks for participating.
}