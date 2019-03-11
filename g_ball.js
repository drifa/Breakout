// ==========
// BALL STUFF
// ==========

// BALL STUFF

var g_ball = {
    cx: 50,
    cy: 200,
    radius: 30,

    xVel: 5,
    yVel: 4
};

var g_lightsabers = [];
var g_darthMauls = [];

g_ball.update = function (du) {
    // Remember my previous position
    var prevX = this.cx;
    var prevY = this.cy;
    
    // Compute my provisional new position (barring collisions)
    var nextX = prevX + this.xVel * du;
    var nextY = prevY + this.yVel * du;

    let randomNum = Math.floor(Math.random() * 3);

    // Bounce off the paddles
    if (g_paddle.collidesWith(prevX, prevY, nextX, nextY, this.radius))
    {   
        this.yVel *= -1;
    }

    // Bounce off left and right edges  by more than some 
    // aribitrary `margin`
    var margin = this.radius - 10;
    if (nextX <  -(margin - 10) ||                      // left edge
        nextX > g_canvas.width - margin)        // right edge
    {      
        this.xVel *= -1;
    }
    
    // Bounce off top edges
    if (nextY < 0)                              // top edge
    {                            
        this.yVel *= -1;
    }

    // Reset if we fall off at the bottom
    if (nextY > g_canvas.height)                // bottom edge
    {
        g_gameOver = true;
    }

    // Bounce off top and bottom of the bricks
    if (g_wall.collidesWithTopOrBottom(prevX, prevY, nextX, nextY, this.radius)) 
    {
        this.yVel *= -1;
        // let the lightsabers appear randomly when ball hits the brick
        if (randomNum == 1) {
            g_lightsabers.push(new Lightsaber(nextX, nextY));
        }

        // let the darthMauls appear randomly when ball hits the brick
        if (randomNum == 2) {
            g_darthMauls.push(new DarthMaul(nextX, nextY));
        }

    }

    // Bounce off left and right side of the bricks
    if (g_wall.collidesWithLeftOrRight(prevX, prevY, nextX, nextY, this.radius)) 
    {
        this.xVel *= -1
    }

    // *Actually* update my position 
    // ...using whatever velocity I've ended up with
    //
    this.cx += this.xVel * du;
    this.cy += this.yVel * du;
};

g_ball.reset = function () {
    this.cx = 400;
    this.cy = 200;
    this.xVel = -5;
    this.yVel = 4;
};

g_ball.render = function (ctx) {
    // draw stormtrooperBall
    ctx.drawImage(loadedImages.ball, this.cx, this.cy, this.radius, this.radius);
};