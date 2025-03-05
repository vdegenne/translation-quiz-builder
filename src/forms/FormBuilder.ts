import {html, Part} from 'lit';
import {bindInput} from './bindInput.js';
import {createRef, type Ref, ref} from 'lit/directives/ref.js';
import {type MdChipSet} from '@material/web/chips/chip-set.js';
import {type MdFilterChip} from '@material/web/chips/filter-chip.js';

interface SharedOptions {
	autofocus: boolean;
}

interface TextFieldOptions extends SharedOptions {
	// TODO: find a generic type for input type
	type: 'text' | 'number';
}

type InputOptions = {
	availableValues: string[];
};

export class FormBuilder<T> {
	constructor(protected host: T) {}

	TEXTFIELD(label: string, key: keyof T, options?: Partial<TextFieldOptions>) {
		return TEXTFIELD(label, this.host, key, options);
	}

	TEXTAREA(label: string, key: keyof T) {
		return TEXTAREA(label, this.host, key);
	}

	SWITCH(headline: string, key: keyof T, options?: Partial<SwitchOptions>) {
		return SWITCH(headline, this.host, key, options);
	}

	SLIDER(label: string, key: keyof T, options = {min: 1, max: 5}) {
		return SLIDER(label, this.host, key, options);
	}

	SELECT(label: string, key: keyof T, choices: string[] = []) {
		return SELECT(label, this.host, key, choices);
	}

	FILTER(
		label: string,
		key: keyof T,
		choices: string[],
		options?: Partial<FilterOptions>,
	) {
		return FILTER(label, this.host, key, choices, options);
	}
}

interface SwitchOptions extends SharedOptions {
	overline: string | undefined;
	supportingText: string | undefined;
}

export const SWITCH = <T>(
	headline: string,
	host: T,
	key: keyof T,
	options?: Partial<SwitchOptions>,
) => {
	const _options: SwitchOptions = {
		autofocus: false,
		supportingText: undefined,
		overline: undefined,
		...options,
	};
	return html`
		<md-list-item
			type="button"
			@click=${() => {
				(host[key] as boolean) = !host[key];
			}}
			class="select-none cursor-pointer flex items-center gap-3"
			style="--md-list-item-top-space:var(--forms-switch-padding);--md-list-item-bottom-space:var(--forms-switch-padding);--md-list-item-leading-space:var(--forms-switch-padding);--md-list-item-trailing-space:var(--forms-switch-padding);"
		>
			<md-switch slot="start" ?selected=${host[key]} inert></md-switch>
			${_options.overline
				? html` <div slot="overline">${_options.overline}</div> `
				: null}
			<div slot="headline">${headline}</div>
			${_options.supportingText
				? html` <div slot="supporting-text">${_options.supportingText}</div> `
				: null}
		</md-list-item>
	`;
};

export const SLIDER = <T>(
	label: string,
	host: T,
	key: keyof T,
	options = {min: 1, max: 5},
) => html`
	<div class="flex items-center gap-3">
		<span>${label}</span>
		<md-slider
			class="flex-1"
			ticks
			labeled
			min=${options.min}
			max=${options.max}
			${bindInput(host, key)}
		>
		</md-slider>
	</div>
`;

export const SELECT = <T>(
	label: string,
	host: T,
	key: keyof T,
	choices: string[] = [],
) => html`
	<md-filled-select quick value=${host[key]} label=${label}>
		<md-select-option></md-select-option>
		${choices.map(
			(item, id) => html`
				<md-select-option value=${id}>${item}</md-select-option>
			`,
		)}
		<md-option></md-option>
	</md-filled-select>
`;

export const TEXTFIELD = <T>(
	label: string,
	host: T,
	key: keyof T,
	options?: Partial<TextFieldOptions>,
) => {
	options = Object.assign(
		{},
		{type: 'text', autofocus: false} as TextFieldOptions,
		options ?? {},
	);
	return html`
		<md-filled-text-field
			?autofocus=${options.autofocus}
			label=${label.replace(/\*/g, '')}
			type=${options.type}
			${bindInput(host, key)}
			?required=${label.includes('*')}
		>
		</md-filled-text-field>
	`;
};

export const TEXTAREA = <T>(label: string, host: T, key: keyof T) => html`
	<md-filled-text-field
		type="textarea"
		label=${label}
		${bindInput(host, key)}
	></md-filled-text-field>
`;

interface FilterOptions extends SharedOptions {
	/**
	 * Can't unselect all if true
	 *
	 * @default false
	 */
	atLeastOne: boolean;
	/**
	 * @default string
	 */
	type: 'string' | 'number';
	/**
	 * Not implemented yet.
	 */
	sort: 'none' | 'alphabet';
}

export const FILTER = <T>(
	label: string,
	host: T,
	key: keyof T,
	choices: string[],
	options?: Partial<FilterOptions>,
) => {
	options = Object.assign(
		{},
		{type: 'string', autofocus: false, atLeastOne: false} as FilterOptions,
		options ?? {},
	);
	const chipsetref: Ref<MdChipSet> = createRef();
	return html`
		<div>
			<div class="mb-4">${label}</div>
			<md-chip-set
				class="justify-stretch"
				?autofocus=${options.autofocus}
				${ref(chipsetref)}
				@click=${(event: Event) => {
					const chipset = chipsetref.value!;
					if (
						options.atLeastOne &&
						(chipset.chips as MdFilterChip[]).filter((c) => c.selected)
							.length === 0
					) {
						event.preventDefault();
						return;
					}
					(host[key] as (string | number)[]) = (chipset.chips as MdFilterChip[])
						.filter((c) => c.selected)
						.map((c) =>
							options.type === 'string' ? c.label : choices.indexOf(c.label),
						);
				}}
			>
				${choices.map(
					(choice, index) => html`
						<md-filter-chip
							?selected=${(host[key] as (string | number)[]).includes(
								options.type === 'string' ? choice : index,
							)}
							label=${choice}
						></md-filter-chip>
					`,
				)}
			</md-chip-set>
		</div>
	`;
};

export const INPUT = <T>(
	label: string,
	host: T,
	key: keyof T,
	options?: Partial<InputOptions>,
) => {
	throw new Error('Not implemented yet.');
	return html`<!-- -->

		<!-- -->`;
};
