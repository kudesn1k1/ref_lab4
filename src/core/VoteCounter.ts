import { Candidate } from "./Candidate";
import { District } from "./District";

export class VoteCounter {
	private votesWithoutDistrict: Map<string, number> = new Map();
	private districts: Map<string, District> = new Map();

	private registeredVoters: Set<string> = new Set();
	private votersWhoVoted: Set<string> = new Set();

	constructor(private withDistrict: boolean) { }

	registerVoter(voterId: string): void {
		this.registeredVoters.add(voterId);
	}

	registerCandidate(candidate: Candidate): void {
		if (!this.withDistrict) {
			this.votesWithoutDistrict.set(candidate.name, 0);
		} else {
			// при режиме с округами — убедимся, что в каждом округе есть счётчик
			this.districts.forEach(d => d.addCandidate(candidate));
		}
	}

	/** Округ появляется в счётчике */
	registerDistrict(district: District): void {
		this.districts.set(district.name, district);
	}

	/** 
	 * Голос за кандидата: 
	 */
	addVote(voterId: string, candidate: Candidate, district?: District): void {
		if (this.votersWhoVoted.has(voterId)) {
			throw new Error(`Voter ${voterId} has already voted`);
		}
		this.votersWhoVoted.add(voterId);

		if (this.withDistrict) {
			district!.addVote(candidate.name);
		} else {
			const current = this.votesWithoutDistrict.get(candidate.name) ?? 0;
			this.votesWithoutDistrict.set(candidate.name, current + 1);
		}
	}

	/**
	 * Пустой бюллетень:
	 * идентичная логика, только candidateName = ""
	 */
	addBlankVote(voterId: string, district?: District): void {
		if (this.votersWhoVoted.has(voterId)) {
			throw new Error(`Voter ${voterId} has already voted`);
		}
		this.votersWhoVoted.add(voterId);

		const name = "";
		if (this.withDistrict) {
			district!.addVote(name);
		} else {
			const current = this.votesWithoutDistrict.get(name) ?? 0;
			this.votesWithoutDistrict.set(name, current + 1);
		}
	}

	/** Вся таблица голосов без округов */
	getVotesWithoutDistrict(): Map<string, number> {
		return this.votesWithoutDistrict;
	}

	/** Все округа с их голосами */
	getDistricts(): Map<string, District> {
		return this.districts;
	}

	/** Общее число зарегистрированных избирателей */
	getRegisteredVoters(): number {
		return this.registeredVoters.size;
	}

	/** Сколько из них НЕ проголосовало */
	getAbstentions(): number {
		return this.registeredVoters.size - this.votersWhoVoted.size;
	}
}
