var GameVarsData = new function(){

	this.loadFile = function(){
		//var loader = new Phaser.Loader(game);
		this.loader = new Phaser.Loader(game);

		this.loader.json('gameVarsData','assets/config/gameVarsData.json',true);
		this.loader.onFileComplete.add(function(){
			if(this.configTable == null){
				this.configTable = game.cache.getJSON('gameVarsData');
			}
		});
		this.loader.start();
	};

	this.checkFile = function(){

		if(this.configTable == null){
				this.configTable = game.cache.getJSON('gameVarsData');
		}

	};

	this.getConstantProperty = function(constantKey){
		this.checkFile();
		if(this.configTable["constantData"] == null)return null;
		return this.configTable["constantData"][constantKey]
	};

	this.getBuildingProperty = function(buildingType,key){

		this.checkFile();
		if(this.configTable["buildingData"] == null)return null;
		if(this.configTable["buildingData"][buildingType] == null)return null;
		return this.configTable["buildingData"][buildingType][key];

	};

	this.getStandProperty = function(standType,key){

		this.checkFile();
		if(this.configTable["standData"] == null)return null;
		if(this.configTable["standData"][standType] == null)return null;
		return this.configTable["standData"][standType][key];

	};


}
