import { Dust } from './missileReaction.js';
import { Explosion } from './explosions.js';

class Missile {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.spriteWidth = 238;
		this.spriteHeight = 179;
		this.width = this.spriteWidth / 3;
		this.height = this.spriteHeight / 3;
		this.zoomedWidth = this.width * 1.22;
		this.zoomedHeight = this.width * 1.22;
		this.speedX = 3;
		this.speedY = 0.7;
		this.frame = 1;
		this.frameTime = 0;
		this.frameInterval = 5000;
		this.updatedPosition = false;
		this.radius = this.width / 2;
		this.explosions = [new Explosion(this)];
		this.markedForDeletion = false;
		this.moveDown = false;
	}
	draw(context) {
		context.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}
	draw2(context) {
		context.save();
		context.translate(this.x + this.width / 2, this.y2 + this.height / 2);
		context.rotate(-Math.PI / 4.5);
		context.translate(-this.width / 2, -this.height / 2);
		context.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			0,
			0,
			this.width,
			this.height
		);
		context.restore();
	}
	drawZoomed(context) {
		context.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.zoomedX,
			this.zoomedY,
			this.zoomedWidth,
			this.zoomedHeight
		);
	}
	update() {
		if (this.moveDown) {
			this.y;
		} else {
			this.x -= this.speedX;
			this.y -= this.speedY;
		}
	}
	update2() {
		this.x -= this.speedX;
		this.y2 += this.speedY;
	}

	updateZoomed() {
		if (this.moveDown) {
			this.speedX = 1;
			this.speedY = 0.4;
			this.zoomedX -= this.speedX;
			this.zoomedY += this.speedY;
		}
	}
	lightHeadMissile() {
		if (this.frameTime <= this.frameInterval) this.frameTime++;
		else if (this.frameTime >= this.frameInterval) {
			this.frame === 1 ? (this.frame = 0) : (this.frame = 1);
			this.frameTime = 0;
		}

		requestAnimationFrame(() => this.lightHeadMissile());
	}
	createExplosion(context, timestamp) {
		this.explosions = this.explosions.filter(
			(explosion) => !explosion.markedForDeletion
		);
		if (this.explosions.length !== 0)
			this.explosions.animate(context, timestamp);
	}
}

export class MissileP21 extends Missile {
	constructor(simulare) {
		super(simulare);
		this.x = this.totalWidth - 100;
		this.y = this.totalHeight;
		this.y2 = 0;
		this.image = p21Img;
	}
}

export class MissileP22 extends Missile {
	constructor(simulare) {
		super(simulare);
		this.x = this.totalWidth;
		this.y = this.totalHeight - 20;
		this.y2 = -20;
		this.image = p22Img;
		this.zoomedX = this.x * 1.63;
	}
}

export class FireAK630 {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.spriteWidth = 238;
		this.spriteHeight = 260;
		this.width = this.spriteWidth / 5;
		this.height = this.spriteHeight / 5;
		this.x = this.simulare.width / 2.53;
		this.y = this.simulare.height / 3.81;
		this.image = ak630img;
		this.fireCount = 0;
		this.maxFire = 40;
		this.fireInterval = 30;
		this.fireTime = 0;
		this.fireStop = this.fireCount > this.maxFire ? true : false;
	}
	draw(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
	update(context) {
		if (this.fireTime < this.fireInterval) this.fireTime++;
		else {
			this.draw(context);
			this.createSmokeReaction();
			this.fireCount++;
			this.fireTime = 0;
		}
		if (this.fireCount > this.maxFire) this.fireStop = true;
	}
	createSmokeReaction() {
		for (let i = 0; i < 15; i++) {
			this.simulare.smokeParticles.unshift(new Dust(this.simulare));
		}
	}
}

export class Radar {
	constructor(simulare) {
		this.simulare = simulare;
		this.image = radar;
		this.spriteWidth = 129.4;
		this.spriteHeight = 96.25;
		this.width = this.spriteWidth / 3.6;
		this.height = this.spriteHeight / 3.6;
		this.frameX = 0;
		this.maxFrameX = 4;
		this.maxFrameY = 3;
		this.frameY = 0;
		this.frameCount = 0;
		this.frameInterval = 15;
		this.x = this.simulare.width / 2.8;
		this.y = this.simulare.height / 3.9;
	}
	draw(context) {
		context.drawImage(
			this.image,
			this.frameX * this.spriteWidth,
			this.frameY * this.spriteHeight,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}
	update() {
		this.frameCount++;
		if (this.frameCount > this.frameInterval) {
			this.frameCount = 0;
			this.frameX++;
			if (this.frameX > this.maxFrameX) {
				this.frameX = 0;
				this.frameY++;
				if (this.frameY > this.maxFrameY) {
					this.frameY = 0;
				}
			}
		}
	}
}
