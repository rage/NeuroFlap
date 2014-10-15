// Initialize Phaser
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');

// Our 'score' global variable
var score = 0.0;

var rightShape;
var rightColor;

// Define all the states
game.state.add('load', loadState);  
game.state.add('menu', menuState);  
game.state.add('play', playState);  

// Start with the 'load' state
game.state.start('load');  