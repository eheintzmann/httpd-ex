/*var dataObject = [{
    Year: 2017,
    Ford: 10,
    Tesla: 11,
    Toyota: 12,
    Honda: 13
  },
  {
    Year: 2018,
    Ford: 20,
    Tesla: 11,
    Toyota: 14,
    Honda: 13
  },
  {
    Year: 2019,
    Ford: 30,
    Tesla: 15,
    Toyota: 12,
    Honda: 13
  }
];*/
var hotElement = document.querySelector('#hot');
var hotElementContainer = hotElement.parentNode;

var hotSettings = {
  data: [],
  columns: [{
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
  ],
  stretchH: 'all',
  //width: 806,
  autoWrapRow: true,
  //height: 487,
  //maxRows: 22,
  contextMenu: true,
  //rowHeaders: true,
  colHeaders: [
    'Year',
    'Ford',
    'Tesla',
    'Toyota',
    'Honda',
  ],
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
var hot = new Handsontable(hotElement, hotSettings);
// hot.loadData(dataObject)

const plugin = hot.getPlugin('autoColumnSize');

Handsontable.hooks.add('beforeRender', function(changes) {
	alert('change detected');
	plugin.clearCache();
}, hot);


// Fix to display table in tabs
$('#table-tab').on('shown.bs.tab', function (e) {
  hot.render();
})

$('#start').click(function (e) {
	hot.validateCells( function (valid) {
		if (valid) {
			dataObject = hot.getSourceData();
			console.log(dataObject);
			if (dataObject.length === 0) {
				alert('Please fill the table first');
			} else {
				export2CSVFile(null, dataObject, 'export');
			}
		} else {
			alert('Check your data');
		}
	});
})
