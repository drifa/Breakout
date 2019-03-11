
// ===================
// THE WALL OF BRICKS
// ===================

// Create a wall with bricks
//
// The bricks be broken if the ball hits them. 
// They have different kinds of levels, and when there are no levels
// left the brick disappears. Also when the ball hhits the bricks
// sometimes there appears power-ups and bad guys.
// When hitting the last brick the player has won the game.

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

var g_wall = [];                // The wall is a array of bricks, starting empty
var wallColumns = 8;            // g_wall has 8 columns
var wallRows = 6;               // g_wall has 6 rows

var wallHeight = g_canvas.height/3;

var brickWidth = g_canvas.width / wallColumns;
var brickHeight = wallHeight / wallRows;

// Create an object, Brick, which later is 
// pushed in the g_wall array
function Brick(x, y, width, height, level) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // different kinds of levels for each brick
    this.level = level;
    // 
    this.isCollidingWith = 0;

    // When the ball hits the bricks the levels go lower
    // and when the level < 0 the brick is destroyed
    this.isDestroyed = function () {
        return this.level < 0;
    };


    this.draw = function (ctx) {
        // get the imagees for the bricks from loadedImages
        if (typeof bricksImages === "undefined") {
            var bricksImages = [
                // level 0
                loadedImages.brick, 
                // level 1
                loadedImages.blackBrick, 
                // level 2
                loadedImages.fireBrick
            ];
        }

        // each brick has a border
        const border = 1;
        // draw different kinds of bricks with 
        // different kinds of levels
        if (this.isDestroyed() === false) {
            ctx.drawImage(bricksImages[this.level], 
                        this.x + border, 
                        this.y + border, 
                        this.width - 2*border, 
                        this.height - 2*border);
        }
    };
};

function createWall() {
    g_wall = [];
    // loop through g_wall and create a brick
    for (var i=0; i<wallRows; i++) {
        const y = i * brickHeight;
    
        var row = [];
        for (var j=0; j<wallColumns; j++) {
            const x = j * brickWidth;
            // bricks with random kinds of levels 
            var level = Math.floor(Math.random() * 3);
            row.push(new Brick(x, y, brickWidth, brickHeight, level));
        }
    
        g_wall.push(row);
    }    

    g_wall.render = function (ctx) {
        // loop through g_wall and draw every brick
        // and if the ball collides with a brick, it disappears
        for (var i=0; i<wallRows; i++) {
            for (var j=0; j<wallColumns; j++) {
                if (g_wall[i][j].isCollidingWith > 0) {
                    g_wall[i][j].isCollidingWith -= 1;
                    fillBox(ctx, g_wall[i][j].x, g_wall[i][j].y, brickWidth, brickHeight, 'yellow');
                } else {
                    g_wall[i][j].draw(g_ctx);
                }
            }
        }
    };

    g_wall.collidesWithTopOrBottom = function (prevX, prevY, nextX, nextY, r) {
        // loop through g_wall to chechk for any collisions
        for (var i=0; i<wallRows; i++) {
            for (var j=0; j<wallColumns; j++) {

                let intersectBrickBottom = intersectBetween2Lines(prevX, prevY, nextX, nextY, 
                                                                g_wall[i][j].x, 
                                                                g_wall[i][j].y + brickHeight, 
                                                                g_wall[i][j].x + brickWidth, 
                                                                g_wall[i][j].y + brickHeight);
                let intersectBrickTop = intersectBetween2Lines(prevX, prevY, nextX, nextY, 
                                                            g_wall[i][j].x, 
                                                            g_wall[i][j].y, 
                                                            g_wall[i][j].x + brickWidth, 
                                                            g_wall[i][j].y);
                // If the brick is already destroyed, continue
                if (g_wall[i][j].isDestroyed()) {
                    continue;
                }
                // Check if the ball intersects with a brick on the top or the bottom
                // of the brick
                // if so go down by one level
                if (intersectBrickBottom || intersectBrickTop ) {
                    g_wall[i][j].level -= 1;
                    g_wall[i][j].isCollidingWith = 5;
                    return true;
                }
            }
        }
        return false;
    }

    g_wall.collidesWithLeftOrRight = function (prevX, prevY, nextX, nextY, r) {
        // loop through g_wall to chechk for any collisions
        for (var i=0; i<wallRows; i++) {
            for (var j=0; j<wallColumns; j++) {
                let intersectBrickLeft = intersectBetween2Lines(prevX, prevY, nextX, nextY, 
                                                                g_wall[i][j].x, 
                                                                g_wall[i][j].y, 
                                                                g_wall[i][j].x, 
                                                                g_wall[i][j].y + brickHeight);
                let intersectBrickRight = intersectBetween2Lines(prevX, prevY, nextX, nextY, 
                                                                g_wall[i][j].x + brickWidth, 
                                                                g_wall[i][j].y, 
                                                                g_wall[i][j].x + brickWidth, 
                                                                g_wall[i][j].y + brickHeight);
                // If the brick is already destroyed, continue
                if (g_wall[i][j].isDestroyed()) {
                    continue;
                }
                // Check if the ball intersects with a brick on the left or the right side
                // of the brick
                // if so go down by one level
                if (intersectBrickLeft || intersectBrickRight) {
                    g_wall[i][j].level -= 1;
                    g_wall[i][j].isCollidingWith = 5;
                    return true;
                }
            }
        }
        return false;
    }
}