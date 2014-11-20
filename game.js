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

tutorial: function (){
    // Phase 1, Just go through stuff, don't hit the things
    startGame(false,false,true,false,false);
    // Phase 2, Follow the line
    startGame(true,false,false,false,false);
    // Phase 3, Follow the line AND go through stuff
    startGame(true,false,true,false,false);
    // Phase 4, Lines and obstacles gone. Now react to stuff. Press any key of WASD when you see a shape.
    startGame(false,true,false,false,false);
    // Phase 5, Press A for red things and D for green things
    startGame(false,true,false,true,false);
    // Phase 6, Press W for the right shape, S for the wrong one.
    startGame(false,true,false,false,true);
    // Phase 7, Now press for color and shape. So W+A for right red things, S + D for green wrong things.
    startGame(false,true,false,true,true);
    // Phase 8, The real thing. Everything at once. Play for 2 minutes. Then it sends data. Thanks for participating.
    startGame(true,true,true,true,true);
},