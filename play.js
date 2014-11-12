var playState = {

    create: function() { 
        this.buttonSetup();

        this.pipes = game.add.group();
        this.pipes.createMultiple(30, 'pipe');  
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);

        this.bird = this.game.add.sprite(150, 450, 'bird');
        //this.bird.body.gravity.y = 0; 
        this.bird.anchor.setTo(0.5, 0.5);

        this.shapes = ['Circle', 'Triangle', 'Pentagon'];
        this.colors =['Red','Green'];  // green: 057c1a red: a30909
        this.redGradient = ['#FF0000', '#F01314', '#E22729', '#D43B3E', '#C64E52', '#B86267', '#A9767C', '#9B8990', '#8D9DA5', '#7FB1BA', '#71C5CF'];
        this.yellowGradient = ['#FFFF00', '#F0F914', '#E2F329', '#D4ED3E', '#C6E752', '#B8E267', '#A9DC7C', '#9BD690', '#8DD0A5', '#7FCABA', '#71C5CF'];
        this.greenGradient = ['#00FF00', '#0BF914', '#16F329', '#21ED3E', '#2DE752', '#38E267', '#43DC7C', '#4FD690', '#5AD0A5', '#65CABA', '#71C5CF'];

        this.reactionIndicator = this.game.add.graphics(500,500);
        this.reactionIndicator.beginFill('#00FF00',1);
        this.reactionIndicator.drawRect(100, 100, 400, 100);

        flyingLevel = 10;
        reactionLevel = 10;
        this.checkScoresCounter = 0;
        this.resetScores();

        this.interpolationCounter = 0;
        //Phaser.Color.hexToColor('71c5cf',this.defaultColor);

        var style = { font: "30px Arial", fill: "#ffffff" };
        // this.flyingLabel = this.game.add.text(20, 20, "10", style);
        // this.reactionsLabel = this.game.add.text(330, 20, "10", style); 
        this.shapeTimer = this.game.time.events.loop(2000, this.newShape, this);
        this.shapeOn = false;
        this.hitShield = false;
        this.endTimer = this.game.time.events.add(90000, this.restartGame, this);
    },

    buttonSetup: function(){
        var wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        var sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        var upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        var downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

        wKey.onDown.add(this.reactTrue,this);
        sKey.onDown.add(this.reactFalse,this);
        upKey.onDown.add(this.reactTrue,this);
        downKey.onDown.add(this.reactFalse,this);

        this.leftKey.onDown.add(this.leftPressed,this);
        this.rightKey.onDown.add(this.rightPressed,this);
        this.leftKey.onUp.add(this.leftReleased,this);
        this.rightKey.onUp.add(this.rightReleased,this);
    },

    leftPressed: function(){
        this.addToLog("Left Pressed");
    },

    leftReleased: function(){
        this.addToLog("Left Released");
    },

    rightPressed: function(){
        this.addToLog("Right Pressed");
    },

    rightReleased: function(){
        this.addToLog("Right Released");
    },

    addToLog: function(event){
        var entry = {time: this.getTimeNow(), event: event};
        loggingArray.push(entry);
    },

    update: function() {
        if (this.bird.inWorld == false){
            this.restartGame(); 
        }
        if(this.exists(this.realShape)){
            this.realShape.x = this.bird.x - 12;   
        }
        if(this.leftKey.isDown || this.aKey.isDown){
            this.bird.body.velocity.x -= 10 + Math.max(10,flyingLevel);
        }
        if(this.rightKey.isDown || this.dKey.isDown){
            this.bird.body.velocity.x += 10 + Math.max(10,flyingLevel);
        }
        this.bird.body.velocity.x = this.bird.body.velocity.x * 0.93;
        this.bird.angle = this.bird.body.velocity.x / 10;
        if(this.exists(this.hitMarker)){
            this.hitMarker.body.x = this.bird.body.x;
            this.hitMarker.angle = this.bird.angle;
        }

        //console.log(loggingArray);

        this.game.physics.overlap(this.bird, this.pipes, this.hitPipe, null, this);      
    },

    exists: function(object){
        if(object != undefined){
            return object.exists;
        }
        return false;
    },

    getTimeNow: function(){
        return Date.now();
    },

    reactTrue: function(){
        this.react(true);
    },

    reactFalse: function(){
        this.react(false);
    },

    react: function(approved) {
        if(this.realShape.exists && this.shapeReactable){
            if((this.text == rightShape && this.colorName == rightColor) && approved){
                this.addToLog("Approved correctly");
                this.startGradient(this.greenGradient);
                this.reactionsScore += 1.25;    
            } else if((this.text != rightShape || this.colorName != rightColor) && !approved) {
                this.addToLog("Disapproved correctly");
                this.startGradient(this.greenGradient);
                this.reactionsScore += 0.75;
            } else {
                if(approved){
                    this.addToLog("Approved incorrectly");    
                } else {
                    this.addToLog("Disapproved incorrectly"); 
                }
                this.startGradient(this.redGradient);
                this.reactionsScore -= 0.75;
            }
            this.shapeReactable = false;
            // this.reactionsLabel.content = reactionLevel;
            this.realShape.destroy();
            console.log(this.reactionsScore);
        }
    },

    hitPipe: function() {
        if (this.bird.alive == false)
            return;
        if(!this.hitShield){
            this.addToLog("Hit obstacle");
            this.hitMarker = this.game.add.sprite(this.bird.x, this.bird.y, "hit");
            this.hitMarker.anchor.setTo(0.5, 0.5);
            this.hitMarker.angle = this.bird.angle;
            this.flyingScore -= 1.5;
            this.hitShield = true;
            this.game.time.events.add(500,this.hitShieldOff, this);
        }
    },

    hitShieldOff: function() {
        if(this.hitMarker.exists){
            this.hitMarker.destroy();
        }
        this.hitShield = false;
    },

    restartGame: function() {
        this.game.time.events.remove(this.timer);
        this.game.time.events.remove(this.shapeTimer);

        this.game.state.start('menu');
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.y = 150 + 15 * Math.max(5 , flyingLevel);
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = this.lastHole;
        while(hole == this.lastHole){
            hole = Math.floor(Math.random()*5)+1;
        }
        this.lastHole = hole;
        for (var i = 0; i < 8; i++){
            if (i != hole && i != hole +1) {
                this.addOnePipe(i*50, -50);   
            }
        }
        this.flyingUpkeep();
        this.addToLog("New obstacle");
    },

    flyingUpkeep: function() {
        this.checkScoresCounter++;
        if(this.checkScoresCounter >= 15){
            this.checkScores();
        }
        this.timer.delay = 1500 - 20 * flyingLevel;

        this.flyingScore += 0.75;
    },

    randomItem: function(array) {
        return array[Math.floor(Math.random()*array.length)];
    },

    newShape: function() {
        this.colorName = this.randomItem(this.colors);
        this.text = this.randomItem(this.shapes);
        this.realShape = this.game.add.sprite(this.bird.body.x, this.bird.body.y - 25,this.colorName + "-" + this.text);
        this.shapeReactable = true;
        this.shapeTimer.delay = 600 + Math.random() * 500 + (800 - reactionLevel * 15);
        this.game.time.events.add(800 - reactionLevel * 15,this.shapeOff,this,this.realShape);
        this.addToLog("Shape Visible"); 
    },

    checkScores: function() {
        flyingLevel += (this.flyingScore - 80)/4;
        reactionLevel += (this.reactionsScore - 80)/4;
        this.addToLog("Flying: " + flyingLevel);
        this.addToLog("Reactions: " + reactionLevel); 

        this.checkScoresCounter = 0;

        this.resetScores();
    },

    resetScores: function(){
        this.reactionsScore = 80;
        this.flyingScore = 80;
    },

    shapeOff: function(object) {
        this.shapeReactable = false;
        // this.reactionsLabel.content = reactionLevel;
        if(object.exists){
            console.log("MISSED!");
            this.startGradient(this.yellowGradient);
            this.reactionsScore -= 0.5;
            this.addToLog("Shape Missed"); 
            object.destroy();
        }
    },

    flashBackground: function(color){
        this.game.stage.backgroundColor = color;
    },

    startGradient: function(gradient){
        this.gradientIndex = 0;
        this.gradientColor = gradient;
        this.gradientTimer = this.game.time.events.loop(40, this.progressGradient, this);
    },

    progressGradient: function(){
        this.game.stage.backgroundColor = this.gradientColor[this.gradientIndex];
        this.gradientIndex++;
        if(this.gradientIndex > 10){
            this.game.time.events.remove(this.gradientTimer);
        }
    },

    resetBackground: function(){
        this.game.stage.backgroundColor = '#71c5cf';
    }
};