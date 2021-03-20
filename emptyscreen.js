BasicGame.EmptyScreen = function(){ }; 
 

BasicGame.EmptyScreen.prototype = { 


	loadUpdate : function(){
		if(pieProgressPie && pieProgressPie.alive){
            
	        progress = (game.load.progress/100.0) * 1.0;
	        if(progress != progress_prev){
	            progress_prev = progress;
	            game.world.add(pieProgressPie);
	            pieTween = game.add.tween(pieProgressPie);
	            pieTween.to({progress: (1-progress)}, 100, Phaser.Easing.Linear.None, true, 0, 0, false );
	        }
    	}
	},
	preload: function() {
		pieProgressPie = new PieProgress(game, game.width/2,game.height/2, 16);

		//load stuff
	},
	create: function() {
		pieProgressPie.destroy();
    	pieProgressPie = null;


	},
	update: function() {

	}

}