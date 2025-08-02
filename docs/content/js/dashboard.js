/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5425438596491228, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Click Confirm-81"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "Click On Sign in"], "isController": true}, {"data": [0.25925925925925924, 500, 1500, "Get Home Page-31"], "isController": false}, {"data": [0.1583044982698962, 500, 1500, "Get Home Page-4"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "Click on Add to Cart"], "isController": true}, {"data": [0.717391304347826, 500, 1500, "Click on ItemID-66"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "Enter Credentials and Login-47"], "isController": false}, {"data": [0.75, 500, 1500, "Enter Credentials and Login-47-1"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "Enter Credentials and Login-48"], "isController": false}, {"data": [1.0, 500, 1500, "Click Continue"], "isController": true}, {"data": [0.7939068100358423, 500, 1500, "Get Home Page-7"], "isController": false}, {"data": [0.5335144927536232, 500, 1500, "Get Home Page-9"], "isController": false}, {"data": [0.7670940170940171, 500, 1500, "Click on Category"], "isController": true}, {"data": [0.7509124087591241, 500, 1500, "Type and Search"], "isController": true}, {"data": [0.2692307692307692, 500, 1500, "Enter Credentials and Login"], "isController": true}, {"data": [0.06, 500, 1500, "Get Home Page"], "isController": true}, {"data": [0.5, 500, 1500, "Proceed to CHeckout-79"], "isController": false}, {"data": [0.8269230769230769, 500, 1500, "Click on Caterogy"], "isController": true}, {"data": [0.8269230769230769, 500, 1500, "Click on Caterogy-49"], "isController": false}, {"data": [0.7403846153846154, 500, 1500, "Type and Search-22"], "isController": false}, {"data": [1.0, 500, 1500, "Click Continue-80"], "isController": false}, {"data": [0.16182572614107885, 500, 1500, "Get Home Page-26"], "isController": false}, {"data": [0.76431718061674, 500, 1500, "Click on Category-28"], "isController": false}, {"data": [0.7604651162790698, 500, 1500, "Click on ItemID-30"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "Enter Credentials and Login-47-0"], "isController": false}, {"data": [0.7931818181818182, 500, 1500, "Click on ProductID-29"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "Sign Out-69"], "isController": false}, {"data": [0.8269230769230769, 500, 1500, "Click On Sign in-37"], "isController": false}, {"data": [0.45, 500, 1500, "Sign Out-68"], "isController": false}, {"data": [0.75, 500, 1500, "Proceed to Checkout"], "isController": true}, {"data": [0.7045454545454546, 500, 1500, "Click on Add to Cart-67"], "isController": false}, {"data": [1.0, 500, 1500, "Click Confirm"], "isController": true}, {"data": [0.6875, 500, 1500, "Click on ProductID-64"], "isController": false}, {"data": [0.775, 500, 1500, "Sign Out-68-0"], "isController": false}, {"data": [0.7896825396825397, 500, 1500, "Click on ProductID"], "isController": true}, {"data": [0.7602459016393442, 500, 1500, "Click on ItemID"], "isController": true}, {"data": [0.21428571428571427, 500, 1500, "Sign Out"], "isController": true}, {"data": [0.675, 500, 1500, "Sign Out-68-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3545, 0, 0.0, 872.9207334273634, 0, 5278, 585.0, 1913.2000000000003, 2127.0, 3163.2999999999984, 35.66003762159117, 197.14151508635865, 22.381976324928832], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Click Confirm-81", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 16.92179890422078, 1.9689782873376624], "isController": false}, {"data": ["Click On Sign in", 27, 0, 0.0, 467.3703703703703, 0, 1401, 453.0, 579.4, 1103.3999999999983, 1401.0, 0.3240712956850507, 1.24806363650003, 0.18650978215207345], "isController": true}, {"data": ["Get Home Page-31", 27, 0, 0.0, 1648.6296296296296, 1101, 3553, 1482.0, 2150.2, 3032.199999999997, 3553.0, 0.3192923535394149, 1.6224458459473523, 0.17471694215486863], "isController": false}, {"data": ["Get Home Page-4", 578, 0, 0.0, 1789.4359861591688, 926, 5278, 1813.5, 2215.0, 2664.0, 3602.8900000000003, 5.851149983803045, 8.296747828595723, 2.8707580269831143], "isController": false}, {"data": ["Click on Add to Cart", 23, 0, 0.0, 552.3913043478261, 0, 1852, 508.0, 985.4000000000008, 1726.1999999999982, 1852.0, 0.3159731285461115, 1.4184982518443214, 0.19332425196796307], "isController": true}, {"data": ["Click on ItemID-66", 23, 0, 0.0, 660.1739130434781, 248, 2137, 497.0, 1679.4000000000008, 2084.999999999999, 2137.0, 0.3158342831248369, 1.2170589348488803, 0.20223746704337917], "isController": false}, {"data": ["Enter Credentials and Login-47", 26, 0, 0.0, 1015.2307692307692, 560, 2326, 944.5, 1470.3000000000004, 2134.5499999999993, 2326.0, 0.3122598001537279, 1.6387540683848962, 0.5049826455611068], "isController": false}, {"data": ["Enter Credentials and Login-47-1", 26, 0, 0.0, 518.0769230769231, 268, 1701, 495.0, 661.3000000000001, 1349.5999999999985, 1701.0, 0.3134304967873374, 1.5744985112051402, 0.21425912866321892], "isController": false}, {"data": ["Enter Credentials and Login-48", 26, 0, 0.0, 510.8076923076922, 296, 2139, 456.5, 607.4000000000001, 1631.849999999998, 2139.0, 0.313275658481336, 1.5737206906523362, 0.18723115526423598], "isController": false}, {"data": ["Click Continue", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 9.686331463675213, 2.5999933226495724], "isController": true}, {"data": ["Get Home Page-7", 558, 0, 0.0, 485.3512544802869, 248, 2365, 475.0, 619.0, 679.4499999999996, 1329.889999999999, 5.942871748993546, 29.372030394647155, 3.3208470955279354], "isController": false}, {"data": ["Get Home Page-9", 552, 0, 0.0, 724.5036231884054, 233, 1642, 737.5, 900.4, 969.35, 1216.8100000000006, 5.912596401028277, 95.79099052056556, 3.1872589974293057], "isController": false}, {"data": ["Click on Category", 234, 0, 0.0, 510.7777777777776, 0, 2541, 486.0, 723.0, 996.25, 1414.0500000000004, 2.4939516343909536, 9.036848568375841, 1.4911086361068775], "isController": true}, {"data": ["Type and Search", 548, 0, 0.0, 532.04197080292, 0, 4909, 491.5, 670.0, 1052.0499999999968, 2703.8799999999937, 5.898434977288872, 19.506401295395346, 5.290924092631261], "isController": true}, {"data": ["Enter Credentials and Login", 26, 0, 0.0, 1526.0384615384617, 909, 3104, 1485.0, 2307.9000000000005, 2958.3999999999996, 3104.0, 0.31086348310576534, 3.1930294094789446, 0.6885140426600349], "isController": true}, {"data": ["Get Home Page", 850, 0, 0.0, 2583.001176470591, 0, 6328, 2524.5, 3583.9, 3839.4499999999985, 4859.84, 8.584904707557746, 139.86663058586925, 10.526203764606963], "isController": true}, {"data": ["Proceed to CHeckout-79", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 8.705716586151368, 1.0127314814814814], "isController": false}, {"data": ["Click on Caterogy", 26, 0, 0.0, 490.69230769230774, 323, 1344, 465.5, 623.1, 1093.399999999999, 1344.0, 0.31402103940964043, 1.203574329383915, 0.19346781510803532], "isController": true}, {"data": ["Click on Caterogy-49", 26, 0, 0.0, 490.69230769230774, 323, 1344, 465.5, 623.1, 1093.399999999999, 1344.0, 0.31416522674271075, 1.2041269680638964, 0.1935566486726519], "isController": false}, {"data": ["Type and Search-22", 520, 0, 0.0, 536.0057692307694, 254, 3131, 501.5, 669.9000000000001, 947.4499999999987, 1868.7599999999984, 5.882685672266531, 20.501857783245658, 5.560932108716557], "isController": false}, {"data": ["Click Continue-80", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 9.686331463675213, 2.5999933226495724], "isController": false}, {"data": ["Get Home Page-26", 241, 0, 0.0, 1775.0912863070535, 971, 5135, 1769.0, 2205.8, 2494.6999999999975, 3660.7399999999984, 2.499585131098573, 12.349065102654125, 1.3947941083430138], "isController": false}, {"data": ["Click on Category-28", 227, 0, 0.0, 517.4977973568277, 252, 1434, 489.0, 721.8000000000001, 988.3999999999999, 1370.28, 2.421023442332715, 9.043113314829036, 1.4921423391139268], "isController": false}, {"data": ["Click on ItemID-30", 215, 0, 0.0, 508.12093023255846, 240, 2107, 492.0, 643.0, 675.3999999999999, 1835.8400000000015, 2.4495004158454194, 9.11081532760644, 1.5686437778417053], "isController": false}, {"data": ["Enter Credentials and Login-47-0", 26, 0, 0.0, 496.5769230769231, 286, 1146, 468.0, 732.0, 1018.2499999999995, 1146.0, 0.318775900541919, 0.0716000557857826, 0.29760718839655725], "isController": false}, {"data": ["Click on ProductID-29", 220, 0, 0.0, 497.8636363636363, 275, 1350, 486.5, 642.9, 740.8999999999997, 1274.5399999999997, 2.399415415153399, 9.439156244205957, 1.551653210854083], "isController": false}, {"data": ["Sign Out-69", 19, 0, 0.0, 525.0526315789474, 366, 1258, 497.0, 626.0, 1258.0, 1258.0, 0.31065548306927615, 1.5086813645542094, 0.1917326809568189], "isController": false}, {"data": ["Click On Sign in-37", 26, 0, 0.0, 485.3461538461538, 282, 1401, 455.5, 589.1, 1140.599999999999, 1401.0, 0.31951237496006096, 1.2778334833607787, 0.19095856784722395], "isController": false}, {"data": ["Sign Out-68", 20, 0, 0.0, 1036.1, 605, 1868, 1008.0, 1763.7000000000012, 1865.45, 1868.0, 0.30491523356506894, 1.5716236355043298, 0.37905966047688744], "isController": false}, {"data": ["Proceed to Checkout", 2, 0, 0.0, 310.5, 0, 621, 310.5, 621.0, 621.0, 621.0, 0.04484304932735426, 0.12121636771300448, 0.014101036995515695], "isController": true}, {"data": ["Click on Add to Cart-67", 22, 0, 0.0, 577.5000000000001, 301, 1852, 514.0, 1044.7999999999995, 1757.6499999999987, 1852.0, 0.30223516643541093, 1.4184982518443214, 0.19332425196796307], "isController": false}, {"data": ["Click Confirm", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 16.92179890422078, 1.9689782873376624], "isController": true}, {"data": ["Click on ProductID-64", 24, 0, 0.0, 557.9166666666667, 300, 1190, 529.0, 918.5, 1170.75, 1190.0, 0.30903542318538263, 1.265717348476069, 0.1998871698793474], "isController": false}, {"data": ["Sign Out-68-0", 20, 0, 0.0, 545.95, 297, 1305, 468.5, 1228.1000000000013, 1304.2, 1305.0, 0.30795288320886904, 0.06916910462699208, 0.19277128724305184], "isController": false}, {"data": ["Click on ProductID", 252, 0, 0.0, 487.77777777777794, 0, 1350, 486.0, 654.4000000000001, 754.5999999999998, 1266.22, 2.6837632324437153, 10.263942489456644, 1.6804720947198024], "isController": true}, {"data": ["Click on ItemID", 244, 0, 0.0, 518.1967213114755, 0, 2648, 491.0, 652.0, 919.25, 2123.5000000000005, 2.674177745142093, 9.73568905628377, 1.6703978318884738], "isController": true}, {"data": ["Sign Out", 21, 0, 0.0, 1557.3333333333335, 0, 3112, 1508.0, 2382.0, 3042.099999999999, 3112.0, 0.3033892918027103, 2.8223641023649915, 0.5286174658325868], "isController": true}, {"data": ["Sign Out-68-1", 20, 0, 0.0, 489.85, 307, 646, 522.5, 638.1000000000001, 645.8, 646.0, 0.30766864087377893, 1.5167102530574572, 0.18988923928928544], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3545, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
