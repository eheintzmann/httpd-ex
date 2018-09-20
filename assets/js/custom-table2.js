hot2Data = [];
var hot2Element = document.querySelector('#hot2');
var hot2ElementContainer = hot2Element.parentNode;

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
  //width: 806,
  autoWrapRow: true,
  //height: 487,
  //maxRows: 22,
  contextMenu: true,
  //rowHeaders: true,
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
  autoColumnSize: {
    useHeaders: true,
  },
  //colWidths: ',
  minRows: 1,
  //minSpareRows: 1,  
}

var hot2 = new Handsontable(hot2Element, hot2Settings);
//const plugin = hot2.getPlugin('autoColumnSize');

/*Handsontable.hooks.add('beforeRender', function(changes) {
	console.log('Render detected');
	plugin.clearCache();
}, hot2);
*/

// Fix to display table in tabs
/*$('#table-tab').on('shown.bs.tab', function (e) {
  if (!(typeof hot2 === 'undefined')) {
    hot2.render();
  }
})*/

$('#uploadTable2').click(function (e) {
  hot2.validateCells(function (valid) {
    if (valid) {
      dataObject = hot2.getSourceData();
      if (dataObject.length === 0) {
        alert('Please fill the table first');
      } else {
        $.ajax({
          type: "POST",
          url: "http://php-back.a3c1.starter-us-west-1.openshiftapps.com/index.php",
          data: {
            "recup": dataObject
          },
          success: function (data, textStatus, jqXHR) {
            export2CSVFile(null, data, "export");
          },
          error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus)
          },
          dataType: "json"
        });
      }
    } else {
      alert('Check your data');
    }
  });
})

var openFile2 = function (event) {
  var input = event.target;
  var reader = new FileReader();

  reader.onload = function () {
    hot2.destroy();
    hot2Settings.colHeaders = csv2headers(reader.result);
    hot2Settings.data =csv2JSON(reader.result);
    hot2 = new Handsontable(hot2Element, hot2Settings);
  };
  reader.readAsText(input.files[0]);
};