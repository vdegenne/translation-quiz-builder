import {type MdFilterChip} from '@material/web/chips/filter-chip.js';
import {withController} from '@snar/lit';
import {XBoxButton} from 'esm-gamecontroller.js';
import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, query} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {styleMap} from 'lit/directives/style-map.js';
import {materialShellLoadingOff} from 'material-shell';
import {
	openDataVisualiserDialog,
	openHistoryDialog,
	openSettingsDialog,
} from '../imports.js';
import {State, store} from '../store.js';
import styles from './app-shell.css?inline';
import {hasSomeJapanese} from 'asian-regexps';
import {classMap} from 'lit/directives/class-map.js';

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
	@query(':focus') focusedItem!: MdFilterChip;

	firstUpdated() {
		materialShellLoadingOff.call(this);
	}

	get selectedItemContent() {
		return this.focusedItem.dataset.value;
	}

	render() {
		console.log('render');
		const questionIndex = store.reverseMode ? 0 : 1;
		const answersIndex = store.reverseMode ? 1 : 0;
		return html`
			${store.state === State.NODATA ? html`No data found` : null}
			${store.state === State.LOADING ? html`Loading...` : null}
			${store.state === State.ERROR
				? html`Something went wrong with the last data.`
				: null}
			${store.state === State.NOQUESTION ? html`Data has no candidates.` : null}
			${store.state === State.QUESTION || store.state === State.ANSWER
				? html`
						<header class="flex m-4 gap-4">
							<div class="flex-1"></div>
							<md-icon-button @click=${openHistoryDialog}>
								<md-icon>history</md-icon>
							</md-icon-button>
							<md-icon-button @click=${openDataVisualiserDialog}>
								<md-icon>database</md-icon>
							</md-icon-button>
							<md-icon-button @click=${openSettingsDialog}>
								<md-icon>settings</md-icon>
							</md-icon-button>
						</header>
						<div
							class="flex items-center justify-center m-16 mb-24 text-3xl"
							?jp=${hasSomeJapanese(store.answer[questionIndex])}
						>
							${store.answer[questionIndex]}
						</div>

						<div class="flex flex-col items-center justify-center gap-4">
							<div>
								${this.#renderButton(
									store.question[0]?.[answersIndex],
									XBoxButton.UP,
								)}
							</div>
							<div class="w-full flex items-center justify-evenly">
								${this.#renderButton(
									store.question[1]?.[answersIndex],
									XBoxButton.LEFT,
								)}
								${this.#renderButton(
									store.question[2]?.[answersIndex],
									XBoxButton.RIGHT,
								)}
							</div>
							<div>
								${this.#renderButton(
									store.question[3]?.[answersIndex],
									XBoxButton.DOWN,
								)}
							</div>
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

	#renderButton(answer: string, gamepadButton: XBoxButton) {
		if (!answer) {
			return null;
		}
		const goodAnswer =
			store.state === State.ANSWER &&
			answer === (store.reverseMode ? store.answer[1] : store.answer[0]);
		const style = styleMap({
			'--md-filled-tonal-button-icon-size': '24px',
			'--md-sys-color-secondary-container': goodAnswer
				? 'var(--md-sys-color-primary-container)'
				: 'inherit',
		});
		const hasJap = hasSomeJapanese(answer);
		const classes = classMap({
			'text-2xl': !hasJap,
			'font-light': !hasJap,
			'text-3xl': hasJap,
		});
		return html`<!-- -->
			<md-filled-tonal-button
				?jp=${hasSomeJapanese(answer)}
				class="${classes}"
				style=${style}
				@click=${() => store.checkAnswer(answer)}
				gp-button=${ifDefined(gamepadButton)}
				data-value=${answer}
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
