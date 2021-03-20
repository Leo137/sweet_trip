

var SaveManager = new function(){



	this.saveGame = function(){
		console.log("SAVING GAME");
		localStorage.setItem('SweetTrip_save', JSON.stringify(this.SaveData));

	};


	this.continueGame = function(){
		if(this.hasData()){
			console.log("CONTINUING GAME");
			this.SaveData = JSON.parse(localStorage.getItem('SweetTrip_save'));
		}

	};

	this.resetSave = function(){

		localStorage.setItem('SweetTrip_save', null);
		this.SaveData = null;

	};

	this.hasData = function(){
		return localStorage.getItem('SweetTrip_save') != null
		 && localStorage.getItem('SweetTrip_save') != "null";
	};

	this.saveLevelCleared = function(number,stats){
		/*

			'stats' contents:
				cleared
				stars
				moneyFinal
				locked
				...

		*/

		if(!this.hasData()){
			this.SaveData = new Array();
		}
		if(this.SaveData[number] != null){
			if(this.SaveData[number].moneyFinal > stats.moneyFinal){
				console.log("SAVE HAS BETTER LEVEL CLEAR");
				return;
			}
		}
		this.SaveData[number] = stats;

		this.saveGame();
	};

	this.getLevelCleared = function(number){
		if(this.SaveData != null){
			if(number in this.SaveData){
				return this.SaveData[number];
			}
		}
		return null;
	};

}
