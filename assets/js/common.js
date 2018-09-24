const params = {
    hotId: 'hot1',
    containerId: 'table',
    inputId: 'uploadTable1',
    labelId: 'uploadTable1Label',
    loaderId: 'loader1',
    loaderClass: 'loader1',
    tableCount: 1
}

const params1 = {
    hotId: 'hot2',
    containerId: 'tables',
    inputId: null,
    labelId: null,
    loaderId: 'loader2',
    loaderClass: 'loader1',
    tableCount: 2
}

const params2 = {
    hotId: 'hot3',
    containerId: 'tables',
    inputId: null,
    labelId: null,
    loaderId: 'loader2',
    loaderClass: 'loader2',
    tableCount: 2
}

var table = new Table(params);

var tables = new Tables(new Table(params1), new Table(params2), 'uploadTable2Label', 'uploadTable2');

var count = 0;

function toggleLastTab() {
    if (!(table.isEmpty()) && (tables.isFull())) {
        $('#last-tab').removeClass('disabled');
    } else {
        $('#last-tab').addClass('disabled');
    }
};

// When document is loaded
$(function () {
    $('#page-loader').css('visibility', 'hidden')

    // Desactivate Send Buttons
    table.toggleUploadButton();
    tables.toggleUploadButton();

    /*// When windows is resized
    $(window).on('resize', function (event) {
        event.preventDefault();
        table.enableLoader();
        tables.table1.enableLoader();
        tables.table2.enableLoader();
        table.hot.updateSettings({
            width: table.calculateWidth(),
            height: table.calculateHeight()
        });
        tables.table1.hot.updateSettings({
            width: tables.table1.calculateWidth(),
            height: tables.table1.calculateHeight()
        });
        tables.table2.hot.updateSettings({
            width: tables.table2.calculateWidth(),
            height: tables.table2.calculateHeight()
        });
    });*/
});