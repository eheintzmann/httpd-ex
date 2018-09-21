function export2CSVFile(headers, items, fileTitle) {
  var workbook = XLSX.utils.book_new();
  var sheet = XLSX.utils.json_to_sheet(items);
  XLSX.utils.book_append_sheet(workbook, sheet, "main");
  XLSX.writeFile(workbook, fileTitle +".xlsx");
}