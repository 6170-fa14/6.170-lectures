// Some animation widgets, squeezed together in one source file for simplicity of reading
// (This file differs from the final one in omitting the "pause" feature.)

// In general, a widget is an object with certain methods.
// This list of methods functions like an interface in Java,
// but of course JavaScript doesn't enforce it statically.
//
// REQUIRED METHODS:
// getElement(): return a DOM node standing for this object.
// reset(): begin the animation again from the start.
// tick(): advance the animation to the next step.
// isDone(): query whether this part of the animation is done (returns Boolean).


// Behold: the prototypical widget!
// Every widget "inherits from" this one, via its prototype chain.
var Widget = {
    reset: function() { },
    tick: function() { },
    isDone: function() { return true; }
};
// We use safe defaults for everything having to do with state change over time.
// Only getElement() needs to be overridden, for the simple case of a static widget.

// Animation of monospaced text, rotating through a sequence of sprites.
// The argument is an array of arrays of lines of text (strings).
function AsciiAnimation(sprites) {
    var that = Object.create(Widget);

    var span = document.createElement('span');
    span.style.display = "inline-block";
    // This part is important to let us treat an animation as a single "word"
    // for purposes of horizontal layout on the page.
    var pre = document.createElement('pre');
    // <pre> is for preformatted, monospaced text.
    span.appendChild(pre);

    var animationFrame = 0;

    var useSprite = function() {
        pre.innerHTML = "";
        sprites[animationFrame].each(function(line) { pre.innerHTML += line + "\n"; });
    };

    useSprite();

    that.getElement = function() {
        return span;
    };

    that.reset = function() {
        animationFrame = 0;
        useSprite();
    };

    that.tick = function() {
        animationFrame += 1;
        if (animationFrame < sprites.length) {
            useSprite();
        }
    };

    that.isDone = function() {
        return animationFrame >= sprites.length;
    };

    return that;
}

// Modify an animation to play over and over again.
Widget.RepeatIndefinitely = function() {
    var parent = this;
    var that = Object.create(this);

    that.isDone = function() {
        if (parent.isDone()) {
            parent.reset();
        }

        return false;
    };

    return that;
}

// Modify an animation to repeat a given number of times.
Widget.Repeat = function(times) {
    var parent = this;
    var that = Object.create(this);

    that.isDone = function() {
        if (times <= 0) {
            return true;
        }

        if (parent.isDone()) {
            times -= 1;
            parent.reset();
        }

        return false;
    };

    return that;
}

// Lay out a widget array horizontally, with all the widgets animating simultaneously.
function Horizontal(widgets) {
    var span = document.createElement("span");
    widgets.each(function(widget) { span.appendChild(widget.getElement()); });

    var that = Object.create(Widget);

    that.getElement = function() {
        return span;
    };

    that.reset = function() {
        widgets.each(function(widget) { widget.reset(); });
    };

    that.tick = function() {
        widgets.each(function(widget) { widget.tick(); });
    };

    that.isDone = function() {
        return widgets.reduce(function(widget, b) { return widget.isDone() && b; }, true);
        // Done iff all constituents are done
    };

    return that;
}

// Plays an array of widgets in sequence, starting each after the prior one finishes.
function Sequence(widgets) {
    var span = document.createElement("span");
    span.appendChild(widgets[0].getElement());

    var position = 0;

    var that = Object.create(Widget);

    that.getElement = function() {
        return span;
    };

    that.reset = function() {
        widgets.each(function(widget) { widget.reset(); });
        position = 0;
    };

    that.tick = function() {
        if (position < widgets.length) {
            widgets[position].tick();
        }
    };

    that.isDone = function() {
        while (position < widgets.length && widgets[position].isDone()) {
            if (position < widgets.length-1) {
                span.removeChild(widgets[position].getElement());
            }
            position += 1;
            if (position < widgets.length) {
                span.appendChild(widgets[position].getElement());
            }
        }

        return position >= widgets.length;
    };

    return that;
}

// Another basic graphical element:
// some text with a rectangular background of a certain color.
function Textbox(text, bgcolor) {
    var span = document.createElement('span');
    span.style.display = "table-cell";
    span.style.borderWidth = "2px";
    span.style.backgroundColor = bgcolor;
    span.innerHTML = text;

    var that = Object.create(Widget);

    that.getElement = function() {
        return span;
    };

    return that;
}

// Widget modifier to change the position on screen
Widget.AtPosition = function(left, top) {
    var span = document.createElement("span");
    span.style.display = "table-cell";
    span.style.position = "absolute";
    span.style.left = left + "px";
    span.style.top = top + "px";
    span.appendChild(this.getElement());

    var that = Object.create(this);

    that.getElement = function() {
        return span;
    };

    return that;
}

// Like 'AtPosition', but the x/y coordinates can change each tick,
// based on what 'move' returns next.  It should return either:
// - an object with 'left' and 'right' integer fields, denoting a position, or
// - 'null', to indicate that the animation is done.
Widget.ChangingPosition = function(move) {
    var parent = this;
    var that = Object.create(this);

    var span = document.createElement("span");
    span.style.position = "absolute";
    span.appendChild(this.getElement());
    var pos;

    var moveIt = function() {
        pos = move();
        if (pos) {
            span.style.left = pos.left + "px";
            span.style.top = pos.top + "px";
        }
    };

    moveIt();

    that.getElement = function() {
        return span;
    };

    that.tick = function() {
        if (!this.isDone()) {
            moveIt();

            parent.tick();
        }
    };

    that.isDone = function() {
        return !pos;
    };

    return that;
}

// A hopping behavior, with an initial velocity vector,
// and decceleration to apply in the y direction.
// The animation ends when the widget returns to its original vertical position.
Widget.Hopping = function(rightwardSpeed, upwardSpeed, decceleration) {
    var displacementX = 0, displacementY = 0, done = false;

    return this.ChangingPosition(function() {
        if (done) {
            return null;
        }

        displacementX += rightwardSpeed;
        displacementY += upwardSpeed;

        if (displacementY < 0) {
            done = true;
            displacementY = 0;
        }

        upwardSpeed -= decceleration;

        return {left: displacementX, top: -displacementY};
    });
}

// A shaking behavior, switching rapidly between two different horizontal offsets.
Widget.Shaking = function(magnitude, duration) {
    return this.ChangingPosition(function() {
        if (duration <= 0) {
            return null;
        }

        duration -= 1;
        magnitude = -magnitude;

        return {left: magnitude, top: 0};
    });
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

// Three of them, repeating forever!
function Stickmen() {
    return Horizontal([
        Stickman().RepeatIndefinitely(),
        Stickman().RepeatIndefinitely(),
        Stickman().RepeatIndefinitely()
    ]);
}

// Now one of the stickmen gets tired after 2 iterations.
function StickmenTired() {
    return Horizontal([
        Stickman().RepeatIndefinitely(),
        Stickman().RepeatIndefinitely(),
        Stickman().Repeat(2)
    ]);
}

// Set up 'n' stickmen in a row.
function CloneStickmen(n) {
    return Horizontal(Array.create(Stickman, n));
}

// Now some of the stickmen get so tired that they decide to leave.
function StickmenTired() {
    return Sequence([
        CloneStickmen(3).Repeat(3),
        CloneStickmen(2).Repeat(3),
        CloneStickmen(1).Repeat(3),
        CloneStickmen(10)
    ]);
}


//// "Once upon a time in the ASCII Kingdom" animation....

// A few different textboxes, corresponding to expressions of our two actors
function Box() {
    return Textbox(":-)", "blue");
}
function Angrybox() {
    return Textbox(">:[", "red");
}
function Shoutingbox() {
    return Textbox("O:<", "red");
}
function Surprisedbox() {
    return Textbox(":-O", "purple");
}
function Jokerbox() {
    return Textbox("((((-:", "orange");
}

// A happy box hopping once to the right
function HoppingBox() {
    return Box().Hopping(1, 5, 1);
}

// The leftward actor hopping toward the rightward actor, saying "Hi!"
function HoppingBoxTwice() {
    return Sequence([
        HoppingBox().AtPosition(5, 50),
        HoppingBox().AtPosition(20, 50),
        Horizontal([Box().AtPosition(35, 50),
                    Textbox("Hi!", "white")]).Repeat(10),
        HoppingBox().AtPosition(35, 50),
    ]);
}

// A shouting box shaking angrily
function ShakingBox() {
    return Shoutingbox().Shaking(2, 10);
}

// A surprised box shaking and then hopping backwards twice
function RetreatingBox() {
    return Sequence([
        Surprisedbox().Shaking(2, 10),
        Surprisedbox().Hopping(-1, 10, 2),
        Surprisedbox().Hopping(-1, 10, 2).AtPosition(-15, 0)
    ]);
}

// The whole animation.  Play it to see what it does. :-)
function HappyMeetsAngry() {
    return Sequence([
        Textbox("Once upon a time in the ASCII Kingdom....", "grey").Repeat(30),
        Horizontal([
            HoppingBoxTwice(),
            Angrybox().AtPosition(70, 50)
        ]),
        Horizontal([
            Box().AtPosition(50, 50),
            ShakingBox().AtPosition(70, 50)
        ]),
        Horizontal([
            RetreatingBox().AtPosition(50, 50),
            Shoutingbox().AtPosition(70, 50)
        ]),
        Horizontal([
            Surprisedbox().AtPosition(20, 50),
            Jokerbox().AtPosition(70, 50),
            Textbox("WHY, HELLO THERE!", "white").Repeat(60)
        ]),
        Textbox("And they all lived happily ever after.", "grey")
    ]);
}

// The support files look in this variable to see which widget to animate and how quickly.
var current = {period: 50, widget: HappyMeetsAngry()};
