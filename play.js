var play_state = {

    // No more 'preload' function, since it is already done in the 'load' state

    create: function() { 
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACE);
        this.left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        var key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        var key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        var key3 = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        var key4 = this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        key1.onDown.add(this.react, this, key1);
        key2.onDown.add(this.react, this, key2);
        key3.onDown.add(this.react, this, key3);
        key4.onDown.add(this.react, this, key4);

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');  
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        this.shapeTimer = this.game.time.events.loop(2000, this.new_shape, this);
        this.shapeOn = false;

        this.bird = this.game.add.sprite(150, 450, 'bird');
        this.bird.body.gravity.y = 0; 
        this.bird.anchor.setTo(0.5, 0.5);

        this.shapes = {'Circle': key1.keyCode, 'Triangle': key2.keyCode, 'Square': key3.keyCode, 'Pentagram': key4.keyCode}; 

        this.hitShield = false;

        // No 'this.score', but just 'score'
        score = 0.0; 
        this.cleared = 0;
        this.total = 0;
        this.reactions = 0;
        this.totalReactions = 0;
        this.reactionScore = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);
        this.reactions_score = this.game.add.text(330, 20, "0", style); 
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
            this.bird.body.velocity.x -= 20;
            //this.game.add.tween(this.bird).to({angle: -10}, 100).start();    
        }
        if(this.right_key.isDown){
            this.bird.body.velocity.x += 20;
            //this.game.add.tween(this.bird).to({angle: 10}, 100).start();    
        }
        this.bird.body.velocity.x = this.bird.body.velocity.x * 0.93;
        this.bird.angle = this.bird.body.velocity.x / 10;

        this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);      
    },

    react: function(key) {
        if(this.text.exists && this.shapeReactable){
            console.log(this.text.text);
            console.log(this.shapes['Square']);
            console.log(key.keyCode);
            if(this.shapes[this.text.text] == key.keyCode){
                this.reactions++;        
            }
            this.shapeReactable = false;
            this.reactionScore = Math.floor(this.reactions/this.totalReactions*100);
            this.reactions_score.content = this.reactionScore + "%";
            this.text.destroy();
        }
    },

    hit_pipe: function() {
        if (this.bird.alive == false)
            return;
        if(!this.hitShield){
            this.cleared--;
            this.hitShield = true;
            this.game.time.events.add(500,this.hit_shield_off, this);
        }
    },

    hit_shield_off: function() {
        console.log(this.hitShield);
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
        pipe.body.velocity.y = 200; 
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1;

        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.add_one_pipe(i*50, -50);   

        // No 'this.score', but just 'score'
        this.total++;
        this.cleared++;
        score = Math.floor(this.cleared/this.total*100);
        this.label_score.content = score + "%";  
    },

    new_shape: function() {
        this.text = this.game.add.text(this.bird.body.x, this.bird.body.y - 20, Object.keys(this.shapes)[Math.floor(Math.random()*Object.keys(this.shapes).length)]);
        this.shapeReactable = true;
        this.totalReactions++;
        this.game.time.events.add(700,this.shape_off,this,this.text);
    },

    shape_off: function(object) {
        this.shapeReactable = false;
        this.reactionScore = Math.floor(this.reactions/this.totalReactions*100);
        this.reactions_score.content = this.reactionScore + "%";
        if(object.exists){
            object.destroy();
        }
    }
};