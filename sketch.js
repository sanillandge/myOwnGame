/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var  kangaroo,  kangaroo_running,  kangaroo_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;
var goldCoin, energyDrink;

function preload(){
  kangaroo_running =   loadAnimation("assets/boy.png");
  kangaroo_collided = loadAnimation("assets/gameOver.png");
  jungleImage = loadImage("assets/bg-1.jpg");
  goldCoin = loadImage("assets/gold-coin.png");
  energyDrink = loadImage("assets/energy.png");
  obstacle1 = loadImage("assets/stone-1.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,200,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=3.1
  jungle.x = width /2;

  boy = createSprite(50,200,20,50);
  boy.addAnimation("running", kangaroo_running);
  boy.addAnimation("collided", kangaroo_collided);
  boy.scale = 0.15;
  boy.setCollider("circle",0,0,300)
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
  boy.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-3

    if(jungle.x<100)
    {
       jungle.x=400
    }
   console.log(boy.y)
    if(keyDown("space")&& boy.y>270) {
      jumpSound.play();
      boy.velocityY = -16;
    }
  
    boy.velocityY = boy.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();

    boy.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(boy)){
      collidedSound.play();
      gameState = END;
    }
    if(shrubsGroup.isTouching(boy)){
      score = score + 1;
      shrubsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    //set velcity of each game object to 0
    boy.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    //change the  kangaroo animation
    //boy.changeAnimation("collided",kangaroo_collided);
    boy.visible=false
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    //set velcity of each game object to 0
    jungle.velocityX = 0;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    
    //change the kangaroo animation
    boy.changeAnimation("collided",kangaroo_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Score: "+ score, camera.position.x,50);
  
  if(score >= 25){
    boy.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Congragulations!! You win the game!! ", 70,200);
    gameState = WIN;
  }
}

function spawnShrubs() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {

    var shrub = createSprite(camera.position.x+500,330,40,10);

    shrub.velocityX = -(8 + 3*score/100)
    shrub.scale = 0.1;

    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: shrub.addImage(goldCoin);
              break;
      case 2: shrub.addImage(energyDrink);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the shrub           
    shrub.scale = 0.1;
     //assign lifetime to the variable
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    //add each cloud to the group
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(8 + 3*score/100)
    obstacle.scale = 0.15;
    //assign scale and lifetime to the obstacle           

    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  boy.visible = true;
  boy.changeAnimation("running", boy_running);
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  score = 0;
}
