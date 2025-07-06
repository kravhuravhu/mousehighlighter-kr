import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class Highlighter {
    constructor() {
        this._pulseActor = null;
        this._timeoutId = 0;
        this._clickId = 0;
        this._pulseLoopId = 0;
    }

    enable() {
        if (this._pulseActor) return;

        this._pulseActor = new St.Widget({
            style_class: 'mouse-highlighter',
            reactive: true,
            track_hover: false,
            width: 80,
            height: 80,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER
        });

        Main.uiGroup.add_child(this._pulseActor);

        this._timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 16, () => {
            let [x, y] = global.get_pointer();
            this._pulseActor.set_position(x - 40, y - 40);
            return GLib.SOURCE_CONTINUE;
        });

        this._clickId = global.stage.connect('button-press-event', (actor, event) => {
            const [x, y] = event.get_coords();
            log(`Clicked at (${x}, ${y})`);
            this._showClickPulse(x, y);
        });

        this._startPulseAnimation();
    }

    _startPulseAnimation() {
        let t = 0;
        this._pulseLoopId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 50, () => {
            if (!this._pulseActor) return GLib.SOURCE_REMOVE;

            const blur = 10 + 5 * Math.abs(Math.sin(t));
            const alpha = 0.4725 + 0.4725 * Math.abs(Math.sin(t));

            this._pulseActor.set_style(`
                border-radius: 50px;
                border: 6.5px solid rgba(0, 83, 236, 0.4);
                background-color: transparent;
                box-shadow: 0 0 ${blur}px rgba(0, 83, 236, ${alpha});
            `);

            t += 0.15;
            return GLib.SOURCE_CONTINUE;
        });
    }

    _showClickPulse(x, y) {
        const initialSize = 80;
        const finalSize = 120;
        const initialOffset = initialSize / 2;

        const pulse = new St.Widget({
            style_class: 'click-pulse',
            reactive: false,
            can_focus: false,
            track_hover: false,
            width: 80,
            height: 80,
            x: x - 40,
            y: y - 40,
            opacity: 255
        });
        pulse.set_style(`
            border-radius: 85px;
            background-color: rgba(0, 83, 236, 0.31);
        `);

        Main.uiGroup.add_child(pulse);
        Main.uiGroup.set_child_above_sibling(pulse, null);

        pulse.ease({
            width: 140,
            height: 140,
            x: x - 70,
            y: y - 70,
            opacity: 0,
            duration: 700,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onComplete: () => {
                GLib.timeout_add(GLib.PRIORITY_DEFAULT, 10, () => {
                    if (pulse.get_parent()) {
                        pulse.get_parent().remove_child(pulse);
                    }
                    pulse.destroy();
                    return GLib.SOURCE_REMOVE;
                });
            }
        });
    }

    disable() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = 0;
        }

        if (this._clickId) {
            global.stage.disconnect(this._clickId);
            this._clickId = 0;
        }

        if (this._pulseActor) {
            Main.uiGroup.remove_child(this._pulseActor);
            this._pulseActor.destroy();
            this._pulseActor = null;
        }
        if (this._pulseLoopId) {
            GLib.source_remove(this._pulseLoopId);
            this._pulseLoopId = 0;
        }

    }
}