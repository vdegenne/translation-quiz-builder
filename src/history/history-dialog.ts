import type {MdDialog} from '@material/web/all.js';
import {customElement} from 'custom-element-decorator';
import {html, LitElement} from 'lit';
import {withStyles} from 'lit-with-styles';
import {query, state} from 'lit/decorators.js';
import styles from './history-dialog.css?inline';
import {withController} from '@snar/lit';
import {store} from '../store.js';
import {confirm} from '../confirm.js';
import {preventDefault, stopPropagation} from '../utils.js';
import '../material/dialog-patch.js';
import {nothingYet} from '../templates.js';

declare global {
	interface Window {
		historyDialog: HistoryDialog;
	}
	interface HTMLElementTagNameMap {
		'history-dialog': HistoryDialog;
	}
}

@customElement({name: 'history-dialog', inject: true})
@withStyles(styles)
@withController(store)
export class HistoryDialog extends LitElement {
	@state() open = false;

	@query('md-dialog') dialog!: MdDialog;

	render() {
		return html`<!-- -->
			<md-dialog
				?open="${this.open}"
				@closed=${() => {
					this.remove();
					this.open = false;
				}}
			>
				<header slot="headline">History</header>

				<form slot="content" method="dialog" id="form">
					${store.dataHistory.length === 0 ? nothingYet() : null}
					<md-list>
						${[...store.dataHistory].reverse().map((history) => {
							return html`
								<md-list-item
									href="#${JSON.stringify(history.data)}"
									target="_blank"
								>
									<div slot="headline">
										${Object.values(history.data).slice(0, 3).join(' / ')}
									</div>
									<div slot="end">
										<md-icon-button
											@click=${(event: Event) => {
												preventDefault(event);
												stopPropagation(event);
												this.deleteHistoryItem(history.hash);
											}}
											@pointerdown=${stopPropagation}
										>
											<md-icon>delete</md-icon>
										</md-icon-button>
									</div>
								</md-list-item>
							`;
						})}
					</md-list>
				</form>

				<div slot="actions">
					<md-text-button form="form">Close</md-text-button>
				</div>
			</md-dialog>
			<!-- --> `;
	}

	@confirm()
	deleteHistoryItem(hash: string) {
		store.removeFromHistory(hash);
	}

	async show() {
		this.open = true;
	}

	close(returnValue?: string) {
		return this.dialog.close(returnValue);
	}
}

export const historyDialog = new HistoryDialog();
