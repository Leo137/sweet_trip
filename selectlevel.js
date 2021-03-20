BasicGame.SelectLevel = function(){ }; 
 
BasicGame.SelectLevel.prototype = { 

	
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

		game.load.image('selectLevelTile','assets/sprites/selectLevelTile.png');
		game.load.image('selectLevelNextPage','assets/sprites/selectLevelNextPage.png');
		game.load.image('star_icon', 'assets/sprites/star_icon.png');
		game.load.image('lock', 'assets/sprites/lock.png');

	},
	create: function() {
		pieProgressPie.destroy();
    	pieProgressPie = null;

    	this.selectLevelText = game.add.text(30, 30, LocalizableStrings.getString("selectlevel-selectalevel"), { font: "bold 34px Arial", fill: "#FFFFFF" });
    	this.selectLevelText.anchor.set(0.0,0.5);
    	this.selectLevelText.stroke =  'black';
    	this.selectLevelText.strokeThickness=2;

    	this.menuText = game.add.text( 20, game.height/2 + game.height/2.2, LocalizableStrings.getString("gameover-tomenu"), { font: "bold 40px Arial", fill: "#FFFFFF" });
	    if(isLandscape){
	        this.menuText.y = game.height/2 + game.height/2.4;
	    }
	    this.menuText.fixedToCamera = true;
	    this.menuText.anchor.set(0.0,0.5);
	    this.menuText.stroke =  'black';
	    this.menuText.strokeThickness=2;

	    this.menuText.inputEnabled = true;
	    this.menuText.events.onInputDown.add(toMenu, this);

	    this.loadingWheel = new PieProgress(game, game.width/2,game.height/2, 30);
	    game.world.add(this.loadingWheel);

	    this.currentPage = 0;
	    this.levels = [];
		this.levelsGrid = game.add.group();
	    
	    if(isLandscape){
	    	this.levelsGrid.x = 60;
	    	this.levelsGrid.y = 80;
	    	this.maxCells = 4;
	    	this.maxRows = 2;
		}
		else{
			this.levelsGrid.x = 30;
	    	this.levelsGrid.y = 80;
	    	this.maxCells = 3;
	    	this.maxRows = 3;
		}
	    this.levelsGrid.alpha = 0;

	    this.getLevelList();

	    console.log(this);

	    this.nextPage = game.add.sprite(360,70,'selectLevelNextPage');
	    this.levelsGrid.add(this.nextPage);
	    this.nextPage.inputEnabled = true;
    	this.nextPage.events.onInputDown.add(this.toNextPage, this);

	    this.backPage = game.add.sprite(-10,70,'selectLevelNextPage');
	    this.backPage.scale.setTo(-1,1);
	    this.levelsGrid.add(this.backPage);
	    this.backPage.inputEnabled = true;
    	this.backPage.events.onInputDown.add(this.toBackPage, this);

    	if(!isLandscape){

    		this.backPage.x = 60;
    		this.backPage.y = 280;

    		this.nextPage.x = 200;
    		this.nextPage.y = 280;

    	}

	},
	update: function() {

	},
	getLevelList: function(){
		var selectLevel = game.state.callbackContext;
		var loadingWheel = this.loadingWheel;
		this.loadingTween = game.add.tween(this.loadingWheel);
		this.loadingWheel.progress = 0.5;
        this.loadingTween.to({angle:270}, 1000, Phaser.Easing.Linear.None, true, 0, 99999, false );
		$.getJSON('assets/utils/getLevelList.php', function(data) {
			console.log(loadingWheel);
			var finishLoadingTween = game.add.tween(loadingWheel);
			finishLoadingTween.to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 0, 0, false );
			finishLoadingTween.onComplete.add(function(){
				loadingWheel.destroy();
				loadingWheel = null;
				var gridTween = game.add.tween(selectLevel.levelsGrid);
				gridTween.to({alpha:1}, 200, Phaser.Easing.Linear.None, true, 0, 0, false );
				BasicGame.SelectLevel.prototype.createLevelList(data);
			});
			console.log(data);
		});
	},
	createLevelList: function(data){
		var selectLevel = game.state.callbackContext;
		var levels = selectLevel.levels;
		var levelsGrid = selectLevel.levelsGrid;
		data.forEach(function(l){
			var stats = SaveManager.getLevelCleared(l);
			var level = game.add.group();

			level.tile = game.add.sprite(0,0,'selectLevelTile');
			level.tile.scale.setTo(0.8);
			level.add(level.tile);
			level.text = game.add.text(level.tile.width/2,level.tile.height/2,l,{ font: "bold 40px Arial", fill: "#ff8080" });
			level.text.anchor.setTo(0.5);
			level.add(level.text);
			level.number = l;
			level.tile.inputEnabled = true;

			level.tile.events.onInputDown.add(selectLevel.toLevel, level);

			if(stats != null){

				if(stats.cleared){
					level.stars = game.add.group();
				
					var max = 0;
					if(stats != null && stats.cleared){
						max = stats.stars;
					}
					var x = 0;
					for(x = 0;x<3;x++){
						var s = game.add.sprite(x*20,0,'star_icon');
		                s.scale.setTo(0.15);
		                s.anchor.setTo(0.5);
		                if(x >= max)
		                	s.tint = 0x707070;
		                level.stars.add(s);
					}
					level.stars.x = 20;
					level.stars.y = 70;

					level.add(level.stars);
				}
				if(stats.locked){
					level.lock = game.add.sprite(level.tile.width/2,level.tile.height/2,'lock');
					level.lock.anchor.setTo(0.5);
					level.lock.scale.setTo(0.15);

					level.add(level.lock);

				}
			}
			
			

			

			levels[levels.length] = level;

			levelsGrid.add(level);
		});
		selectLevel.orderLevelList();

		
	},
	orderLevelList: function(){
		var selectLevel = game.state.callbackContext;
		selectLevel.levels.sort(function(a,b){
			return parseInt(a.number) - parseInt(b.number);
		});
		var x = 0;
		var y = 0;
		var z = 0;
		var x_ = selectLevel.maxCells-1;
		var y_ = selectLevel.maxRows-1;
		selectLevel.levels.forEach(function(level){
			level.x = 90 * x;
			level.y = 90 * y;
			level.page = z;
			x++;
			if(x > x_){
				x = 0;
				y ++;
			}
			if(y > y_){
				x = 0;
				y = 0;
				z++;
			}
		});
		selectLevel.updateLevelPage();
	},
	updateLevelPage: function(){
		var selectLevel = game.state.callbackContext;
		selectLevel.levels.forEach(function(level){
			if(level.page == selectLevel.currentPage){
				level.visible = true;
				level.tile.inputEnabled = true;
			}
			else{
				level.visible = false;
				level.tile.inputEnabled = false;
			}
		});

		selectLevel.backPage.visible = false;
		selectLevel.backPage.inputEnabled.false;
		selectLevel.nextPage.visible = false;
		selectLevel.nextPage.inputEnabled.false;

		if(selectLevel.currentPage > 0){
			selectLevel.backPage.visible = true;
			selectLevel.backPage.inputEnabled.true;
		}

		if(selectLevel.currentPage < selectLevel.pagesLength()){
			selectLevel.nextPage.visible = true;
			selectLevel.nextPage.inputEnabled.true;
		}
	},
	pagesLength: function(){
		var selectLevel = game.state.callbackContext;
		var maxPage = 0;
		selectLevel.levels.forEach(function(level){
			if(level.page > maxPage){
				maxPage = level.page;
			}
		});
		return maxPage;
	},
	toBackPage: function(){
		button_click.play();
		var selectLevel = game.state.callbackContext;
		selectLevel.currentPage--;
		selectLevel.updateLevelPage();
	},
	toNextPage: function(){
		button_click.play();
		var selectLevel = game.state.callbackContext;
		selectLevel.currentPage++;
		selectLevel.updateLevelPage();
	},
	toLevel: function(){

		var stats = SaveManager.getLevelCleared(this.number);

		if(stats != null && stats.locked){
			unhappy.play();
		}
		else{
			button_click.play();
			console.log("Nivel "+this.number);

			/*var stats = {};
			stats.cleared = false;
			stats.stars = 3;
			stats.moneyFinal = 2000;
			stats.locked = true;
			SaveManager.saveLevelCleared(this.number,stats);*/
		}
		
	}

}