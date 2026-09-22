import * as logic from "./logic";
import {
    ABILIRY_TIMING, SINGLE_BUFF_LIST, ELEMENT_NAME,
} from "./const";
import {
    SKILL_ID, ABILITY_ID, BUFF, RANGE, EFFECT,
} from "utils/const";
import * as constants from "utils/const";
import * as common from "utils/common";
import * as logicAbility from "./logicAbility.js";

// バフ存在チェック
const checkBuffIdExist = (buffList, SKILL_EFFECT_ID) => {
    let existList = buffList.filter(function (buffInfo) {
        return buffInfo.SKILL_EFFECT_ID === SKILL_EFFECT_ID;
    });
    return existList.length > 0;
}

// 効果処理
export const procEffectUnit = (turnData, effectInfo, useUnitData, overDriveRateUp, isLogOutput = false) => {
    // 条件判定
    if (effectInfo.conditions) {
        if (!logic.judgmentCondition(effectInfo.conditions, effectInfo.conditions_id, turnData, useUnitData, effectInfo.skill_id)) {
            return;
        }
    }

    // 個別判定
    switch (effectInfo.SKILL_EFFECT_ID) {
        // 選択されなかった
        case constants.SKILL_EFFECT_ID.TRICK_CANNON: // トリック・カノン(攻撃力低下)
            if (useUnitData.buffEffectSelectType === 0) {
                return;
            }
            break;
        default:
            break;
    }
    switch (effectInfo.skill_id) {
        case constants.SKILL_EFFECT_ID.PERFECT_COLOR: // 極彩色
            let field_element = logic.getFieldElement(turnData);
            if (effectInfo.buff_element !== field_element) {
                return;
            }
            break;
        default:
            break;
    }

    const targetList = logic.getTargetList(turnData, effectInfo.range_area, effectInfo.target_element, useUnitData);
    // 対象策定
    switch (effectInfo.effect_type) {
        case EFFECT.GRANT_BUFF:
            // バフ追加
            const USE_GIVE_ATTACK_UP = [BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP, BUFF.ETERNAL_ATTACKUP]
            if (USE_GIVE_ATTACK_UP.includes(effectInfo.effect_no)) {
                // 先頭のバフ強化を消費する。
                let index = useUnitData.buffList.findIndex(function (buffInfo) {
                    return buffInfo.buff_no === BUFF.GIVEATTACKBUFFUP;
                });
                if (index !== -1) {
                    useUnitData.buffList.splice(index, 1);
                }
            }
            targetLoop(function (targetUnitData) {
                // バフ付与
                grantBuff(targetUnitData, effectInfo, useUnitData);
            }, turnData, targetList)
            break;
        case EFFECT.MORALE: // 士気
            targetLoop(function (targetUnitData) {
                addMoraleBuffUnit(targetUnitData, effectInfo, useUnitData);
            }, turnData, targetList)
            break;
        case EFFECT.GRANT_DEBUFF:
            // デバフ強化を消費する。
            let index = useUnitData.buffList.findIndex(function (buffInfo) {
                return buffInfo.buff_no === BUFF.GIVEDEBUFFUP || buffInfo.buff_no === BUFF.ARROWCHERRYBLOSSOMS;
            });
            if (index !== -1) {
                useUnitData.buffList.splice(index, 1);
            }
            // デバフ追加
            grantDebuff(turnData, effectInfo, useUnitData)
            break;
        case EFFECT.DISASTER: // 禍
            addDisasterDebuffUnit(turnData.enemyDebuffList, effectInfo, useUnitData);
            break;
        case EFFECT.HEALSP: // SP追加
            const effectSize = getEffectSize(effectInfo, useUnitData);
            targetLoop(function (targetUnitData) {
                skillHealSp(turnData, targetUnitData, effectSize, effectInfo.effect_limit, useUnitData.placeNo, false, effectInfo.SKILL_EFFECT_ID);
            }, turnData, targetList)
            break;
        case EFFECT.HEALEP: // EP追加
            targetLoop(function (targetUnitData) {
                let maxEp = Math.max(10, targetUnitData.ep + targetUnitData.overDriveEp);
                if (logic.checkAbilityExist(targetUnitData[`ability_${ABILIRY_TIMING.OD_START}`], ABILITY_ID.OVER_GEAR) && turnData.overDriveNumber > 0) {
                    maxEp = 20;
                }
                if (targetUnitData.ep < maxEp) {
                    targetUnitData.ep += effectInfo.effect_size;
                    if (targetUnitData.ep > maxEp) {
                        targetUnitData.ep = maxEp;
                    }
                }
            }, turnData, targetList)
            break;
        case EFFECT.OVERDRIVEPOINTUP:
            // 可変ODはいったん非対応
            let correction = 1;
            const odRateUp = overDriveRateUp.odRateUp;
            const earring = overDriveRateUp.earring;
            // 補正はのプラスの時のみ
            if (effectInfo.max_power > 0) {
                correction += (odRateUp + earring) / 100;
            }
            let point = getEffectSize(effectInfo, useUnitData);
            const unitOdPlus = Math.floor(point * correction * 100) / 100;
            useUnitData.overDriveGauge += unitOdPlus;
            return;
        case EFFECT.ADDITIONALTURN: // 追加ターン
            targetLoop(function (targetUnitData) {
                targetUnitData.additionalTurn = true;
            }, turnData, targetList)
            turnData.additionalTurn = true;
            break;
        case EFFECT.ADDITIONALTURN_NOT: // 追加ターン(追加ターンを除く)
            if (turnData.additionalCount > 0) {
                return;
            }
            targetLoop(function (targetUnitData) {
                targetUnitData.additionalTurn = true;
            }, turnData, targetList)
            turnData.additionalTurn = true;
            break;
        case EFFECT.FIELD_DEPLOYMENT: // フィールド
            turnData.field = effectInfo.element;
            let fieldTurn = effectInfo.effect_count;
            if (fieldTurn > 0) {
                // 天長地久
                if (logic.checkAbilityExist(useUnitData[`ability_${ABILIRY_TIMING.OTHER}`], constants.SKILL_EFFECT_ID.HEAVEN_AND_EARTH)) {
                    fieldTurn = 0;
                }
                // 武運長久
                if (logic.checkAbilityExist(useUnitData[`ability_${ABILIRY_TIMING.OTHER}`], constants.SKILL_EFFECT_ID.FORTUNES_OF_WAR) && logic.checkBuffExist(useUnitData.buffList, constants.BUFF.MORALE, 6)) {
                    fieldTurn = 0;
                }
                // メディテーション
                if (logic.checkPassiveExist(useUnitData.passiveSkillList, constants.SKILL_ID.MEDITATION)) {
                    fieldTurn = 0;
                }
            }
            // フィールド展開アビリティ
            logicAbility.abilityAction(ABILIRY_TIMING.FIELD_DEPLOY, turnData);
            turnData.fieldTurn = fieldTurn;
            break;
        case EFFECT.DISPEL: // ディスペル
            targetLoop(function (targetUnitData) {
                targetUnitData.buffList = targetUnitData.buffList.filter(function (buffInfo) {
                    return buffInfo.buff_no !== BUFF.RECOIL && buffInfo.buff_no !== BUFF.NAGATIVE;
                });
            }, turnData, targetList)
            break;
        case EFFECT.TOKEN_UP: // トークン増加
            targetLoop(function (targetUnitData) {
                // トークンは最大10まで
                if (targetUnitData.token < 10) {
                    targetUnitData.token += effectInfo.effect_size;
                    if (targetUnitData.token > 10) {
                        targetUnitData.token = 10;
                    }
                }
            }, turnData, targetList)
            break;
        default:
            break;
    }

    if (isLogOutput) {
        let effectDesc = common.getBuffKind(effectInfo.effect_no).buff_name;
        let rangeName = common.getRangeName(effectInfo.range_area);
        let conditionName = common.getConditionName(effectInfo.target_element, effectInfo.conditions, Number(effectInfo.conditions_id));
        let log = `　${conditionName}${effectDesc}`;
        if (rangeName) {
            log = `　${conditionName}${rangeName}に${effectDesc}`;
        }
        if (targetList.length > 0) {
            let nameList = targetList.map(function (target_no) {
                let unitData = logic.getUnitData(turnData, target_no);
                return common.getCharaData(unitData.style.styleInfo.chara_id).chara_short_name;
            });
            log += `(対象：${nameList.join(", ")})`;
        }
        turnData.setLog(log);
    }
}

// バフ付与
export const grantBuff = (unitData, skillEffectInfo, useUnitData) => {
    switch (skillEffectInfo.effect_no) {
        case BUFF.MORALE: // 士気
            addMoraleBuffUnit(unitData, skillEffectInfo, useUnitData);
            return;
        default:
            break;
    }
    // 単一バフ
    if (SINGLE_BUFF_LIST.includes(skillEffectInfo.effect_no)) {
        if (logic.checkBuffExist(unitData.buffList, skillEffectInfo.effect_no)) {
            if (skillEffectInfo.effect_turn > 0) {
                // 残ターン更新
                let filterList = unitData.buffList.filter(function (buff) {
                    return buff.buff_no === skillEffectInfo.effect_no;
                })
                filterList[0].rest_turn = skillEffectInfo.effect_turn;
            }
            return;
        }
    }
    // 単独発動バフ
    if (logic.isAloneActivation(skillEffectInfo)) {
        if (checkBuffIdExist(unitData.buffList, skillEffectInfo.SKILL_EFFECT_ID)) {
            if (skillEffectInfo.effect_turn > 0) {
                // 残ターン更新
                let filterList = unitData.buffList.filter(function (buff) {
                    return buff.SKILL_EFFECT_ID === skillEffectInfo.SKILL_EFFECT_ID;
                })
                filterList[0].rest_turn = skillEffectInfo.effect_turn;
            }
            return;
        }
    }
    let buff = createBuffData(skillEffectInfo, useUnitData);
    // 茜色
    if (skillEffectInfo.SKILL_EFFECT_ID === constants.SKILL_EFFECT_ID.BRIGHT_RED && unitData.style.styleInfo.element === 1) {
        buff.rest_turn = 5;
    }
    unitData.buffList.push(buff);
}

// 士気バフ追加
export const addMoraleBuffUnit = (unitData, skillEffectInfo, useUnitData) => {
    let existList = unitData.buffList.filter(function (buffInfo) {
        return buffInfo.buff_no === BUFF.MORALE;
    });
    let buff;
    if (existList.length > 0) {
        buff = existList[0];
    } else {
        buff = createBuffData(skillEffectInfo, useUnitData);
        buff.buff_no = BUFF.MORALE;
        buff.lv = 0;
        unitData.buffList.push(buff);
    }
    buff.lv = Math.min(buff.lv + skillEffectInfo.effect_size, 10);
}


// デバフ付与
export const grantDebuff = (turnData, skillEffectInfo, useUnitData) => {
    let addCount = 1;
    if (skillEffectInfo.range_area === RANGE.ENEMY_ALL) {
        addCount = turnData.enemyCount;
    }
    for (let i = 0; i < addCount; i++) {
        let debuff = createBuffData(skillEffectInfo, useUnitData);
        turnData.enemyDebuffList.push(debuff);
    }
}

// 禍デバフ追加
export const addDisasterDebuffUnit = (debuffList, skillEffectInfo, useUnitData) => {
    let existList = debuffList.filter(function (buffInfo) {
        return buffInfo.buff_no === BUFF.DISASTER;
    });
    let debuff;
    if (existList.length > 0) {
        debuff = existList[0];
    } else {
        debuff = createBuffData(skillEffectInfo, useUnitData);
        debuff.buff_no = BUFF.DISASTER;
        debuff.lv = 0;
        debuffList.push(debuff);
    }
    debuff.lv = Math.min(debuff.lv + skillEffectInfo.effect_size, 10);
}


function skillHealSp(turnData, unitData, addSp, limitSp, usePlaceNo, isRecursion, buffId) {
    let unitSp = unitData.sp;
    let minusSp = 0;
    const targetNo = unitData.placeNo;
    // クレール・ド・リュンヌ(＋)、収穫祭+は消費SPを加味する。
    if (buffId === 120 || buffId === 121 || buffId === 229) {
        minusSp = unitData.spCost;
    }
    unitSp += addSp;
    limitSp = unitData.limitSp > limitSp ? unitData.limitSp : limitSp;
    if (unitSp + unitData.overDriveSp - minusSp > limitSp) {
        unitSp = limitSp - unitData.overDriveSp + minusSp;
    }
    if (unitSp < unitData.sp) {
        unitSp = unitData.sp
    }
    unitData.sp = unitSp;

    if (!isRecursion) {
        // 愛嬌
        if (logic.checkAbilityExist(unitData[`ability_${ABILIRY_TIMING.OTHER}`], 1605) && targetNo !== usePlaceNo) {
            skillHealSp(turnData, targetNo, 3, 30, null, true, 0)
        }
        // お裾分け/エネルギー補給
        if ((logic.checkAbilityExist(unitData[`ability_${ABILIRY_TIMING.OTHER}`], 1606) ||
            logic.checkAbilityExist(unitData[`ability_${ABILIRY_TIMING.OTHER}`], 1612))
            && targetNo !== usePlaceNo) {
            let targetList = logic.getTargetList(turnData, RANGE.ALLY_ALL, 0, unitData);
            targetLoop(function (targetUnitData) {
                skillHealSp(turnData, targetUnitData, 2, 30, null, true, 0)
            }, turnData, targetList)
        }
        if (targetNo !== usePlaceNo) {
            logicAbility.abilityActionUnit(turnData, ABILIRY_TIMING.HEAL_SP, unitData);
        }
    }
}

export const createBuffData = (skillEffectInfo, useUnitData) => {
    let buff = {
        ...skillEffectInfo,
        buff_no: skillEffectInfo.effect_no,
        rest_turn: skillEffectInfo.effect_turn === 0 ? -1 : skillEffectInfo.effect_turn
    };
    switch (skillEffectInfo.effect_type) {
        case EFFECT.GRANT_DEBUFF:
            // ダブルリフト
            if (logic.checkAbilityExist(useUnitData[`ability_${ABILIRY_TIMING.OTHER}`], ABILITY_ID.DOUBLE_LIFT)) {
                buff.rest_turn++;
            }
            // ドミネーション・グラビティ
            if (skillEffectInfo.skill_id === SKILL_ID.DOMINATION_GRAVITY) {
                if (useUnitData.useSkillList.filter(value => value === SKILL_ID.DOMINATION_GRAVITY).length >= 3) {
                    buff.rest_turn++;
                }
            }
            break;
        case EFFECT.GRANT_BUFF:
            switch (skillEffectInfo.effect_no) {
                case BUFF.FUNNEL: // 連撃
                    buff.effectSum = skillEffectInfo.effect_size * skillEffectInfo.effect_count;
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return buff;
}

// 攻撃時にバフ消費
export const consumeBuffUnit = (turnData, unitData, attackInfo) => {
    let consumeBuffKBn = [];
    let consumeCount = 2
    if (attackInfo.attack_id !== 0) {
        // 連撃消費
        logic.getFunnelList(unitData);
    }
    // バフ消費
    let buffList = unitData.buffList;
    for (let i = buffList.length - 1; i >= 0; i--) {
        let buffInfo = buffList[i];
        const countWithFilter = consumeBuffKBn.filter(buffKbn => buffKbn === buffInfo.buff_no).length;
        if (buffInfo.rest_turn > 0) {
            // 残ターンバフは現状単独発動のみ
            for (let j = 0; j < consumeCount; j++) {
                consumeBuffKBn.push(buffInfo.buff_no);
            }
            continue;
        }
        // 同一バフは制限
        if (countWithFilter < consumeCount) {
            switch (buffInfo.buff_no) {
                case BUFF.ELEMENT_ATTACKUP: // 属性攻撃力アップ
                    if (attackInfo.attack_element !== buffInfo.buff_element) {
                        continue;
                    }
                // fallthrough
                case BUFF.ATTACKUP: // 攻撃力アップ
                case BUFF.MINDEYE: // 心眼
                case BUFF.CHARGE: // チャージ
                case BUFF.DAMAGERATEUP: // 破壊率アップ
                case BUFF.ARROWCHERRYBLOSSOMS: // 桜花の矢
                    // スキルでのみ消費
                    if (attackInfo.attack_id === 0) {
                        continue;
                    }
                    if (buffInfo.buff_no === BUFF.MINDEYE) {
                        // 弱点のみ消費
                        let physical = common.getCharaData(unitData.style.styleInfo.chara_id).physical;
                        if (!logic.isWeak(turnData.enemyInfo, physical, attackInfo.attack_element, attackInfo.attack_id)) {
                            continue;
                        }
                    }
                    buffList.splice(i, 1);
                    break;
                case BUFF.ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
                case BUFF.ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
                    if (attackInfo.attack_element !== buffInfo.buff_element) {
                        continue;
                    }
                // fallthrough
                case BUFF.CRITICALRATEUP:	// クリティカル率アップ
                case BUFF.CRITICALDAMAGEUP:	// クリティカルダメージアップ
                    // 通常攻撃でも消費
                    buffList.splice(i, 1);
                    break;
                default:
                    // 上記以外のバフ消費しない
                    break;
            }
            consumeBuffKBn.push(buffInfo.buff_no);
        }
    };
}

// バフ名称取得
export function getBuffKindName(buffInfo) {
    let buffKbnName = "";
    if (buffInfo.element && buffInfo.element !== 0) {
        buffKbnName = ELEMENT_NAME[buffInfo.element] + "属性";
    }
    let buffKindKbn = common.getBuffKind(buffInfo.buff_no);
    if (buffKindKbn) {
        buffKbnName += buffKindKbn.buff_name;
    }
    if (buffInfo.buff_no === BUFF.FUNNEL || buffInfo.buff_no === BUFF.ABILITY_FUNNEL) {
        switch (buffInfo.effect_size) {
            case 6:
                buffKbnName += "(小)";
                break
            case 12:
                buffKbnName += "(中)";
                break
            case 25:
                buffKbnName += "(大)";
                break
            case 50:
                buffKbnName += "(特大)";
                break
            default:
                break;
        }
    }
    return buffKbnName;
}

// バフアイコン取得
export function getBuffIconImg(buffInfo) {
    let src = "";
    let buffKindKbn = common.getBuffKind(buffInfo.buff_no);
    if (buffKindKbn) {
        src = buffKindKbn.buff_icon;
    }
    if (buffInfo.buff_element && buffInfo.buff_element !== 0) {
        src += buffInfo.buff_element;
    }
    return src;
}

// ループ
export const targetLoop = (func, turnData, targetList) => {
    targetList.forEach(function (targetNo) {
        const targetUnitData = logic.getUnitData(turnData, targetNo);
        if (targetUnitData.blank) {
            return;
        }
        func(targetUnitData);
    });
}

export const getEffectSize = (effect, useUnitData) => {
    let effectSize = effect.effect_size ?? 0;
    let multiplier = 1;

    if (effect.effect_unit) {
        const effectUnit = effect.effect_unit;
        const effectLimit = effect.effect_limit ?? 0;
        switch (effect.effect_no) {
            case constants.EFFECT_VALUE.TOKEN_POWER_UP:
                multiplier = (useUnitData.tokenCost ? useUnitData.tokenCost : 0);
                break;
            // case constants.EFFECT_VALUE.MOTIVATION_GOOD:
            //     multiplier = targetCountMotivation(styleList, 1);
            //     break;
            // case constants.EFFECT_VALUE.MEMBER_31C:
            //     multiplier = countCharaExist(styleList.selectStyleList, CHARA_ID.MEMBER_31C);
            //     break;
            default:
                break;
        }
        if (effectLimit) {
            effectSize = Math.min(effectSize + effectUnit * multiplier, effectLimit);
        } else {
            effectSize = effectSize + effectUnit * multiplier;
        }
    }
    return effectSize;
}