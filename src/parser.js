var regex = {
	validFact: /^([a-z]+)\(((?:[a-z]+, )*[a-z]+)\)\.$/,
	validQuery: /^([a-z]+)\(((?:[a-z]+, )*[a-z]+)\)\.$/,
	validRule: /^([a-z]+)\(((?:[A-Z]+, )*[A-Z]+)\) :- (([a-z]+)\(((?:[A-Z]+, )*[A-Z]+)\)[, \.]+)+$/,
	parseRule: /([a-z]+)\(((?:[A-Z]+, )*[A-Z]+)\)/g,
	parseRuleElements: /([a-z]+)\(((?:[A-Z]+, )*[A-Z]+)\)/
}


var FactParser = function() {

	this.isFact = function(str) {
		return regex.validFact.test(str)
	}

	this.parse = function(str) {
		return str.match(regex.validFact);
	}
}
var QueryParser = function() {

	this.isQuery = function(str) {
		return regex.validQuery.test(str);
	}

	this.parse = function(str) {
		return str.match(regex.validQuery);
	}
}
var RuleParser = function() {

	this.isRule = function(str) {
		return regex.validRule.test(str);
	}

	this.parse = function(str) {
		let arr = str.match(regex.parseRule)
		return arr.map(elem => elem.match(regex.parseRuleElements))
	}
}






module.exports = {
    FactParser,
    RuleParser,
	QueryParser
}
