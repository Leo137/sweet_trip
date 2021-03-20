var cursors;
var player;
var map;
var backgroundlayer;
var layer;
var scroll; 
var shootButton;
var cooldown = 0;
var bullets;
var bullet;
var first = true;
var arrows;
var label1;
var label2;
var label3;
var buttonCreateWheat;
var tilemapCache;

var key_counter = 0;

var pointer;

var background;
var keyboard;
var keyboard_z;
var fx;
var time = 0;
var label4;
var timeds = 0;

var isoGroup; // tiles
var isoGroup2; // construcciones
var isoDraggableGroup;

var dragging = false;
var dragging_tile_selected = false;
var o_mcamera;

var o_mcamera2;

var isoCursor;
var touchSprite;

var toolbarGroup;
var toolbar_image;
var toolbar_menu;
var toolbar_portrait;
var toolbar_menu_noportrait;
var toolbar_text_title;
var toolbar_text_desc;
var toolbar_text_level;
var toolbar_button;
var toolbar_button_text;
var toolbar_popup_menu;



var toolbar_text_2;
var toolbar_text_2_desc;
var toolbar_image_2;
var toolbar_button_cancel;
var toolbar_button_confirm;

var toolbar_button_cancel_text;
var toolbar_button_confirm_text;

var toolbarPopupGroup;


var buildingCreatorGroup;
var building_menu;

var statusbarGroup;

var statusbar_wheat_icon;
var statusbar_milk_icon;
var statusbar_lemon_icon;
var statusbar_money_icon;

var statusbar_wheat_text;
var statusbar_milk_text;
var statusbar_lemon_text;
var statusbar_money_text;

var statusbar_sound_icon;

var buyableItemsGroup;
var buyable_items;

var selectedTile;

var alertsGroup;

var buildingPickerGroup;

var resources = {
    wheat: 30,
    milk: 0,
    lemon: 10,
    money: 1000,
    result: ''
};

var info = {
    currentWave: 0,
    statsManager: null,
    health: 100
}

var customer;

var game_scale = 0.9;
if(isLandscape){
    game_scale = 0.8;
}

var tilecounter = 0;
var tileTotalCount = 1;

var health = 100;
var ending = false;
var gameoverText;
var happinessBar;
var happinessBarGroup;

var wave_text;
var next_wave_text;

var offsetx = -40;
var offsety = 430;





function destroySprite(){
    this.kill();
}

function circleEffect(x,y){
    var circle = game.add.sprite(x,y,'circle');
                        circle.fixedToCamera = true;
                        circle.anchor.setTo(0.5);
                        circle.scale.setTo(0.0);

                        var tween = game.add.tween(circle.scale);

                        tween.to({ x: 3.0, y:3.0 }, 300);
                        //  And this starts it going
                        tween.start();

                        tween = game.add.tween(circle);

                        tween.to({ alpha: 0.0 }, 300);
                        //  And this starts it going
                        tween.start();

                        game.world.bringToTop(circle);

                        game.time.events.add(Phaser.Timer.SECOND * 1, destroySprite, circle);
}
function starEffect(x,y,level){
    var sprite = game.add.sprite(x-12+(level-1)*20,y-25,'star_icon');
                        sprite.fixedToCamera = false;
                        sprite.anchor.setTo(0.5);
                        sprite.scale.setTo(0.1);
                sprite.isStar = true;
                alertsGroup.add(sprite);

}
function selectTileIfInbound(tile,checkForBuildings)
{
    if(ending)return;
    //Funcion que selecciona un tile cuando el cursor se encuentra dentro de este
    //checkForBuildings ve si es que hay que revisar si hay edificios sobre el tile o no. Usar true para los tiles de piso
    var pointer = new Phaser.Point((game.input.activePointer.position.x + game.camera.x),
                                (game.input.activePointer.position.y + game.camera.y));
    game.iso.unproject(pointer , isoCursor,30);
    isoCursor = isoCursor.divide(game_scale,game_scale,game_scale);
    var inBounds = tile.isoBounds.containsXY(isoCursor.x,
					     isoCursor.y);


    // If it does, do a little animation and tint change.
    if(checkForBuildings){
	if (!tile.selected && inBounds && tile_buildings[tile.tile_y][tile.tile_x] == null) {
            //console.log(isoCursor.x);
            tile.selected = true;
            tile.tint = 0x86bfda;


	}
    // If not, revert back to how it was.
	else if (tile.selected && !inBounds) {
            tile.selected = false;
            tile.tint = 0xffffff;
            tile.selected_once = false;
	}            
    }
    else{
	if (!tile.selected && inBounds && !tile.isDragableGroup) {
            //console.log(isoCursor.x);
            tile.selected = true;
            tile.tint = 0x86bfda;

	}
	// If not, revert back to how it was.
	else if (tile.selected && !inBounds && !tile.isDragableGroup) {
            tile.selected = false;
            tile.tint = 0xffffff;
            tile.selected_once = false;
	}
    }
	
}
function selectTiles(tile){
    BuildingPickerGroup_hidePicker();
    stands.hide_all_menus();
    


    if(tile && tile.isGround){
        if(tile.selected_once){
            if(BasicGame.Game.prototype.isConfirmMenuOpened()){
                BasicGame.Game.prototype.handleToolbarCancel();
            }
            //console.log(tile);
	 	    button_click.play('',0.3);
            var x_pos = tile.x - game.camera.x;
            var y_pos = tile.y - game.camera.y;
            buildingPickerGroup.x = tile.x;
            buildingPickerGroup.y = tile.y - 60;
            buildingPickerGroup.balloon.angle = 0;
            if(y_pos < game.height - game.height/4){
                buildingPickerGroup.balloon.angle = 180;
                buildingPickerGroup.x = tile.x;
                buildingPickerGroup.y = tile.y + 60;
            }
            if(x_pos > game.width - game.width/4){
                buildingPickerGroup.balloon.angle = 270;
                buildingPickerGroup.x = tile.x - 60;
                buildingPickerGroup.y = tile.y;
                if(y_pos > game.height - game.height/4){
                    buildingPickerGroup.balloon.angle = 270 + 45;
                    buildingPickerGroup.x = tile.x - 60;
                    buildingPickerGroup.y = tile.y - 45;
                
                }
                if(y_pos < game.height/4){
                    buildingPickerGroup.balloon.angle = 270 - 45;
                    buildingPickerGroup.x = tile.x - 60;
                    buildingPickerGroup.y = tile.y + 45;
                }
            }
            if(x_pos < game.width/4){
                buildingPickerGroup.balloon.angle = 90;
                buildingPickerGroup.x = tile.x + 60;
                buildingPickerGroup.y = tile.y;
                if(y_pos > game.height - game.height/4){
                    buildingPickerGroup.balloon.angle = 90 - 45;
                    buildingPickerGroup.x = tile.x + 60;
                    buildingPickerGroup.y = tile.y - 45;
                
                }
                if(y_pos < game.height/4){
                    buildingPickerGroup.balloon.angle = 90 +45;
                    buildingPickerGroup.x = tile.x + 45;
                    buildingPickerGroup.y = tile.y + 60;
                }
            }

            buildingPickerGroup.x *=game_scale;
            buildingPickerGroup.y *=game_scale;
            



            if(tile.tile_index == 41){
                BuildingPickerGroup_resetChoices();
                BuildingPickerGroup_addChoice('wheat');
                BuildingPickerGroup_addChoice('lemon');
                BuildingPickerGroup_addChoice('milk');
		

                BuildingPickerGroup_showPicker();
            }
            if(tile.tile_index == 91){
                BuildingPickerGroup_resetChoices();
                BuildingPickerGroup_addChoice('stand');


                BuildingPickerGroup_showPicker();
            }
        }
        else{
            tile.selected_once = true;
        }
    }
    else{
        if(BasicGame.Game.prototype.isConfirmMenuOpened()){
            BasicGame.Game.prototype.handleToolbarCancel();
        }
        if(tile == null){
            toolbar_text_title.text = "";
            toolbar_image.alpha = 0.0;
            //toolbar_portrait
            toolbar_text_desc.text = "";
            toolbar_text_level.text = "";
            toolbar_button.alpha = 0.0;
            BasicGame.Game.prototype.closePopupMenu();
            toolbar_button.inputEnabled = false;
            toolbar_button_text.text = "";
            buildingCreatorGroup.alpha = 0.0;
            buildingCreatorGroup.forEach(function(portrait){
                console.log(portrait);
                portrait.inputEnabled = false;

            });

            return;
        }

        button_click.play('',0.5);
        label2.text = tile.name;
        toolbar_image.loadTexture(tile.key);
        toolbar_text_title.text = tile.name;
        toolbar_text_desc.text = "";
        toolbar_text_level.text = "";
        toolbar_button.alpha = 0.0;
        BasicGame.Game.prototype.closePopupMenu();
        toolbar_button.inputEnabled = false;
        toolbar_button_text.text = "";
        buildingCreatorGroup.alpha = 0.0;
        buildingCreatorGroup.forEach(function(portrait){
            console.log(portrait);
            portrait.inputEnabled = false;

        });
        selectedTile = tile;
        buyableItemsGroup.alpha = 0.0;

        buyable_items.forEach(function(item){
            item.sprite.button_.inputEnabled = false;
        });

        var b_type = tile.building_type;

        if(tile.building_type == 'production'){
            var title,tipo, rate;
            var p_type = tile.production_type;
            switch(p_type){
                case 'wheat':
                    title = LocalizableStrings.getString("buildings-"+p_type+"-title");
                    tipo =  LocalizableStrings.getString("buildings-"+p_type+"-type");
                    break;
                case 'milk':
                    title = LocalizableStrings.getString("buildings-"+p_type+"-title");
                    tipo =  LocalizableStrings.getString("buildings-"+p_type+"-type");
                    break;
                case 'lemon':
                    title = LocalizableStrings.getString("buildings-"+p_type+"-title");
                    tipo =  LocalizableStrings.getString("buildings-"+p_type+"-type");
                    break;
                default:
                    title = '??';
                    tipo = '??';
            }
            rate = tile.production_rate;
            toolbar_text_title.text = title;
            var t = LocalizableStrings.getString("game-productionof","buildings-"+p_type+"-type");
            toolbar_text_desc.text = t+rate;
            toolbar_text_level.text = LocalizableStrings.getString("game-buildinglevel")+" "+tile.level;

            if(tile.level < 3){
                toolbar_button.alpha = 1.0;
                toolbar_button.inputEnabled = true;
                toolbar_button_text.alpha = 1.0;
                toolbar_text_2_desc.text = tile.upgrade_cost;
                toolbar_button_text.text = LocalizableStrings.getString("game-buildingupgrade");
            }
            
        }
        if(tile.building_type == 'house'){
            toolbar_text_title.text = LocalizableStrings.getString("buildings-"+b_type+"-title");
            toolbar_text_desc.text = LocalizableStrings.getString("buildings-"+b_type+"-desc");
            buildingCreatorGroup.alpha = 1.0;
            buildingCreatorGroup.forEach(function(portrait){
                portrait.inputEnabled = true;
            });

        }
        if(tile.building_type == 'garage'){
            toolbar_text_title.text = LocalizableStrings.getString("buildings-"+b_type+"-title");
            toolbar_text_desc.text = LocalizableStrings.getString("buildings-"+b_type+"-desc");
            
        }
	if(tile.building_type == 'stand'){
        console.log(tile);
        toolbar_text_title.text = LocalizableStrings.getString("buildings-"+tile.name+"-title");
	    tile.stand_context.show_radial_menu();
	    tile.stand_context.create_recipe_description();
	}
	else{
	    stands.destroy_descriptions();
	}
    }
    
}

function BuildingPickerGroup_init(){
    buildingPickerGroup = game.add.group();

    buildingPickerGroup.x = 100;
    buildingPickerGroup.y = 200;

    buildingPickerGroup.balloon = new Phaser.Sprite(game,0,0,'building_picker_balloon', 0);
    buildingPickerGroup.balloon.scale.setTo(1.0);
    buildingPickerGroup.balloon.anchor.setTo(0.5);
    //buildingPickerGroup.balloon.inputEnabled = true;
    //buildingPickerGroup.balloon.input.pixelPerfectOver = true;

    buildingPickerGroup.add(buildingPickerGroup.balloon);

    buildingPickerGroup.alpha = 1.0;

    buildingPickerGroup.choices = new Array();
}

function BuildingPickerGroup_addChoice(resource_name){
    var obj;
    buildingPickerGroup.choices[buildingPickerGroup.choices.length] = obj = new Phaser.Sprite(game,-0,0,resource_name, 0);
    buildingPickerGroup.choices[buildingPickerGroup.choices.length-1].scale.setTo(30/buildingPickerGroup.choices[buildingPickerGroup.choices.length-1].height);
    buildingPickerGroup.choices[buildingPickerGroup.choices.length-1].anchor.setTo(0.5);

    buildingPickerGroup.choices[buildingPickerGroup.choices.length-1].inputEnabled = true;
    obj.events.onInputDown.add(BuildingPickerGroup_choicePicked,obj);

    BuildingPickerGroup_updateChoices();
}

function BuildingPickerGroup_showPicker(){
    button_click.play('',0.3);
    buildingPickerGroup.alpha = 1.0;
    BuildingPickerGroup_updateChoices();
}

function BuildingPickerGroup_hidePicker(){
    buildingPickerGroup.alpha = 0.0;
    BuildingPickerGroup_updateChoices();

    buildingPickerGroup.balloon.inputEnabled = false;

}

function BuildingPickerGroup_choicePicked(){
    button_click.play('',0.3);
    console.log(this);
    stands.destroy_descriptions();
    BuildingPickerGroup_hidePicker();
    selectedTile = this;
    BasicGame.Game.prototype.openConfirmMenu("build");

    if(this.key == 'wheat'){

        var item = {};
        item.name = "Campo de trigo";
        item.price = GameVarsData.getBuildingProperty('wheat','cost');
        item.image = "wheat";
        item.description = "Produce trigo!";

        game.iso.unproject(pointer,isoCursor,30);
        isoCursor = isoCursor.divide(game_scale,game_scale,game_scale);

        console.log(BasicGame.Game.prototype);
        buildingBuilder.create_draggable(isoCursor.x,isoCursor.y,isoGroup2,'wheat','wheat',buildingBuilder);
        buildingBuilder.buyingProduct = item;

        toolbar_text_2_desc.text = item.price;
    }

    if(this.key == 'milk'){

        var item = {};
        item.name = "Vaca";
        item.price = GameVarsData.getBuildingProperty('milk','cost');
        item.image = "milk";
        item.description = "Produce leche!";

        game.iso.unproject(pointer,isoCursor,30);
        isoCursor = isoCursor.divide(game_scale,game_scale,game_scale);

        console.log(BasicGame.Game.prototype);
        var a = buildingBuilder.create_draggable(isoCursor.x,isoCursor.y,isoGroup2,'milk','milk',buildingBuilder);
        a.anchor.setTo(0.5,0.64,0.0);
        buildingBuilder.buyingProduct = item;

        toolbar_text_2_desc.text = item.price;
    }

    if(this.key == 'lemon'){

        var item = {};
        item.name = "Limonero";
        item.price = GameVarsData.getBuildingProperty('lemon','cost');
        item.image = "lemon";
        item.description = "Da limones!";

        game.iso.unproject(pointer,isoCursor,30);
        isoCursor = isoCursor.divide(game_scale,game_scale,game_scale);

        console.log(BasicGame.Game.prototype);
        var a = buildingBuilder.create_draggable(isoCursor.x,isoCursor.y,isoGroup2,'lemon','lemon',buildingBuilder);
        a.anchor.setTo(0.5,0.64,0.0);
        buildingBuilder.buyingProduct = item;

        toolbar_text_2_desc.text = item.price;
    }

    if(this.key == 'stand'){

        var item = {};
        item.name = "Stand";
        item.price = GameVarsData.getStandProperty('stand','cost');
        item.image = "stand";
        item.description = "Un Stand para vender cosas!";

        game.iso.unproject(pointer,isoCursor,30);
        isoCursor = isoCursor.divide(game_scale,game_scale,game_scale);

        console.log(BasicGame.Game.prototype);
        var a = buildingBuilder.create_draggable(isoCursor.x,isoCursor.y,isoGroup2,'stand','stand',buildingBuilder);
        a.anchor.setTo(0.5,0.64,0.0);
        buildingBuilder.buyingProduct = item;

        toolbar_text_2_desc.text = item.price;
    }
    game.iso.simpleSort(isoGroup2);

}

function BuildingPickerGroup_resetChoices(){
    buildingPickerGroup.choices.forEach(function(choice){
        buildingPickerGroup.remove(choice);
        choice.destroy();
    });

    buildingPickerGroup.choices = new Array();
}

function BuildingPickerGroup_updateChoices(){
    buildingPickerGroup.choices.forEach(function(choice){
        buildingPickerGroup.remove(choice);
    });

    var x = 1;
    var radius = 25;
    var length = buildingPickerGroup.choices.length;

    if(buildingPickerGroup.choices.length%2 == 0)
        var angle_offset = Math.PI/4;
    else
        var angle_offset = Math.PI/6;
    buildingPickerGroup.choices.forEach(function(option){
        if(length == 1){
            option.x = 0;
            option.y = 0;
        }
        else{
            option.x = radius * Math.cos((2)*Math.PI * x/length + angle_offset);
            option.y = radius * Math.sin((2)*Math.PI * x/length + angle_offset);
        }

        buildingPickerGroup.add(option);

        if(buildingPickerGroup.alpha == 1.0){
            option.inputEnabled = true;
            //buildingPickerGroup.balloon.inputEnabled = true;
        }
        else{
            option.inputEnabled = false;
            buildingPickerGroup.balloon.inputEnabled = false;
        }

        x++;
    });
}



var cropRect;

var tile_isos;
var tile_buildings;

var buildings = {
    _buildings: {},
    create_building: function(building_){
        //Cuando crea el sprite de building desde afuera
        this._buildings[building_.building_type] = building_;
    },
    get_building: function(type_){
        if(this._buildings[type_] == null)
        {
            return null;
        }
        else
        {
            return this._buildings[type_];
        }
    },
    upgrade_production_building: function(tile,level){
        tile.level = level;
        tile.production_rate = GameVarsData.getBuildingProperty(tile.name,'production_rate_'+level);
        tile.production_time = GameVarsData.getBuildingProperty(tile.name,'production_speed_'+level) * 1000;
        tile.upgrade_cost = GameVarsData.getBuildingProperty(tile.name,'upgrade_'+(level+1)+'_cost');
        //tile.sprite = asd;
    },
    create_wheat: function(x_,y_,isoGroup_)
    {
        var wheat = game.add.isoSprite(Math.floor(x_)*50, Math.floor(y_)*50, 0,'wheat', 0, isoGroup_);
        wheat.name = 'wheat';
        wheat.level = 1;
        wheat.upgrade_cost = GameVarsData.getBuildingProperty('wheat','upgrade_2_cost');
        wheat.building_type = 'production';
        wheat.production_type = 'wheat';
        wheat.production_rate = GameVarsData.getBuildingProperty('wheat','production_rate_1');
        wheat.production_time = GameVarsData.getBuildingProperty('wheat','production_speed_1') * 1000;
        wheat.anchor.setTo(0.5,0.5,0.5);
        wheat.tile_x = x_;
        wheat.tile_y = y_;
        this._buildings['wheat'] = wheat;
        game.iso.simpleSort(isoGroup2);
        tile_buildings[Math.floor(y_)][Math.floor(x_)] = wheat;

    },
    create_milk: function(x_,y_,isoGroup_)
    {
        var milk = game.add.isoSprite(Math.floor(x_)*50, Math.floor(y_)*50, 0,'milk', 0, isoGroup_);
        milk.name = 'milk';
        milk.level = 1;
        milk.upgrade_cost = GameVarsData.getBuildingProperty('milk','upgrade_2_cost');
        milk.building_type = 'production';
        milk.production_type = 'milk';
        milk.production_rate = GameVarsData.getBuildingProperty('milk','production_rate_1');
        milk.production_time = GameVarsData.getBuildingProperty('milk','production_speed_1') * 1000;
        milk.anchor.setTo(0.5,0.64,0.0);
        milk.tile_x = x_;
        milk.tile_y = y_;
        this._buildings['milk'] = milk;
        game.iso.simpleSort(isoGroup2);
        buildings.create_building(milk);
        tile_buildings[Math.floor(y_)][Math.floor(x_)] = milk;

    },
    create_lemon: function(x_,y_,isoGroup_)
    {
        var lemon = game.add.isoSprite(Math.floor(x_)*50, Math.floor(y_)*50, 0,'lemon', 0, isoGroup_);
        lemon.name = 'lemon';
        lemon.level = 1;
        lemon.upgrade_cost = GameVarsData.getBuildingProperty('lemon','upgrade_2_cost');
        lemon.building_type = 'production';
        lemon.production_type = 'lemon';
        lemon.production_rate = GameVarsData.getBuildingProperty('lemon','production_rate_1');
        lemon.production_time = GameVarsData.getBuildingProperty('lemon','production_speed_1') * 1000;
        lemon.anchor.setTo(0.5,0.64,0.0);
        lemon.tile_x = x_;
        lemon.tile_y = y_;
        this._buildings['lemon'] = lemon;
        game.iso.simpleSort(isoGroup2);
        buildings.create_building(lemon);
        tile_buildings[Math.floor(y_)][Math.floor(x_)] = lemon;
    },
    create_house: function(x_,y_,isoGroup_)
    {
        var house = game.add.isoSprite(Math.floor(x_)*50, Math.floor(y_)*50 , 0,'house', 0, isoGroup2);
        house.name = 'house';
        house.building_type = 'house';
        house.anchor.setTo(0.5,0.64,0.0);
        house.scale.set(1.0);
        house.tile_x = x_;
        house.tile_y = y_;
        buildings.create_building(house);
        tile_buildings[Math.floor(y_)][Math.floor(x_)] = house;
        game.iso.simpleSort(isoGroup2);
    },
    create_garage: function(x_,y_,isoGroup_)
    {
        var garage = game.add.isoSprite(Math.floor(x_)*50, Math.floor(y_)*50, 0,'garage', 0, isoGroup_);
        garage.name = 'garage';
        garage.building_type = 'garage';
        garage.anchor.setTo(0.54,0.74,0.0);
        garage.scale.set(1.0);
        garage.tile_x = x_;
        garage.tile_y = y_;
        buildings.create_building(garage);
        tile_buildings[Math.floor(y_)][Math.floor(x_)] = garage;
        game.iso.simpleSort(isoGroup2);
    },
    create_stand: function(x_,y_,isoGroup_)
    {
	var newstand = stand();
	newstand.create_stand(x_,y_,isoGroup);
        buildings.create_building(newstand.stand_sprite);
        tile_buildings[Math.floor(y_)][Math.floor(x_)] = newstand.stand_sprite;
    },
    upgrade_stand: function(x_,y_,isoGroup,standFunction)
    {
	//Upgradea el stand de la posicion x_,y_ al stand apropiado
	var newstand = standFunction();
	newstand.create_stand(x_,y_,isoGroup);
        buildings.create_building(newstand.stand_sprite);
        tile_buildings[Math.floor(y_)][Math.floor(x_)] = newstand.stand_sprite;
	
    },
    destroy_building: function(x_,y_)
    {
	//Elimina el building de los arreglos correspondientes
	tile_buildings[y_][x_] = null;
	
    }

};

var inventory = {
    //Instancia el inventario y su menu correspondiente. Usa elementos de draggableResourceManager
    invSlots: {
        wheat : {quantity:resources.wheat, icon:"wheat_icon"},
        lemon : {quantity:resources.lemon, icon:"lemon_icon"},
        milk : {quantity:resources.milk, icon:"milk_icon"}
    }, //Slots de inventario
    create_inventory: function()
    {
        this.group = game.add.group();
        this.group.fixedToCamera = true;
        toolbarPopupGroup.add(this.group);
        var x = 20;
        var y = 24;
        var separation = 50;
        for(slot in this.invSlots)
        {
            this.create_portrait(x,y,this.invSlots[slot].icon,slot);
            x += separation;
        }
        draggableResourceManager.create_slots(20,100);
    },
    show_inventory: function()
    {
        this.group.forEach(function(slot)
        {
            slot.inputEnabled = true;
        });

        this.group.alpha = 1.0;
    },
    hide_inventory: function()
    {
        this.group.forEach(function(slot)
        {
            slot.inputEnabled = false;
        });
        this.group.alpha = 0.0;
    },
    create_portrait: function(x_,y_,spriteName_,type_)
    {
        var portrait = new Phaser.Sprite(game,x_,y_,spriteName_, 0);

        portrait._type = type_;
        portrait._cost = 1;
        portrait.anchor.setTo(0.5,0.5,0.5);
        portrait.scale.setTo(0.5);
        portrait.inputEnabled = true; 
        portrait.events.onInputDown.add(this.on_click,{builder:this,sprite:portrait,name:spriteName_});
        portrait.bringToTop();
        portrait.text = game.add.text(x_+2, y_+4, "0", { font: "bold 10px Arial", fill: "#00000" });
        
        portrait.text.anchor.set(0.5);
        portrait.text.stroke =  'black';
        portrait.text.strokeThickness=2;
        portrait.text.alpha = 0.4;
        portrait.text.inputEnabled = true;
        portrait.text.events.onInputDown.add(this.on_click,{builder:this,sprite:portrait,name:spriteName_});
        var portraitGroup = game.add.group();

        portraitGroup.add(portrait);
        portraitGroup.add(portrait.text);

        this.group.add(portraitGroup);
        

        portrait.inputEnabled = false; 
    },
    update_portraits: function()
    {
        this.group.forEach(function(portraitGroup)
        {
           
            var portrait = portraitGroup.getAt(0);
            portrait.text.text = resources[portrait._type];
            
        });
    },
    reset_portraits: function(){
        for(x=0;x<this.buildingPortraits.length;x++){
            this.buildingPortraits[x].kill();
        }
        
    },
    on_click: function()
    {
        game.iso.unproject(pointer,isoCursor,30);

        draggableResourceManager.update_resource_combinations(this.sprite);
    }

};
var draggableResourceManager = {
    //Se encarga de manejar a los recursos que salen de ser arrastrados desde 
    //su lugar de origen
    resourceCombiner: {
        wheat: 0,
        milk: 0,
        lemon: 0,
        result: {}

    },
    
    create_resource: function(x_,y_,isoGroup_,type_,spriteName_,cost_,inventoryDraggable_,context_)
    {
        var resource = game.add.isoSprite(x_*50,y_*50,30,spriteName_,0,isoGroup_);
        resource._type = type_;
        resource.inputEnabled = true; 
        resource.scale.setTo(0.5);
        resource.anchor.setTo(0.5,0.5,0);
        game.world.bringToTop(resource);
        resource._cost = cost_;
        if(inventoryDraggable_ == true)
        {
            resource.inventoryDraggable = true;
        }
        return resource;
    },
    create_wheat_resource: function(x_,y_,isoGroup_,context_)
    {
        return this.create_resource(x_,y_,isoGroup_,'wheat','wheat_icon',1,context_);
    },
    create_lemon_resource: function(x_,y_,isoGroup_,context_)
    {
        return this.create_resource(x_,y_,isoGroup_,'lemon','lemon_icon',1,context_);
    },

    move_to_pointer: function(resource_)
    {
        console.log("Moving");
        resource_.isoX = isoCursor.x;
        resource_.isoY = isoCursor.y;
    },
    update_resource_draggables: function(resourceGroup_)
    {
        //Hace la accion de arrastrar y soltar.
        var resmanager = this;
        var reset = false;
        var resetResource = {};
        game.iso.unproject(pointer,isoCursor,30);
        

        resourceGroup_.forEach(function (resource){
            if(resource !== null && !reset)
            {
                var inBounds = resource.isoBounds.containsXY(isoCursor.x,
                    isoCursor.y);
                if(game.input.activePointer.isDown)
                {
                    dragging = true;
                    //resmanager.move_to_pointer(resource);
                    
                }
                else if (resource.inventoryDraggable)
                {
                    //Revisa los slots para ver si es que hay algo encima
                    resmanager.slotGroup.forEach(function(slot){
                        
                        if(resource.overlap(slot))
                        {
                            resmanager.update_resource_combinations(resource,inBoundsStand);
                        }
                    });
                    reset = true;
                    resetResource = resource;
                    dragging = false;

                }
                else
                {
                    //Codigo para la casa
                    var snappedPointer = new Phaser.Plugin.Isometric.Point3(Math.floor(isoCursor.x/50.0)*50,Math.floor(isoCursor.y/50.0)*50);
                    var snappedPointerXY;
                    snappedPointerXY = game.iso.projectXY(snappedPointer,snappedPointerXY);
                    var inBounds = buildings.get_building('house').isoBounds.containsXY(isoCursor.x,isoCursor.y); 
                    if(inBounds)
                    {   
                        resmanager.update_resource_combinations(resource);
                        circleEffect((snappedPointerXY.x)*game_scale-game.camera.x,(snappedPointerXY.y)*game_scale-game.camera.y);
                    }
                    //Aqui va el codigo para el stand
                    var inBoundsStand = tile_buildings[Math.floor(isoCursor.y/50.0)][Math.floor(isoCursor.x/50.0)]
                    //var inBoundsStand = buildings.get_building('stand').isoBounds.containsXY(isoCursor.x,isoCursor.y);
                    if(inBoundsStand && inBoundsStand.building_type == 'stand')
                    {
                        resmanager.update_results(resource,inBoundsStand);
                        circleEffect((snappedPointerXY.x)*game_scale-game.camera.x,(snappedPointerXY.y)*game_scale-game.camera.y);
                    }
                    reset = true;
                    resetResource = resource;
                    dragging = false;
                }
            }
            
        });
        if(reset)
        {
            resourceGroup_.remove(resetResource);
            resetResource.destroy();
        }
    },
    update_resource_combinations: function(newResource_)
    {
        //Se encarga de agregar combinaciones de recursos y de ver si corresponde crear un nuevo recurso
        //Por ahora solo crea 1 limon a partir de 3 de trigo
        //newResource_: String con el tipo de recurso
        if(resources[newResource_._type] > 0 && this.currentSlot < 3)
        {
            this.resourceCombiner[newResource_._type] += 1;
            resources[newResource_._type] -= newResource_._cost;
            this.slot[this.currentSlot].loadTexture(this.get_icon_name(newResource_._type));
            this.currentSlot++;
        }


        // Para recetas de construcciones, se puede usar los portraits.
        // Para recetas de items, se puede usar una texture en el slot 4 (slot 3 es la flecha)
        
        //Verifica las recetas
        if(this.resourceCombiner['wheat'] >= 3)
        {
            //buildingBuilder.create_wheat_portrait(250,75);

            this.resourceCombiner['result'] = 'lemon';
            this.slot[4].loadTexture(this.get_icon_name('lemon'));
            if(this.slot[4].height!=25)this.slot[4].scale.setTo(25/this.slot[4].height);
            //this.reset_combiner();

        }

        if(this.resourceCombiner['www'] >= 3)
        {
            buildingBuilder.create_wheat_portrait(250,75);

            this.resourceCombiner['result'] = 'lemon';
            //this.slot[this.currentSlot].loadTexture(this.get_icon_name('lemon'));
            //this.reset_combiner();

        } 
       
    },
    update_results: function(newResource_,stand_)
    {
        //Verifica que haya llegado un resultado de reseta
        if(this.resourceCombiner['result'] == 'lemon' && newResource_._type == 'lemon')
        {
            console.log(stand_);
            draggableResourceManager.reset_combiner();
            buildingBuilder.reset_portraits();
        }
    },
    get_result: function()
    {
        //Se encarga de obtener el resultado de la mezcla
            resources[this.resourceCombiner['result']] += 1;
            draggableResourceManager.reset_combiner();
            buildingBuilder.reset_portraits();
        
             
    },
    reset_combiner: function()
    {
        this.currentSlot = 0;
	for(resource in this.resourceCombiner)
	{
	    resources[resource] += this.resourceCombiner[resource];
	    this.resourceCombiner[resource] = 0;
	}
        for(x=0;x<3;x++)
        {
            this.slot[x].loadTexture('transparent');
        }
        if(this.slot[4])this.slot[4].loadTexture('transparent');
           
    },
    reset_slot_textures: function()
    {
         for(i=0;i<5;i++)
            {
                if(i==3)continue;
                if(this.slot[i])this.slot[i].loadTexture('transparent');
            }
            this.currentSlot = 0;
    },
    get_icon_name: function(newResource_)
    {
        //Obtiene el icono del recurso dado
        if(newResource_ === 'wheat')
        {
            return 'wheat_icon';
        }
        else if(newResource_ === 'lemon')
        {
            return 'lemon_icon';
        }
    },
    create_slots: function(x,y)
    {
        //Crea los slots en la barra de abajo
        this.slotGroup = game.add.group();
        this.slot = []; //Este arreglo contiene los iconos correspondiente a los 4 slots
        this.currentSlot = 0; //Para mantener cual es el ultimo slot creado
        for(i = 0;i < 3; i++)
        {

            this.slot[i] = new Phaser.Sprite(game,x+20*i,y,'transparent', 0);
            this.slot[i].anchor.set(0.5);
            this.slot[i].scale.setTo(0.5);
            this.slotGroup.add(this.slot[i]);

        }

        this.slot[3] = new Phaser.Sprite(game,x+20*3,y,'arrow_ui', 0);
        this.slot[3].anchor.set(0.5);
        this.slot[3].scale.setTo(15/this.slot[3].width);
        this.slotGroup.add(this.slot[3]);

        this.slot[4] = new Phaser.Sprite(game,2+x+20*4,y,'transparent', 0);
        this.slot[4].alpha = 1.0;
        this.slot[4].anchor.set(0.5);
        this.slot[4].inputEnabled = true;
        this.slot[4].events.onInputDown.add(this.get_result,this);
        this.slot[4].bringToTop();
        this.slotGroup.add(this.slot[4]);

       
        this.createButton = new Phaser.Sprite(game,x,y+100,'toolbar_button',0);
        this.createButton.inputEnabled = true;

        this.createButton.anchor.setTo(0.5);
        this.createButton.scale.setTo(0.5);
        this.createButton.alpha = 1.0;

        this.buttonGroup = game.add.group();
        this.buttonGroup.add(this.createButton);

        this.createButton.inputEnabled = true;
        this.createButton.events.onInputDown.add(this.get_result, this);

        this.createButton.text = game.add.text(x, y+100, "Cocinar", { font: "bold 12px Arial", fill: "#000000" });
        this.createButton.text.anchor.setTo(0.5);
        this.createButton.text.alpha = 1.0;
        this.createButton.text.inputEnabled = true;
        this.createButton.text.events.onInputDown.add(this.get_result,this);
	this.buttonGroup.add(this.createButton.text);
	
	this.createButton = new Phaser.Sprite(game,x+100,y+100,'toolbar_button',0);
        this.createButton.inputEnabled = true;

        this.createButton.anchor.setTo(0.5);
        this.createButton.scale.setTo(0.5);
        this.createButton.alpha = 1.0;

        
        this.buttonGroup.add(this.createButton);

        this.createButton.inputEnabled = true;
        this.createButton.events.onInputDown.add(this.reset_combiner, this);

        this.createButton.text = game.add.text(x+100, y+100, "Cancelar", { font: "bold 12px Arial", fill: "#000000" });
        this.createButton.text.anchor.setTo(0.5);
        this.createButton.text.alpha = 1.0;
        this.createButton.text.inputEnabled = true;
        this.createButton.text.events.onInputDown.add(this.reset_combiner,this);

        this.buttonGroup.add(this.createButton.text);
        toolbarPopupGroup.add(this.slotGroup);
        toolbarPopupGroup.add(this.buttonGroup);
        toolbarPopupGroup.bringToTop(this.slotGroup);

    }
};

var varww = 0;
var buildingBuilder = {
    buildingPortraits: [],
    
    init_builder: function()
    {
        this.buildingDraggableGroup = game.add.group();
    },
    create_portrait: function(x_,y_,spriteName_,type_)
    {
        var portrait = new Phaser.Sprite(game,x_,y_,spriteName_, 0);

        portrait.type = type_;
        portrait.anchor.setTo(0.5,0.5,0.5);
        portrait.scale.setTo(0.5);
        portrait.inputEnabled = true; // despues lo activamos oh
        portrait.events.onInputDown.add(this.onClick,{builder:this,sprite:portrait});
        portrait.bringToTop();
        portrait.fixedToCamera = true;
        buildingCreatorGroup.add(portrait);
        this.buildingPortraits[this.buildingPortraits.length]=portrait;

        portrait.inputEnabled = false; 
    },
    reset_portraits: function(){
        for(x=0;x<this.buildingPortraits.length;x++){
            this.buildingPortraits[x].kill();
        }
        
    },
    create_wheat_portrait: function(x_,y_)
    {
        this.create_portrait(x_,y_,'wheat','wheat');
    },
    onClick: function()
    {
        game.iso.unproject(pointer,isoCursor,30);
        this.builder.create_draggable(isoCursor.x,isoCursor.y,this.builder.buildingDraggableGroup,this.sprite.type,'wheat',this.builder);
    },
    create_draggable: function(x_,y_,isoGroup_,type_,spriteName_,context_)
    {
        var resource = game.add.isoSprite(x_,y_,30,spriteName_,0,isoGroup_);
        resource.isDragableGroup = true;
        resource._type = type_;
        resource.inputEnabled = true; 
        resource.anchor.setTo(0.5,0.5,0.5);
        //resource.blendMode = PIXI.blendModes.ADD;
        resource.alpha = 0.9;
        resource.isResource = true;

        resource.select_tile = game.add.isoSprite(x_,y_,29.99,'select_tile',0,isoGroup_);
        resource.select_tile.anchor.setTo(0.5);
        resource.select_tile.scale.setTo(1.2);
        resource.select_tile.tint = 0x00ff00;
        resource.select_tile.blendMode = PIXI.blendModes.ADD;
        resource.select_tile.alpha = 0.9;
        resource.select_tile.isResource = false;
        resource.select_tile.isDragableGroup = true;

        game.world.bringToTop(resource);
        game.iso.simpleSort(isoGroup_);

        //isoGroup2.add(resource);
        return resource;
    },
    create_wheat_draggable: function(x_,y_,isoGroup_,context_)
    {
        return this.create_resource(x_,y_,isoGroup_,'wheat','wheat',1,context_);
    },
    move_to_pointer: function(resource_)
    {
        resource_.isoX = isoCursor.x;
        resource_.isoY = isoCursor.y;
    },
    update_draggables: function()
    {
        //Hace la accion de arrastrar y soltar.
        var resmanager = this;
        var reset = false;
        var resetResource = {};
        pointer = new Phaser.Point((game.input.activePointer.position.x + game.camera.x),
                                (game.input.activePointer.position.y + game.camera.y));
        game.world.bringToTop(buildingCreatorGroup);
        game.world.bringToTop(this.buildingDraggableGroup);
        game.iso.unproject(pointer,isoCursor,20);

        isoCursor = isoCursor.divide(game_scale,game_scale,game_scale);

        var snappedPointer = new Phaser.Plugin.Isometric.Point3(Math.floor(isoCursor.x/50.0)*50,Math.floor(isoCursor.y/50.0)*50);
        var snappedPointerXY;
        snappedPointerXY = game.iso.projectXY(snappedPointer,snappedPointerXY);
        var buildingDraggableGroup_ = isoGroup2;
        varww++;
        isoGroup2.forEach(function (resource){
            if(resource != null && resource.isResource && resource.isDragableGroup)
            {   
                //console.log(varww);
                var isoBounds_ = resource.isoBounds;
                isoBounds_.widthX += 60;
                isoBounds_.widthY += 60;
                isoBounds_.height += 60;
                isoBounds_.x -= 30;
                isoBounds_.y -= 30;
                isoBounds_.z -= 30;
                var inBounds = isoBounds_.containsXY(isoCursor.x,
                    isoCursor.y);
                if(game.input.activePointer.isDown)
                {
                    dragging = true;
                    if(inBounds){
                        dragging_tile_selected = true;
                        resmanager.move_to_pointer(resource);
                        console.log(Math.floor((isoCursor.x)/50)*50);
                        resource.select_tile.isoX = Math.floor((isoCursor.x)/50)*50;
                        resource.select_tile.isoY = Math.floor((isoCursor.y)/50)*50;
                        resource.select_tile.isoZ = 0;

                        resource.select_tile.tint = 0xff0000;
                        if(tile_isos[Math.floor((isoCursor.y)/50)] != null){
                            var tile = tile_isos[Math.floor((isoCursor.y)/50)][Math.floor((isoCursor.x)/50)];
                            if(tile != null){
                                if(resource._type != 'stand'){
                                    if(tile.tile_index == 41){
                                        resource.select_tile.tint = 0x00ff00;
                                    }
                                    else{
                                        resource.select_tile.tint = 0xff0000;
                                    }
                                }
                                else{
                                    if(tile.tile_index == 91){
                                        resource.select_tile.tint = 0x00ff00;
                                    }
                                    else{
                                        resource.select_tile.tint = 0xff0000;
                                    }
                                }
                            }
                        }
                        if(tile_buildings[Math.floor((isoCursor.y)/50)] != null){
                            var building = tile_buildings[Math.floor((isoCursor.y)/50)][Math.floor((isoCursor.x)/50)];
                            if( building != null){
                                resource.select_tile.tint = 0xff0000;
                            }
                        }
                    }
                    else{
                        dragging_tile_selected = false;
                    }
                }
                else
                {
                    if(dragging){
                        if(dragging_tile_selected){
                            resource.select_tile.isoX = Math.floor((isoCursor.x)/50)*50;
                            resource.select_tile.isoY = Math.floor((isoCursor.y)/50)*50;
                            resource.select_tile.isoZ = 0;

                            resource.isoX = Math.floor((isoCursor.x)/50)*50;
                            resource.isoY = Math.floor((isoCursor.y)/50)*50;
                            resource.isoZ = 0;
                            game.iso.simpleSort(isoGroup2);
                        }
                    }

                    reset = false;
                    resetResource = resource;
                    dragging = false;
                    game.world.bringToTop(resource);
                }
            }
            
        });
        game.iso.simpleSort(isoGroup2);
        if(reset)
        {
            buildingCreatorGroup.remove(resetResource);
            resetResource.destroy();
        }
    }

};
function move_camera_by_pointer(o_pointer) {

    if (!o_pointer.timeDown) { return; }
    //if ((o_pointer.isDown && !dragging) && !dragging_tile_selected) {
    if ((o_pointer.isDown && true) && !dragging_tile_selected) {
        //console.log(o_pointer.position.x);
        if (o_mcamera) {
            game.camera.x += o_mcamera.x - o_pointer.position.x;
            game.camera.y += o_mcamera.y - o_pointer.position.y;
        }
        o_mcamera = o_pointer.position.clone();
    }
    if (o_pointer.isUp) { o_mcamera = null; }
}

function move_camera_by_pointer2(o_pointer) {

    if (!o_pointer.timeDown) { return; }
    //if ((o_pointer.isDown && !dragging) && !dragging_tile_selected) {
    if ((o_pointer.isDown && true) && !dragging_tile_selected) {
        //console.log(o_pointer.position.x);
        if (o_mcamera2) {
            game.camera.x += o_mcamera2.x - o_pointer.position.x;
            game.camera.y += o_mcamera2.y - o_pointer.position.y;
        }
        o_mcamera2 = o_pointer.position.clone();
    }
    if (o_pointer.isUp) { o_mcamera2 = null; }
}

BasicGame.Game = function(){ }; 

//Cache para tilemaps, guarda solo los que  no son repetidos
tilemapCache = {
     _cache: {},
    isInCache: function(key){
        if(this._cache[key] == null)
        {
            return false;
        }
        else
        {
            return true;
        }
    },
    put: function(tile,map,bitmapdata)
    {
        //Guarda el bitmap del tile en el cache si no se repite
        //Necesita el tile a obtener y el mapa.s
        if(!this.isInCache(tile.index))
        {

            var tileset = map.tilesets[0];
            var img = tileset.image;
            var rect = new Phaser.Rectangle(tileset.drawCoords[tile.index][0],
                tileset.drawCoords[tile.index][1],100,80);
            var bitmap= new Phaser.BitmapData(game,'yip',100,80);
            bitmap.clear();
            bitmap.copyRect(bitmapdata,rect,0,0);
            this._cache[tile.index] = bitmap;
        }

    },
    get: function(index)
    {
        return this._cache[index];
    }
}
 //Hace que la barra se agrande a medida que carga
 //@loadingbar image con la barra
 //@fileprogress porcentage de carga de las imagenes
 //@tileprogress porcentage de carga de los tiles
 //@game referencia a game
 function loadingBarUpdate(loadingbar,fileprogress,tileprogress,game)
 {
    var image = game.cache.getImage('loadingbar');
    var height = image.height;
    var width = image.width*(fileprogress+tileprogress)/200.0; //El largo es el promedio de la carga de ambas. Como se cargan secuencialmente es apropiado

 }
 //Inicializa la barra de carga
var loadingbarImage;  
var pieProgressPie;  
var pieTween;

 function loadStart()
 {

    
    

 }
 //Actualiza la barra cada vez que se carga un asset
 var fileprogress = 0;
 function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles)
 {
    loadingBarUpdate(loadingbarImage,100*totalLoaded/totalFiles,0,game);
    fileprogress = progress;
 }
 //Carga el tileset
 function setIsoTileset()
 {

    fileprogress = 100;
    map = game.add.tilemap("terrain",100,80);
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    map.addTilesetImage('map','map');

    //create layer
    backgroundlayer = map.createLayer('Capa de Patrones 1'); 

    backgroundlayer.alpha = 0.0;

    //resizes the game world to match the layer dimensions
    backgroundlayer.resizeWorld();

    isoGroup = game.add.group();
    var bitmapdata = new Phaser.BitmapData(game,'yip');
    
    bitmapdata.load('map');
    
    // transformar enemigos a instancias
    var tilecounter = 0; //Cuenta cada tile, independiente si existe o no
    var tileTotalCount = map.height*map.width;

    for(var y = 0; y < map.height; ++y){
        for(var x = 0; x < map.width; ++x){
            var tile = map.getTile(x,y,0,false);
            tilecounter++;
            if(tile != null){
                tilemapCache.put(tile,map,bitmapdata);
                
            }
            tileprogress= (tilecounter/tileTotalCount);

            
        }
    }
 }

var tileprogress = 0;
var loadingText;
var tilecounter_prev = -1;
var progress = 0;
var progress_prev;
//Prepara el texto de carga
function setLoadingText()
{
    loadingText = game.add.text(game.width/2, game.height/2 - game.height/3, LocalizableStrings.getString("general-loadingtext"), { font: "bold 30px Arial", fill: "#FFFFFF" });
    loadingText.fixedToCamera = true;
    loadingText.anchor.set(0.5);
    loadingText.stroke =  'black';
    loadingText.strokeThickness=2;
    loadingText.alpha = 0.4;

    var loadingTween = game.add.tween(loadingText);
    loadingTween.to({angle:10},100);
    loadingTween.to({angle:0},100);
    loadingTween.loop();
    loadingTween.start();
};

BasicGame.Game.prototype = { 

loadUpdate : function(){
    //console.log(game.load.progress);
    if(loadingbarImage){
        loadingbarImage.scale.x = 0.200*(1 - (fileprogress+tileprogress)/200.0);
        //console.log(game.load.progress);
        loadingbarImage.update();
    }
    if(pieProgressPie && pieProgressPie.alive){
            
        progress = (tilecounter/tileTotalCount) * 0.20 + tileprogress * 0.20 + (game.load.progress/100.0) * 0.6;
        if(progress != progress_prev){
            progress_prev = progress;
            game.world.add(pieProgressPie);
            pieTween = game.add.tween(pieProgressPie);
            pieTween.to({progress: (1-progress)}, 300, Phaser.Easing.Linear.None, true, 0, 0, false );
        }
        //pieProgressPie.progress = (0.200*(1 - (fileprogress+tileprogress)/200.0));
    }
},

preload: function() {

    loadingbarImage = game.add.sprite(10,game.height/2,'loadingbar');
    loadingbarImage.fixedToCamera = true;
    loadingbarImage.anchor.setTo(0.0,0.5);
    loadingbarImage.alpha = 0.0;

    pieProgressPie = new PieProgress(game, game.width/2,game.height/2, 16);

    setLoadingText();
    

    loadingbarImage.scale.x = 0.05;
    loadingbarImage.scale.y = 0.1;

    game.load.onLoadStart.addOnce(loadStart,this);
     game.load.onFileComplete.addOnce(fileComplete, this);
    game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
    //game.load.image('key', 'assets/sprites/key.png');
    game.load.image('house', 'assets/sprites/house.png');
    game.load.image('garage', 'assets/sprites/garage.png');
    game.load.image('stand', 'assets/sprites/stand.png');
    game.load.image('wheat', 'assets/sprites/wheat.png');
    game.load.image('milk', 'assets/sprites/milk.png');
    game.load.image('lemon', 'assets/sprites/lemon.png');

    game.load.image('blank', 'assets/sprites/blank.png');
    game.load.image('transparent', 'assets/sprites/transparent.png');
    
    if(isLandscape){
        game.load.image('toolbar', 'assets/sprites/toolbar_background_ui_portrait.png');
        game.load.image('portrait', 'assets/sprites/portrait.png');
    }
    else { game.load.image('toolbar', 'assets/sprites/toolbar_background_ui.png');
    }   
    game.load.image('toolbar_noportrait', 'assets/sprites/toolbar_background_noportrait_ui.png');

    game.load.image('toolbar_button', 'assets/sprites/toolbar_button.png');


    game.load.image('toolbar_popup_menu', 'assets/sprites/toolbar_popup_menu.png');

    game.load.image('wheat_icon', 'assets/sprites/wheat_icon.png');
    game.load.image('milk_icon', 'assets/sprites/milk_icon.png');
    game.load.image('lemon_icon', 'assets/sprites/lemon_icon.png');
    game.load.image('money_icon', 'assets/sprites/money_icon.png');

    game.load.image('cake_icon', 'assets/sprites/cake_icon.png');
    game.load.image('icecream_icon', 'assets/sprites/icecream_icon.png');
    game.load.image('lemonade_icon', 'assets/sprites/lemonade_icon.png');

    game.load.image('smile_icon', 'assets/sprites/smile_icon.png');
    game.load.image('sad_icon', 'assets/sprites/sad_icon.png');

    game.load.image('lemonade','assets/sprites/lemonade.png');
    game.load.image('cake','assets/sprites/cake.png');
    game.load.image('icecream','assets/sprites/icecream.png');

    game.load.image('circle', 'assets/sprites/circle.png');
    game.load.image('select_tile', 'assets/sprites/select_tile.png');
    game.load.image('arrow_ui', 'assets/sprites/arrow_2.png');
    game.load.image('alert', 'assets/sprites/alert.png');

    game.load.spritesheet('timer', 'assets/sprites/timer.png', 150, 20);

    Customer.LoadCustomerSpritesInCache();

    game.load.image('thinking_baloon', 'assets/sprites/thinking_baloon.png');
    game.load.image('building_picker_balloon', 'assets/sprites/building_picker_balloon.png');
    game.load.image('upgrade_picker','assets/sprites/building_picker_balloon_nopoint.png');
    game.load.image('check','assets/sprites/check.png');
    game.load.image('cross','assets/sprites/cross.png');

    game.load.image('exclamation', 'assets/sprites/exclamation.png');

    game.load.image('progressBarForeground', 'assets/sprites/progressBarForeground.png');
    game.load.image('progressBarBackground', 'assets/sprites/progressBarBackground.png');

    game.load.image('destination_nothing', 'assets/sprites/destination_nothing.png');
    game.load.image('destination_pool', 'assets/sprites/destination_pool.png');
    game.load.image('destination_shopping', 'assets/sprites/destination_shopping.png');
    game.load.image('destination_beach', 'assets/sprites/destination_beach.png');
    game.load.image('destination_amusement', 'assets/sprites/destination_amusement.png');
    game.load.image('destination_island', 'assets/sprites/destination_island.png');
    game.load.image('destination_moon', 'assets/sprites/destination_moon.png');

    game.load.image('star_icon', 'assets/sprites/star_icon.png');
    game.load.image('sound_on', 'assets/sprites/sound_on.png');
    game.load.image('sound_off', 'assets/sprites/sound_off.png');

    //game.load.image('keyboard', 'assets/sprites/keyboard.png');
    //game.load.image('keyboard_z', 'assets/sprites/keyboard_z.png');

    //game.load.audio('sfx', 'assets/sfx/fx_mixdown.ogg');

    //cursors = game.input.keyboard.createCursorKeys();

    //shootButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);

    //game.time.advancedTiming = true;


    game.time.advancedTiming = true;

    // Add and enable the plug-in.
    game.plugins.add(new Phaser.Plugin.Isometric(game));

    // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
    // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
    game.iso.anchor.setTo(0.0,0.0);
    
    

    game.world.bringToTop(loadingbarImage);


    setIsoTileset();
    
    tilecounter = 0; //Cuenta cada tile, independiente si existe o no
    tileTotalCount = map.height*map.width;

    for(var y = 0; y < map.height; ++y){
        for(var x = 0; x < map.width; ++x){
            var tile = map.getTile(x,y,0,false);
            tilecounter++;
            if(tile != null){
                tilemapCache.get(tile.index);
            }
            
            // loadingBarUpdate(loadingbarImage,fileprogress,100.0*(tilecounter/tileTotalCount),game);
        }
    }
},

create: function() {
    if(isLandscape){
        game.world.setBounds(offsetx,offsety,game.width + 120,game.height+250);
    }
    else{
        offsetx -=10;
        game.world.setBounds(offsetx,offsety,game.width + 460,game.height+250);
    }
    game.camera.setBoundsToWorld();

    resources = {
        wheat: GameVarsData.getConstantProperty("starting_wheat"),
        milk: GameVarsData.getConstantProperty("starting_milk"),
        lemon: GameVarsData.getConstantProperty("starting_lemon"),
        money: GameVarsData.getConstantProperty("starting_money"),
        result: ''
    };

    ending = false;
    pieProgressPie.destroy();
    loadingText.text = "Configurando";
    touchSprite = game.add.sprite(game.width/2, game.height/2, 'blank');
    touchSprite.anchor.setTo(0.5,0.5);
    touchSprite.scale.setTo(3000);

    touchSprite.alpha = 0.0;
    touchSprite.inputEnabled = true;
    //startGameText.input.enableDrag();
    touchSprite.events.onInputDown.add(this.handleTouchs, this);

    //key_counter = 0;

    //fx = game.add.audio('sfx');

    //  This is the BitmapData we're going to be drawing to

     //Creando el tileset
    // transformar enemigos a instancias
    tilecounter = 0; //Cuenta cada tile, independiente si existe o no
    tileTotalCount = map.height*map.width;

    tile_isos = new Array();
    tile_buildings = new Array();
    for(var y = 0; y < map.height; ++y){
        tile_isos[y] = new Array();
        tile_buildings[y] = new Array();
        for(var x = 0; x < map.width; ++x){
            var tile = map.getTile(x,y,0,false);
            tilecounter++;
            if(tile != null){
                var tile_iso;
                tile_iso = game.add.isoSprite(x*50, y*50, 0,tilemapCache.get(tile.index), 0, isoGroup);
                tile_iso.anchor.set(0.5);
                //tile_iso.inputEnabled = true;
                tile_iso.tile_index = tile.index;
                tile_iso.tile_x = x;
                tile_iso.tile_y = y;
                tile_iso.isGround = true;

                //console.log(tile);

                tile_isos[y][x] = tile_iso;
                
                map.removeTile(x,y);


            }
            
            // loadingBarUpdate(loadingbarImage,fileprogress,100.0*(tilecounter/tileTotalCount),game);
        }
    }

    isoGroup2 = game.add.group();
    alertsGroup = game.add.group();

    /*if(isContinuing){
        SaveManager.continueGame();
        for(var y = 0; y < map.height; ++y){
            for(var x = 0; x < map.width; ++x){
            var tile = tile_buildings[y][x];
                if(tile != null){
                    var level = tile.level;
                    switch(tile.name){
                        case 'wheat':
                            buildings.create_wheat(tile.tile_x,tile.tile_y,isoGroup2);
                            break;
                        case 'milk':
                            buildings.create_milk(tile.tile_x,tile.tile_y,isoGroup2);
                            break;
                        case 'lemon':
                            buildings.create_lemon(tile.tile_x,tile.tile_y,isoGroup2);
                            break;
                        case 'stand':
                            buildings.create_stand(tile.tile_x,tile.tile_y,isoGroup2);
                            break;
                    }

                    if(level != null){
                        var b = tile_buildings[y][x];
                        b.level = level;
                        if(level >= 2){
                            var xyy;
                            for(xyy = 1; xyy<level;xyy++){
                                starEffect(b.x,b.y,xyy);
                            }
                            buildings.upgrade_production_building(b,level);
                        }
                    }

                }

            }
        }

        currentStatsManager = info.statsManager;
        currentStatsManager.updateDestination = function(){
            var mile = 0;
            var manager = this;
            this.possibleDestinations.forEach(function(element,index,array){
                if(manager.totalRecollectedMoney >= element.needed){
                    if(mile <= element.needed){
                        mile = element.needed;
                        manager.destination = element.text;
                        manager.destinationImage = element.image;
                        manager.destinationRank = index;
                    }
                }
            });
        }
        health = info.health;
        // currentWaveIndex se lee directo en el manager

    }*/

        buildings.create_wheat(19,17,isoGroup2);
        buildings.create_milk(19,18,isoGroup2);
        buildings.create_lemon(19,19,isoGroup2);
        buildings.create_stand(21,16,isoGroup2);
        buildings.create_stand(19,16,isoGroup2);

        currentStatsManager = new StatsManager();
    

    buildings.create_house(26,18,isoGroup2);
    buildings.create_garage(27,18,isoGroup2);
    game.iso.simpleSort(isoGroup2);
    

    currentManager = new WaveManager();
    currentManager.StartWaves();

    

    isoDraggableGroup = game.add.group();
    isoDraggableGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE;

    /*var house = game.add.isoSprite(8*50, 5*50 , 0,'house', 0, isoGroup2);
    house.name = 'house';
    house.building_type = 'house';
    house.anchor.setTo(0.5,0.64,0.0);
    house.scale.set(1.0);
    buildings.create_building(house);*/

    

    //buildings.create_wheat(9,5,isoGroup2);
    

    isoCursor = new Phaser.Plugin.Isometric.Point3();
    loadingBarUpdate(loadingbarImage,100,100,game);

    label2 = game.add.text(game.width/2, game.height/2 - game.height/3, "Draggable", { font: "bold 30px Arial", fill: "#FFFFFF" });
    label2.fixedToCamera = true;
    label2.anchor.set(0.5);
    label2.stroke =  'black';
    label2.strokeThickness=2;
    label2.alpha = 0.0;

    label1 = game.add.text(game.width/2, game.height/2, "", { font: "bold 40px Arial", fill: "#FFFFFF" });
    label1.fixedToCamera = true;
    label1.anchor.set(0.5);
    label1.stroke =  'black';
    label1.strokeThickness=2;

    label1.inputEnabled = true;
    //label1.input.enableDrag();
    //label1.input.enableSnap(32, 32, true, true);

    label3 = game.add.text(game.width - 40, 10, "Ir al menu", { font: "bold 10px Arial", fill: "#FFFFFF" });
    label3.fixedToCamera = true;
    label3.anchor.set(0.5);
    label3.stroke =  'black';
    label3.strokeThickness=2;
    label3.alpha = 0.0;

    label3.inputEnabled = true;
    //startGameText.input.enableDrag();
    label3.events.onInputDown.add(this.toMenu, this);

    wave_text = game.add.text(game.width/2 + 8*10 + 20 ,5, "Ronda: 1", { font: "bold 12px Arial", fill: "#FFFFFF" });
    wave_text.shadowColor = 'rgba(0,0,0,1.0)';
    wave_text.shadowOffsetX = 1;
    wave_text.shadowOffsetY = 2;
    



    next_wave_text = game.add.text(game.width/2 - game.width/7,5, "Tiempo para la siguiente ronda:", { font: "bold 12px Arial", fill: "#FFFFFF" });
    next_wave_text.shadowColor = 'rgba(0,0,0,1.0)';
    next_wave_text.shadowOffsetX = 1;
    next_wave_text.shadowOffsetY = 2;

    label4 = game.add.text(10, 10, "Ir al menu", { font: "bold 10px Arial", fill: "#FFFFFF" });
    label4.fixedToCamera = true;
    label4.anchor.set(0.5);
    label4.stroke =  'black';
    label4.strokeThickness=2;
    label4.alpha = 0.4;

    game.input.addPointer();
    game.input.enableDrag = true;
   

    toolbarPopupGroup = game.add.group();
    toolbarPopupGroup.x = 0;
    toolbarPopupGroup.y = 24;
    toolbar_popup_menu = new Phaser.Sprite(game, 0 , 0, 'toolbar_popup_menu' , 0);
    toolbar_popup_menu.scale.setTo(0.47,0.8);
    toolbar_popup_menu.anchor.setTo(0.0);
    toolbarPopupGroup.alpha = 0.0;
    toolbarPopupGroup.inputEnabled = false;

    toolbarPopupGroup.add(toolbar_popup_menu);

    toolbarGroup = game.add.group();
    toolbar_menu = new Phaser.Sprite(game, 0 , 0, 'toolbar' , 0);
    if(!isLandscape)toolbar_menu.scale.setTo(game.width/toolbar_menu.width,0.47);
    else toolbar_menu.scale.setTo(game.width/toolbar_menu.width,0.62);
    toolbarGroup.add(toolbar_menu);

    
    toolbarGroup.x = 0;
    toolbarGroup.y = game.height - toolbar_menu.height;


    if(!isLandscape){
        toolbar_menu_noportrait = new Phaser.Sprite(game, 0 , 0, 'toolbar_noportrait' , 0);
        toolbar_menu_noportrait.scale.setTo(0.47);
        toolbar_menu_noportrait.alpha = 0.0;
        toolbarGroup.add(toolbar_menu_noportrait);
    }
    else{
        toolbar_menu_noportrait = new Phaser.Sprite(game, 0 , 0, 'toolbar' , 0);
        toolbar_menu_noportrait.scale.setTo(1.0,0.62);
        toolbar_menu_noportrait.alpha = 0.0;
        toolbarGroup.add(toolbar_menu_noportrait);


        toolbar_portrait = new Phaser.Sprite(game, 39 , 36, 'portrait' , 0);
        toolbar_portrait.anchor.setTo(0.5);
        toolbar_portrait.scale.setTo(0.8);
        toolbarGroup.add(toolbar_portrait);
    }

    toolbar_image = new Phaser.Sprite(game,39,40,'transparent', 0);
    toolbar_image.anchor.set(0.5);
    toolbar_image.scale.setTo(0.5);
    toolbarGroup.add(toolbar_image);

    toolbar_text_title = game.add.text(70, 15, "", { font: "bold 20px Arial", fill: "#000000" });
    toolbarGroup.add(toolbar_text_title);

    toolbar_text_2 = game.add.text(70, 15, LocalizableStrings.getString("game-confirmconstruction"), { font: "bold 20px Arial", fill: "#000000" });
    toolbar_text_2.alpha = 0.0;
    toolbarGroup.add(toolbar_text_2);

    toolbar_text_2_desc = game.add.text(90, 45, "400", { font: "14px Arial", fill: "#000000" });
    toolbar_text_2_desc.alpha = 0.0;
    toolbar_text_2_desc.anchor.setTo(0.0,0.5);
    toolbarGroup.add(toolbar_text_2_desc);

    toolbar_image_2 = new Phaser.Sprite(game,80,45,'money_icon', 0);
    toolbar_image_2.alpha = 0.0;
    toolbar_image_2.anchor.setTo(0.5);
    toolbar_image_2.scale.setTo(0.5);
    toolbarGroup.add(toolbar_image_2);

    toolbar_text_desc = game.add.text(70, 35, "", { font: "bold 14px Arial", fill: "#000000" });
    toolbarGroup.add(toolbar_text_desc);

    toolbar_text_level = game.add.text(70, 50, "", { font: "bold 14px Arial", fill: "#000000" });
    toolbarGroup.add(toolbar_text_level);

    toolbar_button = new Phaser.Sprite(game,0,0,'toolbar_button', 0);
    toolbar_button.anchor.setTo(0.5);
    toolbar_button.scale.setTo(0.5);
    toolbar_button.alpha = 0.0;

    toolbar_button.x = toolbar_menu.width - toolbar_button.width + 30;
    toolbar_button.y = toolbar_menu.height - toolbar_button.height + 15;

    toolbarGroup.add(toolbar_button);

    toolbar_button.inputEnabled = true;
    toolbar_button.events.onInputDown.add(this.handleToolbarButton, this);

    toolbar_button.inputEnabled = false;

    toolbar_button_confirm = new Phaser.Sprite(game,0,0,'toolbar_button', 0);
    toolbar_button_confirm.anchor.setTo(0.5);
    toolbar_button_confirm.scale.setTo(0.5);
    toolbar_button_confirm.alpha = 0.0;

    toolbar_button_confirm.x = toolbar_button.x;
    toolbar_button_confirm.y = toolbar_button.y;

    toolbarGroup.add(toolbar_button_confirm);

    toolbar_button_confirm.inputEnabled = true;
    toolbar_button_confirm.events.onInputDown.add(this.handleToolbarConfirmBuild, this);

    toolbar_button_confirm.inputEnabled = false;

    toolbar_button_confirm_text = game.add.text(0, 0, LocalizableStrings.getString("game-confirm"), { font: "bold 12px Arial", fill: "#000000" });
    toolbar_button_confirm_text.anchor.setTo(0.5);
    toolbar_button_confirm_text.alpha = 0.0;

    toolbar_button_confirm_text.x = toolbar_button_confirm.x;
    toolbar_button_confirm_text.y = toolbar_button_confirm.y;

    toolbarGroup.add(toolbar_button_confirm_text);

    toolbar_button_cancel = new Phaser.Sprite(game,0, 0,'toolbar_button', 0);
    toolbar_button_cancel.anchor.setTo(0.5);
    toolbar_button_cancel.scale.setTo(0.5);
    toolbar_button_cancel.alpha = 0.0;

    toolbar_button_cancel.x = toolbar_button.x - toolbar_button.width;
    toolbar_button_cancel.y = toolbar_button.y;

    toolbarGroup.add(toolbar_button_cancel);

    toolbar_button_cancel.inputEnabled = true;
    toolbar_button_cancel.events.onInputDown.add(this.handleToolbarCancel, this);

    toolbar_button_cancel.inputEnabled = false;

    toolbar_button_cancel_text = game.add.text(0,0, LocalizableStrings.getString("game-cancel"), { font: "bold 12px Arial", fill: "#000000" });
    toolbar_button_cancel_text.anchor.setTo(0.5);
    toolbar_button_cancel_text.alpha = 0.0;

    toolbar_button_cancel_text.x = toolbar_button_cancel.x;
    toolbar_button_cancel_text.y = toolbar_button_cancel.y;

    toolbarGroup.add(toolbar_button_cancel_text);




    toolbar_button_text = game.add.text(0, 0, "", { font: "bold 12px Arial", fill: "#000000" });
    toolbar_button_text.anchor.setTo(0.5);

    toolbar_button_text.x = toolbar_button.x;
    toolbar_button_text.y = toolbar_button.y;

    toolbarGroup.add(toolbar_button_text);

    //draggableResourceManager.create_slots();

    buildingCreatorGroup = game.add.group();
    buildingCreatorGroup.x = 0;
    buildingCreatorGroup.y = 340;
    buildings_menu = new Phaser.Sprite(game, 0 , 0, 'toolbar' , 0);
    buildings_menu.scale.setTo(0.47);
    //buildingCreatorGroup.add(buildings_menu);
    buildingBuilder.init_builder();
    //buildingBuilder.create_wheat_portrait(39,40);

    buildingCreatorGroup.setAll('fixedToCamera', true);

    //toolbarGroup.add(buildingCreatorGroup);

    toolbarGroup.setAll('fixedToCamera', true);
    

    
   
    buildingCreatorGroup.alpha = 0.0;
    buildingCreatorGroup.forEach(function(portrait){
        portrait.inputEnabled = false;
    });

    

 

    statusbarGroup = game.add.group();
    statusbarGroup.x = 0;
    statusbarGroup.y = -8;

    statusbar_wheat_icon = new Phaser.Sprite(game,20,20,'wheat_icon', 0);
    statusbar_wheat_icon.anchor.set(0.5);
    statusbar_wheat_icon.scale.setTo(0.5);
    statusbarGroup.add(statusbar_wheat_icon);

    statusbar_wheat_text = game.add.text(35, 20, "0", { font: "bold 14px Arial", fill: "#FFFFFF" });
    statusbar_wheat_text.shadowColor = 'rgba(0,0,0,1.0)';
    statusbar_wheat_text.shadowOffsetX = 1;
    statusbar_wheat_text.shadowOffsetY = 2;
    statusbar_wheat_text.anchor.setTo(0.0,0.5);
    statusbarGroup.add(statusbar_wheat_text);

    statusbar_milk_icon = new Phaser.Sprite(game,65,20,'milk_icon', 0);
    statusbar_milk_icon.anchor.set(0.5);
    statusbar_milk_icon.scale.setTo(0.5);
    statusbarGroup.add(statusbar_milk_icon);

    statusbar_milk_text = game.add.text(80, 20, "0", { font: "bold 14px Arial", fill: "#FFFFFF" });
    statusbar_milk_text.shadowColor = 'rgba(0,0,0,1.0)';
    statusbar_milk_text.shadowOffsetX = 1;
    statusbar_milk_text.shadowOffsetY = 2;
    statusbar_milk_text.anchor.setTo(0.0,0.5);
    statusbarGroup.add(statusbar_milk_text);

    statusbar_lemon_icon = new Phaser.Sprite(game,110,20,'lemon_icon', 0);
    statusbar_lemon_icon.anchor.set(0.5);
    statusbar_lemon_icon.scale.setTo(0.5);
    statusbarGroup.add(statusbar_lemon_icon);

    statusbar_lemon_text = game.add.text(125, 20, "0", { font: "bold 14px Arial", fill: "#FFFFFF" });
    statusbar_lemon_text.shadowColor = 'rgba(0,0,0,1.0)';
    statusbar_lemon_text.shadowOffsetX = 1;
    statusbar_lemon_text.shadowOffsetY = 2;
    statusbar_lemon_text.anchor.setTo(0.0,0.5);
    statusbarGroup.add(statusbar_lemon_text);

    statusbar_money_icon = new Phaser.Sprite(game,game.width - 20 - 15 - 15,20,'money_icon', 0);
    statusbar_money_icon.anchor.set(0.5);
    statusbar_money_icon.scale.setTo(0.5);
    statusbarGroup.add(statusbar_money_icon);

    statusbar_money_text = game.add.text(game.width - 20 -20, 20, "0", { font: "bold 14px Arial", fill: "#FFFFFF" });
    statusbar_money_text.shadowColor = 'rgba(0,0,0,1.0)';
    statusbar_money_text.shadowOffsetX = 1;
    statusbar_money_text.shadowOffsetY = 2;
    statusbar_money_text.anchor.setTo(0.0,0.5);
    statusbarGroup.add(statusbar_money_text);

    statusbar_sound_icon = new Phaser.Sprite(game,game.width-20,isLandscape ? 40 : 40,game.sound.mute ? 'sound_off' : 'sound_on', 0);
    statusbar_sound_icon.anchor.set(0.35);
    statusbar_sound_icon.scale.setTo(0.5);
    statusbarGroup.add(statusbar_sound_icon);

    statusbar_sound_icon.inputEnabled = true;
    statusbar_sound_icon.events.onInputDown.add(this.muteGame);

    statusbarGroup.setAll('fixedToCamera', true);
    loadingText.destroy();
    loadingbarImage.destroy();

    wave_text.x = statusbar_money_icon.x - statusbarGroup.x - wave_text.width*1.4;
    wave_text.fixedToCamera = true;

    next_wave_text.x = !isLandscape ? statusbar_wheat_icon.x - statusbarGroup.x : statusbar_lemon_text.x - statusbarGroup.x + 20;
    next_wave_text.y = !isLandscape ? statusbar_money_icon.height : wave_text.y;
    next_wave_text.fixedToCamera = true;

    buttonCreateWheat = game.input.keyboard.addKey(Phaser.Keyboard.Z);

    buyable_items = new Array();

    var item = {};
    item.name = "Campo de trigo";
    item.price = 100;
    item.image = "wheat";
    item.description = "Produce trigo!";

    buyable_items[buyable_items.length] = item;

    var item = {};
    item.name = "Campo de trigo 2";
    item.price = 100;
    item.image = "wheat";
    item.description = "Produce trigo!";

    buyable_items[buyable_items.length] = item;

    /*var item = {};
    item.name = "Campo de trigo";
    item.price = 100;
    item.image = "wheat";
    item.description = "Produce trigo!";

    buyable_items[buyable_items.length] = item;

    var item = {};
    item.name = "Campo de trigo";
    item.price = 100;
    item.image = "wheat";
    item.description = "Produce trigo!";

    buyable_items[buyable_items.length] = item;*/

    buyableItemsGroup = game.add.group();
    buyableItemsGroup.x = 10;
    buyableItemsGroup.y = 40;

    var pos_item = 0;
    buyable_items.forEach(function(item){
        item.sprite = game.add.group();
        item.sprite.x = 0;
        item.sprite.y = 60*pos_item;

        item.sprite.bar_ = new Phaser.Sprite(game, 0 , 0, 'toolbar' , 0);
        item.sprite.bar_.scale.setTo(0.3);
        item.sprite.add(item.sprite.bar_);

        item.sprite.image_ = new Phaser.Sprite(game, 25 , 25, item.image , 0);
        item.sprite.image_.anchor.setTo(0.5);
        item.sprite.image_.scale.setTo(0.4);

        item.sprite.add(item.sprite.image_);

        item.sprite.title_ = game.add.text(50, 10, item.name, { font: "bold 14px Arial", fill: "#000000" });

        item.sprite.add(item.sprite.title_);

        item.sprite.description_ = game.add.text(50, 40, item.description, { font: "bold 12px Arial", fill: "#000000" });

        item.sprite.add(item.sprite.description_);

        item.sprite.button_ = new Phaser.Sprite(game, 235 , 30, 'toolbar_button' , 0);
        item.sprite.button_.scale.setTo(0.5,0.8);
        item.sprite.button_.anchor.setTo(0.5);

        
        item.sprite.add(item.sprite.button_);

        item.sprite.button_.inputEnabled = true;
        item.sprite.button_.events.onInputDown.add(BasicGame.Game.prototype.handleBuyButton, item);
        item.sprite.button_.inputEnabled = false;

        item.sprite.buttontextbuy_ = game.add.text(235, 30, "Comprar", { font: "bold 14px Arial", fill: "#000000" });
        item.sprite.buttontextbuy_.anchor.setTo(0.5);

        item.sprite.add(item.sprite.buttontextbuy_);


        item.sprite.buttontextprice_ = game.add.text(235, 50, "$"+item.price, { font: "bold 12px Arial", fill: "#000000" });
        item.sprite.buttontextprice_.anchor.setTo(0.5);

        item.sprite.add(item.sprite.buttontextprice_);

        buyableItemsGroup.add(item.sprite);

        pos_item++;
    });
    
    inventory.create_inventory();

    buyableItemsGroup.inputEnabled = false;

    toolbarPopupGroup.add(buyableItemsGroup);

    toolbarPopupGroup.setAll('fixedToCamera', true);

    

    BuildingPickerGroup_init();

    BuildingPickerGroup_resetChoices();

    BuildingPickerGroup_hidePicker();


    
    stands.init_group();

    //game.camera.scale = new Phaser.Point(0.8,0.8);

    isoGroup2.scale.set(game_scale);
    isoGroup.scale.set(game_scale);
    isoGroup3.scale.set(game_scale);
    alertsGroup.scale.set(game_scale);

    happinessBar = new ProgressBar(game, 0, 0, 100);
    happinessBarGroup = game.add.group();

    happinessBarGroup.add(happinessBar.background);
    happinessBarGroup.add(happinessBar);
    happinessBarGroup.add(happinessBar.foreground_fx);

    var sadIcon = game.add.sprite(-8,6,'sad_icon');
    sadIcon.tint = 0x000000;
    sadIcon.alpha = 0.65;
    sadIcon.anchor.set(0.5);
    sadIcon.scale.set(0.15);

    var smileIcon = game.add.sprite(108,6,'smile_icon');
    smileIcon.tint = 0x000000;
    smileIcon.alpha = 0.65;
    smileIcon.anchor.set(0.5);
    smileIcon.scale.set(0.15);

    happinessBarGroup.add(sadIcon);
    happinessBarGroup.add(smileIcon);

    happinessBarGroup.x = game.width - happinessBar.width - smileIcon.width*2;
    happinessBarGroup.y = toolbarGroup.y - happinessBar.height;

    happinessBarGroup.setAll('fixedToCamera', true);


    
    happinessBar.setProgress(health/100.0);
},

toMenu: function(){
    currentWave.DestroyLastWave();
    currentWave = null;
    game.state.start('Menu');
},
toGameover: function(){
    currentWave.DestroyLastWave();
    currentWave = null;
    game.state.start('Gameover');
},

handleTouchs: function(){
    if(!toolbarPopupGroup.inputEnabled && toolbar_menu_noportrait.alpha == 0.0){
        
        isoGroup2.forEach(function (tile) {
	    //Queremos ver si, al hacer click, el cursor termina en este tile o no
	    selectTileIfInbound(tile,false);
            if(tile.selected && !tile.isDraggableGroup){
                selectTiles(tile);
                if(tile.alert!=null){
                        BasicGame.Game.prototype.click_alert.call(tile);
                }
                if(tile.production_type == 'wheat')
                {
                    
                    game.iso.unproject(pointer,isoCursor,20);
                    //draggableResourceManager.create_wheat_resource(isoCursor.x/50,isoCursor.y/50,isoDraggableGroup,this);
                    
                }
                return;
                
            }
        });
        isoGroup.forEach(function (tile) {
	    selectTileIfInbound(tile,true); //Para ver si cursor esta en tile al momento de hacer click
            if(tile.selected && tile_buildings[tile.tile_y][tile.tile_x] == null){
                selectTiles(tile);
                if(tile.production_type == 'wheat')
                {
                    if(tile.alert!=null){
                        BasicGame.Game.prototype.click_alert.call(tile);
                    }
                    game.iso.unproject(pointer,isoCursor,20);
                    //draggableResourceManager.create_wheat_resource(isoCursor.x/50,isoCursor.y/50,isoDraggableGroup,this);
                    
                }
                return;
            }
	    
        }); 
        
    }
},
closePopupMenu: function(){
    if(selectedTile && selectedTile.building_type == 'garage'){
        buyable_items.forEach(function(item){
                item.sprite.button_.inputEnabled = false;
            });
            buyableItemsGroup.alpha = 0.0;
    }
    toolbarPopupGroup.alpha = 0.0;
    toolbarPopupGroup.inputEnabled = false;
},
togglePopupMenu: function(){
    inventory.hide_inventory();
    draggableResourceManager.slotGroup.alpha = 0.0;
    draggableResourceManager.slotGroup.forEach(function(slot){
        slot.inputEnabled = false;
    });
    if(toolbarPopupGroup.alpha == 0.0){
        if(selectedTile && selectedTile.building_type == 'garage'){
        buyable_items.forEach(function(item){
                item.sprite.button_.inputEnabled = true;
            });
            buyableItemsGroup.alpha = 1.0;
        }
        if(selectedTile && selectedTile.building_type == 'house')
        {
            inventory.show_inventory();
            draggableResourceManager.slotGroup.alpha = 1.0;
            draggableResourceManager.slotGroup.forEach(function(slot){
                slot.inputEnabled = true;
            });
        }
    }
    else{
        if(selectedTile && selectedTile.building_type == 'garage'){
        buyable_items.forEach(function(item){
                item.sprite.button_.inputEnabled = false;
            });
            buyableItemsGroup.alpha = 0.0;
        }
        if(selectedTile && selectedTile.building_type == 'house')
        {
            inventory.hide_inventory();
        }
    }
    toolbarPopupGroup.alpha = toolbarPopupGroup.alpha == 1.0 ? 0.0 : 1.0;
    toolbarPopupGroup.inputEnabled = !toolbarPopupGroup.inputEnabled;

    
},
toggleConfirmMenu: function(){
    toolbar_menu_noportrait.alpha = toolbar_menu_noportrait.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_text_title.alpha = toolbar_text_title.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_text_desc.alpha = toolbar_text_desc.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_text_level.alpha = toolbar_text_level.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_button.alpha = toolbar_button.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_button_text.alpha = toolbar_button_text.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_button.inputEnabled = !toolbar_button.inputEnabled;
    toolbar_image.alpha = toolbar_image.alpha == 0.0 ? 1.0 : 0.0;

    toolbar_text_2.alpha = toolbar_text_2.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_text_2_desc.alpha = toolbar_text_2_desc.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_image_2.alpha = toolbar_image_2.alpha == 0.0 ? 1.0 : 0.0;

    toolbar_button_cancel.alpha = toolbar_button_cancel.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_button_confirm.alpha = toolbar_button_confirm.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_button_cancel_text.alpha = toolbar_button_cancel_text.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_button_confirm_text.alpha = toolbar_button_confirm_text.alpha == 0.0 ? 1.0 : 0.0;

    toolbar_button_confirm.inputEnabled = !toolbar_button_confirm.inputEnabled;
    toolbar_button_cancel.inputEnabled = !toolbar_button_cancel.inputEnabled;
    
},
isConfirmMenuOpened: function(){
    return toolbar_button_confirm.alpha == 1.0;
},
openConfirmMenu: function(type){

    if(type == "upgrade"){
        toolbar_text_2.text = LocalizableStrings.getString("game-confirmupgrade");
        toolbar_image.loadTexture(selectedTile.key);
    }
    else{
        toolbar_text_2.text = LocalizableStrings.getString("game-confirmconstruction");
        toolbar_image.loadTexture(selectedTile.key);
        //toolbar_image.alpha = 0.0;
    }
    //toolbar_menu_noportrait.alpha = 1.0;
    toolbar_text_title.alpha = 0.0;//toolbar_text_title.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_text_desc.alpha = 0.0;//toolbar_text_desc.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_text_level.alpha = 0.0;
    toolbar_button.alpha = 0.0;
    toolbar_button_text.alpha = 0.0;
    toolbar_button.inputEnabled = false;
    

    toolbar_text_2.alpha = 1.0;
    toolbar_text_2_desc.alpha = 1.0;
    toolbar_image_2.alpha = 1.0;

    toolbar_button_cancel.alpha = 1.0;
    toolbar_button_confirm.alpha = 1.0;//toolbar_button_confirm.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_button_cancel_text.alpha = 1.0;//toolbar_button_cancel_text.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_button_confirm_text.alpha = 1.0;//toolbar_button_confirm_text.alpha == 0.0 ? 1.0 : 0.0;

    toolbar_button_confirm.inputEnabled = true;//!toolbar_button_confirm.inputEnabled;
    toolbar_button_cancel.inputEnabled = true;//!toolbar_button_cancel.inputEnabled;
    toolbar_button_confirm
    if(type == "upgrade"){
        toolbar_button_confirm.events.onInputDown.removeAll();
        toolbar_button_confirm.events.onInputDown.add(this.handleToolbarConfirmUpgrade, this);
    }
    else{
        toolbar_button_confirm.events.onInputDown.removeAll();
        toolbar_button_confirm.events.onInputDown.add(this.handleToolbarConfirmBuild, this);
        //toolbar_image.alpha = 0.0;
    }
    
},
closeConfirmMenu: function(){
    toolbar_menu_noportrait.alpha = 0.0;
    toolbar_text_title.alpha = 1.0;//toolbar_text_title.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_text_desc.alpha = 1.0;//toolbar_text_desc.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_text_level.alpha = 1.0;
    toolbar_button.alpha = 0.0;
    toolbar_button_text.alpha = 0.0;
    toolbar_button.inputEnabled = false;
    toolbar_image.alpha = 1.0;

    if(selectedTile != null && selectedTile.production_type != null && selectedTile.level < 3){
        toolbar_button.alpha = 1.0;
        toolbar_button_text.alpha = 1.0;
        toolbar_button.inputEnabled = true;
    }
    else if(selectedTile != null && selectedTile.production_type == null){
        selectedTile = null;
        selectTiles(null);
    }

    toolbar_text_2.alpha = 0.0;
    toolbar_text_2_desc.alpha = 0.0;
    toolbar_image_2.alpha = 0.0;

    toolbar_button_cancel.alpha = 0.0;
    toolbar_button_confirm.alpha = 0.0;//toolbar_button_confirm.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_button_cancel_text.alpha = 0.0;//toolbar_button_cancel_text.alpha == 0.0 ? 1.0 : 0.0;
    toolbar_button_confirm_text.alpha = 0.0;//toolbar_button_confirm_text.alpha == 0.0 ? 1.0 : 0.0;

    toolbar_button_confirm.inputEnabled = false;//!toolbar_button_confirm.inputEnabled;
    toolbar_button_cancel.inputEnabled = false;//!toolbar_button_cancel.inputEnabled;

    console.log(selectedTile);
    
},
handleToolbarButton: function(){
    button_click.play('',0.3);
    this.openConfirmMenu("upgrade");
},
handleToolbarConfirmBuild:function(){


    var reset = false;
    var resetResource = {};
    var snappedPointer = new Phaser.Plugin.Isometric.Point3(Math.floor(isoCursor.x/50.0)*50*game_scale,Math.floor(isoCursor.y/50.0)*50*game_scale);
        var snappedPointerXY;
        snappedPointerXY = game.iso.projectXY(snappedPointer,snappedPointerXY);
        isoGroup2.forEach(function (resource){
            if(resource != null && resource.isResource && resource.isDragableGroup)
            {
                if(resources.money - buildingBuilder.buyingProduct.price < 0){
                    sound_wrong.play('',0.7);
                    return;
                }
                button_click.play();
                up_short.play();
                if(resource.select_tile.tint == 0x00ff00){
                    console.log(resource._type);
                    if(resource._type == "wheat")
                    {
            
                        buildings.create_wheat(Math.floor(resource.isoX/50),Math.floor(resource.isoY/50),isoGroup2);
                        
                    }

                    if(resource._type == "milk")
                    {

                        buildings.create_milk(Math.floor(resource.isoX/50),Math.floor(resource.isoY/50),isoGroup2);
                        
                    }

                    if(resource._type == "lemon")
                    {
                        
                        buildings.create_lemon(Math.floor(resource.isoX/50),Math.floor(resource.isoY/50),isoGroup2);
                        
                    }

                    if(resource._type == "stand")
                    {
                        
                        buildings.create_stand(Math.floor(resource.isoX/50),Math.floor(resource.isoY/50),isoGroup2);
                        
                    }


                    circleEffect((resource.x)*game_scale-game.camera.x,(resource.y)*game_scale-game.camera.y);
                    resources.money -= buildingBuilder.buyingProduct.price;
                    reset = true;
                    resetResource = resource;
                    dragging = false;
                    game.world.bringToTop(resource);
                }
                
            }
            
        });
        if(reset)
        {
            // Funciono

            BasicGame.Game.prototype.closeConfirmMenu();
            buildingBuilder.buildingDraggableGroup.remove(resetResource);
            resetResource.select_tile.destroy();
            resetResource.destroy();
        }
},
handleToolbarConfirmUpgrade:function(){

    if(selectedTile == null){
        return;
    }
    if(resources.money - selectedTile.upgrade_cost < 0){
        sound_wrong.play('',0.7);
        return;
    }
    else{
        up_short.play();
        circleEffect((selectedTile.x)*game_scale-game.camera.x,(selectedTile.y)*game_scale-game.camera.y);
        starEffect(selectedTile.x ,selectedTile.y ,selectedTile.level);
        resources.money -= selectedTile.upgrade_cost;
        buildings.upgrade_production_building(selectedTile,selectedTile.level+1);
        BasicGame.Game.prototype.closeConfirmMenu();
        selectTiles(selectedTile);
    }
},
handleToolbarCancel:function(){
    console.log("Cancelar");
    BasicGame.Game.prototype.closeConfirmMenu();
    button_click.play('',0.3);
    isoGroup2.forEach(function (resource){
            if(resource != null && resource.isResource && resource.isDragableGroup)
            {
                    buildingBuilder.buildingDraggableGroup.remove(resource);
                    resource.select_tile.destroy();
                    resource.destroy();

                    dragging = false;
            }
            
        });
},
handleBuyButton: function(){
    BasicGame.Game.prototype.closePopupMenu();
    //buildingBuilder.create_wheat_portrait(250,75);
    BasicGame.Game.prototype.toggleConfirmMenu();

    game.iso.unproject(pointer,isoCursor,30);
    console.log(BasicGame.Game.prototype);
    buildingBuilder.create_draggable(isoCursor.x,isoCursor.y,buildingBuilder.buildingDraggableGroup,'wheat','wheat',buildingBuilder);
    buildingBuilder.buyingProduct = this;
    console.log(this.name);
},
click_alert: function(){
    console.log(this);
    var tile = this;
    if(this.alert != null){
        if(tile.building_type == 'production'){
            switch(tile.production_type){
            case 'wheat':
                resources.wheat += tile.production_rate;
                break;
            case 'milk':
                resources.milk += tile.production_rate;
                break;
            case 'lemon':
                resources.lemon += tile.production_rate;
                break;
            default:
                //title = '??';
                //tipo = '??';
            }
        }
        up_short.play();
        circleEffect((tile.x)*game_scale-game.camera.x,(tile.y)*game_scale-game.camera.y);
        this.alert.destroy();
        this.alert = null;
        this.pie.destroy();
        this.pie = null;
    }
},
updateResources: function(){
    isoGroup2.forEach(function (tile) {
        if(tile.building_type == 'production'){
            if(tile.pie == null){
                tile.pie = new PieProgress(game, tile.x, tile.y-40, 8);
                alertsGroup.add(tile.pie);
                tile.pie.alpha = 0.8;
                console.log(tile);
                if(tile.production_type == 'wheat'){
                    tile.pie.color =  "rgb(255,255,0)";
                }
                if(tile.production_type == 'milk'){
                    tile.pie.color =  "rgb(255,255,255)";
                }
                if(tile.production_type == 'lemon'){
                    tile.pie.color = "rgb(255,139,43)";
                }
                
                tile.pie.posY = tile.pie.y; // just in case
                tile.pie.tween_ = game.add.tween(tile.pie);
                tile.pie.tween_.to({progress: 0,alpha: 1.0}, tile.production_time, Phaser.Easing.Linear.None, true, 0, 0, false);

                tile.pie.tween_.onComplete.add(function(){
                    this.pie.alpha = 0.0;
                    this.alert = game.add.group();
                    this.alert.x = this.x;
                    this.alert.y = this.y;
                    this.alert.message = game.add.sprite(0, -40, 'alert');
                    this.alert.posY = this.alert.y;
                    this.alert.message.anchor.setTo(0.5);
                    this.alert.message.scale.setTo(0.5);

                    this.alert.add(this.alert.message);

                    this.alert.icon = game.add.sprite(0,-40, this.production_type+'_icon');
                    this.alert.icon.anchor.setTo(0.5);
                    this.alert.icon.scale.setTo(0.4);

                    this.alert.add(this.alert.icon);

                    alertsGroup.add(this.alert);

                    this.alert.message.inputEnabled = true;
                    this.alert.message.events.onInputDown.add(BasicGame.Game.prototype.click_alert,this);
                },tile);
                
            }
        }
    });
},


update: function() {
    currentManager.StartWaves();
    Customer.customer_behavior();
	if(ending){
        stands.hide_all_menus();
        BuildingPickerGroup_hidePicker();
        return;
	}
    
	alertsGroup.forEach( function (alert) {
        if(!alert.isPie && !alert.isStar){
	       alert.y = alert.posY + Math.sin(game.time.time/200)*3;
        }
	});
    

    // vamos a tener que ir tirando las cosas a top para que otros elementos de UI puedan responder
    // al evento de touch

    
    
    game.world.bringToTop(touchSprite);
    game.world.bringToTop(buildingCreatorGroup);
    
    game.world.bringToTop(toolbarGroup);
    
    game.world.bringToTop(label3);
    game.world.bringToTop(toolbarPopupGroup);

    pointer = new Phaser.Point((game.input.activePointer.position.x + game.camera.x),
                                (game.input.activePointer.position.y + game.camera.y));
    game.iso.unproject(pointer , isoCursor,30);

    isoCursor = isoCursor.divide(game_scale,game_scale,game_scale);

    if(!game.paused){
        timeds ++;
        label4.text = timeds;
    }

    this.updateResources();

    if(!game.paused && game.time.time > time + 10000){
        time = game.time.time;
    }

    statusbar_wheat_text.text = resources.wheat;
    statusbar_milk_text.text = resources.milk;
    statusbar_lemon_text.text = resources.lemon;
    statusbar_money_text.text = resources.money;
    

    isoGroup2.forEach(function (tile) {

        selectTileIfInbound(tile,false);
    });

    isoGroup.forEach(function (tile) {
        selectTileIfInbound(tile,true);
    });

    move_camera_by_pointer(game.input.mousePointer);
    move_camera_by_pointer2(game.input.pointer1);
    
    
    if(buttonCreateWheat.isDown)
    {
        game.iso.unproject(game.input.activePointer.position,isoCursor,30);
        buildings.create_wheat(Math.floor(isoCursor.x/50.0),Math.floor(isoCursor.y/50.0),isoGroup2);
        
          
    }

    draggableResourceManager.update_resource_draggables(isoDraggableGroup);
    buildingBuilder.update_draggables();
    inventory.update_portraits();
    

    game.world.bringToTop(isoGroup3);
    game.world.bringToTop(isoGroup2);

    isoGroup3.forEachAlive(function (person) {
        if(person != null && person.thinking_baloon != null){
            game.world.bringToTop(person.thinking_baloon);
        }
    });

    game.world.bringToTop(touchSprite);
    game.world.bringToTop(statusbarGroup);
    
    game.world.bringToTop(alertsGroup);
    
    
    
    game.world.bringToTop(toolbarGroup);
    
    
    game.world.bringToTop(isoDraggableGroup);
    game.world.bringToTop(happinessBarGroup);
    game.world.bringToTop(buildingPickerGroup);
    if(radialMenuGroup)
    {
	   game.world.bringToTop(radialMenuGroup);
    }

    game.world.bringToTop(statusbarGroup);
    game.world.bringToTop(wave_text);
    game.world.bringToTop(next_wave_text);
    game.world.bringToTop(label3);
    


    if(health <= 0 && !ending){
        ending = true;
        gameoverText = game.add.text(game.width/2, game.height/2, LocalizableStrings.getString("game-gameover"), { font: "bold 30px Arial", fill: "#FFFFFF" });
        gameoverText.fixedToCamera = true;
        gameoverText.anchor.set(0.5);
        gameoverText.stroke =  'black';
        gameoverText.strokeThickness=2;
        gameoverText.alpha = 1.0;
        game.world.add(gameoverText);
        game.time.events.add(Phaser.Timer.SECOND * 2, this.toGameover, this);

        isoGroup.forEach(function(item){
            if(item.tint){
                item.tint = 0xaaaaaa;
            }
        })
        isoGroup2.forEach(function(item){
            if(item.tint){
                item.tint = 0xaaaaaa;
            }
        })
        isoGroup3.forEach(function(item){
            if(item.tint){
                item.tint = 0xaaaaaa;
            }
        })

        game.stage.backgroundColor = 0x111111;

        statusbarGroup.alpha = 0.0;
        toolbarGroup.alpha = 0.0;
        happinessBarGroup.alpha = 0.0;
        alertsGroup.alpha = 0.0;

        wave_text.alpha = 0.0;
        next_wave_text.alpha = 0.0;
    }
    if(gameoverText){
        game.world.bringToTop(gameoverText);
    }

    if(currentManager){
        var t = LocalizableStrings.getString("game-wavetext");
        wave_text.text = t+ currentManager.currentWaveIndex;
    }
    if(currentWave && currentWave.waveStartTimer && currentWave.waveStartTimer.duration > 0){
        var t = LocalizableStrings.getString("game-nextwavetext");
        next_wave_text.text = t + (currentWave.waveStartTimer.duration/1000).toFixed(2);
        //jingle_s.play();
        if(currentWave && currentWave.waveStartTimer.duration < 100 && !jingle_s.isPlaying){

            jingle_s.play(); //hacky
        }
    }
    else{
        next_wave_text.text = "";
    }
    
},

render: function () {
    //game.debug.spriteBounds(pie);
    //game.debug.text(game.time.fps || '--', 2, 70, "#00ff00"); 
    
},

muteGame: function(){
    game.sound.mute = !game.sound.mute;
    statusbar_sound_icon.loadTexture(game.sound.mute ? 'sound_off' : 'sound_on', 0);
}
}
