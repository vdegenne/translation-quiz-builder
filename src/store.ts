import {ReactiveController, state} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {generateHash, shuffleArray} from './utils.js';
import {playSuccessAudio, playWrongAudio} from './assets/assets.js';
import {hasSomeJapanese} from 'asian-regexps';
import {playJapanese, speakFrench} from '@vdegenne/speech';

export enum State {
	NODATA,
	LOADING,
	QUESTION,
	ANSWER,
	ERROR,
	NOQUESTION,
}

type Entry = [string, string];

@saveToLocalStorage('translation-quiz-builder:store')
export class AppStore extends ReactiveController {
	@state() state: State = State.NODATA;
	@state() realHash = '';
	@state() hashData = '';
	@state() data: Record<string, string> = {};
	@state() answer: Entry | null = null;
	@state() otherChoices: Entry[] = [];
	@state() question: Entry[] = [];

	async firstUpdated() {
		const hash = window.location.hash.slice(1);
		if (hash) {
			const realHash = await generateHash(hash);
			if (realHash !== this.realHash) {
				this.state = State.LOADING;
				this.realHash = realHash;
				this.hashData = hash;
				try {
					this.data = JSON.parse(decodeURIComponent(hash));
					if (Object.keys(this.data).length === 0) {
						this.state = State.NOQUESTION;
						return;
					}
				} catch {
					this.state = State.ERROR;
					return;
				}
				// location.hash = '';
				this.newQuestion();
			}
		}
	}

	newQuestion = () => {
		this.state = State.QUESTION;
		const entries = Object.entries(this.data);
		let entry: Entry;
		if (entries.length === 1) {
			entry = entries[0];
		} else {
			let candidate: Entry;
			do {
				candidate = entries[Math.floor(Math.random() * entries.length)];
			} while (this.answer !== null && this.answer[0] === candidate[0]);
			entry = candidate;
		}

		this.answer = entry;

		// Remove the question
		entries.splice(entries.indexOf(this.answer) >>> 0, 1);
		// Shuffle
		shuffleArray(entries);

		this.otherChoices = entries.slice(0, 3);

		const finalQuestion = [...this.otherChoices, this.answer];
		shuffleArray(finalQuestion);

		this.question = finalQuestion;

		speakFrench(this.answer[1]);
	};

	checkAnswer(answer: string) {
		if (answer === this.answer[0]) {
			playSuccessAudio();
			this.state = State.ANSWER;
			if (hasSomeJapanese(answer)) {
				playJapanese(answer);
			}
		} else {
			playWrongAudio();
		}
	}
}

export const store = new AppStore();
