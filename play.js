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
    },

    update: function() {
        if (this.bird.inWorld == false){
            this.restartGame(); 
        }
        if(this.realShape){
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

        this.game.physics.overlap(this.bird, this.pipes, this.hitPipe, null, this);      
    },

    reactTrue: function(){
        this.react(true);
    },

    reactFalse: function(){
        this.react(false);
    },

    react: function(approved) {
        console.log("Shape combo" + this.text + this.colorName);
        console.log("target" + rightShape + rightColor);
        if(this.realShape.exists && this.shapeReactable){
            if((this.text == rightShape && this.colorName == rightColor) && approved){
                console.log("RIGHT RIGHT THING");
                this.flashBackground('#00FF00');
                this.reactionScoreArray.push(2);    
            } else if((this.text != rightShape || this.colorName != rightColor) && !approved) {
                console.log("RIGHT WRONG THING");
                this.flashBackground('#00FF00');
                this.reactionScoreArray.push(1);
            } else {
                console.log("WRONG");
                this.flashBackground('#FF0000');
                this.reactionScoreArray.push(-1);
            }
            this.shapeReactable = false;
            this.reactionsScore = this.calculateScore(this.reactionScoreArray);
            // this.reactionsLabel.content = reactionLevel;
            this.realShape.destroy();
        }
    },

    hitPipe: function() {
        if (this.bird.alive == false)
            return;
        if(!this.hitShield){
            this.flyingScoreArray.push(-1);
            this.hitShield = true;
            this.game.time.events.add(500,this.hitShieldOff, this);
        }
    },

    hitShieldOff: function() {
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
    },

    flyingUpkeep: function() {
        this.checkScoresCounter++;
        if(this.checkScoresCounter >= 15){
            this.checkScores();
        }
        this.timer.delay = 1500 - 20 * flyingLevel;

        this.flyingScoreArray.push(1);
        
        this.flyingScore = this.calculateScore(this.flyingScoreArray);
        // this.flyingLabel.content = flyingLevel;
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
    },

    calculateScore: function(array) {
        var arrayStart = array.length - 25;
        if(arrayStart < 0){
            arrayStart = 0;
        }
        var count = 0;
        for (var i = arrayStart; i < array.length; i++) {
            count += array[i];
        };
        return Math.floor((count/25)*100);
    },

    checkScores: function() {
        flyingLevel += (this.flyingScore - 80)/4;
        reactionLevel += (this.reactionsScore - 80)/4;
        this.checkScoresCounter = 0;

        this.resetScores();
    },

    resetScores: function(){
        this.reactionScoreArray = new Array();
        this.setUpArray(this.reactionScoreArray);
        this.reactionsScore = 80;
        this.flyingScoreArray = new Array();
        this.setUpArray(this.flyingScoreArray);
        this.flyingScore = 80;
    },

    setUpArray: function(array) {
        for (var i = 1; i < 21; i++) {
            if(i % 5 == 0){
                array.push(0);
            }
            array.push(1);
        };
        console.log(array);
    },

    shapeOff: function(object) {
        this.shapeReactable = false;
        this.reactionsScore = this.calculateScore(this.reactionScoreArray);
        // this.reactionsLabel.content = reactionLevel;
        if(object.exists){
            console.log("MISSED!");
            this.flashBackground('#FFFF00');
            this.reactionScoreArray.push(0);
            object.destroy();
        }
    },

    flashBackground: function(color){
        this.game.stage.backgroundColor = color;
    },

    resetBackground: function(){

        this.game.stage.backgroundColor = '#71c5cf';
    }
};