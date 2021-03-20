var currentStatsManager;
function StatsManager(){
    this.customersHappy = 0;
    this.customersUnhappy = 0;
    this.finishedWaves = 0;
    this.totalRecollectedMoney = 0;
    this.destination = LocalizableStrings.getString("destinations-nothing");
    this.destinationImage = '';
    this.destinationRank = 0;

    this.possibleDestinations = [];
    this.possibleDestinations[this.possibleDestinations.length] = {text: LocalizableStrings.getString("destinations-nothing"), image:'destination_nothing',needed: 0};
    this.possibleDestinations[this.possibleDestinations.length] = {text: LocalizableStrings.getString("destinations-pool"),image:'destination_pool',needed: 500};
    this.possibleDestinations[this.possibleDestinations.length] = {text: LocalizableStrings.getString("destinations-shopping"),image:'destination_shopping',needed: 1000};
    this.possibleDestinations[this.possibleDestinations.length] = {text: LocalizableStrings.getString("destinations-beach"),image:'destination_beach',needed: 2000};
    this.possibleDestinations[this.possibleDestinations.length] = {text: LocalizableStrings.getString("destinations-amusement"),image:'destination_amusement',needed: 3000};
    this.possibleDestinations[this.possibleDestinations.length] = {text: LocalizableStrings.getString("destinations-island"),image:'destination_island',needed: 5000};
    this.possibleDestinations[this.possibleDestinations.length] = {text: LocalizableStrings.getString("destinations-moon"),image:'destination_moon',needed: 10000};

    this.updateDestination = function(){
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
}

function toMenu(){
    button_click.play();
    
    game.state.start('Menu');
}

BasicGame.Gameover = function(){ }; 
 

BasicGame.Gameover.prototype = { 

preload: function() {


},

create: function() {

    game.world.setBounds(0,0,game.width + 460,game.height+250);
    game.camera.setBoundsToWorld();
    if(currentStatsManager!=null){
        currentStatsManager.updateDestination.call(currentStatsManager);
    }

    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.logo = game.add.sprite(10, 20, 'logo');
    this.logo.anchor.setTo(0.0,0.5);
    this.logo.scale.setTo(0.5);

    game.stage.backgroundColor = '#787878';

    this.labelsGroup = game.add.group();


    this.statsText = game.add.text(10 + this.logo.width + 10, 20, "------ "+LocalizableStrings.getString("gameover-results"), { font: "bold 30px Arial", fill: "#FFFFFF" });
    if(!isLandscape){
        console.log(this.statsText);
        this.statsText.x = 10;
        this.statsText.y = 50;
        this.statsText.text = LocalizableStrings.getString("gameover-results");
    }
    this.statsText.fixedToCamera = true;
    this.statsText.anchor.set(0.0,0.5);
    this.statsText.stroke =  'black';
    this.statsText.strokeThickness=2;

    this.customersHappyLabel = game.add.text(game.width/2 - 10, 50, LocalizableStrings.getString("gameover-clientsserved"), { font: "bold 18px Arial", fill: "#FFFFFF" });
    this.customersHappyLabel.fixedToCamera = true;
    this.customersHappyLabel.anchor.set(1.0,0.5);
    this.customersHappyLabel.stroke =  'black';
    this.customersHappyLabel.strokeThickness=2;

    this.customersHappyValue = game.add.text(game.width/2 + 5, 50, "00000", { font: "bold 18px Arial", fill: "#FFFFFF" });
    this.customersHappyValue.fixedToCamera = true;
    this.customersHappyValue.anchor.set(0.0,0.5);
    this.customersHappyValue.stroke =  'black';
    this.customersHappyValue.strokeThickness=2;

    this.customersHappyValue.text = currentStatsManager.customersHappy;

    this.customersUnhappyLabel = game.add.text(game.width/2 - 10, 70, LocalizableStrings.getString("gameover-clientsnonserved"), { font: "bold 18px Arial", fill: "#FFFFFF" });
    this.customersUnhappyLabel.fixedToCamera = true;
    this.customersUnhappyLabel.anchor.set(1.0,0.5);
    this.customersUnhappyLabel.stroke =  'black';
    this.customersUnhappyLabel.strokeThickness=2;

    this.customersUnhappyValue = game.add.text(game.width/2 + 5, 70, "00000", { font: "bold 18px Arial", fill: "#FFFFFF" });
    this.customersUnhappyValue.fixedToCamera = true;
    this.customersUnhappyValue.anchor.set(0.0,0.5);
    this.customersUnhappyValue.stroke =  'black';
    this.customersUnhappyValue.strokeThickness=2;

    this.customersUnhappyValue.text = currentStatsManager.customersUnhappy;

    this.finishedWavesLabel = game.add.text(game.width/2 - 10, 90, LocalizableStrings.getString("gameover-roundsfinished"), { font: "bold 18px Arial", fill: "#FFFFFF" });
    this.finishedWavesLabel.fixedToCamera = true;
    this.finishedWavesLabel.anchor.set(1.0,0.5);
    this.finishedWavesLabel.stroke =  'black';
    this.finishedWavesLabel.strokeThickness=2;

    this.finishedWavesValue = game.add.text(game.width/2 + 5, 90, "00000", { font: "bold 18px Arial", fill: "#FFFFFF" });
    this.finishedWavesValue.fixedToCamera = true;
    this.finishedWavesValue.anchor.set(0.0,0.5);
    this.finishedWavesValue.stroke =  'black';
    this.finishedWavesValue.strokeThickness=2;

    this.finishedWavesValue.text = Phaser.Math.clamp(currentStatsManager.finishedWaves,0,900000); // :<

    this.totalRecollectedMoneyLabel = game.add.text(game.width/2 - 10, 110, LocalizableStrings.getString("gameover-moneyrecollected"), { font: "bold 18px Arial", fill: "#FFFFFF" });
    this.totalRecollectedMoneyLabel.fixedToCamera = true;
    this.totalRecollectedMoneyLabel.anchor.set(1.0,0.5);
    this.totalRecollectedMoneyLabel.stroke =  'black';
    this.totalRecollectedMoneyLabel.strokeThickness=2;

    this.totalRecollectedMoneyValue = game.add.text(game.width/2 + 5, 110, "00000", { font: "bold 18px Arial", fill: "#FFFFFF" });
    this.totalRecollectedMoneyValue.fixedToCamera = true;
    this.totalRecollectedMoneyValue.anchor.set(0.0,0.5);
    this.totalRecollectedMoneyValue.stroke =  'black';
    this.totalRecollectedMoneyValue.strokeThickness=2;

    this.totalRecollectedMoneyValue.text = currentStatsManager.totalRecollectedMoney;

    this.lineLabel = game.add.text(game.width/2, 130, "-----------------------------------", { font: "bold 18px Arial", fill: "#FFFFFF" });
    this.lineLabel.fixedToCamera = true;
    this.lineLabel.anchor.set(0.8,0.5);
    this.lineLabel.stroke =  'black';
    this.lineLabel.strokeThickness=2;

    this.destinationLabel = game.add.text(game.width/2 - 10, 160, LocalizableStrings.getString("gameover-finaldestiny"), { font: "bold 24px Arial", fill: "#FFFFFF" });
    this.destinationLabel.fixedToCamera = true;
    this.destinationLabel.anchor.set(1.0,0.5);
    this.destinationLabel.stroke =  'black';
    this.destinationLabel.strokeThickness=2;

    this.destinationValue = game.add.text(game.width/2 + 5, 160, "00000", { font: "bold 24px Arial", fill: "#FFFFFF" });
    if(!isLandscape){
        this.destinationValue.x = game.width/2;
        this.destinationValue.y = 185;
        this.destinationValue.anchor.set(0.5,0.5);
    }
    else{
        this.destinationValue.fixedToCamera = true;
        this.destinationValue.anchor.set(0.0,0.5);
    }
    this.destinationValue.stroke =  'black';
    this.destinationValue.strokeThickness=2;

    this.destinationValue.text = currentStatsManager.destination;

    this.labelsGroup.add(this.customersHappyLabel);
    this.labelsGroup.add(this.customersHappyValue);
    this.labelsGroup.add(this.customersUnhappyLabel);
    this.labelsGroup.add(this.customersUnhappyValue);
    this.labelsGroup.add(this.finishedWavesLabel);
    this.labelsGroup.add(this.finishedWavesValue);
    this.labelsGroup.add(this.totalRecollectedMoneyLabel);
    this.labelsGroup.add(this.totalRecollectedMoneyValue);
    this.labelsGroup.add(this.lineLabel);
    this.labelsGroup.add(this.destinationLabel);
    this.labelsGroup.add(this.destinationValue);

    if(isLandscape){
        this.labelsGroup.x = -30;
        this.labelsGroup.y = +20;
    }
    else{
        this.labelsGroup.x = +40;
        this.labelsGroup.y = +50;
        this.labelsGroup.scale.set(0.9);
    }

    this.destinationImageSprite = game.add.sprite(game.width/2,game.height/2+game.height/8,currentStatsManager.destinationImage);
    this.destinationImageSprite.anchor.set(0.5);

    this.destinationRankSprites = game.add.group();


    console.log(currentStatsManager.destinationRank);

    var x = 0;
    var width_group = 20;
    for(x = 0;x<currentStatsManager.destinationRank;x++){
        var star = game.add.sprite((currentStatsManager.destinationRank-x)*27,0,'star_icon');
        star.anchor.set(0.5);
        star.scale.set(30/star.width);
        this.destinationRankSprites.add(star);

        width_group +=27;
    }


    

    if(isLandscape){
        this.destinationImageSprite.scale.set(100/this.destinationImageSprite.width);
        this.destinationImageSprite.x = game.width/2 + this.destinationImageSprite.width/2 + 90;
        this.destinationImageSprite.y = this.labelsGroup.y + 87;

        
    }
    else{
        this.destinationImageSprite.y += 40;
        this.destinationImageSprite.scale.set(150/this.destinationImageSprite.width);
    }


    this.destinationRankSprites.x = this.destinationImageSprite.x - width_group/2 - 7.5/2;
    this.destinationRankSprites.y = this.destinationImageSprite.y + this.destinationImageSprite.height/2.5;

    this.menuText = game.add.text(game.width - 20, game.height/2 + game.height/2.2, LocalizableStrings.getString("gameover-tomenu"), { font: "bold 40px Arial", fill: "#FFFFFF" });
    if(isLandscape){
        this.menuText.y = game.height/2 + game.height/2.4;
    }
    this.menuText.fixedToCamera = true;
    this.menuText.anchor.set(1.0,0.5);
    this.menuText.stroke =  'black';
    this.menuText.strokeThickness=2;

    this.menuText.inputEnabled = true;
    //startGameText.input.enableDrag();
    this.menuText.events.onInputDown.add(toMenu, this);

},

update: function() {
    if(game.time.time > time + 50){
        time = game.time.time;
        game.stage.backgroundColor = Phaser.Color.getRandomColor(180,222,255);
        //logo.y = game.height/2 + Math.sin(game.time.time/200)*3;
    }


}

}

