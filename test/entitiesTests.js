var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var entities = require('../src/entities');
var InvalidDataBaseException = require('../src/exceptions');
var parser = require('../src/parser');

var RuleParser = parser.RuleParser;

var Fact = entities.Fact;
var Query = entities.Query;
var Rule = entities.Rule;
var DataBase = entities.DataBase;

describe("Entities", function () {

    var ok_db = [
        "varon(juan).",
        "varon(pepe).",
        "varon(hector).",
        "varon(roberto).",
        "varon(alejandro).",
        "mujer(maria).",
        "mujer(cecilia).",
        "padre(juan, pepe).",
        "padre(juan, pepa).",
        "padre(hector, maria).",
        "padre(roberto, alejandro).",
        "padre(roberto, cecilia).",
        "hijo(X, Y) :- varon(X), padre(Y, X).",
        "hija(X, Y) :- mujer(X), padre(Y, X)."
    ];

    var error_db = [
        "varon(juan).",
        "varon(pepe).",
        "varon(hector).",
        "varon(roberto).",
        "varon(ALEJANDRO).",
        "hijo(X, Y) :- varon(X), padre(Y, X).",
        "hija(X, Y) :- mujer(X), padre(Y, X)."
    ];

    var db = null;
    var rp = null;

    beforeEach(function () {
        // runs before each test in this block
        db = new DataBase();
        rp = new RuleParser();
    });

    describe('Fact', function() {
        it('varon(juan). is a fact', function () {
            let f = new Fact(['varon(juan).', 'varon', 'juan']);
            assert(f instanceof Fact);
        });

        it('varon(juan) query is equal to varon(juan). fact', function () {
            let f = new Fact(['varon(juan).', 'varon', 'juan']);
            let q = new Query(['varon(juan)', 'varon', 'juan']);
            assert(f.isEqual(q));
        });
        it('varon(juan, pedro) query is not equal to varon(juan). fact', function () {
            let f = new Fact(['varon(juan).', 'varon', 'juan']);
            let q = new Query(['varon(juan, pedro)', 'varon', 'juan, pedro']);
            assert(f.isEqual(q) === false);
        });
    });

    describe('Query', function() {
        it('varon(juan) is a query', function () {
            let q = new Query(['varon(juan)', 'varon', 'juan']);
            assert(q instanceof Query);
        });

        it('varon(juan) query name is varon', function () {
            let q = new Query(['varon(juan)', 'varon', 'juan']);
            assert(q.getName() === 'varon');
        });

        it('varon(juan) query args is juan', function () {
            let q = new Query(['varon(juan)', 'varon', 'juan']);
            assert(q.getArgs()[0] === 'juan');
        });

    });

    describe('Rule', function() {
        it('hijo(X, Y) :- varon(X), padre(Y, X). is a rule', function () {
            let r = new Rule(rp.parse('hijo(X, Y) :- varon(X), padre(Y, X).'));
            assert(r instanceof Rule);
        });

        it('hijo(X, Y) :- varon(X), padre(Y, X). name is hijo', function () {
            let r = new Rule(rp.parse('hijo(X, Y) :- varon(X), padre(Y, X).'));
            assert(r.name === 'hijo');
        });

        it('hijo(pepe, juan) query is equal to hijo(X, Y) :- varon(X), padre(Y, X). rule', function () {
            let r = new Rule(rp.parse('hijo(X, Y) :- varon(X), padre(Y, X).'));
            let q = new Query(['hijo(pepe, juan)', 'hijo', 'pepe, juan']);
            assert(r.isEqual(q) === true);
        });

        it('hija(pepe, juan) query is not equal to hijo(X, Y) :- varon(X), padre(Y, X). rule', function () {
            let r = new Rule(rp.parse('hijo(X, Y) :- varon(X), padre(Y, X).'));
            let q = new Query(['hija(pepe, juan)', 'hija', 'pepe, juan']);
            assert(r.isEqual(q) === false);
        });

    });

    describe('DataBase', function () {

        it('ok_db should be a valid DataBase', function () {
            db.createDataBase(ok_db);
            assert(db.validDataBase === true);
        });

        it('error_db should be an invalid DataBase', function () {
            try {
                db.createDataBase(error_db)
            } catch (err) {
                assert(err instanceof InvalidDataBaseException);
            }
        });

        it('createDataBase with error_db should leave validDataBase -> false', function () {
            try {
                db.createDataBase(error_db)
            } catch (err) {
                assert(db.validDataBase === false);
            }
        });

        it('createDataBase with error_db should show which element was wrong', function () {
            try {
                db.createDataBase(error_db)
            } catch (err) {
                assert(err.message === "Error in DataBase creation in parameter: varon(ALEJANDRO).");
            }
        });

        it('checkForFact with varon(juan) in ok_db should be true', function () {
            db.createDataBase(ok_db);
            assert(db.checkForFact(new Query(['varon(juan)', 'varon', 'juan'])) === true);
        });

        it('checkForFact with varon(maria) in ok_db should be false', function () {
            db.createDataBase(ok_db);
            assert(db.checkForFact(new Query(['varon(maria)', 'varon', 'maria'])) === false);
        });

        it('checkForRule with hijo(pepe, juan) in ok_db should be true', function () {
            db.createDataBase(ok_db);
            assert(db.checkForRule(new Query(['hijo(pepe, juan)', 'hijo', 'pepe, juan'])) === true);
        });

        it('checkForRule with hijo(maria, juan) in ok_db should be false', function () {
            db.createDataBase(ok_db);
            assert(db.checkForRule(new Query(['hijo(maria, pepe)', 'hijo', 'maria, pepe'])) === false);
        });

        it('checkForQuery with padre(juan, pepe) in ok_db should be true', function () {
            db.createDataBase(ok_db);
            assert(db.checkQuery('padre(juan, pepe)') === true);
        });

        it('checkForQuery with padre(maria, pepe) in ok_db should be false', function () {
            db.createDataBase(ok_db);
            assert(db.checkQuery('padre(maria, pepe)') === false);
        });

        it('checkForQuery with padre(maria, pepe is invalid query, returns null', function () {
            db.createDataBase(ok_db);
            assert(db.checkQuery('padre(maria, pepe') === null);
        });

    });


});
