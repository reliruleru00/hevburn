// スタイルリスト作成
function createStyleList() {
    $.each(style_list, function(index, value) {
    let source = "icon/" + value.image_url;
    var input = $('<input>')
                .attr("type", "image")
                .attr("src", source)
                .data("style_id", value.style_id)
                .addClass("select_style")
                .addClass("physical_" + value.physical)
                .addClass("element_" + value.element)
                .addClass("role_" + value.role);
    $("#sytle_list_" + value.troops).append(input);
    });
}

// モーダル系イベント
function addModalEvent(){
    // モーダルを開く
    $('.showmodal').on('click', function(){
        chara_no = $(this).data("chara_no");
        $('.modal_layer').addClass('isShow');
    });

    let narrow = {"physical": "", "element": "", "role": "" };
    // スタイル絞り込み
    $(".narrow").on('click', function() {
        let classification = "";
        if ($(this).hasClass("physical")) {
            classification = "physical";
        } else if ($(this).hasClass("element")) {
            classification = "element";
        } else {
            classification += "role";
        }
        let selecter = ".narrow" + "." + classification;
        if ($(this).data("select") == "1") {
            $(selecter).css("opacity", "0.3");
            $(selecter).data("select", "1");
            $(this).css("opacity", "1");
            $(this).data("select", "0");
            narrow[classification] = "." + $(this).prop("id");
        } else {
            $(selecter).css("opacity", "1");
            $(selecter).data("select", "1");
            narrow[classification] = "";
        }

        $(".select_style").hide();
        let show_class = ".select_style" + narrow.physical + narrow.element + narrow.role;
        $(show_class).show();
    })

    // スタイルを選択
    $('.select_style').on('click', function(){
        let style_id = $(this).data("style_id");
        let style = $.grep(style_list,
            function (obj, index) {
            return (obj.style_id === style_id);
            })[0];
        // 同一のキャラIDは不許可
        for(let idx in select_style_list) {
            if (select_style_list[idx].chara_id === style.chara_id && chara_no != idx) {
            alert("同一キャラクターは複数選択できません");
            return false;
            }
        }
        // メンバーの情報を削除
        removeMember();
        
        // 画像切り替え
        select_style_list[chara_no] = style;
        $('[data-chara_no="' + chara_no + '"]').attr("src", "icon/" + style.image_url);

        // 宝珠スキルタイプを設定
        $("#jewel_type_" + chara_no).val(style.jewel_type);
        addAttackList(style, chara_no);
        $("#attack_list").trigger("change");
        addBuffList(style, chara_no);

        // アビリティ設定
        addAbility(style, chara_no);
        
        closeModel();
    });

    // メンバーを外す
    $('.remove_btn').on('click', function(){
        removeMember();
        closeModel();
    });

    // モーダルを閉じる
    $('.modal_layer_mask').on('click', function(){
      closeModel();
    });
}

// モーダルを閉じる
function closeModel() {
    chara_no = 0;
    $('.modal_layer').removeClass('isShow');
}

// メンバーを外す
function removeMember() {
    // 入れ替えスタイルのスキルを削除
    let chara_id_class = ".chara_id-" + select_style_list[chara_no].chara_id;
    let parent = $(".include_lv " + chara_id_class + ":selected").parent();
    $.each(parent, function(index, value) {
        // 暫定的にdisplay:none追加
        $(value).find(chara_id_class).css("display", "none");
        select2ndSkill($("#" + $(value).prop("id")));
    });
    // 該当メンバーのスキル削除
    $(chara_id_class).remove();
    select_style_list[chara_no] = 0;
    // 画像初期化
    $('[data-chara_no="' + chara_no + '"]').attr("src", "img/plus.png");
    // スキル情報編集
    $("#attack_list").trigger("change");
}