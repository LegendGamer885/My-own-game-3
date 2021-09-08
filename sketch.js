var canvas
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jet, jetImg;
var meteor, meteorImg, meteorGroup;
var alien,alienImg,alienGroup;
var missile, missileImg, missileGroup,missileSound;
var explosion, explosionImg,explosionSound;
var blast;
var backgroundImg;
var invisibleEarth;
var gameOver,gameOverImg,gameOverSound;
var youWin,youWinImg;
var meteorArray = [];
var alienArray = [];
var life = 5,evidence = 0;

function preload() {
  backgroundImg = loadImage("./assets/Sp_00.png");
  gameOverImg = loadAnimation("./assets/GameOver/g_00.png","./assets/GameOver/g_01.png","./assets/GameOver/g_02.png","./assets/GameOver/g_03.png","./assets/GameOver/g_04.png","./assets/GameOver/g_05.png")
  youWinImg = loadImage("./assets/you win.png");

  jetImg = loadImage("./assets/F-22.png");
  missileImg = loadImage("./assets/missile.png");
  meteorImg = loadAnimation("./assets/Meteor/Met_00.png","./assets/Meteor/Met_01.png","./assets/Meteor/Met_02.png","./assets/Meteor/Met_03.png","./assets/Meteor/Met_04.png","./assets/Meteor/Met_05.png");
  alienImg = loadAnimation("./assets/Alien/Al_0.png","./assets/Alien/Al_1.png","./assets/Alien/Al_2.png","./assets/Alien/Al_3.png","./assets/Alien/Al_4.png");
  explosionImg = loadAnimation("./assets/Explosion/Expl_0.png", "./assets/Explosion/Expl_1.png", "./assets/Explosion/Expl_2.png", "./assets/Explosion/Expl_3.png", "./assets/Explosion/Expl_4.png", "./assets/Explosion/Expl_5.png", "./assets/Explosion/Expl_6.png");

  explosionSound = loadSound("explosion.mp3");
  missileSound = loadSound("missile.mp3");
  gameOverSound = loadSound("gameOver1.mp3");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  invisibleEarth = createSprite(8, height / 2, 20, height);
  invisibleEarth.visible = false;

  gameOver = createSprite(width/2,height/2);
  gameOver.addAnimation("gameOver",gameOverImg);
  gameOver.scale = 3.5;
  gameOver.visible = false;

  youWin = createSprite(width/2,height/2);
  youWin.addAnimation("gameWon",youWinImg);
  youWin.scale = 1;
  youWin.visible = false;

  jet = createSprite(100, height / 2);
  jet.addImage(jetImg);
  jet.rotation = 90;
  jet.scale = 0.4

  missileGroup = new Group();
  meteorGroup = new Group();
  alienGroup = new Group();

  life = 5;
  evidence = 0;
}

function draw() {
  background(backgroundImg);

  if (gameState === PLAY) {

    if(keyDown("r")){
      reset();
    }

    flag = 0;

    if (keyDown(UP_ARROW)) {
      jet.y = jet.y - 7;
    }

    if (keyDown(DOWN_ARROW)) {
      jet.y = jet.y + 7;
    }

    if (keyDown(LEFT_ARROW)) {
      jet.x = jet.x - 7;
    }

    if (keyDown(RIGHT_ARROW)) {
      jet.x = jet.x + 7;
    }

    if (keyDown("SPACE")) {
      spawnRockets();
      missileSound.play();
      missileSound.setVolume(0.1);
    }

    if (meteorGroup.isTouching(invisibleEarth)) {
      life = life - 1;
      meteorGroup[0].destroy();
    }

    if(alienGroup.isTouching(jet)){
      alienGroup[0].destroy();
      evidence = evidence + 1;
    }

    if(evidence === 20){
      youWin.visible = true;
      jet.visible = false;
      meteorGroup.destroyEach();
      missileGroup.destroyEach();
      alienGroup.destroyEach();
    }

    if(life === 0){
      gameState = END;
    }
  
    spawnMeteors();
    spawnAliens();

    if (missileGroup.isTouching(meteorGroup)) {
      for (var i = 0; i < meteorGroup.length; i++) {
        if (missileGroup.isTouching(meteorGroup[i])) {
          
          explosion = createSprite(meteorGroup[i].x, meteorGroup[i].y, 20, 20);
          explosion.addAnimation("explosion", explosionImg);
          explosion.scale = 0.3;
          meteorGroup[i].destroy();
          missileGroup.destroyEach();

          explosionSound.play();
          explosionSound.setVolume(0.3);

          setTimeout(() => {
            explosion.destroy();
          }, 1000);
        }
      }

    }

    fill("#D04200");
    textSize(30);
    text("Life: " + life, width - 150,50);

    fill("#D04200");
    textSize(30);
    text("Evidence: " + evidence,width-170,90);

  }

   else if(gameState === END) {
    gameOver.visible = true;
    meteorGroup.setVelocityXEach(0);
    meteorGroup.destroyEach();
    missileGroup.destroyEach();
    alienGroup.destroyEach();
    alienGroup.setVelocityXEach(0);
    jet.visible = false;

    if(!gameOverSound.isPlaying()){
      gameOverSound.play();
      setTimeout(() => {
        Sound.stop(1);
      }, 1000);
      
    }

    // gameOverSound.loop = false
  }
  drawSprites();


}

function spawnRockets() {
  missile = createSprite(300, 400, 20, 20);
  missile.addImage(missileImg);
  missile.rotation = 90;
  missile.x = jet.x;
  missile.y = jet.y;
  missile.velocityX = 6;
  missile.lifetime = 200;
  missile.scale = 0.1;
  missileGroup.add(missile);
}

function spawnMeteors() {
  var i = Math.round(random(120, height - 100));
  if (frameCount % 60 === 0) {
    meteor = createSprite(width - 20, i, 20, 20);
    meteor.addAnimation("meteor",meteorImg);
    meteor.rotation = 90;
    meteor.velocityX = -7;
    meteor.lifetime = 250;
    meteor.scale = 0.5;
    meteorGroup.add(meteor);

    for (i = 0; i < meteor.length; i++) {
      meteorArray[i].add(meteorGroup);
    }
  }
}

function spawnAliens() {
  var i = Math.round(random(120, height - 100));
  if (frameCount % 120 === 0) {
    alien = createSprite(width - 20, i, 20, 20);
    alien.addAnimation("alien",alienImg);
    alien.velocityX = -7;
    alien.lifetime = 250;
    alien.scale = 0.2;
    alienGroup.add(alien);

    for (i = 0; i < alien.length; i++) {
      alienArray[i].add(alienGroup);
    }
  }
}

function reset(){
  gameState = PLAY;
  jet.x = 100;
  jet.y = height/2;
  jet.visible = true;
  gameOver.visible = false;
  youWin.visible = false;
  gameOverSound.play = false;
  life = 5;
  evidence = 0;
}