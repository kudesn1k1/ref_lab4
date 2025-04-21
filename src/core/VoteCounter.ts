import { Candidate } from "./Candidate";
import { District } from "./District";

export class VoteCounter {
	private votesWithoutDistrict: Map<string, number> = new Map();
	private districts: Map<string, District> = new Map();

	constructor(private withDistrict: boolean) { }

	registerCandidate(candidate: Candidate) {
		if (!this.withDistrict) {
			this.votesWithoutDistrict.set(candidate.name, 0);
		}
	}

	registerDistrict(district: District) {
		this.districts.set(district.name, district);
	}

	addVote(candidate: Candidate, district?: District) {
		if (this.withDistrict) {
			district!.addVote(candidate.name);
		} else {
			this.votesWithoutDistrict.set(candidate.name, (this.votesWithoutDistrict.get(candidate.name) || 0) + 1);
		}
	}

	getVotesWithoutDistrict() {
		return this.votesWithoutDistrict;
	}

	getDistricts() {
		return this.districts;
	}
}
