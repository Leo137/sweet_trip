var LocalizableStrings = new function(){

	this.loadFile = function(){
		this.loader = new Phaser.Loader(game);

		this.loader.json('config-languages','assets/languages/config.json',true);
		this.loader.onFileComplete.add(function(){
			
			this.configTable = game.cache.getJSON('config-languages');
			
			LocalizableStrings.language = this.configTable["language"];
			game.load.json('languages_'+LocalizableStrings.language,'assets/languages/'+LocalizableStrings.language+'.json',true);
		});
		this.loader.start();
	};

	this.checkFile = function(){
		if(this.language == null){

			while(this.loader.progress!=100){
				this.loadFile();
			}
		}
		if(this.stringTable == null){
				this.stringTable = game.cache.getJSON('languages_'+this.language);
		}

	};

	this.getString = function(code){

		this.checkFile();

		if(arguments.length>1){

			// strings compuestos con %x

			var t = this.stringTable[code];
			for(x=1;x<arguments.length;x++){
				var tt = this.stringTable[arguments[x]];
				t = t.replace("%"+x, tt);
			}
			return t;
		}
		return this.stringTable[code];


	};


}
