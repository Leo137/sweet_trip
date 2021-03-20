function toGame(){
    SaveManager.resetSave();
    button_click.play();
    game.state.start('Game');
}

function toGameContinue(){
    button_click.play();

    isContinuing = true;
    game.state.start('Game');
}

var button_click;
var up_short;
var sound_wrong;
var coin_get;
var unhappy;
var happy_2;
var jingle_s;
var isContinuing = false;

function colorToHex(color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    return rgb;
};


BasicGame.Menu = function(){ }; 
 

BasicGame.Menu.prototype = { 

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

    LocalizableStrings.loadFile();
    GameVarsData.loadFile();
    

    game.load.json('customerTypeData','assets/config/customerTypeData.json');
    game.load.json('waveData', 'assets/config/waveData.json');
    pieProgressPie = new PieProgress(game, game.width/2,game.height/2, 16);

    game.load.image('logo', 'assets/sprites/logo.png');
    game.load.image('loadingbar','assets/sprites/loadingbar.png');
    
    game.load.image('map','assets/tiles/roadTiles.png');
    game.load.tilemap('terrain','assets/maps/terrain.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.audio('button_click', 'assets/sfx/button_click.mp3');
    game.load.audio('up_short', 'assets/sfx/upshort.ogg');
    game.load.audio('sound_wrong','assets/sfx/sound_wrong.mp3');
    game.load.audio('coin_get','assets/sfx/coin.ogg');

    game.load.audio('unhappy','assets/sfx/unhappy.mp3');
    game.load.audio('happy_2','assets/sfx/happy_2.mp3');

    game.load.audio('jingle','assets/sfx/jingle.mp3');



},

create: function() {
    pieProgressPie.destroy();
    pieProgressPie = null;


    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.logo = game.add.sprite(game.width/2, game.height/2, 'logo');
    this.logo.anchor.setTo(0.5,0.5);
    this.logo.scale.setTo(0.8);

    game.stage.backgroundColor = '#787878';



    this.startGameText = game.add.text(game.width/2, game.height/2 + game.height/3, LocalizableStrings.getString("menu-startgametext"), { font: "bold 34px Arial", fill: "#FFFFFF" });

    //this.startGameText.fixedToCamera = true;
    this.startGameText.anchor.set(0.5);
    this.startGameText.stroke =  'black';
    this.startGameText.strokeThickness=2;

    this.startGameText.inputEnabled = true;
    //startGameText.input.enableDrag();
    this.startGameText.events.onInputDown.add(toGame, this);


    if(SaveManager.hasData()){
        this.continueGameText = game.add.text(game.width/2, game.height/2 + game.height/2.5, LocalizableStrings.getString("menu-continuegametext"), { font: "bold 34px Arial", fill: "#FFFFFF" });
        this.continueGameText.fixedToCamera = true;
        this.continueGameText.anchor.set(0.5);
        this.continueGameText.stroke =  'black';
        this.continueGameText.strokeThickness=2;

        this.continueGameText.inputEnabled = true;
        this.continueGameText.events.onInputDown.add(toGameContinue, this);

        if(isLandscape){
            this.startGameText.y -= 30;
        }
        else{
            this.startGameText.y -= 30;
        }
    }


    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    if(isLandscape){
        this.scale.minWidth = 520;
        this.scale.minHeight = 240;
        this.scale.maxWidth = 1040;
        this.scale.maxHeight = 480;
    }
    else{
        this.scale.minWidth = 320;
        this.scale.minHeight = 440;
        this.scale.maxWidth = 640;
        this.scale.maxHeight = 960;
    }

    // Center canvas
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // Block portrait on mobile devices
    if(!this.game.device.desktop){
        this.scale.forceOrientation(isLandscape, !isLandscape);
        this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
    }

    // Start Preloader
    this.scale.setScreenSize(true);

    // audio 
    button_click = game.add.audio('button_click');
    up_short = game.add.audio('up_short');
    sound_wrong = game.add.audio('sound_wrong');
    coin_get = game.add.audio('coin_get');
    happy_2 = game.add.audio('happy_2');
    unhappy = game.add.audio('unhappy');
    jingle_s = game.add.audio('jingle');

    this.time_2 = game.time.time;
    game.stage.backgroundColor = 0x6680CC;
},

enterIncorrectOrientation: function(){
    game.orientated = false;
    document.getElementById('orientation').style.display = 'block';
    game.paused = true;
},

leaveIncorrectOrientation: function(){
    game.orientated = true;
    game.paused = false;
    this.scale.setScreenSize(true);
    document.getElementById('orientation').style.display = 'none';
},




update: function() {
    if(game.time.time > time + 50){
        time = game.time.time;
        
        this.logo.y = game.height/2 + Math.sin(game.time.time/200)*3;
        this.logo.angle = Math.sin(game.time.time/800)*0.2;
    }

    /*if(game.time.time > this.time_2 + 10){
        this.time_2 = game.time.time;
        if(this.c == null){
            this.o = game.stage.backgroundColor;
            var r = Phaser.Color.getRed(this.o);
            var g = Phaser.Color.getGreen(this.o);
            var b = Phaser.Color.getBlue(this.o);

            var min = Phaser.Math.clamp(((r+g+b)/3)-40,0,255);
            var max = Phaser.Math.clamp(((r+g+b)/3)+80,0,255);
            this.c = Phaser.Color.getRandomColor(min,max,255);
            this.step = 1;
        }

        var r1 = Phaser.Color.getRed(this.o);
        var r2 = Phaser.Color.getRed(this.c);
        var g1 = Phaser.Color.getGreen(this.o);
        var g2 = Phaser.Color.getGreen(this.c);
        var b1 = Phaser.Color.getBlue(this.o);
        var b2 = Phaser.Color.getBlue(this.c);
        this.step++;
        game.stage.backgroundColor = Phaser.Color.interpolateRGB(r1,r2,g1,g2,b1,b2,30,this.step);
        
        if(this.step > 30){
            this.c = null;
        }
    }*/


}

}

