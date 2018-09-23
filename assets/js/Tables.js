Tables = function (table1, table2) {

    this.table1 = table1;
    this.table2 = table2;
}


/**
 * Open files
 * 
 * @this {Tables}
 * @param {Object} event - Event Object
 */
Tables.prototype.openFiles = function (event) {
    this.table1.readFile(event.target.files[0]);
    this.table2.readFile(event.target.files[1]);
};