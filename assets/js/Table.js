/**
 * Create new Table Object
 * 
 * @constructor
 * @this {Table}
 * @param {Object} params - Arguments of the table constructor
 */
Table = function (params) {

    const {
        hotId,
        containerId,
        inputId,
        labelId,
        loaderId,
        loaderClass,
        tableCount
    } = params;

    /** @type {Object} */
    this.params = params;

    /** @type {Element} */
    this.hotElement = document.getElementById(this.params.hotId);

    /** @type {Element} */
    this.hotParentElement = document.getElementById(this.params.containerId);

    /** @type {Object} */
    this.hotSettings = {
        data: [],
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
    //return (((parseInt(Math.max(document.documentElement.clientHeight, window.innerHeight || 0)) - parseInt($('#' + this.params.containerId).offset().top)) / parseInt(this.params.tableCount)) - 15);/
    return (($(window).height() - 200) / this.params.tableCount);
    //return 500 / this.params.tableCount;
};


/**
 * export JSON to excel file
 * 
 * @this {Table} 
 * @param {Object} items - JSON Object to convert
 * @param {string} fileTitle - Title of the file to export
 */
Table.prototype.export2Excel = function (items, fileTitle) {
    var workbook = XLSX.utils.book_new();
    var sheet = XLSX.utils.json_to_sheet(items);
    XLSX.utils.book_append_sheet(workbook, sheet, 'main');
    XLSX.writeFile(workbook, fileTitle + '.xlsx', {
        bookType: 'xlsx'
    });
}


/**
 * Enable/Disable Send Button
 * 
 * @this {Table}
 */
Table.prototype.toggleUploadButton = function () {
    if ((this.hot.isDestroyed) || ((this.hot.countCols() === 0) && (this.hot.countRows() === 0))) {
        $('#' + this.params.labelId).addClass('disabled').prop('disabled', true).tooltip('disable');
        $('#' + this.params.inputId).prop('disabled', true);

    } else {
        $('#' + this.params.labelId).removeClass('disabled').prop('disabled', false).tooltip('enable');
        $('#' + this.params.inputId).prop('disabled', false);
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
 * Open file
 * 
 * @this {Table}
 * @param {Object} event - Event Object
 */
Table.prototype.openFile = function (event) {
    if (event.target.files.length !== 1) {
        alert('Please open 1 Excel file');
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

        // Delete current HandsOnTable table
        if (!(that.hot.isDestroyed)) {
            that.hot.clear();
        }
    }

    reader.onload = function () {

        // Read Excel file
        try {
            var workbook = XLSX.read(reader.result, {
                type: 'binary'
            });
        } catch (error) {
            Table.displayInputError(error);
            return;
        }

        // Table Headers
        try {
            var json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
                header: 1,
                defval: ''
            });
        } catch (error) {
            Table.displayInputError(error);
            return;

        }
        that.hotSettings.colHeaders = json[0];

        // Table Body
        try {
            json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
                raw: false,
                defval: ''
            });
        } catch (error) {
            Table.displayInputError(error);
            return;

        }
        delete workbook;
        that.hotSettings.data = json;
        delete json;

        try {
            that.hot.updateSettings(that.hotSettings);
            that.hot.loadData(that.hotSettings.data );
        } catch (error) {
            Table.displayInputError(error);
            return;
        }
    };

    reader.onloadend = function () {
        that.disableLoader();
        that.toggleUploadButton();
    }

    reader.onerror = function (error) {
        Table.displayInputError(error);
    };
    reader.readAsBinaryString(inputFile)
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
        if ((that.hot.countCols() !== 0) && (that.hot.countRows() !== 0)) {
            if (valid) {
                $.ajax({
                    type: 'POST',
                    url: 'http://php-back.a3c1.starter-us-west-1.openshiftapps.com/',
                    data: {
                        "recup": that.hot.getSourceData()
                    },
                    beforeSend: function () {
                        that.enableLoader();
                    },
                    success: function (data, textStatus, jqXHR) {
                        that.export2Excel(data, 'export');
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
 * @param {string} error - Error message
 */
Table.displayInputError = function (error) {
    console.log(error);
    alert('Input Error');
}