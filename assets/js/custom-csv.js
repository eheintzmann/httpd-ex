function JSON2csv(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';
 
  // Headers first
  var headers = '';
  for (var index in array[0]) {
    if (headers != '') {
      headers += ','
    }
    headers += index
  }
  str += headers + '\r\n';

  // Body
  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') {
        line += ','
      }
      line += array[i][index];
    }
    str += line + '\r\n';
  }

  return str;
}

function export2CSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  // Convert JSON to CSV
  var csv = this.JSON2csv(jsonObject);
  
  // Export CSV to file
  var exportedFilename = fileTitle + '.csv' || 'export.csv';
  var blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  });

  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilename);
  } else {
    var link = document.createElement("a");

    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function csv2JSON(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    if (currentline != '') {
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
  }
  return result;
}

var openFile = function (event) {
  var input = event.target;
  var reader = new FileReader();

  reader.onload = function () {
    
    hot.loadData(csv2JSON(reader.result));
    /*$.ajax({
      type: "POST",
      url: "http://localhost/Phpstorm/DX/ajax.php",
      data: {
        "recup": csv2JSON(reader.result)
      },
      success: function (data, textStatus, jqXHR) {
        
        export2CSVFile(null, data, "export");
        console.log("Succes");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert(textStatus)
      },
      dataType: "json"
    });*/
  };
  reader.readAsText(input.files[0]);
};