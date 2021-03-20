var ProgressBar = function(game, x, y, width, color) {
    this._width = width;
    this._progress = 0;
    //this.bar = game.add.sprite(x,y,'loadingbar');
    Phaser.Sprite.call(this, game, x, y, 'progressBarForeground');

    game.world.add(this);
    this.background = game.add.sprite(x,y,'progressBarBackground');
    this.background.anchor.set(0.0);

    this.foreground_fx = game.add.sprite(x,y,'progressBarForeground');
    this.foreground_fx.anchor.set(0.0);
    this.foreground_fx.scale.setTo(width/this.width);
    this.foreground_fx.alpha = 0.0;
    this.foreground_fx.tint = 0x00FF00;
    this.foreground_fx.blendMode = PIXI.blendModes.ADD;

    var temp = this.width;
    this.background.scale.setTo(width/this.background.width);
    //this.size = width;

    this.isBar = true;
    this.anchor.set(0.0);
    this.scale.setTo((width)/this.width);

    this.size = this.width;
    this.cropRect = new Phaser.Rectangle(0, 0, this.size * 4, this.height*8);
    //this.scale.setTo((width)/this.width);
    this.crop(this.cropRect);
    this.foreground_fx.crop(this.cropRect);

    //this.size = width;

    this.tween = game.add.tween(this);

    this.color = color || "#fff";

    

    this.compositeTypes = [
      'source-over','source-in','source-out','source-atop',
      'destination-over','destination-in','destination-out','destination-atop',
      'lighter','darker','copy','xor'
    ];

    this.percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } 
    ];

    this.setProgress(1.0);
}

ProgressBar.prototype = Object.create(Phaser.Sprite.prototype);
ProgressBar.prototype.constructor = ProgressBar;

ProgressBar.prototype.updateProgress = function() {
    var progress = this._progress;
    progress = Phaser.Math.clamp(progress, 0.00001, 1.0);

    this.cropRect.width = (progress * this.size)*4 ;
    //this.cropRect.width = (progress * this.size)* ;
    //this.cropRect.x = -this.cropRect.width/2;
    this.updateCrop();
    this.foreground_fx.updateCrop();
    
    //this.tween.to( { width: (this.bar.width*progress) }, 300, Phaser.Easing.Bounce.Out, true, 0, 0, false);

    
}

ProgressBar.prototype.getColorForPercentage = function(pct){
    for (var i = 1; i < this.percentColors.length - 1; i++) {
        if (pct < this.percentColors[i].pct) {
            break;
        }
    }
    var lower = this.percentColors[i - 1];
    var upper = this.percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };

    var rgb = color.b | (color.g << 8) | (color.r << 16);
    return rgb;
    // return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
}

ProgressBar.prototype.setProgress = function(value) {
    var newProgress = Phaser.Math.clamp(value, 0, 1.0);
    this.tween.stop();
    this.tween = game.add.tween(this);
    this.tween.to( { progress:newProgress}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);

    if(newProgress>this.progress){
        if(this.tint_tween!=null){
            this.tint_tween.stop();
            this.tint_tween = null;
        }
        this.foreground_fx.tint = 0x00FF00;
        this.foreground_fx.alpha = 0.0;
        this.tint_tween = game.add.tween(this.foreground_fx);
        this.tint_tween.to( { alpha:1.0}, 150, Phaser.Easing.Linear.None, true, 0, 0, true);
    }
    else{
        if(this.tint_tween!=null){
            this.tint_tween.stop();
            this.tint_tween = null;
        }
        this.foreground_fx.tint = 0xFF0000;
        this.foreground_fx.alpha = 0.0;
        this.tint_tween = game.add.tween(this.foreground_fx);
        this.tint_tween.to( { alpha:1.0}, 150, Phaser.Easing.Linear.None, true, 0, 0, true);
    }

    var colorProgress = Phaser.Math.clamp(newProgress,0,0.9);

    // por alguna razon en mobile el algoritmo crashea con valores superiores a 0.9
    // don't ask why

    this.tint = this.getColorForPercentage(colorProgress);
}

Object.defineProperty(ProgressBar.prototype, 'progress', {
    get: function() {
        return this._progress;   
    },
    set: function(val) {
        this._progress = Phaser.Math.clamp(val, 0, 1.0);
        this.updateProgress();
    }
});