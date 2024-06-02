import { Ship, Fregata } from './ship.js';
import { Background } from './scrollingBackground.js';
import { btnScenariu1, btnScenariu2 } from './script.js';
import { Explosion } from './explosions.js';

export class Simulare {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.speed = 1;
    this.background = new Background(this);
    this.ships = [new Ship(this), new Ship(this), new Fregata(this)];
    this.smokeParticles = [];
    this.smokeParticlesAK726 = [];
    this.explosions = [];
    this.cloud = [];
    this.cloud2 = [];
    this.fregataArcCollision1 = false;
    this.fregataArcCollision2 = false;
    this.fregataArcCollision1_2kmS1 = false;
    this.fregataArcCollision2_2kmS1 = false;
    this.fregataArcCollision1_2kmS2 = false;
    this.fregataArcCollision2_2kmS2 = false;
    this.fps = 20;
    this.zoomInterval = 1000 / this.fps;
    this.zoomTime = 0;
    this.scenariu1Time = false;
    this.scenariu2Time = false;
    this.zoomedIn = false;
    this.explosionCount = 0;
    this.maxExplosions = 10;
    this.explosionShip = 2;
    this.attackOverS1 = false;
    this.attackOverS2 = false;
    this.continue = true;
  }
  initialDisplay(context) {
    this.background.draw(context);
    this.ships[1].initialY = this.height - this.ships[0].initialHeight * 2;

    setTimeout(() => {
      this.ships.forEach((ship) => {
        ship.initialDraw(context);
      });
    }, 100);
  }
  draw(context) {
    context.clearRect(0, 0, this.width, this.height);
    this.background.draw(context);
    this.background.marks.draw(context);
    this.ships[2].draw(context);
    this.smokeParticles.forEach((particle) => {
      particle.draw(context);
    });
    this.smokeParticlesAK726.forEach((particle) => {
      particle.draw(context);
    });
  }
  checkFregataLineCollision(context) {
    if (this.ships[2].checkArcCollision1(this.ships[0].missilesS1.p21))
      this.fregataArcCollision1 = true;
    if (this.ships[2].checkArcCollision2(this.ships[1].missilesS1.p21))
      this.fregataArcCollision2 = true;
    if (this.fregataArcCollision1 && this.fregataArcCollision2)
      if (this.zoomTime < this.zoomInterval) {
        this.zoomIn(context);
        this.zoomTime += 5;
      }
  }
  controlMissiles(context) {
    if (!this.fregataArcCollision1)
      Object.keys(this.ships[0].missilesS1).forEach((key) => {
        this.ships[0].missilesS1[key].draw(context);
        this.ships[0].missilesS1[key].update();
      });
    else if (this.fregataArcCollision1)
      Object.keys(this.ships[0].missilesS1).forEach((key) => {
        if (!this.ships[0].missilesS1[key].deviat)
          this.ships[0].missilesS1[key].draw(context);
        else this.ships[0].missilesS1[key].drawAfterDeviation(context);
      });
    if (!this.fregataArcCollision2)
      Object.keys(this.ships[1].missilesS1).forEach((key) => {
        this.ships[1].missilesS1[key].draw2(context);
        this.ships[1].missilesS1[key].update2();
      });
    else if (this.fregataArcCollision2)
      Object.keys(this.ships[1].missilesS1).forEach((key) => {
        if (!this.ships[1].missilesS1[key].deviat)
          this.ships[1].missilesS1[key].draw2(context);
        else this.ships[1].missilesS1[key].drawAfterDeviation2(context);
      });
  }

  zoomIn(context) {
    this.background.marks.markDistance *= 1.2;
    this.ships[2].radius *= 1;
    this.ships[2].width *= 1.07;
    this.ships[2].y /= 1.17;
    this.ships[2].x /= 0.9;
    this.ships[2].height *= 1.07;
    this.ships[2].draw(context);
    Object.keys(this.ships[0].missilesS1).forEach((key) => {
      this.ships[0].missilesS1[key].x *= 1.046;
      this.ships[0].missilesS1[key].y *= 1.015;
      this.ships[0].missilesS1[key].width *= 1.02;
      this.ships[0].missilesS1[key].height *= 1.02;
    });
    Object.keys(this.ships[1].missilesS1).forEach((key) => {
      this.ships[1].missilesS1[key].x += 50;
      this.ships[1].missilesS1[key].y2 -= 20;
      this.ships[1].missilesS1[key].width *= 1.02;
      this.ships[1].missilesS1[key].height *= 1.02;
    });
    Object.keys(this.ships[0].missilesS2).forEach((key) => {
      this.ships[0].missilesS2[key].x *= 1.04;
      this.ships[0].missilesS2[key].y *= 1.015;
      this.ships[0].missilesS2[key].width *= 1.02;
      this.ships[0].missilesS2[key].height *= 1.02;
    });
    Object.keys(this.ships[1].missilesS2).forEach((key) => {
      this.ships[1].missilesS2[key].x += 50;
      this.ships[1].missilesS2[key].y2 -= 20;
      this.ships[1].missilesS2[key].width *= 1.02;
      this.ships[1].missilesS2[key].height *= 1.02;
    });
    this.background.marks.draw(context);
    this.scenariu1Time = true;
    this.zoomedIn = true;
    setTimeout(() => {
      btnScenariu1.style.display = 'block';
      btnScenariu2.style.display = 'block';
    }, 100);
  }
  update(context) {
    if (this.continue) {
      this.checkFregataLineCollision(context);
      this.controlMissiles(context);
      this.smokeParticles.forEach((particle) => {
        particle.update();
      });
      this.smokeParticles = this.smokeParticles.filter(
        (particle) => !particle.markedForDeletion
      );
      this.smokeParticlesAK726.forEach((particle) => {
        particle.update();
      });
      this.smokeParticlesAK726 = this.smokeParticlesAK726.filter(
        (particle) => !particle.markedForDeletion
      );
      this.explosions.forEach((explosion) => {
        explosion.update(context);
        explosion.draw(context);
      });
      this.explosions = this.explosions.filter(
        (explosion) => !explosion.markedForDeletion
      );
      this.cloud = this.cloud.filter((cloud) => !cloud.markedForDeletion);
      this.cloud2 = this.cloud2.filter((cloud) => !cloud.markedForDeletion);
      if (this.ships[2].isDrawn) this.ships[2].radar.update();
    }
    Object.keys(this.ships[0].missilesS1).forEach((key) => {
      if (!this.ships[0].missilesS1[key].deviat)
        this.ships[0].missilesS1[key].draw(context);
      else this.ships[0].missilesS1[key].drawAfterDeviation(context);
    });
    Object.keys(this.ships[1].missilesS1).forEach((key) => {
      if (!this.ships[1].missilesS1[key].deviat)
        this.ships[1].missilesS1[key].draw2(context);
      else this.ships[1].missilesS1[key].drawAfterDeviation2(context);
    });
    if (
      this.scenariu2Time &&
      this.ships[0].missilesS2.p21 &&
      this.ships[0].missilesS2.p22 &&
      this.ships[1].missilesS2.p21 &&
      this.ships[1].missilesS2.p22
    ) {
      Object.keys(this.ships[0].missilesS2).forEach((key) => {
        this.ships[0].missilesS2[key].draw(context);
      });
      Object.keys(this.ships[1].missilesS2).forEach((key) => {
        this.ships[1].missilesS2[key].draw2(context);
      });
    }
  }
  controlMissilesBeforeAttackShip0Scenariu1(missile, shipPos) {
    if (missile && missile.x > shipPos) {
      missile.speedX = this.speed;
      missile.speedY = this.speed * 0.2;
      missile.lightHeadMissile();
      missile.x -= missile.speedX;
      missile.y -= missile.speedY;
    } else if (missile && missile.x <= shipPos) {
      missile.deviat = true;
      missile.lightHead = false;
      // modificare directie dupa deviere ptr npr1 scenariu1 ambele rachete
      missile.speedX = this.speed;
      missile.speedY = this.speed * 0.2;
      missile.x -= missile.speedX;
      missile.y += missile.speedY;
      if (
        missile.x <= 0 - missile.width ||
        missile.y >= this.height + missile.height
      )
        missile.markedForDeletion = true;
    }
  }
  controlMissilesBeforeAttackShip1Scenariu1(missile, shipPos) {
    if (missile && missile.x > shipPos) {
      missile.speedX = this.speed;
      missile.speedY = this.speed * 0.3;
      missile.lightHeadMissile();
      missile.x -= missile.speedX;
      missile.y2 += missile.speedY;
    } else if (missile && missile.x <= shipPos) {
      missile.deviat = true;
      missile.lightHead = false;
      // modificare directie dupa deviere ptr npr1 scenariu1 ambele rachete
      missile.speedX = this.speed;
      missile.speedY = this.speed;
      missile.x -= missile.speedX;
      missile.y2 -= missile.speedY;
      if (
        missile.x <= 0 - missile.width ||
        missile.y2 >= this.height + missile.height
      )
        missile.markedForDeletion = true;
    }
  }
  controlFireAK630(context, ak1, ak2) {
    if (!ak1.fireStop) {
      ak1.update(context);
      ak2.x = this.width / 2.65;
      ak2.y = this.height / 3.45;
      ak2.update(context);
    }
  }
  controlFireAK726(context, ak1, ak2) {
    if (!ak1.fireStop) {
      ak1.update(context);
      ak2.fireInterval = 120;
      ak2.x = this.width / 6;
      ak2.y = this.height / 2.1;
      ak2.update(context);
    }
  }
  controlAttackShip0S1() {
    const ship = this.ships[0];
    if (ship.missilesS1.p21) {
      this.controlMissilesBeforeAttackShip0Scenariu1(
        ship.missilesS1.p21,
        // modificare pozitie deviere racheta npr1 p21 scenariu 1
        this.ships[2].x + this.ships[2].width
      );
    }
    if (ship.missilesS1.p22) {
      this.controlMissilesBeforeAttackShip0Scenariu1(
        ship.missilesS1.p22,
        // modificare pozitie deviere racheta npr1 p22 scenariu 1
        this.ships[2].x + this.ships[2].width
      );
    }
    if (ship.missilesS1.p21 && ship.missilesS1.p21.markedForDeletion)
      delete ship.missilesS1.p21;
    if (ship.missilesS1.p22 && ship.missilesS1.p22.markedForDeletion)
      delete ship.missilesS1.p22;
  }
  controlAttackShip1S1() {
    const ship = this.ships[1];
    if (ship.missilesS1.p21) {
      this.controlMissilesBeforeAttackShip1Scenariu1(
        ship.missilesS1.p21,
        // modificare pozitie deviere racheta npr2 p21 scenariu 1
        this.ships[2].x + this.ships[2].width
      );
    }
    if (ship.missilesS1.p22) {
      this.controlMissilesBeforeAttackShip1Scenariu1(
        ship.missilesS1.p22,
        // modificare pozitie deviere racheta npr2 p22 scenariu 1
        this.ships[2].x + this.ships[2].width
      );
    }
    if (ship.missilesS1.p21 && ship.missilesS1.p21.markedForDeletion)
      delete ship.missilesS1.p21;
    if (ship.missilesS1.p22 && ship.missilesS1.p22.markedForDeletion)
      delete ship.missilesS1.p22;
  }

  controlMissilesBeforeAttackShip0S2(
    missile,
    shipPos,
    explosionX,
    explosionY,
    explosionSize
  ) {
    if (missile && missile.x > shipPos) {
      missile.speedX = this.speed * 0.7;
      missile.speedY = this.speed * 0.15;
      missile.lightHeadMissile();
      missile.x -= missile.speedX;
      missile.y -= missile.speedY;
    } else if (missile && missile.x <= shipPos) {
      if (this.explosionCount < this.maxExplosions) {
        this.explosions.unshift(
          new Explosion(this, explosionX, explosionY, explosionSize)
        );
        this.explosionCount++;
        missile.markedForDeletion = true;
      }
    }
  }
  controlMissilesBeforeAttackShip1S2(
    missile,
    shipPos,
    explosionX,
    explosionY,
    explosionSize
  ) {
    if (missile && missile.x > shipPos) {
      missile.speedX = this.speed * 0.7;
      missile.speedY = this.speed * 0.2;
      missile.lightHeadMissile();
      missile.x -= missile.speedX;
      missile.y2 += missile.speedY;
    } else if (missile && missile.x <= shipPos) {
      if (this.explosionCount < this.maxExplosions) {
        this.explosions.unshift(
          new Explosion(this, explosionX, explosionY, explosionSize)
        );
        this.explosionCount++;
        missile.markedForDeletion = true;
      }
    }
  }
  controlAttackShip0S2(ship) {
    if (ship.missilesS2.p21) {
      this.controlMissilesBeforeAttackShip0S2(
        ship.missilesS2.p21,
        // modificare cand racheta explodeaza
        this.ships[2].x,
        // modificare explozie npr1 racheta p21 scenariu 2
        ship.missilesS2.p22.x - ship.missilesS2.p22.width * 1.5,
        ship.missilesS2.p22.y - ship.missilesS2.p22.height,
        this.explosionShip
      );
    }
    if (ship.missilesS2.p22) {
      this.controlMissilesBeforeAttackShip0S2(
        ship.missilesS2.p22,
        // modificare cand racheta explodeaza
        this.ships[2].x / 0.47,
        // modificare explozie npr1 racheta p22 scenariu 2
        ship.missilesS2.p22.x - ship.missilesS2.p22.width * 1.5,
        ship.missilesS2.p22.y - ship.missilesS2.p22.height,
        this.explosionShip
      );
    }
    if (ship.missilesS2.p21 && ship.missilesS2.p21.markedForDeletion)
      delete ship.missilesS2.p21;
    if (ship.missilesS2.p22 && ship.missilesS2.p22.markedForDeletion)
      delete ship.missilesS2.p22;
  }
  controlAttackShip1S2(ship) {
    if (ship.missilesS2.p21) {
      this.controlMissilesBeforeAttackShip1S2(
        ship.missilesS2.p21,
        // modificare cand racheta explodeaza
        this.ships[2].x + (this.ships[2].width * 3) / 4,
        // modificare explozie npr2 racheta p21 scenariu 2
        ship.missilesS2.p22.x - ship.missilesS2.p22.width,
        ship.missilesS2.p22.y2 - ship.missilesS2.p22.height,
        this.explosionShip
      );
    }
    if (ship.missilesS2.p22) {
      this.controlMissilesBeforeAttackShip1S2(
        ship.missilesS2.p22,
        // modificare cand racheta explodeaza
        this.ships[2].x + (this.ships[2].width * 3) / 4,
        // modificare explozie npr2 racheta p22 scenariu 2
        ship.missilesS2.p22.x - ship.missilesS2.p22.width,
        ship.missilesS2.p22.y2 - ship.missilesS2.p22.height,
        this.explosionShip
      );
    }
    if (ship.missilesS2.p21 && ship.missilesS2.p21.markedForDeletion)
      delete ship.missilesS2.p21;
    if (ship.missilesS2.p22 && ship.missilesS2.p22.markedForDeletion)
      delete ship.missilesS2.p22;
  }

  checkFregataLineCollision_2kmS1() {
    if (
      this.ships[0].missilesS1.p21 &&
      this.ships[2].checkArcCollision1(
        this.ships[0].missilesS1.p21,
        this.ships[0].missilesS1.p21.x,
        this.ships[0].missilesS1.p21.y
      )
    )
      this.fregataArcCollision1_2kmS1 = true;

    if (
      this.ships[1].missilesS1.p21 &&
      this.ships[2].checkArcCollision2(
        this.ships[1].missilesS1.p21,
        this.ships[1].missilesS1.p21.x,
        this.ships[1].missilesS1.p21.y2
      )
    )
      this.fregataArcCollision2_2kmS1 = true;
  }
  checkFregataLineCollision_2kmS2() {
    if (
      this.ships[0].missilesS2.p21 &&
      this.ships[2].checkArcCollision1(
        this.ships[0].missilesS2.p21,
        this.ships[0].missilesS2.p21.x,
        this.ships[0].missilesS2.p21.y
      )
    )
      this.fregataArcCollision1_2kmS2 = true;

    if (
      this.ships[1].missilesS2.p21 &&
      this.ships[2].checkArcCollision2(
        this.ships[1].missilesS2.p21,
        this.ships[1].missilesS2.p21.x,
        this.ships[1].missilesS2.p21.y2
      )
    )
      this.fregataArcCollision2_2kmS2 = true;
  }
  scenariu1(context) {
    if (this.scenariu1Time && this.continue) {
      this.checkFregataLineCollision_2kmS1();
      if (this.fregataArcCollision1_2kmS1) {
        this.ships[2].firePK16_2.update(context);
      }
      this.cloud2.forEach((cloud) => {
        cloud.update(context);
      });
      this.ships[2].draw(context);
      this.controlAttackShip0S1();
      this.controlAttackShip1S1();
      if (this.fregataArcCollision1_2kmS1) {
        this.ships[2].firePK16.update(context);
      }
      this.cloud.forEach((cloud) => {
        cloud.update(context);
      });
      if (
        Object.keys(this.ships[0].missilesS1).length === 0 &&
        Object.keys(this.ships[1].missilesS1).length === 0
      ) {
        this.attackOverS1 = true;
        this.scenariu2Time = true;
      } else {
        requestAnimationFrame(() => this.scenariu1(context));
      }
    }
  }
  scenariu2(context) {
    if (this.scenariu2Time && this.continue) {
      Object.keys(this.ships[0].missilesS2).forEach((key) => {
        this.ships[0].missilesS2[key].draw(context);
        this.ships[0].missilesS2[key].update();
      });
      Object.keys(this.ships[1].missilesS2).forEach((key) => {
        this.ships[1].missilesS2[key].draw2(context);
        this.ships[1].missilesS2[key].update2();
      });
      this.checkFregataLineCollision_2kmS2();
      this.controlAttackShip0S2(this.ships[0]);
      this.controlAttackShip1S2(this.ships[1]);
      if (this.fregataArcCollision1_2kmS2 && this.fregataArcCollision2_2kmS2) {
        this.controlFireAK630(
          context,
          this.ships[2].fireAK630[0],
          this.ships[2].fireAK630[1]
        );
        this.smokeParticles.forEach((particle) => {
          particle.draw(context);
        });
      }
      this.controlFireAK726(
        context,
        this.ships[2].fireAK726[0],
        this.ships[2].fireAK726[1]
      );
      if (
        Object.keys(this.ships[0].missilesS2).length === 0 &&
        Object.keys(this.ships[1].missilesS2).length === 0
      ) {
        this.attackOverS2 = true;
      } else {
        requestAnimationFrame(() => this.scenariu2(context));
      }
    }
  }

  animate(context) {
    this.draw(context);
    this.update(context);
    requestAnimationFrame(() => this.animate(context));
  }
}
