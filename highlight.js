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
        log('[Highlighter] Constructed');
    }

    enable() {
        log('[Highlighter] Enabling');

        if (this._pulseActor) {
            log('[Highlighter] Already enabled, skipping.');
            return;
        }

        const size = 57;
        log('[Highlighter] Creating pulse actor (mouse follower)');
        this._pulseActor = new St.Widget({
            style_class: 'mouse-highlighter',
            reactive: false,
            track_hover: false,
            width: size,
            height: size,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER
        });

        Main.uiGroup.add_child(this._pulseActor);
        log('[Highlighter] Pulse actor added to UI');

        this._timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 16, () => {
            const [x, y] = global.get_pointer();
            this._pulseActor.set_position(x - size / 2, y - size / 2);
            return GLib.SOURCE_CONTINUE;
        });
        log('[Highlighter] Mouse tracker timeout set');
        
        this._clickId = global.stage.connect('captured-event', (actor, event) => {
            if (event.type() === Clutter.EventType.BUTTON_PRESS) {
                const [x, y] = event.get_coords();
                log(`[Highlighter] Click detected at (${x}, ${y})`);
                this._showClickPulse(x, y);
            }
            return Clutter.EVENT_PROPAGATE;
        });
        log('[Highlighter] Stage click event connected');

        this._startPulseAnimation();
    }

    _startPulseAnimation() {
        log('[Highlighter] Starting cursor ring animation loop');
        let t = 0;
        this._pulseLoopId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 50, () => {
            if (!this._pulseActor) {
                log('[Highlighter] Pulse actor no longer exists. Stopping animation loop.');
                return GLib.SOURCE_REMOVE;
            }

            const blur = 10 + 5 * Math.abs(Math.sin(t));
            const alpha = 0.45 + 0.45 * Math.abs(Math.sin(t));

            this._pulseActor.set_style(`
                border-radius: 50px;
                border: 5px solid rgba(0, 83, 236, 0.4);
                background-color: transparent;
                box-shadow: 0 0 ${blur}px rgba(0, 83, 236, ${alpha});
            `);

            t += 0.15;
            return GLib.SOURCE_CONTINUE;
        });
    }

    _showClickPulse(x, y) {
        log(`[Highlighter] Creating click pulse at (${x}, ${y})`);

        const startSize = 57;
        const endSize = 105;

        const pulse = new St.Widget({
            name: 'click-pulse',
            reactive: false,
            can_focus: false,
            track_hover: false,
            width: startSize,
            height: startSize,
            x: x - startSize / 2,
            y: y - startSize / 2,
            opacity: 255
        });

        pulse.set_style(`
            border-radius: 85px;
            background-color: rgba(0, 132, 255, 0.2);
        `);

        Main.uiGroup.add_child(pulse);
        Main.uiGroup.set_child_above_sibling(pulse, null);

        log('[Highlighter] Starting click pulse animation');

        pulse.ease({
            width: endSize,
            height: endSize,
            x: x - endSize / 2,
            y: y - endSize / 2,
            opacity: 0,
            duration: 500,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onComplete: () => {
                log('[Highlighter] Click pulse animation completed');
                if (pulse.get_parent()) {
                    pulse.get_parent().remove_child(pulse);
                }
                pulse.destroy();
            }
        });
    }

    disable() {
        log('[Highlighter] Disabling');

        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            log('[Highlighter] Mouse tracking timeout removed');
            this._timeoutId = 0;
        }

        if (this._clickId) {
            global.stage.disconnect(this._clickId);
            log('[Highlighter] Click event disconnected');
            this._clickId = 0;
        }

        if (this._pulseLoopId) {
            GLib.source_remove(this._pulseLoopId);
            log('[Highlighter] Animation loop stopped');
            this._pulseLoopId = 0;
        }

        if (this._pulseActor) {
            log('[Highlighter] Removing and destroying pulse actor');
            Main.uiGroup.remove_child(this._pulseActor);
            this._pulseActor.destroy();
            this._pulseActor = null;
        }

        log('[Highlighter] Disabled successfully');
    }
}
