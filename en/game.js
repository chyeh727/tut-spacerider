document.addEventListener('DOMContentLoaded', function() {
    "use strict";
    const canvas = document.querySelector('#c');
    const splash = document.querySelector('#splash');

    // This is a one-time dimension recording.
    let w = window.innerWidth,
        h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    let playerExplosionSound = new Audio();
    playerExplosionSound.src = 'player_explosion.mp3';
    let enemyExplosionSound = new Audio();
    enemyExplosionSound.src = 'enemy_explosion.mp3';
    let laserSound = new Audio();
    laserSound.src = 'laser.mp3';

    /*
        // blue fighter small
            483, 359, 31, 24
            
        // red fighter small
            776, 301, 31, 24
            
        // blue fighter
            211, 939, 99, 77 
            
        // red fighter
            224, 831, 99, 76
            
        // brown rock 1
            0, 520, 120, 100
        
        // gray rock 1
            0, 620, 118, 96
            
        // brown rock 2
            224, 664, 100, 84
            
        // gray rock 2
            224, 746, 100, 84
            
        // brown rock 3
            327, 454, 98, 93
      
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
    let distance = function(a, b) {
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    };

    /* The base class for all entities.
     */
    class Entity {
        constructor() {
            this.direction = [1, 0];
            this.spriteCoords = [0, 0];
            this.spriteDimensions = [0, 0];
            this.position = [0, 0];
            this.velocity = 0;
            // in radians
            this.angle = 0;
            this.angleAdjustment = 0;
            // time to do something
            this.ttl = 0;
        }
        draw() {
            ctx.save();
            ctx.translate(
                this.position[0], 
                this.position[1]);
            ctx.rotate(-this.angle);
            ctx.drawImage(
                    sprites, 
                    this.spriteCoords[0], this.spriteCoords[1], 
                    this.spriteDimensions[0], this.spriteDimensions[1],
                    -this.spriteDimensions[0] / 2, 
                    -this.spriteDimensions[1] / 2, 
                    this.spriteDimensions[0], this.spriteDimensions[1]);
            ctx.restore();
        }
        turn(radians) {
            this.angle += radians;
            let a = this.angle + this.angleAdjustment;
            this.direction[0] = Math.cos(a);
            this.direction[1] = -Math.sin(a);
        }
        isOutOfSight() {
            let x = this.position[0],
                y = this.position[1];
            return (x < 0 || x > w || y < 0 || y > h);
        }
        calculateRadius() {
            return Math.sqrt(Math.pow(this.spriteDimensions[0], 2) + Math.pow(this.spriteDimensions[1], 2)) / 2 * 0.75;
        }
        collideWith(other) {
            return distance(this.position, other.position) <= (this.radius + other.radius);
        }
    }

    /*
     * The base of all bullets, no matter the enemies' or the players. They
     * have to be able to check whether they hit any target or not.
     */
    class Bullet extends Entity {
        constructor(p, a) {
            super();
            this.position = [p[0], p[1]];
            this.angle = a;
            this.angleAdjustment = Math.PI / 2;
            this.consumed = false;
        }
        move() {
            this.position[0] += this.direction[0] * this.velocity;
            this.position[1] += this.direction[1] * this.velocity;
        }
        calculateTip() {
            let l = this.spriteDimensions[1] / 2;
            return [this.position[0] + l * this.direction[0], this.position[1] + l * this.direction[1]];
        }
        hit(other) {
            return distance(this.calculateTip(), other.position) <= other.radius;
        }
    }

    class MyShortBullet extends Bullet {
        constructor(p, a) {
            super(p, a);
            this.spriteCoords = [858, 475];
            this.spriteDimensions = [15, 37];
            this.velocity = 16;
            this.turn(0);
        }
    }

    class NotMyShortBullet extends Bullet {
        constructor(p, a) {
            super(p, a);
            this.spriteCoords = [856, 983];
            this.spriteDimensions = [16, 37];
            this.velocity = 12;
            this.turn(Math.PI);
        }
    }

    class MyFighter extends Entity {
        constructor() {
            super();
            this.direction = [0, -1];
            this.spriteCoords = [243, 234];
            this.spriteDimensions = [103, 73];
            this.position = [w/2, h * 3 / 5];
            this.velocity = 0;
            this.angle = 0;
            this.angleAdjustment = Math.PI / 2;
            this.radius = this.calculateRadius();
            this.visible = false;
            this.ttl = 150;
            this.explodeStage = 0;
        }
        turnVisible() {
            this.visible = true;
            this.spriteCoords = [211, 939];
            this.spriteDimensions = [99, 77];
            this.radius = this.calculateRadius();
        }
        accelerate() {
            this.velocity = Math.min(10, this.velocity + 2);
        }
        decelerate() {
            this.velocity = Math.max(-10, this.velocity - 2);
        }
        move() {
            if (this.velocity > 0)
                this.velocity = Math.max(0, this.velocity - 0.4);
            else
                this.velocity = Math.min(0, this.velocity + 0.4);
            this.position[0] = (this.position[0] + this.direction[0] * this.velocity + w) % w;
            this.position[1] = (this.position[1] + this.direction[1] * this.velocity + h) % h;
        }
        shoot() {
            laserSound.play();
            myBullets.push(new MyShortBullet(this.position, this.angle));
        }
        explodeStage1() {
            this.spriteCoords = [594, 961];
            this.spriteDimensions = [50, 50];
            this.ttl = 2;
            this.explodeStage = 1;
        }
        explodeStage2() {
            this.spriteCoords = [435, 325];
            this.spriteDimensions = [46, 46];
            this.ttl = 3;
            this.explodeStage = 2;
        }
    }

    class EvilFighter extends Entity {
        constructor() {
            super();
            console.log('Evil fighter up');
            this.direction = [0, 1];
            this.spriteCoords = [423, 644];
            this.spriteDimensions = [97, 84];
            this.position = [w * Math.random(), 0];
            this.velocity = 4;
            this.angle = 0;
            this.angleAdjustment = -Math.PI / 2;
            this.destroyed = false;
            this.radius = this.calculateRadius();
            this.explodeStage = 0;
        }
        move() {
            // randomly pick a direction
            if (this.position[1] >= h / 3.5) {
                if (Math.random() < 0.5)
                    this.direction[0] = -0.8;
                else
                    this.direction[0] = 0.8;
                this.direction[1] = -0.6;
            }
            this.position[0] += this.direction[0] * this.velocity;
            this.position[1] += this.direction[1] * this.velocity;
        }
        shoot() {
            notMyBullets.push(new NotMyShortBullet(this.position, this.angle));
        }
        explodeStage1() {
            this.spriteCoords = [581, 661];
            this.spriteDimensions = [46, 46];
            this.ttl = 2;
            this.explodeStage = 1;
        }
        explodeStage2() {
            this.spriteCoords = [603, 600];
            this.spriteDimensions = [46, 46];
            this.ttl = 3;
            this.explodeStage = 2;
        }
    }

    /* The base of all rock-like stuff, including the debris.
     */
    class Rock extends Entity {
        constructor() {
            super();
            // spawn off a new rock from the upper part of the canvas
            this.position = [w * Math.random(), h * Math.random() / 3];
            this.velocity = Math.random() * 3 + 2;
            this.angle = Math.PI * Math.random();
            this.angleAdjustment = Math.PI * Math.random();
            this.distroyed = false;
        }
        move() {
            this.position[0] = (this.position[0] + this.direction[0] * this.velocity + w) % w;
            this.position[1] = (this.position[1] + this.direction[1] * this.velocity + h) % h;
        }
    }

    class Debris extends Rock {
        constructor(p, c, d) {
            super();
            this.position = [p[0], p[1]];
            this.spriteCoords = [c[0], c[1]];
            this.spriteDimensions = [d[0], d[1]];
            this.turn(0);
            this.ttl = 100;
        }
    }

    class BigRockA extends Rock {
        constructor() {
            super();
            this.spriteCoords = [224, 664];
            this.spriteDimensions = [100, 84];
            this.q = 2;
            this.turn(0);
            this.radius = this.calculateRadius();

            // The debris this rock is going to spawn off when it is destroyed.
            // We specify this because we want to make sure gray stays gray and
            // brown stays brown.
            this.debrisSpriteCoords = [406, 235];
            this.debrisSpriteDimensions = [25, 25];
        }
    }
    class BigRockB extends Rock {
        constructor() {
            super();
            this.spriteCoords = [0, 620];
            this.spriteDimensions = [118, 96];
            this.q = 2;
            this.turn(0);
            this.radius = this.calculateRadius();

            this.debrisSpriteCoords = [406, 260];
            this.debrisSpriteDimensions = [28, 29];
        }
    }
    class BigRockC extends Rock {
        constructor() {
            super();
            this.spriteCoords = [327, 454];
            this.spriteDimensions = [98, 93];
            this.q = 2;
            this.turn(0);
            this.radius = this.calculateRadius();

            this.debrisSpriteCoords = [406, 235];
            this.debrisSpriteDimensions = [25, 25];
        }
    }

    // A collection of rock types. We want to be able to randomly pick one.
    let rockTypes = [BigRockA, BigRockB, BigRockC];

    // the player's ship    
    let s = null;

    // lives
    let lives;

    // the enemies
    let evilFighters;

    // the bullet collections
    let myBullets, notMyBullets;

    // the rock collections, only big ones are harmful
    let rocks, debris;

    // some difficulity control
    let maxRockCount = 6,
        maxEvilFighterCount = 2;

    // some admin stuff
    let itvl, gameRolling = false;

    let pressedKeys = [];

    // key press handlers
    document.onkeydown = function(e) {
        if (!gameRolling) {
            letGameRoll();
        } else if (lives === -1) {
            splash.innerHTML = '';
            initGame();
        } else {
            if (e.which == 80) {
                clearInterval(itvl);
                gameRolling = false;
                splash.innerHTML = 'Press any key to resume';
            } else if (pressedKeys.indexOf(e.which) === -1) {
                pressedKeys.push(e.which);
            }
        }
    };
    document.onkeyup = function(e) {
        let keyIdx = pressedKeys.indexOf(e.which);
        if (keyIdx !== -1) {
            pressedKeys.splice(keyIdx, 1);
        }
    };

    let keyPressCallbacks = null;
    let cbPark = {
        // right
        39: function() {
            s.turn(-Math.PI / 15);
        },
        // left
        37: function() {
            s.turn(Math.PI / 15);
        },
        // up
        38: function() {
            s.accelerate();
        },
        // down
        40: function() {
            s.decelerate();
        },
        32: function() {
            s.shoot();
        }
    };

    // the sprite sheet
    let sprites = new Image();
    sprites.onload = function() {
        splash.innerHTML = 'Press any key to start';
        initGame();
    };
    sprites.src = 'sheet.png';

    let createNewEntities = function() {
        if (Math.random() < 0.04) {
            if (rocks.length < maxRockCount) {
                rocks.push(new rockTypes[Math.floor(Math.random() * rockTypes.length)]());
            }
        }
        if (Math.random() < 0.04) {
            if (evilFighters.length < maxEvilFighterCount) {
                evilFighters.push(new EvilFighter());
            }
        }
    };

    let move = function() {
        if (keyPressCallbacks) {
            for (let i = 0, len = pressedKeys.length; i < len; i++) {
                if (keyPressCallbacks[pressedKeys[i]])
                    keyPressCallbacks[pressedKeys[i]]();
            }
        }

        if (s !== null && !s.destroyed)
            s.move();

        for (let i = 0, len = rocks.length; i < len; i++) {
            rocks[i].move();
            if (s && s.visible && !s.destroyed) {
                if (rocks[i].collideWith(s)) {
                    s.destroyed = true;
                    playerDeathHandler();
                }
            }
        }

        for (let i = 0, len = evilFighters.length; i < len; i++) {
            if (!evilFighters[i].destroyed) {
                evilFighters[i].move();
                if (Math.random() < 0.1) {
                    evilFighters[i].shoot();
                }
                if (s && s.visible && !s.destroyed) {
                    if (evilFighters[i].collideWith(s)) {
                        evilFighters[i].destroyed = true;
                        s.destroyed = true;
                        evilFighters[i].explodeStage1();
                        playerDeathHandler();
                    }
                }
            }
        }

        for (let i = myBullets.length - 1; i >= 0; i--) {
            myBullets[i].move();
            for (let j = 0; j < rocks.length; j++) {
                if (!myBullets[i].consumed && myBullets[i].hit(rocks[j])) {
                    rocks[j].destroyed = true;
                    myBullets[i].consumed = true;
                    enemyExplosionSound.play();
                    // spawn off debris
                    for (let i = 0; i < 2; i++) {
                        let d = new Debris(rocks[j].position, rocks[j].debrisSpriteCoords, rocks[j].debrisSpriteDimensions);
                        // TODO adjust the speed and direction of the debris
                        debris.push(d);
                    }
                }
            }
            for (let j = 0; j < evilFighters.length; j++) {
                if (!myBullets[i].consumed && myBullets[i].hit(evilFighters[j])) {
                    evilFighters[j].destroyed = true;
                    myBullets[i].consumed = true;
                    evilFighters[j].explodeStage1();
                    enemyExplosionSound.play();
                }
            }
        }

        for (let i = notMyBullets.length - 1; i >= 0; i--) {
            notMyBullets[i].move();
            if (s && s.visible && !s.destroyed) {
                if (!notMyBullets[i].consumed && notMyBullets[i].hit(s)) {
                    s.destroyed = true;
                    notMyBullets[i].consumed = true;
                    playerDeathHandler();
                }
            }
        }

        for (let i = debris.length - 1; i >= 0; i--) {
            debris[i].move();
        }
    };

    /* Updates the internal timer of the entities.
     */
    let decreaseTTL = function() {
        if (s) {
            if (s.ttl !== 0) {
                s.ttl -= 1;
            } else if (s.explodeStage === 1) {
                s.explodeStage2();
            }
        }
        for (let i = debris.length - 1; i >= 0; i--) {
            debris[i].ttl -= 1;
        }
        for (let i = 0, len = evilFighters.length; i < len; i++) {
            if (evilFighters[i].ttl !== 0)
                evilFighters[i].ttl -= 1;
            else if (evilFighters[i].explodeStage === 1)
                evilFighters[i].explodeStage2();
        }
    };

    /* Puts things on the canvas or take them out.
     */
    let draw = function() {
        canvas.width = canvas.width;

        for (let i = myBullets.length - 1; i >= 0; i--) {
            if (myBullets[i].isOutOfSight() || myBullets[i].consumed) {
                myBullets.splice(i, 1);
            } else {
                myBullets[i].draw();
            }
        }

        for (let i = notMyBullets.length - 1; i >= 0; i--) {
            if (notMyBullets[i].isOutOfSight() || notMyBullets[i].consumed || notMyBullets[i].isOutOfSight()) {
                notMyBullets.splice(i, 1);
            } else {
                notMyBullets[i].draw();
            }
        }

        for (let i = rocks.length - 1; i >= 0; i--) {
            if (rocks[i].destroyed)
                rocks.splice(i, 1);
            else
                rocks[i].draw();
        }

        for (let i = evilFighters.length - 1; i >= 0; i--) {
            if ((evilFighters[i].explodeStage === 2 && evilFighters[i].ttl === 0) || evilFighters[i].isOutOfSight())
                evilFighters.splice(i, 1);
            else
                evilFighters[i].draw();
        }

        for (let i = debris.length - 1; i >= 0; i--) {
            if (debris[i].ttl === 0) {
                debris.splice(i, 1);
            } else {
                debris[i].draw();
            }
        }

        if (s !== null) {
            if (s.ttl === 0) {
                if (!s.visible)
                    s.turnVisible();
                else if (s.explodeStage === 2)
                    s = null;
            }
            if (s)
                s.draw();
        }

        drawLives();
    };

    let drawLives = function() {
        // my fighter small
        ctx.drawImage(sprites, 483, 359, 31, 24, 30, 30, 31, 24);
        // times
        ctx.drawImage(sprites, 382, 814, 17, 17, 76, 36, 17, 17);

        if (lives === 2)
            ctx.drawImage(sprites, 406, 290, 19, 20, 108, 34, 19, 20);
        else if (lives === 1)
            ctx.drawImage(sprites, 205, 688, 20, 20, 108, 34, 20, 20);
        else
            ctx.drawImage(sprites, 367, 644, 19, 20, 108, 34, 19, 20);
    };

    let bringOnMyNewFighter = function() {
        s = new MyFighter();
        keyPressCallbacks = cbPark;
        cbPark = null;
    };

    /* What do we do when our fighter crashes.
     */
    let playerDeathHandler = function() {
        playerExplosionSound.play();
        console.log('Death handler shouting, lives =', lives);
        cbPark = keyPressCallbacks;
        keyPressCallbacks = null;
        s.explodeStage1();
        if (lives-- === 0) {
            splash.innerHTML = 'You lost. Press any key to start again.';
        } else {
            setTimeout(bringOnMyNewFighter, 3 * 1000);
        }
    };

    /* Sets the game up with the initial state.
     */
    let initGame = function() {
        lives = 2;
        bringOnMyNewFighter();
        evilFighters = [];
        myBullets = [];
        notMyBullets = [];
        rocks = [];
        debris = [];
    };

    /* Gets the time running.
     */
    let letGameRoll = function() {
        splash.innerHTML = '';
        itvl = setInterval(function() {
            createNewEntities();
            decreaseTTL();
            move();
            draw();
        }, 30);
        gameRolling = true;
    };

});
