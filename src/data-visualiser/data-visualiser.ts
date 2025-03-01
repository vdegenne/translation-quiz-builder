import type {MdDialog} from '@material/web/all.js';
import {customElement} from 'custom-element-decorator';
import {html, LitElement} from 'lit';
import {withStyles} from 'lit-with-styles';
import {query, state} from 'lit/decorators.js';
import {bindInput} from '@vdegenne/forms';
import styles from './data-visualiser.css?inline';
import {withController} from '@snar/lit';
import {type Entry, store} from '../store.js';

declare global {
	interface Window {
		dataVisualiser: DataVisualiser;
	}
	interface HTMLElementTagNameMap {
		'data-visualiser': DataVisualiser;
	}
}

@customElement({name: 'data-visualiser', inject: true})
@withStyles(styles)
@withController(store)
export class DataVisualiser extends LitElement {
	@state() open = false;
	@query('md-dialog') dialog!: MdDialog;

	render() {
		return html`<!-- -->
			<md-dialog
				?open="${this.open}"
				@closed=${() => {
					this.open = false;
				}}
			>
				<header slot="headline">Data</header>

				<form slot="content" method="dialog" id="form">
					<md-list>
						${Object.entries(store.data).map((entry: Entry) => {
							return html`<md-list-item>
								<div slot="headline" class="text-xl">${entry[0]}</div>
								<div slot="overline">${entry[1]}</div>
							</md-list-item>`;
						})}
					</md-list>
				</form>

				<div slot="actions">
					<md-text-button form="form" value="cancel"> Close </md-text-button>
				</div>
			</md-dialog>
			<!-- --> `;
	}

	/**
	 * The source is not duplicated but will never be modified so you don't need to clone it before
	 * feeding it into this function.
	 */
	async show() {
		this.open = true;
	}

	close(returnValue?: string) {
		return this.dialog.close(returnValue);
	}
}

export const dataVisualiser = new DataVisualiser();
