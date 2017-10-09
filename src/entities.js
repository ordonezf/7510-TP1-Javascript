var parser = require('../src/parser');
var InvalidDataBaseException = require('../src/exceptions');


var Fact = function (parsedFact) {

    this.name = parsedFact[1];
    this.args = parsedFact[2].split(', ');

    this.isEqual = function(query) {
        return (this.name === query.getName() && this.args.join(',') === query.getArgs().join(','));
    }
}

var Rule = function (parsedRule) {

    this.name = parsedRule[0][1];
    this.args = parsedRule[0][2].split(', ');
    this.conditions = parsedRule.slice(1).map(fact => new Fact(fact));

    this.isEqual = function(query) {
        return (this.name === query.getName() && this.args.lenght === query.getArgs().lenght)
    }
    //this.lenght = function() { return this.args.lenght;}
}

var Query = function(parsedQuery) {

    this.name = parsedQuery[1];
    this.args = parsedQuery[2].split(', ');

    this.getName = function() {return this.name;}
    this.getArgs = function() {return this.args;}
}


var arrayMerger = function() {

    this.dic = {};
    this.merge = function(arr1, arr2) {
        for (var i = 0; i < Object.keys(arr1).length; i++) {
            this.dic[arr1[i]] = arr2[i];
        }
    }
}

var DataBase = function() {

    this.facts = [];
    this.rules = [];
    this.validDataBase = true;

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

            } else {
                this.validDataBase = false;
                throw new InvalidDataBaseException(row);
            }
        }

    }

    this.checkForFact = function(query) {

        let res = this.facts.map(fact => fact.isEqual(query));
        return res.includes(true);
    }

    this.checkForRule = function(query) {
    /*Do Stuff*/
        let arm = new arrayMerger();
        for (let rule of this.rules) {
            if (rule.isEqual(query)) {
                arm.merge(rule.args, query.args);
                let res = rule.conditions.map(fact => new Query(['foo', fact.name, fact.args.map(arg => arm.dic[arg]).join(', ')]));
                let res1 = res.map(query => this.checkForFact(query));
                return res1.every(e => e === true);
            }
        }
        return false;
    }

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
