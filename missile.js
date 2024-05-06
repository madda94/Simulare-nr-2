import { Dust, SmokeAK726, Cloud } from './missileReaction.js';

class Missile {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.spriteWidth = 238;
		this.spriteHeight = 179;
		this.width = this.spriteWidth / 3;
		this.height = this.spriteHeight / 3;
		this.speedX = 3;
		this.speedY = 0.7;
		this.frame = 1;
		this.frameTime = 0;
		this.frameInterval = 5000;
		this.updatedPosition = false;
		this.radius = this.width / 2;
		this.markedForDeletion = false;
		this.moveDown = false;
		this.deviat = false;
		this.lightHead = true;
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
	drawAfterDeviation(context) {
		context.save();
		context.translate(this.x + this.width / 2, this.y + this.height / 2);
		context.rotate(-Math.PI / 6.5);
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
	update() {
		this.x -= this.speedX;
		this.y -= this.speedY;
	}
	update2() {
		this.x -= this.speedX;
		this.y2 += this.speedY;
	}
	lightHeadMissile() {
		if (this.lightHead) {
			if (this.frameTime <= this.frameInterval) this.frameTime++;
			else if (this.frameTime >= this.frameInterval) {
				this.frame === 1 ? (this.frame = 0) : (this.frame = 1);
				this.frameTime = 0;
			}

			requestAnimationFrame(() => this.lightHeadMissile());
		}
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
		this.x = this.simulare.width / 2.6;
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

export class FireAK726 {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.spriteWidth = 185;
		this.spriteHeight = 170;
		this.width = this.spriteWidth / 2.5;
		this.height = this.spriteHeight / 2.5;
		this.x = this.simulare.width / 5.8;
		this.y = this.simulare.height / 2.5;
		this.moveX = this.x;
		this.moveY = this.y;
		this.speedX = 8;
		this.speedY = 2;
		this.image = ak726img;
		this.fireCount = 0;
		this.maxFire = 7;
		this.fireInterval = 100;
		this.fireTime = 0;
		this.fireStop = this.fireCount > this.maxFire ? true : false;
	}
	draw(context) {
		this.createSmokeReaction();
		context.drawImage(
			this.image,
			0,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.moveX,
			this.moveY,
			this.width,
			this.height
		);
	}
	update(context) {
		if (this.fireTime < this.fireInterval) {
			if (this.moveX <= this.x + 300) {
				this.moveX += this.speedX;
				this.moveY += this.speedY;
				this.draw(context);
			}
			this.fireTime++;
		} else {
			this.moveX = this.x;
			this.moveY = this.y;
			this.draw(context);
			this.fireTime = 0;
		}
	}
	createSmokeReaction() {
		this.simulare.smokeParticlesAK726.unshift(
			new SmokeAK726(
				this.simulare,
				this.moveX + this.width,
				this.moveY + this.height / 2
			)
		);
	}
}
export class FirePK16 {
	constructor(simulare, x, y) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.x = x;
		this.width = 10;
		this.height = 30;
		this.y = y;
		this.moveX = this.x;
		this.moveY = this.y;
		this.fireInterval = 150;
		this.fireTime = 0;
		this.speedX = 3;
		this.speedY = 6;
		this.color = 'black';
		this.fireCount = 0;
		this.maxFire = 0;
		this.fireStop = false;
		this.cloudDrawn = false;
	}
	draw(context) {
		context.save();
		context.beginPath();
		context.translate(
			this.moveX + this.width / 2,
			this.moveY + this.height / 2
		);
		context.rotate(-Math.PI / 6);
		context.translate(-this.width / 2, -this.height / 2);
		context.fillStyle = this.color;
		context.roundRect(0, 0, this.width, this.height, [0, 0, 5, 5]);
		context.fill();
		context.restore();
	}

	update(context) {
		if (this.fireCount > this.maxFire) this.fireStop = true;
		if (!this.fireStop) {
			if (this.fireTime < this.fireInterval) {
				if (this.moveX <= this.x + 100) {
					this.moveX += this.speedX;
					this.moveY += this.speedY;
					this.draw(context);
				} else {
					this.createCloud(this.moveX + 20, this.moveY + 20);
					this.cloudDrawn = true;
				}
				this.fireTime++;
			} else {
				this.fireCount++;
				this.moveX = this.x;
				this.moveY = this.y;
				this.draw(context);
				this.fireTime = 0;
			}
		}
	}
	createCloud(x, y) {
		if (!this.cloudDrawn)
			this.simulare.cloud.unshift(new Cloud(this.simulare, x, y));
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
