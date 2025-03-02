import {ReactiveController, state} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {generateHash, shuffleArray} from './utils.js';
import {
	playShuffleAudio,
	playSuccessAudio,
	playWrongAudio,
} from './assets/assets.js';
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

export type Entry = [string, string];

@saveToLocalStorage('translation-quiz-builder:store')
export class AppStore extends ReactiveController {
	@state() state: State = State.NODATA;
	@state() realHash = '';
	@state() hashData = '';
	@state() data: Record<string, string> = {};
	@state() bag: Entry[] = [];
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
				this.fillBagAndShuffle();
				this.newQuestion();
			}
		}
	}

	fillBagAndShuffle() {
		const bag = Object.entries(this.data);
		shuffleArray(bag);
		playShuffleAudio();
		this.bag = bag;
	}

	newQuestion = () => {
		this.state = State.QUESTION;
		if (this.bag.length === 0) {
			this.fillBagAndShuffle();
		}

		// Pick an (answer) in the bag
		const answerIndexInTheBag = Math.floor(Math.random() * this.bag.length);
		const answer = this.bag[answerIndexInTheBag];
		this.bag = this.bag.filter((_, i) => i !== answerIndexInTheBag);
		this.answer = answer;

		// Pick choices (without the answer ofc)
		const entries = Object.entries(this.data);
		const answerIndexIntTheData = entries.findIndex(
			(e) => e[0] === this.answer[0],
		);
		entries.splice(answerIndexIntTheData >>> 0, 1);

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
			if (this.state !== State.ANSWER) {
				playSuccessAudio();
				this.state = State.ANSWER;
			}
			if (hasSomeJapanese(answer)) {
				playJapanese(answer);
			}
		} else {
			playWrongAudio();
		}
	}
}

export const store = new AppStore();
