var isoGroup3; // personas.. etc
function Customer(thisWave,customerOptions){
    this.wave = thisWave;
    //Crea un nuevo customer
    if(isoGroup3 == null){
    isoGroup3 = game.add.group();
    };
     console.log(game.cache.getJSON('customerTypeData'));
    if(customerOptions == null){
	//Opciones por defecto para un Customer. Sirve para probar que no me heche nada
	customerOptions = {};
	customerOptions.spriteName = 'customer';
	customerOptions.baseSpeed = 1.4;
	//Que cosas puede pensar en comprar un Customer. Tiene que tener el mismo nombre tanto para el icono como para el recipe
	customerOptions.PREFERENCES = ['lemonade','icecream','cake'];
	customerOptions.baseDamage = 20;
	customerOptions.baseHeal = 2;
    }
    else {
	//En el json PREFERENCES viene como string
	var preferences = customerOptions.PREFERENCES.split(",");
    }
    this.sprite = game.add.isoSprite(17.75*50, 7*50, 0,customerOptions.spriteName, 0);
    this.sprite.baseSpeed = customerOptions.baseSpeed;
    this.sprite.anchor.set(0.5,0.64,0.0);
    this.sprite.scale.set(0.8);
    this.sprite.CustomerContext = this; //Para acceder a los metodos desde el tile
    this.sprite.kill();
    this.sprite.satisfied = false;
    this.sprite.preference = Math.floor((Math.random() * 3));
    this.sprite.baseDamage = customerOptions.baseDamage;
    this.sprite.baseHeal = customerOptions.baseHeal;
    this.sprite.timesToEat = customerOptions.timesToEat;
    if(preferences){
	//En ambos casos tiene que asignar un arreglo
	this.PREFERENCES = preferences
    }
    else{
	this.PREFERENCES = customerOptions.PREFERENCES;
    }
    this.startCustomer = function(){
	//Hace que el customer empieze a andar
	this.sprite.revive();
	isoGroup3.add(this.sprite);
    };
    this.sprite.delete_self = function(){
	this.thinking_baloon.removeAll(true);
	this.finished_run = true;
	this.kill();
    };
    return this.sprite;
}
//Metodos "estaticos"
Customer.customerMovement = function(customer)
{
    //Hace que un customer se mueva

    //console.log(customer.isoX + "---" + customer.isoY);
    customer.speed = customer.baseSpeed * currentWave.difficultyLevel * 60/Phaser.Math.clamp(game.time.fps,50,60);
    var tile = tile_isos[Math.floor((customer.isoY+10) / 50.0)][Math.floor(customer.isoX / 50.0)+1];
    if(tile != null){
        if(customer.waiting_time != null && customer.waiting_time >0){
	    customer.waiting_time = customer.waiting_time - 1 > 0 ? customer.waiting_time - 1 : 0;
        }
        else{
	    if(customer.exclamation_mark != null){
                customer.exclamation_mark.alpha = 0.0;
	    }
	    if(customer.thinking_baloon != null){
                customer.thinking_baloon.alpha = 1.0;
	    }
	    if(tile.tile_index == 1){
                // cruce
                customer.isoX += customer.speed;
                customer.scale.setTo(-0.8,0.8);
	    }
	    if(tile.tile_index == 11){
                // camino diagonal "/"
                customer.scale.setTo(0.8,0.8);
                customer.isoY += customer.speed;
	    }
	    if(tile.tile_index == 21){
                // camino diagonal "\"
                customer.scale.setTo(-0.8,0.8);
                customer.isoX += customer.speed;
	    }
	    if(tile.tile_index == 81){
		
	    };
	}
    }
    else{
	//Elimina a este customer y ajusta el progreso
	customer.delete_self();
	customer.CustomerContext.wave.CustomerFinished(customer);
	var currentProgress = currentWave.CheckWaveProgress();
    if(!customer.satisfied){
        unhappy.play();
        // Daño
        var damage = customer.baseDamage * currentWave.difficultyLevel;
        health = health -damage;
        health = Phaser.Math.clamp(health,-20,100);
        happinessBar.setProgress(health/100.0);
        // Sad Face
        var sadMark = new Phaser.Sprite(game,customer.position.x*game_scale,(customer.position.y-39)*game_scale,'sad_icon', 0);
        sadMark.anchor.set(0.5,0.5);
                        sadMark.scale.setTo(0.5);
                        game.world.add(sadMark);
        sadMark.tint = 0xFF0000;
        var sadMarkTween = game.add.tween(sadMark);
        sadMarkTween.to({y: sadMark.y - 10,alpha: 0.0},1*Phaser.Timer.SECOND , Phaser.Easing.Linear.None, true, 0, 0, false);
        sadMarkTween.onComplete.add(function(sprite){
        sprite.destroy();
        sprite = null;
        },this,0,sadMark);
    }
    else{

        happy_2.play();
        // Regeneracion
        var heal = customer.baseHeal * currentWave.difficultyLevel;
        health = health +heal;
        health = Phaser.Math.clamp(health,-20,100);
        happinessBar.setProgress(health/100.0);

        var smileMark = new Phaser.Sprite(game,customer.position.x*game_scale,(customer.position.y-39)*game_scale,'smile_icon', 0);
        smileMark.tint = 0x00FF00;
        smileMark.anchor.set(0.5,0.5);
                        smileMark.scale.setTo(0.5);
                        game.world.add(smileMark);
        var smileMarkTween = game.add.tween(smileMark);
        smileMarkTween.to({y: smileMark.y - 10,alpha: 0.0},1*Phaser.Timer.SECOND , Phaser.Easing.Linear.None, true, 0, 0, false);
        smileMarkTween.onComplete.add(function(sprite){
        sprite.destroy();
        sprite = null;
        },this,0,smileMark);

        currentStatsManager.customersUnhappy++;
    }
	//happinessBar.setProgress(currentProgress.percentageSatisfied/currentProgress.percentageFinished);
    }

    
}
Customer.customer_behavior = function(){
    
    // behaviour de un customer...
        isoGroup3.forEachAlive(function (person) {
	    Customer.customerMovement(person);
        // Comportamiendo de thinking balloon

        if(person.thinking_baloon == null){
	    // crear new thinking_baloon
	    person.thinking_baloon = game.add.group();
	     person.thinking_baloon.scale.set(game_scale);
            person.thinking_baloon.x = person.position.x*game_scale;
            person.thinking_baloon.y = (person.position.y -26)*game_scale;
	    var thinking_baloon = 
                    new Phaser.Sprite(game,0,0,'thinking_baloon', 0);
	    thinking_baloon.anchor.set(0.05,0.95);
	    thinking_baloon.scale.setTo(0.9);
	    person.thinking_baloon.add(thinking_baloon);

	    if(person.thought == null)
                person.thought = person.CustomerContext.PREFERENCES[person.preference];

	    var thought = 
                    new Phaser.Sprite(game,25,-22,person.thought+'_icon',0);
	    thought.anchor.setTo(0.5);
	    if(thought.height!=25)thought.scale.setTo(30/thought.height);
	    person.thinking_baloon.add(thought);
        }
        else{

	    person.thinking_baloon.x = person.position.x*game_scale;
            person.thinking_baloon.y = (person.position.y -26)*game_scale;
	    //person.thinking_baloon.position.setTo(person.position.x,person.position.y-26);
	    if(person.thinking_baloon.position.x > game.camera.width / 2){
                person.thinking_baloon.scale.setTo(-0.7,0.7);
	    }
	    else{
                person.thinking_baloon.scale.setTo(0.7,0.7);
	    }
	    if(person.satisfied == null || !person.satisfied ){
                if(person.thought == 'none'){
		    person.satisfied = true;
		    person.thinking_baloon.alpha = 0.0;

                }
	    }
	    else if(person.satisfied){
		person.thinking_baloon.alpha = 0.0;
	    }
        }

        // comportamiento de hay un stand por aqui (??)
        // esquema:
        //                 1  2  3
        //                 4  O  5
        //                 6  7  8
        //     (O - persona)

        if(person!=null && tile_buildings!= null){

	    var tiles_ = new Array();
	    if(tile_buildings[Math.floor((person.isoY+10) / 50.0)-1]!=null){
                tiles_[1] = tile_buildings[Math.floor((person.isoY+10) / 50.0)-1][Math.floor(person.isoX / 50.0)];
                tiles_[2] = tile_buildings[Math.floor((person.isoY+10) / 50.0)-1][Math.floor(person.isoX / 50.0)+1];
                tiles_[3] = tile_buildings[Math.floor((person.isoY+10) / 50.0)-1][Math.floor(person.isoX / 50.0)+2];
	    }
	    if(tile_buildings[Math.floor((person.isoY+10) / 50.0)]!=null){
		tiles_[4] = tile_buildings[Math.floor((person.isoY+10) / 50.0)][Math.floor(person.isoX / 50.0)];
		tiles_[5] = tile_buildings[Math.floor((person.isoY+10) / 50.0)][Math.floor(person.isoX / 50.0)+1];
	    }
	    if(tile_buildings[Math.floor((person.isoY+10) / 50.0)+1]!=null){
		tiles_[6] = tile_buildings[Math.floor((person.isoY+10) / 50.0)+1][Math.floor(person.isoX / 50.0)];
		tiles_[7] = tile_buildings[Math.floor((person.isoY+10) / 50.0)+1][Math.floor(person.isoX / 50.0)+1];
		tiles_[8] = tile_buildings[Math.floor((person.isoY+10) / 50.0)+1][Math.floor(person.isoX / 50.0)+2];
	    }
	    var tile_O = tile_buildings[Math.floor((person.isoY+10) / 50.0)][Math.floor(person.isoX / 50.0)+1];

	    for(var x=1;x<9;x++){
                if(tiles_[x] != null){
		    //console.log(tiles_[x]);
		    if(tiles_[x].building_type == 'stand'){
                        var coord_x = tiles_[x].tile_x;
                        var coord_y = tiles_[x].tile_y;

                        if(person.visited_stands == null){
			    person.visited_stands = new Array();
                        }
                        if(person.visited_stands[coord_y] == null){
                             person.visited_stands[coord_y] = new Array();
			 }
                        //console.log(tiles_[x]);
                        if(!person.visited_stands[coord_y][coord_x] && !person.satisfied){
			    person.visited_stands[coord_y][coord_x] = true;
			    if(person.exclamation_mark == null){
                                person.exclamation_mark = 
				    new Phaser.Sprite(game,person.position.x*game_scale,(person.position.y-39)*game_scale,'exclamation', 0);
                                person.exclamation_mark.anchor.set(0.5,0.5);
                                person.exclamation_mark.scale.setTo(0.9);
                                game.world.add(person.exclamation_mark);
			    }
			    else{
                                person.exclamation_mark.position.setTo(person.position.x*game_scale,(person.position.y-39)*game_scale);
                                person.exclamation_mark.alpha = 1.0;
			    }
			    if(person.satisfied == null || person.satisfied == false){
				//Busca comida hasta que la encuentra, luego continua feliz
				var hasEaten = tile_buildings[coord_y][coord_x].sell_food(person.thought); 
				while(!person.satisfied && hasEaten){
				//Come en un stand hasta que esta satisfecho o no puede comer mas
				    if(hasEaten){
					if(person.timesEaten != null){
					    person.timesEaten++;
					}
					else{
					    person.timesEaten = 1;
					}
					var payMark = new Phaser.Sprite(game,person.position.x*game_scale,(person.position.y-39)*game_scale,'money_icon', 0);
					payMark.anchor.set(0.5,0.5);
					payMark.scale.setTo(0.9);
					game.world.add(payMark);
					var payMarkTween = game.add.tween(payMark);
					payMarkTween.to({y: payMark.y - 10,alpha: 0.0},1*Phaser.Timer.SECOND , Phaser.Easing.Linear.None, true, 0, 0, false);
					payMarkTween.onComplete.add(function(sprite){
					    sprite.destroy();
					    sprite = null;
					},this,0,payMark);
					coin_get.play('',0.7);
				    }
				    person.satisfied = person.timesEaten >= person.timesToEat ? true:false; 
				    if(person.satisfied){
					
					person.waiting_time = 10; //Hace que se vaya CASI apenas compre
					currentStatsManager.customersHappy++;
				    }
				    else{
					hasEaten = tile_buildings[coord_y][coord_x].sell_food(person.thought); 
				    }
				}
			    }
			    if(person.thinking_baloon != null){
                                person.thinking_baloon.alpha = 0.0;
			    }
			    if(!person.satisfied){
				person.waiting_time = 100;
			    }
                        }
                        
		    }
                }
	    }
        }
    });
};

Customer.LoadCustomerSpritesInCache = function(){
    //Carga las imagenes en el cache, para ser usado en el preload
    //Asume que estan en png
    var customerTypes = game.cache.getJSON("customerTypeData");
    if(customerTypes){
	for(customertype in customerTypes){
	    var spriteName = customerTypes[customertype].spriteName; 
	    game.load.image(spriteName, "assets/sprites/" + spriteName+'.png');
	}
    }
    else{
	console.log("No se han cargado los datos de customer")
    }
}
