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


const params2 = {
    hotId: 'hot2',
    containerId: 'hot2',
    inputId: 'uploadTable2',
    labelId: 'uploadTable2Label',
    loaderId: 'loader2',
    loaderClass: 'loader1',
    tableCount: 2
}

const params3 = {
    hotId: 'hot3',
    containerId: 'hot2',
    inputId: 'uploadTable2',
    labelId: 'uploadTable2Label',
    loaderId: 'loader2',
    loaderClass: 'loader2',
    tableCount: 2
}

/*var table2 = new Table(params2);
var table3 = new Table(params3);*/

var tables = new Tables(new Table(params2), new Table(params3));

// When document is loaded
$(document).ready(function () {
    // Desactivate Send Button
    //table1.toggleUploadButton();
    // When windows is resized
    $(window).on('resize', function () {
        tables.table1.hot.updateSettings({
            width: tables.table1.calculateWidth(),
            height: tables.table1.calculateHeight()
        });
        tables.table2.hot.updateSettings({
            width: tables.table2.calculateWidth(),
            height: tables.table2.calculateHeight()
        });
    });
});