Tables = function (table1, table2) {

    this.table1 = table1;
    this.table2 = table2;
    this.labelId = 'uploadTable2Label';
    this.inputId = 'uploadTable2';


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
        var that = this;
        this.table1.hot.addHook('afterLoadData', function (initialLoad) {
            that.toggleUploadButton();
        });
        this.table2.hot.addHook('afterLoadData', function (initialLoad) {
            that.toggleUploadButton();
        });
    }
};

/**
 * Enable/Disable Send Button
 * 
 * @this {Tables}
 */
Tables.prototype.toggleUploadButton = function () {
    if ((this.table1.hot.isDestroyed) || (this.table2.hot.isDestroyed) || ((this.table1.hot.countCols() === 0) && (this.table1.hot.countRows() === 0)) || ((this.table2.hot.countCols() === 0) && (this.table2.hot.countRows() === 0))) {
   		if (!($('#' + this.labelId).hasClass('disabled'))){
			$('#' + this.labelId).addClass('disabled').prop('disabled', true).tooltip('disable');
			$('#' + this.inputId).prop('disabled', true);
			toggleLastTab('-');
			toggleLastTab('-');
			console.log('disableUpload');
		}
    } else {
		if ($('#' + this.labelId).hasClass('disabled')){
			$('#' + this.labelId).removeClass('disabled').prop('disabled', false).tooltip('enable');
			$('#' + this.inputId).prop('disabled', false);
			toggleLastTab('+');
			toggleLastTab('+');	
			console.log('enableUpload');
		}			
    }
};