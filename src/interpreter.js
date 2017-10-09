var Entities = require('../src/entities');
var DataBase = Entities.DataBase;


var Interpreter = function () {

    this.database = new DataBase();
    this.databaseIsValid = true;

    this.parseDB = function(db) {
        let res = this.database.createDataBase(db);
    }

    this.checkQuery = function (query) {
        return this.database.checkQuery(query);
    }

}

module.exports = Interpreter;
