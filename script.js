import { Simulare } from './simulare.js';

// export const btnsScenarii = document.querySelector('.btns-scenarii');
const btnContinue = document.getElementById('continue');
const startBtn = document.querySelector('.start');
export const btnScenariu1 = document.getElementById('scenariu1');
export const btnScenariu2 = document.getElementById('scenariu2');

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const simulare = new Simulare(canvas.width, canvas.height);

window.addEventListener('load', () => {
	simulare.background.draw(ctx);
	simulare.initialDisplay(ctx);
	startBtn.style.display = 'block';
});

startBtn.addEventListener('click', function () {
	simulare.animate(ctx);
	startBtn.style.display = 'none';
	btnContinue.style.display = 'block';
});
btnContinue.addEventListener('click', function () {
	if (simulare.continue) {
		simulare.continue = false;
	} else simulare.continue = true;
});

btnScenariu1.addEventListener('click', function () {
	btnScenariu1.classList.remove('btn-scenariu-selected');
	btnScenariu2.classList.remove('btn-scenariu-selected');
	btnScenariu1.classList.add('btn-scenariu-selected');

	if (simulare.continue) {
		simulare.scenariu1Time = true;
		simulare.scenariu1(ctx);
	}
});
btnScenariu2.addEventListener('click', function () {
	btnScenariu1.classList.remove('btn-scenariu-selected');
	btnScenariu2.classList.remove('btn-scenariu-selected');
	btnScenariu2.classList.add('btn-scenariu-selected');

	if (simulare.scenariu2Time && simulare.continue && simulare.attackOverS1) {
		simulare.scenariu2(ctx);
	}
});
