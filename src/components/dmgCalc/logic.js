import {
    BUFF, RANGE, CHARA_ID, EFFECT, ENEMY_CLASS, CONDITIONS
    , ALONE_ACTIVATION_BUFF_KIND, ALONE_ACTIVATION_ABILITY_LIST
    , SKILL_ID_RUBY_PERFUME
} from '../../utils/const';
import enemyList from "../../data/enemyList";
import { SCORE_STATUS } from "../../data/scoreData";
import scoreBonusList from "../../data/scoreBonusList";
import { getCharaData } from "../../utils/common";
import { getBuffIdToBuff, getPassiveInfo, getAbilityInfo } from "../../utils/common";
import { STATUS_KBN } from '../../utils/const';

export const BUFF_KBN = {
    0: "power_up",
    1: "element_up",
    2: "mindeye",
    3: "defense_down",
    4: "element_down",
    5: "fragile",
    6: "critical_rate_up",
    7: "critical_damege",
    8: "critical_element",
    9: "critical_damege_element",
    10: "charge",
    11: "field",
    12: "destruction_rete_up",
    14: "fightingspirit",
    15: "misfortune",
    16: "funnel",
    18: "strong_break",
    19: "dp_defense_down",
    20: "resist_down",
    21: "permanent_defense_down",
    22: "permanent_element_down",
    30: "arrow_cherry_blossoms",
    31: "eternal_ourh",
    33: "babied",
    39: "servant",
    41: "shadow_clone",
};

const ATTACK_BUFF_LIST = [
    BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP, BUFF.MINDEYE, BUFF.FUNNEL, BUFF.DAMAGERATEUP,
    BUFF.CRITICALRATEUP, BUFF.CRITICALDAMAGEUP];
const DEBUFF_LIST = [
    BUFF.DEFENSEDOWN, BUFF.ELEMENT_DEFENSEDOWN,
    BUFF.DEFENSEDP, BUFF.ETERNAL_DEFENSEDOWN, BUFF.ELEMENT_ETERNAL_DEFENSEDOWN, BUFF.FRAGILE, BUFF.RESISTDOWN];

const KIND_ATTACKUP = [BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP]
const KIND_DEFENSEDOWN = [BUFF.DEFENSEDOWN, BUFF.ELEMENT_DEFENSEDOWN, BUFF.DEFENSEDP, BUFF.ETERNAL_DEFENSEDOWN, BUFF.ELEMENT_ETERNAL_DEFENSEDOWN]

// 倍率表示
function convertToPercentage(value) {
    // 引数×100を計算し、小数点以下2桁目以降を四捨五入してパーセント記号を付ける
    const percentage = (Math.floor(value * 10000) / 100).toFixed(2) + "%";
    return percentage;
}

// ピアス効果量取得
function getEarringEffectSize(otherSetting, type, hitCount) {
    hitCount = hitCount < 1 ? 1 : hitCount;
    let earring = otherSetting.earring.split("_");
    if (earring.length === 2) {
        if (earring[0] === type) {
            let effectSize = Number(earring[1]);
            return (effectSize - (10 / 9 * (hitCount - 1)));
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

// キャラ重複チェック
export function checkDuplicationChara(selectStyleList, searchCharaId) {
    if (searchCharaId) {
        return selectStyleList.some((member, i) => member?.styleInfo.chara_id === searchCharaId);
    }
    return false;
}

// 耐性判定
function getEnemyResist(attackInfo, state) {
    const enemyInfo = state.enemyInfo;
    const correction = state.correction;
    let physical_resist = enemyInfo[`physical_${attackInfo.attack_physical}`];
    let element_resist = enemyInfo[`element_${attackInfo.attack_element}`]
        - correction[`element_${attackInfo.attack_element}`] + state.resistDown[attackInfo.attack_element];
    if (attackInfo.penetration) {
        physical_resist = attackInfo.penetration;
        element_resist = 100;
    }
    return [physical_resist, element_resist];
}

// バフの絞り込み
const filteredBuffList = (buffList, buffKind, attackInfo, isOrb = true) => {
    if (!attackInfo) return [];
    const ELEMENT_KIND = [
        BUFF.ELEMENT_ATTACKUP,
        BUFF.ELEMENT_DEFENSEDOWN,
        BUFF.ELEMENT_ETERNAL_DEFENSEDOWN,
        BUFF.ELEMENT_CRITICALRATEUP,
        BUFF.ELEMENT_CRITICALDAMAGEUP,
        BUFF.RESISTDOWN
    ]
    const OTHER_ONLY_AREA = [
        RANGE.ALLY_BACK,
        RANGE.SELF_OTHER,
        RANGE.FRONT_OTHER,
        RANGE.OTHER_UNIT,
    ]
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
function getEffectSize(buff, skillLv, memberInfo, state, abilitySettingMap, passiveSettingMap, kbn) {
    // バフ強化
    let strengthen = getStrengthen(buff, abilitySettingMap, passiveSettingMap);
    let effectSize = 0;
    if (buff.kbn === "buff") {
        // バフ
        switch (buff.buff_kind) {
            case BUFF.ATTACKUP: // 攻撃力アップ
            case BUFF.ELEMENT_ATTACKUP: // 属性攻撃力アップ
            case BUFF.MINDEYE: // 心眼
            case BUFF.CRITICALDAMAGEUP:	// クリティカルダメージアップ
            case BUFF.ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
            case BUFF.CHARGE: // チャージ
            case BUFF.DAMAGERATEUP: // 破壊率アップ
            case BUFF.YAMAWAKI_SERVANT: // 山脇様のしもべ
                effectSize = getBuffEffectSize(buff, skillLv, memberInfo, state, "3", abilitySettingMap, passiveSettingMap);
                break;
            case BUFF.CRITICALRATEUP:	// クリティカル率アップ
            case BUFF.ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
                effectSize = getBuffEffectSize(buff, skillLv, memberInfo, state, "5", abilitySettingMap, passiveSettingMap);
                break;
            case BUFF.DEFENSEDOWN: // 防御力ダウン
            case BUFF.ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
            case BUFF.FRAGILE: // 脆弱
            case BUFF.DEFENSEDP: // DP防御力ダウン
            case BUFF.RESISTDOWN: // 耐性ダウン
            case BUFF.ETERNAL_DEFENSEDOWN: // 永続防御ダウン
            case BUFF.ELEMENT_ETERNAL_DEFENSEDOWN: // 永続属性防御ダウン
                effectSize = getDebuffEffectSize(buff, skillLv, memberInfo, state, abilitySettingMap, passiveSettingMap);
                break;
            case BUFF.FUNNEL: // 連撃
                effectSize = getFunnelEffectSize(buff, memberInfo);
                break;
            case BUFF.FIELD: // フィールド
                return buff.max_power + strengthen;
            case BUFF.BABIED: // オギャり
                return 30;
            case BUFF.ETERNAL_OARH: // 永遠なる誓い
                return 50;
            case BUFF.SHADOW_CLONE: // 影分身
                return 30;
            case BUFF.ARROWCHERRYBLOSSOMS: // 桜花の矢
                return 50;
            default:
                break;
        }
    } else {
        // アビリティ
        switch (buff.buff_kind) {
            case BUFF.CHARGE: // チャージ
                return 30;
            case BUFF.FIELD: // フィールド
                return buff.max_power + strengthen;
            case BUFF.ARROWCHERRYBLOSSOMS: // 桜花の矢
                return 50;
            case BUFF.YAMAWAKI_SERVANT: // 山脇様のしもべ
                return 30;
            case BUFF.SHADOW_CLONE: // 影分身
                return 30;
            default:
                break;
        }
    }
    return effectSize * (1 + strengthen / 100);
}

// バフ強化効果量取得
function getStrengthen(buff, abilitySettingMap, passiveSettingMap) {
    let sp_cost_down = 0;
    // // 蒼天
    // if ($("#ability_all72").prop("checked")) {
    //     sp_cost_down = 1;
    // }
    // // ハイブースト状態
    // if ($("#skill_passive635").prop("checked")) {
    //     sp_cost_down = -2;
    // }
    let charaId = buff.use_chara_id;
    let strengthen = 0;
    // 攻撃力アップ/属性攻撃力アップ
    if (KIND_ATTACKUP.includes(buff.buff_kind)) {
        Object.values(abilitySettingMap)
            .filter(ability => ability.chara_id === charaId)
            .filter(ability => ability.checked)
            .forEach((ability) => {
                let abilityInfo = getAbilityInfo(ability.ability_id);
                if (abilityInfo.effect_type === EFFECT.GIVEATTACKBUFFUP) {
                    strengthen += abilityInfo.effect_size;

                }
            })
        Object.values(passiveSettingMap)
            .filter(passive => passive.checked)
            .forEach((passive) => {
                switch (passive.skill_id) {
                    case SKILL_ID_RUBY_PERFUME: // ハイブースト状態
                        strengthen += 20;
                        break;
                }
            })
    }
    // 防御力ダウン/属性防御力ダウン/DP防御力ダウン/永続防御ダウン/永続属性防御ダウン
    if (KIND_DEFENSEDOWN.includes(buff.buff_kind)) {
        Object.values(abilitySettingMap)
            .filter(ability => ability.chara_id === charaId)
            .filter(ability => ability.checked)
            .forEach((ability) => {
                let abilityInfo = getAbilityInfo(ability.ability_id);
                if (abilityInfo.effect_type === EFFECT.GIVEDEFFENCEDEBUFFUP) {
                    strengthen += abilityInfo.effect_size;
                }
            })
        Object.values(passiveSettingMap)
            .filter(passive => passive.checked)
            .forEach((passive) => {
                if (passive.chara_id === charaId) {
                    let passiveInfo = getPassiveInfo(passive.skill_id);
                    if (passiveInfo.effect_type === EFFECT.GIVEDEFFENCEDEBUFFUP) {
                        strengthen += passiveInfo.effect_size;
                    }
                }
                switch (passive.skill_id) {
                    case SKILL_ID_RUBY_PERFUME: // ハイブースト状態
                        strengthen += 20;
                        break;
                }
            })
    }
    // 防御ダウン以外のデバフスキル
    let other_debuff = [BUFF.FRAGILE, BUFF.RESISTDOWN];
    if (other_debuff.includes(buff.buff_kind)) {
        Object.values(passiveSettingMap)
            .filter(passive => passive.checked)
            .forEach((passive) => {
                switch (passive.skill_id) {
                    case SKILL_ID_RUBY_PERFUME: // ハイブースト状態
                        strengthen += 20;
                        break;
                }
            })
    }

    // フィールド強化
    if (BUFF.FIELD === buff.buff_kind) {
        Object.values(abilitySettingMap)
            .filter(ability => ability.chara_id === charaId)
            .filter(ability => ability.checked)
            .forEach((ability) => {
                let abilityInfo = getAbilityInfo(ability.ability_id);
                if (abilityInfo.effect_type === EFFECT.FIELD_STRENGTHEN) {
                    strengthen += abilityInfo.effect_size;
                }
            })
        Object.values(passiveSettingMap)
            .filter(passive => passive.chara_id === charaId)
            .filter(passive => passive.checked)
            .forEach((passive) => {
                let passiveInfo = getPassiveInfo(passive.skill_id);
                if (passiveInfo.effect_type === EFFECT.FIELD_STRENGTHEN) {
                    strengthen += passiveInfo.effect_size;
                }
            })
    }
    return strengthen;
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
    if (ATTACK_BUFF_LIST.includes(buffInfo.buff_kind) &&
        buffInfo.skill_attack1 &&
        buffInfo.chara_id === attackInfo.chara_id) {
        return true;
    }
    return false;
}

// 他スキルに使用出来ない攻撃バフ
function isOnlyUse(attackInfo, buffInfo) {

    if (!buffInfo || !ATTACK_BUFF_LIST.includes(buffInfo.buff_kind)) {
        return false;
    }

    if (!buffInfo.skill_attack1 || buffInfo.chara_id !== attackInfo.chara_id) {
        return false;
    }
    const attackId = attackInfo.attack_id;
    const match = [buffInfo.skill_attack1, buffInfo.skill_attack2].some(id => {
        const numId = Number(id);
        return (numId === 999 || attackId === numId);
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
        !max || buffSettingMap[buff.key]?.effect_size > buffSettingMap[max.key]?.effect_size ? buff : max, null);

    // 単独発動以外の中から、effect_sizeでソートして上位2件を取得
    const normalBuffs = kindBuffList.filter(buffInfo => !isAloneActivation(buffInfo));
    const sortedNormalBuffs = [...normalBuffs].sort(
        (a, b) => {
            if (buffSettingMap[b.key]?.effect_size === buffSettingMap[a.key]?.effect_size) {
                return b.sp_cost - a.sp_cost
            }
            return buffSettingMap[b.key]?.effect_size - buffSettingMap[a.key]?.effect_size
        });
    const top1 = sortedNormalBuffs[0];
    const top2 = sortedNormalBuffs[1];

    if (top1 && top2 &&
        ![BUFF.CHARGE, BUFF.FIELD, BUFF.ETERNAL_OARH, BUFF.YAMAWAKI_SERVANT,
        BUFF.ARROWCHERRYBLOSSOMS, BUFF.BABIED, BUFF.SHADOW_CLONE].includes(buffKind)) {
        combinedScore = buffSettingMap[top1.key]?.effect_size + buffSettingMap[top2.key]?.effect_size;
        combinedKeys = [top1.key, top2.key];
    } else if (top1) {
        combinedScore = top1.effect_size;
        combinedKeys = [top1.key];
    }

    // 比較して大きい方を返す
    if (maxAloneBuff && buffSettingMap[maxAloneBuff.key]?.effect_size >= combinedScore) {
        return [maxAloneBuff.key];
    } else {
        return combinedKeys;
    }
}

function getDamageResult(attackInfo, styleList, state, selectSKillLv,
    selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap, otherSetting) {
    if (!attackInfo) {
        return null;
    }
    let attackMemberInfo = getCharaIdToMember(styleList, attackInfo.chara_id);
    if (!attackMemberInfo) {
        return null;
    }
    let enemyInfo = state.enemyInfo;

    // ステータスアップ
    let statUp = getStatUp(state, attackMemberInfo, attackInfo.collect, abilitySettingMap, passiveSettingMap);
    // 厄orハッキング
    let enemyStatDown = 0;
    if (attackInfo.collect?.hacking) {
        enemyStatDown = 100;
    } else if (attackInfo.collect?.misfortune) {
        enemyStatDown = 20;
    }
    let criticalStatDown = Math.max(enemyStatDown, 50);

    let skillPower = getSkillPower(attackInfo, selectSKillLv, attackMemberInfo, statUp, enemyInfo, enemyStatDown);
    let buff = getSumBuffEffectSize(attackInfo, attackMemberInfo, styleList,
        selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap, otherSetting, state);
    let mindeye = 1 + getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.MINDEYE, BUFF.YAMAWAKI_SERVANT]) / 100;
    let debuff = getSumDebuffEffectSize(attackMemberInfo, selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap, state);
    let debuffDp = getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.DEFENSEDP]) / 100;

    let fragile = 1 + getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.FRAGILE]) / 100;

    let damageRateUp = getDamagerateEffectSize(attackMemberInfo, styleList,
        selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap, otherSetting, state, attackInfo.hit_count);
    let funnelList = getSumFunnelEffectList(selectBuffKeyMap, abilitySettingMap, passiveSettingMap);

    let token = getSumTokenEffectSize(attackInfo, attackMemberInfo);
    let field = 1 + getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.FIELD]) / 100;
    let [physical, element] = getEnemyResist(attackInfo, state);
    let enemyDefenceRate = getEnemyDefenceRate(state);

    // 表示用
    let funnel = 1 + funnelList.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / 100;
    let special = 1 + Number(state.dpRate[0] === 0 ? attackInfo.hp_damege / 100 : attackInfo.dp_damege / 100);

    // 個別設定
    let skillUniqueRate = 1;
    if (attackInfo.rest_dp && attackInfo.dp_rate) {
        let dpRate = attackInfo.dp_rate;
        if (attackInfo.rest_dp === 1) {
            // 残DPが高いほど威力アップ
            dpRate = dpRate < 60 ? 60 : dpRate;
            skillUniqueRate += (dpRate - 100) / 200
        }
        if (attackInfo.rest_dp === 2) {
            // 残DPが低いほど威力アップ
            dpRate = dpRate > 100 ? 100 : dpRate;
            skillUniqueRate += (100 - dpRate) / 100 * 75 / 100;
        }
    }

    if (attackInfo.rest_sp === 1 && attackInfo.cost_sp) {
        // 消費DPが低いほど威力アップ
        let sp = attackInfo.cost_sp;
        skillUniqueRate = (sp > 30 ? 30 : sp) / 30;
    }

    let criticalPower = getSkillPower(attackInfo, selectSKillLv, attackMemberInfo, statUp, enemyInfo, criticalStatDown);
    let criticalRate = getCriticalRate(attackMemberInfo, enemyInfo, selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap);
    let criticalBuff = getCriticalBuff(attackMemberInfo, selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap);

    let fixed = mindeye * fragile * token * field * physical / 100 * element / 100 * enemyDefenceRate * skillUniqueRate;
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
        criticalRate: convertToPercentage(criticalRate / 100),
        criticalBuff: convertToPercentage(criticalBuff),
    }
}

// ダメージの詳細計算
function calculateDamage(state, basePower, attackInfo, buff, debuff, debuffDp, fixed, damageRateUp, funnelList, otherSetting) {
    let enemyInfo = state.enemyInfo;
    let damageRate = state.damageRate;
    let maxDamageRate = state.maxDamageRate;
    let destruction = Number(enemyInfo.destruction);
    let dpPenetration = state.dpRate.length === 1 || state.dpRate[1] === 0;
    let restDp = Array(state.dpRate.length).fill(0);
    let dpNo = -1;  // 現在の使用DPゲージ番号を取得
    for (let i = 0; i < state.dpRate.length; i++) {
        restDp[i] = 0;
        if (state.dpRate[i] > 0) {
            restDp[i] = Number(enemyInfo.max_dp.split(",")[i]) * state.dpRate[i] / 100;
        }
        if (restDp[i] > 0) {
            dpNo = i;
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

        if (restDp[dpNo] > 0) {
            restDp[dpNo] -= hitDamage;
        } else if (dpNo >= 1) {
            restDp[dpNo - 1] -= hitDamage;
        } else {
            restHp -= hitDamage;
        }
        if (restDp[0] <= 0 && dpPenetration) {
            damageRate += addDestruction;
            if (damageRate > maxDamageRate) damageRate = maxDamageRate;
        }
        hitDamage = hitDamage < 1 ? 1 : hitDamage;
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
export function getSkillPower(attackInfo, selectSKillLv, memberInfo, statUp, enemyInfo, enemyStatDown) {
    let jewelLv = 0;
    if (memberInfo.styleInfo.jewel_type === "1") {
        jewelLv = memberInfo.jewelLv;
    }
    let molecule = 0;
    let denominator = 0;
    if (attackInfo.ref_status_1 !== 0) {
        molecule += (memberInfo[STATUS_KBN[attackInfo.ref_status_1]] + statUp) * 2;
        denominator += 2;
    }
    if (attackInfo.ref_status_2 !== 0) {
        molecule += memberInfo[STATUS_KBN[attackInfo.ref_status_2]] + statUp;
        denominator += 1;
    }
    if (attackInfo.ref_status_3 !== 0) {
        molecule += memberInfo[STATUS_KBN[attackInfo.ref_status_3]] + statUp;
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
function getSumBuffEffectSize(attackInfo, attackMemberInfo, styleList,
    selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap, otherSetting, state) {
    // スキルバフ合計
    let sumBuff = getSumEffectSize(selectBuffKeyMap, buffSettingMap,
        [BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP, BUFF.CHARGE, BUFF.ARROWCHERRYBLOSSOMS,
        BUFF.ETERNAL_OARH, BUFF.BABIED, BUFF.SHADOW_CLONE]);
    // 攻撃力アップアビリティ
    sumBuff += getSumAbilityEffectSize(abilitySettingMap, passiveSettingMap, EFFECT.ATTACKUP, attackMemberInfo.styleInfo.chara_id);
    // 属性リング(0%-10%)
    sumBuff += Number(otherSetting.ring);
    // オーバードライブ10%
    if (otherSetting.overdrive) {
        sumBuff += 10;
    }
    sumBuff += getChainEffectSize(otherSetting, "skill");
    // // トークン
    sumBuff += getSumTokenAbilirySize(styleList, abilitySettingMap, EFFECT.TOKEN_ATTACKUP);
    // 士気
    sumBuff += attackMemberInfo.morale ? attackMemberInfo.morale * 5 : 0;
    // スコアタグレード
    if (state.correction.power_up) {
        sumBuff += state.correction.power_up;
    }
    if (state.correction[`element_power_up_${attackInfo.attack_element}`]) {
        sumBuff += state.correction[`element_power_up_${attackInfo.attack_element}`];
    }
    // // 制圧戦
    // sum_buff += getBikePartsEffectSize("buff");
    return 1 + sumBuff / 100;
}

// 合計デバフ効果量取得
function getSumDebuffEffectSize(attackMemberInfo, selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap, state) {
    // スキルデバフ合計
    let sumBuff = getSumEffectSize(selectBuffKeyMap, buffSettingMap,
        [BUFF.DEFENSEDOWN, BUFF.ELEMENT_DEFENSEDOWN, BUFF.ETERNAL_DEFENSEDOWN, BUFF.ELEMENT_ETERNAL_DEFENSEDOWN]);
    // // 防御ダウンアビリティ
    sumBuff += getSumAbilityEffectSize(abilitySettingMap, passiveSettingMap, EFFECT.DEFFENCEDOWN, attackMemberInfo.styleInfo.chara_id);
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
            let buffId = Number(selectedKey.split('_')[1]);
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
            if (abilityInfo.effect_type === EFFECT.FUNNEL) {
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
function getDamagerateEffectSize(attackMemberInfo, styleList,
    selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap, otherSetting, state, hitCount) {
    let destructionEffectSize = 100;
    destructionEffectSize += getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.DAMAGERATEUP]);
    destructionEffectSize += getSumAbilityEffectSize(
        abilitySettingMap, passiveSettingMap, EFFECT.DAMAGERATEUP,
        attackMemberInfo.styleInfo.chara_id);
    destructionEffectSize += getSumTokenAbilirySize(styleList, abilitySettingMap, EFFECT.TOKEN_DAMAGERATEUP)
    destructionEffectSize += getEarringEffectSize(otherSetting, "blast", 10 - hitCount);
    destructionEffectSize += getChainEffectSize(otherSetting, "skill");

    // // 制圧戦
    // destruction_effect_size += getBikePartsEffectSize("destruction_rate");
    // スコアタグレード
    if (state.correction.destruction) {
        destructionEffectSize += state.correction.destruction;
    }
    return destructionEffectSize / 100;
}

// クリティカル率取得
function getCriticalRate(attackMemberInfo, enemyInfo, selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap) {
    let criticalRate = 1.5;
    let diff = (attackMemberInfo.luk - enemyInfo.enemy_stat);
    criticalRate += diff > 0 ? diff * 0.04 : 0;
    criticalRate = criticalRate > 15 ? 15 : criticalRate;
    criticalRate += getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.CRITICALRATEUP, BUFF.ELEMENT_CRITICALRATEUP]);
    criticalRate += getSumAbilityEffectSize(abilitySettingMap, passiveSettingMap, EFFECT.CRITICALRATEUP, attackMemberInfo.styleInfo.charaId);
    // チャージ
    // critical_rate += $("#charge").prop("selectedIndex") > 0 ? 20 : 0;
    // // 永遠なる誓い
    // critical_rate += $("#eternal_vows").prop("checked") ? 50 : 0;
    // // 制圧戦
    // critical_rate += getBikePartsEffectSize("critical_rate");
    return criticalRate > 100 ? 100 : criticalRate;
}

// クリティカルバフ取得
function getCriticalBuff(attackMemberInfo, selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap) {
    let criticalBuff = 50;
    criticalBuff += getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.CRITICALDAMAGEUP, BUFF.ELEMENT_CRITICALDAMAGEUP],
        attackMemberInfo.styleInfo.charaId);
    criticalBuff += getSumAbilityEffectSize(abilitySettingMap, passiveSettingMap, EFFECT.CRITICALDAMAGEUP, attackMemberInfo.styleInfo.charaId);
    // // 制圧戦
    // critical_buff += getBikePartsEffectSize("critical_buff");
    // // セラフ遭遇戦
    // if ($("#enemy_class").val() === ENEMY_CLASS.SERAPH_ENCOUNTER) {
    //     critical_buff += getCardEffect("CLIRICAL_DAMAGE");
    // }
    return 1 + criticalBuff / 100;
}
// トークン効果量
function getSumTokenEffectSize(attackInfo, attackMemberInfo) {
    // トークン
    let token_count = attackMemberInfo.token ? attackMemberInfo.token : 0;
    if (attackInfo.token_power_up === 1) {
        return 1 + token_count * 16 / 100;
    }
    return 1;
}

// トークンアビリティ取得
function getSumTokenAbilirySize(styleList, abilitySettingMap, effectType) {
    let sum = 0;
    Object.keys(abilitySettingMap).forEach(function (key) {
        let data = abilitySettingMap[key];
        if (data.checked) {
            let abilityId = data.ability_id;
            let memberInfo = getCharaIdToMember(styleList, data.chara_id);
            let abilityInfo = getAbilityInfo(abilityId);
            if (abilityInfo.effect_type === effectType) {
                sum = abilityInfo.effect_size * (memberInfo.token ? memberInfo.token : 0);
            }
        }
    })
    return sum;
}

// アビリティ効果量合計取得
function getSumAbilityEffectSize(abilitySettingMap, passiveSettingMap, effectType, targetCharaId) {
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
            if (abilityInfo.effect_type === effectType) {
                //     if (ability_id === 602) {
                //         // キレアジ
                //         let attack_info = getAttackInfo();
                //         if (attack_info.sp_cost - sp_cost_down > 8) {
                //             return true;
                //         }
                //     }
                let effectSize = abilityInfo.effect_size;
                if (ALONE_ACTIVATION_ABILITY_LIST.includes(abilityId)) {
                    if (abilityInfo.element !== 0) {
                        activationElementEffectSize = Math.max(activationElementEffectSize, effectSize);
                    } else if (abilityInfo.physical !== 0) {
                        activationPhysicalEffectSize = Math.max(activationPhysicalEffectSize, effectSize);
                    } else {
                        activationNoneEffectSize = Math.max(activationNoneEffectSize, effectSize);
                    }
                } else {
                    if (abilityInfo.element !== 0) {
                        sumElementEffectSize += effectSize;
                    } else if (abilityInfo.physical !== 0) {
                        sumPhysicalEffectSize += effectSize;
                    } else {
                        sumNoneEffectSize += effectSize;
                    }
                }
            }
        }
    })
    abilityEffectSize += activationNoneEffectSize + sumNoneEffectSize
        + activationPhysicalEffectSize + sumPhysicalEffectSize
        + activationElementEffectSize + sumElementEffectSize;

    Object.keys(passiveSettingMap).forEach(function (key) {
        let data = passiveSettingMap[key];
        if (data.checked) {
            let skillId = Number(data.skill_id)
            let passiveInfo = getPassiveInfo(skillId);
            let effectSize = 0;
            if (passiveInfo.effect_type === effectType) {
                if (isRangeAreaInclude(data.chara_id, passiveInfo.range_area, targetCharaId)) {
                    effectSize = passiveInfo.effect_size;
                }
            }
            // ハイブースト状態
            if (skillId === SKILL_ID_RUBY_PERFUME && effectType === EFFECT.ATTACKUP) {
                abilityEffectSize += 180;
            } else {
                abilityEffectSize += effectSize;
            }
        }
    });
    return abilityEffectSize;
}

// 対象範囲判定
function isRangeAreaInclude(charaId, rangeArea, targetCharaId) {
    switch (rangeArea) {
        case RANGE.SELF:
            return charaId === targetCharaId;
        case RANGE.ALLY_ALL:
            return true;
        case RANGE.MEMBER_31C:
            return CHARA_ID.MEMBER_31C.includes(targetCharaId);
        case RANGE.MEMBER_31E:
            return CHARA_ID.MEMBER_31E.includes(targetCharaId);
        case RANGE.MARUYAMA_MEMBER:
            return CHARA_ID.MEMBER_31E.includes(targetCharaId);
        case RANGE.RUKA_SHARO:
            return CHARA_ID.RUKA_SHARO.includes(targetCharaId);
    }
    return true;
}

// キャラIDからメンバー情報取得
export function getCharaIdToMember(styleList, charaId) {
    const filteredMember = (styleList) => {
        const filterList = styleList.filter((obj) => obj?.styleInfo?.chara_id === charaId);
        return filterList.length > 0 ? filterList[0] : undefined;
    }
    let member;
    member = filteredMember(styleList.selectStyleList);
    if (!member) {
        member = filteredMember(styleList.subStyleList)
    }
    // if (!member) {
    //     member = filtered_member(support_style_list)
    // }
    return member;
}

// 敵ステータス更新
export function updateEnemyStatus(enemy_class_no, enemyInfo) {
    const enemyClass = 99;
    let filteredEnemy = enemyList.filter((obj) => obj.enemy_class === enemyClass && obj.enemy_class_no === enemy_class_no);
    let index = enemyList.findIndex((obj) => obj === filteredEnemy[0]);
    Object.assign(enemyList[index], enemyInfo);
}

// セラフ遭遇戦敵ステータス設定
function updateSeraphEncounter(enemyInfo, selectedList) {
    let new_enemyInfo = JSON.parse(JSON.stringify(enemyInfo));
    selectedList.forEach((item) => {
        switch (item.effect_kind) {
            case "STAT_UP":
                new_enemyInfo.enemy_stat += item.effect_size;
                break;
            case "ICE_DOWN":
                new_enemyInfo.element_2 += item.effect_size;
                break;
            case "LIGHT_DOWN":
                new_enemyInfo.element_4 += item.effect_size;
                break;
            case "HP_UP":
                new_enemyInfo.max_hp = Math.floor(new_enemyInfo.max_hp * (1 + (item.effect_size / 100)));
                break;
            case "DP_UP":
                new_enemyInfo.max_dp = String(Math.floor(Number(new_enemyInfo.max_dp) * (1 + (item.effect_size / 100))));
                break;
        }
    })
    // setEnemyStatus(new_enemyInfo)
}

// バフ効果量
function getBuffEffectSize(buffInfo, skillLv, memberInfo, state, targetJewelType, abilitySettingMap, passiveSettingMap) {
    const NOT_JEWEL_TYPE = [BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP, BUFF.CRITICALRATEUP];
    let jewelLv = 0;
    if (memberInfo.styleInfo && memberInfo.styleInfo.jewel_type === targetJewelType) {
        jewelLv = memberInfo.jewelLv;
    }
    if (skillLv > buffInfo.max_lv) {
        skillLv = buffInfo.max_lv;
    }
    // 固定量のバフ
    if (STATUS_KBN[buffInfo.ref_status_1] === 0) {
        return buffInfo.min_power;
    }
    // ステータス
    let statUp = getStatUp(state, memberInfo, null, abilitySettingMap, passiveSettingMap);
    let status = memberInfo[STATUS_KBN[buffInfo.ref_status_1]] + statUp;
    let minPower = buffInfo.min_power * (1 + 0.03 * (skillLv - 1));
    let maxPower = buffInfo.max_power * (1 + 0.02 * (skillLv - 1));
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
function getDebuffEffectSize(buffInfo, skillLv, memberInfo, state, abilitySettingMap, passiveSettingMap) {
    if (!state) {
        return 0;
    }
    let jewelLv = 0;
    if (memberInfo.styleInfo && memberInfo.styleInfo.jewel_type === "4") {
        jewelLv = memberInfo.jewelLv;
    }
    let enemyInfo = state.enemyInfo;
    let enemyStat = Number(enemyInfo.enemy_stat);
    if (enemyInfo.enemy_class === ENEMY_CLASS.SCORE_ATTACK) {
        enemyStat = SCORE_STATUS[state.score.lv - 100];
    }
    if (skillLv > buffInfo.max_lv) {
        skillLv = buffInfo.max_lv;
    }
    // ステータス
    let statUp = getStatUp(state, memberInfo, null, abilitySettingMap, passiveSettingMap);
    let status1 = memberInfo[STATUS_KBN[buffInfo.ref_status_1]] + statUp;
    let status2 = memberInfo[STATUS_KBN[buffInfo.ref_status_2]] + statUp;
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
function getFunnelEffectSize(buffInfo, memberInfo) {
    let funnel_power = buffInfo.effect_size;
    let effectSize;
    let minPower = buffInfo.min_power;
    let maxPower = buffInfo.max_power;
    if (minPower === maxPower) {
        effectSize = funnel_power * minPower;
    } else {
        let status1 = memberInfo[STATUS_KBN[buffInfo.ref_status_1]];
        if (buffInfo.param_limit > status1) {
            effectSize = funnel_power * minPower;
        } else {
            effectSize = funnel_power * maxPower;
        }
    }

    return effectSize;
}

// 敵防御力取得
function getEnemyDefenceRate(state) {
    let enemyInfo = state.enemyInfo;
    let enemyDefenceRate = 1;
    if (state.correction.defense_rate) {
        enemyDefenceRate = 1 - state.correction.defense_rate / 100;
    }
    if (enemyInfo.enemy_class === ENEMY_CLASS.HARD_LAYER &&
        (enemyInfo.enemy_class_no === 12 || enemyInfo.enemy_class_no === 13)) {
        const defenceRate = 5 / 100;
        enemyDefenceRate = (1 - defenceRate) ** state.hard.skullFeatherDeffense;
    }
    // if ($("#enemy_class").val() === ENEMY_CLASS.SERAPH_ENCOUNTER) {
    //     enemy_defence_rate = getCardEffect("ATTACK_DOWN");
    // }
    return enemyDefenceRate;
}

// ステータスアップ取得
export function getStatUp(state, memberInfo, collect, abilitySettingMap, passiveSettingMap) {
    let enemyInfo = state.enemyInfo;

    let tearsOfDreams = 0;
    // // 夢の泪
    if (enemyInfo.enemy_class === ENEMY_CLASS.HARD_LAYER) {
        const tearsOfDreamsList = [0, 12, 12, 12, 12, 15, 15, 15, 15, 15, 20, 20, 20, 20, 20]
        tearsOfDreams = tearsOfDreamsList[enemyInfo.enemy_class_no] * Number(state.hard.tearsOfDreams);
    }
    // スコアタボーナス
    let scoreBonus = 0;
    if (enemyInfo.enemy_class === ENEMY_CLASS.SCORE_ATTACK) {
        const selectHalf = state.score.half
        let physical = getCharaData(memberInfo.styleInfo.chara_id).physical;
        const targetConditions = [`element_${memberInfo.styleInfo.element}`, `element_${memberInfo.styleInfo.element2}`, `physical_${physical}`];

        scoreBonusList
            .filter(obj =>
                obj.score_attack_no === enemyInfo.sub_no &&
                (obj.half === 0 || obj.half === selectHalf)
            )
            .forEach(obj => {
                if (targetConditions.includes(obj.conditions)) {
                    scoreBonus = Math.max(obj.effect_size, scoreBonus);
                }
            });
    }
    // 士気
    let morale = memberInfo.morale ? memberInfo.morale * 5 : 0;
    // 闘志
    let fightingspirit = collect?.fightingspirit ? 20 : 0;
    // パッシブ(能力固定上昇)
    let passiveStatusUp = getSumAbilityEffectSize(abilitySettingMap, passiveSettingMap, EFFECT.STATUSUP_VALUE, memberInfo.styleInfo.chara_id);
    return tearsOfDreams + scoreBonus + (morale > fightingspirit ? morale : fightingspirit) + passiveStatusUp;
}

// カンマ削除
export function removeComma(value) {
    var regex = /[^0-9]/g;
    var newValue = "0" + value.replace(regex, '');
    return Number(newValue).toString()
}

// グラデーションを取得するメソッド
export function getApplyGradient(baseColor, percent) {
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
export function generateGradientFromRange(range, colorCode) {
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