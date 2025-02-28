import {ReactiveController, state} from '@snar/lit';
import {installRouter} from 'pwa-helpers';

export enum Page {
	HOME,
	SESSION,
}

class Router extends ReactiveController {
	@state() page: Page = Page.HOME;

	navigateComplete = Promise.resolve();

	constructor() {
		super();
		installRouter(async (location) => {
			router.navigateComplete = new Promise(async (resolve) => {
				const hash = location.hash;
				// do something
				resolve();
			});
		});
	}
}

export const router = new Router();
