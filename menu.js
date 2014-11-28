var menuState = {  
    create: function() {
        // Call the 'start' function when pressing the spacebar
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(this.start, this); 

        // Defining variables
        var style = { font: "20px Arial", fill: "#ffffff" };
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
        var text = this.game.add.text(x, y-75, this.game.startingMessage, style);
        text.anchor.setTo(0.5, 0.5); 

        var shapes = ['Circle', 'Triangle', 'Pentagon'];
        this.game.rightShape = shapes[Math.floor(Math.random()*shapes.length)];

        if(this.game.settings.shapeReactionsOn){
            var shapeText = this.game.add.text(x-133, y - 25, "Press W for " + this.game.rightShape + "s. " + "S for others.", style);
            text.anchor.setTo(0.5, 0.5); 
            // if(this.game.settings.colorReactionsOn){
            //     this.game.add.text(x-50, y + 25, "Yes, both.", style);
            // }
        }

        this.game.add.sprite(75,300,this.determineKeyPicture());

        this.game.add.text(100,450,"Press space to continue",style);
    },

    determineKeyPicture: function() {
        if(!this.game.settings.reactionsOn){
            if(!this.game.settings.lineOn){
                return "LRKeys";
            } else {
                return "ArrowKeys";
            }
        } else {
            if(game.settings.colorReactionsOn && game.settings.shapeReactionsOn){
                return "AllKeys";
            } else if (game.settings.colorReactionsOn && !game.settings.shapeReactionsOn){
                return "ArrowKeysAD";
            } else if (!game.settings.colorReactionsOn && game.settings.shapeReactionsOn){
                return "ArrowKeysSW";
            } else {
                return "AllKeys";
            }
        }

        return "ArrowKeys";
    },

    // Start the actual game
    start: function() {
        this.spaceKey.onDown.removeAll();
        this.game.state.start('play');
    }
};