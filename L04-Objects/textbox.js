// To save some typing time in class, we'll paste in this code for textbox widgets.

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


// A hopping behavior, with an initial velocity vector,
// and deceleration to apply in the y direction.
// The animation ends when the widget returns to its original vertical position.
Widget.Hopping = function(rightwardSpeed, upwardSpeed, deceleration) {
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

        upwardSpeed -= deceleration;

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

