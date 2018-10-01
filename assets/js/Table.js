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
  this.htmlElement = document.getElementById(this.params.hotId);

  /** @type {Element} */
  this.htmlParentElement = document.getElementById(this.params.containerId);

  /** @type {Object} */
  this.spreadsheetSettings = Spreadsheet.getDefaultSettings(this.params.hotId);

  /** @type {Spreadsheet} */
  this.spreadsheet = new Spreadsheet(this.htmlElement, this.spreadsheetSettings);
}


/**
* Enable/Disable Send Button
*
* @this {Table}
*/
Table.prototype.toggleResetButton = function () {
  if (this.spreadsheet.isVoid()) {
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
  this.spreadsheetSettings.colHeaders = false;
  this.spreadsheetSettings.rowHeaders = false;
  this.spreadsheetSettings.data = this.params.initialData;
  try {
    this.spreadsheet.delete();
    this.spreadsheet = new Spreadsheet(this.htmlElement, this.spreadsheetSettings);
  } catch (error) {
    CustomError.displayError(error, 'Cannot reset table');
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
* Read File, parse it with SheetJS, and display it with Spreadsheet
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

    var json = ExcelJSON.excel2JSON(new Uint8Array(reader.result));

    if (typeof json[0] === 'undefined'){
      that.spreadsheetSettings.colHeaders = false;
      that.spreadsheetSettings.rowHeaders = false;
    } else {
      that.spreadsheetSettings.colHeaders = Object.keys(json[0]);
      that.spreadsheetSettings.rowHeaders = true;
    }

    that.spreadsheetSettings.data = json;
    delete json;

    try {
      that.spreadsheet.delete();
      that.spreadsheet = new Spreadsheet(that.htmlElement, that.spreadsheetSettings);
    } catch (error) {
      CustomError.displayError(error, 'Cannot display file');
      return;
    }
  };

  reader.onloadend = function () {
    that.disableLoader();
    that.toggleResetButton();
    toggleLastTab();
  }

  reader.onerror = function (error) {
    CustomError.displayError(error, 'Input error');
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
  return($.ajax({
    type: 'POST',
    url: that.params.url,
    data: {
      "recup": that.spreadsheet.getSourceData()
    },
    beforeSend: function () {
      that.enableLoader();
    },
    success: function (data, textStatus, jqXHR) {
      that.isUploaded = true;
      ExcelJSON.export2Excel(data, 'export');
    },
    error: function (jqXHR, textStatus, errorThrown) {
      that.isUploaded = false;
    },
    complete: function (qXHR, textStatus) {
      that.disableLoader();
    },
    dataType: 'json',
    timeout: 500000
  })
)
};
