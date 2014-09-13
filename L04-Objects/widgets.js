// Some animation widgets, squeezed together in one source file for simplicity of reading

// "Interface" of a widget object:
// getElement(), to return a DOM node standing for this object
// tick(), called to advance the animation to the next step

// This function returns an animation of a given widget,
// advancing to a new frame every 'period' milliseconds.
function animation(widget, period) {
    function ticker() {
        window.setTimeout(function() {
            widget.tick();
            ticker();
        }, period);
    }

    ticker();
    return widget.getElement();
}

// Animation of monospaced text, rotating through a sequence of sprites.
// The argument is an array of arrays of lines of text (strings).
function AsciiAnimation(sprites) {
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

    return {
        getElement: function() {
            return span;
        },
        tick: function() {
            animationFrame = (animationFrame + 1) % sprites.length;
            useSprite(animationFrame);
        }
    };
}

// Graphics via the HTML canvas.
function Canvas(width, height, withContext) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');
    withContext(context);

    return {
        getElement: function() {
            return canvas;
        },
        tick: function() {
        }
    };
}

function Circle(radius) {
    return Canvas(radius*2+10, radius*2+10, function(context) {
        context.beginPath();
        context.arc(radius+5, radius+5, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#003300';
        context.stroke();
    });
}

// Lay out a widget array horizontally.
function Horizontal(widgets) {
    var that = document.createElement('span');

    widgets.each(function(widget) { that.appendChild(widget.getElement()); });

    return {
        getElement: function() {
            return that;
        },
        tick: function() {
            widgets.each(function(widget) { widget.tick(); });
        }
    };
}

// Wrap a widget with a certain amount of padding, with width expressed in CSS width format.
function WithPadding(widget, width) {
    width = width || "10px";
    var span = document.createElement("span");
    span.style.display = "inline-block";
    span.style.padding = width;
    span.appendChild(widget.getElement());

    return {
        getElement: function() {
            return span;
        },
        tick: function() {
            widget.tick();
        }
    }
}

// Repeat a single widget scheme (represented as a function returning a widget)
// some number of times, horizontally.
function RepeatHorizontal(makeWidget, count) {
    return Horizontal(Array.create(makeWidget, count));
}

// Like RepeatHorizontal(), but with padding added around each widget.
function RepeatHorizontalWithPadding(makeWidget, count, width) {
    return RepeatHorizontal(function () { return WithPadding(makeWidget(), width); }, count);
}

function TimedLoop(widgets) {
    if (widgets.length < 2 || widgets.length % 2 > 0) {
        throw {name: "TimedLoop", message: "Argument array must be nonempty with even length"};
    }

    var span = document.createElement("span");
    span.appendChild(widgets[0].getElement());

    var positionInSequence = 0;
    var ticksAtThisPosition = 0;

    return {
        getElement: function() {
            return span;
        },
        tick: function() {
            if (ticksAtThisPosition >= widgets[positionInSequence+1]) {
                span.removeChild(widgets[positionInSequence].getElement());

                ticksAtThisPosition = 0;
                positionInSequence = (positionInSequence + 2) % widgets.length;

                span.appendChild(widgets[positionInSequence].getElement());
            } else {
                ticksAtThisPosition += 1;
            }
        }
    };
}

function AlternatingTicks(widgets) {
    var that = document.createElement('span');

    widgets.each(function(widget) { that.appendChild(widget.getElement()); });

    var parity = 0;

    return {
        getElement: function() {
            return that;
        },
        tick: function() {
            widgets.eachi(function(i, widget) { if (i % 2 === parity) { widget.tick(); } });
            parity = (parity + 1) % 2;
        }
    };
}

function AlternatingTicksRepeat(makeWidget, count) {
    return AlternatingTicks(Array.create(makeWidget, count));
}

function AlternatingTicksRepeatWithPadding(makeWidget, count, width) {
    return AlternatingTicksRepeat(function () { return WithPadding(makeWidget(), width); }, count);
}

function TimeVarying(makeWidget) {
    var ticker = 0;
    var span = document.createElement("span");
    var widget = makeWidget(0);
    span.appendChild(widget.getElement());

    return {
        getElement: function() {
            return span;
        },
        tick: function() {
            span.removeChild(widget.getElement());
            ticker += 1;
            widget = makeWidget(ticker);
            span.appendChild(widget.getElement());
        }
    };
}



//// Some example animations

var Stickman = function() {
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
};

var JustALine = function() {
    return Canvas(500, 500, function(context) {
        context.beginPath();
        context.moveTo(100, 100);
        context.lineTo(200, 200);
        context.stroke();
    });
};

var StickmanAndLine = function() {
    return Horizontal([Stickman(), JustALine()]);
};

var Stickmen = function() {
    return RepeatHorizontalWithPadding(Stickman, 10);
};

var Timed = function() {
    return TimedLoop([Stickman(), 5, JustALine(), 1]);
};

var StickmenAlternating = function() {
    return AlternatingTicksRepeatWithPadding(Stickman, 10);
};

var StickmanAndCircle = function() {
    return Horizontal([Stickman(), TimeVarying(function(tick) { return Circle(3 * (tick % 5 + 1)); })]);
};

var StickmenAndCircles = function() {
    return RepeatHorizontalWithPadding(StickmanAndCircle, 5);
};
