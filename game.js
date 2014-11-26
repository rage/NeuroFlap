// Initialize Phaser
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

var waitTime = 25000;

function startGame(settings, message, gameLength) {
	game.gameOver = false;

	game.rightShape;
	game.flyingLevel = 0;
	game.reactionLevel = 0;
	game.settings = settings;

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

//gaps();

//allFeatures();

var phases = [gaps, line, gapsAndLine, react, reactColors, reactShapes, reactShapesAndColors, allFeatures];
var phases2 = [gaps, gapsAndLine, gapsLineAndReact, gapsLineAndReactColors, gapsLineAndReactShapes, gapsLineReactShapesAndColors];
var phases3 = [testGame];

game.gameOver = true;
//nextPhase(0, phases);
nextPhase(0,phases2);

function nextPhase(index, phasesArray){
	if(game.gameOver){
		phasesArray[index]();
		if(index + 1 < phasesArray.length){
			setTimeout(nextPhase,waitTime,index+1,phasesArray);
		}
	} else {
		setTimeout(nextPhase,1000, index,phasesArray);
	}
}

function gaps(){
	var settings = {blocksOn:true};
	startGame(settings,"Go through the gaps", 20);
}

function line(){
	var settings = {lineOn:true};
    startGame(settings,"Stay on the line", 20);
}

function gapsAndLine(){
	var settings = {blocksOn:true,lineOn:true};

    startGame(settings,"Now stay on the line too",20);
}

function gapsLineAndReact(){
	var settings = {blocksOn:true,lineOn:true,reactionsOn:true};

   	startGame(settings,"Press any WASD key when you see a shape",20);
}

function react(){
	var settings = {reactionsOn:true};

   	startGame(settings,"Press any WASD key when you see a shape",20);
}

function reactColors(){
	var settings = {reactionsOn:true,colorReactionsOn:true};

    startGame(settings,"Press A for red, D for Green",20);
}

function gapsLineAndReactColors(){
	var settings = {blocksOn:true,lineOn:true,reactionsOn:true,colorReactionsOn:true};

    startGame(settings,"Press A for red, D for Green",20);
}

function reactShapes(){
	var settings = {reactionsOn:true,shapeReactionsOn:true};

   	startGame(settings,"Press W for given shape. S for any other",20);
}

function gapsLineAndReactShapes(){
	var settings = {blocksOn:true,lineOn:true,reactionsOn:true,shapeReactionsOn:true};

   	startGame(settings,"Press W for given shape. S for any other",20);
}

function reactShapesAndColors(){
	var settings = {reactionsOn:true,shapeReactionsOn:true,colorReactionsOn:true};

    startGame(settings,"Now both color and shape",20);
}

function allFeatures(){
	var settings = {blocksOn:true,lineOn:true,reactionsOn:true,shapeReactionsOn:true,colorReactionsOn:true};

    startGame(settings,"Everything at once", 240);
}

function testGame(){
	var settings = {blocksOn:true,lineOn:true,reactionsOn:true,shapeReactionsOn:true,colorReactionsOn:true};

    startGame(settings,"Test game", 10);
}

function gapsLineReactShapesAndColors(){
	var settings = {blocksOn:true,lineOn:true,reactionsOn:true,shapeReactionsOn:true,colorReactionsOn:true};

    startGame(settings,"React to both shape and color", 240);
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