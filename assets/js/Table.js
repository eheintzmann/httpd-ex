/**
 * Create new Table Object
 *
 * @constructor
 * @this {Table}
 * @param {Object} params - Arguments of the table constructor
 */
Table = function (params) {

    /** @type {Object} */
    this.params = params;

    /** @type {Element} */
    this.hotElement = document.getElementById(this.params.hotId);

    /** @type {Element} */
    this.hotParentElement = document.getElementById(this.params.containerId);

    /** @type {Object} */
    this.hotSettings = {
        data: this.params.initialData,
        /*columns: [{
            data: 'Year',
            type: 'numeric',
            allowEmpty: false,
            className: 'htCenter'
          },
          {
            data: 'Ford',
            type: 'numeric',
            allowEmpty: false,
            className: 'htCenter'
          },
          {
            data: 'Tesla',
           type: 'numeric',
            allowEmpty: false,
            className: 'htCenter'

          },
          {
            data: 'Toyota',
            type: 'numeric',
            allowEmpty: false,
            className: 'htCenter'
          },
          {
            data: 'Honda',
            type: 'numeric',
            allowEmpty: false,
            className: 'htCenter'
          },
        ],*/
        stretchH: 'all',
        width: this.calculateWidth(),
        height: this.calculateHeight(),
        //maxRows: 22,
        renderAllRows: false,
        contextMenu: true,
        autoWrapRow: true,
        rowHeaders: true,
        /*colHeaders: [
          'Year',
          'Ford',
          'Tesla',
          'Toyota',
          'Honda',
        ],*/
        manualRowResize: true,
        manualColumnResize: true,
        columnSorting: true,
        sortIndicator: true,
        /*autoColumnSize: {
          useHeaders: true,
        },*/
        //colWidths: ,
        //minRows: 1,
        //minSpareRows: 1,
    }

    /** @type {Handsontable} */
    this.hot = new Handsontable(this.hotElement, this.hotSettings);
}


/**
 * Check if table is empty
 * 
 * @this {Table}
 * @returns {boolean} - return true is table is empty, false if not
 */
Table.prototype.isEmpty = function () {
    if ((this.hot.isDestroyed) || ((this.hot.countCols() === 0) && (this.hot.countRows() === 0))) {
        //this.hot.clear();
        return true;
    } else {
        return false;
    }
}


/** 
 * Calculate optimal Width for the Table
 * 
 * @this {Table}
 * @returns {number} - Width of the Table
 */
Table.prototype.calculateWidth = function () {
    //return ((parseInt(Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) - parseInt($('#' + this.params.containerId).offset().left)) - 15);
    return ($(window).width() - 300);
};


/** 
 * Calculate optimal Height for the Table
 * 
 * @this {Table}
 * @returns {number} - Height of the Table
 */
Table.prototype.calculateHeight = function () {
    var height = 0;
    if (this.params.tableCount === 1) {
        height = $(window).height() - 200;
    } else if (this.params.tableCount === 2) {
        height = ($(window).height() - 300) / 2;
    }
    return height;
};


/**
 * export JSON to excel file
 * 
 * @this {Table} 
 * @param {Object} items - JSON Object to convert
 * @param {string} fileTitle - Title of the file to export
 */
Table.prototype.export2Excel = function (items, fileTitle) {
    var workbook, sheet;
    try {
        workbook = XLSX.utils.book_new();
        sheet = XLSX.utils.json_to_sheet(items);
        XLSX.utils.book_append_sheet(workbook, sheet, 'main');
        XLSX.writeFile(workbook, fileTitle + '.xlsx', {
            bookType: 'xlsx'
        });
    } catch (error) {
        Table.displayError(error, 'Cannot export file');
        return
    } finally {
        delete sheet;
        delete workbook;

    }
}


/**
 * Enable/Disable Send Button
 * 
 * @this {Table}
 */
Table.prototype.toggleResetButton = function () {
    if (this.isEmpty()) {
        if (!($('#' + this.params.labelId).hasClass('disabled'))) {
            $('#' + this.params.labelId).addClass('disabled').prop('disabled', true).tooltip('disable');
            $('#' + this.params.inputId).prop('disabled', true);
        }
    } else {
        if ($('#' + this.params.labelId).hasClass('disabled')) {
            $('#' + this.params.labelId).removeClass('disabled').prop('disabled', false).tooltip('enable');
            $('#' + this.params.inputId).prop('disabled', false);
        }
    }
};


/**
 * Enable Loader
 * 
 * @this {Table}
 */
Table.prototype.enableLoader = function () {
    $('#' + this.params.loaderId).addClass(this.params.loaderClass);
}


/**
 * Disable Loader
 * 
 * @this {Table}
 */
Table.prototype.disableLoader = function () {
    $('#' + this.params.loaderId).removeClass(this.params.loaderClass);
}


/**
 * Reset Table
 *
 * @this {Table}
 */
Table.prototype.reset = function () {
    this.hotSettings.colHeaders = false;
    this.hotSettings.rowHeaders = false;
    this.hotSettings.data = this.params.initialData;
    try {
        this.hot.destroy();
        this.hot = new Handsontable(this.hotElement, this.hotSettings);
    } catch (error) {
        Table.displayError(error, 'Cannot reset table');
        return;
    } finally {
        toggleLastTab();
    }
}


/**
 * Open file
 * 
 * @this {Table}
 * @param {Object} event - Event Object
 */
Table.prototype.openFile = function (event) {
    if (event.target.files.length !== 1) {
        alert('Please open one Excel file');
    } else {
        this.readFile(event.target.files[0]);
    }
};


/**
 * Read File, parse it with SheetJS, and display it with Hansontable
 * 
 * @this {Table}
 * @param {Object} inputFile - Input file
 */
Table.prototype.readFile = function (inputFile) {
    var reader = new FileReader();
    var that = this;

    reader.onloadstart = function () {
        that.enableLoader();
    }

    reader.onload = function () {

        // Read Excel file
        var json = [];
        var workbook;

        try {
            workbook = XLSX.read(new Uint8Array(reader.result), {
                type: 'array'
            });
        } catch (error) {
            Table.displayError(error, 'Cannot read Excel file');
            return;
        }

        // Table Headers
        try {
            json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
                header: 1,
                defval: ''
            });
        } catch (error) {
            Table.displayError(error, 'Input Error');
            return;
        }

        if ((typeof json[0] === 'undefined') || (json[0].includes('\u0000\u0000\u0000\u0000\u0000'))) {
            that.hotSettings.colHeaders = false;
            that.hotSettings.rowHeaders = false;
        } else {
            that.hotSettings.colHeaders = json[0];
            that.hotSettings.rowHeaders = true;
        }

        // Table Body
        try {
            json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
                raw: false,
                defval: ''
            });
        } catch (error) {
            Table.displayError(error, 'Input Error');
            return;

        }
        delete workbook;


        that.hotSettings.data = json;
        delete json;

        try {
            that.hot.destroy();
            that.hot = new Handsontable(that.hotElement, that.hotSettings);
        } catch (error) {
            Table.displayError(error, 'Cannot display file');
            return;
        }
    };

    reader.onloadend = function () {
        that.disableLoader();
        that.toggleResetButton();
        toggleLastTab();

    }

    reader.onerror = function (error) {
        Table.displayError(error, 'Input error');
        that.disableLoader();
        toggleLastTab();


    };
    this.enableLoader();
    reader.readAsArrayBuffer(inputFile);
}


/**
 * Ajax call when "Send" button is clicked
 * 
 * @this {Table}
 * @param {Event} event
 */
Table.prototype.send = function (event) {
    var that = this;
    this.hot.validateCells(function (valid) {
        if (!(that.isEmpty())) {
            if (valid) {
                $.ajax({
                    type: 'POST',
                    url: that.params.url,
                    data: {
                        "recup": that.hot.getSourceData()
                    },
                    beforeSend: function () {
                        that.enableLoader();
                    },
                    success: function (data, textStatus, jqXHR) {
                        that.isUploaded = true;
                        that.export2Excel(data, 'export');

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        that.isUploaded = false;
                    },
                    complete: function (qXHR, textStatus) {
                        that.disableLoader();
                    },
                    dataType: 'json',
                    timeout: 500000
                });
            } else {
                alert('Check your data');
            }
        }
    })
};

/**
 * Display an error message
 * 
 * @this {Table}
 * @param {Object} error - Error message
 * @param {string} msg - Message to display
 */
Table.displayError = function (error, msg) {
    console.log(error);
    alert(msg);
}