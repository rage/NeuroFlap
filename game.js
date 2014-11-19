// Initialize Phaser
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

var rightShape;
var flyingLevel = 0;
var reactionLevel = 0;
var loggingArray = [];
var lineOn = true;
var reactionsOn = true;
var blocksOn = true;

// Define all the states
game.state.add('load', loadState);  
game.state.add('menu', menuState);  
game.state.add('play', playState);  

// Start with the 'load' state
game.state.start('load');  