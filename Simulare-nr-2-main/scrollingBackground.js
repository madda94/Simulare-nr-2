export class Background {
	constructor(simulare) {
		this.totalWidth = simulare.width;
		this.totalHeight = simulare.height;
		this.x = 0;
		this.y = 0;
		this.width = 2400;
		this.height = 800;
		this.speed = 10;
		this.moving = false;
		this.marks = new Marks(this);
		this.color = 'rgba(0, 0, 0, 0)';
	}
	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}

class Marks {
	constructor(background) {
		this.background = background;
		this.marks = [];
		for (let i = 80; i >= 0; i--) {
			this.marks.push(i);
		}
		this.markDistance = 50;
		this.startY = this.background.totalHeight - 20;
	}
	draw(context) {
		context.strokeStyle = 'black';
		context.font = '20px Helvetica';
		context.fillStyle = 'black';
		context.textAlign = 'left';
		for (let i = this.marks.length - 1; i >= 0; i--) {
			const markX = this.marks[i] * this.markDistance;
			if (i === 0 || i % 10 === 0) {
				context.lineWidth = 5;
				context.fillText(
					`${this.marks.length - 1 - i} km`,
					markX,
					this.startY - 10
				);
				context.beginPath();
				context.moveTo(markX, this.startY);
				context.lineTo(markX, this.startY + 15);
				context.stroke();
			} else {
				context.lineWidth = 3;
				context.beginPath();
				context.moveTo(markX, this.startY);
				context.lineTo(markX, this.startY + 10);
				context.stroke();
			}
		}
	}
}
