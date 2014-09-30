var play_state = {

    // No more 'preload' function, since it is already done in the 'load' state

    create: function() { 
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');  
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

        this.shapeTimer = this.game.time.events.loop(2000, this.new_shape, this);
        this.shapeOn = false;

        this.bird = this.game.add.sprite(100, 245, 'bird');
        this.bird.body.gravity.y = 1100; 
        this.bird.anchor.setTo(-0.2, 0.5);

        this.shapes = ["Circle", "Triangle", "Square", "Pentagram"];

        // No 'this.score', but just 'score'
        score = 0; 
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style); 
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restart_game(); 

        if (this.bird.angle < 20)
            this.bird.angle += 1;

        if(this.text){
            this.text.y = this.bird.y - 40;   
            console.log(this.text.text);
        }

        this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);      
    },

    jump: function() {
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;
        this.game.add.tween(this.bird).to({angle: -20}, 100).start();
    },

    hit_pipe: function() {
        if (this.bird.alive == false)
            return;

        this.bird.alive = false;
        this.game.time.events.remove(this.timer);
        this.game.time.events.remove(this.shapeTimer);

        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
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
        pipe.body.velocity.x = -200; 
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*5)+1;

        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.add_one_pipe(400, i*60+10);   

        // No 'this.score', but just 'score'
        score += 1; 
        this.label_score.content = score;  
    },

    new_shape: function() {
        console.log("turning on!");

        this.text = this.game.add.text(this.bird.body.x + 10, this.bird.body.y, this.shapes[Math.floor(Math.random()*this.shapes.length)])
        this.game.time.events.add(500,this.shape_off,null,this.text);
    },

    shape_off: function(object) {
        console.log("turning off!");
        object.destroy();
    }
};