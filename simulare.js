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
		this.cloud.forEach((cloud) => {
			cloud.draw(context);
		});
	}
		// la coliziunea rachetelor cu linia fregatei se da zoom
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
		// controlul rachetelor inainte de a ajunge la linie
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
	// controlul navei si a rachetelor in zoom
	zoomIn(context) {
		this.background.marks.markDistance *= 1.2;
		this.ships[2].radius *= 1;
		this.ships[2].width *= 1.07;
		this.ships[2].y /= 1.15;
		this.ships[2].x /= 1.1;
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
	// intreaga simulare se actualizeaza
	update(context) {
		if (this.continue) {
			this.checkFregataLineCollision(context);
			this.controlMissiles(context);
			this.smokeParticles.forEach((particle) => {
				particle.update();
			});
			// actualizarea fumului rezultat de la tunuri
			this.smokeParticles = this.smokeParticles.filter(
				(particle) => !particle.markedForDeletion
			);
			this.smokeParticlesAK726.forEach((particle) => {
				particle.update();
			});
			this.smokeParticlesAK726 = this.smokeParticlesAK726.filter(
				(particle) => !particle.markedForDeletion
			);
			// actualizare explozii
			this.explosions.forEach((explosion) => {
				explosion.update(context);
				explosion.draw(context);
			});
			this.explosions = this.explosions.filter(
				(explosion) => !explosion.markedForDeletion
			);
			// actualizarea norilor rezultati din dispersarea instalatiilor de bruiaj
			this.cloud = this.cloud.filter((cloud) => !cloud.markedForDeletion);
			if (this.ships[2].isDrawn) this.ships[2].radar.update();
		}
		// desenarea rachetelor daca este apasat butonul de pauza
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
		// controlul rachetelor navei npr1 si devierea acestora cand intra in norul de bruiaj
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
			missile.speedX = this.speed / 0.5;
			missile.speedY = this.speed / 10;
			missile.x -= missile.speedX;
			missile.y += missile.speedY;
			if (
				missile.x <= 0 - missile.width ||
				missile.y >= this.height + missile.height
			)
				missile.markedForDeletion = true;
		}
	}
	// controlul rachetelor navei npr2 si devierea acestora cand intra in norul de bruiaj
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
			missile.speedX = this.speed / 0.7;
			missile.speedY = this.speed / 1;
			missile.x -= missile.speedX;
			missile.y2 -= missile.speedY;
			if (
				missile.x <= 0 - missile.width ||
				missile.y2 >= this.height + missile.height
			)
				missile.markedForDeletion = true;
		}
	}
	// controlul tunurilor AK630
	controlFireAK630(context, ak1, ak2) {
		if (!ak1.fireStop) {
			ak1.update(context);
			ak2.x = this.width / 3.34;
			ak2.y = this.height / 3.4;
			ak2.update(context);
		}
	}
	// controlul tunurilor AK726
	controlFireAK726(context, ak1, ak2) {
		if (!ak1.fireStop) {
			ak1.update(context);
			ak2.fireInterval = 120;
			ak2.x = this.width / 10;
			ak2.y = this.height / 2;
			ak2.update(context);
		}
	}
	// controlul atacului rachetelor navei 1 asupra fregatei scenariul 1
	controlAttackShip0S1() {
		const ship = this.ships[0];
		if (ship.missilesS1.p21) {
			this.controlMissilesBeforeAttackShip0Scenariu1(
				ship.missilesS1.p21,
				// modificare pozitie deviere racheta npr1 p21 scenariu 1
				this.ships[2].x + this.ships[2].width * 1.4
			);
		}
		if (ship.missilesS1.p22) {
			this.controlMissilesBeforeAttackShip0Scenariu1(
				ship.missilesS1.p22,
				// modificare pozitie deviere racheta npr1 p22 scenariu 1
				this.ships[2].x + this.ships[2].width * 1.4
			);
		}
		// daca rachetele au disparut de pe ecran, acestea vor fi sterse
		if (ship.missilesS1.p21 && ship.missilesS1.p21.markedForDeletion)
			delete ship.missilesS1.p21;
		if (ship.missilesS1.p22 && ship.missilesS1.p22.markedForDeletion)
			delete ship.missilesS1.p22;
	}
	// controlul atacului rachetelor navei 2 asupra fregatei scenariu 1
	controlAttackShip1S1() {
		const ship = this.ships[1];
		if (ship.missilesS1.p21) {
			this.controlMissilesBeforeAttackShip1Scenariu1(
				ship.missilesS1.p21,
				// modificare pozitie deviere racheta npr2 p21 scenariu 1
				this.ships[2].x + this.ships[2].width * 1.38
			);
		}
		if (ship.missilesS1.p22) {
			this.controlMissilesBeforeAttackShip1Scenariu1(
				ship.missilesS1.p22,
				// modificare pozitie deviere racheta npr2 p22 scenariu 1
				this.ships[2].x + this.ships[2].width * 1.38
			);
		}
		// daca rachetele au disparut de pe ecran, acestea vor fi sterse
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
	// controlul atacului rachetelor navei 1 asupra fregatei scenariul 2
	controlAttackShip0S2(ship) {
		if (ship.missilesS2.p21) {
			this.controlMissilesBeforeAttackShip0S2(
				ship.missilesS2.p21,
				// modificare cand racheta explodeaza
				this.ships[2].x * 4.5,
				// modificare explozie npr1 racheta p21 scenariu 2
				ship.missilesS2.p22.x - ship.missilesS2.p22.width * 3,
				ship.missilesS2.p22.y - ship.missilesS2.p22.height,
				this.explosionShip
			);
		}
		if (ship.missilesS2.p22) {
			this.controlMissilesBeforeAttackShip0S2(
				ship.missilesS2.p22,
				// modificare cand racheta explodeaza
				this.ships[2].x * 5,
				// modificare explozie npr1 racheta p22 scenariu 2
				ship.missilesS2.p22.x - ship.missilesS2.p22.width * 1.5,
				ship.missilesS2.p22.y - ship.missilesS2.p22.height,
				this.explosionShip
			);
		}
		// daca rachetele au disparut de pe ecran, acestea vor fi sterse
		if (ship.missilesS2.p21 && ship.missilesS2.p21.markedForDeletion)
			delete ship.missilesS2.p21;
		if (ship.missilesS2.p22 && ship.missilesS2.p22.markedForDeletion)
			delete ship.missilesS2.p22;
	}
	// controlul atacului rachetelor navei 2 asupra fregatei scenariul 2
	controlAttackShip1S2(ship) {
		if (ship.missilesS2.p21) {
			this.controlMissilesBeforeAttackShip1S2(
				ship.missilesS2.p21,
				// modificare cand racheta explodeaza
				this.ships[2].x + (this.ships[2].width * 3) / 4,
				// modificare explozie npr2 racheta p21 scenariu 2
				ship.missilesS2.p22.x - ship.missilesS2.p22.width * 2.5,
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
				ship.missilesS2.p22.x - ship.missilesS2.p22.width * 2,
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
			// controlul rachetelor navei npr1 in cadrul scenariului
			this.checkFregataLineCollision_2kmS1();
			this.ships[2].draw(context);
			this.controlAttackShip0S1();
			this.controlAttackShip1S1();
			if (this.fregataArcCollision1_2kmS1) {
				this.ships[2].firePK16_Up.forEach((fire) => {
					fire.update(context);
				});
			}
			if (this.fregataArcCollision1_2kmS1) {
				this.ships[2].firePK16_Down.forEach((fire) => {
					fire.update(context);
				});
			}
			// controlul norilor rezultati din dispersarea instalatiilor de bruiaj
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
