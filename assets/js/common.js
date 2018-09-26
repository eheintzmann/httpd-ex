const params1 = {
    initialData: [],
    hotId: 'hot1',
    containerId: 'hot1',
    inputId: 'uploadTable1',
    labelId: 'uploadTable1Label',
    loaderId: 'loader1',
    loaderClass: 'small-loader',
    tableCount: 1,
    url: 'http://php-back.a3c1.starter-us-west-1.openshiftapps.com/'
}

const params2 = {
    initialData: [],
    hotId: 'hot2',
    containerId: 'hot2',
    inputId: 'uploadTable2',
    labelId: 'uploadTable2Label',
    loaderId: 'loader2',
    loaderClass: 'small-loader',
    tableCount: 2,
    url: 'http://php-back.a3c1.starter-us-west-1.openshiftapps.com/'
}

const params3 = {
    initialData: [],
    hotId: 'hot3',
    containerId: 'hot3',
    inputId: 'uploadTable3',
    labelId: 'uploadTable3Label',
    loaderId: 'loader3',
    loaderClass: 'small-loader',
    tableCount: 2,
    url: 'http://php-back.a3c1.starter-us-west-1.openshiftapps.com/'
}

var table1 = new Table(params1);
var table2 = new Table(params2);
var table3 = new Table(params3);


function toggleLastTab() {
    if (table1.isEmpty() || table2.isEmpty() || table3.isEmpty()) {
        $('#last-tab').addClass('disabled');
    } else {
        $('#last-tab').removeClass('disabled');
    }
};

// When document is loaded
$(function () {
    $('#page-loader').css('visibility', 'hidden')

    // Desactivate Send Buttons
    table1.toggleResetButton();
    table2.toggleResetButton();
    table3.toggleResetButton();

    /*// When windows is resized
    $(window).on('resize', function (event) {
        event.preventDefault();
        table1.enableLoader();
        tables.table1.enableLoader();
        tables.table2.enableLoader();
        table1.hot.updateSettings({
            width: table1.calculateWidth(),
            height: table1.calculateHeight()
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