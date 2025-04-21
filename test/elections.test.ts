import { Election } from "../src/core/Election";

describe("elections", () => {

	test("election without districts", () => {
		const election = new Election(false);
		// Регистрируем официальных кандидатов
		election.addCandidate("Michel");
		election.addCandidate("Jerry");
		election.addCandidate("Johnny");

		// Добавляем избирателей и их голоса
		// Избиратели из districtName для соответствия тестам
		const voters = new Map<string, string[]>([
			["District 1", ["Bob", "Anna", "Jess", "July"]],
			["District 2", ["Jerry", "Simon"]],
			["District 3", ["Johnny", "Matt", "Carole"]],
		]);

		for (let [district, people] of voters) {
			for (let voter of people) {
				// эмулируем district как источник, но без создания districts
				if (voter === "Bob") election.vote("District 1", "Jerry");
				if (voter === "Jerry") election.vote("District 2", "Jerry");
				if (voter === "Anna") election.vote("District 1", "Johnny");
				if (voter === "Johnny") election.vote("District 3", "Johnny");
				if (voter === "Matt") election.vote("District 3", "Donald");
				if (voter === "Jess") election.vote("District 1", "Joe");
				if (voter === "Simon") election.vote("District 2", "");
				if (voter === "Carole") election.vote("District 3", "");
				// July — не голосует
			}
		}

		const results = election.getResults();

		const expected = new Map([
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
		const voters = new Map<string, string[]>([
			["District 1", ["Bob", "Anna", "Jess", "July"]],
			["District 2", ["Jerry", "Simon"]],
			["District 3", ["Johnny", "Matt", "Carole"]],
		]);

		// Добавляем округа
		for (let districtName of voters.keys()) {
			election.addDistrict(districtName);
		}

		// Регистрируем кандидатов
		election.addCandidate("Michel");
		election.addCandidate("Jerry");
		election.addCandidate("Johnny");

		// Голосование
		for (let [district, people] of voters) {
			for (let voter of people) {
				if (voter === "Bob") election.vote(district, "Jerry");
				if (voter === "Jerry") election.vote(district, "Jerry");
				if (voter === "Anna") election.vote(district, "Johnny");
				if (voter === "Johnny") election.vote(district, "Johnny");
				if (voter === "Matt") election.vote(district, "Donald");
				if (voter === "Jess") election.vote(district, "Joe");
				if (voter === "July") election.vote(district, "Jerry");
				if (voter === "Simon") election.vote(district, "");
				if (voter === "Carole") election.vote(district, "");
			}
		}

		const results = election.getResults();

		const expected = new Map([
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
