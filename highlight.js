const Clutter = imports.gi.Clutter;
const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;

let highlightActor = null;
let pointerTracker = null;

function addHighlighter() {
    if (highlightActor) return;

    // pulse actor
    highlightActor = new St.Widget({
        style_class: 'mouse-highlighter',
        width: 100,
        height: 70,
        reactive: false,
        x: 0,
        y: 0
    });

    Main.layoutManager.addChrome(highlightActor);

    // Track pointer and follow
    let lastX = 0, lastY = 0;

    pointerTracker = Mainloop.timeout_add(16, () => {
        let [x, y] = global.get_pointer();
        lastX += (x - lastX) * 0.01;
        lastY += (y - lastY) * 0.01;

        highlightActor.set_position(lastX - 50, lastY - 35);
        return true;
    });
}

function removeHighlighter() {
    if (highlightActor) {
        highlightActor.destroy();
        highlightActor = null;
    }

    if (pointerTracker) {
        Mainloop.source_remove(pointerTracker);
        pointerTracker = null;
    }
}

var addHighlighter = addHighlighter;
var removeHighlighter = removeHighlighter;
