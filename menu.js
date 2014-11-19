var menuState = {  
    create: function() {
        // Call the 'start' function when pressing the spacebar
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.start, this); 

        // Defining variables
        var style = { font: "30px Arial", fill: "#ffffff" };
        var x = game.world.width/2, y = game.world.height/2;

        if(this.game.flyingLevel != 0){
            var flyingScoreText = this.game.add.text(x, y-150, "Flying: " + this.game.flyingLevel, style);
            flyingScoreText.anchor.setTo(0.5,0.5);
        }
        if(this.game.reactionLevel != 0){
            var reactionScoreText = this.game.add.text(x, y-100, "Reactions: " + this.game.reactionLevel, style);
            reactionScoreText.anchor.setTo(0.5,0.5);
        }

        // Adding a text centered on the screen
        var text = this.game.add.text(x, y-50, "Press space to start", style);
        text.anchor.setTo(0.5, 0.5); 

        var shapes = ['Circle', 'Triangle', 'Pentagon'];
        this.game.rightShape = shapes[Math.floor(Math.random()*shapes.length)];

        var shapeText = this.game.add.text(x-133, y, "React to " + this.game.rightShape + "s", style);
        text.anchor.setTo(0.5, 0.5); 
    },

    // Start the actual game
    start: function() {
        this.game.state.start('play');
    }
};