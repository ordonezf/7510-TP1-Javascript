var parser = require('parser');


var Fact = function () {}

var Rule = function () {}

var Query = function() {}

var DataBase = function() {

	this.facts = [];
	this.rules = [];

	this.factParser = new parser.FactParser();
	this.ruleParser = new parser.RuleParser();
	this.queryParser = new parser.QueryParser();

	this.createDataBase = function(db) {
		for (let row of db) {
			if (this.factParser.isFact(row)) {
				let factComponents = this.factParser.parse(row);
				this.facts.push(new Fact(factComponents));

			} else if (this.ruleParser.isRule(row)) {
				let ruleComponents = this.ruleParser.parse(row);
				this.rules.push(new Rule(ruleComponents));

			} else {return null;}
		}
	}

	this.checkForFact = function(query) {

		let res = this.facts.map(fact => Fact.isEqual(fact, query));
		return res.includes(true);
	}

	this.checkForRule = function(query) {/*Do Stuff*/}

	this.checkQuery = function(query) {

		if (this.queryParser.isQuery(query)) {
			let queryComponents = this.queryParser.parse(query);
			let queryObject = new Query(queryComponents);

			return this.checkForFact(queryObject) || this.checkForRule(queryObject);

		} else {return null;}
	}
}


module.exports = {
	DataBase
}
