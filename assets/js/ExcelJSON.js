/**
 * Create new ExcelJSON Object
 *
 * @constructor
 * @this {ExcelJSON}
 */
ExcelJSON = function () {}


/**
* Excel file to JSON Object
*
* @this {ExcelJSON}
* @param {Object} arr - Uint8Array
* @returns json - JSON Object
*/
ExcelJSON.excel2JSON = function(arr) {

  // Read Excel file
  var json = [];
  var workbook;

  try {
    workbook = XLSX.read(arr, {
      type: 'array'
    });
  } catch (error) {
    CustomError.displayError(error, 'Cannot read Excel file');
    return;
  }

  // Table Headers
  try {
    json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      raw: false,
      defval: ''
    });
  } catch (error) {
    CustomError.displayError(error, 'Input Error');
    return;
  }
  return json;
}


/**
* export JSON to Excel file
*
* @this {ExcelJSON}
* @param {Object} items - JSON Object to convert
* @param {string} fileTitle - Title of the file to export
*/
ExcelJSON.export2Excel = function (items, fileTitle) {
  var workbook, sheet;
  try {
    workbook = XLSX.utils.book_new();
    sheet = XLSX.utils.json_to_sheet(items);
    XLSX.utils.book_append_sheet(workbook, sheet, 'main');
    XLSX.writeFile(workbook, fileTitle + '.xlsx', {
      bookType: 'xlsx'
    });
  } catch (error) {
    CustomError.displayError(error, 'Cannot export file');
    return
  } finally {
    delete sheet;
    delete workbook;
  }
}
