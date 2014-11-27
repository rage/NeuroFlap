var loadState = {  
    preload: function() { 
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('bird', 'assets/bird.png');  
        this.game.load.image('pipe', 'assets/pipe.png');
        this.game.load.image('hit', 'assets/hit.png');
        this.game.load.image('Blue-Circle', 'assets/blue-circle.png'); 
        this.game.load.image('Yellow-Circle', 'assets/yellow-circle.png');  
        this.game.load.image('Blue-Triangle', 'assets/blue-triangle.png'); 
        this.game.load.image('Yellow-Triangle', 'assets/yellow-triangle.png'); 
        this.game.load.image('Blue-Pentagon', 'assets/blue-pentagon.png'); 
        this.game.load.image('Yellow-Pentagon', 'assets/yellow-pentagon.png'); 
        this.game.load.image('LRKeys', 'assets/LeftRightArrowKeys.png');
        this.game.load.image('ArrowKeys', 'assets/ArrowKeys.png');
        this.game.load.image('ArrowKeysAD', 'assets/ArrowKeysAD.png');
        this.game.load.image('ArrowKeysSW', 'assets/ArrowKeysSW.png');
        this.game.load.image('AllKeys', 'assets/AllKeys.png');
    },

    create: function() {
        // When all assets are loaded, go to the 'menu' state
        this.game.state.start('menu');
    }
};