var play_state = {

    // No more 'preload' function, since it is already done in the 'load' state

    create: function() { 
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACE);
        var left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        var right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        left_key.onDown.add(this.left, this); 
        right_key.onDown.add(this.right, this);

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');  
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        this.shapeTimer = this.game.time.events.loop(2000, this.new_shape, this);
        this.shapeOn = false;

        this.bird = this.game.add.sprite(150, 385, 'bird');
        this.bird.body.gravity.y = 0; 
        this.bird.anchor.setTo(0.5, 0.5);

        this.shapes = ["Circle", "Triangle", "Square", "Pentagram"];

        // No 'this.score', but just 'score'
        score = 0; 
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style); 
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

        this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);      
    },

    left: function() {
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.x = -120;
        this.game.add.tween(this.bird).to({angle: 10}, 100).start();
    },

    right: function() {
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.x = 120;
        this.game.add.tween(this.bird).to({angle: -10}, 100).start();
    },

    hit_pipe: function() {
        if (this.bird.alive == false)
            return;

        this.bird.alive = false;
        this.bird.body.velocity.y = 0;
        this.game.time.events.remove(this.timer);
        this.game.time.events.remove(this.shapeTimer);

        this.pipes.forEachAlive(function(p){
            p.body.velocity.y = 0;
        }, this);
        this.restart_timer = this.game.time.events.loop(500, this.restart_game, this);;
    },

    restart_game: function() {
        this.game.time.events.remove(this.timer);
        this.game.time.events.remove(this.shapeTimer);
        this.game.time.events.remove(this.restart_timer);

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
                this.add_one_pipe(i*50, 10);   

        // No 'this.score', but just 'score'
        score += 1; 
        this.label_score.content = score;  
    },

    new_shape: function() {
        console.log("turning on!");

        this.text = this.game.add.text(this.bird.body.x, this.bird.body.y - 20, this.shapes[Math.floor(Math.random()*this.shapes.length)])
        this.game.time.events.add(500,this.shape_off,null,this.text);
    },

    shape_off: function(object) {
        console.log("turning off!");
        object.destroy();
    }
};