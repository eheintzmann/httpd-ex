/**
 * Create new Table Object
 *
 * @constructor
 * @this {Tables}
 * @param {Object} table1 - Instance of Table
 * @param {Object} table2 - Instance of Table
 */
Tables = function (table1, table2, labelId, inpudId) {

    this.table1 = table1;
    this.table2 = table2;
    this.labelId = 'uploadTable2Label';
    this.inputId = 'uploadTable2';
    var that = this;

    this.table1.hot.addHook('afterLoadData', function (initialLoad) {
        that.toggleUploadButton();
    });
    this.table2.hot.addHook('afterLoadData', function (initialLoad) {
        that.toggleUploadButton();
    });
}


/**
 * Check if tables is full
 *
 * @this {Tables}
 * @returns {boolean} - true if tables is full, false if not
 */
Tables.prototype.isFull = function () {
    if ((this.table1.isEmpty()) || (this.table2.isEmpty())) {
        return false;
    } else {
        return true;
    }
}


/**
 * Open files
 * 
 * @this {Tables}
 * @param {Object} event - Event Object
 */
Tables.prototype.openFiles = function (event) {
    if (event.target.files.length !== 2) {
        alert('Please open 2 Excel files');
    } else {
        this.table1.readFile(event.target.files[0]);
        this.table2.readFile(event.target.files[1]);
    }
};

/**
 * Enable/Disable Send Button
 * 
 * @this {Tables}
 */
Tables.prototype.toggleUploadButton = function () {
    if (this.isFull()) {
        $('#' + this.labelId).removeClass('disabled').prop('disabled', false).tooltip('enable');
        $('#' + this.inputId).prop('disabled', false);
        toggleLastTab();
    } else {
        $('#' + this.labelId).addClass('disabled').prop('disabled', true).tooltip('disable');
        $('#' + this.inputId).prop('disabled', true);
        toggleLastTab();
    }
};


/**
 * Send files to the server
 * 
 * @param {Event} event - Event
 */
Tables.prototype.send = function (event) {
    if (this.isFull()) {
        this.table1.send(event);
        this.table2.send(event);
    }
}