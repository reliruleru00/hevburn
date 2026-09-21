import {
    ABILIRY_TIMING, ELEMENT_NAME, ACTION_ORDER
} from "./const";
import {
    ABILITY_ID, FIELD, EFFECT, CONDITIONS,
} from "utils/const";
import * as constants from "utils/const";
import * as common from "utils/common";
import * as logic from "./logic";
import * as logicBuff from "./logicBuff.js";

const unitOrderLoop = (func, unitList) => {
    ACTION_ORDER.forEach(function (index) {
        let unit = unitList[index];
        if (!unit.blank) {
            func(unit);
        }
    });
}

export const abilityAction = (actionKbn, turnData) => {
    unitOrderLoop(function (unitData) {
        if (actionKbn === ABILIRY_TIMING.ADDITIONALTURN && !unitData.additionalTurn) {
            return;
        }
        abilityActionUnit(turnData, actionKbn, unitData);
    }, turnData.unitList);
}

export const abilityActionUnit = (turnData, actionKbn, unitData, params) => {
    let actionList = unitData[`ability_${actionKbn}`];
    // 被ダメージ時
    if (actionKbn === ABILIRY_TIMING.RECEIVE_DAMAGE) {
        // 前衛のみ
        if (unitData.placeNo >= 3) {
            actionList = [];
        }
    }
    actionList.forEach((ability, index) => {
        // 前衛
        if (ability.activation_place === 1 && unitData.placeNo >= 3) {
            return true;
        }
        // 後衛
        if (ability.activation_place === 2 && unitData.placeNo < 3) {
            return true;
        }
        // 初回のみ
        if (ability.used && ability.first_only === 1) {
            return true;
        }
        let targetList = logic.getTargetList(turnData, ability.range_area, ability.target_element, unitData.placeNo, null);
        if (!logic.judgmentCondition(Number(ability.conditions), ability.conditions_id, turnData, unitData, null)) {
            return true;
        }
        // 対象がバフを所持
        if (Number(ability.conditions) === CONDITIONS.HAS_BUFF_TARGET) {
            targetList = targetList.filter(function (target_no) {
                let unitData = logic.getUnitData(turnData, target_no);
                return logic.checkBuffExist(unitData.buffList, ability.conditions_id);
            });
        }
        switch (ability.conditions) {
            case "火属性フィールド":
                if (turnData.field !== FIELD.FIRE) {
                    return;
                }
                break;
            case "ODゲージ使用":
                let list = common.getEffectList(unitData.selectSkillId)
                    .filter(skill => skill.effect_type === EFFECT.OVERDRIVEPOINTUP)
                    .filter(skill => skill.effect_size < 0);
                if (list.length === 0) {
                    return;
                }
                break;
            case "破壊率が200%以上":
            case "トークン4つ以上":
            case "敵のバフ解除":
            case "ブレイク中":
            case "100%":
                return;
            case CONDITIONS.FIELD_ELEMENT: // フィールド属性
                if (!logic.judgmentCondition(ability.conditions, ability.conditions_id, turnData, unitData, null)) {
                    return true;
                }
                break;
            default:
                break;
        }
        let effectDesc = "";
        let abilityName = ability.ability_name || ability.passive_name;

        switch (ability.effect_type) {
            case EFFECT.OVERDRIVE_SP: // ODSPアップ
                logicBuff.targetLoop(function (targetUnitData) {
                    targetUnitData.overDriveSp += ability.effect_size;
                }, turnData, targetList)
                effectDesc = `OD時SPアップ${ability.effect_size}`;
                break;
            case EFFECT.OVERDRIVE_EP: // ODEPアップ
                logicBuff.targetLoop(function (targetUnitData) {
                    if (targetUnitData.ep + ability.effect_size > 20) {
                        targetUnitData.overDriveEp = 20 - targetUnitData.ep;
                    } else {
                        targetUnitData.overDriveEp += ability.effect_size;
                    }
                }, turnData, targetList)
                effectDesc = `OD時EPアップ${ability.effect_size}`;
                break;
            case EFFECT.HEALSP: // SP回復
                logicBuff.targetLoop(function (targetUnitData) {
                    let limitSp = targetUnitData.limitSp;
                    if (ability.effect_no) {
                        limitSp = ability.effect_limit;
                    }
                    if (targetUnitData.sp + targetUnitData.overDriveSp < limitSp) {
                        if (ability.ability_id) {
                            if (constants.ADD_SP_ABILITY.includes(ability.ability_id)) {
                                targetUnitData.addSp += ability.effect_size;
                            } else {
                                targetUnitData.sp += ability.effect_size;
                            }
                        }
                        if (ability.skill_id) {
                            targetUnitData.sp += ability.effect_size;
                        }
                        if (targetUnitData.sp + targetUnitData.overDriveSp > limitSp) {
                            targetUnitData.sp = limitSp - targetUnitData.overDriveSp;
                        }
                    }
                }, turnData, targetList)
                effectDesc = `SP+${ability.effect_size}`;
                break;
            case EFFECT.HEALEP: // EP回復
                let maxEp = Math.max(10, unitData.ep + unitData.overDriveEp);
                if (logic.checkAbilityExist(unitData[`ability_${ABILIRY_TIMING.OD_START}`], ABILITY_ID.OVER_GEAR) && turnData.overDriveNumber > 0) {
                    maxEp = 20;
                }
                if (unitData.ep < maxEp) {
                    unitData.ep += ability.effect_size;
                    if (unitData.ep > maxEp) {
                        unitData.ep = maxEp;
                    }
                }
                effectDesc = `EP+${ability.effect_size}`;
                break;
            case EFFECT.TOKEN_UP: // トークン回復
                let effectSize = ability.effect_size;
                if (ability.ability_id === ABILITY_ID.WAR_HONOR) {
                    // 戦勲
                    effectSize = params.effectSize;
                }
                logicBuff.targetLoop(function (targetUnitData) {
                    targetUnitData.token += effectSize;
                    if (targetUnitData.token > 10) {
                        targetUnitData.token = 10;
                    }
                }, turnData, targetList)
                effectDesc = `トークン+${effectSize}`;
                break;
            case EFFECT.OVERDRIVEPOINTUP: // ODアップ
                turnData.overDriveGauge += ability.effect_size;
                if (turnData.overDriveGauge > turnData.maxOverDriveGauge) {
                    turnData.overDriveGauge = turnData.maxOverDriveGauge;
                }
                effectDesc = `OverDriveゲージ+${ability.effect_size}`;
                break;
            case EFFECT.GRANT_BUFF: // バフ付与
                logicBuff.targetLoop(function (targetUnitData) {
                    ability.buff_name = abilityName;
                    logicBuff.grantBuff(targetUnitData, ability, unitData);
                }, turnData, targetList)
                effectDesc = `${common.getBuffKind(ability.effect_no).buff_name}を付与`;
                break;
            case EFFECT.GRANT_DEBUFF: // デバフ付与
                ability.buff_name = abilityName;
                logicBuff.grantDebuff(turnData, ability, unitData)
                effectDesc = `${common.getBuffKind(ability.effect_no).buff_name}を付与`;
                break;
            case EFFECT.MORALE: // 士気
                logicBuff.targetLoop(function (targetUnitData) {
                    ability.buff_name = abilityName;
                    logicBuff.addMoraleBuffUnit(targetUnitData, ability, null)
                }, turnData, targetList)
                effectDesc = `士気+${ability.effect_size}`;
                break;
            case EFFECT.SP_LIMIT_UP: // SP上限アップ
                logicBuff.targetLoop(function (targetUnitData) {
                    targetUnitData.limitSp = ability.effect_size;
                }, turnData, targetList)
                effectDesc = `SP上限${ability.effect_size}にアップ`;
                break;
            case EFFECT.FIELD_DEPLOYMENT: // フィールド
                turnData.field = ability.effect_no;
                effectDesc = `${ELEMENT_NAME[ability.element]}属性フィールド`;
                break;
            case EFFECT.ADDITIONALTURN: // 追加ターン
                if (turnData.additionalCount === 0) {
                    unitData.additionalTurn = true;
                    turnData.additionalTurn = true;
                }
                effectDesc = `追加ターン`;
                break;
            case EFFECT.COST_SP_DOWN: // SPコストダウン
                logicBuff.targetLoop(function (targetUnitData) {
                    if (checkTargetElment(unitData, ability.target_element)) {
                        targetUnitData.spCostDown = Math.max(targetUnitData.spCostDown, ability.effect_size);
                    }
                }, turnData, targetList)
                effectDesc = `消費SP-${ability.effect_size}`;
                break;
            case EFFECT.COST_SP_UP: // SPコストアップ
                logicBuff.targetLoop(function (targetUnitData) {
                    if (checkTargetElment(unitData, ability.target_element)) {
                        targetUnitData.spCostUp = Math.max(targetUnitData.spCostUp, ability.effect_size);
                    }
                }, turnData, targetList)
                effectDesc = `消費SP+${ability.effect_size}`;
                break;
            default:
                break;
        }
        ability.used = true;
        if (effectDesc) {
            let rangeName = common.getRangeName(ability.range_area);
            let charaName = common.getCharaData(unitData.style.styleInfo.chara_id).chara_short_name;
            let conditionName = common.getConditionName(ability.target_element, ability.conditions, Number(ability.conditions_id));
            let log = `${charaName}：${abilityName}(${conditionName}${effectDesc})が発動`;
            if (rangeName) {
                log = `${charaName}：${abilityName}(${conditionName}${rangeName}に${effectDesc})が発動`;
            }
            turnData.setLog(log);
            let nameList = targetList.map(function (target_no) {
                let unitData = logic.getUnitData(turnData, target_no);
                return common.getCharaData(unitData.style.styleInfo.chara_id).chara_short_name;
            });
            if (nameList.length > 0) {
                log = `　対象：${nameList.join(", ")}`;
                turnData.setLog(log);
            }
        }
    });
}

export const checkTargetElment = (unit, targetElement) => {
    if (targetElement === 0) {
        return true;
    }
    return unit.style?.styleInfo?.element === targetElement || unit.style?.styleInfo?.element2 === targetElement;
}
/** UnitDataここまで */
