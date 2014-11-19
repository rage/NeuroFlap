// Initialize Phaser
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

game.rightShape;
game.flyingLevel = 0;
game.reactionLevel = 0;
game.loggingArray = [];
game.lineOn = true;
game.reactionsOn = true;
game.blocksOn = true;

// Define all the states
game.state.add('load', loadState);  
game.state.add('menu', menuState);  
game.state.add('play', playState);  

// Start with the 'load' state
game.state.start('load');  