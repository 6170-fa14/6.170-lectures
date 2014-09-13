// Some animation widgets, squeezed together in one source file for simplicity of reading

// "Interface" of a widget object:
// getElement(), to return a DOM node standing for this object
// tick(), called to advance the animation to the next step
// isDone(), querying whether this part of the animation is done

// This function returns an animation of a given widget,
// advancing to a new frame every 'period' milliseconds.
function animation(widget, period) {
    var paused = false, suspendedTick = null;

    function ticker() {
        window.setTimeout(function() {
            function doTick() {
                suspendedTick = null;
                widget.tick();
                if (!widget.isDone()) { ticker(); }
            }

            if (paused) {
                suspendedTick = doTick;
            } else {
                doTick();
            }
        }, period);
    }

    window.onkeypress = function() {
        if (paused) {
            paused = false;
            widget.unpause();
            if (suspendedTick) suspendedTick();
        } else {
            paused = true;
            widget.pause();
        }
    };

    ticker();
    return widget.getElement();
}

// Behold: the prototypical widget!
var Widget = {
    reset: function() { },
    tick: function() { },
    isDone: function() { return true; },
    pause: function() { },
    unpause: function() { }
};
// We use safe defaults for everything having to do with state change over time.
// Only getElement() needs to be overridden, for the simple case of a static widget.

// Animation of monospaced text, rotating through a sequence of sprites.
// The argument is an array of arrays of lines of text (strings).
function AsciiAnimation(sprites) {
    var that = Object.create(Widget);

    var span = document.createElement('span');
    span.style.display = "inline-block";
    var pre = document.createElement('pre');
    span.appendChild(pre);

    var useSprite = function(i) {
        pre.innerHTML = "";
        sprites[i].each(function(line) { pre.innerHTML += line + "\n"; });
    };

    var animationFrame = 0;
    useSprite(0);

    that.getElement = function() {
        return span;
    };

    that.reset = function() {
        animationFrame = 0;
    };

    that.tick = function() {
        animationFrame += 1;
        if (animationFrame < sprites.length) {
            useSprite(animationFrame);
        }
    };

    that.isDone = function() {
        return animationFrame >= sprites.length;
    };

    return that;
}

// Play an animation over and over again, given a function for creating new widgets.
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

// Play an animation a certain number of times.
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

// Lay out a widget array horizontally.
function Horizontal(widgets) {
    var span = document.createElement('span');
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

    that.pause = function() {
        widgets.each(function(widget) { widget.pause(); });
    };

    that.unpause = function() {
        widgets.each(function(widget) { widget.unpause(); });
    };

    that.isDone = function() {
        return widgets.reduce(function(widget, b) { return widget.isDone() && b; }, true);
    };

    return that;
}

// Plays a list of widgets in sequence, starting each after the prior one finishes.
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

    that.pause = function() {
        if (position < widgets.length) {
            widgets[position].pause();
        }
    };

    that.unpause = function() {
        if (position < widgets.length) {
            widgets[position].unpause();
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

function Textbox(text, bgcolor, whenPaused) {
    var span = document.createElement('span');
    span.style.display = "table-cell";
    span.style.borderWidth = "2px";
    span.style.backgroundColor = bgcolor;
    span.innerHTML = text;

    var that = Object.create(Widget);

    that.getElement = function() {
        return span;
    };

    that.pause = function() {
        if (whenPaused) {
            span.innerHTML = whenPaused;
        }
    };

    that.unpause = function() {
        if (whenPaused) {
            span.innerHTML = text;
        }
    };

    return that;
}

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

var stickman = AsciiAnimation([
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

function Box() {
    return Textbox(":-)", "blue", ":-|");
}

function Angrybox() {
    return Textbox(">:[", "red", ":-|");
}

function Shoutingbox() {
    return Textbox("O:<", "red", "|-:");
}

function Surprisedbox() {
    return Textbox(":-O", "purple", ":-|");
}

function Jokerbox() {
    return Textbox("((((-:", "orange", "|-:");
}

function HoppingBox() {
    return Box().Hopping(1, 5, 1);
}

function ShakingBox() {
    return Shoutingbox().Shaking(2, 10);
}

function RetreatingBox() {
    return Sequence([
        Surprisedbox().Shaking(2, 10),
        Surprisedbox().Hopping(-1, 10, 2),
        Surprisedbox().Hopping(-1, 10, 2).AtPosition(-15, 0)
    ]);
}

function HoppingBoxTwice() {
    return Sequence([
        HoppingBox().AtPosition(5, 50),
        HoppingBox().AtPosition(20, 50),
        Horizontal([Box().AtPosition(35, 50),
                    Textbox("Hi!", "white")]).Repeat(10),
        HoppingBox().AtPosition(35, 50),
    ]);
}

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

var current = HappyMeetsAngry();
