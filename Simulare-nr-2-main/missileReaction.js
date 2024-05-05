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
		if (this.x > this.simulare.width / 1.8) this.speedX = this.speedX * -1;
		this.x += this.speedX;
		this.y += this.speedY;
		this.size *= 1.005;
		if (this.size > 100) this.markedForDeletion = true;
	}
}
