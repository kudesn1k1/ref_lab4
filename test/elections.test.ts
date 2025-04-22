// test/elections.test.ts
import { Election } from "../src/core/Election";

describe("elections", () => {

	test("election without districts", () => {
		const election = new Election(false);

		election.addCandidate("Michel");
		election.addCandidate("Jerry");
		election.addCandidate("Johnny");

		const votersByDistrict = new Map<string, string[]>([
			["District 1", ["Bob", "Anna", "Jess", "July"]],
			["District 2", ["Jerry", "Simon"]],
			["District 3", ["Johnny", "Matt", "Carole"]],
		]);

		for (const people of votersByDistrict.values()) {
			for (const voter of people) {
				election.registerVoter(voter);
			}
		}

		for (const [district, people] of votersByDistrict) {
			for (const voter of people) {
				if (voter === "Bob") election.vote(voter, "Jerry", district);
				if (voter === "Jerry") election.vote(voter, "Jerry", district);
				if (voter === "Anna") election.vote(voter, "Johnny", district);
				if (voter === "Johnny") election.vote(voter, "Johnny", district);
				if (voter === "Matt") election.vote(voter, "Donald", district);
				if (voter === "Jess") election.vote(voter, "Joe", district);
				if (voter === "Simon") election.vote(voter, "", district);
				if (voter === "Carole") election.vote(voter, "", district);
				// "July" — не голосует
			}
		}

		const results = election.getResults();
		const expected = new Map<string, string>([
			["Jerry", "50,00%"],
			["Johnny", "50,00%"],
			["Michel", "0,00%"],
			["Blank", "25,00%"],
			["Null", "25,00%"],
			["Abstention", "11,11%"],
		]);

		expect(results).toEqual(expected);
	});

	test("election with districts", () => {
		const election = new Election(true);

		const votersByDistrict = new Map<string, string[]>([
			["District 1", ["Bob", "Anna", "Jess", "July"]],
			["District 2", ["Jerry", "Simon"]],
			["District 3", ["Johnny", "Matt", "Carole"]],
		]);

		for (const districtName of votersByDistrict.keys()) {
			election.addDistrict(districtName);
		}

		election.addCandidate("Michel");
		election.addCandidate("Jerry");
		election.addCandidate("Johnny");

		for (const people of votersByDistrict.values()) {
			for (const voter of people) {
				election.registerVoter(voter);
			}
		}

		for (const [district, people] of votersByDistrict) {
			for (const voter of people) {
				if (voter === "Bob") election.vote(voter, "Jerry", district);
				if (voter === "Jerry") election.vote(voter, "Jerry", district);
				if (voter === "Anna") election.vote(voter, "Johnny", district);
				if (voter === "Johnny") election.vote(voter, "Johnny", district);
				if (voter === "Matt") election.vote(voter, "Donald", district);
				if (voter === "Jess") election.vote(voter, "Joe", district);
				if (voter === "July") election.vote(voter, "Jerry", district);
				if (voter === "Simon") election.vote(voter, "", district);
				if (voter === "Carole") election.vote(voter, "", district);
			}
		}

		const results = election.getResults();
		const expected = new Map<string, string>([
			["Jerry", "66,67%"],
			["Johnny", "33,33%"],
			["Michel", "0,00%"],
			["Blank", "22,22%"],
			["Null", "22,22%"],
			["Abstention", "0,00%"],
		]);

		expect(results).toEqual(expected);
	});

});
