// =====
// UTILS
// =====

// With information about two lines we want to check if they cross each other.
// To check if the two lines cross each other we use two point on each line 
function intersectBetween2Lines(line1p1_X, line1p1_Y, line1p2_X, line1p2_Y, 
    line2p1_X, line2p1_Y, line2p2_X, line2p2_Y) {
    var det, gamma, lambda;
    det = (line1p2_X - line1p1_X) * (line2p2_Y - line2p1_Y) - 
          (line2p2_X - line2p1_X) * (line1p2_Y - line1p1_Y);
    if (det === 0) {
        return false;
    } else {
        lambda = ((line2p2_Y - line2p1_Y) * (line2p2_X - line1p1_X) + 
                  (line2p1_X - line2p2_X) * (line2p2_Y - line1p1_Y)) / det;
        gamma = ((line1p1_Y - line1p2_Y) * (line2p2_X - line1p1_X) +
                 (line1p2_X - line1p1_X) * (line2p2_Y - line1p1_Y)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)
    }
}

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function fillCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function fillBox(ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
}

// Extend the Image prototype (aka augment the "class") 
// with my asyncLoad wrapper. 
//
// I prefer this approach to setting onload/onerror/src directly.
//
Image.prototype.asyncLoad = function(src, asyncCallback) {
    
    // Must assign the callback handlers before setting `this.src`,
    // for safety (and caching-tolerance).
    //
    // Uses the same handler for success *and* failure,
    // because they share a lot of the same logic.
    //
    // NB: The failure case can be identified by the "degenerate" nature
    // of the resulting "loaded" image e.g. test for this.width === 0
    //
    this.onload = asyncCallback;
    this.onerror = asyncCallback;
    
    // NB: The load operation can be triggered from any point 
    // after setting `this.src`.
    //
    // It *may* happen immediately (on some browsers) if the image is already
    // in-cache, but will most likely happen some time later when the load has
    // occurred and the resulting event is processesd in the queue.
    
    console.log("requesting image src of ", src);
    this.src = src;
};


// imagePreload
//
// Horrible stuff to deal with the asynchronous nature of image-loading 
// in the browser...
//
// It requires setting-up a bunch of handler callbacks and then waiting for them
// *all* to be exectued before finally triggering our own `completionCallback`.
//
// Makes use of "closures" to handle the necessary state-tracking between the
// intermediate callback handlers without resorting to global variables.
//
// IN  : `requiredImages` - an object of <name:uri> pairs for each image
// OUT : `loadedImages` - object to which our <name:Image> pairs will be added
// IN  : `completionCallback` - will be executed when everything is done
//
function imagesPreload(requiredImages,
                       loadedImages,
                       completionCallback) {

    var numImagesRequired,
        numImagesHandled = 0,
        currentName,
        currentImage,
        preloadHandler;

    // Count our `requiredImages` by using `Object.keys` to get all 
    // "*OWN* enumerable properties" i.e. doesn't traverse the prototype chain
    numImagesRequired = Object.keys(requiredImages).length;

    // A handler which will be called when our required images are finally
    // loaded (or when the fail to load).
    //
    // At the time of the call, `this` will point to an Image object, 
    // whose `name` property will have been set appropriately.
    //
    preloadHandler = function () {

        console.log("preloadHandler called with this=", this);
        loadedImages[this.name] = this;

        if (0 === this.width) {
            console.log("loading failed for", this.name);
        }

        // Allow this handler closure to eventually be GC'd (!)
        this.onload = null;
        this.onerror = null;

        numImagesHandled += 1;

        if (numImagesHandled === numImagesRequired) {
            console.log("all preload images handled");
            console.log("loadedImages=", loadedImages);
            console.log("");
            console.log("performing completion callback");

            completionCallback();

            console.log("completion callback done");
            console.log("");
        }
    };

    // The "for..in" construct "iterates over the enumerable properties 
    // of an object, in arbitrary order." 
    // -- unlike `Object.keys`, it traverses the prototype chain
    //
    for (currentName in requiredImages) {

        // Skip inherited properties from the prototype chain,
        // just to be safe, although there shouldn't be any...
        
        // I prefer this approach, but JSLint doesn't like "continue" :-(
        //if (!requiredImages.hasOwnProperty(currentName)) { continue; }
        
        if (requiredImages.hasOwnProperty(currentName)) {
            
            console.log("preloading image", currentName);
            currentImage = new Image();
            currentImage.name = currentName;

            currentImage.asyncLoad(requiredImages[currentName], preloadHandler);
        }
    }
}