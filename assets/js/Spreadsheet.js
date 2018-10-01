
/**
 * Create new Spreadsheet Object
 *
 * @constructor
 * @this {Spreadsheet}
 */
Spreadsheet = function (htmlElement, settings) {
  $.extend(this, Handsontable.call(this, htmlElement, settings));
}


/**
 * Get defaults settings for Spreadsheet
 *
 * @this {Spreadsheet}
 * @param {string} id - Id of tables
 * @return {Object} - settings
 */
Spreadsheet.getDefaultSettings = function (id) {
  return {
    data: [],
    /*columns: [{
    data: 'Year',
    type: 'numeric',
    allowEmpty: false,
    className: 'htCenter'}],*/
    stretchH: 'all',
    width: Spreadsheet.calculateWidth(id),
    height: Spreadsheet.calculateHeight(id),
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
    'Honda',],*/
    manualRowResize: true,
    manualColumnResize: true,
    columnSorting: true,
    sortIndicator: true
    /*autoColumnSize: {useHeaders: true},
    minRows: 1,
    minSpareRows: 1,*/
  }
}


/**
* Calculate optimal Width for the Table
*
* @this {Spreadsheet}
* @param {string} id - Id of tables
* @return {number} - Width of the Table
*/
Spreadsheet.calculateWidth = function (id) {
  //return ((parseInt(Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) - parseInt($('#' + this.params.containerId).offset().left)) - 15);
  return ($(window).width() - 300);
};


/**
* Calculate optimal Height for the Table
*
* @this {Spreadsheet}
* @param {string} id - Id of tables
* @return {number} - Height of the Table
*/
Spreadsheet.calculateHeight = function (id) {
  var height = 0;
  if (id === 'hot1') {
    height = $(window).height() - 200;
  } else {
    height = ($(window).height() - 300) / 2;
  }
  return height;
};


/**
* Check if Spreadsheet is empty
*
* @this {Spreadsheet}
* @returns {boolean} - return true is Spreadshet is empty, false if not
*/
Spreadsheet.prototype.isVoid = function () {
  if ((this.isDestroyed) || ((this.countSourceRows() === 0) && (this.countSourceCols() === 0) )) {
    return true;
  } else {
    return false;
  }
}


/**
* Destroy instance of Spreadsheet
* @this {Spreadsheet}
*/
Spreadsheet.prototype.delete = function () {
  if (!(this.isDestroyed)) {
    this.destroy();
  }
}
