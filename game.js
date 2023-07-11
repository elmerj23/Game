const canvas=document.querySelector('#game');
const game=canvas.getContext('2d');
window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);




//movimiento
const btnUp=document.querySelector('#up');
const btnLeft=document.querySelector('#left');
const btnRight=document.querySelector('#right');
const btnDown=document.querySelector('#down');
const spanLives=document.querySelector('#lives');
const spanTime=document.querySelector('#time');
const spanRecord=document.querySelector('#record');
const pResult=document.querySelector('#result');
const restart=document.querySelector('#restart');
const countdownText = document.querySelector('.countdown')
const winn=document.querySelector('.text-container')
const spanRecords=document.querySelector('#records');
const spanTimeShow=document.querySelector('#times');



//const bRecord=document.querySelector('#reiniciar_record');


function showwinn(){
winn.classList.toggle('inactive')
console.log('funciona');
}


const playerPosition ={
x:undefined,
y:undefined,
};
const giftPosition={
x:undefined,
y:undefined,
};
let enemyPositions=[];
let level=0;
let lives=3;

let timeStart;
let timePlayer;
let timeInterval;

//tamaño iguales(ancho y alto)

let canvasSize;
//tamaño bombas/objetos
let elementsSize;
//jugador
//funcion tamaños

function setCanvasSize(){
//dar tamaño a elements

//hacer que mida 80% pantalla siempre
if(window.innerHeight > window.innerWidth){
canvasSize=window.innerWidth*0.78;}
else {
canvasSize=window.innerHeight*0.78;

}

canvasSize=Number(canvasSize.toFixed(0));


canvas.setAttribute('width',canvasSize);
canvas.setAttribute('height',canvasSize);
elementsSize=canvasSize/10;
playerPosition.x=undefined;
playerPosition.y=undefined;
reset();
}

//hacer funcion inicio
 function starGame(){
game.font=elementsSize+'px verdana';
game.textAlign='end';
//for(let i=1;i0<= 10;i++){
//gamefillText(emojis['x'],elementSize *i,elementsSize)};
//agregar bombas
const map=maps[level];
if(!map){
gameWin();
return;
}
if(!timeStart){

timeStart=Date.now();
timeInterval=setInterval(showTime,100);
showRecord();
}
const mapRows=map.trim().split('\n');
const mapRowCols=mapRows.map(row => row.trim().split(''));
showLives();

enemyPositions=[];
game.clearRect(0,0,canvasSize,canvasSize);
mapRowCols.forEach((row,rowI)=>{
row.forEach((col,colI)=>{
const emoji=emojis[col];
const posX=elementsSize*(colI+1);
const posY=elementsSize*(rowI+1);

if (col=='O'){
if(!playerPosition.x && !playerPosition.y){
playerPosition.x=posX;
playerPosition.y=posY;
console.log({playerPosition});
}
}else if(col == 'I'){
giftPosition.x=posX;
giftPosition.y=posY;

}else if (col=='X'){
enemyPositions.push({
x:posX,
y:posY,
});
}
game.fillText(emoji,posX,posY);
});
});
movePlayer();
}

function movePlayer(){
const giftCollisionX=playerPosition.x.toFixed(1)==giftPosition.x.toFixed(1);
const giftCollisionY=playerPosition.y.toFixed(1)==giftPosition.y.toFixed(1);
const giftCollision=giftCollisionX&&giftCollisionY;
if(giftCollision){console.log('Subiste de nivel!!!');
levelWin();

}
const enemyCollision=enemyPositions.find(enemy=>{
const enemyCollisionX=enemy.x.toFixed(1)==playerPosition.x.toFixed(1);
const enemyCollisionY=enemy.y.toFixed(1)==playerPosition.y.toFixed(1);
return enemyCollisionX && enemyCollisionY;
});
if(enemyCollision){console.log('chocaste con un enemigo:(');
levelFail();
game.fillText(emojis['BOMB_COLLISION'],150,150);
game.fillText('!!!OUCH',250,250);
game.fillText(emojis['BOMB_COLLISION'],165,150);
game.fillText(emojis['BOMB_COLLISION'],185,150);
game.fillText(emojis['BOMB_COLLISION'],200,150);

}
game.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y);
};

//function reinRecord(){
//localStorage.removeItem('record_time');
//console.log('record_time');
//clearInterval(timeInterval);
//}

function levelWin(){

console.log('Subiste de nivel!!!');
level++;
starGame();
game.fillStyle='rgb(0, 128, 0)';
game.fillText('level +',250,250);


}
function levelFail(){
console.log('chocaste con un enemigo:(');

lives--;
//perdiste
if (lives<=0){

level=0;
lives=3;

timeStart=undefined;

}

playerPosition.x=undefined;
playerPosition.y=undefined;
starGame();

}

function gameWin(){
console.log('Terminaste');
clearInterval(timeInterval);
showwinn();

game.fillText('terminaste',350,250);
const recordTime=localStorage.getItem('record_time');
const playerTime=Date.now()-timeStart;
if(recordTime){
if(recordTime >= playerTime){
localStorage.setItem('record_time',playerTime);
pResult.innerHTML='SUPERASTE EL RECORD'+'🏆';
game.font='15px verdana';
game.fillText('SUPERASTE EL RECORD',350,400);
}else{
pResult.innerHTML='NO SUPERASTE EL RECORD , INTENTALO DE NUEVO!!';
game.fillStyle='black'
game.font='15px verdana';
game.fillText('NO SUPERASTE EL RECORD',350,450);
}
}else{
localStorage.setItem('record_time',playerTime);
pResult.innerHTML=(`GENERASTE EL PRIMER TIEMPO ${playerTime/1000}... SUPERALO!!!`)
game.fillStyle='black'
game.font='15px verdana';
game.fillText('GENERASTE EL PRIMER TIEMPO ... SUPERALO!!!`)',350,400);

}
console.log({recordTime,playerTime});
spanTimeShow.innerHTML=(playerTime/1000+' seg');}
//vidas
function showLives(){
const heartsArray=Array(lives).fill(emojis['HEART']);
spanLives.innerHTML="";
heartsArray.forEach(heart=> spanLives.append(heart));

}
function showTime(){
spanTime.innerText = +((Date.now()-timeStart)/1000).toFixed(1)+ " seg";

}



function showRecord(){
spanRecord.innerHTML=localStorage.getItem('record_time')/1000 +" seg";
spanRecords.innerHTML=localStorage.getItem('record_time')/1000 +" seg";
}



//funcion movimiento
window.addEventListener('keydown',moveByKeys);
btnUp.addEventListener('click',moveUp);
btnLeft.addEventListener('click',moveLeft);
btnRight.addEventListener('click',moveRight);
btnDown.addEventListener('click',moveDown);
restart.addEventListener('click',reset);

//bRecord.addEventListener('click',reinRecord);

//function reset(){
// reinicio record localStorage.removeItem('record_time');
//return location.reload();


//}




function moveByKeys(event){
 if(event.key=='ArrowUp')
moveUp()
else if(event.key=='ArrowLeft')
moveLeft();
else if(event.key=='ArrowRight')
moveRight();
else if (event.key=='ArrowDown')
moveDown();


}

function moveUp(){
console.log('me quiero mover hacia arriba');

if ((playerPosition.y-elementsSize)< elementsSize-1){
console.log("out")}

else{
playerPosition.y -=elementsSize;
starGame();
};
}
function moveLeft(){
console.log('me quiero mover hacia izquiera');


if ((playerPosition.x-elementsSize)< elementsSize){
console.log("out")}
else{
playerPosition.x -=elementsSize;
starGame();
};
}

function moveRight(){
console.log('me quiero mover hacia derecha');
if ((playerPosition.x+elementsSize)> canvasSize+1){
console.log("out")}
else{
playerPosition.x +=elementsSize;
starGame();
};
}
function moveDown(){
console.log('me quiero mover hacia abajo');
if ((playerPosition.y+elementsSize)> canvasSize){
console.log("out")}
else{
playerPosition.y +=elementsSize;
starGame();
}
}

function countdown() {
    console.log("counting down");
    let numberCount = 3


    function count () {
      if (numberCount > 0) {
        countdownText.innerHTML = numberCount;
         numberCount--;
        setTimeout(count, 700);
      }
      else {
        countdownText.innerHTML ='Go!';
      }  
    }
    count ();
starGame();

  
  }
  function reset(){
  countdown()
    level = 0;
    lives = 3;
    timeStart= undefined;
    pResult.innerHTML = '';
    playerPosition.x = undefined;
    playerPosition.y = undefined;  
      setTimeout(starGame, 3000);
    }


  
function player(){

game.fillText(emojis['O'],playerPosition.x,playerPosition.y);
game.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y);
};


//ancho a la ventana
//canvas.setAttribute('width',window.innerWidth*0.75);
//altura a la ventana(cuadrado)
//canvas.setAttribute('height',window.innerHeight*0.50);


//marcar trazo
//crear rectangulo
//game.fillRect(0,0,100,100);
//borrar rectangulo
//game.clearRect(0,0,100,50);
//estilo a la fuente
//game.font='25px verdana';
//color al texto
//game.fillStyle='blue';
//alinear texto
//game.textAlign='start';
//escribir en canvas
//game.fillText('sergio',25,25);




