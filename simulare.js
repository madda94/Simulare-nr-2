import { Ship, Fregata } from './ship.js';
import { Background } from './scrollingBackground.js';
import { btnsScenarii } from './script.js';
import { Explosion } from './explosions.js';

export class Simulare {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.background = new Background(this);
		this.ships = [new Ship(this), new Ship(this), new Fregata(this)];
		this.smokeParticles = [];
		this.smokeParticlesAK726 = [];
		this.explosions = [];
		this.cloud = [];
		this.fregataArcCollision1 = false;
		this.fregataArcCollision2 = false;
		this.fregataArcCollision1_2km = false;
		this.fregataArcCollision2_2km = false;
		this.fps = 20;
		this.zoomInterval = 1000 / this.fps;
		this.zoomTime = 0;
		this.scenariu1Time = false;
		this.scenariu2Time = false;
		this.zoomedIn = false;
		this.explosionCount = 0;
		this.maxExplosions = 10;
		this.explosionMissile = 1;
		this.explosionShip = 2;
		this.attackOver = false;
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
		if (this.ships[2].checkArcCollision1(this.ships[0].missiles.p21))
			this.fregataArcCollision1 = true;
		if (this.ships[2].checkArcCollision2(this.ships[1].missiles.p21))
			this.fregataArcCollision2 = true;
		if (this.fregataArcCollision1 && this.fregataArcCollision2)
			if (this.zoomTime < this.zoomInterval) {
				this.zoomIn(context);
				this.zoomTime += 5;
			}
	}
	controlMissiles(context) {
		if (!this.fregataArcCollision1)
			Object.keys(this.ships[0].missiles).forEach((key) => {
				this.ships[0].missiles[key].draw(context);
				this.ships[0].missiles[key].update();
			});
		else if (this.fregataArcCollision1)
			Object.keys(this.ships[0].missiles).forEach((key) => {
				if (!this.ships[0].missiles[key].deviat)
					this.ships[0].missiles[key].draw(context);
				else this.ships[0].missiles[key].drawAfterDeviation(context);
			});
		if (!this.fregataArcCollision2)
			Object.keys(this.ships[1].missiles).forEach((key) => {
				this.ships[1].missiles[key].draw2(context);
				this.ships[1].missiles[key].update2();
			});
		else if (this.fregataArcCollision2)
			Object.keys(this.ships[1].missiles).forEach((key) => {
				this.ships[1].missiles[key].draw2(context);
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
		Object.keys(this.ships[0].missiles).forEach((key) => {
			this.ships[0].missiles[key].x *= 1.046;
			this.ships[0].missiles[key].y *= 1.015;
			this.ships[0].missiles[key].width *= 1.02;
			this.ships[0].missiles[key].height *= 1.02;
			this.ships[0].missiles[key].draw(context);
		});
		Object.keys(this.ships[1].missiles).forEach((key) => {
			this.ships[1].missiles[key].x += 50;
			this.ships[1].missiles[key].y2 -= 20;
			this.ships[1].missiles[key].width *= 1.02;
			this.ships[1].missiles[key].height *= 1.02;
			this.ships[1].missiles[key].draw2(context);
		});
		this.background.marks.draw(context);
		this.scenariu1Time = true;
		this.zoomedIn = true;
		setTimeout(() => {
			btnsScenarii.style.display = 'block';
		}, 100);
	}
	update(context) {
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
		if (this.ships[2].isDrawn) this.ships[2].radar.update();
	}
	controlMissilesBeforeAttackShip0MissileP21(missile, shipPos) {
		if (missile && missile.x > shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.2;
			missile.lightHeadMissile();
			missile.x -= missile.speedX;
			missile.y -= missile.speedY;
		} else if (missile && missile.x <= shipPos) {
			missile.deviat = true;
			missile.lightHead = false;
			missile.speedX = 1;
			missile.speedY = 0.2;
			missile.x -= missile.speedX;
			missile.y += missile.speedY;
			if (
				missile.x <= 0 - missile.width ||
				missile.y >= this.height + missile.height
			)
				missile.markedForDeletion = true;
		}
	}
	controlMissilesBeforeAttackShip0MissileP22(
		missile,
		shipPos,
		explosionX,
		explosionY,
		explosionSize
	) {
		if (missile && missile.x > shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.2;
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
	controlMissilesBeforeAttackShip1(
		missile,
		shipPos,
		explosionX,
		explosionY,
		explosionSize
	) {
		if (missile && missile.x > shipPos) {
			missile.speedX = 1;
			missile.speedY = 0.3;
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

	controlAttackShip0(ship) {
		if (ship.missiles.p21) {
			this.controlMissilesBeforeAttackShip0MissileP21(
				ship.missiles.p21,
				this.ships[2].x + this.ships[2].width / 1.3
			);
		}
		if (ship.missiles.p22) {
			this.controlMissilesBeforeAttackShip0MissileP22(
				ship.missiles.p22,
				this.ships[2].x / 0.47,
				ship.missiles.p22.x - ship.missiles.p22.width * 1.5,
				ship.missiles.p22.y - ship.missiles.p22.height,
				this.explosionShip
			);
		}
		if (ship.missiles.p21 && ship.missiles.p21.markedForDeletion)
			delete ship.missiles.p21;
		if (ship.missiles.p22 && ship.missiles.p22.markedForDeletion)
			delete ship.missiles.p22;
		console.log(ship.missiles);
	}
	controlAttackShip1(ship) {
		if (ship.missiles.p21) {
			this.controlMissilesBeforeAttackShip1(
				ship.missiles.p21,
				this.ships[2].x + this.ships[2].width,
				ship.missiles.p21.x,
				ship.missiles.p21.y2,
				this.explosionMissile
			);
		}
		if (ship.missiles.p22) {
			this.controlMissilesBeforeAttackShip1(
				ship.missiles.p22,
				this.ships[2].x + (this.ships[2].width * 3) / 4,
				ship.missiles.p22.x - ship.missiles.p22.width,
				ship.missiles.p22.y2 - ship.missiles.p22.height,
				this.explosionShip
			);
		}
		if (ship.missiles.p21 && ship.missiles.p21.markedForDeletion)
			delete ship.missiles.p21;
		if (ship.missiles.p22 && ship.missiles.p22.markedForDeletion)
			delete ship.missiles.p22;
	}

	checkFregataLineCollision_2km() {
		if (
			this.ships[0].missiles.p21 &&
			this.ships[2].checkArcCollision1(
				this.ships[0].missiles.p21,
				this.ships[0].missiles.p21.x,
				this.ships[0].missiles.p21.y
			)
		)
			this.fregataArcCollision1_2km = true;

		if (
			this.ships[1].missiles.p21 &&
			this.ships[2].checkArcCollision2(
				this.ships[1].missiles.p21,
				this.ships[1].missiles.p21.x,
				this.ships[1].missiles.p21.y2
			)
		)
			this.fregataArcCollision2_2km = true;
	}
	scenariu1(context) {
		if (this.scenariu1Time) {
			this.checkFregataLineCollision_2km();
			this.controlAttackShip0(this.ships[0]);
			this.controlAttackShip1(this.ships[1]);
			if (this.fregataArcCollision2_2km) {
				this.controlFireAK630(
					context,
					this.ships[2].fireAK630[0],
					this.ships[2].fireAK630[1]
				);
				this.smokeParticles.forEach((particle) => {
					particle.draw(context);
				});
			}
			if (this.fregataArcCollision1_2km) {
				this.ships[2].firePK16.update(context);
			}

			this.controlFireAK726(
				context,
				this.ships[2].fireAK726[0],
				this.ships[2].fireAK726[1]
			);

			this.cloud.forEach((cloud) => {
				cloud.update(context);
			});
			if (
				Object.keys(this.ships[0].missiles).length === 0 &&
				Object.keys(this.ships[1].missiles).length === 0
			)
				this.attackOver = true;
		}
		if (!this.attackOver) requestAnimationFrame(() => this.scenariu1(context));
	}

	animate(context) {
		this.draw(context);
		this.update(context);
		requestAnimationFrame(() => this.animate(context));
	}
}
