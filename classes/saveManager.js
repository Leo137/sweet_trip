var SaveManager = new function(){


	this.saveGame = function(){
		console.log("SAVING GAME");


		var tile_buildings_2 = new Array();
		var x,y;

		for(y=0; y<tile_buildings.length ; y++){
			tile_buildings_2[y] = new Array();
			for(x=0; x<tile_buildings[y].length ; x++){
				if(tile_buildings[y][x]!= null){
					tile_buildings_2[y][x] = new Object();
					tile_buildings_2[y][x].name = tile_buildings[y][x].name;
					tile_buildings_2[y][x].level = tile_buildings[y][x].level;

					tile_buildings_2[y][x].tile_x = tile_buildings[y][x].tile_x;
					tile_buildings_2[y][x].tile_y = tile_buildings[y][x].tile_y;
				}
			}
		}

		info.statsManager = currentStatsManager;
		info.currentWave = currentManager.currentWaveIndex;
		info.health = health;

		localStorage.setItem('SweetTrip_buildings', JSON.stringify(tile_buildings_2));
		localStorage.setItem('SweetTrip_resources', JSON.stringify(resources));
		localStorage.setItem('SweetTrip_info', JSON.stringify(info));


	};


	this.continueGame = function(){

		console.log("CONTINUING GAME");
		tile_buildings = JSON.parse(localStorage.getItem('SweetTrip_buildings'));
		resources = JSON.parse(localStorage.getItem('SweetTrip_resources'));
		info = JSON.parse(localStorage.getItem('SweetTrip_info'));

	};

	this.resetSave = function(){

		localStorage.setItem('SweetTrip_buildings', null);
		localStorage.setItem('SweetTrip_resources', null);
		localStorage.setItem('SweetTrip_info', null);

	};

	this.hasData = function(){
		return localStorage.getItem('SweetTrip_resources') != null
		 && localStorage.getItem('SweetTrip_resources') != "null";
	}

}
