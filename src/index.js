import Imagen from './img/grafica-trex.png';
import { jump_sound, dead_sound } from './sound/sounds.js';

let CANVAS; // canvas
let CONTEXT; // contexto
const CANVAS_WIDTH = 700;
const CANVA_HEIGHT = 300;
const FPS = 50;

let JUMP_SOUND;
let DEAD_SOUND;
// Variables para cada objeto (Dinosaurio)
const TREX = {
  image: null,
  start: 200,
  end: 40,
  gravity: 10,
  isDown: false,
  jumping: false
};

const CACTUS = {
  image: null,
  x: 500,
  y: 200,
  velocity: 5
};

const FLOOR = {
  image: null,
  x: 0,
  value: 238,
  velocity: 3
};

const CLOUD = {
  image: null,
  x: 280,
  y: 40,
  velocity: 2
};

const GAME = {
  image: null,
  gameover: false,
  isDead: false
};

const init = () => {
  CANVAS = document.querySelector('#canvas');
  CONTEXT = CANVAS.getContext('2d');
  CANVAS.width = CANVAS_WIDTH;
  CANVAS.height = CANVA_HEIGHT;
  CANVAS.style.border = '1px solid #000';
  loadImages();
  JUMP_SOUND = new Audio(jump_sound);
  DEAD_SOUND = new Audio(dead_sound);
  document.addEventListener('keydown', (event) => {
    const { key } = event;
    if (key === ' ') {
      if (!GAME.gameover) {
        JUMP_SOUND.play();
        GAME.isDead = false;
        TREX.start = TREX.end;
        if (!TREX.jumping) TREX.jumping = true;
        TREX.isDown = true;
      } else {
        localStorage.setItem('count', 0);
        GAME.gameover = false;
        CACTUS.x = 500;
        CACTUS.velocity = 5;
        CLOUD.velocity = 2;
        FLOOR.velocity = 3;
      }
    }
    
  });
  setInterval(() => {
    main();
  }, 1000/FPS);
};

const loadImages = () => {
  TREX.image = new Image();
  TREX.image.src = Imagen;

  CACTUS.image = TREX.image;  
  FLOOR.image = TREX.image;  
  CLOUD.image = TREX.image;  
  GAME.image = TREX.image;  
}

const clearCanvas = () => {
  CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVA_HEIGHT);
}

const drawRex = () => {
  CONTEXT.drawImage(TREX.image, 848, 0, 42, 50, 50, TREX.start, 42, 50);
}

const drawCactus = () => {
  CONTEXT.drawImage(CACTUS.image, 433, 0, 25, 45, CACTUS.x, CACTUS.y, 30, 45);
  if (CACTUS.x > -100) {
    CACTUS.x -= CACTUS.velocity; 
  } else {
    const count = localStorage.getItem('count') || 0;
    localStorage.setItem('count', parseInt(count) + 1);
    CACTUS.x = CANVAS_WIDTH + 100;
  }
}

const drawFloor = () => {
  CONTEXT.drawImage(
    FLOOR.image,
    FLOOR.x,
    50,
    700,
    18,
    0,
    FLOOR.value,
    1200,
    20
  );

  if (FLOOR.x > CANVAS_WIDTH) {
    FLOOR.x = 0;
  } else {
    FLOOR.x += FLOOR.velocity; 
  }
}

const drawCloud = () => {
  CONTEXT.drawImage(CLOUD.image, 86, 0, 50, 20, CLOUD.x, CLOUD.y, 50, 20);
  if (CLOUD.x > -100) {
    CLOUD.x -= CLOUD.velocity; 
  } else {
    CLOUD.x = CANVAS_WIDTH + 100;
  }
}

const collision = () => {
  if (CACTUS.x > 50 && CACTUS.x < 100) {
    if (TREX.start > 165) {
      if (!GAME.isDead) {
        DEAD_SOUND.play();
        GAME.isDead = true;
      }
      const count = localStorage.getItem('count') || 0;
      const score = localStorage.getItem('score') || 0;
      if (count > score) {
        localStorage.setItem('score', count);
      }
      GAME.gameover = true;
      CLOUD.velocity = 0;
      FLOOR.velocity = 0;
      CACTUS.velocity = 0;
    }
  }
}

const drawGameOver = () => {
  if (GAME.gameover) {
    CONTEXT.drawImage(GAME.image, 0, 0, 40, 50, 320, 100, 40, 50);
    CONTEXT.font = '30px Arial';
    CONTEXT.fillStyle = 'black';
    CONTEXT.fillText('Game Over', 265, 160);
  }
}

const drawScore = () => {
  const count = localStorage.getItem('count') || 0;
  const score = localStorage.getItem('score') || 0;
  CONTEXT.font = '20px Arial';
  CONTEXT.fillStyle = 'gray';
  CONTEXT.fillText(`HI: ${score}`, 500, 20);
  CONTEXT.fillText(count, 600, 20);
}

const isDown = () => {
  if (TREX.isDown) {
    if (TREX.start < 200) {
      TREX.start += TREX.gravity; 
    } else {
      TREX.isDown = false;
    }
  }
}

const main = () => {
  clearCanvas();
  drawScore();
  drawGameOver();
  collision();
  isDown();
  drawCactus();
  drawCloud();
  drawFloor();
  drawRex();
}

document.addEventListener('load', init());
