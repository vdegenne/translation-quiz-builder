import type {MdDialog} from '@material/web/all.js';
import {withController} from '@snar/lit';
import {customElement} from 'custom-element-decorator';
import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {query, state} from 'lit/decorators.js';
import {FormBuilder} from '../forms/FormBuilder.js';
import {store} from '../store.js';
import {themeStore} from '../styles/styles.js';
import {renderThemeElements} from '../styles/theme-elements.js';
import styles from './settings-dialog.css?inline';

let F = new FormBuilder(store);

@customElement({name: 'settings-dialog', inject: true})
@withStyles(styles)
@withController(themeStore)
@withController(store)
class SettingsDialog extends LitElement {
	@state() open = false;

	@query('md-dialog') dialog!: MdDialog;

	render() {
		return html`
			<md-dialog ?open=${this.open} @closed=${() => (this.open = false)}>
				<header slot="headline">
					<md-icon>settings</md-icon>
					Settings
				</header>

				<form
					slot="content"
					method="dialog"
					id="form"
					class="flex flex-col gap-9"
				>
					<md-list class="p-0" style="--forms-switch-padding:initial">
						${F.SWITCH('Reverse mode', 'reverseMode')}
						${F.SWITCH('Speak question', 'speakQuestion')}
						${F.SWITCH('Speak answer', 'speakAnswer')}
					</md-list>

					<div class="mb-5">
						<p>Theme</p>
						${renderThemeElements()}
					</div>
				</form>

				<div slot="actions">
					<md-text-button form="form">Close</md-text-button>
				</div>
			</md-dialog>
		`;
	}

	async show() {
		if (this.dialog.open) {
			const dialogClose = new Promise((resolve) => {
				const resolveCB = () => {
					resolve(null);
					this.dialog.removeEventListener('closed', resolveCB);
				};
				this.dialog.addEventListener('closed', resolveCB);
			});
			this.dialog.close();
			await dialogClose;
		}
		this.open = true;
	}

	close(returnValue?: string) {
		return this.dialog.close(returnValue);
	}
}

declare global {
	interface Window {
		settingsDialog: SettingsDialog;
	}
	interface HTMLElementTagNameMap {
		'settings-dialog': SettingsDialog;
	}
}

export const settingsDialog = (window.settingsDialog = new SettingsDialog());
