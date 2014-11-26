var endState = {  
    create: function() {
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

        var text = this.game.add.text(x, y-50, "Good job!", style);
        text.anchor.setTo(0.5, 0.5); 
    }
};