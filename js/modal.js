// スタイルリスト作成
function createStyleList() {
    $.each(style_list, function(index, value) {
    	let source = "icon/" + value.image_url;
    	let input = $('<input>')
            .attr("type", "image")
            .attr("src", source)
            .attr("title", "[" + value.style_name + "]" + chara_full_name[value.chara_id])
            .data("style_id", value.style_id)
            .addClass("select_style_list")
            .addClass("physical_" + value.physical)
            .addClass("element_" + value.element)
            .addClass("role_" + value.role);
    	$("#sytle_list_" + value.troops).append(input);
    });
}

// モーダル系イベント
function addModalEvent() {
    // モーダルを開く
    $('.showmodal').on('click', function() {
        chara_no = $(this).data("chara_no");
        MicroModal.show('modal_style_section');
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
            classification = "role";
        }

        let selecter = ".narrow" + "." + classification;
        let select = $(this).data("select");

        if (select == "1") {
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

        $(".select_style_list").hide();
        let show_class = ".select_style_list" + narrow.physical + narrow.element + narrow.role;
        $(show_class).show();
    });

    // スタイルを選択
    $('input.select_style_list').on('click', function(){
        setMember($(this).data("style_id"), true)
        closeModel();
    });

    // メンバーを外す
    $('.remove_btn').on('click', function() {
        localStorage.removeItem(`troops_${select_troops}_${chara_no}`);
        removeMember();
        closeModel();
    });
}

// モーダルを閉じる
function closeModel() {
    chara_no = 0;
    MicroModal.close('modal_style_section');
}

// メンバーを設定する。
function setMember(style_id, isTrigger) {
    let style_info = style_list.find((obj) => obj.style_id === style_id);

    // 同一のキャラIDは不許可
    for(let idx in select_style_list) {
        if (select_style_list[idx].chara_id === style_info.chara_id && chara_no != idx) {
            alert("同一キャラクターは複数選択できません");
            return false;
        }
    }
    // メンバーの情報を削除
    removeMember();
    
    // 画像切り替え
    select_style_list[chara_no] = style_info;
    localStorage.setItem(`troops_${select_troops}_${chara_no}`, style_id);

    $('.select_style[data-chara_no="' + chara_no + '"]').attr("src", "icon/" + style_info.image_url);

    // 宝珠スキルタイプを設定
    $("#jewel_type_" + chara_no).val(style_info.jewel_type);
    // ステータスを設定
    for (let j = 1; j < status_kbn.length; j++) {
        const status = localStorage.getItem(status_kbn[j] + "_" + style_info.chara_id);
        if (status) $("#" + status_kbn[j] + "_" + chara_no).val(status);
    }
    const jewel_status = localStorage.getItem("jewel_" + style_info.chara_id);
    if (jewel_status) $("#jewel_" + chara_no).prop("selectedIndex", jewel_status);
    const limit_status = localStorage.getItem("limit_" + style_info.chara_id);
    if (limit_status) $("#limit_" + chara_no).prop("selectedIndex", limit_status);

    // スキル・バフ・アビリティを追加
    addAttackList(style_info, chara_no);
    addBuffList(style_info, chara_no);
    addAbility(style_info, chara_no);
    if (isTrigger) {
        $("#attack_list").trigger("change");
    }
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
    $('.select_style[data-chara_no="' + chara_no + '"]').attr("src", "img/plus.png");
    // スキル情報編集
    $("#attack_list").trigger("change");
}

// 部隊リストの呼び出し
function loadTroopsList(troops_no) {
    for (let j = 0; j < 6; j++) {
        const style_id = localStorage.getItem(`troops_${troops_no}_${j}`);
        if (style_id !== null) {
            chara_no = j;
            setMember(Number(style_id), false);
        }
    }
    $("#attack_list").trigger("change");
}

class SubMember {
    constructor() {
        this.style_info = null;
        this.jewel_type = 0;
        this.str = 0;
        this.dex = 0;
        this.con = 0;
        this.mnd = 0;
        this.int = 0;
        this.luk = 0;
        this.jewel_status = 0;
        this.limit_status = 0;
    }
    // 詳細反映
    setDamageDetail() {
        $("#detail_min_damage").val(Math.floor(this.min_damage).toLocaleString());
        $("#detail_max_damage").val(Math.floor(this.max_damage).toLocaleString());
        $("#detail_damage").val(Math.floor(this.avg_damage).toLocaleString());
        for (let i = 0; i < DP_GAUGE_COUNT; i++) {
            let enemy_dp = Number($("#enemy_dp_" + i).val().replace(/,/g, ""));
            let disp_rest = calculatePercentage(this.max_rest_dp[i], this.min_rest_dp[i], enemy_dp);
            $("#rest_dp_rate_" + i).val(disp_rest);
            // generateGradientFromRangeメソッドを呼び出してグラデーションスタイルを取得
            let gradientStyle = generateGradientFromRange(disp_rest, "#A7BEC5")
            // 対象の要素にスタイルを設定
            $("#rest_dp_rate_" + i).css("background", gradientStyle);
        }
        let enemy_hp = Number($("#enemy_hp").val().replace(/,/g, ""));
        let disp_rest = calculatePercentage(this.max_rest_hp, this.min_rest_hp, enemy_hp);
        $("#rest_hp_rate").val(disp_rest);
        // generateGradientFromRangeメソッドを呼び出してグラデーションスタイルを取得
        let gradientStyle = generateGradientFromRange(disp_rest, "#BE71BE")
        // 対象の要素にスタイルを設定
        $("#rest_hp_rate").css("background", gradientStyle);

        // 破壊率
        const maxRate = Math.round(this.max_destruction_last_rate * 10) / 10;
        const minRate = Math.round(this.min_destruction_last_rate * 10) / 10;
        
        const rateText = maxRate === minRate ? `${maxRate}%` : `${maxRate}%～${minRate}%`;
        $("#detail_destruction_last_rate").text(rateText);
    }
}

// サブ部隊リストの呼び出し
function loadSubTroopsList(troops_no) {
    // 既存のメンバーの情報を削除
    for (let j = 0; j < 6; j++) {
        $('#sub_chara_container_' + j).removeClass("ban_style");
    }

    // 新規メンバーの情報追加
    for (let j = 0; j < 6; j++) {
        const style_id = localStorage.getItem(`troops_${troops_no}_${j}`);
        if (style_id !== null) {
            setSubMember(j, Number(style_id));
        } else {
            removeSubMember(j);
        }
    }
    $("#attack_list").trigger("change");
}

// サブパーティのメンバーを設定する。
function setSubMember(sub_chara_no, style_id) {
    let style_info = style_list.find((obj) => obj.style_id === style_id);

    let isDuplication = false;
    // 同一のキャラIDは不許可
    for(let idx in select_style_list) {
        if (select_style_list[idx].chara_id === style_info.chara_id) {
            isDuplication = true;
            break;
        }
    }

    let member_info = new SubMember();
    member_info.style_info = style_info;
    // 画像切り替え
    $('#sub_chara_' + sub_chara_no).attr("src", "icon/" + style_info.image_url);

    if (isDuplication) {
        $('#sub_chara_container_' + sub_chara_no).addClass("ban_style");
        sub_style_list[sub_chara_no] = undefined;
        return false;
    } 

    // 宝珠スキルタイプを設定
    member_info.jewel_type = style_info.jewel_type;
    // ステータスを設定
    for (let j = 1; j < status_kbn.length; j++) {
        const status = localStorage.getItem(status_kbn[j] + "_" + style_info.chara_id);
        if (status) member_info[status_kbn[j]] = status;
    }
    const jewel_status = localStorage.getItem("jewel_" + style_info.chara_id);
    if (jewel_status) member_info.jewel_status = jewel_status;
    const limit_status = localStorage.getItem("limit_" + style_info.chara_id);
    if (limit_status) member_info.limit_status = limit_status;

    sub_style_list[sub_chara_no] = member_info;

    // デバフのみを追加
    addSubMemberBuffList(style_info, sub_chara_no);
}

// メンバーを外す
function removeSubMember(sub_chara_no) {
    // // 入れ替えスタイルのスキルを削除
    // let chara_id_class = ".chara_id-" + select_style_list[chara_no].chara_id;
    // let parent = $(".include_lv " + chara_id_class + ":selected").parent();
    // $.each(parent, function(index, value) {
    //     // 暫定的にdisplay:none追加
    //     $(value).find(chara_id_class).css("display", "none");
    //     select2ndSkill($("#" + $(value).prop("id")));
    // });
    // // 該当メンバーのスキル削除
    // $(chara_id_class).remove();
    // select_style_list[chara_no] = 0;

    // 画像初期化
    $('.sub_style[data-chara_no="' + sub_chara_no + '"]').attr("src", "img/cross.png");
}

// サブメンバーバフリストに追加
function addSubMemberBuffList(style, chara_no) {
    let buff_list = skill_buff.filter(obj => 
        (obj.chara_id === style.chara_id || obj.chara_id === 0) && 
        (obj.style_id === style.style_id || obj.style_id === 0)
        );
      
    buff_list.forEach(value => {
        let effect_size = getEffectSize(value.buff_kind, value.buff_id, chara_no, value.max_lv);
        let buff_element = 0;
        let only_one = "";
        
        switch (value.buff_kind) {
            case 11: // 属性フィールド
                addElementField(style, value.buff_name, value.min_power, value.buff_element, value.buff_id, true);
                return;
            case 0:
                only_one = "only_one";
            break;
            case 1: // 属性攻撃アップ
                only_one = "only_one";
            case 4: // 属性防御ダウン
            case 20: // 耐性ダウン
            case 22: // 永続属性防御ダウン
                buff_element = value.buff_element;
            break;
            case 8: // 属性クリティカル率アップ
            case 9: // 属性クリティカルダメージアップ
                buff_element = value.buff_element;
            case 6:
            case 7:
            case 16:
            case 17:
                only_one = "only_one";
            break;
        }
        
        let str_buff = buff_kbn[value.buff_kind];
        if (value.skill_attack === 0) only_one = 0;
        if (value.only_first === 1) only_one = "only_first";
        let only_chara_id = value.only_me === 1 ? `only_chara_id-${style.chara_id}` : "public";
        let option_text = `${chara_name[style.chara_id]}: ${value.buff_name} ${(Math.floor(effect_size * 100) / 100)}%`;
        
        var option = $('<option>')
            .text(option_text)
            .val(value.buff_id)
            .data("select_lv", value.max_lv)
            .data("max_lv", value.max_lv)
            .data("chara_no", chara_no)
            .data("effect_size", effect_size)
            .css("display", "none")
            .addClass("buff_element-" + buff_element)
            .addClass("buff_id-" + value.buff_id)
            .addClass("variable_effect_size")
            .addClass("skill_attack-" + value.skill_attack)
            .addClass(only_chara_id)
            .addClass(only_one)
            .addClass("chara_id-" + style.chara_id);
        
        $("." + str_buff).append(option);
    });
}


// スタイルリセット
function styleReset(isLocalStorageReset) {
    for (let i = 0; i < select_style_list.length; i++) {
        if (select_style_list[i] !== 0) {
            chara_no = i;
            removeMember();
            if (isLocalStorageReset) {
                localStorage.removeItem(`troops_${select_troops}_${chara_no}`);
            }
        }
    }
}