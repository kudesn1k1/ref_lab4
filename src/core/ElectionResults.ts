import { Candidate } from "./Candidate";
import { VoteCounter } from "./VoteCounter";

export class ElectionResults {
	constructor(private voteCounter: VoteCounter) { }

	calculate(officialCandidates: Candidate[], districtCount: number): Map<string, string> {
		const result = new Map<string, string>();
		let totalVotes = 0, validVotes = 0, nullVotes = 0, blankVotes = 0;

		const format = (v: number) =>
			v.toLocaleString("fr", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";

		if (districtCount === 0) {
			const votesMap = this.voteCounter.getVotesWithoutDistrict();

			for (let [name, votes] of votesMap.entries()) {
				totalVotes += votes;
				if (!name.length) blankVotes += votes;
				else if (!officialCandidates.find(c => c.name === name)) nullVotes += votes;
				else validVotes += votes;
			}

			for (let candidate of officialCandidates) {
				const votes = votesMap.get(candidate.name) || 0;
				if (votes) result.set(candidate.name, format((votes * 100) / validVotes));
			}
		} else {
			const districts = this.voteCounter.getDistricts();
			const wins = new Map<string, number>();

			for (let district of districts.values()) {
				const sorted = Array.from(district.votes.entries()).sort((a, b) => b[1] - a[1]);
				const winner = sorted.find(([name]) => officialCandidates.find(c => c.name === name));
				if (winner) {
					wins.set(winner[0], (wins.get(winner[0]) || 0) + 1);
				}

				for (let [name, votes] of district.votes.entries()) {
					totalVotes += votes;
					if (!name.length) blankVotes += votes;
					else if (!officialCandidates.find(c => c.name === name)) nullVotes += votes;
					else validVotes += votes;
				}
			}

			for (let [name, won] of wins.entries()) {
				result.set(name, format((won * 100) / districtCount));
			}
		}

		result.set("Blank", format((blankVotes * 100) / totalVotes));
		result.set("Null", format((nullVotes * 100) / totalVotes));
		return result;
	}
}
