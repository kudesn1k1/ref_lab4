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

	addCandidate(name: string, official: boolean = true) {
		if (this.candidates.has(name)) return;

		const candidate = new Candidate(name, official);
		this.candidates.set(name, candidate);

		if (this.withDistrict) {
			this.districts.forEach(district => district.addCandidate(candidate));
		} else {
			this.voteCounter.registerCandidate(candidate);
		}
	}

	addDistrict(name: string) {
		if (this.districts.has(name)) return;

		const district = new District(name);
		this.candidates.forEach(candidate => district.addCandidate(candidate));
		this.districts.set(name, district);
		this.voteCounter.registerDistrict(district);
	}

	vote(electorDistrict: string, candidateName: string) {
		this.addCandidate(candidateName, false);

		const candidate = this.candidates.get(candidateName)!;
		const district = this.withDistrict ? this.districts.get(electorDistrict) : undefined;

		if (this.withDistrict && !district) {
			throw new Error(`Unknown district: ${electorDistrict}`);
		}

		this.voteCounter.addVote(candidate, district);
	}

	getResults(): Map<string, string> {
		const officialCandidates = Array.from(this.candidates.values()).filter(c => c.isOfficial);
		const results = new ElectionResults(this.voteCounter);
		return results.calculate(officialCandidates, this.districts.size);
	}
}
