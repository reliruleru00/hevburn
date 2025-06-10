// let select_troops = localStorage.getItem('select_troops');
// let select_style_list = Array(6).fill(undefined);
// let sub_style_list = Array(6).fill(undefined);
// let support_style_list = Array(6).fill(undefined);
// let chara_sp_list = [];

function setEventTrigger() {
    // 入力制限
    $(".limit_number").on("change", function (event) {
        let min = parseInt(this.min);
        let max = parseInt(this.max);
        let value = parseInt(this.value);
        if (value < min) {
            this.value = min;
        }
        if (value > max) {
            this.value = max;
        }
    });
    // 士気レベル変更
    $("#morale_count").on("change", function (event) {
        updateVariableEffectSize();
    });
    // バフ/デバフ強化変更
    $(".strengthen").on("change", function (event) {
        // バフ効果量を更新
        $(this).parent().parent().find(".variable_effect_size").each(function (index, value) {
            // updateBuffEffectSize($(value));
        });
    });
    // バフ/デバフ強化アビリティ変更
    $(document).on("change", ".strengthen_skill", function (event) {
        let chara_id_class = $(this).parent().attr('class').split(' ').find(className => className.startsWith('chara_id-'));
        // バフ効果量を更新
        $(".variable_effect_size." + chara_id_class).each(function (index, value) {
            // updateBuffEffectSize($(value));
        });
    });
    // 能力上昇バフ
    $(document).on("change", ".strengthen_status", function (event) {
        let chara_id_class = $(this).parent().attr('class').split(' ').find(className => className.startsWith('chara_id-'));
        // バフ効果量を更新
        $(".variable_effect_size." + chara_id_class).each(function (index, value) {
            // updateBuffEffectSize($(value));
        });
    });
    // フィールド強化変更
    $(document).on("change", "input.strengthen_field", function (event) {
        let chara_id_class = $(this).parent().attr('class').split(' ').find(className => className.startsWith('chara_id-'));
        // フィールド強化15%
        let strengthen = $(this).prop("checked") ? $(this).data("effect_size") : 0;
        // フィールド効果量を更新
        updateFieldEffectSize(chara_id_class, strengthen);
    });
    // 前衛が3人以上の場合
    $(document).on("change", "#ability_front input", function (event) {
        // if (checkFrontAbility() > 2) {
        //     alert("前衛は攻撃キャラクターを除いた2人まで設定できます。");
        //     $(this).prop("checked", false);
        //     return;
        // }
    });
    // 後衛が3人以上の場合
    $(document).on("change", "#ability_back input", function (event) {
        let back = $(`#ability_back input:checked`).filter(function () {
            return $(this).parent().css("display") !== "none";
        });
        if (back.length > 3) {
            alert("後衛は3人まで設定できます。");
            $(this).prop("checked", false);
            return;
        }
    });
    // プレイヤーDP変更
    $(".player_dp_range").on("input", function (event) {
        let val = $(this).val();
        $("#player_dp_rate").val(val + '%');
        applyGradient($(".player_dp_range"), "#4F7C8B", val / 1.5);
    });
    // カンマ区切り
    $(document).on("focus", ".comma", function (event) {
        let newValue = removeComma($(this).val())
        // フォームの値を置き換える
        $(this).val(newValue);
    });
    $(document).on("blur", ".comma", function (event) {
        let newValue = removeComma($(this).val())
        // カンマ区切りに編集した値を取得する
        let formattedValue = newValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // フォームの値を置き換える
        $(this).val(formattedValue);
    });
    // ダメージ詳細を開く
    // $(".open_detail").on("click", function (event) {
    //     if ($(this).attr("id") == "modal_damage_detail_open1") {
    //         open_damage_detail = critical_detail;
    //         $("#skill_power").hide();
    //         $("#skill_power_critical").show();
    //         $("#magnification_critical").show();
    //     } else {
    //         open_damage_detail = damage_detail;
    //         $("#skill_power").show();
    //         $("#skill_power_critical").hide();
    //         $("#magnification_critical").hide();
    //     }
    //     open_damage_detail.setDamageDetail();
    // });

    // 残り耐久反映
    // $(".durability_reflection").on("click", function (event) {
    //     let dp = 0;
    //     let index = 0;
    //     for (let i = 0; i < DP_GAUGE_COUNT; i++) {
    //         if ($("#enemy_dp_" + i).val()) {
    //             let enemy_dp = Number($("#enemy_dp_" + i).val().replace(/,/g, ""));
    //             let rest = Math.ceil((open_damage_detail.avg_rest_dp[i] / enemy_dp) * 100);
    //             if (rest != 100) {
    //                 dp = rest;
    //                 index = i;
    //                 break;
    //             }
    //         }
    //     }
    //     let enemy_hp = Number($("#enemy_hp").val().replace(/,/g, ""));
    //     updateEnemyDurability(
    //         index, dp,
    //         Math.ceil((open_damage_detail.avg_rest_hp / enemy_hp) * 100),
    //         Math.floor(open_damage_detail.avg_destruction_last_rate),
    //     );
    //     MicroModal.close('modal_damage_detail');
    //     // 自動選択外す
    //     $("#auto_skill").prop("checked", false);
    // });
    // $(document).on("change", "input, select", function (event) {
    //     calcDamage();
    // });
}
// 効果量更新
function updateVariableEffectSize() {
    // バフ効果量を更新
    // $(".variable_effect_size").each(function (index, value) {
    //     updateBuffEffectSize($(value));
    // });
}

// 倍率表示
function convertToPercentage(value) {
    // 引数×100を計算し、小数点以下2桁目以降を四捨五入してパーセント記号を付ける
    const percentage = (Math.floor(value * 10000) / 100).toFixed(2) + "%";
    return percentage;
}

// ピアス効果量取得
function getEarringEffectSize(type, hit_count) {
    hit_count = hit_count < 1 ? 1 : hit_count;
    let earring = $("#earring option:selected");
    if (earring.data("type") === type) {
        let effect_size = Number(earring.data("effect_size"));
        return (effect_size - (10 / 9 * (hit_count - 1)));
    }
    return 0;
}

// チェーン効果量取得
function getChainEffectSize(type) {
    switch ($("#chain").val()) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
            switch (type) {
                case "skill":
                    return 10;
                case "blast":
                    return 10;
                default:
                    break;
            }
            break;
    }
    return 0;
}

// フィールド効果量更新
function updateFieldEffectSize(chara_id_class, strengthen) {
    let chara_id = chara_id_class.replace("chara_id-", "");
    let chara_name = getCharaData(chara_id).chara_short_name;
    $.each($(".element_field").find(`option.${chara_id_class}`), function (index, option) {
        let buff_id = Number($(option).val());
        let skill_buff = getBuffIdToBuff(buff_id);
        let effect_size = skill_buff.max_power + strengthen;
        let effect_text = `${chara_name}: ${skill_buff.buff_name} ${Math.floor(effect_size * 100) / 100}%`;
        $(option).text(effect_text).data("effect_size", effect_size).data("text_effect_size", effect_size);;
    });
}

// バフ効果量更新
function updateBuffEffectSize(option, skill_lv, member_info) {
    let buff_id = Number(option.val());
    skill_lv = skill_lv || Number(option.data("select_lv"));
    let chara_id = Number(option.data("chara_id"));
    let skill_buff = getBuffIdToBuff(buff_id);
    member_info = member_info || getCharaIdToMember(chara_id);
    let effect_size = getEffectSize(skill_buff.buff_kind, buff_id, member_info, skill_lv);
    let chara_name = getCharaData(chara_id).chara_short_name;
    let ability_streng = getStrengthen(member_info, skill_buff);
    // バフ強化1.2倍
    let strengthen = option.parent().parent().parent().find("input").prop("checked") ? 20 : 0;
    let text_effect_size = effect_size * (1 + (ability_streng + strengthen) / 100);
    effect_size = effect_size * (1 + ability_streng / 100);
    let effect_text = `${chara_name}: ${skill_buff.buff_name} ${Math.floor(text_effect_size * 100) / 100}%`;
    option.text(effect_text).data("effect_size", effect_size).data("select_lv", skill_lv).data("text_effect_size", text_effect_size);;
    // 耐性が変更された場合
    // if (skill_buff.buff_kind == BUFF_RESISTDOWN) {
    //     updateEnemyResistDown();
    // }
}

// バフ強化効果量取得
function getStrengthen(member_info, skill_buff) {
    let sp_cost_down = 0;
    // 蒼天
    if ($("#ability_all72").prop("checked")) {
        sp_cost_down = 1;
    }
    // ハイブースト状態
    if ($("#skill_passive635").prop("checked")) {
        sp_cost_down = -2;
    }

    let strengthen = 0;
    // 攻撃力アップ/属性攻撃力アップ
    let attack_up = [BUFF_ATTACKUP, BUFF_ELEMENT_ATTACKUP];
    if (attack_up.includes(skill_buff.buff_kind)) {
        let ability_list = [member_info.style_info.ability0, member_info.style_info.ability00, member_info.style_info.ability1, member_info.style_info.ability3, member_info.style_info.ability5, member_info.style_info.ability10];
        // 機転
        if (ability_list.includes(501) && member_info.limit_count >= 3) {
            strengthen += 25;
        }
        // 増幅
        if (ability_list.includes(503)) {
            strengthen += 10;
        }
        // エクシード(菅原専用)
        if (ability_list.includes(505) && $("#ability_all463").prop("checked")) {
            strengthen += 30;
        }
        // 自慢のフロートバイク
        if (ability_list.includes(509) && $("#ability_all910").prop("checked")) {
            strengthen += 25;
        }
        // ハイブースト状態
        if ($("#skill_passive635").prop("checked")) {
            strengthen += 20;
        }
    }
    // 防御力ダウン/属性防御力ダウン/DP防御力ダウン/永続防御ダウン/永続属性防御ダウン
    let defense_down = [BUFF_DEFENSEDOWN, BUFF_ELEMENT_DEFENSEDOWN,
        BUFF_DEFENSEDP, BUFF_ETERNAL_DEFENSEDOWN, BUFF_ELEMENT_ETERNAL_DEFENSEDOWN];
    if (defense_down.includes(skill_buff.buff_kind)) {
        let ability_list = [member_info.style_info.ability0, member_info.style_info.ability00, member_info.style_info.ability1, member_info.style_info.ability3, member_info.style_info.ability5, member_info.style_info.ability10];
        // 侵食
        if (ability_list.includes(502) && member_info.limit_count >= 3) {
            strengthen += 25;
        }
        // 減退
        if (ability_list.includes(504)) {
            strengthen += 10;
        }
        // モロイウオ
        if (ability_list.includes(506) && $("#ability_all243").prop("checked") && (skill_buff.sp_cost - sp_cost_down) <= 8) {
            strengthen += 30;
        }
        // 王の眼差し
        if (ability_list.includes(507) && $("#ability_all11").prop("checked")) {
            strengthen += 25;
        }
        // 思考加速
        if (ability_list.includes(508) && $("#ability_all190").prop("checked")) {
            strengthen += 15;
        }
        // 水光のゆらめき(あいな専用)
        if (member_info.style_info.chara_id == 24 && $("#skill_passive559").prop("checked")) {
            strengthen += 10;
        }
        // ハイブースト状態
        if ($("#skill_passive635").prop("checked")) {
            strengthen += 20;
        }
    }
    // 防御ダウン以外のデバフスキル
    let other_debuff = [BUFF.FRAGILE, BUFF.RESISTDOWN];
    if (other_debuff.includes(skill_buff.buff_kind)) {
        // ハイブースト状態
        if ($("#skill_passive635").prop("checked")) {
            strengthen += 20;
        }
    }
    return strengthen;
}

// 耐性判定
function getEnemyResist(attackInfo, enemyInfo, correction) {
    let physical_resist = enemyInfo[`physical_${attackInfo.attack_physical}`];
    let element_resist = enemyInfo[`element_${attackInfo.attack_element}`] - correction[`element_${attackInfo.attack_element}`];
    if (attackInfo.penetration) {
        physical_resist = attackInfo.penetration;
        element_resist = 100;
    }
    return [physical_resist, element_resist];
}


// バフの絞り込み
const filteredBuffList = (buffList, buffKind, attackInfo, isOrb = true) => {
    if (!attackInfo) return [];
    return buffList.filter(buff => {
        if (buffKind !== null && buff.buff_kind !== buffKind) {
            return false;
        }
        if (ELEMENT_KIND.includes(buff.buff_kind) && attackInfo.attack_element !== buff.buff_element) {
            return false;
        }
        if (buff.buff_kind === BUFF.FIELD && buff.buff_element !== 0 && buff.buff_element !== attackInfo.attack_element) {
            return false;
        }
        if (buff.range_area === RANGE.SELF && buff.chara_id !== attackInfo.chara_id) {
            return false;
        }
        // 自分に使用出来ない攻撃バフ
        if (OTHER_ONLY_AREA.includes(buff.range_area) && buff.chara_id === attackInfo.chara_id) {
            return false;
        }
        if (!isOrb && buff.skill_id > 9000) {
            // オーブスキル
            return false;
        }
        return true;
    });
}

// アビリティ追加
function addAbility(member_info) {
    let chara_id = member_info.style_info.chara_id;
    let ability_list = [member_info.style_info.ability0, member_info.style_info.ability00, member_info.style_info.ability1, member_info.style_info.ability3, member_info.style_info.ability5, member_info.style_info.ability10];
    let is_select = member_info.is_select;

    // ロールアビリティ
    if (member_info.style_info.role == ROLE_ADMIRAL) {
        ability_list.push(299);
    }
    for (let index = 0; index < ability_list.length; index++) {
        let ability_id = ability_list[index];
        let ability_info = getAbilityInfo(ability_id);

        if (ability_id == null || ability_id > 1000) {
            const servant_list = [1019, 1020, 1021];
            if (servant_list.includes(ability_id)) {
                let name = getCharaData(chara_id).chara_short_name;
                let option = $('<option>')
                    .val("4901")
                    .addClass(`buff_element-0 buff_physical-0 only_chara_id-${chara_id} chara_id-${chara_id} skill_attack-0 hidden`)
                    .text(`${name}: ${ability_info.ability_name} 30%`)
                    .data("effect_size", 30)
                $("#servant").append(option);
            }
            // 1000番以降は不要
            continue;
        }
        if (!is_select && ability_info.range_area != RANGE_FIELD) {
            // 他部隊のアビリティはフィールドのみ許可
            continue;
        }
        let limit_border = index <= 1 ? 0 : (index === 2 ? 1 : (index === 3 ? 3 : (index === 4 ? 5 : 10)));
        let display = "none";

        if ((ability_info.element === 0 && ability_info.physical == 0)
            || (select_attack_skill && (select_attack_skill.attack_element === ability_info.element || (select_attack_skill.attack_physical === ability_info.physical)))) {
            display = "block";
        }
        let target;
        let element_type;
        let physical_type;
        let append = undefined;
        let effect_size = ability_info.effect_size;

        switch (ability_info.range_area) {
            case RANGE_FIELD: // フィールド
                addElementField(member_info, ability_info.ability_name, ability_info.effect_size, ability_info.element, 0, 0);
                continue;
            case RANGE_SELF: // 自分
                if (select_attack_skill && select_attack_skill.chara_id !== chara_id) {
                    display = "none"
                }
                target = "ability_self";
                element_type = "self_element"
                physical_type = "self_physical"
                break;
            case RANGE_ALLY_FRONT:  // 味方前衛
            case RANGE_ALLY_BACK: // 味方後衛
            case RANGE_ALLY_ALL: // 味方全体
            case RANGE_ENEMY_ALL: // 敵全体
            case RANGE_OTHER: // その他
                switch (ability_info.activation_place) {
                    case 1: // 前衛
                        target = "ability_front";
                        break;
                    case 2: // 後衛
                        target = "ability_back";
                        break;
                    case 3: // 全体
                    case 0: // その他
                        target = "ability_all";
                        break;
                }
                element_type = "public buff_element"
                physical_type = "buff_physical"
                break;
            default:
                break;
        }
        // 浄化の喝采/破砕の喝采
        // const APPEND_SELECT_LIST = [407, 408];
        // if (APPEND_SELECT_LIST.includes(ability_info.ability_id)) {
        //     // 追加
        //     var option1 = $('<option>').text("×1").val(1);
        //     var option2 = $('<option>').text("×2").val(2);
        //     append = $('<select>').append(option1).append(option2).addClass("ability_select");
        // }
        let name = (is_select ? "" : "(他部隊)") + getCharaData(chara_id).chara_short_name;
        let fg_update = false;
        let id = target + chara_id + index;
        let chara_id_class = "chara_id-" + chara_id;
        let input = $('<input>').attr("type", "checkbox").attr("id", id)
            .data("effect_size", effect_size)
            .data("limit_border", limit_border)
            .data("ability_id", ability_id)
            .data("chara_id", chara_id)
            .addClass("ability_element-" + ability_info.element)
            .addClass("ability")
            .addClass(chara_id_class);
        // スキル強化可変アビリティ
        if (ability_id == 505 || ability_id == 506 || ability_id == 507 || ability_id == 508 || ability_id == 509) {
            input.addClass("strengthen_skill");
            fg_update = true;
        }
        // フィールド強化アビリティ
        if (ability_id == 603) {
            input.addClass("strengthen_field");
            fg_update = true;
        }
        let label = $('<label>')
            .attr("for", id)
            .text(`${name}: ${ability_info.ability_name} (${ability_info.ability_short_explan})`)
            .addClass("checkbox01");
        let div = $('<div>').append(input).append(label)
            .addClass(element_type + "-" + ability_info.element)
            .addClass(physical_type + "-" + ability_info.physical)
            .addClass(ability_info.target_element == 0 ? "" : `buff_target_element-${ability_info.target_element}`)
            .addClass(target)
            .addClass(chara_id_class)
            .css("display", display);
        $("#" + target).append(div);
        // if (append !== undefined) {
        //     $(div).append(append);
        // }
        if (fg_update) {
            // バフ効果量を更新
            // $(".variable_effect_size." + chara_id_class).each(function (index, value) {
            //     updateBuffEffectSize($(value), null, member_info);
            // });
        }
    }
}

// パッシブ追加
function addPassive(member_info) {
    let chara_id = member_info.style_info.chara_id;
    let style_id = member_info.style_info.style_id;
    let is_select = member_info.is_select;

    const TARGET_KIND = [
        EFFECT_ATTACKUP, // 攻撃力アップ
        EFFECT_DAMAGERATEUP, // 破壊率上昇
        EFFECT_CRITICAL_UP, // クリティカル率アップ
        EFFECT_FIELD_DEPLOYMENT, // フィールド展開
        EFFECT_STATUSUP_VALUE, // 能力固定上昇
        EFFECT_STATUSUP_RATE, // 能力%上昇
        EFFECT_FIELD_STRENGTHEN, // フィールド強化
        EFFECT_BUFF_STRENGTHEN, // バフ強化
        EFFECT.HIGH_BOOST, // ハイブースト状態
    ]
    const SUB_TARGET_KIND = [
        EFFECT_FIELD_DEPLOYMENT, // フィールド展開
        EFFECT_STATUSUP_VALUE, // 能力固定上昇
        EFFECT_STATUSUP_RATE, // 能力%上昇
        EFFECT_FIELD_STRENGTHEN, // フィールド強化
        EFFECT_BUFF_STRENGTHEN, // バフ強化
    ]
    let passive_list = skill_list.filter(obj =>
        obj.chara_id === chara_id &&
        (obj.style_id === style_id || obj.style_id === 0) &&
        obj.skill_active == 1
    );

    $.each(passive_list, function (index, value) {
        let skill_id = value.skill_id;
        let passive_info = getPassiveInfo(skill_id);
        if (!passive_info || !TARGET_KIND.includes(passive_info.effect_type)) {
            return true;
        }
        if (!is_select && !SUB_TARGET_KIND.includes(passive_info.effect_type)) {
            // 他部隊のアビリティは一部のみ許可
            return true;
        }
        let effect_size = passive_info.effect_size;
        let target_chara_id_class = "";
        let member_list = [];
        let add_check_class = "";
        let add_div_class = "";
        switch (passive_info.range_area) {
            case RANGE_FIELD: // フィールド
                addElementField(member_info, passive_info.passive_name, effect_size, 0, 0, skill_id);
                return true;
            case RANGE_ALLY_ALL: // 全員
                add_div_class = "passive_all";
                break;
            case RANGE_SELF: // 自分
                member_list = [chara_id];
                break;
            case RANGE_31E_MEMBER: // 31Eメンバー
                member_list = CHARA_ID_31E;
                break;
            case RANGE_MARUYAMA_MEMBER: // 丸山部隊
                member_list = CHARA_ID_MARUYAMA;
                break;
            default:
                break;
        }
        $.each(member_list, function (index, value) {
            target_chara_id_class += (is_select ? " passive_chara_id-" : " passive_sub_chara_id-") + value;
        });
        switch (passive_info.effect_type) {
            case EFFECT_STATUSUP_VALUE: // 能力固定上昇
            case EFFECT_STATUSUP_RATE: // 能力%上昇
                add_div_class = "passive_all";
                add_check_class = "strengthen_status";
                break;
            case EFFECT_FIELD_STRENGTHEN: // フィールド強化
                add_div_class = "passive_all";
                add_check_class = "strengthen_field";
                break;
            case EFFECT_BUFF_STRENGTHEN: // バフ強化
            case EFFECT.HIGH_BOOST: // ハイブースト状態
                add_div_class = "passive_all";
                add_check_class = "strengthen_skill";
                break;
        }

        let chara_id_class = "chara_id-" + chara_id;
        let name = (is_select ? "" : "(他部隊)") + getCharaData(chara_id).chara_short_name;
        let id = `skill_passive${skill_id}`;
        let input = $('<input>').attr("type", "checkbox").attr("id", id)
            .data("effect_size", effect_size)
            .data("skill_id", skill_id)
            .addClass("passive")
            .addClass(add_check_class)
            .addClass(chara_id_class);
        let label = $('<label>')
            .attr("for", id)
            .text(`${name}: ${passive_info.passive_name} (${passive_info.passive_short_explan})`)
            .addClass("checkbox01");
        let div = $('<div>').append(input).append(label)
            .addClass("passive_div")
            .addClass(target_chara_id_class)
            .addClass(add_div_class)
            .addClass(chara_id_class);
        $("#skill_passive").append(div);
    });
}

// 効果量取得
function getEffectSize(buff, skill_lv) {
    let effect_size = 0;
    switch (buff.buff_kind) {
        case BUFF_ATTACKUP: // 攻撃力アップ
        case BUFF_ELEMENT_ATTACKUP: // 属性攻撃力アップ
        case BUFF_MINDEYE: // 心眼
        case BUFF_CRITICALDAMAGEUP:	// クリティカルダメージアップ
        case BUFF_ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
        case BUFF_CHARGE: // チャージ
        case BUFF_DAMAGERATEUP: // 破壊率アップ
        case BUFF.YAMAWAKI_SERVANT: // 山脇様のしもべ
            effect_size = getBuffEffectSize(buff, skill_lv, "3");
            break;
        case BUFF_CRITICALRATEUP:	// クリティカル率アップ
        case BUFF_ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
            effect_size = getBuffEffectSize(buff, skill_lv, "5");
            break;
        case BUFF_DEFENSEDOWN: // 防御力ダウン
        case BUFF_ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
        case BUFF_FRAGILE: // 脆弱
        case BUFF_DEFENSEDP: // DP防御力ダウン
        case BUFF_RESISTDOWN: // 耐性ダウン
        case BUFF_ETERNAL_DEFENSEDOWN: // 永続防御ダウン
        case BUFF_ELEMENT_ETERNAL_DEFENSEDOWN: // 永続属性防御ダウン
            effect_size = getDebuffEffectSize(buff, skill_lv);
            break;
        case BUFF_FUNNEL: // 連撃
            effect_size = getFunnelEffectSize(buff);
            break;
        case BUFF_FIELD: // フィールド
            effect_size = buff.max_power;
            break;
        default:
            break;
    }
    return effect_size;
}

function getBuffKey(buffKind) {
    return `${BUFF_KBN[buffKind]}-${buffKind}`;
}

// 一度しか設定出来ないバフ
function isOnlyBuff(attackInfo, buffInfo) {
    if (!buffInfo) {
        return false;
    }
    // 初回限定
    if (buffInfo.conditions === CONDITIONS.SKILL_INIT) {
        return true;
    }

    // 攻撃スキルに付与されているバフ
    const ATTACK_BUFF_LIST = [
        BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP, BUFF.MINDEYE, BUFF.FUNNEL, BUFF.DAMAGERATEUP,
        BUFF.CRITICALRATEUP, BUFF.CRITICALDAMAGEUP]
    if (ATTACK_BUFF_LIST.includes(buffInfo.buff_kind) &&
        buffInfo.skill_attack1 &&
        buffInfo.chara_id === attackInfo.chara_id) {
        return true;
    }
    return false;
}

// 他スキルに使用出来ない攻撃バフ
function isOnlyUse(attackInfo, buffInfo) {
    if (!buffInfo) {
        return false;
    }
    if (!buffInfo.skill_attack1 || buffInfo.chara_id !== attackInfo.chara_id) {
        return false;
    }
    const attackId = attackInfo.attack_id;
    const match = [buffInfo.skill_attack1, buffInfo.skill_attack2].some(id => {
        const numId = Number(id);
        return numId === 999 || attackId === numId;
    });
    return !match;
}

// 単独発動判定
function isAloneActivation(buffInfo) {
    if (!buffInfo) {
        return false;
    }
    if (ALONE_ACTIVATION_BUFF_KIND.includes(buffInfo.buff_kind)) {
        return buffInfo.effect_count > 0;
    }
    return false;
}

// バフの最良選択
function getBestBuffKeys(buffKind, kindBuffList, buffSettingMap) {
    let combinedScore = 0;
    let combinedKeys = [];

    if (kindBuffList.length === 0) {
        return combinedKeys;
    }
    // 単独発動の中で最大値のeffect_sizeの要素を取得
    const aloneBuffs = kindBuffList.filter(buffInfo => isAloneActivation(buffInfo));
    const maxAloneBuff = aloneBuffs.reduce((max, buff) =>
        !max || buffSettingMap[buff.key].effect_size > buffSettingMap[max.key].effect_size ? buff : max, null);

    // 単独発動以外の中から、effect_sizeでソートして上位2件を取得
    const normalBuffs = kindBuffList.filter(buffInfo => !isAloneActivation(buffInfo));
    const sortedNormalBuffs = [...normalBuffs].sort((a, b) => buffSettingMap[b.key].effect_size - buffSettingMap[a.key].effect_size);
    const top1 = sortedNormalBuffs[0];
    const top2 = sortedNormalBuffs[1];

    if (top1 && top2 && ![BUFF.CHARGE, BUFF.FIELD].includes(buffKind)) {
        combinedScore = buffSettingMap[top1.key].effect_size + buffSettingMap[top2.key].effect_size;
        combinedKeys = [top1.key, top2.key];
    } else if (top1) {
        combinedScore = top1.effect_size;
        combinedKeys = [top1.key];
    }

    // 比較して大きい方を返す
    if (maxAloneBuff && buffSettingMap[maxAloneBuff.key].effect_size >= combinedScore) {
        return [maxAloneBuff.key];
    } else {
        return combinedKeys;
    }
}

// // 効果量合計
// function getSumEffectSize(class_name) {
//     let effect_size = 0;
//     $("." + class_name).each(function (index, value) {
//         let selected = $(value).find("option:selected");
//         if (selected.val() == "") {
//             return true;
//         }
//         if ($(selected).data("text_effect_size")) {
//             effect_size += Number($(selected).data("text_effect_size"));
//         } else {
//             effect_size += Number($(selected).data("effect_size"));
//         }
//     });
//     return effect_size;
// }

// // 合計バフ効果量取得
// function getSumBuffEffectSize(attack_info, grade_sum) {
//     // スキルバフ合計
//     let sum_buff = getSumEffectSize("buff");
//     // 攻撃力アップアビリティ
//     sum_buff += getSumAbilityEffectSize(EFFECT_ATTACKUP);
//     // 属性リング(0%-10%)
//     if (attack_info.attack_element != 0) {
//         sum_buff += Number($("#elememt_ring option:selected").val());
//     }
//     // オーバードライブ10%
//     if ($("#overdrive").prop("checked")) {
//         sum_buff += 10;
//     }
//     sum_buff += getChainEffectSize("skill");
//     // トークン
//     sum_buff += getSumTokenAbilirySize(EFFECT_TOKEN_ATTACKUP);
//     // 士気
//     sum_buff += Number($("#morale_count").val()) * 5;
//     // 永遠なる誓い
//     sum_buff += $("#eternal_vows").prop("checked") ? 50 : 0;
//     // オギャり
//     sum_buff += $("#babied").prop("checked") ? 30 : 0;
//     // スコアタグレード
//     if (grade_sum.power_up) {
//         sum_buff += grade_sum.power_up;
//     }
//     if (attack_info.attack_element != 0) {
//         let name = "element_power_up_" + attack_info.attack_element;
//         if (grade_sum[name]) {
//             sum_buff += grade_sum[name];
//         }
//     }
//     // 制圧戦
//     sum_buff += getBikePartsEffectSize("buff");
//     return 1 + sum_buff / 100;
// }

// // 合計デバフ効果量取得
// function getSumDebuffEffectSize() {
//     // スキルデバフ合計
//     let sum_debuff = getSumEffectSize("debuff");
//     // 防御ダウンアビリティ
//     sum_debuff += getSumAbilityEffectSize(2);
//     // 制圧戦
//     sum_debuff += getBikePartsEffectSize("debuff");
//     return 1 + sum_debuff / 100;
// }

// // 合計連撃効果量取得
// function getSumFunnelEffectList() {
//     // スキルデバフ合計
//     let funnel_list = [];
//     $(".funnel").each(function (index, value) {
//         let selected = $(value).find("option:selected");
//         if (selected.val() == "") {
//             return true;
//         }
//         let buff_info = getBuffIdToBuff(Number($(selected).val()));
//         let loop = buff_info.max_power;
//         let size = buff_info.effect_size;
//         for (let i = 0; i < loop; i++) {
//             funnel_list.push(size);
//         }
//     });

//     $("input[type=checkbox].ability:checked").each(function (index, value) {
//         if ($(value).parent().css("display") === "none") {
//             return true;
//         }
//         let ability_info = getAbilityInfo(Number($(value).data("ability_id")));
//         if (ability_info.effect_type == 6) {
//             let size = ability_info.effect_size;
//             let loop = ability_info.effect_count;
//             for (let i = 0; i < loop; i++) {
//                 funnel_list.push(size);
//             }
//         }
//     });
//     // 降順でソート
//     funnel_list.sort(function (a, b) {
//         return b - a;
//     });
//     return funnel_list;
// }

// トークン効果量
function getSumTokenEffectSize(attack_info, member_info) {
    // トークン
    let token_count = member_info.token ? member_info.token : 0;
    if (attack_info.token_power_up == 1) {
        return 1 + token_count * 16 / 100;
    }
    return 1;
}

// トークンアビリティ取得
function getSumTokenAbilirySize(effect_type) {
    let sum = 0;
    $("input[type=checkbox].ability:checked").each(function (index, value) {
        if ($(value).parent().css("display") === "none") {
            return true;
        }
        let ability_info = getAbilityInfo(Number($(value).data("ability_id")));
        if (ability_info.effect_type == effect_type) {
            let size = ability_info.effect_size;
            let chara_id = Number($(value).data("chara_id"));
            let token_count = Number($(`#token_${chara_id}`).val());
            if (!isNaN(token_count)) {
                sum += token_count * size;
            }
        }
    });
    return sum;
}

// 制圧戦のバイクパーツ取得
function getBikePartsEffectSize(buff_kind) {
    // 制圧戦以外は無し
    if ($("#enemy_class").val() != ENEMY_CLASS.CONTROL_BATTLE) {
        return 0;
    }
    let buff = 0;
    let debuff = 0;
    let critical_rate = 0;
    let critical_buff = 0;
    let destruction_rate = 0;
    for (let i = 1; i <= 3; i++) {
        let option = Number($(`#bike_parts_${i}`).val());
        switch (option) {
            case 1: // 攻撃＋
                buff += 20;
                break;
            case 2: // クリティカル率＋
                critical_rate += 30;
                break;
            case 4: // 敵防御ダウン
                debuff += 30;
                break;
            case 5: // 攻撃＋＋
                buff += 50;
                break;
            case 7: // クリティカル率ダメージ＋
                critical_buff += 30;
                break;
            case 9: // 破壊率＋
                destruction_rate += 100;
                break;
            case 10: // 攻撃＋改
                buff += 40;
                break;
            case 11: // クリティカル率＋改
                critical_rate += 45;
                break;
            case 12: // 敵防御ダウン改
                debuff += 30;
                break;
            case 13: // 攻撃＋＋改
                buff += 65;
                break;
            case 14: // クリティカル率ダメージ＋改
                critical_buff += 40;
                break;
            case 16: // 破壊率＋改
                destruction_rate += 120;
                break;
        }
    }
    switch (buff_kind) {
        case "buff":
            return buff;
        case "debuff":
            return debuff;
        case "critical_rate":
            return critical_rate;
        case "critical_buff":
            return critical_buff;
        case "destruction_rate":
            return destruction_rate;
        default:
            return 0;
    }
}

// // クリティカル率取得
// function getCriticalRate(member_info) {
//     let critical_rate = 1.5;
//     let diff = (member_info.luk - Number($("#enemy_stat").val()));
//     critical_rate += diff > 0 ? diff * 0.04 : 0;
//     critical_rate = critical_rate > 15 ? 15 : critical_rate;
//     critical_rate += getSumEffectSize("critical_rate");
//     critical_rate += getSumAbilityEffectSize(3);
//     critical_rate += $("#charge").prop("selectedIndex") > 0 ? 20 : 0;
//     let grade_sum = getGradeSum();
//     critical_rate -= grade_sum.critical;
//     critical_rate = critical_rate < 0 ? 0 : critical_rate;
//     // 永遠なる誓い
//     critical_rate += $("#eternal_vows").prop("checked") ? 50 : 0;
//     // 制圧戦
//     critical_rate += getBikePartsEffectSize("critical_rate");
//     return critical_rate > 100 ? 100 : critical_rate;
// }

// // クリティカルバフ取得
// function getCriticalBuff() {
//     let critical_buff = 50;
//     critical_buff += getSumEffectSize("critical_buff");
//     critical_buff += getSumAbilityEffectSize(4);
//     // 制圧戦
//     critical_buff += getBikePartsEffectSize("critical_buff");
//     // セラフ遭遇戦
//     if ($("#enemy_class").val() == ENEMY_CLASS.SERAPH_ENCOUNTER) {
//         critical_buff += getCardEffect("CLIRICAL_DAMAGE");
//     }
//     return 1 + critical_buff / 100;
// }

// アビリティ効果量合計取得
function getSumAbilityEffectSize(effect_type, is_select, chara_id) {
    let ability_effect_size = 0;
    let sum_none_effect_size = 0;
    let sum_physical_effect_size = 0;
    let sum_element_effect_size = 0;
    let activation_none_effect_size = 0;
    let activation_physical_effect_size = 0;
    let activation_element_effect_size = 0;
    let sp_cost_down = 0;
    if ($("#ability_all72").prop("checked")) {
        sp_cost_down = 1;
    }
    // ハイブースト状態
    if ($("#skill_passive635").prop("checked")) {
        sp_cost_down = -2;
    }
    $("input[type=checkbox].ability:checked").each(function (index, value) {
        let ability_id = Number($(value).data("ability_id"));
        if (ability_id == 602) {
            // キレアジ
            let attack_info = getAttackInfo();
            if (attack_info.sp_cost - sp_cost_down > 8) {
                return true;
            }
        }
        let ability_info = getAbilityInfo(ability_id);
        let effect_size = 0;
        if (ability_info.effect_type == effect_type) {
            effect_size = Number($(value).data("effect_size"));
        }
        if ($(value).parent().find("select").length > 0) {
            effect_size *= Number($(value).parent().find("select").val());
        }
        if (ALONE_ACTIVATION_ABILITY_LIST.includes(ability_id)) {
            if (ability_info.element != 0) {
                activation_element_effect_size = Math.max(activation_element_effect_size, effect_size);
            } else if (ability_info.physical != 0) {
                activation_physical_effect_size = Math.max(activation_physical_effect_size, effect_size);
            } else {
                activation_none_effect_size = Math.max(activation_none_effect_size, effect_size);
            }
        } else {
            if (ability_info.element != 0) {
                sum_element_effect_size += effect_size;
            } else if (ability_info.physical != 0) {
                sum_physical_effect_size += effect_size;
            } else {
                sum_none_effect_size += effect_size;
            }
        }
    });
    ability_effect_size += activation_none_effect_size + sum_none_effect_size
        + activation_physical_effect_size + sum_physical_effect_size
        + activation_element_effect_size + sum_element_effect_size;
    $("input[type=checkbox].passive:checked").each(function (index, value) {
        let select = $(value).parent();
        if (chara_id) {
            if (!select.hasClass((is_select ? "passive_chara_id-" : "passive_sub_chara_id-") + chara_id)) {
                return true;
            }
        }
        let skill_id = Number($(value).data("skill_id"));
        let passive_info = getPassiveInfo(skill_id);
        let effect_size = 0;
        if (passive_info.effect_type == effect_type) {
            effect_size = Number($(value).data("effect_size"));
        }
        // ハイブースト状態
        if (skill_id == 635 && effect_type == EFFECT.ATTACKUP) {
            ability_effect_size += 180;
        } else {
            ability_effect_size += effect_size;
        }
    });
    return ability_effect_size;
}

// 破壊率アップ効果量取得
// function getDestructionEffectSize(hit_count) {
//     let destruction_effect_size = 100;
//     let grade_sum = getGradeSum();
//     destruction_effect_size += getSumEffectSize("destruction_rete_up");
//     destruction_effect_size += getSumAbilityEffectSize(5);
//     destruction_effect_size += getSumTokenAbilirySize(EFFECT_TOKEN_DAMAGERATEUP)
//     destruction_effect_size += getEarringEffectSize("blast", 10 - hit_count);
//     destruction_effect_size += getChainEffectSize("blast");
//     // 制圧戦
//     destruction_effect_size += getBikePartsEffectSize("destruction_rate");
//     destruction_effect_size += grade_sum.destruction;
//     return destruction_effect_size / 100;
// }

// アビリティ情報取得
function getAbilityInfo(ability_id) {
    const filtered_ability = ability_list.filter((obj) => obj.ability_id == ability_id);
    return filtered_ability.length > 0 ? filtered_ability[0] : undefined;
}

// パッシブ情報取得
function getPassiveInfo(skill_id) {
    const filtered_passive = skill_passive.filter((obj) => obj.skill_id == skill_id);
    return filtered_passive.length > 0 ? filtered_passive[0] : undefined;
}

// キャラIDからメンバー情報取得
function getCharaIdToMember(chara_id) {
    const filtered_member = (style_list) => {
        const filter_list = style_list.filter((obj) => obj?.style_info?.chara_id == chara_id);
        return filter_list.length > 0 ? filter_list[0] : undefined;
    }
    let member;
    member = filtered_member(select_style_list)
    if (!member) {
        member = filtered_member(sub_style_list)
    }
    if (!member) {
        member = filtered_member(support_style_list)
    }
    return member;
}

// 敵情報取得
function getEnemyInfo() {
    const enemy_class = Number($("#enemy_class option:selected").val());
    const enemy_class_no = Number($("#enemy_list option:selected").val());
    const filtered_enemy = enemy_list.filter((obj) => obj.enemy_class == enemy_class && obj.enemy_class_no === enemy_class_no);
    return filtered_enemy.length > 0 ? filtered_enemy[0] : undefined;
}

// グレード情報取得
function getGradeSum(enemy_info) {
    if (!enemy_info) {
        enemy_info = getEnemyInfo();
    }
    let grade_sum = {
        "score_attack_no": 0, "half": 0, "grade_no": 0, "grade_rate": 0, "grade_none": 0,
        "step_turn": 0, "defense_rate": 0, "dp_rate": 0, "hp_rate": 0, "physical_1": 0, "physical_2": 0, "physical_3": 0,
        "element_0": 0, "element_1": 0, "element_2": 0, "element_3": 0, "element_4": 0, "element_5": 0, "destruction": 0, "critical": 0
    };
    if (enemy_info == undefined || enemy_info.enemy_class != ENEMY_CLASS_SCORE_ATTACK) {
        // スコアタ以外の場合は、基本値
        return grade_sum;
    }
    let checked_id = $('input[name="rule_tab"]:checked').attr('id');
    $("." + checked_id + ":checked").each(function (index, value) {
        let grade_no = Number($(value).data("grade_no"));
        let half = Number(checked_id.match(/\d+/g));
        grade_list.filter((obj) => obj.score_attack_no == enemy_info.sub_no && obj.half == half && obj.grade_no == grade_no).forEach(grade => {
            grade_sum["grade_rate"] += grade["grade_rate"];
            if (grade.grade_none == 1) {
                return true;
            }
            [1, 2, 3, 4].forEach(index => {
                let kind = grade["effect_kind" + index];
                if (kind == "") {
                    return;
                }
                let turn_count = 1;
                let conditions = grade["conditions" + index];
                if (conditions.includes("step_turn")) {
                    let step_turn = Number(conditions.replace("step_turn", ""));
                    turn_count = Math.floor(Number($("#turn_count").val()) / step_turn);
                } else if (conditions) {
                    if (!judgeConditions(conditions)) {
                        return
                    }
                }
                grade_sum[kind] = grade["effect_size" + index];
                grade_sum["effect_count"] = turn_count;
            });
        });
    });
    return grade_sum;
}

// 条件判定
function judgeConditions(conditions) {
    switch (conditions) {
        case "token":
            let attack_info = getAttackInfo();
            // トークン
            let token_count = Number($(`#token_${attack_info.chara_id}`).val());
            return token_count > 0;
    }
    return false;
}

// 敵ステータス更新
function updateEnemyStatus(enemy_class_no, enemy_info) {
    const enemy_class = 99;
    let filtered_enemy = enemy_list.filter((obj) => obj.enemy_class == enemy_class && obj.enemy_class_no === enemy_class_no);
    let index = enemy_list.findIndex((obj) => obj === filtered_enemy[0]);
    Object.assign(enemy_list[index], enemy_info);
}

// セラフ遭遇戦敵ステータス設定
function updateSeraphEncounter(enemy_info, selectedList) {
    let new_enemy_info = JSON.parse(JSON.stringify(enemy_info));
    selectedList.forEach((item) => {
        switch (item.effect_kind) {
            case "STAT_UP":
                new_enemy_info.enemy_stat += item.effect_size;
                break;
            case "ICE_DOWN":
                new_enemy_info.element_2 += item.effect_size;
                break;
            case "LIGHT_DOWN":
                new_enemy_info.element_4 += item.effect_size;
                break;
            case "HP_UP":
                new_enemy_info.max_hp = Math.floor(new_enemy_info.max_hp * (1 + (item.effect_size / 100)));
                break;
            case "DP_UP":
                new_enemy_info.max_dp = String(Math.floor(Number(new_enemy_info.max_dp) * (1 + (item.effect_size / 100))));
                break;
        }
    })
    // setEnemyStatus(new_enemy_info)
}

// スコア設定
function calcScore(detail, grade_magn) {
    let score_lv = Number($("#score_lv").val());
    let is_break = $("#no_break_bonus_check").prop("checked");
    let turn_count = $("#turn_count").val();
    let enemy_info = getEnemyInfo();
    let score_attack = getScoreAttack(enemy_info.sub_no);
    let num = score_lv - 100;
    let no_break_value = is_break ? no_break_bonus[num] : 0;
    let damage_bonus_avg = getDamageBonus(detail.avg_damage, num, score_attack);
    let damage_bonus_max = getDamageBonus(detail.max_damage, num, score_attack);
    let damage_bonus_min = getDamageBonus(detail.min_damage, num, score_attack);
    // 暫定固定値
    let summary_score_avg = (level_bonus[num] + no_break_value + damage_bonus_avg) * turn_bonus[turn_count] * (1 + grade_magn / 100);
    let summary_score_max = (level_bonus[num] + no_break_value + damage_bonus_max) * turn_bonus[turn_count] * (1 + grade_magn / 100);
    let summary_score_min = (level_bonus[num] + no_break_value + damage_bonus_min) * turn_bonus[turn_count] * (1 + grade_magn / 100);
    $("#lv_score").val(level_bonus[num].toLocaleString(0));
    $("#no_break_bonus").val(no_break_value.toLocaleString(0));
    $("#damage_bonus_avg").val(damage_bonus_avg.toLocaleString(0));
    $("#damage_bonus_max").val(damage_bonus_max.toLocaleString(0));
    $("#damage_bonus_min").val(damage_bonus_min.toLocaleString(0));
    $("#turn_bonus").val("×" + turn_bonus[turn_count]);
    $("#grade_bonus").val("×" + (1 + grade_magn / 100));
    $("#summary_score_avg").val(Math.floor(summary_score_avg).toLocaleString(2));
    $("#summary_score_max").val(Math.floor(summary_score_max).toLocaleString(2));
    $("#summary_score_min").val(Math.floor(summary_score_min).toLocaleString(2));
}

// ダメージボーナス算出
function getDamageBonus(damage, num, score_attack) {
    damage *= Number($("#socre_enemy_unit").val());
    // ダメージ上限
    damage = damage > 2_000_000_000 ? 2_000_000_000 : damage;
    let damage_bonus;
    let damage_limit_value;
    if (score_attack.enemy_count == 1) {
        damage_limit_value = damage_limit1[num];
    } else {
        damage_limit_value = damage_limit2[num];
    }
    if (damage <= damage_limit_value) {
        damage_bonus = damage;
    } else {
        damage_bonus = damage_limit_value * (1 + Math.log(damage / damage_limit_value));
    }
    return Math.floor(damage_bonus * score_attack.max_damage_rate / 100);
}

// 効果量ソート
function sortEffectSize(selecter) {
    // 初期選択を保存
    var selected = selecter.val();
    var item = selecter.children().sort(function (a, b) {
        var effectA = Number($(a).data("effect_size"));
        var effectB = Number($(b).data("effect_size"));
        if (effectA < effectB) {
            return 1;
        } else if (effectA > effectB) {
            return -1;
        } else {
            var valueA = Number($(a).val());
            var valueB = Number($(b).val());
            if (valueA > valueB) {
                return 1;
            } else if (valueA < valueB) {
                return -1;
            }
            return 0;
        }
    });
    selecter.append(item);
    // 初期選択を再選択
    selecter.val(selected);
}

// 攻撃情報取得
function getAttackInfo() {
    const attack_id = Number($("#attack_list option:selected").val());
    const chara_id = Number($("#attack_list option:selected").data("chara_id"));
    const filtered_attack = skill_attack.filter((obj) => obj.attack_id === attack_id);
    let attack_info = filtered_attack.length > 0 ? filtered_attack[0] : undefined;
    if (attack_info) {
        attack_info.attack_physical = getCharaData(attack_info.chara_id).physical;
        let member_info = getCharaIdToMember(chara_id);
        attack_info.style_element = member_info.style_info.element;
        attack_info.style_element2 = member_info.style_info.element2;
    }
    return attack_info;
}

// スキルデータ取得
function getSkillData(skill_id) {
    const filtered_skill = skill_list.filter((obj) => obj.skill_id == skill_id);
    return filtered_skill.length > 0 ? filtered_skill[0] : undefined;
}

// バフ情報取得
function getBuffIdToBuff(buff_id) {
    const filtered_buff = skill_buff.filter((obj) => obj.buff_id === buff_id);
    return filtered_buff.length > 0 ? filtered_buff[0] : undefined;
}

// バフ効果量
function getBuffEffectSize(buffInfo, skill_lv, target_jewel_type) {
    const NOT_JEWEL_TYPE = [BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP, BUFF.CRITICALRATEUP];
    let jewelLv = 0;
    let member_info = buffInfo.member_info;
    if (member_info.style_info && member_info.style_info.jewel_type == target_jewel_type) {
        jewelLv = member_info.jewel_lv;
    }
    if (skill_lv > buffInfo.max_lv) {
        skill_lv = buffInfo.max_lv;
    }
    // 固定量のバフ
    if (status_kbn[buffInfo.ref_status_1] == 0) {
        return buffInfo.min_power;
    }
    // 士気
    let morale = 0;
    if (member_info.is_select) {
        // morale = Number($("#morale_count").val()) * 5;
    }
    let stat_up = getStatUp(member_info) + morale;
    let status = member_info[status_kbn[buffInfo.ref_status_1]] + stat_up;
    let minPower = buffInfo.min_power * (1 + 0.03 * (skill_lv - 1));
    let maxPower = buffInfo.max_power * (1 + 0.02 * (skill_lv - 1));
    let skillStat = buffInfo.param_limit;
    let effectSize = 0;
    // 宝珠分以外
    if (status > buffInfo.param_limit) {
        effectSize += maxPower;
    } else {
        effectSize += (maxPower - minPower) / skillStat * status + minPower;
    }
    if (!NOT_JEWEL_TYPE.includes(buffInfo.buff_kind)) {
        // 宝珠強化対象外はここまで
        return effectSize;
    }
    // 宝珠分(SLvの恩恵を受けない)
    if (jewelLv > 0) {
        let jewelStat = skillStat + jewelLv * 60;
        if (status > jewelStat) {
            effectSize += buffInfo.max_power * jewelLv * 0.04
        } else {
            effectSize += ((buffInfo.max_power - buffInfo.min_power) / jewelStat * status + buffInfo.min_power) * jewelLv * 0.04;
        }
    }
    return effectSize;
}

// デバフ効果量
function getDebuffEffectSize(buff_info, skill_lv) {
    let jewel_lv = 0;
    let member_info = buff_info.member_info;
    if (member_info.style_info && member_info.style_info.jewel_type == "4") {
        jewel_lv = member_info.jewel_lv;
    }
    let enemy_stat = Number($("#enemy_stat").val());
    if (skill_lv > buff_info.max_lv) {
        skill_lv = buff_info.max_lv;
    }
    // 士気
    let morale = 0;
    if (member_info.is_select) {
        morale = Number($("#morale_count").val()) * 5;
    }
    let stat_up = getStatUp(member_info) + morale;
    let status1 = member_info[status_kbn[buff_info.ref_status_1]] + stat_up;
    let status2 = member_info[status_kbn[buff_info.ref_status_2]] + stat_up;
    let min_power = buff_info.min_power * (1 + 0.05 * (skill_lv - 1));
    let max_power = buff_info.max_power * (1 + 0.02 * (skill_lv - 1));
    let status = (status1 * 2 + status2) / 3 - enemy_stat;
    let skill_stat = buff_info.param_limit;
    let effect_size = 0;
    // 宝珠分以外
    if (status < 0) {
        effect_size += min_power;
    } else if (status < buff_info.param_limit) {
        effect_size += (max_power - min_power) / skill_stat * status + min_power;
    } else {
        effect_size += max_power;
    }
    // 宝珠分(SLvの恩恵を受けない)
    if (jewel_lv > 0) {
        let jewelStat = skill_stat + jewel_lv * 20;
        if (status < 0) {
            effect_size += buff_info.min_power * jewel_lv * 0.02;
        } else if (status < jewelStat) {
            effect_size += ((buff_info.max_power - buff_info.min_power) / jewelStat * status + buff_info.min_power) * jewel_lv * 0.02;
        } else {
            effect_size += buff_info.max_power * jewel_lv * 0.02;
        }
    }
    return effect_size;
}

// 連撃効果量
function getFunnelEffectSize(buff_info) {
    let funnel_power = buff_info.effect_size;
    let effect_size;
    let min_power = buff_info.min_power;
    let max_power = buff_info.max_power;
    if (min_power == max_power) {
        effect_size = funnel_power * min_power;
    } else {
        let member_info = buff_info.member_info;
        let status1 = member_info[status_kbn[buff_info.ref_status_1]];
        if (buff_info.param_limit > status1) {
            effect_size = funnel_power * min_power;
        } else {
            effect_size = funnel_power * max_power;
        }
    }

    return effect_size;
}

// 敵防御力取得
function getEnemyDefenceRate(grade_sum) {
    let enemy_defence_rate = 1;
    if (grade_sum.defense_rate) {
        enemy_defence_rate = 1 - grade_sum.defense_rate / 100;
    }
    let count = 1;
    if (grade_sum.effect_count !== undefined) {
        count = grade_sum.effect_count;
    }
    if ($("#skull_feather_1st_defense").is(':visible')) {
        defence_rate = 5 / 100;
        count = Number($("#skull_feather_1st_defense").val())
        enemy_defence_rate = (1 - defence_rate) ** count;
    }
    if ($("#enemy_class").val() == ENEMY_CLASS.SERAPH_ENCOUNTER) {
        enemy_defence_rate = getCardEffect("ATTACK_DOWN");
    }
    return enemy_defence_rate;
}

// ステータスアップ取得
function getStatUp(member_info) {
    let tears_of_dreams = 0;
    // 夢の泪
    if ($("#enemy_class").val() == ENEMY_CLASS_HARD_LAYER) {
        tears_of_dreams = Number($("#tears_of_dreams").val());
    }
    // メンバー全能力アップ
    let all_status_up = 0;
    if ($("#enemy_class").val() == ENEMY_CLASS_CONTROL_BATTLE) {
        all_status_up = Number($("#all_status_up").val());
    }
    // スコアタボーナス
    let score_bonus = 0;
    if ($("#enemy_class").val() == ENEMY_CLASS_SCORE_ATTACK) {
        score_bonus = getScoreAttackBonus("STAT_UP", member_info);
    }
    // パッシブ(能力固定上昇)
    let passive_status_up = getSumAbilityEffectSize(25, member_info.is_select, member_info.style_info.chara_id);
    return tears_of_dreams + all_status_up + score_bonus + passive_status_up;
}

// スコアタボーナス取得
function getScoreAttackBonus(kind, member_info) {
    let element = member_info.style_info.element;
    let element2 = member_info.style_info.element2;
    let physical = getCharaData(member_info.style_info.chara_id).physical;
    let enemy_info = getEnemyInfo();
    let effect_max = 0;
    let num = $("input[name='rule_tab']:checked").attr("id").split("_")[2];
    bonus_list.filter((obj) =>
        obj.score_attack_no == enemy_info.sub_no &&
        (obj.half == 0 || obj.half == num) &&
        obj.effect_kind == kind
    ).forEach((obj) => {
        let conditions = obj.conditions.split("_");
        switch (conditions[0]) {
            case "element":
                if (conditions[1] == element || conditions[1] == element2) {
                    if (effect_max < obj.effect_size) {
                        effect_max = obj.effect_size;
                    }
                }
                break;
            case "physical":
                if (conditions[1] == physical) {
                    if (effect_max < obj.effect_size) {
                        effect_max = obj.effect_size;
                    }
                }
                break;
        }
    })
    return effect_max;
}

// カンマ削除
function removeComma(value) {
    var regex = /[^0-9]/g;
    var newValue = "0" + value.replace(regex, '');
    return Number(newValue).toString()
}
// グラデーションを設定するメソッド
function applyGradient($element, baseColor, percent) {
    // generateGradientメソッドを呼び出してグラデーションカラーコードを取得
    let gradientColor = generateGradient(baseColor, "#FFFFFF", percent);
    // グラデーションのスタイルを組み立てる
    let gradientStyle = "linear-gradient(to right, " + baseColor + " 0%, " + gradientColor + " " + percent + "%, #FFFFFF " + percent + "%)";
    // 対象の要素にスタイルを設定
    $element.css("background", gradientStyle);
}
// グラデーションを取得するメソッド
function getApplyGradient(baseColor, percent) {
    // generateGradientメソッドを呼び出してグラデーションカラーコードを取得
    let gradientColor = generateGradient(baseColor, "#FFFFFF", percent);
    // グラデーションのスタイルを組み立てる
    let gradientStyle = "linear-gradient(to right, " + baseColor + " 0%, " + gradientColor + " " + percent + "%, #FFFFFF " + percent + "%)";
    return gradientStyle;
}
// グラデーション生成メソッド
function generateGradient(color1, color2, percent) {
    // パーセントの範囲を0～100に制限
    percent = Math.min(100, Math.max(0, percent));
    // カラーコードを16進数から10進数に変換
    function hexToRgb(hex) {
        return parseInt(hex, 16);
    }
    // カラーコードの10進数表現
    let r1 = hexToRgb(color1.substring(1, 3));
    let g1 = hexToRgb(color1.substring(3, 5));
    let b1 = hexToRgb(color1.substring(5, 7));
    let r2 = hexToRgb(color2.substring(1, 3));
    let g2 = hexToRgb(color2.substring(3, 5));
    let b2 = hexToRgb(color2.substring(5, 7));
    // パーセント位置で補間
    let r = Math.round(r1 + (r2 - r1) * (percent / 100));
    let g = Math.round(g1 + (g2 - g1) * (percent / 100));
    let b = Math.round(b1 + (b2 - b1) * (percent / 100));
    // 10進数から16進数に変換
    function rgbToHex(value) {
        let hex = value.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    let resultColor = "#" + rgbToHex(r) + rgbToHex(g) + rgbToHex(b);
    return resultColor;
}

// ダメージ詳細用グラデーション
function generateGradientFromRange(range, colorCode) {
    // 最小値と最大値を取得する
    const [minPercentage, maxPercentage] = parseRange(range);

    // RGBA形式の色コードを生成する
    const rgba1 = convertToRGBA(colorCode, 1);
    const rgba2 = convertToRGBA(colorCode, 0.5);

    // グラデーションスタイルを生成する
    const gradientStyle = `linear-gradient(to right, ${rgba1} 0%, ${rgba1} ${minPercentage}%, ${rgba2} ${minPercentage}%, ${rgba2} ${maxPercentage}%, rgba(255, 255, 255, 1) ${maxPercentage}%, rgba(255, 255, 255, 1) 100%)`;

    return gradientStyle;
}
function parseRange(range) {
    // 「～」を含まない場合、最小値と最大値が同じとみなしてその値を返す
    if (!range.includes('～')) {
        range += '～' + range;
    }

    // rangeを'～'で分割して最小値と最大値を取得し、数値に変換する
    const rangeValues = range.split('～').map(parseFloat);
    // 最小値と最大値が0未満の場合は0に設定
    const minPercentage = Math.max(0, rangeValues[0]);
    const maxPercentage = Math.max(0, rangeValues[1]);

    return [minPercentage, maxPercentage];
}
function convertToRGBA(colorCode, opacity) {
    // カラーコードからRGB値を抽出する
    const color = colorCode.substring(1); // #を取り除く
    const red = parseInt(color.substring(0, 2), 16); // R値
    const green = parseInt(color.substring(2, 4), 16); // G値
    const blue = parseInt(color.substring(4, 6), 16); // B値

    // RGBA形式の色コードを生成して返す
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}