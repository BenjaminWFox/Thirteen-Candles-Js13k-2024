import {
  init,
  GameLoop,
  initPointer,
  lerp,
  setStoreItem,
} from 'kontra';
import { getBullet, makeSprites } from './sprites';
import { initScenes } from './scenes';
import { bulletManager } from './spriteManager';
import { data, initCalculations, initElements } from './data';
import { state } from './state'
import { currentSector, sectors } from './sectorManager';
import { sfx } from './music';

const { canvas } = init();

export function getRandomIntMinMaxInclusive(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function nextSector() {
  state.sectorTime = 0;
  ++state.currentSectorNumber;

  sfx(data.sounds.sectorClear);

  if (state.currentSectorNumber > sectors.length) {
    data.scenes.game.hide();
    data.scenes.end.show();
  } else {
    setStoreItem(`${state.currentSectorNumber}`, 1)

    state.currentSectorClass = currentSector();

    console.log('Next sector')
  }
}

const loop = GameLoop({
  update: function () {
    data.scenes.stars.update();
    data.sprites.player.x = state.playerX;
    data.sprites.player.y = state.playerY;
    data.sprites.player.update();

    if (!data.scenes.game.hidden) {
      bulletManager.update();
      state.currentSectorClass.update();
    }

    data.scenes.title.update();
    data.scenes.select.update();
    data.scenes.game.update();
    data.scenes.end.update();
  },

  render: function () {
    data.scenes.stars.render();

    data.sprites.player.render();

    if (!data.scenes.game.hidden) {

      if (state.totalTime % 20 === 0) {
        bulletManager.add(getBullet())
      }

      state.currentSectorClass.render(state.sectorTime, bulletManager.assets);
      // console.log('Done render');
      if (state.currentSectorClass.completed) {
        nextSector();
      }
      bulletManager.render();

    }

    data.scenes.title.render();
    data.scenes.select.render();
    data.scenes.game.render();
    data.scenes.end.render();

    state.totalTime += 1;
    state.sectorTime += 1;

    if (Math.abs(state.playerX - state.moveToX) > 5) {
      state.playerX = lerp(state.playerX, (state.moveToX / data.calculations.canvasRatioWidth) - data.calculations.canvasAdjustLeft, .5);
    }
    if (Math.abs(state.playerY - state.moveToY) > 5) {
      state.playerY = lerp(state.playerY, (state.moveToY / data.calculations.canvasRatioHeight) - data.calculations.canvasAdjustRight - state.touchOffset, .5);
    }
  }
});

let startGame = () => {
  initPointer();
  initElements(canvas, document.getElementById('body')!)
  initCalculations(canvas);
  initScenes();
  state.loop = loop;
  data.scenes.title.show();
  // data.scenes.game.show();
  data.sprites.player.x = state.playerX;
  data.sprites.player.y = state.playerY;

  loop.start();
}

// Mouse Handler
document.getElementById('c')!.addEventListener('mousemove', (e) => {
  if (!data.scenes.game.hidden && state.shipEngaged) {
    state.touchOffset = 150;
    state.moveToX = e.x;
    state.moveToY = e.y;
  }
});
document.getElementById('c')!.addEventListener('touchmove', (e) => {
  if (!data.scenes.game.hidden && state.shipEngaged) {
    state.touchOffset = 150;
    state.moveToX = e.targetTouches[0].clientX;
    state.moveToY = e.targetTouches[0].clientY;
  }
})

// Resize Handler
window.addEventListener('resize', () => {
  initCalculations(canvas);
})

function allowMove() {
  data.elements.body.style.cursor = "none";
  state.shipEngaged = true;
}
function preventMove() {
  data.elements.body.style.cursor = "pointer";
  state.shipEngaged = false;
}

window.ontouchstart = (e) => {
  if (e.touches.length === 1) allowMove();
}
window.ontouchend = (e) => { if (e.touches.length !== 1) preventMove() };
window.ontouchcancel = (e) => { if (e.touches.length !== 1) preventMove() };
window.onmousedown = allowMove;
window.onmouseup = preventMove;

window.onload = () => makeSprites(startGame);
