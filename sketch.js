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

let day_angle = 90;
let delta_day = 0.5;
let night_alpha = 0;

let img;

function preload() {
  img = loadImage('pp_logo.png');
}

function setup() {
    createCanvas(w, h);
    angleMode(DEGREES);

    let offset_scale = 0.05;
    let y = 100;
    let width = 20;
    let min_y = 150;

    for (let i = 0; i < 4; i++) {
        let x = cx + w * offset_scale;
        
        beers[i] = new Beer(x, max([y, min_y]), width);
        y += 100;
        offset_scale = -1 * (offset_scale + 0.01);
        width += 10;
    }
}


function draw() {
    clear();
    background(100, 100, 250);

    noStroke();
    if (day_angle >= 0 & day_angle < 90) {
        night_alpha = map(day_angle, 0, 90, 75, 200);
    } else if (day_angle >= 90 & day_angle < 180) {
        night_alpha = map(day_angle, 90, 180, 200, 75);
    } else if (day_angle >= 180 & day_angle < 270) {
        night_alpha = map(day_angle, 180, 279, 75, 0);
    } else if (day_angle >= 270 & day_angle < 360) {
        night_alpha = map(day_angle, 270, 360, 0, 75);
    }

    fill(50, 50, 50, night_alpha);
    rect(0, 0, w, h);

    // Sun
    push();
    translate(cx, cy + 30)
    rotate(day_angle);
    
    day_angle += delta_day;
    if (day_angle >= 360) {
        day_angle -= 360
    }

    fill(245, 250, 5);
    noStroke();
    ellipse(cx, -10, 200, 200);

    // Moon
    rotate(180);
    fill(230, 230, 230)
    ellipse(cx, -10, 200, 200);
    pop();

    // Horizon
    noStroke();
    fill(100, 200, 100);
    rect(0, cy, w, cy);
    
    // Table legs
    fill(125, 80, 5);
    stroke(100, 80, 5);
    strokeWeight(2);
    rect(cx + w / 5 - 21, h - 50, 20, 50);
    rect(cx - w / 5, h - 50, 20, 50);

    // Table top
    fill(125, 80, 5);
    trapezoid(w / 2, h * 0.9, w / 2, w / 5, h * 0.65);
    
    for (let beer of beers) {
        beer.draw();
    }

    // Grill
    fill(0);
    noStroke();
    arc(600, 400, 150, 150, 0, 180);
    
    push();
    fill(200, 200, 200);
    translate(560, 460);
    rotate(20);
    rect(0, 0, 10, 100, 10);
    pop();

    push();
    fill(200, 200, 200);
    translate(635, 460);
    rotate(-20);
    rect(0, 0, 10, 100, 10);
    pop();

    // Smoke
    for (let x = w - 80; x <= w - 10; x += 20) {
        strokeWeight(0.75);
        stroke(70, 60);
        noFill();
        
        beginShape();
        vertex(x, h - 95);
        let start = h - 95
        let len = 50 * random(0.9, 1.0);
        let end = start - len;
        for (let y = start; y >= end; y -= 10) {
            let noiseScale = map(noise(x * random(), y), 0, 3, 0, 15);
            curveVertex(x + noiseScale, y);
        }

        vertex(x, end);
        endShape();
    }

    // PP Steak
    push();
    rotate(-5);
    tint(255, 175);
    image(img, 5, 10, 100, 150, 30);
    pop();
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
        this.delta_fill = this.drink_rate;

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

        this.percent_fill += this.delta_fill * random(0, 1.5);
        if (this.percent_fill <= 0) {
            this.delta_fill = this.refill_rate;
            [this.r, this.g, this.b] = rand_color();
            this.visible = random() <= 0.9;
        } else if (this.percent_fill >= 0.95) {
            this.delta_fill = this.drink_rate;
        }
    }
}
