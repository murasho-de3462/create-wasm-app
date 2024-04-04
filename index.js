//import * as wasm from "hello-wasm-pack";

//wasm.greet();

'use strict'

//配列を描画
function draw(ctx, canvas_w, canvas_h, data){
	let img = new ImageData(new Uint8ClampedArray(data), canvas_w, canvas_h);
	ctx.putImageData(img, 0, 0);
}

const X_MIN = -1.5;
const X_MAX = 0.5;
const Y_MIN = -1.0;
const Y_MAX = 1.0;
const MAX_ITER = 64;

//実行の主要部分
console.log("Start load wasm");
const mandelbrot=import('../pkg').catch(console.error);

//wasm読み込みが非同期であるためPromiseで読み込み完了を待つ
Promise.all([mandelbrot]).then(async function([
	{generate_mandlebrot_set, draw_mandlebrot_set}
]){
	console.log("finished load wasm");
	const renderBtn=document.getElementById('render');
	renderBtn.addEventListener('click',()=>{
		draw_mandlebrot_set();
		let wasmResult = null;
		{
			const CANVAS_ID = "canvbas_hybrid";
			let canvas = document.getElementById(CANVAS_ID);
			let context = canvas.getContext("2d");
			const canvasWidth=canvas.width;
			const canvasHeight=canvas.height;

			const generateStartTime=Date.now();
			wasmResult=generate_mandlebrot_set(canvasWidth,canvasHeight,
				X_MIN,X_MAX,Y_MIN,Y_MAX,MAX_ITER);
			const generateEndTime=Date.now();
			const drawStartTime=Date.now();
			draw(context, canvasWidth,canvasHeight,wasmResult);
			const drawEndTime=Date.now();
			const elapsed=generateEndTime-generateStartTime;
			console.log('\tgenerate:wasm\tgenerate_elapsed:${elapsed}[ms]');
			console.log('\tdraw:js\tdraw_elapsed:${drawEndTime-drawStartTime}[ms]');
		}
	})
})

