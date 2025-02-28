import {withController} from '@snar/lit';
import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement} from 'lit/decorators.js';
import {materialShellLoadingOff} from 'material-shell';
import {State, store} from '../store.js';
import styles from './app-shell.css?inline';
import {styleMap} from 'lit/directives/style-map.js';

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

@customElement('app-shell')
@withStyles(styles)
@withController(store)
export class AppShell extends LitElement {
	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	render() {
		return html`
			${store.state === State.NODATA ? html`No data found` : null}
			${store.state === State.LOADING ? html`Loading...` : null}
			${store.state === State.ERROR
				? html`Something went wrong with the last data.`
				: null}
			${store.state === State.NOQUESTION ? html`Data has no candidates.` : null}
			${store.state === State.QUESTION || store.state === State.ANSWER
				? html`
						<div class="flex items-center justify-center m-16 text-2xl">
							${store.answer[1]}
						</div>

						<div class="flex flex-col items-center justify-center gap-4">
							<div>${this.#renderButton(store.question[0][0])}</div>
							<div class="w-full flex items-center justify-evenly">
								${this.#renderButton(store.question[1][0])}
								${this.#renderButton(store.question[2][0])}
							</div>
							<div>${this.#renderButton(store.question[3][0])}</div>
						</div>
					`
				: null}

			<md-fab
				size="large"
				class="fixed bottom-12 right-12"
				@click=${store.newQuestion}
			>
				<md-icon slot="icon">arrow_forward</md-icon>
			</md-fab>
		`;
	}

	#renderButton(answer: string) {
		const goodAnswer =
			store.state === State.ANSWER && answer === store.answer[0];
		const style = styleMap({
			'--md-filled-tonal-button-icon-size': '24px',
			'--md-sys-color-secondary-container': goodAnswer
				? 'var(--md-sys-color-primary-container)'
				: 'inherit',
		});
		return html`<!-- -->
			<md-filled-tonal-button
				jp
				class="text-2xl"
				style=${style}
				@click=${() => store.checkAnswer(answer)}
			>
				${goodAnswer
					? html`<!-- -->
							<md-icon slot="icon">check</md-icon>
							<!-- -->`
					: null}
				${answer}</md-filled-tonal-button
			>
			<!-- -->`;
	}
}

export const app = (window.app = new AppShell());
