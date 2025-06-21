function setEventTrigger() {
    // プレイヤーDP変更
    $(".player_dp_range").on("input", function (event) {
        let val = $(this).val();
        $("#player_dp_rate").val(val + '%');
        applyGradient($(".player_dp_range"), "#4F7C8B", val / 1.5);
    });
}

// 倍率表示
function convertToPercentage(value) {
    // 引数×100を計算し、小数点以下2桁目以降を四捨五入してパーセント記号を付ける
    const percentage = (Math.floor(value * 10000) / 100).toFixed(2) + "%";
    return percentage;
}

// ピアス効果量取得
function getEarringEffectSize(otherSetting, type, hit_count) {
    hit_count = hit_count < 1 ? 1 : hit_count;
    let earring = otherSetting.earring.split("_");
    if (earring.length === 2) {
        if (earring[0] === type) {
            let effect_size = Number(earring[1]);
            return (effect_size - (10 / 9 * (hit_count - 1)));
        }
    }
    return 0;
}

// チェーン効果量取得
function getChainEffectSize(otherSetting, type) {
    switch (otherSetting.chain) {
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
function getEnemyResist(attackInfo, state) {
    const enemyInfo = state.enemy_info;
    const correction = state.correction;
    let physical_resist = enemyInfo[`physical_${attackInfo.attack_physical}`];
    let element_resist = enemyInfo[`element_${attackInfo.attack_element}`]
        - correction[`element_${attackInfo.attack_element}`] + state.resist_down[attackInfo.attack_element];
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

// 効果量取得
function getEffectSize(buff, skillLv, state) {
    let effectSize = 0;
    switch (buff.buff_kind) {
        case BUFF_ATTACKUP: // 攻撃力アップ
        case BUFF_ELEMENT_ATTACKUP: // 属性攻撃力アップ
        case BUFF_MINDEYE: // 心眼
        case BUFF_CRITICALDAMAGEUP:	// クリティカルダメージアップ
        case BUFF_ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
        case BUFF_CHARGE: // チャージ
        case BUFF_DAMAGERATEUP: // 破壊率アップ
        case BUFF.YAMAWAKI_SERVANT: // 山脇様のしもべ
            effectSize = getBuffEffectSize(buff, skillLv, "3");
            break;
        case BUFF_CRITICALRATEUP:	// クリティカル率アップ
        case BUFF_ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
            effectSize = getBuffEffectSize(buff, skillLv, "5");
            break;
        case BUFF_DEFENSEDOWN: // 防御力ダウン
        case BUFF_ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
        case BUFF_FRAGILE: // 脆弱
        case BUFF_DEFENSEDP: // DP防御力ダウン
        case BUFF_RESISTDOWN: // 耐性ダウン
        case BUFF_ETERNAL_DEFENSEDOWN: // 永続防御ダウン
        case BUFF_ELEMENT_ETERNAL_DEFENSEDOWN: // 永続属性防御ダウン
            effectSize = getDebuffEffectSize(buff, skillLv, state);
            break;
        case BUFF_FUNNEL: // 連撃
            effectSize = getFunnelEffectSize(buff);
            break;
        case BUFF_FIELD: // フィールド
            effectSize = buff.max_power;
            break;
        default:
            break;
    }
    return effectSize;
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
    const sortedNormalBuffs = [...normalBuffs].sort(
        (a, b) => {
            if (buffSettingMap[b.key].effect_size === buffSettingMap[a.key].effect_size) {
                return b.sp_cost - a.sp_cost
            }
            return buffSettingMap[b.key].effect_size - buffSettingMap[a.key].effect_size
        });
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

function getDamageResult(attackInfo, styleList, state, selectSKillLv, selectBuffKeyMap, buffSettingMap, abilitySettingMap, otherSetting) {
    if (!attackInfo) {
        return null;
    }
    let enemyInfo = state.enemy_info;
    let attackMemberInfo = styleList.selectStyleList.filter(style => style?.style_info.chara_id === attackInfo.chara_id)[0];
    if (!attackMemberInfo) {
        return null;
    }

    // // グレード
    // let grade_sum = getGradeSum();
    // // メンバー
    // let chara_id = $("#attack_list option:selected").data("chara_id");

    // // 闘志
    // let fightingspirit = $("#fightingspirit").prop("checked") ? 20 : 0;
    // // 厄
    // let misfortune = $("#misfortune").prop("checked") ? 20 : 0;
    // // ハッキング
    // let hacking = $("#hacking").prop("checked") ? 100 : 0;

    // // 士気
    let morale = attackMemberInfo.morale ? attackMemberInfo.morale * 5 : 0;
    // let stat_up = getStatUp(member_info)
    let statUp = morale;
    // // 闘志or士気
    // stat_up += (morale > fightingspirit ? morale : fightingspirit);
    // // 厄orハッキング
    // let stat_down = hacking || misfortune;
    let enemyStatDown = 0;

    let skillPower = getSkillPower(attackInfo, selectSKillLv, attackMemberInfo, statUp, enemyInfo, enemyStatDown);
    let buff = getSumBuffEffectSize(attackMemberInfo, selectBuffKeyMap, buffSettingMap, abilitySettingMap, otherSetting);
    // let mindeye_buff = getSumEffectSize("mindeye") + getSumEffectSize("servant");
    let mindeye = 1 + getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.MINDEYE]) / 100;
    let debuff = getSumDebuffEffectSize(selectBuffKeyMap, buffSettingMap, abilitySettingMap);
    let debuffDp = getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.DEFENSEDP]) / 100;

    let fragile = 1 + getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.FRAGILE]) / 100;

    let damageRateUp = getDamagerateEffectSize(selectBuffKeyMap, buffSettingMap, abilitySettingMap, otherSetting, attackInfo.hit_count);
    let funnelList = getSumFunnelEffectList(selectBuffKeyMap, abilitySettingMap);

    // let token = getSumTokenEffectSize(attack_info, member_info);
    let field = 1 + getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.FIELD]) / 100;
    let [physical, element] = getEnemyResist(attackInfo, state);
    // let enemy_defence_rate = getEnemyDefenceRate(grade_sum);

    // 表示用
    let funnel = 1 + funnelList.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / 100;
    let special = 1 + Number(state.dpRate[0] == 0 ? attackInfo.hp_damege / 100 : attackInfo.dp_damege / 100);

    // 個別設定
    let skill_unique_rate = 1;
    // // バーチカルフォース/パドマ・ナーチュナー/ディナミコ・アチェーゾ
    // if (attack_info.attack_id == 115 || attack_info.attack_id == 2167 || attack_info.attack_id == 187) {
    //     let dp_rate = Number($("#skill_unique_dp_rate").val());
    //     dp_rate = dp_rate < 60 ? 60 : dp_rate;
    //     skill_unique_rate += (dp_rate - 100) / 200
    // }
    // // 花舞う、可憐のフレア/プレゼント・フォー・ユー
    // if (attack_info.attack_id == 136 || attack_info.attack_id == 166) {
    //     let dp_rate = Number($("#skill_unique_dp_rate").val());
    //     dp_rate = dp_rate > 100 ? 100 : dp_rate;
    //     skill_unique_rate += (100 - dp_rate) / 100 * 75 / 100;
    // }
    // // コーシュカ・アルマータ/疾きこと風の如し
    // if (attack_info.attack_id == 2162 || attack_info.attack_id == 154 || attack_info.attack_id == 155) {
    //     let sp = Number($("#skill_unique_sp").val());
    //     skill_unique_rate = (sp > 30 ? 30 : sp) / 30;
    // }
    // // 桜花の矢
    // if (attack_info.chara_id == 45 && $("#skill_unique_cherry_blossoms").prop("checked")) {
    //     buff += 0.5
    // }
    // // 影分身(アーデルハイト)
    // if (attack_info.chara_id == 17 && $("#skill_unique_shadow_clone").prop("checked")) {
    //     buff += 0.3;
    // }
    // // 影分身(マリー)
    // if (attack_info.chara_id == 18 && $("#skill_unique_shadow_clone").prop("checked")) {
    //     buff += 0.3;
    // }

    let criticalPower = getSkillPower(attackInfo, selectSKillLv, attackMemberInfo, statUp, enemyInfo, 50);
    let criticalRate = getCriticalRate(attackMemberInfo, enemyInfo, selectBuffKeyMap, buffSettingMap, abilitySettingMap);
    let criticalBuff = getCriticalBuff(selectBuffKeyMap, buffSettingMap, abilitySettingMap);

    let token = 1;
    let enemy_defence_rate = 1;

    let fixed = mindeye * fragile * token * field * physical / 100 * element / 100 * enemy_defence_rate * skill_unique_rate;
    const normalAvgResult =
        calculateDamage(state, skillPower, attackInfo, buff, debuff, debuffDp, fixed, damageRateUp, funnelList, otherSetting);
    const normalMinResult =
        calculateDamage(state, skillPower * 0.9, attackInfo, buff, debuff, debuffDp, fixed, damageRateUp, funnelList, otherSetting);
    const normalMaxResult =
        calculateDamage(state, skillPower * 1.1, attackInfo, buff, debuff, debuffDp, fixed, damageRateUp, funnelList, otherSetting);
    const criticalAvgResult =
        calculateDamage(state, criticalPower, attackInfo, buff, debuff, debuffDp, fixed * criticalBuff, damageRateUp, funnelList, otherSetting);
    const criticalMinResult =
        calculateDamage(state, criticalPower * 0.9, attackInfo, buff, debuff, debuffDp, fixed * criticalBuff, damageRateUp, funnelList, otherSetting);
    const criticalMaxResult =
        calculateDamage(state, criticalPower * 1.1, attackInfo, buff, debuff, debuffDp, fixed * criticalBuff, damageRateUp, funnelList, otherSetting);

    if (state.dpRate[0] > 0) {
        debuff += debuffDp;
    }

    return {
        normalResult: {
            avg: normalAvgResult,
            min: normalMinResult,
            max: normalMaxResult,
            skillPower: skillPower,
        },
        criticalResult: {
            avg: criticalAvgResult,
            min: criticalMinResult,
            max: criticalMaxResult,
            skillPower: criticalPower,
        },
        buff: convertToPercentage(buff),
        debuff: convertToPercentage(debuff),
        special: convertToPercentage(special),
        funnel: convertToPercentage(funnel),
        physical: convertToPercentage(physical / 100),
        element: convertToPercentage(element / 100),
        token: convertToPercentage(token),
        mindeye: convertToPercentage(mindeye),
        fragile: convertToPercentage(fragile),
        field: convertToPercentage(field),
        damageRate: state.damageRate + "%",
        criticalRate: criticalRate,
        criticalBuff: convertToPercentage(criticalBuff),
    }
}

// ダメージの詳細計算
function calculateDamage(state, basePower, attackInfo, buff, debuff, debuffDp, fixed, damageRateUp, funnelList, otherSetting) {
    let enemyInfo = state.enemy_info;
    let damageRate = state.damageRate;
    let maxDamageRate = state.maxDamageRate;
    let destruction = Number(enemyInfo.destruction);
    let dpPenetration = state.dpRate.length == 1 || state.dpRate[1] == 0;
    let restDp = Array(state.dpRate.length).fill(0);
    let dp_no = -1;  // 現在の使用DPゲージ番号を取得
    for (let i = 0; i < state.dpRate.length; i++) {
        restDp[i] = 0;
        if (state.dpRate[i] > 0) {
            restDp[i] = Number(enemyInfo.max_dp.split(",")[i]) * state.dpRate[i] / 100;
        }
        if (restDp[i] > 0) {
            dp_no = i;
        }
    }
    let restHp = enemyInfo.max_hp * state.hpRate / 100;
    let hitCount = attackInfo.hit_count;
    let destruction_size = destruction * attackInfo.destruction * damageRateUp;
    let damage = 0;
    let special;

    // ダメージ処理
    function procDamage(power, addDestruction) {
        let addBuff = 0;
        let addDebuff = 0;
        if (restDp[0] <= 0 && dpPenetration) {
            special = 1 + attackInfo.hp_damege / 100;
            addBuff = getEarringEffectSize(otherSetting, "attack", hitCount) / 100;
            addDebuff = 0;
        } else {
            special = 1 + attackInfo.dp_damege / 100;
            addBuff = getEarringEffectSize(otherSetting, "break", hitCount) / 100;
            addDebuff = debuffDp;
        }
        let hitDamage = Math.floor(power * (buff + addBuff) * (debuff + addDebuff) * fixed * special * damageRate / 100);

        if (restDp[dp_no] > 0) {
            restDp[dp_no] -= hitDamage;
        } else if (dp_no >= 1) {
            restDp[dp_no - 1] -= hitDamage;
        } else {
            restHp -= hitDamage;
        }
        if (restDp[0] <= 0 && dpPenetration) {
            damageRate += addDestruction;
            if (damageRate > maxDamageRate) damageRate = maxDamageRate;
        }
        damage += hitDamage
    }
    // 通常分ダメージ処理
    let hitList = [];
    if (attackInfo.damege_distribution) {
        hitList = attackInfo.damege_distribution.split(",");
    } else {
        const value = 100 / hitCount;
        hitList = new Array(hitCount).fill(value);
    }
    hitList.forEach(value => {
        procDamage(basePower * value / 100, destruction_size / hitCount);
    });
    // 連撃分ダメージ処理
    funnelList.forEach(value => {
        procDamage(basePower * value / 100, destruction_size * value / 100);
    });

    const billion = 1_000_000_000;
    if (damage > billion) {
        damage = billion * (2 - Math.exp(0.7 - 0.7 * (damage / billion)));
    }
    if (damage > billion * 2) {
        damage = billion * 2;
    }

    return {
        damage: Math.floor(damage),
        restDp: restDp,
        restHp: restHp,
        damageRate: Math.round(damageRate * 10) / 10,
    };
}

// 基礎攻撃力取得
function getSkillPower(attackInfo, selectSKillLv, memberInfo, statUp, enemyInfo, enemyStatDown) {
    let jewelLv = 0;
    if (memberInfo.style_info.jewel_type == "1") {
        jewelLv = memberInfo.jewel_lv;
    }
    let molecule = 0;
    let denominator = 0;
    if (attackInfo.ref_status_1 != 0) {
        molecule += (memberInfo[status_kbn[attackInfo.ref_status_1]] + statUp) * 2;
        denominator += 2;
    }
    if (attackInfo.ref_status_2 != 0) {
        molecule += memberInfo[status_kbn[attackInfo.ref_status_2]] + statUp;
        denominator += 1;
    }
    if (attackInfo.ref_status_3 != 0) {
        molecule += memberInfo[status_kbn[attackInfo.ref_status_3]] + statUp;
        denominator += 1;
    }
    let enemyStat = enemyInfo.enemy_stat - enemyStatDown;
    let status = molecule / denominator;

    let minPower = attackInfo.min_power * (1 + 0.05 * (selectSKillLv - 1));
    let maxPower = attackInfo.max_power * (1 + 0.02 * (selectSKillLv - 1));
    let skillStat = attackInfo.param_limit;
    let basePower;
    // 宝珠分以外
    if (enemyStat - skillStat / 2 > status) {
        basePower = 1;
    } else if (enemyStat > status) {
        basePower = minPower / (skillStat / 2) * (status - (enemyStat - skillStat / 2));
    } else if (enemyStat + skillStat > status) {
        basePower = (maxPower - minPower) / skillStat * (status - enemyStat) + minPower;
    } else {
        basePower = maxPower;
    }

    // 宝珠分(SLvの恩恵を受けない)
    if (jewelLv > 0) {
        let jewelStat = skillStat + jewelLv * 20;
        if (enemyStat - skillStat / 2 > status) {
            basePower += 0;
        } else if (enemyStat > status) {
            basePower += attackInfo.min_power / (jewelStat / 2) * (status - (enemyStat - jewelStat / 2)) * jewelLv * 0.02;
        } else if (enemyStat + jewelStat > status) {
            basePower += ((attackInfo.max_power - attackInfo.min_power) / jewelStat * (status - enemyStat) + attackInfo.min_power) * jewelLv * 0.02;
        } else {
            basePower += attackInfo.max_power * jewelLv * 0.02;
        }
    }
    return Math.floor(basePower * 100) / 100;
}

// 効果量合計
function getSumEffectSize(selectBuffKeyMap, buffSettingMap, BUFF_KIND_LIST) {
    let effectSize = 0;
    BUFF_KIND_LIST.forEach(buffKind => {
        const buffKey = getBuffKey(buffKind);
        const selectedKeys = selectBuffKeyMap[buffKey];
        if (selectedKeys) {
            selectedKeys.forEach(selectedKey => {
                if (selectedKey.length > 0) {
                    effectSize += buffSettingMap[selectedKey]?.effect_size;
                }
            })
        }
    });
    return effectSize;
}

// 合計バフ効果量取得
function getSumBuffEffectSize(attackMemberInfo, selectBuffKeyMap, buffSettingMap, abilitySettingMap, otherSetting) {
    // スキルバフ合計
    let sumBuff = getSumEffectSize(selectBuffKeyMap, buffSettingMap,
        [BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP, BUFF.CHARGE]);
    // 攻撃力アップアビリティ
    sumBuff += getSumAbilityEffectSize(abilitySettingMap, EFFECT.ATTACKUP);
    // 属性リング(0%-10%)
    sumBuff += Number(otherSetting.ring);
    // オーバードライブ10%
    if (otherSetting.overdrive) {
        sumBuff += 10;
    }
    sumBuff += getChainEffectSize(otherSetting, "skill");
    // // トークン
    // sum_buff += getSumTokenAbilirySize(EFFECT_TOKEN_ATTACKUP);
    // 士気
    sumBuff += attackMemberInfo.morale ? attackMemberInfo.morale * 5 : 0;
    // // 永遠なる誓い
    // sum_buff += $("#eternal_vows").prop("checked") ? 50 : 0;
    // // オギャり
    // sum_buff += $("#babied").prop("checked") ? 30 : 0;
    // // スコアタグレード
    // if (grade_sum.power_up) {
    //     sum_buff += grade_sum.power_up;
    // }
    // // 制圧戦
    // sum_buff += getBikePartsEffectSize("buff");
    return 1 + sumBuff / 100;
}

// 合計デバフ効果量取得
function getSumDebuffEffectSize(selectBuffKeyMap, buffSettingMap, abilitySettingMap) {
    // スキルデバフ合計
    let sumBuff = getSumEffectSize(selectBuffKeyMap, buffSettingMap,
        [BUFF.DEFENSEDOWN, BUFF.ELEMENT_DEFENSEDOWN, BUFF.ETERNAL_DEFENSEDOWN, BUFF.ELEMENT_ETERNAL_DEFENSEDOWN]);
    // // 防御ダウンアビリティ
    sumBuff += getSumAbilityEffectSize(abilitySettingMap, EFFECT.DEFFENCEDOWN);
    // // 制圧戦
    // sum_debuff += getBikePartsEffectSize("debuff");
    return 1 + sumBuff / 100;
}

// 合計連撃効果量取得
function getSumFunnelEffectList(selectBuffKeyMap, abilitySettingMap) {
    let funnel_list = [];

    // スキルデバフ合計
    const funnelKey = getBuffKey(BUFF.FUNNEL);
    const selectedKey = selectBuffKeyMap[funnelKey];
    if (selectedKey) {
        selectedKey.forEach(selectedKey => {
            let buffId = Number(selectedKey.split('-')[0]);
            let buffInfo = getBuffIdToBuff(buffId);
            if (buffInfo) {
                let loop = buffInfo.max_power;
                let size = buffInfo.effect_size;
                for (let i = 0; i < loop; i++) {
                    funnel_list.push(size);
                }
            }
        })
    }

    Object.keys(abilitySettingMap).forEach(function (key) {
        let data = abilitySettingMap[key];
        if (data.checked) {
            let abilityId = Number(data.ability_id)
            let abilityInfo = getAbilityInfo(abilityId);
            if (abilityInfo.effect_type == EFFECT.FUNNEL) {
                let size = abilityInfo.effect_size;
                let loop = abilityInfo.effect_count;
                for (let i = 0; i < loop; i++) {
                    funnel_list.push(size);
                }
            }
        }
    })

    // 降順でソート
    funnel_list.sort(function (a, b) {
        return b - a;
    });
    return funnel_list;
}

// 破壊率上昇
function getDamagerateEffectSize(selectBuffKeyMap, buffSettingMap, abilitySettingMap, otherSetting, hit_count) {
    let destructionEffectSize = 100;
    destructionEffectSize += getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.DAMAGERATEUP]);
    destructionEffectSize += getSumAbilityEffectSize(abilitySettingMap, EFFECT.DAMAGERATEUP);
    // destruction_effect_size += getSumTokenAbilirySize(EFFECT_TOKEN_DAMAGERATEUP)
    destructionEffectSize += getEarringEffectSize(otherSetting, "blast", 10 - hit_count);
    // // 制圧戦
    // destruction_effect_size += getBikePartsEffectSize("destruction_rate");
    // let grade_sum = getGradeSum();
    // destruction_effect_size += grade_sum.destruction;
    return destructionEffectSize / 100;
}

// クリティカル率取得
function getCriticalRate(attackMemberInfo, enemyInfo, selectBuffKeyMap, buffSettingMap, abilitySettingMap) {
    let criticalRate = 1.5;
    let diff = (attackMemberInfo.luk - enemyInfo.enemy_stat);
    criticalRate += diff > 0 ? diff * 0.04 : 0;
    criticalRate = criticalRate > 15 ? 15 : criticalRate;
    criticalRate += getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.CRITICALRATEUP, BUFF.ELEMENT_CRITICALRATEUP]);
    criticalRate += getSumAbilityEffectSize(abilitySettingMap, EFFECT.CRITICALRATEUP);
    // critical_rate += $("#charge").prop("selectedIndex") > 0 ? 20 : 0;
    // let grade_sum = getGradeSum();
    // critical_rate -= grade_sum.critical;
    // critical_rate = critical_rate < 0 ? 0 : critical_rate;
    // // 永遠なる誓い
    // critical_rate += $("#eternal_vows").prop("checked") ? 50 : 0;
    // // 制圧戦
    // critical_rate += getBikePartsEffectSize("critical_rate");
    return criticalRate > 100 ? 100 : criticalRate;
}

// クリティカルバフ取得
function getCriticalBuff(selectBuffKeyMap, buffSettingMap, abilitySettingMap) {
    let criticalBuff = 50;
    criticalBuff += getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.CRITICALDAMAGEUP, BUFF.ELEMENT_CRITICALDAMAGEUP]);
    criticalBuff += getSumAbilityEffectSize(abilitySettingMap, EFFECT.CRITICALDAMAGEUP);
    // // 制圧戦
    // critical_buff += getBikePartsEffectSize("critical_buff");
    // // セラフ遭遇戦
    // if ($("#enemy_class").val() == ENEMY_CLASS.SERAPH_ENCOUNTER) {
    //     critical_buff += getCardEffect("CLIRICAL_DAMAGE");
    // }
    return 1 + criticalBuff / 100;
}
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

// アビリティ効果量合計取得
function getSumAbilityEffectSize(abilitySettingMap, effect_type) {
    let abilityEffectSize = 0;
    let sumNoneEffectSize = 0;
    let sumPhysicalEffectSize = 0;
    let sumElementEffectSize = 0;
    let activationNoneEffectSize = 0;
    let activationPhysicalEffectSize = 0;
    let activationElementEffectSize = 0;
    let spCostSwing = 0;
    // if ($("#ability_all72").prop("checked")) {
    //     sp_cost_down = 1;
    // }
    // // ハイブースト状態
    // if ($("#skill_passive635").prop("checked")) {
    //     sp_cost_down = -2;
    // }
    Object.keys(abilitySettingMap).forEach(function (key) {
        let data = abilitySettingMap[key];
        if (data.checked) {
            let abilityId = Number(data.ability_id)
            let abilityInfo = getAbilityInfo(abilityId);
            if (abilityInfo.effect_type == effect_type) {
                let effectSize = abilityInfo.effect_size;
                if (ALONE_ACTIVATION_ABILITY_LIST.includes(abilityId)) {
                    if (abilityInfo.element != 0) {
                        activationElementEffectSize = Math.max(activationElementEffectSize, effectSize);
                    } else if (abilityInfo.physical != 0) {
                        activationPhysicalEffectSize = Math.max(activationPhysicalEffectSize, effectSize);
                    } else {
                        activationNoneEffectSize = Math.max(activationNoneEffectSize, effectSize);
                    }
                } else {
                    if (abilityInfo.element != 0) {
                        sumElementEffectSize += effectSize;
                    } else if (abilityInfo.physical != 0) {
                        sumPhysicalEffectSize += effectSize;
                    } else {
                        sumNoneEffectSize += effectSize;
                    }
                }
            }
        }
    })
    // $("input[type=checkbox].ability:checked").each(function (index, value) {
    //     let ability_id = Number($(value).data("ability_id"));
    //     if (ability_id == 602) {
    //         // キレアジ
    //         let attack_info = getAttackInfo();
    //         if (attack_info.sp_cost - sp_cost_down > 8) {
    //             return true;
    //         }
    //     }
    //     let ability_info = getAbilityInfo(ability_id);
    //     let effect_size = 0;
    //     if (ability_info.effect_type == effect_type) {
    //         effect_size = Number($(value).data("effect_size"));
    //     }
    //     if ($(value).parent().find("select").length > 0) {
    //         effect_size *= Number($(value).parent().find("select").val());
    //     }
    //     if (ALONE_ACTIVATION_ABILITY_LIST.includes(ability_id)) {
    //         if (ability_info.element != 0) {
    //             activationElementEffectSize = Math.max(activationElementEffectSize, effect_size);
    //         } else if (ability_info.physical != 0) {
    //             activationPhysicalEffectSize = Math.max(activationPhysicalEffectSize, effect_size);
    //         } else {
    //             activationNoneEffectSize = Math.max(activationNoneEffectSize, effect_size);
    //         }
    //     } else {
    //         if (ability_info.element != 0) {
    //             sum_element_effect_size += effect_size;
    //         } else if (ability_info.physical != 0) {
    //             sumPhysicalEffectSize += effect_size;
    //         } else {
    //             sumNoneEffectSize += effect_size;
    //         }
    //     }
    // });
    abilityEffectSize += activationNoneEffectSize + sumNoneEffectSize
        + activationPhysicalEffectSize + sumPhysicalEffectSize
        + activationElementEffectSize + sumElementEffectSize;
    // $("input[type=checkbox].passive:checked").each(function (index, value) {
    //     let select = $(value).parent();
    //     if (chara_id) {
    //         if (!select.hasClass((is_select ? "passive_chara_id-" : "passive_sub_chara_id-") + chara_id)) {
    //             return true;
    //         }
    //     }
    //     let skill_id = Number($(value).data("skill_id"));
    //     let passive_info = getPassiveInfo(skill_id);
    //     let effect_size = 0;
    //     if (passive_info.effect_type == effect_type) {
    //         effect_size = Number($(value).data("effect_size"));
    //     }
    //     // ハイブースト状態
    //     if (skill_id == 635 && effect_type == EFFECT.ATTACKUP) {
    //         ability_effect_size += 180;
    //     } else {
    //         ability_effect_size += effect_size;
    //     }
    // });
    return abilityEffectSize;
}

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

// // ダメージボーナス算出
// function getDamageBonus(damage, num, score_attack) {
//     damage *= Number($("#socre_enemy_unit").val());
//     // ダメージ上限
//     damage = damage > 2_000_000_000 ? 2_000_000_000 : damage;
//     let damage_bonus;
//     let damage_limit_value;
//     if (score_attack.enemy_count == 1) {
//         damage_limit_value = damage_limit1[num];
//     } else {
//         damage_limit_value = damage_limit2[num];
//     }
//     if (damage <= damage_limit_value) {
//         damage_bonus = damage;
//     } else {
//         damage_bonus = damage_limit_value * (1 + Math.log(damage / damage_limit_value));
//     }
//     return Math.floor(damage_bonus * score_attack.max_damage_rate / 100);
// }

// 効果量ソート
// function sortEffectSize(selecter) {
//     // 初期選択を保存
//     var selected = selecter.val();
//     var item = selecter.children().sort(function (a, b) {
//         var effectA = Number($(a).data("effect_size"));
//         var effectB = Number($(b).data("effect_size"));
//         if (effectA < effectB) {
//             return 1;
//         } else if (effectA > effectB) {
//             return -1;
//         } else {
//             var valueA = Number($(a).val());
//             var valueB = Number($(b).val());
//             if (valueA > valueB) {
//                 return 1;
//             } else if (valueA < valueB) {
//                 return -1;
//             }
//             return 0;
//         }
//     });
//     selecter.append(item);
//     // 初期選択を再選択
//     selecter.val(selected);
// }

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
    let memberInfo = buffInfo.member_info;
    if (memberInfo.style_info && memberInfo.style_info.jewel_type == target_jewel_type) {
        jewelLv = memberInfo.jewel_lv;
    }
    if (skill_lv > buffInfo.max_lv) {
        skill_lv = buffInfo.max_lv;
    }
    // 固定量のバフ
    if (status_kbn[buffInfo.ref_status_1] == 0) {
        return buffInfo.min_power;
    }
    // 士気
    let morale = memberInfo.morale ? memberInfo.morale * 5 : 0;
    // let stat_up = getStatUp(member_info) + morale;
    let statUp = morale;
    let status = memberInfo[status_kbn[buffInfo.ref_status_1]] + statUp;
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
function getDebuffEffectSize(buffInfo, skillLv, state) {
    if (!state) {
        return 0;
    }
    let jewelLv = 0;
    let memberInfo = buffInfo.member_info;
    if (memberInfo.style_info && memberInfo.style_info.jewel_type == "4") {
        jewelLv = memberInfo.jewel_lv;
    }
    let enemyInfo = state.enemy_info;
    let enemyStat = Number(enemyInfo.enemy_stat);
    if (enemyInfo.enemy_class == ENEMY_CLASS.SCORE_ATTACK) {
        enemyStat = SCORE_STATUS[state.score.lv - 100];
    }
    if (skillLv > buffInfo.max_lv) {
        skillLv = buffInfo.max_lv;
    }
    // 士気
    let morale = memberInfo.morale ? memberInfo.morale * 5 : 0;
    // let stat_up = getStatUp(member_info) + morale;
    let statUp = morale;
    let status1 = memberInfo[status_kbn[buffInfo.ref_status_1]] + statUp;
    let status2 = memberInfo[status_kbn[buffInfo.ref_status_2]] + statUp;
    let minPower = buffInfo.min_power * (1 + 0.05 * (skillLv - 1));
    let maxPower = buffInfo.max_power * (1 + 0.02 * (skillLv - 1));
    let status = (status1 * 2 + status2) / 3 - enemyStat;
    let skillStat = buffInfo.param_limit;
    let effectSize = 0;
    // 宝珠分以外
    if (status < 0) {
        effectSize += minPower;
    } else if (status < buffInfo.param_limit) {
        effectSize += (maxPower - minPower) / skillStat * status + minPower;
    } else {
        effectSize += maxPower;
    }
    // 宝珠分(SLvの恩恵を受けない)
    if (jewelLv > 0) {
        let jewelStat = skillStat + jewelLv * 20;
        if (status < 0) {
            effectSize += buffInfo.min_power * jewelLv * 0.02;
        } else if (status < jewelStat) {
            effectSize += ((buffInfo.max_power - buffInfo.min_power) / jewelStat * status + buffInfo.min_power) * jewelLv * 0.02;
        } else {
            effectSize += buffInfo.max_power * jewelLv * 0.02;
        }
    }
    return effectSize;
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