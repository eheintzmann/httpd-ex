/**
 * Read file
 *
 * @param {Object} event - Event Object
 */
var openFile2 = function (event) {
  var input = event.target;
  
  if (input.files[0]) {
  var reader1 = new FileReader();

  reader1.onload = function () {
    // Delete current HandsOnTable table
    hot2.destroy();

    // Read Excel fileaccept="application/vnd.ms-excel"
    var workbook = XLSX.read(reader1.result, {
      type: 'binary'
    });

    // Table Headers
    var json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      header: 1,
      defval: ''
    });
    hot2Settings.colHeaders = json[0];

    // Table Body
    var jsonxls2 = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      raw: false,
      defval: ''
    });
    hot2Settings.data = jsonxls2;
    hot2 = new Handsontable(hot2Element, hot2Settings);

    // Activate Send Button
    toggleUploadButton(hot2, hot3);
	$('#loader2').removeClass('loader');
  };
  reader1.onloadstart = function () {
    $('#loader2').addClass('loader');

  };
   reader1.onerror = function (err) {
    alert('Input error');
  	$('#loader2').removeClass('loader');
  };
  
  reader1.readAsBinaryString(input.files[0]);
  }
  if (input.files[1]) {
  var reader2 = new FileReader();
  reader2.onload = function () {
    // Delete current HandsOnTable table
    hot3.destroy();

    // Read Excel file
    var workbook = XLSX.read(reader2.result, {
      type: 'binary'
    });

    // Table Headers
    var json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      header: 1,
      defval: ''
    });
    hot3Settings.colHeaders = json[0];

    // Table Body
    var jsonxls2 = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      raw: false,
      defval: ''
    });
    hot3Settings.data = jsonxls2;
    hot3 = new Handsontable(hot3Element, hot3Settings);

    // Activate Send Button
    toggleUploadButton(hot2, hot3);
  };
  reader2.onerror = function (err) {
    alert('Input error');
  };
  reader2.readAsBinaryString(input.files[1]);
   }

};

/**
 * Activate or Desactivate Send Button
 * 
 * @param {Object} hot2 - Handsontable Object
 * @param {Object} hot3 - Handsontable Object
 */
function toggleUploadButton(h1, h2) {
  if ( (h1) && (h2) && (h1.countCols() !== 0) && (h1.countRows() !== 0) && (h2.countCols() !== 0) && (h2.countRows() !== 0)) {
    $('#uploadTable2Label').removeClass('disabled').prop('disabled', false).tooltip('enable');
    $('#uploadTable2').prop('disabled', false);
  } else {
    $('#uploadTable2Label').addClass('disabled').prop('disabled', true).tooltip('disable');
    $('#uploadTable2').prop('disabled', true);
  }
}

/** @type {Object[]} */
var hot2Data = [];

/** @type {Object[]} */
var hot3Data = [];


/** @type {Element} */
var hot2Element = document.querySelector('#hot2');

/** @type {Element} */
var hot3Element = document.querySelector('#hot3');

/** @type {Object} */
var hot2Settings = {
  data: hot2Data,
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
    var element = document.getElementById('tables');
    var positionInfo = element.getBoundingClientRect();
    return (positionInfo.width);
  },
  autoWrapRow: true,
  height: function () {
    var element = document.getElementById('tables');
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

/** @type {Object} */
var hot3Settings = {
  data: hot3Data,
  stretchH: 'all',
  width: function () {
    var element = document.getElementById('tables');
    var positionInfo = element.getBoundingClientRect();
    return (positionInfo.width);
  },
  autoWrapRow: true,
  height: function () {
    var element = document.getElementById('tables');
    var positionInfo = element.getBoundingClientRect();
    return (positionInfo.height);
  },
  contextMenu: true,
  rowHeaders: true,
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
var hot2 = new Handsontable(hot2Element, hot2Settings);

/** @type {Handsontable} */
var hot3 = new Handsontable(hot3Element, hot3Settings);


// Desactivate Send Button
toggleUploadButton(hot2, hot3);

// Ajax call when "Send" button is clicked
$('#uploadTable2').click(function (e) {
  hot2.validateCells(function (valid) {
    if ((hot2.countCols() !== 0) && (hot2.countRows() !== 0)  && (hot3.countCols() !== 0) && (hot2.countRows() !== 0) ) {
      if (valid) {
        $.ajax({
          type: 'POST',
          url: 'http://php-back.a3c1.starter-us-west-1.openshiftapps.com/',
          data: {
            "recup": hot2.getSourceData()
          },
          beforeSend: function () {
            $('#loader2').addClass('loader');
          },
          success: function (data, textStatus, jqXHR) {
            export2Excel(data, 'export2');
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus)
          },
          complete: function () {
            $('#loader2').removeClass('loader');
          },
          dataType: 'json',
          timeout: 100000
        });
      } else {
        alert('Check your data');
      }
    }
  });
  hot3.validateCells(function (valid) {
  if ((hot2.countCols() !== 0) && (hot2.countRows() !== 0)  && (hot3.countCols() !== 0) && (hot2.countRows() !== 0) ) {
      if (valid) {
        $.ajax({
          type: 'POST',
          url: 'http://php-back.a3c1.starter-us-west-1.openshiftapps.com/',
          data: {
            "recup": hot3.getSourceData()
          },
          beforeSend: function () {
            $('#loader2').addClass('loader');
          },
          success: function (data, textStatus, jqXHR) {
            export2Excel(data, 'export3');
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus)
          },
          complete: function () {
            $('#loader2').removeClass('loader');
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