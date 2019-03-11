
// =====================
// DARTHMAUL THE BAD GUY
// =====================

// Create an object called DarthMaul
//
// DarthMaul appears randomly when the ball hits a brick. 
// When DarthMaul appears he falls down with a velocity and if
// he hits the paddle, the paddle will get smaller. 

function DarthMaul(x, y) {
    this.x = x;
    this.y = y;
    this.radius = brickWidth;
    this.yVel = 2;
    // In the beginning darthMaul has not hit the paddel yet
    this.darthMaulHitsPaddle = false;

    this.update = function (du) {
        // Falls down
        this.y += this.yVel;

        // Remember my previous position
        var prevX = this.x;
        var prevY = this.y;
    
        // Compute my provisional new position (barring collisions)
        var nextX = prevX + this.yVel * du;
        var nextY = prevY + this.yVel * du;

        // When darthMaul hits the paddle
        if (g_paddle.collidesWith(prevX, prevY, nextX, nextY, this.radius))
        {   
            this.darthMaulHitsPaddle = true;
            // I know this is a bit hacky, but it works. 
            // the paddle gets smaller
            g_paddle.halfWidth -= 0.2;
        } else {
            this.darthMaulHitsPaddle = false;
        }
    }

    this.draw = function (ctx) {
        // get the image from loadedImages
        if (typeof image === "undefined") {
            var image = loadedImages.darthMaul;
        }

        // Draw the image only if darthMaul has not hit the paddle yet
        if (this.darthMaulHitsPaddle === false) {
            ctx.drawImage(image, 
                          this.x + brickWidth/2, 
                          this.y);
        }
    }

}