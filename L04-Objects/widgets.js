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

function RepeatHorizontal(makeWidget, count) {
    return Horizontal(Array.create(makeWidget, count));
}

function RepeatHorizontalWithSpace(makeWidget, count, width) {
    return RepeatHorizontal(function () { return WithPadding(makeWidget(), width); }, count);
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
    return RepeatHorizontalWithSpace(Stickman, 10);
}
