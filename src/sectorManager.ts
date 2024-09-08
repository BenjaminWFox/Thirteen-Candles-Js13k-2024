import { collides, randInt, Sprite } from "kontra"
import { Enemy, getEnemyLaser, getEnemyShip, getExplosion, getNumbers, getPowerup } from "./sprites"
import { resetPowerups, state } from "./state";
import { bombManager, bulletManager, enemyLaserManager, explosionManager, Manager, powerupManager } from "./spriteManager";
import { data, Enemies } from "./data";
import { SCALE } from "./constants";

const cosFn = (shipXSpeed: number, waveXSpread: number, xPosition: number) =>
  (enemy: Sprite) => enemy.x = (Math.cos((enemy.y) / shipXSpeed) * waveXSpread) + xPosition
const neutral = (startX: number, dy?: number) => (enemy: Sprite) => { enemy.x = startX; enemy.dy = dy || 8; }

type spawnStartTime = number;
type totalSpawns = number;
type spawnSpacing = number;
type spriteFactory = (enemy: Enemies) => Enemy;
type manager = Manager<Enemy>;
type SectorData = [spawnStartTime, totalSpawns, spawnSpacing, spriteFactory, Enemies, manager]

function checkProjectileAgainstPlayer(projectile: Sprite) {
  if (collides(projectile, data.sprites.player)) {
    managePlayerHit(projectile);
  }
}

function checkProjectileAgainstEnemies(manager: Manager<Enemy>, projectile: Sprite) {
  manager.assets.forEach(enemy => {
    if (enemy.opacity === 0) return;
    const shield = enemy.shield;

    if (shield) {
      if (collides(projectile, shield)) {
        enemy.shieldIntegrity -= 1;
        projectile.opacity = 0;
        explosionManager.add(getExplosion(projectile.x, projectile.y));
      }
    } else {
      if (collides(projectile, enemy)) {
        enemy.opacity = 0;
        projectile.opacity = 0;
        state.score += 100 * state.scoreMult;
        explosionManager.add(getExplosion(enemy.x, enemy.y));
        const powerup = getPowerup(enemy.x, enemy.y);
        if (powerup) powerupManager.add(powerup);
      }
    }
  })
}

function managePlayerHit(enemy: Sprite) {
  resetPowerups();

  if (state.playershield > 0) {
    explosionManager.add(getExplosion(enemy.x, enemy.y));
    enemy.opacity = 0;
    state.playershield -= 1;
  } else if (state.lives >= 0) {
    explosionManager.add(getExplosion(data.sprites.player.x, data.sprites.player.y));
    enemy.opacity = 0;
    data.sprites.player.opacity = 0;

    if (state.lives === 0) {
      endGame();
    } else {
      state.invulnerableAt = state.lives === 0 ? state.totalTime + 5000 : state.totalTime;
      state.invulnerable = true;

      setTimeout(() => {
        console.log('Timeout resetting opacity');
        if (!state.gameOver) {
          data.sprites.player.opacity = .75
        }
      }, 250)
    }

    state.lives -= 1;
  }
}

export class Sector {
  data: Array<SectorData>
  loaded: boolean = false;
  started: boolean = false;
  completed: boolean = false;
  managersCompleted = 0;

  constructor(sector: Array<SectorData>) {
    this.data = sector;
  }

  getRandomEnemy() {
    const enemies: Array<Sprite> = []
    this.data.forEach(([, , , , , manager]) => {
      manager.assets.forEach(asset => enemies.push(asset))
    })

    return enemies[randInt(0, enemies.length - 1)]
  }

  reset() {
    this.loaded = this.started = this.completed = false;
  }

  update() {
    this.data.forEach(([, , , , , manager]) => {
      manager.update()
    });
  }

  render(t: number) {
    if (this.completed) {
      return;
    } else if (!this.loaded) {
      // data.scenes.game.remove(data.scenes.game.objects[3]);
      // data.scenes.game.add(getNumbers(state.currentSectorNumber.toString(), state.currentSectorNumber < 10 ? 74 : 70, 12, { scale: 20 }));
      data.scenes.game.objects[3] = getNumbers(state.currentSectorNumber.toString(), state.currentSectorNumber < 10 ? 74 : 70, 12, { scale: 20 });
      (data.scenes.game.objects[2] as Sprite).y = 270 * SCALE;
      (data.scenes.game.objects[2] as Sprite).dy = -40;
      (data.scenes.game.objects[3] as Sprite).y = 280 * SCALE;
      (data.scenes.game.objects[3] as Sprite).dy = -40;
      this.loaded = true;
    } else if (!this.started) {
      if ((data.scenes.game.objects[2] as Sprite).y < 2 * SCALE) {
        (data.scenes.game.objects[2] as Sprite).y = 2 * SCALE;
        (data.scenes.game.objects[2] as Sprite).dy = 0;
        (data.scenes.game.objects[3] as Sprite).y = 12 * SCALE;
        (data.scenes.game.objects[3] as Sprite).dy = 0;
        this.started = true;
      }
    } else if (!this.completed) {
      for (const [spawnStart, totalSpawn, spawnSpacing, spriteFactory, enemy, manager] of this.data) {
        if (t >= spawnStart && manager.spawned < totalSpawn && t % spawnSpacing === 0) {
          manager.add(spriteFactory(enemy))
        } else if (!manager.completed && manager.spawned >= totalSpawn && manager.assets.length === 0) {
          this.managersCompleted += 1;
          manager.completed = true;
        }

        if (!this.completed && this.managersCompleted === this.data.length) {
          this.completed = true;

          return;
        }

        // Check enemies against bullets
        bulletManager.assets.forEach(bullet => {
          if (bullet.opacity === 0) return;

          checkProjectileAgainstEnemies(manager, bullet);
        })

        // Check enemies against bombs
        bombManager.assets.forEach(bomb => {
          if (bomb.opacity === 0) return;

          checkProjectileAgainstEnemies(manager, bomb);
        })

        if (!state.invulnerable) {
          // Check enemies against player
          manager.assets.forEach(enemy => {
            if (randInt(0, 500) === 0) {
              enemyLaserManager.add(getEnemyLaser(enemy.x, enemy.y, { dy: enemy.dy + 10 }))
            }

            if (collides(data.sprites.player, enemy.shield ? enemy.shield : enemy)) {
              managePlayerHit(enemy);
            }
          })

          // Check player against enemy projectiles
          if (!state.invulnerable) {
            enemyLaserManager.assets.forEach(laser => {
              if (laser.opacity === 0) return;

              checkProjectileAgainstPlayer(laser);
            })
          }
        }

        manager.render();
      }
    }
  }
}

const spawns = 13

const sector1 = new Sector([
  // [0, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, 200, 1200))],
  // [0, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, -200, 300))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyGreen, new Manager(cosFn(120, -200, 300))],
]);
const sector2 = new Sector([
  [0, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(200, 200, 450))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(200, -200, 1050))],
]);
const sector3 = new Sector([
  [0, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(300, 12))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(600, 18))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(900, 18))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(1200, 12))],
])
const sectors = [sector1, sector2, sector3]
const currentSector = () => sectors[state.currentSectorNumber - 1]

function endGame() {
  state.gameOver = true;
  setTimeout(() => {
    data.scenes.game.hide();
    data.scenes.end.show();
  }, 2000)
}

export { currentSector, sectors, sector1, sector2, sector3, endGame }
