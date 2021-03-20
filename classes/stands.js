//Toda cosa que no está en este js está en game.js. Esto incluye carga de assets, que deben ser declaradas en loading,
//y variables de estado que probablemente esten como vars dentro de game.jsx
var radialMenuGroup;
function stand()
{
    //Crea un stand generico. En rigor debería poner todo como this.propiadad_stand y luego devover this pero
    //ain't nobody got time for this
    var stand = 
	{
	    //Aqui count SIEMPRE debe partir al maximo. Si este comportamiento no es deseado hay que cambiar create_stock_sprite entre otros
	    stock: {
		lemonade: {
		    count: 1,
		    icon:'lemonade_icon',
		    price:50
		},
		cake: {
		    count: 1,
		    icon:'cake_icon',
		    price: 50
		},
		icecream: {
		    count: 1,
		     icon: 'icecream_icon',
		     price: 50
		 }
	     }, //Stock tiene el inventario para vender cosas.

	     RECIPES: { //Todas las recetas, con sus ingredientes
		 LEMONADE: {
		     ingredients: ['lemon','lemon','lemon'],
		     result: 'lemonade'
		 },
		 ICECREAM: {
		     ingredients: ['lemon','milk','milk'],
		     result: 'icecream'
		 },
		 CAKE: {
		     ingredients: ['lemon','wheat','wheat'],
		     result: 'cake'
		 },
	     },
	     UPGRADEOPTIONS: { //Opciones para upgradear. Ultimos dos reservados para informacion y eliminacion de stands
		 //Funcion para stand debe tener un parametro para el context (function(context))
		 LEMONADESTAND: {
		     name: 'lemonade_icon',
		     upgrade: null
		 },
		 ICECREAMSTAND: {
		     name: 'icecream_icon',
		     upgrade: null
		 },
		 CAKESTAND: {
		     name: 'cake_icon',
		     upgrade: null
		 },
		 DELETESTAND: {
		     name: 'cross',
		     upgrade: null
		 }


	     },
	     upgradesize: 3.0, //Tiene la cantidad de opciones de upgrade propiamente tal. Idealmente esto se hace en forma automatica pero meh


	     set_upgrade_paths: function()
	     {
		 //Setea las funciones para upgradear de caada opcion de upgrade
		 for(upoption in this.UPGRADEOPTIONS)
		 {
		     this.UPGRADEOPTIONS[upoption].upgrade = this.upgrade;
		 };
		 this.UPGRADEOPTIONS.DELETESTAND.upgrade = this.delete_stand;

	     },
	     create_recipe_description: function(){
		 //Pone las descripciones de las recetas en el toolbar
		 var t = LocalizableStrings.getString("buildings-stand-recipes");

		 this.recipe_header = game.add.text(70, isLandscape ? 40 : 20, t, { font: "bold 14px Arial", fill: "#000000" });
		 stands.recipeToolbarGroup.add(this.recipe_header);

		 var icons= {
		     lemon: 'lemon_icon',
		     milk: 'milk_icon',
		     wheat: 'wheat_icon'
		 };
		 var j = 0;
		 

		 var j = 0;
		 for(recipe in this.RECIPES){
		     var i = 2;

		     this.RECIPES[recipe].description = [];
		     this.RECIPES[recipe].description[0] = new Phaser.Sprite(game,150,25 + 15*j,this.stock[this.RECIPES[recipe].result].icon,0);
		     this.RECIPES[recipe].description[0].scale.set(0.5);
		     this.RECIPES[recipe].description[1] = game.add.text(170,25 + 15*j,"=",{font:"bold 14px Arial", fill: "#000000"});
		     for(ingredient in this.RECIPES[recipe].ingredients){
			 this.RECIPES[recipe].description[i] = new Phaser.Sprite(game,170+20*i,25+ 15*j,icons[this.RECIPES[recipe].ingredients[ingredient]],0);
			 this.RECIPES[recipe].description[i].scale.set(0.5);
			 i++;
		     }
		      for(i = 0; i<this.RECIPES[recipe].description.length;i++){
			  this.RECIPES[recipe].description[i].anchor.setTo(0.5,0.5);
			  stands.recipeToolbarGroup.add(this.RECIPES[recipe].description[i]);
		      }
		     j++;
		 }

	     },
	     delete_stand: function(context)
	     {
		 //Elimina todo el stand, sprite y todo

		 for(recipe in this.RECIPES){
		     var i = 2;
		     this.RECIPES[recipe].description[0].destroy();
		     this.RECIPES[recipe].description[1].destroy();
		     //this.RECIPES[recipe].description[0] = new Phaser.Sprite(game,150,25 + 15*j,this.stock[this.RECIPES[recipe].result].icon,0);
		     //this.RECIPES[recipe].description[0].scale.set(0.5);
		     //this.RECIPES[recipe].description[1] = game.add.text(170,25 + 15*j,"=",{font:"bold 14px Arial", fill: "#000000"});
		     for(ingredient in this.RECIPES[recipe].ingredients){
			 this.RECIPES[recipe].description[i].destroy();
			 i++;
		     }
		      for(i = 0; i<this.RECIPES[recipe].description.length;i++){
		      }
		     j++;
		 }
		 context.stockGroup.destroy(true);
		 if(context.stand_sprite.cook_timer != null){
		     context.stand_sprite.cook_timer.destroy();
		 }
		 buildings.destroy_building(context.stand_sprite.tile_x,context.stand_sprite.tile_y);
		 context.stand_sprite.destroy();

		 

	     },
	     create_stand: function(x_,y_,isoGroup)
	     {
		 return stands.create_generic_stand(x_,y_,isoGroup,'stand',this);
	     },
	     create_stock_sprite: function(sellable,x,y){
		 //Crea un unico sprite de stock
		 var sellableSprite = game.add.isoSprite(x,y, 55,this.stock[sellable].icon, 0, isoGroup2);
		 sellableSprite.anchor.setTo(0.5,0.64,0.0);
		 sellableSprite.scale.set(35/sellableSprite.width);
		 sellableSprite.alpha = 0.3;
		 sellableSprite.sellable_type = sellable;
		 this.create_stock_tween(sellableSprite);
		 this.stockGroup.add(sellableSprite);
	     },
	     replace_stock_sprite: function(stockSprite){
		 //Reemplaza un sprite dado por uno nuevo
	     },
	     create_stock_sprites: function()
	     {
		 //Crea los sprites que muestran el stock encima de los stands. Tambien hace que parpadeen cuando no hay stock
		 this.stockGroup = game.add.group(this.stand_sprite);
		 var x = this.stand_sprite.tile_x;
		 var y = this.stand_sprite.tile_y;
		 var i = 0;
		 for(sellable in this.stock)
		 {
		     //Crea los sprites de stock de tal forma que si el stand necesita tener mas de un mismo tipo estos aparezcan
		     //bien
		     for(j = 0; j < this.stock[sellable].count; j++){
			 this.create_stock_sprite(sellable,0,i*20 - 10);
			 i++;
		     }
		 }
	     },
	     create_stock_tween: function(sellableSprite)
	     {
		 //Crea los tweens para cada stock
		 sellableSprite.alpha = 1;
		 sellableSprite.tint = 0xffffff;
		 sellableSprite.cooking = false;
		 sellableSprite.cooked = true;
		 //sellableSprite.tween = game.add.tween(sellableSprite);
		 //sellableSprite.tween.to({alpha:0.3},1*Phaser.Timer.SECOND,Phaser.Easing.Linear.None, false, 0, Number.MAX_VALUE , true);
		 //sellableSprite.tween.start();

	     },
	    finished_cooking: function(){
		//Cambia de estado de un stock a listo.
		//Asume que estaba siendo cocinado antes, por lo que tiene un pieprogress asociado.
		this.stockGroup.forEach(function(stockSprite){
		     if(stockSprite == null){
			 return;
		     }
		     if(stockSprite.constructor == PieProgress){
			 //Evita a los pieProgress que estan en el grupo
			 return;
		     }
		     if(stockSprite.cooking){
			 //stockSprite.tween.stop();
			  this.context.create_stock_tween(stockSprite);
			 stockSprite.alpha = 1.0;
			 stockSprite.tint = 0xffffff;
			 stockSprite.cooking = false;
			 stockSprite.cooked = true;
			 if(stockSprite.pie){
			     this.context.stockGroup.remove(stockSprite.pie);
			     stockSprite.pie.destroy();
			     stockSprite.pie = null;
			 }
			 
			 console.log("Returning to normal");
		     }
		},{context:this});
		 currentCount = {};
		
	    },
	    remove_stock: function(sellableType,quantity){
		//Cambia de estado de un stock a acabado
		var currentCount = 0;
		this.stockGroup.forEach(function(stockSprite,sellableType,quantity){
		     if(stockSprite == null){
			 return;
		     }
		     if(stockSprite.constructor == PieProgress){
			 //Evita a los pieProgress que estan en el grupo
			 return;
		     }
		    if(stockSprite.cooked == true && stockSprite.sellable_type == sellableType && this.currentcount < quantity){
			stockSprite.alpha = 0.3;
			 if(stockSprite.pie){
				 this.context.stockGroup.remove(stockSprite.pie);
				 stockSprite.pie.destroy();
				 stockSprite.pie = null;
			 }
			 stockSprite.cooking = false;
			 stockSprite.cooked = false;
			this.currentcount += 1;
		     }
		},{context:this,currentcount: currentCount},false,sellableType,quantity);
		 
	    },
	     check_stock: function()
	     {
		 //Ve si es que hay stock, y luego evita que parpadee si es que hay
		 var currentStock = this.stock;
		 var currentCount = {};
		 console.log("check_stock;cooking:"+ this.stand_sprite.cooking);
		 this.stockGroup.forEach(function(stockSprite){
		     if(stockSprite == null){
			 return;
		     }
		     if(stockSprite.constructor == PieProgress){
			 //Evita a los pieProgress que estan en el grupo
			 return;
		     }
		     //Es necesario tener la cuenta de cuantos sprites de un mismo tipo hay
		     if(this.currentcount[stockSprite.sellable_type] == null){
			 this.currentcount[stockSprite.sellable_type]= 0;
		     }
		     else{
			 this.currentcount[stockSprite.sellable_type] += 1;
		     }
		     
		     if(stockSprite.cooking){
			 stockSprite.tint = 0xff0000;
			 if(!stockSprite.pie){
			     stockSprite.pie = new PieProgress(game,stockSprite.x,stockSprite.y,8);
			     this.context.stockGroup.add(stockSprite.pie);
			     stockSprite.pie.alpha = 0.8;
			     stockSprite.pie.tween = game.add.tween(stockSprite.pie);
			     stockSprite.pie.tween.to({progress: 0,alpha: 1.0},5*Phaser.Timer.SECOND , Phaser.Easing.Linear.None, true, 0, 0, false);
			 }
		     }
		     else if(!stockSprite.pie.isRunning){
			 //stockSprite.tween.stop();
			 stockSprite.alpha = 1.0;
			 stockSprite.tint = 0xffffff;
			 stockSprite.cooking = false;
			 if(stockSprite.pie){
			     this.context.stockGroup.remove(stockSprite.pie);
			     stockSprite.pie.destroy();
			     stockSprite.pie = null;
			 }
			 
			 console.log("Returning to normal");
		     }
		     else if(this.context.stock[stockSprite.sellable_type].count < this.currentcount[stockSprite.sellable_type]){
			 this.context.create_stock_tween(stockSprite);
			 if(stockSprite.pie){
				 this.context.stockGroup.remove(stockSprite.pie);
				 stockSprite.pie.destroy();
				 stockSprite.pie = null;
			 }
		     }

		 },{context:this,currentcount:currentCount});
		 currentCount = {};
	     },
	     prepare_stock: function(stockName,isDone)
	     {
		 //Cambia el tint de un item de stock para denotar que esta siendo cocinado
		 //Solo deja listo un stock de un mismo tipo a la vez
		  var currentStock = this.stock;
		 var currentCount = {};
		 if(isDone == null){
		     isDone = false;
		 }
		 var alreadyCooking = false;
		 this.stockGroup.forEach(function(stockSprite,currentcount,isDone){
		     if(!stockSprite){
			     return;
			 }
		     if(stockSprite.sellable_type === stockName && !isDone){
			 if(stockSprite.cooked == false){
			     if(!stockSprite.cooking && !this.alreadycooking){
				 stockSprite.tint = 0xff0000;
				 if(!stockSprite.pie){
				     stockSprite.pie = new PieProgress(game,stockSprite.x,stockSprite.y,8);
				     this.context.stockGroup.add(stockSprite.pie);
				     stockSprite.pie.alpha = 0.8;
				     stockSprite.pie.tween = game.add.tween(stockSprite.pie);
				     stockSprite.pie.tween.to({progress: 0,alpha: 1.0},5*Phaser.Timer.SECOND , Phaser.Easing.Linear.None, true, 0, 0, false);
				 }
				 this.alreadycooking = true;
				 this.context.cooking = false;
				 stockSprite.cooking = true;
				 return;
			     }
			 }
		     }
		     
		 },{context:this,alreadycooking:alreadyCooking},false,currentCount,isDone,alreadyCooking);
		 
	     },
	     create_upgrade_options: function()
	     {
		 //Crea las opciones de upgrade, incluyendo las de eliminar y las de mostrar info
		 //Va rellenando desde la posicion izquierda en el sentido de las manecillas del reloj

		 var deltaAngle = (Math.PI)/this.upgradesize;	
		 var radius = 40; 
		 var angle = 1.15*Math.PI;
		 for(upoptions in this.UPGRADEOPTIONS)
		 {

		     var name = this.UPGRADEOPTIONS[upoptions].name;
		     if(upoptions === "DELETESTAND")
		     {
			 //Caso especial para el boton eliminar. Reserva espacio abajo y da un tinte distinto
			 var optionSprite = new Phaser.Sprite(game,0,radius-10,name,0);
			 optionSprite.anchor.setTo(0.5,0.5);
			 optionSprite.scale.setTo(1.2);
			 optionSprite.inputEnabled = true;
			 optionSprite.input.priorityID = 2;
			 optionSprite.events.onInputOver.add(function()
							     {
								 var tween = game.add.tween(this.sprite);
								 tween.to({tint:0xff0000},100);
								 tween.start();
								 //Hay que avisar sobre que hay que upgradear
								 this.context.toUpgrade = true;
								 this.context.upgradeTo = this.spname;

							     },{context:this,sprite:optionSprite,spname:upoptions});
			 optionSprite.events.onInputOut.add(function()
							    {
								var tween = game.add.tween(this.sprite);
								tween.to({tint:0xffffff},100);
								tween.start();
								this.context.toUpgrade = false;
								this.context.upgradeTo = null;

							    },{context:this,sprite:optionSprite,spname:upoptions});
			 optionSprite.events.onInputDown.add(this.upgrade_or_hide,this);
			 radialMenuGroup.add(optionSprite);
			 angle += deltaAngle;
		     }
		     else
		     {
			 var optionSprite = new Phaser.Sprite(game,radius*Math.cos(angle),radius*Math.sin(angle)-10,name,0);
			 optionSprite.anchor.setTo(0.5,0.5);
			 optionSprite.scale.setTo(50/optionSprite.width);
			 optionSprite.inputEnabled = true;
			 optionSprite.input.priorityID = 2;
			 optionSprite.events.onInputOver.add(function()
							     {
								 var tween = game.add.tween(this.sprite);
								 tween.to({tint:0x00ff00},100);
								 tween.start();
								 //Hay que avisar sobre que hay que upgradear
								 this.context.toUpgrade = true;
								 this.context.upgradeTo = this.spname;

							     },{context:this,sprite:optionSprite,spname:upoptions});
			 optionSprite.events.onInputOut.add(function()
							    {
								var tween = game.add.tween(this.sprite);
								tween.to({tint:0xffffff},100);
								tween.start();
								this.context.toUpgrade = false;
								this.context.upgradeTo = null;

							    },{context:this,sprite:optionSprite,spname:upoptions});
			 optionSprite.events.onInputDown.add(this.upgrade_or_hide,this);
			 radialMenuGroup.add(optionSprite);
			 angle += deltaAngle;
		     }	
		 }
	     },
	     show_radial_menu: function()
	     {
		 //Crea el menu radial con las opciones genericas

		 stands.hide_all_menus();    
		 BuildingPickerGroup_hidePicker();
		 dragging_tile_selected = true;
		 var x = this.stand_sprite.x *game_scale;
		 var y = this.stand_sprite.y *game_scale;
		 radialMenuGroup.x = x;
		 radialMenuGroup.y = y;
		 radialMenuGroup.scale.set(game_scale);
		 var radialBackground = new Phaser.Sprite(game,0,0,'upgrade_picker', 0);
		 radialBackground.anchor.setTo(0.5,0.5);
		 radialBackground.scale.setTo(1.5);
		 radialBackground.inputEnabled = true;
		 radialBackground.input.priorityID = 2;
		 radialMenuGroup.add(radialBackground);
		 this.create_upgrade_options();

		 game.world.bringToTop(radialMenuGroup);
		 console.log("radial_menu");
		 game.input.reset(true);

	     },
	     upgrade_or_hide: function()
	     {
		 //Ve si tiene que upgradear al soltar el boton o simplemente esconder todo
		 stands.hide_all_menus();
		 if(this.toUpgrade)
		 {
		     console.log("upgrading");
		     this.confirm_upgrade_menu();
		 }

		 dragging_tile_selected = false;
	     },
	     confirm_upgrade_menu: function()
	     {
	     	button_click.play();
		 //Crea un menu de confirmación de upgrade
		 BuildingPickerGroup_hidePicker();
		 dragging_tile_selected = true;
		 var x = this.stand_sprite.x *game_scale;
		 var y = this.stand_sprite.y *game_scale;
		 radialMenuGroup.x = x;
		 radialMenuGroup.y = y;
		 var radialBackground = new Phaser.Sprite(game,0,0,'upgrade_picker', 0);
		 radialBackground.anchor.setTo(0.5,0.5);
		 radialBackground.scale.setTo(1.2);   
		 radialBackground.inputEnabled = true;
		 radialBackground.input.priorityID = 2;
		 radialMenuGroup.add(radialBackground);

		 this.confirm_upgrade_options();
		 game.world.bringToTop(radialMenuGroup);
	     },
	     confirm_upgrade_options: function()
	     {
		 //Muestra una imagen al centro y muestra 2 opciones
		 var optionSprite = new Phaser.Sprite(game,0,-30,this.UPGRADEOPTIONS[this.upgradeTo].name,0);
		 optionSprite.anchor.setTo(0.5,0.5);
		 optionSprite.scale.setTo(1);
		 radialMenuGroup.add(optionSprite);

		 var upgradeButton = new Phaser.Sprite(game,30,15,'check',0);
		 upgradeButton.anchor.setTo(0.5,0.5);
		 upgradeButton.scale.setTo(1.2);
		 upgradeButton.inputEnabled = true;
		 upgradeButton.input.priorityID = 2;
		 upgradeButton.events.onInputDown.add(function(){
		 	 button_click.play();
		 	 up_short.play();
		     this.UPGRADEOPTIONS[this.upgradeTo].upgrade(this);
		     this.hide_radial_menu();
		 },this);

		 upgradeButton.events.onInputOver.add(function(){
		     var tween = game.add.tween(this.sprite);
		     tween.to({tint:0x00ff00},100);
		     tween.start();
		 },{context:this,sprite:upgradeButton});

		 upgradeButton.events.onInputOut.add(function() {
		     var tween = game.add.tween(this.sprite);
		     tween.to({tint:0xffffff},100);
		     tween.start();
		 },{context:this,sprite:upgradeButton});

		 radialMenuGroup.add(upgradeButton);
		 var cancelButton =  new Phaser.Sprite(game,-30,15,'cross',0);
		 cancelButton.anchor.setTo(0.5,0.5);
		 cancelButton.scale.setTo(1.2);
		 cancelButton.inputEnabled = true;
		 cancelButton.input.priorityID = 2;
		 cancelButton.events.onInputDown.add(function(){
		 	 button_click.play();
		     this.hide_radial_menu();
		 },this);

		 cancelButton.events.onInputOver.add(function(){
		     var tween = game.add.tween(this.sprite);
		     tween.to({tint:0xff0000},100);
		     tween.start();
		 },{context:this,sprite:cancelButton});

		 cancelButton.events.onInputOut.add(function() {
		     var tween = game.add.tween(this.sprite);
		     tween.to({tint:0xffffff},100);
		     tween.start();
		 },{context:this,sprite:cancelButton});

		 radialMenuGroup.add(cancelButton);

	     },
	     upgrade: function(context)
	     {

	     context.delete_stand(context);
		 if(context.upgradeTo == "CAKESTAND")
		 {

		     var newstand = stands.create_cakestand;
		 }
		 else if(context.upgradeTo == "LEMONADESTAND"){
		     var newstand = stands.create_lemonadestand;
		 }
		 else if(context.upgradeTo == "ICECREAMSTAND"){
		     var newstand = stands.create_icecreamstand;
		 }
		 
		 buildings.upgrade_stand(context.stand_sprite.tile_x,context.stand_sprite.tile_y,isoGroup2,newstand);
	     },
	     hide_radial_menu: function()
	     {
		 //Esconde el menu. Para esto trata de destruir cada elemento de el
		 radialMenuGroup.destroy(true,true);
		 this.showingMenu = false;
		 dragging_tile_selected = false;
	     },
	     keep_menu_onTop: function()
	     {
		 if(stands.radialMenuGroup)
		 {
		     game.world.bringToTop(radialMenuGroup);
		 }
	     },
	     set_max_stock: function(){
		 //Hace que el stock maximo de cada tipo de producto sea el mismo que el inicial
		 for(sellable in this.stock){
		     this.stock[sellable].max = this.stock[sellable].count;
		 }
	     },
	     cook_resources: function()
	     {
		 console.log("cooking:"+this.cooking);
		 //Genera los recursos a partir de las recetas,  viendo si 
		 //se puede hacer la receta y guardando el resultado en el stand
		 //mismo solo si se puede hacer.
		 for(recipe in this.RECIPES)
		 {
		     var ingredients = {};
		     var readyToCook = false;
		     if(this.stand_sprite.cooking || this.stock[this.RECIPES[recipe].result].count >= this.stock[this.RECIPES[recipe].result].max){
			 //No hace nada si ya hay reservas

		     }
		     else for(i = 0; i< this.RECIPES[recipe].ingredients.length; i++)
		     {
			 readyToCook = true;
			 var ingredient = this.RECIPES[recipe].ingredients[i];
			 if(ingredients[ingredient] == null)
			 {
			     ingredients[ingredient] = 0;
			 }
			 if(resources[ingredient] - ingredients[ingredient] > 0)
			 {
			     //Queremos ver si es que necesita mas de 1 de un recurso que lo tome
			     //en cuenta antes de ver si puede hacer la receta o no
			     ingredients[ingredient] += 1;
			 }
			 else
			 {
			     readyToCook = false;
			     break;
			 }
		     }
		     if(readyToCook && !this.stand_sprite.cooking)
		     {
			 var stock = this.stock[this.RECIPES[recipe].result].count;
			 if(!this.stand_sprite.cooking && (stock == null ||stock < this.stock[this.RECIPES[recipe].result].max ))
			 {
			     this.stand_sprite.cooking = true;
			     this.prepare_stock(this.RECIPES[recipe].result);
			     //this.stand_sprite.cook_timer = game.time.create(true);
			     game.time.events.add(5*Phaser.Timer.SECOND,function(){
				 var recipe = this.currentRecipe;
				 this.context.prepare_stock(this.context.RECIPES[recipe].result,true);
				 this.context.stock[this.context.RECIPES[recipe].result].count += 1;
				 this.context.stock[this.context.RECIPES[recipe].result].count = Phaser.Math.clamp(this.context.stock[this.context.RECIPES[recipe].result].count,0,this.context.stock[this.context.RECIPES[recipe].result].max);	
				 console.log("count:" + this.context.stock[this.context.RECIPES[recipe].result].count);
				 this.context.finished_cooking();
				 this.context.stand_sprite.cooking = false;
			     },{context:this,currentRecipe:recipe});
			     //this.stand_sprite.cook_timer.start();

			     for(ingredient in ingredients)
			     {
				 resources[ingredient]-= ingredients[ingredient];
			     }

			 }
		     }
		 }


	     },
	     sell_food: function(recipeToLook, context)
	     {
		 //Vende la comida del stand. Probablemente haya que pedir un context en caso
		 //que this pase a ser cualquier otra cosa que no sea stand()
		 //recipeToLook es un string con el nombre de la receta
		 //Retorna si encontro comida y compro comida o no
		 if(context == null){
		     //Asumiendo que siempre se accede desde un tile, este es para dar
		     //el context de stand desde el tile
		     context = this.stand_context; 
		 }
		 if(recipeToLook == 'everything'){
		     //En el caso que se no se tenga preferencia por nada
		     //hace que seleccione una receta de aquellas que tienen stock
		     //Si no encuentra nada deberia devolver false
		     var count = 0;
		     var possibleRecipes = [];
		     for(currentRecipe in context.stock){
			 count = context.stock[currentRecipe].count;
			 if(count > 0){
			     possibleRecipes.push({recipe:currentRecipe, currentCount:count});
			 }
		     }
		     if(possibleRecipes.length > 0){
			 var selectedRecipe = Phaser.Math.getRandom(possibleRecipes,0, possibleRecipes.length); //Cambiar a .ArrayUtils.getRandomItem en nueva version
			 if(selectedRecipe != null){
			     recipeToLook = selectedRecipe.recipe;
			     count = selectedRecipe.currentCount;
			 }
			 else{
			     return false;
			 }
		     }
		     else{
			 return false;
		     }
		 }
		 //Si stand nisiquiera vende lo que se busca ni intenta continuar
		 else if(context.stock[recipeToLook] != null){
		     var count = context.stock[recipeToLook].count;
		 }
		 else{
		     return false;
		 }
		 var boughtFood = false;
		 if(count >= 1){
		     context.stock[recipeToLook].count -= 1;
		     resources.money += context.stock[recipeToLook].price;
		     currentStatsManager.totalRecollectedMoney += context.stock[recipeToLook].price;
		     boughtFood = true;
		 }
		 if(context.stock[recipeToLook].count < 0){
		     context.stock[recipeToLook].count = 0;
		 }
		 context.remove_stock(recipeToLook,1);
		 console.log("boughtFood:" + boughtFood);
		 return boughtFood;
	     }
	};
    return stand;
};
 var stands =  {
     //Cosas relacionadas con stands que son compartidas por todos
    init_group: function()
    {
	radialMenuGroup = game.add.group();
	this.recipeToolbarGroup = game.add.group(toolbarGroup);
	this.recipeToolbarGroup.y = isLandscape ? 0 : 20;
	this.recipeToolbarGroup.fixedToCamera = true;

    },
    destroy_descriptions: function(){
	//Destruye todas las descripciones
	this.recipeToolbarGroup.removeAll(true);
    },
    create_generic_stand: function(x_,y_,isoGroup,spriteName,context){
	//Crea un stand generico
	var stand = game.add.isoSprite(Math.floor(x_)*50, Math.floor(y_)*50 , 0,'stand', 0, isoGroup2);
	stand.name = 'stand';
	stand.building_type = 'stand';
	stand.anchor.setTo(0.5,0.64,0.0);
	stand.scale.set(1.0);
	stand.tile_x = x_;
	stand.tile_y = y_;
	game.time.events.loop(Phaser.Timer.SECOND*1,context.cook_resources,context);
	stand.inputEnabled = true;
	//Tecnicamente a estas funciones no se puede acceder desde los tiles, por eso la pongo como atributo del sprite
	stand.sell_food = context.sell_food; 
	stand.stand_context = context; //En caso de necesitar las funciones de stand teniendo solo el tile
	context.stand_sprite = stand;
	context.set_upgrade_paths();
	context.set_max_stock(); 
	context.create_stock_sprites();
	stand.cooking = false;
	return stand;
    },
    hide_all_menus: function(){
	//Al "destruir" el grupo se destruye el menu independiente del stand
	//este destroy no elimina el grupo en si sino que solo destruye los sprites dentro de el.
	this.recipeToolbarGroup.removeAll(true);
	radialMenuGroup.destroy(true,true);
	dragging_tile_selected = false;
    },
    create_cakestand: function()
    {
	//Crea un cakestand partiendo del stand generico
	var newstand = stand();
	newstand.UPGRADEOPTIONS = {
	    DELETESTAND: newstand.UPGRADEOPTIONS['DELETESTAND']
	};
	newstand.RECIPES = {
	    CAKE: newstand.RECIPES.CAKE
	};
	newstand.stock = {
	    cake: newstand.stock.cake
	};
	newstand.stock.cake.count = 3;
	newstand.create_stand = function(x_,y_,isoGroup)
	{
	    //Crea stands con el comportamiento de stand (robar recursos, cocinar, etc)
	    stands.create_generic_stand(x_,y_,isoGroup,'stand',this);
	    this.stand_sprite.name = 'cakestand';
	};
	
	   
	
	return newstand;
    },
     create_lemonadestand: function(){
	 var newstand = stand();
	newstand.UPGRADEOPTIONS = {
	    DELETESTAND: newstand.UPGRADEOPTIONS['DELETESTAND']
	};
	newstand.RECIPES = {
	    LEMONADE: newstand.RECIPES.LEMONADE
	};
	newstand.stock = {
	    lemonade: newstand.stock.lemonade
	};
	newstand.stock.lemonade.count = 3;
	newstand.create_stand = function(x_,y_,isoGroup)
	{
	    //Crea stands con el comportamiento de stand (robar recursos, cocinar, etc)
	    stands.create_generic_stand(x_,y_,isoGroup,'stand',this);
	    this.stand_sprite.name = 'lemonadestand';
	};
	 return newstand;
     },
     create_icecreamstand: function(){
	 var newstand = stand();
	newstand.UPGRADEOPTIONS = {
	    DELETESTAND: newstand.UPGRADEOPTIONS['DELETESTAND']
	};
	newstand.RECIPES = {
	    ICECREAM: newstand.RECIPES.ICECREAM
	};
	newstand.stock = {
	    icecream: newstand.stock.icecream
	};
	newstand.stock.icecream.count = 3;
	newstand.create_stand = function(x_,y_,isoGroup)
	{
	    //Crea stands con el comportamiento de stand (robar recursos, cocinar, etc)
	    stands.create_generic_stand(x_,y_,isoGroup,'stand',this);
	    this.stand_sprite.name = 'icecreamstand';
	};
	 return newstand;
     }
}
