var Entities = require('entities');
var DataBase = Entities.DataBase;


var Interpreter = function () {
    this.database;

    this.parseDB = function(db) {
        this.database = new DataBase();
        this.database.createDataBase(db);
        if (this.database === null) {return null};
    }

    this.checkQuery = function (query) {
        return this.database.checkQuery(query);
    }

}

module.exports = Interpreter;
