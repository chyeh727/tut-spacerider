document.addEventListener('DOMContentLoaded', function() {
    "use strict";
    var canvas = document.querySelector('#c');
    var w = window.innerWidth,
        h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    /*
        // blue fighter small
            483, 359, 31, 24
            
        // red fighter small
            776, 301, 31, 24
            
        // blue fighter
            211, 939, 99, 79 
            
        // red fighter
            224, 831, 99, 76
            
        // brown rock 1
            0, 520, 120, 100
        
        // gray rock 1
            0, 620, 120, 100
            
        // brown rock 2
            224, 664, 100, 84
            
        // gray rock 2
            224, 746, 100, 84
            
        // brown rock 3
            326, 454, 100, 93
      
        // gray rock 3
            326, 547, 100, 96
            
        // brown medium rock 1
            238, 454, 43, 40
        
        // gray medium rock 1
            281, 454, 48, 40
            
        // brown medium rock 2
            651, 448, 48, 40
            
        // gray medium rock 2
            674, 220, 47, 42
            
        // brown small rock 1
            406, 235, 25, 25
            
        // gray small rock 1
            406, 260, 28, 29
            
        // brown xs rock 1
            347, 814, 18, 20
            
        // gray xs rock 1
            365, 814, 17, 18
            
        // blue +o
            594, 961, 50, 50
            
        // red +o
            581, 661, 46, 46
            
        // red +
            603, 600, 46, 46
            
        // blue +
            435, 325, 46, 46
            
        // red x
            738, 614, 36, 37
            
        // red xo
            738, 650, 36, 36
            
        // blue xo
            740, 724, 37, 36
            
        // blue x
            698, 795, 37, 36
            
        // red bullet short
            856, 983, 16, 37
            
        // red bullet long
            856, 926, 16, 57
            
        // blue bullet short
            858, 475, 15, 37
            
        // blue bullet long
            848, 480, 10, 57
            
        // blue shield badge
            777, 678, 34, 34
            
        // blue star badge
            776, 895, 34, 34
            
        // blue lightening badge
            539, 989, 34, 34
            
        // yellow lightening badge
            740, 761, 34, 34
            
        // yellow star badge
            607, 857, 34, 34
            
        // yellow shield badge
            481, 325, 34, 33
            
        // lightening
            809, 838, 20, 29
            
        // times
            382, 814, 17, 17
        
        // 0
            367, 644, 19, 20
            
        // 1
            205, 688, 20, 20
            
        // 2
            406, 290, 19, 20
            
        // ring 2
            0, 156, 144, 138
            
        // ring 1
            0, 293, 143, 120
            
        // ring 0
            0, 411, 133, 100
    */
    var Ship = function() {
        this.direction = [0, 1];
        this.position = [w, h * 3 / 4];
        this.spritParams = [100, 700, 50, 50];
    };
    Ship.prototype.draw = function() {
        
    };
    
    var ctx = canvas.getContext('2d');
    
    // the sprite sheet
    var sprites = new Image();
    sprites.onload = function() {
    
        ctx.drawImage(
            sprites,
            0, 411, 133, 100,
            210, 210, 133, 100
        );
    
                      
        
    };
    sprites.src = 'sheet.png';

});
