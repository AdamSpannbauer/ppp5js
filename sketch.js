let w = 640;
let h = 480;
let cx = w / 2;
let cy = h / 2

let percent_fill = 0.95;
let delta_fill = -0.005;

let offset = 0;
let beers = [];
let beer_colors = [[40, 25, 15], 
 				   [60, 40, 10], 
 				   [70, 10, 15],
				   [20, 10, 10],
				   [235, 215, 10]];


function setup() {
	createCanvas(w, h);

	let offset_scale = 0.05;
	let y = 100;
	let width = 20;
	let min_y = 150;

	for (i = 0; i < 4; i++) {
		let x = cx + w * offset_scale;
		
		beers[i] = new Beer(x, max([y, min_y]), width);
		y += 100;
		offset_scale = -1 * (offset_scale + 0.01);
		width += 10;
	}
}


function draw() {
	clear();
	background(100);
	
	// Table legs
	fill(125, 80, 5);
	stroke(100, 80, 5);
	strokeWeight(2);
	rect(cx + w / 5 - 21, h - 50, 20, 50);
	rect(cx - w / 5, h - 50, 20, 50);

	// Table top
	fill(125, 80, 5);
	trapezoid(w / 2, h * 0.9, w / 2, w / 5, h * 0.65);
	
	for (var beer of beers) {
		beer.draw();
	}
}


function trapezoid(x, y, bottom_width, top_width, height) {
	x1 = x - bottom_width / 2;
	x2 = x + bottom_width / 2;
	x3 = x + top_width / 2;
	x4 = x - top_width / 2;
	
	y1 = y2 = y;
	y3 = y4 = y - height;

	quad(x1, y1, x2, y2, x3, y3, x4, y4);
}


function rand_color() {
	return beer_colors[Math.floor(Math.random() * beer_colors.length)];
}


class Beer {
	constructor(x, y, bottom_width) {
		this.x = x;
		this.y = y;

		this.bottom_width = bottom_width;
		this.top_width = bottom_width * 1.5;
		this.height = bottom_width * 2.14;

		this.percent_fill = 0.95;
		this.drink_rate = -0.005;
		this.refill_rate = 0.05;
		this.delta_fill = -0.005;

		[this.r, this.g, this.b] = rand_color();

		this.visible = true;
	}

	draw() {
		this.percent_fill = min([0.95, this.percent_fill]);
		this.percent_fill = max([0.00, this.percent_fill]);

		if (this.visible) {
			let fill_top_width = map(this.percent_fill, 0, 1, this.bottom_width, this.top_width);
			let fill_height = this.height * this.percent_fill;

			let foam_y = this.y - fill_height;
			let foam_top_width = map(this.percent_fill + 0.1 * this.percent_fill, 0, 1, this.bottom_width, this.top_width);
			let foam_bottom_width = fill_top_width;
			let foam_height = this.height * 0.1 * this.percent_fill;

			push();
			noStroke();
			fill(250);
			trapezoid(this.x, foam_y, foam_bottom_width, foam_top_width, foam_height);
			pop();

			push();
			noStroke();
			fill(this.r, this.g, this.b);
			trapezoid(this.x, this.y, this.bottom_width, fill_top_width, fill_height);
			pop();

			push();
			strokeWeight(2);
			stroke(210, 250, 230, 70);
			fill(210, 250, 230, 2);
			trapezoid(this.x, this.y, this.bottom_width, this.top_width, this.height);
			pop();
		}

		this.percent_fill += this.delta_fill;
		if (this.percent_fill <= 0) {
			this.delta_fill = this.refill_rate;
			[this.r, this.g, this.b] = rand_color();
			this.visible = random() <= 0.9;
		} else if (this.percent_fill >= 0.95) {
			this.delta_fill = this.drink_rate;
		}
	}
}
