var playState = {

    create: function() { 
        this.running = true;

        this.game.loggingArray = [];

        this.buttonSetup(this.game.settings.colorReactionsOn, this.game.settings.shapeReactionsOn);

        if(this.game.settings.blocksOn){
            this.pipes = game.add.group();
            this.pipes.createMultiple(30, 'pipe');  
            this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);
        }

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

        this.game.flyingLevel = 10;
        this.game.reactionLevel = 10;
        this.checkScoresCounter = 0;
        this.resetScores();

        this.lineY = 460;
        this.lineDestination = 400;
        this.lineStatus = "Green";

        var style = { font: "30px Arial", fill: "#ffffff" };
        // this.flyingLabel = this.game.add.text(20, 20, "10", style);
        // this.reactionsLabel = this.game.add.text(330, 20, "10", style); 
        if(this.game.settings.reactionsOn){
            this.shapeTimer = this.game.time.events.loop(2000, this.newShape, this);        
        }
        this.shapeOn = false;
        this.hitShield = false;
        this.endTimer = this.game.time.events.add(this.game.gameLength * 1000, this.endAndSend, this);
    },

    buttonSetup: function(colorReactions,shapeReactions){
        this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        var reactionFunction
        if(colorReactions && shapeReactions){
            reactionFunction = this.reactButtonCombo;
        } else if(!colorReactions && shapeReactions){
            reactionFunction = this.tutorialReactToShapes;
        } else if(colorReactions && !shapeReactions){
            reactionFunction = this.tutorialReactToColors;
        } else if(!colorReactions && !shapeReactions){
            reactionFunction = this.tutorialReactWithAnyButton;
        } else {
            reactionFunction = this.reactButtonCombo;
        }

        this.wKey.onDown.add(reactionFunction,this);
        this.sKey.onDown.add(reactionFunction,this);
        this.aKey.onDown.add(reactionFunction,this);
        this.dKey.onDown.add(reactionFunction,this);

        this.leftKey.onDown.add(this.keyPressed,this);
        this.rightKey.onDown.add(this.keyPressed,this);
        this.leftKey.onUp.add(this.keyReleased,this);
        this.rightKey.onUp.add(this.keyReleased,this);
        this.upKey.onDown.add(this.keyPressed,this);
        this.downKey.onDown.add(this.keyPressed,this);
        this.upKey.onUp.add(this.keyReleased,this);
        this.downKey.onUp.add(this.keyReleased,this);

        this.keyNames = ["Left", "Up", "Right", "Down"];
    },

    keyPressed: function(key){
        // LURD 37-40
        this.addToLog(this.keyCodeToName(key.keyCode) + " Pressed");
    },

    keyReleased: function(key){
        this.addToLog(this.keyCodeToName(key.keyCode) + " Released");
    },

    keyCodeToName: function(code){
        return this.keyNames[code - 37];
    },

    addToLog: function(event){
        var entry = {time: this.getTimeNow(), event: event};
        //console.log(entry);
        if(this.running){
            this.game.loggingArray.push(entry);
        }
    },

    update: function() {
        if (this.bird.inWorld == false){
            this.restartGame(); 
        }
        if(this.exists(this.realShape)){
            this.realShape.x = this.bird.x - 12;
            this.realShape.y = this.bird.body.y - 25
        }
        if(this.leftKey.isDown){
            this.bird.body.velocity.x -= 10 + Math.max(10,this.game.flyingLevel);
        }
        if(this.rightKey.isDown){
            this.bird.body.velocity.x += 10 + Math.max(10,this.game.flyingLevel);
        }
        if(this.upKey.isDown){
            this.bird.body.velocity.y -= 5;
        }
        if(this.downKey.isDown){
            this.bird.body.velocity.y += 5;
        }
        this.bird.body.velocity.x = this.bird.body.velocity.x * 0.93;
        this.bird.body.velocity.y = this.bird.body.velocity.y * 0.93;
        this.bird.angle = this.bird.body.velocity.x / 10;
        if(this.exists(this.hitMarker)){
            this.hitMarker.body.x = this.bird.body.x;
            this.hitMarker.body.y = this.bird.body.y;
            this.hitMarker.angle = this.bird.angle;
        }

        if(this.game.settings.lineOn){
            this.newLine();
        }

        console.log("Flying: " + this.game.flyingLevel + " Reactions: " + this.game.reactionLevel + " Flying score: " + this.flyingScore);

        this.game.physics.overlap(this.bird, this.pipes, this.hitPipe, null, this);      
    },

    newLine: function(){
        var shape = game.add.graphics(0, 0);  //init rect
        shape.beginFill(0x00FF0B, 1);
        
        if(Math.abs((this.bird.body.y + 24) - this.lineY) < 15){
            if(this.lineStatus != "Green"){
                this.lineStatus = "Green";
                this.addToLog("Line status: Green");
            }
            shape.lineStyle(2, 0x2E64FE, 1);
        } else {
            if(this.lineStatus != "Red"){
                this.lineStatus = "Red";
                this.addToLog("Line status: Red");
            }
            shape.lineStyle(2, 0xB43104, 1); 
        }

        shape.moveTo(0, this.lineY); // x, y
        shape.lineTo(400, this.lineY); // x, y        
        this.moveLine();

        this.game.time.events.add(1,this.destroyShape, this,shape);
    },

    moveLine: function(){
        if(this.lineY < this.lineDestination + 1 && this.lineY > this.lineDestination - 1){
            this.newDestination();
            this.addToLog("New line destination: " + this.lineDestination);
        }
        if(this.lineY < this.lineDestination){
            this.lineY += 0.2;
        } else  if(this.lineY > this.lineDestination){
            this.lineY -= 0.2;
        }
    },

    newDestination: function(){
        this.lineDestination = 375 + Math.floor((Math.random() * 100));
    },

    destroyShape: function(shape){
        shape.destroy(true);
    },

    exists: function(object){
        if(object != undefined){
            return object.exists;
        }
        return false;
    },

    getTimeNow: function(){
        return Date.now()/1000;
    },

    reactSingleButton: function(key){
        if(this.wKey.isDown){
            this.react("Green",true);
        } else if(this.aKey.isDown){
            this.react("Red",true);
        } else if(this.sKey.isDown){
            this.react("Green",false);
        } else if(this.dKey.isDown){
            this.react("Red",false);
        }
    },

    reactButtonCombo: function(key){
        if(this.wKey.isDown && this.aKey.isDown){
            this.react("Red",true);
        } else if(this.wKey.isDown && this.dKey.isDown){
            this.react("Green",true);
        } else if(this.sKey.isDown && this.dKey.isDown){
            this.react("Green",false);
        } else if(this.sKey.isDown && this.aKey.isDown){
            this.react("Red",false);
        }
    },

    tutorialReactWithAnyButton: function(key){
        this.tutorialReact("Tutorial", true, false, false);
    },

    tutorialReactToColors: function(key){
        if(this.aKey.isDown){
            this.tutorialReact("Red", true, true, false);
        } else if(this.dKey.isDown){
            this.tutorialReact("Green", true, true, false);
        }
    },

    tutorialReactToShapes: function(key){
        if(this.wKey.isDown){
            this.tutorialReact("Tutorial", true, false, true);
        } else if(this.sKey.isDown){
            this.tutorialReact("Tutorial", false, false, true);
        }
    },

    colorApprovedToButtons: function(color,approved){
        var buttonCombo = "";
        if(approved){
            buttonCombo += "W";
        } else {
            buttonCombo += "S";
        }
        buttonCombo += " + ";
        if(color == "Green"){
            buttonCombo += "D";
        } else if(color == "Red"){
            buttonCombo += "A";
        }
        return buttonCombo;
    },

    logReaction: function(color,approved){
        var pressed = "Pressed: " + this.colorApprovedToButtons(color,approved);
        var toPress = "Target: " + this.colorApprovedToButtons(this.colorName, this.text == this.game.rightShape);
        //console.log(pressed + " " + toPress);
        this.addToLog(pressed + " " + toPress);
    },

    react: function(color, approved) {
        if(this.exists(this.realShape) && this.shapeReactable){
            this.logReaction(color,approved);
            if((this.text == this.game.rightShape && this.colorName == color) && approved){
                this.startGradient(this.greenGradient);
                this.reactionsScore += 0.75;    
            } else if((this.text != this.game.rightShape && this.colorName == color) && !approved) {
                this.startGradient(this.greenGradient);
                this.reactionsScore += 0.75;
            } else {
                this.startGradient(this.redGradient);
                this.reactionsScore -= 0.75;
            }
            this.shapeReactable = false;
            this.realShape.destroy();
        }
    },

    tutorialCheckReaction: function(color, approved, careAboutColor, careAboutShape) {
        if(!careAboutColor && !careAboutShape){
            return true;
        } else if(careAboutColor && this.colorName == color && !careAboutShape){
            return true;
        } else if(careAboutShape && this.text == this.game.rightShape && approved && !careAboutColor){
            return true;
        } else if(careAboutShape && this.text != this.game.rightShape && !approved && !careAboutColor){
            return true;
        } else {
            return false;
        }
    },

    tutorialReact: function(color, approved, careAboutColor, careAboutShape){
        if(this.exists(this.realShape) && this.shapeReactable){
            if(this.tutorialCheckReaction(color, approved, careAboutColor, careAboutShape)){
                this.addToLog("Tutorial reaction pass");
                this.startGradient(this.greenGradient);
            } else{
                this.addToLog("Tutorial reaction fail");
                this.startGradient(this.redGradient);
            }
            this.shapeReactable = false;
            this.realShape.destroy();
        }
    },

    hitPipe: function() {
        if (this.bird.alive == false)
            return;
        if(!this.hitShield && this.game.settings.blocksOn){
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

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.y = 150 + 10 * Math.max(5 , this.game.flyingLevel * 1.5);
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
        this.addToLog("New obstacle, hole at " + hole);
    },

    flyingUpkeep: function() {
        this.checkScoresCounter++;
        if(this.checkScoresCounter >= 15){
            this.checkScores();
        }
        this.timer.delay = 1550 - 25 * this.game.flyingLevel;

        if(this.lineStatus == "Green"){
            this.flyingScore += 0.75;
        }
    },

    randomItem: function(array) {
        return array[Math.floor(Math.random()*array.length)];
    },

    newShape: function() {
        this.colorName = this.randomItem(this.colors);
        this.text = this.randomItem(this.shapes);
        this.realShape = this.game.add.sprite(this.bird.body.x, this.bird.body.y - 25,this.colorName + "-" + this.text);
        this.shapeReactable = true;
        this.shapeTimer.delay = (600 + Math.random() * 500 + (900 - this.game.reactionLevel * 25))*1.75;
        this.game.time.events.add((900 - this.game.reactionLevel * 25)*2,this.shapeOff,this,this.realShape);
        this.addToLog("New Shape Visible: " + this.colorName + " " + this.text); 
    },

    checkScores: function() {
        this.game.flyingLevel += (this.flyingScore - 80)/4;
        this.game.reactionLevel += (this.reactionsScore - 80)/4;
        this.addToLog("Flying: " + this.game.flyingLevel);
        this.addToLog("Reactions: " + this.game.reactionLevel); 

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
            this.startGradient(this.yellowGradient);
            this.reactionsScore -= 0.75;
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
    },

    endAndSend: function(){
        this.checkScores();
        var studentid = document.getElementById("student_id").value;
        if(studentid == ""){
            console.log("no student number!");
            studentid = "321";
        }
        var actualSession = false;
        if(this.game.settings.lineOn && this.game.settings.reactionsOn && this.game.settings.blocksOn && this.game.settings.colorReactionsOn && this.game.settings.shapeReactionsOn){
            actualSession = true;
        }
        $.ajax({
          type: "POST",  
          url: "https://mcviinam.users.cs.helsinki.fi/neuroflap/save.php",
          data: JSON.stringify({'studentNumber': studentid, 'entries': this.game.loggingArray, 'flying':this.game.flyingLevel, 'reactions':this.game.reactionLevel, 'actualSession':actualSession}),
          success: function( data ) {
            console.log("DATA SENT!");
          },
          error: function(jqXHR) {
            console.log("ERROR! DATA NOT SENT");
          }
        });
        //console.log("data was: studentid: " + studentid + " flyinglevel: " + this.game.flyingLevel + " reactions: " + this.game.reactionLevel + " realData: " + actualSession);

        this.restartGame();
    },

    restartGame: function() {
        this.game.time.events.remove(this.timer);
        this.game.time.events.remove(this.shapeTimer);

        this.running = false;

        this.game.gameOver = true;
        this.game.state.start('end');
    }
};