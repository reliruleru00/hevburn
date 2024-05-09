
class unit_data {
    constructor() {
        this.place_no = -1;
        this.sp = 1;
        this.baff_list = [];
        this.add_turn = false;
        this.unit = null;
        this.normal_attack_element = 0;
    }
}
class buff_date {
    constructor() {
        this.rest_turn = -1;
        this.effect_size = 0;
        this.baff_kind = 0;
    }
}

function setEventTrigger() {
    // リセットボタン
    $("#style_reset_btn").on("click", function (event) {
        styleReset(true);
    });

    // 部隊変更ボタンクリック
    $(".troops_btn").on("click", function (event) {
        if ($(this).hasClass("selected_troops")) {
            return;
        }
        $(".selected_troops").removeClass("selected_troops");
        $(this).addClass("selected_troops");
        styleReset(false);
        select_troops = $(this).val();
        localStorage.setItem('select_troops', select_troops);
        loadTroopsList(select_troops);
    });

    // 戦闘開始ボタンクリック
    $(".battle_start").on("click", function (event) {
        battle_start();
    });
}

/* 戦闘開始処理 */
function battle_start() {
    let unit_list = [];
    // スタイル情報を作成
    $.each(select_style_list, function (index, value) {
        let  unit = new unit_data();
        unit.place_no = index;
        unit.sp += $("#chain_" + index).val();
        unit.sp.normal_attack_element = $("#bracelet_" + index).val();
        unit.style = value;
        unit_list.push(unit);
    });
    addTurn(unit_list);
}

function addTurn(unit_list) {
    let div = $('<div>')
        .addClass("flex");
    $.each(unit_list, function (index, value) {
        let img = $('<img>')
            .data("chara_no", index)
            .addClass("select_style");
        if (value.style) {
            img.attr("src", "icon/" + value.style.style_info.image_url)
        }
        div.append(img);
    });
    $("#turn_area").append(div);
}