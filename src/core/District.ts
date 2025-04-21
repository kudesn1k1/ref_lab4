import { Candidate } from "./Candidate";

export class District {
	public votes: Map<string, number> = new Map();

	constructor(public name: string) { }

	addCandidate(candidate: Candidate) {
		this.votes.set(candidate.name, 0);
	}

	addVote(candidateName: string) {
		this.votes.set(candidateName, (this.votes.get(candidateName) || 0) + 1);
	}
}