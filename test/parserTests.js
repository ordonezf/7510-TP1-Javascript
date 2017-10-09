var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var parser = require('../src/parser');

var FactParser = parser.FactParser;
var QueryParser = parser.QueryParser;
var RuleParser = parser.RuleParser;

describe("Parser", function () {

    var factParser = null;
    var queryParser = null;
    var ruleParser = null;

    beforeEach(function () {
        // runs before each test in this block
        factParser = new FactParser();
        queryParser = new QueryParser();
        ruleParser = new RuleParser();
    });

    describe('FactParser', function () {

        it('varon(juan). should be true', function () {
            assert(factParser.isFact('varon(juan).') === true);
        });

        it('varon(juan. should be false', function () {
            assert(factParser.isFact('varon(juan.') === false);
        });

        it('varon(maria) should be false', function () {
            assert(factParser.isFact('varon(maria)') === false);
        });

        it('padre(juan, pepe). should be true', function () {
            assert(factParser.isFact('padre(juan, pepe).') === true);
        });

        it('padre(mario, Pepe). should be false', function () {
            assert(factParser.isFact('padre(mario, Pepe).') === false);
        });

        it('padre(mario,pepe). should be false', function () {
            assert(factParser.isFact('padre(mario,Pepe).') === false);
        });

        it('padre mario, pepe). should be false', function () {
            assert(factParser.isFact('padre mario, pepe).') === false);
        });

    });

    describe('QueryParser', function () {

        it('varon(juan) should be true', function () {
            assert(queryParser.isQuery('varon(juan)') === true);
        });

        it('varon(juan should be false', function () {
            assert(queryParser.isQuery('varon(juan.') === false);
        });

        it('varon(maria) should be true', function () {
            assert(queryParser.isQuery('varon(maria)') === true);
        });

        it('padre(juan, pepe) should be true', function () {
            assert(queryParser.isQuery('padre(juan, pepe)') === true);
        });

        it('padre(mario, Pepe) should be false', function () {
            assert(queryParser.isQuery('padre(mario, Pepe)') === false);
        });

        it('padre(mario,pepe) should be false', function () {
            assert(queryParser.isQuery('padre(mario,Pepe)') === false);
        });

        it('padre mario, pepe). should be false', function () {
            assert(queryParser.isQuery('padre mario, pepe)') === false);
        });

    });

    describe('RuleParser', function () {

        it('hijo(X, Y) :- varon(X), padre(Y, X). should be true', function () {
            assert(ruleParser.isRule('hijo(X, Y) :- varon(X), padre(Y, X).') === true);
        });

        it('hijo(X, Y) - varon(X), padre(Y, X). should be false', function () {
            assert(ruleParser.isRule('hijo(X, Y) - varon(X), padre(Y, X).') === false);
        });

        it('hijo(X, Y) :- padre(Y, X). should be true', function () {
            assert(ruleParser.isRule('hijo(X, Y) :- padre(Y, X).') === true);
        });

        it('hijo(X, Y, Z) :- varon(Z, X), padre(Y, X). should be true', function () {
            assert(ruleParser.isRule('hijo(X, Y, Z) :- varon(Z, X), padre(Y, X).') === true);
        });

        it('hijo(X, Y, z) :- varon(Z, X), padre(Y, X). should be false', function () {
            assert(ruleParser.isRule('hijo(X, Y, z) :- varon(Z, X), padre(Y, X).') === false);
        });

        it('hijo(X, Y, Z) :- varon(Z, X), padre(Y, X) should be false', function () {
            assert(ruleParser.isRule('hijo(X, Y, Z) :- varon(Z, X), padre(Y, X)') === false);
        });

        it('hijo(X, Y, Z) : varon(Z, X), padre(Y, X). should be false', function () {
            assert(ruleParser.isRule('hijo(X, Y, Z) : varon(Z, X), padre(Y, X).') === false);
        });

    });


});
