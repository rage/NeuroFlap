var play_state = {

    // No more 'preload' function, since it is already done in the 'load' state

    create: function() { 
        var w_key = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        var s_key = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        w_key.onDown.add(this.react_true,this);
        s_key.onDown.add(this.react_false,this);

        this.pipes = game.add.group();
        this.pipes.createMultiple(30, 'pipe');  
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        this.shapeTimer = this.game.time.events.loop(2000, this.new_shape, this);
        this.shapeOn = false;

        this.bird = this.game.add.sprite(150, 450, 'bird');
        this.bird.body.gravity.y = 0; 
        this.bird.anchor.setTo(0.5, 0.5);

        this.shapes = ['Circle', 'Triangle', 'Pentagram'];
        var red = { font: "30px Arial", fill: "#ff0000" };
        var green = { font: "30px Arial", fill: "#00ff00" };
        var yellow = { font: "30px Arial", fill: "#ffff00" };
        this.styles = {'Red':red, 'Green':green};
        //this.shapes = {'Circle': key1.keyCode, 'Triangle': key2.keyCode, 'Square': key3.keyCode, 'Pentagram': key4.keyCode};
        console.log("The shape is:" + right_shape);

        this.hitShield = false;

        this.flying_level = 10;
        this.reaction_level = 10;
        this.check_scores_counter = 0;
        this.reset_scores();
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.flying_label = this.game.add.text(20, 20, "80%", style);
        this.reactions_label = this.game.add.text(330, 20, "80%", style); 
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restart_game(); 

        if (this.bird.angle < 0)
            this.bird.angle++;

        if(this.bird.angle > 0){
            this.bird.angle--;
        }

        if(this.text){
            this.text.x = this.bird.x;   
        }

        if(this.left_key.isDown){
            this.bird.body.velocity.x -= 10 + this.flying_level;
        }
        if(this.right_key.isDown){
            this.bird.body.velocity.x += 10 + this.flying_level;
        }
        this.bird.body.velocity.x = this.bird.body.velocity.x * 0.93;
        this.bird.angle = this.bird.body.velocity.x / 10;

        this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);      
    },

    react_true: function(){
        this.react(true);
    },

    react_false: function(){
        this.react(false);
    },

    react: function(approved) {
        console.log("Shape combo" + this.text.text + this.styleName);
        console.log("target" + right_shape + right_color);
        console.log("Reverse of player input: " + !approved);
        console.log(approved);
        if(this.text.exists && this.shapeReactable){
            if((this.text.text == right_shape && this.styleName == right_color) && approved){
                console.log("RIGHT RIGHT THING");
                this.reaction_score_array.push(1);    
            } else if((this.text.text != right_shape || this.styleName != right_color) && !approved) {
                console.log("RIGHT WRONG THING");
                this.reaction_score_array.push(1);
            } else {
                console.log("WRONG");
                this.reaction_score_array.push(0);
            }
            this.shapeReactable = false;
            this.reactions_score = this.calculate_score(this.reaction_score_array);
            this.reactions_label.content = this.reaction_level;
            this.text.destroy();
        }
    },

    hit_pipe: function() {
        if (this.bird.alive == false)
            return;
        if(!this.hitShield){
            this.flying_score_array.push(0);
            this.hitShield = true;
            this.game.time.events.add(500,this.hit_shield_off, this);
        }
    },

    hit_shield_off: function() {
        this.hitShield = false;
    },

    restart_game: function() {
        this.game.time.events.remove(this.timer);
        this.game.time.events.remove(this.shapeTimer);

        // This time we go back to the 'menu' state
        this.game.state.start('menu');
    },

    add_one_pipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.y = 150 + 15 * this.flying_level;
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function() {
        var hole = this.last_hole;
        while(hole == this.last_hole){
            hole = Math.floor(Math.random()*5)+1;
        }
        this.last_hole = hole;
        this.check_scores_counter++;
        if(this.check_scores_counter >= 15){
            this.check_scores();
        }
        console.log(hole);

        this.timer.delay = 1100 - 10 * this.flying_level;
        //console.log(1100 + 1000 * (1-(this.flying_score/100)));

        for (var i = 0; i < 8; i++){
            if (i != hole && i != hole +1) {
                this.add_one_pipe(i*50, -50);   
            }
        }
        this.flying_score_array.push(1);
        
        this.flying_score = this.calculate_score(this.flying_score_array);
        this.flying_label.content = this.flying_level;
    },

    new_shape: function() {
        this.styleName = Object.keys(this.styles)[Math.floor(Math.random()*Object.keys(this.styles).length)];
        this.text = this.game.add.text(this.bird.body.x, this.bird.body.y - 20, this.shapes[Math.floor(Math.random()*this.shapes.length)], this.styles[this.styleName]);
        this.shapeReactable = true;
        //console.log(500 + 1000 * (1-(this.reactions_score/100)));
        this.shapeTimer.delay = 600 + Math.random() * 500 + (800 - this.reaction_level * 15);
        this.game.time.events.add(800 - this.reaction_level * 15,this.shape_off,this,this.text);
    },

    calculate_score: function(array) {
        var array_start = array.length - 25;
        if(array_start < 0){
            array_start = 0;
        }
        var count = 0;
        for (var i = array_start; i < array.length; i++) {
            count += array[i];
        };

        var score = Math.floor((count/25)*100);
        return score;
    },

    set_up_array: function(array) {
        for (var i = 1; i < 21; i++) {
            if(i % 5 == 0){
                array.push(0);
            }
            array.push(1);
        };
        console.log(array);
    },

    check_scores: function() {
        this.flying_level += (this.flying_score - 80)/4;
        this.reaction_level += (this.reactions_score - 80)/4;
        console.log("Flying level:" + this.flying_level);
        console.log("Reactions level:" + this.reaction_level);
        this.check_scores_counter = 0;

        this.reset_scores();
    },

    reset_scores: function(){
        this.reaction_score_array = new Array();
        this.set_up_array(this.reaction_score_array);
        this.reactions_score = 80;
        this.flying_score_array = new Array();
        this.set_up_array(this.flying_score_array);
        this.flying_score = 80;
    },

    shape_off: function(object) {
        this.shapeReactable = false;
        this.reactions_score = this.calculate_score(this.reaction_score_array);
        this.reactions_label.content = this.reaction_level;
        if(object.exists){
            console.log("MISSED!");
            this.reaction_score_array.push(0);
            object.destroy();
        }
    }
};