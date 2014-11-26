var loadState = {  
    preload: function() { 
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('bird', 'assets/bird.png');  
        this.game.load.image('pipe', 'assets/pipe.png');
        this.game.load.image('hit', 'assets/hit.png');
        this.game.load.image('Green-Circle', 'assets/green-circle.png'); 
        this.game.load.image('Red-Circle', 'assets/red-circle.png');  
        this.game.load.image('Green-Triangle', 'assets/green-triangle.png'); 
        this.game.load.image('Red-Triangle', 'assets/red-triangle.png'); 
        this.game.load.image('Green-Pentagon', 'assets/green-pentagon.png'); 
        this.game.load.image('Red-Pentagon', 'assets/red-pentagon.png'); 
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