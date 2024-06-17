import {
	Dust,
	SmokeAK726,
	Cloud0,
	Cloud1,
	Cloud2,
	Cloud3,
	Cloud4,
	Cloud5,
} from './missileReaction.js';

class Missile {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.spriteWidth = 238;
		this.spriteHeight = 179;
		this.width = this.spriteWidth / 3;
		this.height = this.spriteHeight / 3;
		this.speedX = this.simulare.speed * 3;
		this.speedY = this.simulare.speed * 0.7;
		this.frame = 1;
		this.frameTime = 0;
		this.frameInterval = 5000;
		this.updatedPosition = false;
		this.radius = this.width / 2;
		this.markedForDeletion = false;
		this.moveDown = false;
		this.deviat = false;
		this.lightHead = true;
		this.reseted = false;
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
	drawAfterDeviation2(context) {
		context.save();
		context.translate(this.x + this.width / 2, this.y2 + this.height / 2);
		context.rotate(Math.PI / 6.5);
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
		this.x = this.simulare.width / 3.34;
		this.y = this.simulare.height / 3.85;
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
		this.x = this.simulare.width / 9;
		this.y = this.simulare.height / 2.5;
		this.moveX = this.x;
		this.moveY = this.y;
		this.speedX = this.simulare.speed * 8;
		this.speedY = this.simulare.speed * 2;
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
		this.x = this.simulare.width / 3.7;
		this.y = this.simulare.height / 3.6;
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

class FirePK16 {
	constructor(simulare, x, y) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.x = x;
		this.width = 7;
		this.height = 30;
		this.y = y;
		this.moveX = this.x;
		this.moveY = this.y;
		this.color = 'black';
		this.hasAppeared = false; // Add a flag to track if the fire particle has appeared
		this.cloudCreated = false; // Add a flag to track if the cloud has been created
	}
	draw(context) {
		context.save();
		context.beginPath();
		context.translate(
			this.moveX + this.width,
			this.moveY + this.height,
		);
		context.rotate(this.rotationGrade);
		context.translate(-this.width / 2, -this.height / 2);
		context.fillStyle = this.color;
		context.roundRect(0, 0, this.width, this.height, [0, 0, 5, 5]);
		context.fill();
		context.restore();
	}

	update(context) {
		this.fireTime++;
		if (this.fireTime >= this.delay) {
			// delay has elapsed, update the particle
			if (!this.hasAppeared) {
				this.draw(context);
			// modificare distanta PK16
				if (this.moveX <= this.x + 400) {
					this.moveX += this.speedX;
					this.moveY -= this.speedY;
					this.draw(context);
				} else {
					this.createCloud(this.moveX + 20, this.moveY + 20);
					this.cloudCreated = true;
					this.hasAppeared = true;
				}
			} else if (this.cloudCreated && this.simulare.cloud[this.numberCloud]) {
				this.simulare.cloud[this.numberCloud].draw(context);
			}
		}
	}
}
export class FirePK16_1 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 1.5;
		this.numberCloud = 0;
		this.delay = 50; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 9;
		this.speedY = 2;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud0(this.simulare, x, y));
	}
}

export class FirePK16_2 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 1.7;
		this.numberCloud = 3;
		this.delay = 80; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 9;
		this.speedY = 2;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud1(this.simulare, x, y));
	}
}
export class FirePK16_3 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 1.8;
		this.numberCloud = 2;
		this.delay = 110; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 9;
		this.speedY = 2.5;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud2(this.simulare, x, y));
	}
}
export class FirePK16_4 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 1.85;
		this.numberCloud = 5;
		this.delay = 140; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 9;
		this.speedY = 2;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud3(this.simulare, x, y));
	}
}
export class FirePK16_5 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 1.95;
		this.numberCloud = 2;
		this.delay = 170; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 9;
		this.speedY = 2.1;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud4(this.simulare, x, y));
	}
}
export class FirePK16_6 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 2;
		this.numberCloud = 3;
		this.delay = 200; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 9;
		this.speedY = 1;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud5(this.simulare, x, y));
		// cloud.draw(context);
	}
}
export class FirePK16_7 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 4.5;
		this.numberCloud = 0;
		this.delay = 50; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 6;
		this.speedY = -5;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud0(this.simulare, x, y));
	}
}

export class FirePK16_8 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 4.5;
		this.numberCloud = 1;
		this.delay = 80; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 5;
		this.speedY = -4;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud1(this.simulare, x, y));
	}
}
export class FirePK16_9 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 4.5;
		this.numberCloud = 2;
		this.delay = 110; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 6.1;
		this.speedY = -4.2;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud2(this.simulare, x, y));
	}
}
export class FirePK16_10 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 4.5;
		this.numberCloud = 3;
		this.delay = 140; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 5.5;
		this.speedY = -4.3;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud3(this.simulare, x, y));
	}
}
export class FirePK16_11 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 4.5;
		this.numberCloud = 4;
		this.delay = 170; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 6.5;
		this.speedY = -5;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud4(this.simulare, x, y));
	}
}
export class FirePK16_12 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 4.5;
		this.numberCloud = 5;
		this.delay = 200; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = 7;
		this.speedY = -4;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud5(this.simulare, x, y));
	}
}
