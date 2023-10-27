
// アビリティ情報取得
function getAbilityInfo(ability_id) {
    return $.grep(ability_list,
        function (obj, index) {
            return (obj.ability_id == ability_id);
        })[0];
}


// 敵リスト作成
function createEnemyList(enemy_class) {
    $("#enemy_list").html("");
    $.each(enemy_list, function(index, value) {
        if (value.enemy_class == enemy_class) {
            var option = $('<option>')
                        .text(value.enemy_name)
                        .val(value.enemy_class_no);
            $("#enemy_list").append(option);
        }
    });
    setEnemyStatus();
}

// 敵情報取得
function getEnemyInfo() {
    let enemy_class = Number($("#enemy_class option:selected").val());
    let enemy_class_no = Number($("#enemy_list option:selected").val());
    return $.grep(enemy_list,
        function (obj, index) {
            return (obj.enemy_class == enemy_class && obj.enemy_class_no === enemy_class_no);
        })[0];
}

// 敵ステータス設定
function setEnemyStatus() {
    let enemy_info = getEnemyInfo();
    $("#enemy_stat").val(enemy_info.enemy_stat);
    $("#enemy_hp").val(enemy_info.max_hp.toLocaleString());
    $("#enemy_dp").val(enemy_info.max_dp.toLocaleString());
    $("#enemy_destruction_limit").val(enemy_info.destruction_limit);
    $("#enemy_destruction").val(enemy_info.destruction_limit);
    for (let i = 1; i <= 3; i++) {
        setEnemyElement("#enemy_physical_" + i, enemy_info["physical_" + i]);
    }
    for (let i = 0; i <= 5; i++) {
        setEnemyElement("#enemy_element_" + i, enemy_info["element_" + i]);
    }
}

// 敵耐性設定
function setEnemyElement(id, val) {
    $(id).val(val);
    $(id).removeClass("enemy_resist");
    $(id).removeClass("enemy_weak");
    if (val < 100) {
        $(id).addClass("enemy_resist");
    } else if (val >100) {
        $(id).addClass("enemy_weak");
    }
}

// 効果量ソート
function sortEffectSize(selecter) {
    var item = selecter.children().sort(function(a, b){
        var effectA= Number($(a).data("effect_size"));
        var effectB = Number($(b).data("effect_size"));
        if (effectA < effectB) {
        return 1;
        } else if (effectA > effectB) {
        return -1;
        } else {
        return 0;
        }
    });
    selecter.append(item);
}

// 攻撃情報取得
function getAttackInfo() {
    let attack_id = Number($("#attack_list option:selected").val());
    return $.grep(skill_attack,
                function (obj, index) {
                    return (obj.attack_id === attack_id);
            })[0];
}

// 基礎攻撃力取得
function getBasePower(correction) {
    let chara_no = $("#attack_list option:selected").data("chara_no");
    let jewel_lv = 0;
    if ($("#jewel_type_" + chara_no).val() == "1") {
        jewel_lv = Number($("#jewel_lv_" + chara_no ).prop("selectedIndex"));
    }
    let skill_info = getAttackInfo();

    let molecule = 0;
    let denominator = 0;
    if (skill_info.ref_status_1 != 0) {
        molecule += Number($("#" + status_kbn[skill_info.ref_status_1] + "_" + chara_no).val()) * 2;
        denominator +=2;
    }
    if (skill_info.ref_status_2 != 0) {
        molecule += Number($("#" + status_kbn[skill_info.ref_status_2] + "_" + chara_no).val());
        denominator +=1;
    }
    if (skill_info.ref_status_3 != 0) {
        molecule += Number($("#" + status_kbn[skill_info.ref_status_3] + "_" + chara_no).val());
        denominator +=1;
    }
    let enemy_stat = Number($("#enemy_stat").val()) + correction;
    let status = molecule / denominator;

    let skill_lv = Number($("#skill_lv option:selected").val());
    let min_power = skill_info.min_power * (1 + 0.05 * (skill_lv - 1));
    let max_power = skill_info.max_power * (1 + 0.02 * (skill_lv - 1)); 
    let skill_stat = skill_info.param_limit;
    let base_power;
    // 宝珠分以外
    if (enemy_stat - skill_stat / 2 > status){
        base_power = 1;
    } else if (enemy_stat > status){
        base_power = min_power / (skill_stat / 2) * (status - (enemy_stat - skill_stat / 2));
    } else if (enemy_stat + skill_stat > status){
        base_power = (max_power - min_power) / skill_stat * (status - enemy_stat) + min_power;
    } else {
        base_power = max_power;
    }

    // 宝珠分(SLvの恩恵を受けない)
    if (jewel_lv > 0) {
        let jusl_stat = skill_stat + jewel_lv * 20;
        if (enemy_stat - skill_stat / 2 > status){
            base_power += 0;
        } else if (enemy_stat > status){
            base_power += skill_info.min_power / (jusl_stat / 2) * (status - (enemy_stat - jusl_stat / 2)) * jewel_lv * 0.02;
        } else if (enemy_stat + jusl_stat > status){
            base_power += ((skill_info.max_power - skill_info.min_power) / jusl_stat * (status - enemy_stat) + skill_info.min_power) * jewel_lv * 0.02;
        } else {
            base_power += skill_info.max_power * jewel_lv * 0.02;
        }
    }
    return base_power;
}

// バフ情報取得
function getBuffIdToBuff(buff_id) {
    return $.grep(skill_buff,
        function (obj, index) {
            return (obj.buff_id === buff_id);
    })[0];
}

// バフ効果量
function getBuffEffectSize(buff_id, chara_no, skill_lv) {
    let jewel_lv = 0;
    if ($("#jewel_type_" + chara_no).val() == "3") {
        jewel_lv = Number($("#jewel_lv_" + chara_no ).prop("selectedIndex"));
    }
    let skill_info = getBuffIdToBuff(buff_id);
    if (skill_lv > skill_info.max_lv) {
        skill_lv = skill_info.max_lv;
    }
    if (skill_lv > 13) {
        skill_lv = 13;
    }
    // 固定量のバフ
    if (status_kbn[skill_info.ref_status_1] == 0) {
        return skill_info.min_power;
    }
    let status = Number($("#" + status_kbn[skill_info.ref_status_1] + "_" + chara_no).val());
    let min_power = skill_info.min_power * (1 + 0.03 * (skill_lv - 1));
    let max_power = skill_info.max_power * (1 + 0.02 * (skill_lv - 1));
    let skill_stat = skill_info.param_limit;
    let effect_size = 0;
    // 宝珠分以外
    if (status > skill_info.param_limit) {
        effect_size += max_power;
    } else {
        effect_size += (max_power - min_power) / skill_stat * status + min_power;
    }
    // 宝珠分(SLvの恩恵を受けない)
    if (jewel_lv > 0) {
        let jusl_stat = skill_stat + jewel_lv * 60;
        if (status > jusl_stat) {
            effect_size += skill_info.max_power * jewel_lv * 0.04
        } else {
            effect_size += ((skill_info.max_power - skill_info.min_power) / jusl_stat * status + skill_info.min_power) * jewel_lv * 0.04;
        }
    }
    return effect_size;
}

// デバフ効果量
function getDebuffEffectSize(buff_id, chara_no, skill_lv) {
    let jewel_lv = 0;
    if ($("#jewel_type_" + chara_no).val() == "4") {
        jewel_lv = Number($("#jewel_lv_" + chara_no ).prop("selectedIndex"));
    }
    let enemy_stat = Number($("#enemy_stat").val());
    let skill_info = getBuffIdToBuff(buff_id);
    if (skill_lv > skill_info.max_lv) {
        skill_lv = skill_info.max_lv;
    }
    if (skill_lv > 13) {
        skill_lv = 13;
    }
    let status1 = Number($("#" + status_kbn[skill_info.ref_status_1] + "_" + chara_no).val());
    let status2 = Number($("#" + status_kbn[skill_info.ref_status_2] + "_" + chara_no).val());
    let min_power = skill_info.min_power * (1 + 0.05 * (skill_lv - 1));
    let max_power = skill_info.max_power * (1 + 0.02 * (skill_lv - 1));
    let status = (status1 * 2 + status2) / 3 - enemy_stat;
    let skill_stat = skill_info.param_limit;
    let effect_size = 0;
    // 宝珠分以外
    if (status < 0) {
        effect_size += min_power;
    } else if (status < skill_info.param_limit) {
        effect_size += (max_power - min_power) / skill_stat * status + min_power;
    } else {
        effect_size += max_power;
    }
    // 宝珠分(SLvの恩恵を受けない)
    if (jewel_lv > 0) {
        let jusl_stat = skill_stat + jewel_lv * 20;
        if (status < 0) {
            effect_size += skill_info.min_power * jewel_lv * 0.02;
        } else if (status < jusl_stat) {
            effect_size += ((skill_info.max_power - skill_info.min_power) / jusl_stat * status + skill_info.min_power) * jewel_lv * 0.02;
        } else {
            effect_size += skill_info.max_power * jewel_lv * 0.02;
        }
    }
    return effect_size;
}


// 連撃効果量
function getFunnelEffectSize(buff_id, chara_no, skill_lv) {
    let skill_info = getBuffIdToBuff(buff_id)
    let funnel_power;
    if (skill_info.buff_kind == 16) {
        // 連撃(小)
        funnel_power = 10;
    } else {
        // 連撃(大)
        funnel_power = 40;
    }
    let effect_size;
    let min_power = skill_info.min_power;
    let max_power = skill_info.max_power;
    if (min_power == max_power) {
        effect_size = funnel_power * min_power;
    } else {
        let status1 = Number($("#" + status_kbn[skill_info.ref_status_1] + "_" + chara_no).val());
        if (skill_info.param_limit > status1) {
            effect_size = funnel_power * min_power;
        } else {
            effect_size = funnel_power * max_power;
        }
    }

   return effect_size;
}