const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const { addHighlighter, removeHighlighter } = Me.imports.highlight;

let toggleSwitch;
let highlighterActive = false;

function toggleHighlighter() {
    highlighterActive = !highlighterActive;
    if (highlighterActive) {
        addHighlighter();
    } else {
        removeHighlighter();
    }
}

function addToggleToDateMenu() {
    const calendarMenu = Main.panel.statusArea.dateMenu;
    if (!calendarMenu) return;

    toggleSwitch = new PopupMenu.PopupSwitchMenuItem("Mouse Highlighter", false);
    toggleSwitch.connect('toggled', () => {
        toggleHighlighter();
    });

    calendarMenu.menu.addMenuItem(toggleSwitch, 1);
}

function removeToggleFromDateMenu() {
    if (toggleSwitch && toggleSwitch.destroy) {
        toggleSwitch.destroy();
        toggleSwitch = null;
    }
}

function init() {}

function enable() {
    addToggleToDateMenu();
}

function disable() {
    removeHighlighter();
    removeToggleFromDateMenu();
}
