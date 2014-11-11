// Initialize Phaser
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

var rightShape;
var rightColor;
var flyingLevel = 0;
var reactionLevel = 0;
var loggingArray = [];

// Define all the states
game.state.add('load', loadState);  
game.state.add('menu', menuState);  
game.state.add('play', playState);  

// Start with the 'load' state
game.state.start('load');  