// Initialize Phaser
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

function startGame(lineOn, reactionsOn, blocksOn, colorReactionsOn, shapeReactionsOn) {
	game.rightShape;
	game.flyingLevel = 0;
	game.reactionLevel = 0;
	game.loggingArray = [];
	game.lineOn = lineOn;
	game.reactionsOn = reactionsOn;
	game.blocksOn = blocksOn;
	game.reactionParameters = {colorReactions:colorReactionsOn, shapeReactions:shapeReactionsOn};

	// Define all the states
	game.state.add('load', loadState);  
	game.state.add('menu', menuState);  
	game.state.add('play', playState);  

	// Start with the 'load' state
	game.state.start('load');  
}

startGame(true,true,true,true,true);

//startGame(false,true,true,true,true); // NO LINE