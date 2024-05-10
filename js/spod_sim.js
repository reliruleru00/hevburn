class turn_data {
    constructor() {
        this.turn_number = 0;
        this.enemy_debuff = [];
        this.unit_list = [];
        this.over_drive = 0;
    }

    turnProceed() {
        $.each(this.unit_list, function (index, value) {
            if (!value.blank) {
                value.turnProceed();
            }
        });
    }

}

class unit_data {
    constructor() {
        this.place_no = -1;
        this.sp = 1;
        this.baff_list = [];
        this.add_turn = false;
        this.unit = null;
        this.normal_attack_element = 0;
        this.skill_list = [];
        this.blank = false;
    }
    
    turnProceed() {
        this.sp += 2;
        if (this.place_no <= 2) {
            // 前衛
            this.sp += 1;
        }
    }
}
class buff_data {
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
    let turn_init = new turn_data();
    let unit_list = [];

    // スタイル情報を作成
    $.each(select_style_list, function (index, value) {
        let unit = new unit_data();
        unit.place_no = index;
        if (value) {
            unit.sp += Number($("#chain_" + index).val());
            unit.sp.normal_attack_element = $("#bracelet_" + index).val();
            unit.style = value;
            unit.skill_list = skill_list.filter(obj =>
                (obj.chara_id === value.style_info.chara_id || obj.chara_id === 0) &&
                (obj.style_id === value.style_info.style_id || obj.style_id === 0)
            );
        } else {
            unit.blank = true;
        }
        unit_list.push(unit);
    });
    turn_init.unit_list = unit_list;
    // 
    addTurn(turn_init);
}

function addTurn(turn_data) {
    let header_area = $('<div>').addClass("flex");
    let enemy = $('<div>').append($('<img>').attr("src", "icon/BtnEventBattleActive.webp").addClass("enemy_icon")).addClass("left");
    let over_drive = $('<div>').append($('<img>').attr("src", "icon/EffectOverdrive1.webp").addClass("od_icon"))
                                .append($('<img>').attr("src", "icon/NumberOverdrive1.webp").addClass("od_number"));
    header_area.addClass("container").append(enemy).append(over_drive);
    let party_member = $('<div>').addClass("flex");
    let front_area = $('<div>').addClass("flex");
    let back_area = $('<div>').addClass("flex");
    turn_data.turnProceed();
    $.each(turn_data.unit_list, function (index, value) {
        let chara_div = $('<div>');
        let img = $('<img>')
            .data("chara_no", index)
            .addClass("unit_style");
        if (value.style) {
            let sp = $('<div>').text(value.sp).addClass("unit_sp");
            img.attr("src", "icon/" + value.style.style_info.image_url)
            chara_div.append(img).append(sp);
        } else {
            img.attr("src", "img/cross.png")
            chara_div.append(img);
        }
        if (value.place_no < 3) {
            let skill_select = $('<select>').addClass("unit_skill");
            $.each(value.skill_list, function (index, value) {
                let option = $('<option>').text(value.skill_name).val(value.skill_id);
                skill_select.append(option);
            });
            chara_div.addClass("front_area")
            chara_div.prepend(skill_select);
            front_area.append(chara_div);
        } else {
            let skill_select = $('<select>').addClass("pursuit");
            let option = $('<option>').text("なし").val(0);
            skill_select.append(option);
            chara_div.addClass("back_area");
            chara_div.prepend(skill_select);
            back_area.append(chara_div);
        }
    });
    party_member.append(front_area).append(back_area)
    $("#turn_area").append(header_area).append(party_member);
}