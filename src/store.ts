import {ReactiveController, state} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {
	playShuffleAudio,
	playSuccessAudio,
	playWrongAudio,
} from './assets/assets.js';
import {generateHash, playAudio, shuffleArray} from './utils.js';

export enum State {
	NODATA,
	LOADING,
	QUESTION,
	ANSWER,
	ERROR,
	NOQUESTION,
}

export type Entry = [string, string];
export type EntryData = Record<string, string>;

@saveToLocalStorage('translation-quiz-builder:store')
export class AppStore extends ReactiveController {
	@state() state: State = State.NODATA;
	@state() realHash = '';
	@state() hashData = '';
	@state() data: EntryData = {};
	@state() bag: Entry[] = [];
	@state() answer: Entry | null = null;
	@state() otherChoices: Entry[] = [];
	@state() question: Entry[] = [];
	@state() speakQuestion = true;
	@state() speakAnswer = false;
	@state() reverseMode = false;
	@state() dataHistory: {hash: string; data: EntryData}[] = [];

	async firstUpdated() {
		const hash = decodeURIComponent(window.location.hash.slice(1));
		if (hash) {
			const realHash = await generateHash(hash);
			this.data = JSON.parse(hash);
			this.addToHistory(realHash, this.data);
			if (realHash !== this.realHash) {
				this.state = State.LOADING;
				this.realHash = realHash;
				this.hashData = hash;
				try {
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

	addToHistory(hash: string, data: EntryData) {
		if (!this.dataHistory.some((item) => item.hash === hash)) {
			this.dataHistory = [...this.dataHistory, {hash, data}];
		}
	}
	removeFromHistory(hash: string) {
		const index = this.dataHistory.findIndex((i) => i.hash === hash);
		if (index >= 0) {
			this.dataHistory = this.dataHistory.filter((_, i) => i != index);
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

		if (this.speakQuestion) {
			const questionWord = this.reverseMode ? this.answer[0] : this.answer[1];
			playAudio(questionWord);
		}
	};

	checkAnswer(input: string) {
		const answer = this.reverseMode ? this.answer[1] : this.answer[0];
		if (input === answer) {
			if (this.state !== State.ANSWER) {
				playSuccessAudio();
				this.state = State.ANSWER;
			}
			if (this.speakAnswer) {
				playAudio(input);
			}
		} else {
			playWrongAudio();
		}
	}
}

export const store = new AppStore();
