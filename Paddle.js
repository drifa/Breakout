// A generic constructor which accepts an arbitrary descriptor object
function Paddle(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// Add these properties to the prototype, where they will server as
// shared defaults, in the absence of an instance-specific overrides.

Paddle.prototype.halfWidth = 70;
Paddle.prototype.halfHeight = 10;

Paddle.prototype.update = function (du) {
    if (g_keys[this.GO_LEFT]) {
        this.cx -= 5 * du;
    } else if (g_keys[this.GO_RIGHT]) {
        this.cx += 5 * du;
    }
};

// reset position of the paddle
Paddle.prototype.reset = function () {
    this.cx = g_canvas.width/2;
    this.cy = g_canvas.height-20;
};

Paddle.prototype.render = function (ctx) {
    // (cx, cy) is the centre; must offset it for drawing
    ctx.drawImage(loadedImages.paddle, 
                  this.cx - this.halfWidth,
                  this.cy - this.halfHeight,
                  this.halfWidth * 2,
                  this.halfHeight * 2);
};

Paddle.prototype.collidesWith = function (prevX, prevY, nextX, nextY, r) {
    // create the line/object paddle which has 
    // 2 points (p1_X, p1_y) and (p2_X, p1_Y)
    let paddle = {
        p1_X: this.cx - this.halfWidth,
        p1_Y: this.cy + this.halfHeight,
        p2_X: this.cx + this.halfWidth,
        p2_Y: this.cy + this.halfHeight
    }

    // Check if paddle intersects with the ball line with 
    // 2 points (prevX, prevY) and (nextX, nextY)
    let des = intersectBetween2Lines(prevX - r, prevY - r, nextX + r, nextY + r, 
                                     paddle.p1_X, paddle.p1_Y, paddle.p2_X, paddle.p2_Y);
    
    // If the paddle intersects with the ball line
    // it's a hit or else it's a miss
    if (des === true) {
        // it's a hit!
        return true;
    } else {
        // It's a miss
        return false;
    }
};