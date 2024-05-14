let last_turn;
let turn_list = [];
let physical_name = ["", "斬", "突", "打"] 
let element_name = ["無", "火", "氷", "雷", "光", "闇"] 
class turn_data {
    constructor() {
        this.turn_number = 0;
        this.over_drive_turn = 0;
        this.over_drive_max_turn = 0;
        this.add_turn = false;
        this.enemy_debuff = [];
        this.unit_list = [];
        this.over_drive_gauge = 0;
    }

    // 0:先打ちOD,1:通常戦闘,2:後打ちOD,3:追加ターン
    turnProceed(val) {
        this.unitSort();
        if (val == 1) {
            // 通常
            $.each(this.unit_list, function (index, value) {
                if (!value.blank) {
                    value.unitTurnProceed();
                }
            });
            this.turn_number++;
        } else if(val == 3) {

        } else {
            // OD
            this.over_drive_turn = 1;
            this.over_drive_max_turn = Math.floor(this.over_drive_gauge / 100);
        }
        
    }
    unitSort() {
        this.unit_list.sort((a, b) => a.place_no - b.place_no);
    }
    
    getTurnNumber() {
        const defalt_turn = "ターン" + this.turn_number;
        // 追加ターン
        if (this.add_turn) {
            return `${defalt_turn} 追加ターン`;
        }
        // オーバードライブ中
        if (this.over_drive_turn > 0) {
            return `${defalt_turn} OverDrive${this.over_drive_turn}/${this.over_drive_max_turn}`;
        }
        return defalt_turn;
    }
}

class unit_data {
    constructor() {
        this.place_no = 99;
        this.sp = 1;
        this.baff_list = [];
        this.add_turn = false;
        this.unit = null;
        this.normal_attack_element = 0;
        this.skill_list = [];
        this.blank = false;
    }
    
    unitTurnProceed() {
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
        last_turn = 0;
        battle_start();
    });

    // 行動開始
    $(document).on("click", ".next_turn", function(event) {
        // 前ターンを不能
        $(document).off("click", ".turn" + last_turn + " .unit_select");
        // 次ターンを追加
        addTurn(turn_list[turn_list.length - 1], 1);
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
    addTurn(turn_init, 1);
}

function addTurn(turn_data, kb_add_turn) {
    last_turn++;
    turn_data.turnProceed(kb_add_turn);
    
    let turn = $('<div>').addClass("turn").addClass("turn" + last_turn);
    let header_area = $('<div>').addClass("flex");
    let turn_number = $('<div>').text(turn_data.getTurnNumber());
    let enemy = $('<div>').append($('<img>').attr("src", "icon/BtnEventBattleActive.webp").addClass("enemy_icon")).addClass("left");
    let over_drive = $('<div>').append($('<img>').attr("src", "icon/EffectOverdrive1.webp").addClass("od_icon"))
                                .append($('<img>').attr("src", "icon/NumberOverdrive1.webp").addClass("od_number"));
    let over_drive_tmp = $('<div>').append($('<input>').val(0));
    header_area.addClass("container").append(turn_number).append(enemy).append(over_drive_tmp);
    let party_member = $('<div>').addClass("flex");
    let front_area = $('<div>').addClass("flex").addClass("front_area");
    let back_area = $('<div>').addClass("flex").addClass("back_area");
    $.each(turn_data.unit_list, function (index, value) {
        let chara_div = $('<div>').addClass("unit_select");
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

        let skill_select = $('<select>').addClass("unit_skill");
        let option = $('<option>').text("なし").val(0).addClass("back");
        skill_select.append(option);
        $.each(value.skill_list, function (index, value) {
            let text = value.skill_name;
            if (value.skill_name == "通常攻撃") {
                text += `(${physical_name[value.attack_physical]}・${element_name[0]})`;
            } else if (value.skill_name == "追撃") {
                text += `(${physical_name[value.attack_physical]})`;
            } else if (value.attack_id){
                text += `(${physical_name[value.attack_physical]}・${element_name[value.attack_element]}/${value.sp_cost})`;
            } else {
                text += `(${value.sp_cost})`;
            }
            option = $('<option>').text(text)
                    .val(value.skill_id).addClass(value.skill_name == "追撃" ? "back" : "front");
            skill_select.append(option);
        });
        if (!value.style) {
            skill_select.css("visibility", "hidden");
        }
        chara_div.prepend(skill_select);

        if (value.place_no < 3) {
            setFrontOptions(skill_select);
            front_area.append(chara_div);
        } else {
            setBackOptions(skill_select);
            back_area.append(chara_div);
        }
    });
    party_member.append(front_area).append(back_area)
    let select = $('<select>').addClass("action_select");
    ["OD発動", "行動開始", "行動開始+OD"].forEach((element, index) => {
        select.append($('<option>').text(element).val(index));
    });
    select.val(1);
    let start = $('<input>').attr("type", "button").val("次ターン").addClass("next_turn");
    let footer_area = $('<div>').append(select).append(start);
    back_area.append(footer_area);
    turn.append(header_area).append(party_member);
    $("#turn_area").append(turn);

    addUnitEvent(turn_data.unit_list);
    turn_list.push(turn_data);
}

// ユニットイベント
function addUnitEvent(unit_list) {
    let first_click = null;
    let first_click_index = -1;
   $(document).on("click", ".turn" + last_turn + " .unit_select", function(event) {
        // クリックされた要素を取得
        let clicked_element = $(this);
        let index = $(this).parent().index() * 3 + $(this).index();
        let unit_data = getUnitData(unit_list, index);
        if (!unit_data || unit_data.blank) {
            return;
        }
        // 最初にクリックされた要素かどうかを確認
        if (first_click === null) {
            // 最初にクリックされた要素を記録
            first_click = clicked_element;
            first_click_index = index;
            clicked_element.addClass("unit_selected");
        } else {
            first_click.removeClass("unit_selected");
            // 同じ要素が2回クリックされた場合は処理しない
            if (first_click.is(clicked_element)) {
                // 最初にクリックした要素をリセット
                first_click = null;
                return;
            }
            // 2回目にクリックされた要素を取得
            var second_click = clicked_element;

            let first_click_unit_data = getUnitData(unit_list, first_click_index);
            first_click_unit_data.place_no = index;
            unit_data.place_no = first_click_index;

            // 前衛と後衛が入れ替わった場合、
            if (index >= 0 && index <= 2 && first_click_index >= 3 && first_click_index <= 5) {
                setFrontOptions(first_click.find("select"));
                setBackOptions(second_click.find("select"));
            }
            if (index >= 3 && index <= 5 && first_click_index >= 0 && first_click_index <= 2) {
                setFrontOptions(second_click.find("select"));
                setBackOptions(first_click.find("select"));
            }
            // 要素を交換
            swapElements(first_click, second_click)

            // 最初にクリックした要素をリセット
            first_click = null;
            first_click_index = -1;
        }
    });
}

// 要素を交換する関数
function swapElements(firstElement, secondElement) {
    const firstSelectVal = firstElement.find("select").val();
    const secondSelectVal = secondElement.find("select").val();

    const firstClone = firstElement.clone();
    const secondClone = secondElement.clone();

    firstClone.find("select").val(firstSelectVal);
    secondClone.find("select").val(secondSelectVal);

    firstElement.replaceWith(secondClone);
    secondElement.replaceWith(firstClone);
}

// ユニットデータ取得
function getUnitData(unit_list, index) {
    const filtered_unit = unit_list.filter((obj) => obj.place_no == index);
    return filtered_unit.length > 0 ? filtered_unit[0] : undefined;
}

// スキル設定
function setFrontOptions(select) {
    select.find("option.front").show();
    select.find("option.back").hide();
    select.find("option.front:first").prop('selected', true);
}
function setBackOptions(select) {
    select.find("option.front").hide();
    select.find("option.back").show();
    select.find("option:not(.front):first").prop('selected', true);
}
