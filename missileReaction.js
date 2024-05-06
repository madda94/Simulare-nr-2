class Particle {
	constructor(simulare) {
		this.simulare = simulare;
		this.markedForDeletion = false;
	}
	update() {
		this.x -= this.speedX + this.simulare.speed;
		this.y -= this.speedY;
		this.size *= 0.97;
		if (this.size < 0.5) this.markedForDeletion = true;
	}
}
export class Dust extends Particle {
	constructor(simulare) {
		super(simulare);
		this.size = Math.random() * 10 + 30;
		this.x = this.simulare.width / 2.5;
		this.y = this.simulare.height / 3.1;
		this.speedX = Math.random() + 2;
		this.speedY = Math.random() * 2 - 2;
		this.color = 'rgba(78, 70, 70, 0.1)';
	}
	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
		context.fillStyle = this.color;
		context.fill();
	}
	update() {
		if (this.x > this.simulare.width / 2) this.speedX = this.speedX * -1;
		this.x += this.speedX;
		this.y += this.speedY;
		this.size *= 1.005;
		if (this.size > 100) this.markedForDeletion = true;
	}
}
export class SmokeAK726 extends Dust {
	constructor(simulare, x, y) {
		super(simulare);
		this.x = x;
		this.y = y;
	}
}

export class Cloud extends Particle {
	constructor(simulare, x, y) {
		super(simulare);
		this.size = Math.random() * 10 + 10;
		this.x = x;
		this.speedX = 0;
		this.speedY = 0;
		this.y = y;
		this.opacity = 0.4;
		this.opacityDecrease = 0.0005;
		this.color = `rgba(187, 205, 229, ${this.opacity})`;
		// this.range = 20
		this.timer = 0;
		this.interval = 50;
	}
	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		context.arc(this.x - 10, this.y, this.size, 0, Math.PI * 2);
		context.arc(this.x - 20, this.y, this.size, 0, Math.PI * 2);
		context.arc(this.x - 30, this.y, this.size, 0, Math.PI * 2);
		context.arc(this.x - 5, this.y - 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 15, this.y - 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 25, this.y - 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 35, this.y - 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 5, this.y + 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 15, this.y + 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 25, this.y + 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 35, this.y + 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 10, this.y + 10, this.size, 0, Math.PI * 2);
		context.arc(this.x - 20, this.y + 10, this.size, 0, Math.PI * 2);
		context.arc(this.x - 30, this.y + 10, this.size, 0, Math.PI * 2);
		context.arc(this.x - 10, this.y - 10, this.size, 0, Math.PI * 2);
		context.arc(this.x - 20, this.y - 10, this.size, 0, Math.PI * 2);
		context.arc(this.x - 30, this.y - 10, this.size, 0, Math.PI * 2);
		context.fillStyle = this.color;
		context.fill();
	}
	update(context) {
		this.draw(context);
		// if (this.x < 0) this.x = 0;
		// if (this.y > this.simulare.height) this.y = this.simulare.height;
		if (this.size > 60) {
			if (this.timer < this.interval) this.timer++;
			else this.size *= 1.002;
		} else this.size *= 1.007;
		this.opacity -= this.opacityDecrease;
		this.color = `rgba(187, 205, 229, ${this.opacity})`;
		if (this.size > 100 || this.opacity === 0) this.markedForDeletion = true;
	}
}
