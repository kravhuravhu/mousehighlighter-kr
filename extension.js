import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import Highlighter from './highlight.js';

export default class MouseHighlighterExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._toggleSwitch = null;
        this._highlighterActive = false;
        this._highlighter = new Highlighter();
    }

    _addToggleToDateMenu() {
        const calendarMenu = Main.panel.statusArea.dateMenu;
        if (!calendarMenu) return;

        this._toggleSwitch = new PopupMenu.PopupSwitchMenuItem("Mouse Highlighter", false);
        this._toggleSwitch.connect('toggled', item => {
            this._highlighterActive = item.state;

            if (this._highlighterActive) {
                this._highlighter.enable();
            } else {
                this._highlighter.disable();
            }
        });

        const dndItem = calendarMenu._dndToggle;
        const parentBox = dndItem?.get_parent();

        if (parentBox && parentBox.insert_child_at_index) {
            parentBox.insert_child_at_index(
                this._toggleSwitch.actor,
                parentBox.get_children().indexOf(dndItem) + 1
            );
        } else {
            calendarMenu.menu.addMenuItem(this._toggleSwitch, 1);
        }
    }

    _removeToggleFromDateMenu() {
        if (this._toggleSwitch) {
            this._toggleSwitch.destroy();
            this._toggleSwitch = null;
        }
    }

    enable() {
        this._addToggleToDateMenu();
    }

    disable() {
        this._removeToggleFromDateMenu();
        this._highlighter.disable();
    }
}
