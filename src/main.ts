import { Election } from "./core/Election";

const election = new Election(true);

election.addCandidate("Alice");
election.addCandidate("Bob");
election.addDistrict("District 1");
election.addDistrict("District 2");
election.addDistrict("District 3");

election.vote("District 1", "Alice");
election.vote("District 1", "Alice");
election.vote("District 2", "Bob");
election.vote("District 2", "");
election.vote("District 3", "Some Fake");

const results = election.getResults();
for (let [name, value] of results.entries()) {
	console.log(`${name}: ${value}`);
}
