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
	setStateGamepad(gamepad);
	gamepad.before(
		XBoxButton.A,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					const button = getButtonElement(XBoxButton.A);
					button?.click();
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
					const button = getButtonElement(XBoxButton.B);
					button?.click();
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.X,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					const button = getButtonElement(XBoxButton.X);
					button?.click();
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.Y,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					const button = getButtonElement(XBoxButton.Y);
					button?.click();
					break;
			}
		}),
	);

	gamepad.before(
		XBoxButton.RIGHT_BUMPER,
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
