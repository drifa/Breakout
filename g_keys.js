// =================
// KEYBOARD HANDLING
// =================

var g_keys = [];

function handleKeydown(evt) {
    g_keys[evt.keyCode] = true;

    // on press down the lightsaberShots appears if the paddle
    // caught a lightsaber 
    if (g_lightsabersOn === true) {
        // the player gets only g_numberOfLightsabers amount of shots
        if (g_keys[KEY_SPACE] && g_numberOfLightsabers > 0) {
            g_lightsabersAmo.push(new LightsaberShots(g_paddle.cx, g_paddle.cy));
            g_numberOfLightsabers -= 1;
        }
    }
}

function handleKeyup(evt) {
    g_keys[evt.keyCode] = false;
}

// Inspects, and then clears, a key's state
//
// This allows a keypress to be "one-shot" e.g. for toggles
// ..until the auto-repeat kicks in, that is.
//
function eatKey(keyCode) {
    var isDown = g_keys[keyCode];
    g_keys[keyCode] = false;
    return isDown;
}

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);