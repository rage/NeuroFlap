var menuState = {  
    create: function() {
        // Call the 'start' function when pressing the spacebar
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(this.start, this); 

        Math.seedrandom(this.game.startingMessage);

        // Defining variables
        var style = { font: "20px Arial", fill: "#ffffff" };
        var styleSmaller = { font: "18px Arial", fill: "#ffffff" };

        var x = game.world.width/2, y = game.world.height/2;

        // Adding a text centered on the screen
        var text = this.game.add.text(x, y-75, this.game.startingMessage, styleSmaller);
        text.anchor.setTo(0.5, 0.5); 

        var shapes = ['Circle', 'Triangle', 'Pentagon'];
        var namesOfShapes = ["Ympyröille", "Kolmioille", "Viisikulmioille"];
        var shapeIndex = Math.floor(Math.random()*shapes.length);
        this.game.rightShape = shapes[shapeIndex];

        if(this.game.settings.shapeReactionsOn){
            var shapeText = this.game.add.text(x-133, y - 25, "Paina W " + namesOfShapes[shapeIndex] + ". " + "S muille.", styleSmaller);
            text.anchor.setTo(0.5, 0.5); 
        }

        this.game.add.sprite(75,300,this.determineKeyPicture());

        this.game.add.text(100,450,"Paina välilyöntiä jatkaaksesi",style);
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
                return "AllKeysRed";
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