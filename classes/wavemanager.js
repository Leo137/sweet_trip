var currentManager;
function WaveManager(){
    //Instancia varias waves predefinidas
    this.Waves = [];
    this.maxWaves = 10;
    this.currentWaveIndex = info.currentWave;
    this.Waves = game.cache.getJSON('waveData').Waves;
    this.StartWave = function(){
	//Empieza una wave
	var parameters = this.Waves[this.currentWaveIndex];
	currentWave = new WaveGenerator(parameters.startTime,parameters.releaseSpeed);
	currentWave.difficultyLevel = parameters.difficultyLevel;
	currentWave.CreateWave(parameters);
	currentWave.ScheduleWave();
	currentWave.waveIndex = this.currentWaveIndex;
	this.currentWaveIndex++;
		
    };
    this.StartWaves = function(){
	//Empuieza a crear waves cuando se reunen las condiciones
	//para crear dicha wave, esto es, al inicio del juego o cuando la wave haya terminado
	if((currentWave == null || currentWave.isFinished()) && this.currentWaveIndex < this.maxWaves){
		if(this.currentWaveIndex > 0 && health > 0){
			SaveManager.saveGame();
		}
		
	    this.StartWave();

	    if(currentStatsManager!=null)currentStatsManager.finishedWaves++;
	}
    };
	    
};

function WaveParameters(startTime,releaseSpeed,customerNumber,difficultyLevel){
    //Tiene los parametros de una wave
    this.startTime = startTime;
    this.releaseSpeed = releaseSpeed;
    this.customerNumber = customerNumber;
    this.difficultyLevel = difficultyLevel;
}
