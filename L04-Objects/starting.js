// Some animation widgets, squeezed together in one source file for simplicity of reading
// (Starting code for lecture)

// In general, a widget is an object with certain methods.
// This list of methods functions like an interface in Java,
// but of course JavaScript doesn't enforce it statically.
//
// REQUIRED METHODS:
// getElement(): return a DOM node standing for this object.
// reset(): begin the animation again from the start.
// tick(): advance the animation to the next step.
// isDone(): query whether this part of the animation is done (returns Boolean).


// Animation of monospaced text, rotating through a sequence of sprites.
// The argument is an array of arrays of lines of text (strings).
// The coding style here isn't advisable for JavaScript, and we'll come up with something better!
function AsciiAnimation(sprites) {
    // Let's create an object in roughly the way we're used to from Java.
    var that = {
        // Main container element for the animation
        span: document.createElement('span'),

        // Preformatted text block for the animation
        pre: document.createElement('pre'),

        // Current position in animation
        animationFrame: 0,

        // Install the sprite from the current animation frame.
        useSprite: function() {
            var that = this;
            this.pre.innerHTML = "";
            sprites[this.animationFrame].each(function(line) { that.pre.innerHTML += line + "\n"; });
        },

        // Set up the field values.
        initialize: function() {
            this.span.style.display = "inline-block";
            // This part is important to let us treat an animation as a single "word"
            // for purposes of horizontal layout on the page.
            this.span.appendChild(this.pre);
            this.useSprite();
        },

        getElement: function() {
            return this.span;
        },

        reset: function() {
            this.animationFrame = 0;
            this.useSprite();
        },

        tick: function() {
            this.animationFrame += 1;
            if (this.animationFrame < sprites.length) {
                this.useSprite();
            }
        },

        isDone: function() {
            return this.animationFrame >= sprites.length;
        }
    };

    that.initialize();

    return that;
}


//// Some example animations

// ASCII stick man
function Stickman() {
    return AsciiAnimation([
        [" o ",
         "-|-",
         "/ \\"],
        ["o  ",
         "|- ",
         "|\\ "],
        [" o ",
         "-|-",
         "/ \\"],
        ["  o",
         " -|",
         " /|"]
    ]);
}

// The support files look in this variable to see which widget to animate and how quickly.
var current = {period: 300, widget: Stickman()};
