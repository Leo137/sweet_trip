var currentWave;
function WaveGenerator(startTime,releaseSpeed){
    //Crea una wave en base a ciertos parametros. Tiempos estan en segundos
    var WaveEntities = []; //Contiene a los customers de la wave
    var currentCustomer = 0;

    this.maxDelta = 5*Phaser.Timer.SECOND; //El tiempo maximo de diferencia de espera para spawnear un enemigo. 
    this.releaseSpeed = releaseSpeed*Phaser.Timer.SECOND;
    this.startTime = startTime*Phaser.Timer.SECOND;
    this.releaseSpeed = releaseSpeed*Phaser.Timer.SECOND;
    this.totalFinished = 0;
    this.totalSatisfied = 0;
    var customerTypes = game.cache.getJSON("customerTypeData");
    var spawnType = Object.keys(customerTypes);
    //Crea un wave
    this.CreateWave = function(parameters){
	var spawnNumber = parameters.customerNumber;
	//Esto tiene que ser cambiado por la forma correcta de escoger a un customer
	for(i = 0; i< spawnNumber; i++){
	    var currentType = Phaser.Math.chanceRoll(parameters.fatProportion*100.0/parameters.normalProportion)? 'normal':'gordo';
	    WaveEntities[WaveEntities.length] = new Customer(this,customerTypes[currentType]);
	};
	this.spawnNumber = spawnNumber;
    };
    this.activateOneCustomer = function(){
	//Despierta a un cliente para que comienze a caminar
	WaveEntities[currentCustomer].CustomerContext.startCustomer();
	currentCustomer++;
	if(currentCustomer < WaveEntities.length){
	    //Ve el tiempo random
	    var delta = (Math.random() * this.maxDelta);
	    game.time.events.add(this.releaseSpeed + delta,this.activateOneCustomer,this);
	}
    };
    this.waveEffect = function(){
    	// efecto de empezar la wave

    	

    	if(this.waveLabel!=null){
			this.waveLabel.destroy();
			this.waveLabel = null;
		}
		var t = LocalizableStrings.getString("general-wave");
		this.waveLabel = game.add.text(game.width/2, game.height/2, t+" "+(this.waveIndex+1)+"!", { font: "bold 32px Arial", fill: "#FFFFFF" });
    	this.waveLabel.fixedToCamera = true;
    	this.waveLabel.anchor.set(0.5,0.5);
    	this.waveLabel.stroke =  'black';
    	this.waveLabel.strokeThickness=2;

    	if(this.waveLabelTween!=null){
    		this.waveLabelTween.stop();
    		this.waveLabelTween = null;
    	}
    	if(this.waveLabelTween2!=null){
    		this.waveLabelTween2.stop();
    		this.waveLabelTween2 = null;
    	}
    	this.waveLabelTween = game.add.tween(this.waveLabel);
    	this.waveLabelTween2 = game.add.tween(this.waveLabel.cameraOffset);
    	this.waveLabelTween.to( { alpha:0.0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
    	this.waveLabelTween2.to( { y:game.height/2 - 20}, 999, Phaser.Easing.Linear.None, true, 0, 0, false);

    	this.waveLabelTween.onComplete.add(function(){
    		var c = currentWave;
    		if(c!=null){
    			console.log(c.waveLabel);
    			if(c.waveLabel!=null){
					c.waveLabel.destroy();
					c.waveLabel = null;
				}
    		}
    	});
    	
    	
    	statusbarGroup.add(this.waveLabel);
    };
    this.ScheduleWave = function(startTime){
	//Hace que los clientes se activen cada cierto tiempo. En este caso espera un tiempo inicial
	//y luego va spawneando la wave hasta que se acabe. El tiempo de spawneo de cada uno es de el tiempo
	//inicial mas un random, el cual se ve en la funcion relevante.

	this.waveStartTimer = game.time.create(false); //Solo se debe ocupar para el tiempo de partida del wave
	this.waveStartTimer2 = game.time.create(false);

	this.waveStartTimer.add(this.startTime,this.activateOneCustomer,this);
	this.waveStartTimer2.add(this.startTime,this.waveEffect,this);
	this.waveStartTimer.start();
	this.waveStartTimer2.start();
    };
    this.CustomerFinished = function(customer){
	//Recibe el aviso de que el customer salio de la escena, y hace lo apropiado
	//Necesita la referencia al customer que lo llama
	this.totalFinished++;
	if(customer.satisfied){
	    this.totalSatisfied++;
	}	
    };
    this.CheckWaveProgress = function(){
	//Revisa cuanta gente ha pasado de la wave, y entrega el porcentaje de gente que ha pasado, y el porcentaje de
	//gente que ha comido del total
	return {percentageFinished:this.totalFinished*1.0/this.spawnNumber, percentageSatisfied:this.totalSatisfied*1.0/this.spawnNumber};
    };
    this.isFinished = function(){
	//Ve si termino la wave o no
	if(this.totalFinished == this.spawnNumber){
	    return true;
	}
	else{
	    return false;
	}
    }
    this.DestroyLastWave = function(){
	//Hace que lo que queda de wave sea eliminada. Como estan en isoGroup3 me voy a aprovechar que ahi solo hay customers.
	if(isoGroup3 != null){
	    isoGroup3.forEach(function(person){
	    	if(person!=null && person.thinking_baloon != null){
	    		person.thinking_baloon.removeAll(true);
	    	}
		
	    });
	    isoGroup3.removeAll(true);
	}
	isoGroup3 = null;
	WaveEntities = null;
    };
    return this;
};
