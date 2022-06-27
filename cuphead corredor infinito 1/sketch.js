var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var backgroundImg;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound,musicSound;

function preload(){
trex_running = loadAnimation("cuphead.gif");
trex_collided = loadAnimation("cupheadDead.png");
backgroundImg=loadImage("background.png");
groundImage = loadImage("Floor.png");
    
obstacle1 = loadImage("tuberia.png");
obstacle2 = loadImage("Larnacle.webp");
obstacle3 = loadImage("tronco.png");

restartImg = loadImage("restart.png")
gameOverImg = loadImage("gameOver.png")
  
jumpSound = loadSound("jump.mp3")
dieSound = loadSound("die.mp3")
checkPointSound = loadSound("checkPoint.mp3")
musicSound=loadSound("music.mp3")

}

function setup() {
createCanvas(2020, 1000);
musicSound.play() 

var message = "This is a message";
console.log(message)
trex = createSprite(200,680,20,20);
trex.addAnimation("running", trex_running);
trex.addAnimation("collided", trex_collided);
trex_collided.scale=0.5;
 
trex.scale = 1.5;
  
ground = createSprite(700,670,9000,20);
ground.addImage("ground",groundImage);
ground.x = ground.width /2;
ground.scale=2.2
  
gameOver = createSprite(1010,500);
gameOver.addImage(gameOverImg);

restart = createSprite(1010,700);
restart.addImage(restartImg);
  
gameOver.scale =1.5;
restart.scale =2.5;
  
invisibleGround = createSprite(200,830,700,10);
invisibleGround.visible = false;
  
//create Obstacle and Cloud Groups
obstaclesGroup = createGroup();

trex.setCollider("circle",5,20,75);
trex.debug = true

score = 0;  
}
function draw() { 
background(backgroundImg);
//displaying score
text("Score: "+ score, 1500,100);

if(gameState === PLAY){
gameOver.visible = false;
restart.visible = false;
    
ground.velocityX = -(25* score/50)
//scoring
score = score + Math.round(getFrameRate()/60);
    
if(score>0 && score%100 === 0){
checkPointSound.play() 
}
    
if (ground.x < 0){
ground.x = ground.width/2;
}    
//jump when the space key is pressed
if(keyDown("space")&& trex.y >= 600) {
trex.velocityY = -50;
jumpSound.play();
}
//add gravity
trex.velocityY = trex.velocityY + 2.9;

//spawn obstacles on the ground
spawnObstacles();

if(obstaclesGroup.isTouching(trex)){
//trex.velocityY = -12;
jumpSound.play();
gameState = END;
dieSound.play()
}
}
else if (gameState === END) {
gameOver.visible = true;
restart.visible = true;
     
//change the trex animation
trex.changeAnimation("collided", trex_collided);
         
ground.velocityX = 0;
trex.velocityY = 0
      
//set lifetime of the game objects so that they are never destroyed
obstaclesGroup.setLifetimeEach(-1);     
obstaclesGroup.setVelocityXEach(0);
}  
//stop trex from falling down
trex.collide(invisibleGround);
  
if(mousePressedOver(restart)) {
reset();
}

drawSprites();
}

function reset(){  

}

function spawnObstacles(){
if (frameCount % 100 === 0){
var obstacle = createSprite(1900,690,10,40);
obstacle.velocityX = -(40 + score/50);
//generate random obstacles
var rand = Math.round(random(1,3));
switch(rand) {
case 1: obstacle.addImage(obstacle1);
              break;
case 2: obstacle.addImage(obstacle2);
              break;
case 3: obstacle.addImage(obstacle3);
              break;
default: break;
}
//assign scale and lifetime to the obstacle           
obstacle.scale = 1.5;
obstacle.lifetime = 300;
//add each obstacle to the group
obstaclesGroup.add(obstacle);
}
}