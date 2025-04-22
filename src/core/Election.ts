import { Candidate } from "./Candidate";
import { District } from "./District";
import { VoteCounter } from "./VoteCounter";
import { ElectionResults } from "./ElectionResults";

export class Election {
	private candidates: Map<string, Candidate> = new Map();
	private districts: Map<string, District> = new Map();
	private voteCounter: VoteCounter;

	constructor(public withDistrict: boolean = false) {
		this.voteCounter = new VoteCounter(this.withDistrict);
	}

	registerVoter(voterId: string): void {
		this.voteCounter.registerVoter(voterId);
	}

	/** Добавить нового кандидата */
	addCandidate(name: string, official: boolean = true): void {
		if (this.candidates.has(name)) return;
		const candidate = new Candidate(name, official);
		this.candidates.set(name, candidate);

		// добавляем в счётчик
		this.voteCounter.registerCandidate(candidate);
	}

	/** Добавить новый округ (только в withDistrict режиме) */
	addDistrict(name: string): void {
		if (this.districts.has(name)) return;
		const district = new District(name);

		this.candidates.forEach(c => district.addCandidate(c));
		this.districts.set(name, district);
		this.voteCounter.registerDistrict(district);
	}

	/**
	 * Голосование за кандидата
	 * @param voterId — уникальный идентификатор избирателя
	 * @param candidateName — имя кандидата ("" для blank)
	 * @param electorDistrict — название округа (игнорируется, если withDistrict = false)
	 */
	vote(voterId: string, candidateName: string, electorDistrict?: string): void {
		this.registerVoter(voterId);

		this.addCandidate(candidateName, false);
		const candidate = this.candidates.get(candidateName)!;

		let district: District | undefined;
		if (this.withDistrict) {
			district = this.districts.get(electorDistrict!);
			if (!district) {
				throw new Error(`Unknown district: ${electorDistrict}`);
			}
		}

		if (!candidateName.length) {
			this.voteCounter.addBlankVote(voterId, district);
		} else {
			this.voteCounter.addVote(voterId, candidate, district);
		}
	}

	/** Получить готовые проценты по всем */
	getResults(): Map<string, string> {
		const officialCandidates = Array.from(this.candidates.values()).filter(c => c.isOfficial);
		const results = new ElectionResults(this.voteCounter);
		return results.calculate(officialCandidates, this.districts.size);
	}
}
