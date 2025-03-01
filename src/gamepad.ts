import gamectrl, {
	getMode,
	Modes,
	setStateGamepad,
	XBoxButton,
} from 'esm-gamecontroller.js';
import {cquerySelector} from 'html-vision';
import {store} from './store.js';
import {app} from './app-shell/app-shell.js';
import {googleImagesOpen, jishoOpen} from '@vdegenne/links';
import {playJapanese} from '@vdegenne/speech';

function getButtonElement(button: XBoxButton) {
	return cquerySelector(`[gp-button="${button}"]`);
}

function shouldNotExecute() {
	if (!document.hasFocus()) {
		return true;
	}
	const speakerTest = document.querySelector<HTMLElement>('speaker-test');
	if (speakerTest && speakerTest.hasAttribute('open')) {
		return true;
	}
	return false;
}

function guard(callback: Function) {
	return function () {
		if (shouldNotExecute()) {
			return;
		}
		callback();
	};
}

gamectrl.on('connect', async (gamepad) => {
	gamepad.axeThreshold = [0.3];
	setStateGamepad(gamepad);

	gamepad.before(
		XBoxButton.LEFT,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					const button = getButtonElement(XBoxButton.LEFT);
					button.focus();
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.RIGHT,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					const button = getButtonElement(XBoxButton.RIGHT);
					button.focus();
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.UP,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					const button = getButtonElement(XBoxButton.UP);
					button.focus();
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.DOWN,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					const button = getButtonElement(XBoxButton.DOWN);
					button.focus();
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.B,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					app.focusedItem?.click();
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.A,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					store.newQuestion();
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.DPAD_RIGHT,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					jishoOpen(app.selectedItemContent);
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.DPAD_DOWN,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					googleImagesOpen(app.selectedItemContent);
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.LEFT_BUMPER,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					playJapanese(app.selectedItemContent);
					break;
			}
		}),
	);
});
