import gamectrl, {type GCGamepad, XBoxButton} from 'esm-gamecontroller.js';

export enum Modes {
	NORMAL = 0,
	PRIMARY = 1,
	SECONDARY = 2,
	TERTIARY = 3,
}

export function getMode() {
	if (isNormal()) {
		return Modes.NORMAL;
	}
	if (isPrimary()) {
		return Modes.PRIMARY;
	}
	if (isSecondary()) {
		return Modes.SECONDARY;
	}
	if (isTertiary()) {
		return Modes.TERTIARY;
	}
}

let _gamepad: GCGamepad;

export function isNormal() {
	return !_gamepad.pressed.button6 && !_gamepad.pressed.button7;
	// return !modifiers.LT && modifiers.RT;
}
export function isPrimary() {
	return _gamepad.pressed.button6 && !_gamepad.pressed.button7;
	// return !modifiers.LT && modifiers.RT;
}
export function isSecondary() {
	return !_gamepad.pressed.button6 && _gamepad.pressed.button7;
	// return !modifiers.LT && modifiers.RT;
}
export function isTertiary() {
	return _gamepad.pressed.button6 && _gamepad.pressed.button7;
	// return modifiers.LT && modifiers.RT;
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
	gamepad.on(
		XBoxButton.B,
		guard(() => {
			const mode = getMode();
			switch (mode) {
				case Modes.NORMAL:
					// do something
					break;
			}
		})
	);
});
