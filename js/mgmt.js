function afterChange(changes, source) {
    if (source != "loadData") {
        saveStorage();
    }
}
let nestedHeaders = [
    [
        { label: '部隊', rowspan: 2, class: 'htMiddle' },
        { label: 'キャラクター', rowspan: 2, class: 'htMiddle' },
        { label: 'CLv', rowspan: 2, class: 'htMiddle' },
        { label: '転生<br>回数', rowspan: 2, class: 'htMiddle' },
        { label: 'スキル', rowspan: 2, class: 'htMiddle' },
        { label: 'ジェネ<br>ライズ', rowspan: 2, class: 'htMiddle' },
        { label: 'エグゾウォッチャー', colspan: 5, class: 'htMiddle' },
        { label: 'レクタス/シニスター', colspan: 5, class: 'htMiddle' },
    ],
    [
        { label: 'R', },
        { label: 'B', },
        { label: 'Y', },
        { label: 'W', },
        { label: 'P', },
        { label: 'R', },
        { label: 'B', },
        { label: 'Y', },
        { label: 'W', },
        { label: 'P', },
    ]
];

let header = getHeaderHtml(nestedHeaders);
function afterGetColHeader(col, TH) {
    $('table.htCore thead').empty();
    $('table.htCore thead').prepend(header);
}
function getHeaderHtml(nestedHeaders) {
    let headerHtml = [''];
    for (const row of nestedHeaders) {
        headerHtml.push('<tr>');
        for (const [index, value] of row.entries()) {
            if (typeof value == 'object') {
                if (value.label != undefined) {
                    headerHtml.push('<th class=');
                    headerHtml.push(value.class != undefined ? '"' + value.class + '"' : '""');
                    headerHtml.push(value.colspan != undefined ? ' colspan="' + value.colspan + '"' : "");
                    headerHtml.push(value.rowspan != undefined ? ' rowspan="' + value.rowspan + '"' : "");
                    headerHtml.push(value.style != undefined ? ' style="' + value.style + '"' : "");
                    headerHtml.push('>');
                    headerHtml.push(getThHtml(value.label));
                }
            }
            else {
                headerHtml.push('<th class="">');
                headerHtml.push(getThHtml(value));
            }
        }

        headerHtml.push('</tr>');
    }
    return headerHtml.join('');
}
function getThHtml(text) {
    return '<div class="relative"><span class="colHeader">' + text + '</span></div></th>';
}
function createNewCharaData() {
    let data = [];
    for (let i = 1; i < chara_full_name.length; i++) {
        let chara = {};
        chara["troop"] = troop_name[Math.floor((i - 1) / 6)];
        chara["name"] = chara_full_name[i];
        chara["lv"] = 120;
        chara["rein"] = 0;
        chara["skill"] = "";
        chara["generate"] = 0;
        chara["Exo_R"] = 0;
        chara["Exo_B"] = 0;
        chara["Exo_Y"] = 0;
        chara["Exo_W"] = 0;
        chara["Exo_P"] = 0;
        chara["Rectus_R"] = 0;
        chara["Rectus_B"] = 0;
        chara["Rectus_Y"] = 0;
        chara["Rectus_W"] = 0;
        chara["Rectus_P"] = 0;
        data.push(chara);
    }
    return data;
}

function saveStorage() {
    let getData = hot.getSourceData();
    localStorage.setItem('mgmt_json_data', JSON.stringify(getData));
}
function loadStorage() {
    let jsondata = localStorage.getItem('mgmt_json_data');
    if (jsondata) {
        data = JSON.parse(jsondata);
    } else {
        data = createNewCharaData();
    }
    return data;
}

columns = [
    {
        data: "troop",
        className: "htCenter",
        readOnly: true,
    },
    {
        data: "name",
        readOnly: true,
    },
    {
        data: "lv",
        className: "htCenter",
        type: "numeric",
        renderer: function (instance, td, row, column, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (value <= 120) {
                $(td).addClass("limit_0");
            } else if (value <= 130) {
                $(td).addClass("limit_1");
            } else if (value <= 140) {
                $(td).addClass("limit_2");
            } else if (value <= 150) {
                $(td).addClass("limit_3");
            } else if (value <= 170) {
                $(td).addClass("limit_4");
            }
        }
    },
    {
        data: "rein",
        className: "htCenter",
        type: "numeric",
        renderer: function (instance, td, row, column, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            if (value == 0) {
                $(td).addClass("limit_0");
            } else if (value < 5) {
                $(td).addClass("limit_1");
            } else if (value < 10) {
                $(td).addClass("limit_2");
            } else if (value < 20) {
                $(td).addClass("limit_3");
            } else if (value == 20) {
                $(td).addClass("limit_4");
            }
        }
    },
    {
        data: "skill",
        className: "htCenter",
    },
    {
        data: "generate",
        className: "htCenter",
    },
    {
        data: "Exo_R",
        className: "htRight",
    },
    {
        data: "Exo_B",
        className: "htRight",
    },
    {
        data: "Exo_Y",
        className: "htRight",
    },
    {
        data: "Exo_W",
        className: "htRight",
    },
    {
        data: "Exo_P",
        className: "htRight",
    },
    {
        data: "Rectus_R",
        className: "htRight",
    },
    {
        data: "Rectus_B",
        className: "htRight",
    },
    {
        data: "Rectus_Y",
        className: "htRight",
    },
    {
        data: "Rectus_W",
        className: "htRight",
    },
    {
        data: "Rectus_P",
        className: "htRight",
    },
]