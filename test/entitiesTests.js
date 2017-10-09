var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var entities = require('../src/entities');
var InvalidDataBaseException = require('../src/exceptions');

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
    ];

    var fact = null;
    var query = null;
    var rule = null;
    var db = null;

    beforeEach(function () {
        // runs before each test in this block
        fact = new Fact();
        query = new Query();
        rule = new Rule();
        db = new DataBase();
    });

    describe('DataBase', function () {

        it('ok_db should be a valid DataBase', function () {
            assert(db.createDataBase(ok_db).validDataBase === true);
        });

        it('error_db should be an invalid DataBase', function () {
            expect(db.createDataBase(error_db)).to.throwException(function (e) { // get the exception object
            expect(e).to.be.a(InvalidDataBaseException);
            });
        });

        it('error_db should be an invalid DataBase', function () {
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

    });


});
