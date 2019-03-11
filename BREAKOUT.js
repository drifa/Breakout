// "Crappy PONG" -- step by step
//
// Step 13: Simplify
/*

Supporting timer-events (via setInterval) *and* frame-events (via requestAnimationFrame)
adds significant complexity to the the code.

I can simplify things a little by focusing on the latter case only (which is the
superior mechanism of the two), so let's try doing that...

The "MAINLOOP" code, inside g_main, is much simplified as a result.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

/*
0        1         2         3         4         5         6         7         8         9
123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var requiredImages = {
    brick: 'images/brick.png',
    blackBrick: 'images/blackBrick.png',
    fireBrick: 'images/fireBrick.png',
    paddle: 'images/paddle.png',
    background: 'images/deathStar.png',
    ball: 'images/ball.png',
    lightsabers: 'images/sabers.png',
    lightsaberShots: 'images/lightsaber.png',
    darthMaul: 'images/darthMaul.png'
};

var loadedImages = [];

// ============
// PADDLE STUFF
// ============

// PADDLE

var KEY_A = 'A'.charCodeAt(0);
var KEY_D = 'D'.charCodeAt(0);
var KEY_G = 'G'.charCodeAt(0);
var KEY_SPACE = 32;

var g_paddle = new Paddle({
    cx : g_canvas.width/2,
    cy : g_canvas.height-20,
    
    GO_LEFT   : KEY_A,
    GO_RIGHT : KEY_D
});

// =========
// GAME OVER
// =========

var g_gameOver = false;
var g_WINNER = false;

// When the ball falls of the bottom of the g_canvas, it's game over
function gameOver(ctx) {
    // Clear the game
    clearCanvas(g_ctx);
    g_ctx.font = '50px Courier';
    g_ctx.fillStyle = 'yellow';

    // draw the background for the game over canvas
    g_ctx.drawImage(loadedImages.background,0,0, g_canvas.width, g_canvas.height);

    // style and write the gameOver-text
    g_ctx.textAlign = "center";
    if(g_gameOver) {
        g_ctx.fillText('Game over', g_ctx.canvas.width/2, g_ctx.canvas.height/2);
    } else {
        g_ctx.fillText("WINNER!", g_ctx.canvas.width/2, g_ctx.canvas.height/2);
    }
    g_ctx.font = '15px Courier';
    g_ctx.fillText("If you wan't to start a NEW GAME press G", g_ctx.canvas.width/2, g_ctx.canvas.height/2+50);

    // reset everything if press KEY_G and start a new game
    if(g_keys[KEY_G]) {
        // no longer gameOver/winner
        g_gameOver = false;
        g_WINNER = false;

        // reset all the essentials
        g_ball.reset();
        createWall();
        g_paddle.reset();

        // reset all the extras
        g_numberOfLightsabers = 0;
        g_lightsabersAmo = [];
        g_lightsabersOn = false;
    }
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}

// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    // loop through the extras arrays and update them
    for (let i = 0; i < g_lightsabers.length; i++) {
        g_lightsabers[i].update(du);
    }

    for (let i = 0; i < g_darthMauls.length; i++) {
        g_darthMauls[i].update(du);
    }

    for (let i = 0; i < g_lightsabersAmo.length; i++) {
        g_lightsabersAmo[i].update(du);
    }

    g_ball.update(du);
    
    g_paddle.update(du);
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
    
    // Check if there is gameOver/winner, if so the gameOver/winner canvas must appear
    if (g_gameOver || g_WINNER) {
        gameOver(ctx);
    } else {
        g_ctx.drawImage(loadedImages.background,0,0, g_canvas.width, g_canvas.height);
        
        g_wall.render(ctx);
        
        g_paddle.render(ctx);

        // loop through the extras arrays and render them
        for (let i = 0; i < g_lightsabers.length; i++) {
            g_lightsabers[i].draw(ctx);
        }

        for (let i = 0; i < g_darthMauls.length; i++) {
            g_darthMauls[i].draw(ctx);
        }

        for (let i = 0; i < g_lightsabersAmo.length; i++) {
            g_lightsabersAmo[i].draw(ctx);
        }

        g_ball.render(ctx);
    }
}

// Kick it off
imagesPreload(requiredImages, loadedImages, () => { g_main.init(); });