function InvalidDataBaseException(sMessage) {
    this.name = "InvalidDataBaseException";
    this.message = "Error in DataBase creation in parameter: " + sMessage;
    this.stack = (new Error()).stack;
}
InvalidDataBaseException.prototype = Object.create(Error.prototype);
InvalidDataBaseException.prototype.constructor = InvalidDataBaseException;

module.exports = InvalidDataBaseException;
