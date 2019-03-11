
// ====================
// LIGHTSABERS POWERUPS
// ====================

// Create a LightsaberShots and Lightsabers
//
// Lightsabers appears randomly when the ball hits a brick. 
// When Lightsabers appears he falls down with a velocity and if
// they hit the paddle, the paddle will get power-up og LightsaberShots.
//
// The LightsaberShots can break bricks down with their lightsabers 


var g_numberOfLightsabers = 0;  //how many ligthsaber powerups are in the game
var g_lightsabersAmo = [];
var g_lightsabersOn = false;  //whether lightsaber is activates on the paddle

// When the lightsaber powerup is activated they are shot at the bricks. 
// Here we check whether the saber shot has hit a brick
function LightsaberShots(x, y) {
    this.x = x;
    this.y = y;
    this.radius = brickWidth;
    this.yVel = 4;
    this.lightsaberHitsBrick = false;

    this.update = function (du) {
        this.y -= this.yVel;

        // Remember my previous position
        var prevX = this.x;
        var prevY = this.y;
    
        // Compute my provisional new position (barring collisions)
        var nextX = prevX + this.yVel * du;
        var nextY = prevY + this.yVel * du;

        if (g_wall.collidesWithTopOrBottom(prevX, prevY, nextX, nextY, this.radius))
        {  
            //it is a hit
            this.lightsaberHitsBrick = true;

        } else {
            //it is a miss
            this.lightsaberHitsBrick = false;
        }
    }

    //loading the light saber image
    this.draw = function (ctx) {
        if (typeof image === "undefined") {
            var image = loadedImages.lightsaberShots;
        }
        //if it has not hit the brick keep drawing the image
        if (this.lightsaberHitsBrick === false) {
            ctx.drawImage(image, 
                          this.x, 
                          this.y);
        //disappear
        } else {
            this.y = -100;
        }
    }
}
//the light saber power up falling from the brick
function Lightsaber(x, y) {
    this.x = x;
    this.y = y;
    this.radius = brickWidth;
    this.yVel = 2;
    this.lightsaberHitsPaddle = false;

    this.update = function (du) {
        // Falls down
        this.y += this.yVel;

        // Remember my previous position
        var prevX = this.x;
        var prevY = this.y;
    
        // Compute my provisional new position (barring collisions)
        var nextX = prevX + this.yVel * du;
        var nextY = prevY + this.yVel * du;

        //check for the collision with the paddle
        if (g_paddle.collidesWith(prevX, prevY, nextX, nextY, this.radius))
        {   
            this.lightsaberHitsPaddle = true;
        } else {
            this.lightsaberHitsPaddle = false;
        }
    }

    this.draw = function (ctx) {
        //make sure the image is loaded
        if (typeof image === "undefined") {
            var image = loadedImages.lightsabers;
        }
        //if it has not hit the paddle keep drawing it
        if (this.lightsaberHitsPaddle === false) {
            ctx.drawImage(image, 
                          this.x + brickWidth/2, 
                          this.y);
        //it has been caught by the paddle
        } else {
            g_lightsabersOn = true;
            g_numberOfLightsabers = 10;
        }
    }

}