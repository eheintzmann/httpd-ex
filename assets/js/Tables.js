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

    this.table1.hot.addHook('afterLoadData', function (initialLoad) {
        table1.toggleUploadButton();
    });
    this.table2.hot.addHook('afterLoadData', function (initialLoad) {
        table2.toggleUploadButton();
    });
}


/**
 * Check if tables is full
 *
 * @this {Tables}
 * @returns {boolean} - true if tables is full, false if not
 */
Tables.prototype.isFull = function () {
    if ((this.table1.isEmpty() || (this.table2.isEmpty()))) {
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
        if ($('#' + this.labelId).hasClass('disabled')) {
            $('#' + this.labelId).removeClass('disabled').prop('disabled', false).tooltip('enable');
            $('#' + this.inputId).prop('disabled', false);
            toggleLastTab('+');
            toggleLastTab('+');
            console.log('enableUpload');
        }
    } else {
        if (!($('#' + this.labelId).hasClass('disabled'))) {
            $('#' + this.labelId).addClass('disabled').prop('disabled', true).tooltip('disable');
            $('#' + this.inputId).prop('disabled', true);
            toggleLastTab('-');
            toggleLastTab('-');
            console.log('disableUpload');
        }
    }
};