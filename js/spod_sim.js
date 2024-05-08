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
    let div = $('<div>')
        .addClass("flex");
    $.each(select_style_list, function (index, value) {
        let img = $('<img>')
            .data("chara_no", index)
            .addClass("select_style");
        if (value) {
            img.attr("src", "icon/" + value.style_info.image_url)
        }
        div.append(img);
    });
    $("#turn_area").append(div);
}