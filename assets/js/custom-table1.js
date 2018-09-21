/**
 * Read file
 *
 * @param {Object} event - Event Object
 */
var openFile1 = function (event) {
  var input = event.target;
  var reader = new FileReader();

  reader.onload = function () {
    // Delete current HandsOnTable table
    hot1.destroy();

    // Read Excel file
    var workbook = XLSX.read(reader.result, {
      type: 'binary'
    });

    // Table Headers
    var json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      header: 1,
      defval: ''
    });
    hot1Settings.colHeaders = json[0];

    // Table Body
    var jsonxls2 = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      raw: false,
      defval: ''
    });
    hot1Settings.data = jsonxls2;
    hot1 = new Handsontable(hot1Element, hot1Settings);

    // Activate Send Button
    toggleUploadButton(hot1);
  };
  reader.onerror = function (err) {
    alert('Input error');
  };
  reader.readAsBinaryString(input.files[0]);
};

/**
 * Activate or Desactivate Send Button
 * 
 * @param {Object} hot1 - Handsontable Object
 */
function toggleUploadButton(hot1) {
  if ((hot1.countCols() !== 0) && (hot1.countRows() !== 0)) {
    $('#uploadTable1Label').removeClass('disabled').prop('disabled', false).tooltip('enable');
    $('#uploadTable1').prop('disabled', false);
  } else {
    $('#uploadTable1Label').addClass('disabled').prop('disabled', true).tooltip('disable');
    $('#uploadTable1').prop('disabled', true);
  }
}

/** @type {Object[]} */
var hot1Data = [];

/** @type {Element} */
var hot1Element = document.querySelector('#hot1');

/** @type {Object} */
var hot1Settings = {
  data: hot1Data,
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
  width: function () {
    var element = document.getElementById('table1');
    var positionInfo = element.getBoundingClientRect();
    return (positionInfo.width);
  },
  autoWrapRow: true,
  height: function () {
    var element = document.getElementById('table1');
    var positionInfo = element.getBoundingClientRect();
    return (positionInfo.height);
  },
  //maxRows: 22,
  contextMenu: true,
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
var hot1 = new Handsontable(hot1Element, hot1Settings);

// Desactivate Send Button
toggleUploadButton(hot1);

// Ajax call when "Send" button is clicked
$('#uploadTable1').click(function (e) {
  hot1.validateCells(function (valid) {
    if ((hot1.countCols() !== 0) && (hot1.countRows() !== 0)) {
      if (valid) {
        $.ajax({
          type: 'POST',
          url: 'http://php-back.a3c1.starter-us-west-1.openshiftapps.com/',
          data: {
            "recup": hot1.getSourceData()
          },
          beforeSend: function () {
            $('#loader1').addClass('loader');
          },
          success: function (data, textStatus, jqXHR) {
            console.log(data);
            export2CSVFile(null, data, 'export');
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus)
          },
          complete: function () {
            $('#loader1').removeClass('loader');
          },
          dataType: 'json',
          timeout: 100000
        });
      } else {
        alert('Check your data');
      }
    }
  });
})