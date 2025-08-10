import {
    ABILIRY_TIMING, KB_NEXT, ACTION_ORDER,
    SINGLE_BUFF_LIST, ELEMENT_NAME, BUFF_FUNNEL_LIST
} from "./const";
import {
    CHARA_ID, SKILL_ID, SKILL, ELEMENT, BUFF, RANGE, FIELD, EFFECT, CONDITIONS, ATTRIBUTE, KIND,
    ALONE_ACTIVATION_ABILITY_LIST, ALONE_ACTIVATION_BUFF_KIND,

} from "utils/const";
import { getCharaData, getSkillData, getAttackInfo, getBuffList, getBuffIdToBuff, deepClone } from "utils/common";
import skillAttack from "data/skillAttack";

// アビリティ存在チェック
export function checkAbilityExist(ability_list, ability_id) {
    let exist_list = ability_list.filter(function (ability_info) {
        return ability_info.ability_id === ability_id;
    });
    return exist_list.length > 0;
}

// パッシブ存在チェック
export function checkPassiveExist(passive_list, skill_id) {
    let exist_list = passive_list.filter(function (passive) {
        return passive.skill_id === skill_id;
    });
    return exist_list.length > 0;
}

// バフ存在チェック
export function checkBuffExist(buffList, buff_kind, lv = 6) {
    let exist_list = buffList.filter(function (buffInfo) {
        return buffInfo.buff_kind === buff_kind;
    });
    if (buff_kind === BUFF.MORALE) {
        return exist_list.length > 0 && exist_list[0].lv >= lv;
    } else {
        return exist_list.length > 0;
    }
}

// バフ存在チェック
export function checkBuffIdExist(buffList, buff_id) {
    let exist_list = buffList.filter(function (buffInfo) {
        return buffInfo.buff_id === buff_id;
    });
    return exist_list.length > 0;
}

// メンバー存在チェック
export function checkMember(unitList, troops) {
    let member_list = unitList.filter(function (unit_info) {
        if (unit_info.style) {
            let chara_info = getCharaData(unit_info.style.styleInfo.chara_id);
            return chara_info.troops === troops;
        }
        return false;
    });
    return member_list.length;
}

// SPチェック
export function checkSp(turn_data, range_area, sp) {
    let targetList = getTargetList(turn_data, range_area, null, null, null);
    let exist_list = targetList.filter(function (target_no) {
        let unit_data = getUnitData(turn_data, target_no);
        return unit_data.sp < sp;
    })
    return exist_list.length > 0;
}


// スキルデータ更新
export const skillUpdate = (turn_data, skill_id, placeNo) => {
    const unit = turn_data.unitList.filter(unit => unit.placeNo === placeNo)[0];
    unit.selectSkillId = skill_id;
    if (skill_id !== 0) {
        unit.sp_cost = getSpCost(turn_data, getSkillData(skill_id), unit);
    } else {
        unit.sp_cost = 0;
    }
}

// ユーザ操作の取得
const updateUserOperation = (userOperation_list, turn_data) => {
    let filtered = userOperation_list.filter((item) =>
        compereUserOperation(item, turn_data) === 0
    );
    let userOperation = turn_data.userOperation;
    if (filtered.length === 0) {
        turn_data.userOperation.kb_action = KB_NEXT.ACTION;
        userOperation_list.push(turn_data.userOperation);
        // 表示確認用
        userOperation_list.sort((a, b) => compereUserOperation(a, b));
    } else {
        userOperation = filtered[0];
        turn_data.userOperation = userOperation;
    }
    userOperation.used = true;
}

// ユーザ操作をターンに反映
const reflectUserOperation = (turn_data, isLoadMode) => {
    // 配置変更
    turn_data.unitList.forEach((unit) => {
        if (unit.blank) return;
        let operation_placeNo = turn_data.userOperation.placeStyle.findIndex((item) =>
            item === unit.style.styleInfo.style_id);
        if (operation_placeNo >= 0) {
            if (turn_data.additionalTurn) {
                if (!isLoadMode) {
                    if (operation_placeNo !== unit.placeNo) {
                        setInitSkill(unit);
                        turn_data.userOperation.select_skill[unit.placeNo].skill_id = unit.selectSkillId;
                        turn_data.userOperation.placeStyle[unit.placeNo] = unit.style.styleInfo.style_id;
                    }
                    return;
                }
            }
            unit.placeNo = operation_placeNo;
        }
    })
    // オーバードライブ発動
    if (turn_data.userOperation.triggerOverDrive && turn_data.overDriveGauge > 100) {
        startOverDrive(turn_data);
    }
    // スキル設定
    turn_data.unitList.forEach((unit) => {
        if (unit.blank) return;
        const skill = turn_data.userOperation.select_skill[unit.placeNo];
        if (skill) {
            unit.buffTargetCharaId = skill.buffTargetCharaId;
            unit.buffEffectSelectType = skill.buffEffectSelectType;
            skillUpdate(turn_data, turn_data.userOperation.select_skill[unit.placeNo].skill_id, unit.placeNo);
        }
    })
    // OD再計算
    turn_data.addOverDriveGauge = getOverDrive(turn_data);
    // 行動反映
    if (turn_data.overDriveGauge + turn_data.addOverDriveGauge < 100) {
        turn_data.userOperation.kb_action = KB_NEXT.ACTION;
    }
    // OD発動反映
    turn_data.triggerOverDrive = turn_data.userOperation.triggerOverDrive;
}

// ユーザ操作の比較
const compereUserOperation = (comp1, comp2) => {
    if (comp1.turn_number !== comp2.turn_number) {
        return comp1.turn_number - comp2.turn_number;
    }
    if (comp1.finishAction !== comp2.finishAction) {
        return comp1.finishAction - comp2.finishAction;
    }
    if (comp1.endDriveTriggerCount !== comp2.endDriveTriggerCount) {
        return comp1.endDriveTriggerCount - comp2.endDriveTriggerCount;
    }
    if (comp1.overDriveNumber !== comp2.overDriveNumber) {
        return comp1.overDriveNumber - comp2.overDriveNumber;
    }
    if (comp1.additionalCount !== comp2.additionalCount) {
        return comp1.additionalCount - comp2.additionalCount;
    }
    return 0;
}

// バフアイコン取得
export function getBuffIconImg(buffInfo) {
    let src = "";
    switch (buffInfo.buff_kind) {
        case BUFF.ATTACKUP: // 攻撃力アップ
        case BUFF.ELEMENT_ATTACKUP: // 属性攻撃力アップ
            src += "IconBuffAttack";
            break;
        case BUFF.MINDEYE: // 心眼
            src += "IconMindEye";
            break;
        case BUFF.DEFENSEDOWN: // 防御力ダウン
        case BUFF.ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
            src += "IconBuffDefense";
            break;
        case BUFF.FRAGILE: // 脆弱
            src += "IconFragile";
            break;
        case BUFF.CRITICALRATEUP:	// クリティカル率アップ
        case BUFF.ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
            src += "IconCriticalRate";
            break;
        case BUFF.CRITICALDAMAGEUP:	// クリティカルダメージアップ
        case BUFF.ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
            src += "IconCriticalDamage";
            break;
        case BUFF.CHARGE: // チャージ
            src += "IconCharge";
            break;
        case BUFF.DAMAGERATEUP: // 破壊率アップ
            src += "IconDamageRate";
            break;
        case BUFF.FIGHTINGSPIRIT: // 闘志
            src += "IconFightingSpirit";
            break;
        case BUFF.MISFORTUNE: // 厄
            src += "IconMisfortune";
            break;
        case BUFF.FUNNEL: // 連撃
        case BUFF.ABILITY_FUNNEL: // アビリティ連撃
            src += "IconFunnel";
            break;
        case BUFF.DEFENSEDP: // DP防御ダウン
            src += "IconBuffDefenseDP";
            break;
        case BUFF.RESISTDOWN: // 耐性ダウン
            src += "IconResistElement";
            break;
        case BUFF.ETERNAL_DEFENSEDOWN: // 永続防御ダウン
        case BUFF.ELEMENT_ETERNAL_DEFENSEDOWN: // 永続属性防御ダウン
            src += "IconBuffDefenseE";
            break;
        case BUFF.RECOIL: // 行動不能
            src += "IconRecoil";
            break;
        case BUFF.PROVOKE: // 挑発
            src += "IconTarget";
            break;
        case BUFF.COVER: // 注目
            src += "IconCover";
            break;
        case BUFF.GIVEATTACKBUFFUP: // バフ強化
            src += "IconGiveAttackBuffUp";
            break;
        case BUFF.GIVEDEBUFFUP: // デバフ強化
            src += "IconGiveDebuffUp";
            break;
        case BUFF.ARROWCHERRYBLOSSOMS: // 桜花の矢
            src += "IconArrowCherryBlossoms";
            break;
        case BUFF.ETERNAL_OARH: // 永遠なる誓い
            src += "iconEternalOath";
            break;
        case BUFF.EX_DOUBLE: // EXスキル連続使用
            src += "IconDoubleActionExtraSkill";
            break;
        case BUFF.BABIED: // オギャり
            src += "IconBabied";
            break;
        case BUFF.MORALE: // 士気
            src += "IconMorale";
            break;
        case BUFF.DIVA_BLESS: // 歌姫の加護
            src += "IconDivaBress";
            break;
        case BUFF.SHREDDING: // 速弾き
            src += "IconShredding";
            break;
        case BUFF.NAGATIVE: // ネガティブ
            src += "IconNegativeMind";
            break;
        case BUFF.YAMAWAKI_SERVANT: // 山脇様のしもべ
            src += "IconYamawakiServant";
            break;
        case BUFF.HIGH_BOOST: // ハイブースト状態
            src += "IconHighBoost";
            break;
        case BUFF.MAKEUP: // メイクアップ
            src += "IconMakeup";
            break;
        case BUFF.FIRE_MARK: // 火の印
            src += "IconFireMark";
            break;
        default:
            break;
    }
    if (buffInfo.buff_element !== 0) {
        src += buffInfo.buff_element;
    }
    return src;
}

// ユニットデータ取得
export function getUnitData(turnData, index) {
    let unitList = turnData.unitList;
    const filteredUnit = unitList.filter((obj) => obj.placeNo === index);
    return filteredUnit.length > 0 ? filteredUnit[0] : undefined;
}

// スキルIDから攻撃情報を取得
export function getSkillIdToAttackInfo(turnData, skillId) {
    let filteredAttack = skillAttack.filter((obj) => obj.skill_id === skillId);
    switch (skillId) {
        case SKILL_ID.BOUQUET_SHOOT:
            //ファーマメントブーケショット
            let field = turnData.field < 6 ? turnData.field : FIELD.NORMAL;
            filteredAttack = filteredAttack.filter((obj) => obj.attack_element === field);
            break;
        default:
            break;
    }
    return filteredAttack.length > 0 ? filteredAttack[0] : undefined;
}

// 行動開始
export function startAction(turn_data) {
    // 追加ターンフラグ削除
    if (turn_data.additionalTurn) {
        turn_data.additionalTurn = false;
        unitLoop(function (unit) {
            if (unit.additionalTurn) {
                unit.additionalTurn = false;
            } else {
                unit.noAction = true;
            }
        }, turn_data.unitList);
    }
    // フィールド判定
    let oldField = turn_data.oldField;
    let select_field = turn_data.userOperation.field;
    if (oldField !== select_field && select_field) {
        // 変更があった場合はフィールドターンをリセット
        turn_data.fieldTurn = 0;
        turn_data.oldField = select_field;
    }

    let seq = sortActionSeq(turn_data);
    // 攻撃後に付与されるバフ種
    const ATTACK_AFTER_LIST = [BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP, BUFF.CRITICALRATEUP, BUFF.CRITICALDAMAGEUP, BUFF.ELEMENT_CRITICALRATEUP,
    BUFF.ELEMENT_CRITICALDAMAGEUP, BUFF.CHARGE, BUFF.DAMAGERATEUP];
    const front_cost_list = [];
    for (const skill_data of seq) {
        let skillInfo = skill_data.skillInfo;
        let unit_data = getUnitData(turn_data, skill_data.placeNo);
        let sp_cost = unit_data.sp_cost;
        // SP消費してから行動
        payCost(unit_data);

        let buffList = getBuffList(skillInfo.skill_id);
        for (let i = 0; i < buffList.length; i++) {
            let buffInfo = buffList[i];
            if (!(buffInfo.skill_attack1 === 999 && ATTACK_AFTER_LIST.includes(buffInfo.buff_kind))) {
                addBuffUnit(turn_data, buffInfo, skill_data.placeNo, unit_data);
            }
        }
        let attackInfo;
        if (skillInfo.skill_attribute === ATTRIBUTE.NORMAL_ATTACK) {
            attackInfo = { "attack_id": 0, "attack_element": unit_data.normalAttackElement };
        } else {
            attackInfo = getSkillIdToAttackInfo(turn_data, skillInfo.skill_id);
            if (attackInfo) {
                front_cost_list.push(sp_cost);
            }
        }

        if (attackInfo) {
            consumeBuffUnit(turn_data, unit_data, attackInfo, skillInfo);
        }

        // EXスキル使用
        if (skillInfo.skill_kind === KIND.EX_GENERATE || skillInfo.skill_kind === KIND.EX_EXCLUSIVE) {
            // アビリティ
            abilityActionUnit(turn_data, ABILIRY_TIMING.EX_SKILL_USE, unit_data);
            // EXスキル連続使用
            if (checkBuffExist(unit_data.buffList, BUFF.EX_DOUBLE)) {
                for (let i = 0; i < buffList.length; i++) {
                    let buffInfo = buffList[i];
                    if (!(buffInfo.skill_attack1 === 999 && ATTACK_AFTER_LIST.includes(buffInfo.buff_kind))) {
                        addBuffUnit(turn_data, buffInfo, skill_data.placeNo, unit_data);
                    }
                }
                if (attackInfo) {
                    consumeBuffUnit(turn_data, unit_data, attackInfo, skillInfo);
                }
                unit_data.buffList = unit_data.buffList.filter(obj => obj.buff_kind !== BUFF.EX_DOUBLE);
            }
        }

        // 攻撃後にバフを付与
        for (let i = 0; i < buffList.length; i++) {
            let buffInfo = buffList[i];
            if (buffInfo.skill_attack1 === 999 && ATTACK_AFTER_LIST.includes(buffInfo.buff_kind)) {
                addBuffUnit(turn_data, buffInfo, skill_data.placeNo, unit_data);
            }
        }
        origin(turn_data, skillInfo, unit_data);
    }

    // 後衛の選択取得
    [3, 4, 5].forEach(function (placeNo) {
        let unit_data = getUnitData(turn_data, placeNo);
        if (unit_data.blank) {
            return;
        }
        let skill_id = unit_data.selectSkillId;
        // 無し
        if (skill_id === SKILL.NONE) {
            return true;
        }
        // 追撃
        if (skill_id === SKILL.PURSUIT) {
            abilityActionUnit(turn_data, ABILIRY_TIMING.PURSUIT, unit_data)
            return true;
        }

        // 自動追撃
        if (skill_id === SKILL.AUTO_PURSUIT) {
            front_cost_list.filter(cost => cost <= 8).forEach(cost => {
                abilityActionUnit(turn_data, ABILIRY_TIMING.PURSUIT, unit_data)
            });
            return true;
        }
        let skillInfo = getSkillData(skill_id)
        if (skillInfo) {
            let attackInfo = getSkillIdToAttackInfo(turn_data, skill_id);
            if (attackInfo) {
                // SP消費してから行動
                payCost(unit_data);

                let buffList = getBuffIdToBuff(skillInfo.skill_id);
                for (let i = 0; i < buffList.length; i++) {
                    let buffInfo = buffList[i];
                    if (!(buffInfo.skill_attack1 === 999 && ATTACK_AFTER_LIST.includes(buffInfo.buff_kind))) {
                        addBuffUnit(turn_data, buffInfo, placeNo, unit_data);
                    }
                }
                consumeBuffUnit(turn_data, unit_data, attackInfo, skillInfo);
            }
            if (skill_id === SKILL_ID.CAT_JET_SHOOTING) {
                // ネコジェット・シャテキ後自動追撃
                abilityActionUnit(turn_data, ABILIRY_TIMING.PURSUIT, unit_data)
                const validCosts = front_cost_list.filter(cost => cost <= 8);
                validCosts.slice(0, Math.max(validCosts.length - 1, 0)).forEach(() => {
                    abilityActionUnit(turn_data, ABILIRY_TIMING.PURSUIT, unit_data)
                });
            }
        }
    });

    turn_data.overDriveGauge += turn_data.addOverDriveGauge;
    if (turn_data.overDriveGauge > 300) {
        turn_data.overDriveGauge = 300;
    }
    // 残りフィールドターン
    if (turn_data.fieldTurn > 1 && !turn_data.additionalTurn) {
        turn_data.fieldTurn--;
    } else if (turn_data.fieldTurn === 1) {
        turn_data.field = 0;
    }
}

// 耐性判定
function isResist(enemyInfo, physical, element, attackId) {
    let physicalRate = enemyInfo[`physical_${physical}`];
    let elementRate = enemyInfo[`element_${element}`];
    if (attackId) {
        let attackInfo = getAttackInfo(attackId);
        if (attackInfo.penetration) {
            physicalRate = 400;
            elementRate = 100;
        }
    }
    return physicalRate / 100 * elementRate / 100 < 1;
}

// 弱点判定
function isWeak(enemyInfo, physical, element, attackId) {
    let attackInfo = getAttackInfo(attackId);
    if (attackInfo.penetration) {
        return true;
    }
    let physicalRate = enemyInfo[`physical_${physical}`];
    let elementRate = enemyInfo[`element_${element}`];
    return physicalRate / 100 * elementRate / 100 > 1;
}

// 独自仕様
function origin(turn_data, skillInfo, unit_data) {
    // 初回判定
    unit_data.useSkillList.push(skillInfo.skill_id);
    switch (skillInfo.skill_id) {
        case 177: // エリミネイト・ポッシブル
            let target_unit_data = turn_data.unitList.filter(unit => unit?.style?.styleInfo?.chara_id === unit_data.buffTargetCharaId);
            target_unit_data[0].nextTurnMinSp = 3;
            break;
        case 617: // ドリーミー・ガーデン
            let target_unitList = turn_data.unitList.filter(unit => unit?.style?.styleInfo?.chara_id !== unit_data.style.styleInfo.chara_id);
            target_unitList.forEach(unit => unit.nextTurnMinSp = 10);
            break;
        default:
            break;
    }
    return;
}

// OD上昇量取得
export const getOverDrive = (turn) => {
    // OD上昇量取得
    const seq = sortActionSeq(turn);
    const enemy_count = turn.enemy_count;
    let od_plus = 0;
    const tempTurn = deepClone(turn);
    const front_cost_list = [];

    for (const skill_data of seq) {
        const skillInfo = skill_data.skillInfo;
        const unit_data = getUnitData(tempTurn, skill_data.placeNo);
        const buffList = getBuffList(skillInfo.skill_id);
        const attackInfo = getSkillIdToAttackInfo(turn, skillInfo.skill_id);
        let unit_od_plus = 0;
        // オギャり状態
        let badies = checkBuffExist(unit_data.buffList, BUFF.BABIED) ? 20 : 0;
        const earring = (attackInfo) ? getearringEffectSize(attackInfo.hit_count, unit_data) : 0;

        for (const buffInfo of buffList) {
            // OD増加
            if (buffInfo.buff_kind === BUFF.OVERDRIVEPOINTUP) {
                // 条件判定
                if (buffInfo.conditions && !judgmentCondition(buffInfo.conditions, buffInfo.conditions_id, tempTurn, unit_data, buffInfo.skill_id)) {
                    continue;
                }
                // サービス・エースが可変
                let correction = 1 + (badies + earring) / 100;
                unit_od_plus += Math.floor(buffInfo.max_power * correction * 100) / 100;
            }
            // 連撃、オギャり状態、チャージ処理
            const PROC_KIND = [BUFF.BABIED, BUFF.CHARGE];
            if (BUFF_FUNNEL_LIST.includes(buffInfo.buff_kind) || PROC_KIND.includes(buffInfo.buff_kind)) {
                addBuffUnit(tempTurn, buffInfo, skill_data.placeNo, unit_data);
            }
        }
        let physical = getCharaData(unit_data.style.styleInfo.chara_id).physical;
        if (skillInfo.skill_attribute === ATTRIBUTE.NORMAL_ATTACK) {
            // 通常攻撃
            if (!isResist(turn.enemyInfo, physical, unit_data.normalAttackElement, null)) {
                unit_od_plus += calcODGain(3, 1, badies);
            }
        } else if (attackInfo) {
            // 攻撃IDの変換(暫定)
            let attackId = attackInfo.attack_id
            switch (attackId) {
                case 83:
                    // 唯雅粛正
                    if (checkBuffExist(unit_data.buffList, BUFF.CHARGE)) {
                        attackId = 84;
                    }
                    break;
                default:
                    break;
            }
            front_cost_list.push(unit_data.sp_cost);
            if (!isResist(turn.enemyInfo, physical, attackInfo.attack_element, attackId)) {
                let enemy_target = enemy_count;
                if (attackInfo.range_area === 1) {
                    enemy_target = 1;
                }
                let funnel_list = getFunnelList(unit_data);
                unit_od_plus += calcODGain(attackInfo.hit_count, enemy_target, badies, earring, funnel_list.length);
                // EXスキル連続使用
                if (checkBuffExist(unit_data.buffList, BUFF.EX_DOUBLE) && (skillInfo.skill_kind === KIND.EX_GENERATE || skillInfo.skill_kind === KIND.EX_EXCLUSIVE)) {
                    buffList.forEach(function (buffInfo) {
                        // 連撃のみ処理
                        if (BUFF_FUNNEL_LIST.includes(buffInfo.buff_kind)) {
                            addBuffUnit(tempTurn, buffInfo, skill_data.placeNo, unit_data);
                        }
                    });
                    let funnel_list = getFunnelList(unit_data);
                    unit_od_plus += calcODGain(attackInfo.hit_count, enemy_target, badies, earring, funnel_list.length);
                }
            }
        }
        od_plus += unit_od_plus;
    }
    // // 後衛の選択取得
    [3, 4, 5].forEach(function (placeNo) {
        let unit_data = getUnitData(tempTurn, placeNo);
        if (unit_data.blank) {
            return;
        }
        let skill_id = unit_data.selectSkillId;
        if (skill_id === SKILL.NONE) {
            return true;
        }
        // 追撃
        if (skill_id === SKILL.PURSUIT) {
            let chara_data = getCharaData(unit_data.style.styleInfo.chara_id);
            if (!isResist(turn.enemyInfo, chara_data.physical, 0, 0)) {
                od_plus += chara_data.pursuit * 2.5;
            }
            return true;
        }
        let physical = getCharaData(unit_data.style.styleInfo.chara_id).physical;
        // 自動追撃
        if (skill_id === SKILL.AUTO_PURSUIT) {
            if (!isResist(turn.enemyInfo, physical, 0, 0)) {
                let chara_data = getCharaData(unit_data.style.styleInfo.chara_id)
                front_cost_list.filter(cost => cost <= 8).forEach(cost => {
                    od_plus += chara_data.pursuit * 2.5
                });
            }
            return true;
        }

        let skillInfo = getSkillData(skill_id)
        if (skillInfo) {
            const attackInfo = getSkillIdToAttackInfo(turn, skill_id);
            if (attackInfo) {
                let badies = checkBuffExist(unit_data.buffList, BUFF.BABIED) ? 20 : 0;
                const earring = attackInfo.attack_id ? getearringEffectSize(attackInfo.hit_count, unit_data) : 0;
                if (!isResist(turn.enemyInfo, physical, attackInfo.attack_element, attackInfo.attack_id)) {
                    let enemy_target = enemy_count;
                    if (attackInfo.range_area === 1) {
                        enemy_target = 1;
                    }
                    let funnel_list = getFunnelList(unit_data);
                    od_plus += calcODGain(attackInfo.hit_count, enemy_target, badies, earring, funnel_list.length);
                }
            }
            if (skill_id === SKILL_ID.CAT_JET_SHOOTING) {
                // ネコジェット・シャテキ後自動追撃
                if (!isResist(turn.enemyInfo, physical, 0, 0)) {
                    let chara_data = getCharaData(unit_data.style.styleInfo.chara_id)
                    const validCosts = front_cost_list.filter(cost => cost <= 8);
                    validCosts.slice(0, Math.max(validCosts.length - 1, 0)).forEach(() => {
                        od_plus += chara_data.pursuit * 2.5;
                    });
                }
            }
        }
    });
    return od_plus;
}

// OD計算
const calcODGain = (hitCount, enemyTarget, badies = 0, earring = 0, funnelCount = 0) => {
    const correction = 1 + (badies + earring) / 100;
    const hit_od = Math.floor(2.5 * correction * 100) / 100;
    return (hitCount * hit_od * enemyTarget) + (funnelCount * hit_od * enemyTarget);
};

// 消費SP取得
export function getSpCost(turn_data, skillInfo, unit) {
    if (!skillInfo) {
        return 0;
    }
    const NON_ACTION_ATTRIBUTE = [1, 2, 3, 99];
    if (NON_ACTION_ATTRIBUTE.includes(skillInfo.skill_attribute)) {
        return 0;
    }
    let spCost = skillInfo.sp_cost;
    if (spCost === 0) {
        return spCost;
    }
    let spCostDown = turn_data.sp_cost_down;
    let spCostUp = 0;
    if (harfSpSkill(turn_data, skillInfo, unit)) {
        spCost = Math.ceil(spCost / 2);
    }
    if (ZeroSpSkill(turn_data, skillInfo, unit)) {
        return 0;
    }

    // 追加ターン
    if (turn_data.additionalTurn) {
        // クイックリキャスト
        if (checkAbilityExist(unit[`ability_${ABILIRY_TIMING.OTHER}`], 1506)) {
            spCostDown = 2;
        }
        // 優美なる剣舞
        if (checkAbilityExist(unit[`ability_${ABILIRY_TIMING.OTHER}`], 1512)) {
            spCostDown = 2;
        }
        // 疾駆
        if (checkAbilityExist(unit[`ability_${ABILIRY_TIMING.OTHER}`], 1515)) {
            spCostDown = 2;
        }
    }
    // オーバードライブ中
    if (turn_data.overDriveMaxTurn > 0) {
        // 獅子に鰭
        if (checkAbilityExist(unit[`ability_${ABILIRY_TIMING.OTHER}`], 1521)) {
            spCostDown = 2;
        }
        // 飛躍
        if (checkAbilityExist(unit[`ability_${ABILIRY_TIMING.OTHER}`], 1525)) {
            spCostDown = 2;
        }
    }
    // 歌姫の加護
    if (checkBuffExist(unit.buffList, BUFF.DIVA_BLESS)) {
        // 絶唱
        if (checkAbilityExist(unit[`ability_${ABILIRY_TIMING.OTHER}`], 1522)) {
            spCostDown = 2;
        }
    }
    // ハイブースト
    if (checkBuffExist(unit.buffList, BUFF.HIGH_BOOST)) {
        spCostUp = 2;
    }
    // カラスの鳴き声で
    if (skillInfo.skill_id === 578) {
        const count = unit.useSkillList.filter(value => value === 578).length;
        spCost = 8 + 4 * count;
        spCost = spCost > 20 ? 20 : spCost;
    }
    // SP全消費
    if (spCost === 99) {
        spCost = unit.sp + unit.overDriveSp;
        spCostDown = 0;
        spCostUp = 0;
    }
    unit.spCostUp = spCostUp;
    unit.spCostDown = spCostDown;
    spCost += spCostUp - spCostDown;
    return spCost < 0 ? 0 : spCost;
}

// 消費SP半減
function harfSpSkill(turn_data, skillInfo, unit_data) {
    // SP消費半減
    if (skillInfo.skill_attribute === ATTRIBUTE.SP_HALF) {
        if (judgmentCondition(skillInfo.attribute_conditions, undefined, turn_data, unit_data, skillInfo.skill_id)) {
            return true;
        }
    }
    return false;
}

// 消費SP0
function ZeroSpSkill(turn_data, skillInfo, unit_data) {
    // SP消費0
    if (skillInfo.skill_attribute === ATTRIBUTE.SP_ZERO) {
        if (judgmentCondition(skillInfo.attribute_conditions, undefined, turn_data, unit_data, skillInfo.skill_id)) {
            return true;
        }
    }
    return false;
}

// 条件判定
function judgmentCondition(conditions, conditionsId, turn_data, unit_data, skill_id) {
    switch (conditions) {
        case CONDITIONS.FIRST_TURN: // 1ターン目
            return turn_data.turn_number === 1;
        case CONDITIONS.SKILL_INIT: // 初回
            return !unit_data.useSkillList.includes(skill_id)
        case CONDITIONS.additionalTurn: // 追加ターン
            return turn_data.additionalTurn;
        case CONDITIONS.DESTRUCTION_OVER_200: // 破壊率200%以上
        case CONDITIONS.BREAK: // ブレイク時
        case CONDITIONS.HAS_SHADOW: // 影分身
        case CONDITIONS.PERCENTAGE_30: // 確率30%
        case CONDITIONS.DOWN_TURN: // ダウンターン
        case CONDITIONS.BUFF_DISPEL: // バフ解除
        case CONDITIONS.DP_OVER_100: // DP100%以上
            return unit_data.buffEffectSelectType === 1;
        case CONDITIONS.OVER_DRIVE: // オーバードライブ中
            return turn_data.overDriveMaxTurn > 0;
        case CONDITIONS.DEFFENCE_DOWN: // 防御ダウン
            return checkBuffExist(turn_data.enemyDebuffList, BUFF.DEFENSEDOWN);
        case CONDITIONS.FRAGILE: // 脆弱
            return checkBuffExist(turn_data.enemyDebuffList, BUFF.FRAGILE);
        case CONDITIONS.TARGET_COVER: // 集中・挑発状態
            return checkBuffExist(turn_data.enemyDebuffList, BUFF.PROVOKE) || checkBuffExist(turn_data.enemyDebuffList, BUFF.COVER);
        case CONDITIONS.FIELD_NONE: // フィールド無し
            return [FIELD.NORMAL, FIELD.RICE, FIELD.SANDSTORM].includes(turn_data.field);
        case CONDITIONS.FIELD_FIRE: // 火属性フィールド
            return turn_data.field === FIELD.FIRE;
        case CONDITIONS.FIELD_ICE: // 氷属性フィールド
            return turn_data.field === FIELD.ICE;
        case CONDITIONS.FIELD_THUNDER: // 雷属性フィールド
            return turn_data.field === FIELD.THUNDER;
        case CONDITIONS.FIELD_LIGHT: // 光属性フィールド
            return turn_data.field === FIELD.LIGHT;
        case CONDITIONS.FIELD_DARK: // 闇属性フィールド
            return turn_data.field === FIELD.DARK;
        case CONDITIONS.HAS_ABILITY: // アビリティ
            return checkAbilityExist(unit_data[`ability_${ABILIRY_TIMING.OTHER}`], conditionsId);
        case CONDITIONS.HAS_CHARGE: // チャージ
            return checkBuffExist(unit_data.buffList, BUFF.CHARGE);
        case CONDITIONS.MORALE_OVER_6: // 士気Lv6以上
            return checkBuffExist(unit_data.buffList, BUFF.MORALE, conditionsId);
        case CONDITIONS.ENEMY_COUNT_1: // 敵1体
            return turn_data.enemy_count === 1;
        case CONDITIONS.ENEMY_COUNT_2: // 敵2体
            return turn_data.enemy_count === 2;
        case CONDITIONS.ENEMY_COUNT_3: // 敵3体
            return turn_data.enemy_count === 3;
        case CONDITIONS.SELECT_31A: // 31A選択
            return CHARA_ID.MEMBER_31A.includes(unit_data.buffTargetCharaId);
        case CONDITIONS.MEMBER_31C_3: // 31A3人以上
            return checkMember(turn_data.unitList, "31A") >= 3;
        case CONDITIONS.OVER_31C_3: // 31C3人以上
            return checkMember(turn_data.unitList, "31C") >= 3;
        case CONDITIONS.OVER_31D_3: // 31D3人以上
            return checkMember(turn_data.unitList, "31D") >= 3;
        case CONDITIONS.MEMBER_31E_3: // 31E3人以上
            return checkMember(turn_data.unitList, "31E") >= 3;
        case CONDITIONS.FIELD_NOT_FIRE: // 火属性フィールド以外
            return turn_data.field !== FIELD.FIRE && turn_data.field !== FIELD.NORMAL;
        case CONDITIONS.DIVA_BLESS: // 歌姫の加護
            return checkBuffExist(unit_data.buffList, BUFF.DIVA_BLESS);
        case CONDITIONS.NOT_DIVA_BLESS: // 歌姫の加護以外
            return !checkBuffExist(unit_data.buffList, BUFF.DIVA_BLESS);
        case CONDITIONS.NOT_NEGATIVE: // ネガティブ以外
            return !checkBuffExist(unit_data.buffList, BUFF.NAGATIVE);
        case CONDITIONS.HAS_MAEKUP: // メイクアップ
            return checkBuffExist(unit_data.buffList, BUFF.MAKEUP);
        case CONDITIONS.SP_UNDER_0_ALL: // SP0以下の味方がいる
            return checkSp(turn_data, RANGE.ALLY_ALL, 0);
        case CONDITIONS.SARVANT_OVER3: // 山脇様のしもべ3人以上
        case CONDITIONS.SARVANT_OVER5: // 山脇様のしもべ5人以上
        case CONDITIONS.SARVANT_OVER6: // 山脇様のしもべ6人以上
            let servant_count = 0;
            turn_data.unitList.forEach((unit) => {
                if (checkBuffExist(unit.buffList, BUFF.YAMAWAKI_SERVANT)) {
                    servant_count++;
                };
            })
            if (CONDITIONS.SARVANT_OVER3 === conditions) {
                return servant_count >= 3;
            } else if (CONDITIONS.SARVANT_OVER5 === conditions) {
                return servant_count >= 5;
            } else if (CONDITIONS.SARVANT_OVER6 === conditions) {
                return servant_count >= 6;
            }
            break;
        case CONDITIONS.USE_COUNT_2: // 2回目以降
            return 1 <= unit_data.useSkillList.filter(id => id === skill_id).length;
        case CONDITIONS.USE_COUNT_3: // 3回目以降
            return 2 <= unit_data.useSkillList.filter(id => id === skill_id).length;
        case CONDITIONS.USE_COUNT_4: // 4回目以降
            return 3 <= unit_data.useSkillList.filter(id => id === skill_id).length;
        default:
            break;
    }
    return true;
}

function getFieldElement(turn_data) {
    let field_element = Number(turn_data.field);
    if (field_element === FIELD.RICE || field_element === FIELD.SANDSTORM) {
        field_element = 0;
    }
    return field_element;
}

// バフを追加
function addBuffUnit(turn_data, buffInfo, placeNo, use_unit_data) {
    // 条件判定
    if (buffInfo.conditions !== null) {
        if (!judgmentCondition(buffInfo.conditions, buffInfo.conditions_id, turn_data, use_unit_data, buffInfo.skill_id)) {
            return;
        }
    }

    // 個別判定
    switch (buffInfo.buff_id) {
        // 選択されなかった
        case 2: // トリック・カノン(攻撃力低下)
            if (use_unit_data.buffEffectSelectType === 0) {
                return;
            }
            break;
        default:
            break;
    }
    switch (buffInfo.skill_id) {
        case 557: // 極彩色
            let field_element = getFieldElement(turn_data);
            if (buffInfo.buff_element !== field_element) {
                return;
            }
            break;
        default:
            break;
    }

    let targetList;
    // 対象策定
    switch (buffInfo.buff_kind) {
        case BUFF.ATTACKUP: // 攻撃力アップ
        case BUFF.ELEMENT_ATTACKUP: // 属性攻撃力アップ
        case BUFF.MINDEYE: // 心眼
        case BUFF.CRITICALRATEUP:	// クリティカル率アップ
        case BUFF.CRITICALDAMAGEUP:	// クリティカルダメージアップ
        case BUFF.ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
        case BUFF.ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
        case BUFF.CHARGE: // チャージ
        case BUFF.DAMAGERATEUP: // 破壊率アップ
        case BUFF.FUNNEL: // 連撃
        case BUFF.RECOIL: // 行動不能
        case BUFF.GIVEATTACKBUFFUP: // バフ強化
        case BUFF.GIVEDEBUFFUP: // デバフ強化
        case BUFF.ARROWCHERRYBLOSSOMS: // 桜花の矢
        case BUFF.ETERNAL_OARH: // 永遠なる誓い
        case BUFF.EX_DOUBLE: // EXスキル連続使用
        case BUFF.BABIED: // オギャり
        case BUFF.DIVA_BLESS: // 歌姫の加護
        case BUFF.SHREDDING: // 速弾き
        case BUFF.YAMAWAKI_SERVANT: // 山脇様のしもべ
            // バフ追加
            targetList = getTargetList(turn_data, buffInfo.range_area, buffInfo.target_element, placeNo, use_unit_data.buffTargetCharaId);
            if (buffInfo.buff_kind === BUFF.ATTACKUP || buffInfo.buff_kind === BUFF.ELEMENT_ATTACKUP) {
                // 先頭のバフ強化を消費する。
                let index = use_unit_data.buffList.findIndex(function (buffInfo) {
                    return buffInfo.buff_kind === BUFF.GIVEATTACKBUFFUP;
                });
                if (index !== -1) {
                    use_unit_data.buffList.splice(index, 1);
                }
            }
            targetList.forEach(function (target_no) {
                let unit_data = getUnitData(turn_data, target_no);
                if (unit_data.blank) {
                    return;
                }
                // 単一バフ
                if (SINGLE_BUFF_LIST.includes(buffInfo.buff_kind)) {
                    if (checkBuffExist(unit_data.buffList, buffInfo.buff_kind)) {
                        if (buffInfo.effect_count > 0) {
                            // 残ターン更新
                            let filter_list = unit_data.buffList.filter(function (buff) {
                                return buff.buff_kind === buffInfo.buff_kind;
                            })
                            filter_list[0].rest_turn = buffInfo.effect_count;
                        }
                        return true;
                    }
                }
                if (isAloneActivation(buffInfo)) {
                    if (checkBuffIdExist(unit_data.buffList, buffInfo.buff_id)) {
                        if (buffInfo.effect_count > 0) {
                            // 残ターン更新
                            let filter_list = unit_data.buffList.filter(function (buff) {
                                return buff.buff_id === buffInfo.buff_id;
                            })
                            filter_list[0].rest_turn = buffInfo.effect_count;
                        }
                        return true;
                    }
                }
                let buff = createBuffData(buffInfo, use_unit_data);
                if (buffInfo.buff_id === 1037 && unit_data.style.styleInfo.element === 1) {
                    buff.rest_turn = 5;
                }
                unit_data.buffList.push(buff);
            });
            break;
        case BUFF.MORALE: // 士気
            // バフ追加
            targetList = getTargetList(turn_data, buffInfo.range_area, buffInfo.target_element, placeNo, use_unit_data.buffTargetCharaId);
            targetList.forEach(function (target_no) {
                let unit_data = getUnitData(turn_data, target_no);
                if (unit_data.blank) {
                    return;
                }
                let exist_list = unit_data.buffList.filter(function (buffInfo) {
                    return buffInfo.buff_kind === BUFF.MORALE;
                });
                let buff;
                if (exist_list.length > 0) {
                    buff = exist_list[0];
                } else {
                    buff = createBuffData(buffInfo, use_unit_data);
                    unit_data.buffList.push(buff);
                }
                buff.lv = Math.min(buff.lv + buffInfo.effect_size, 10);
            });
            break;
        case BUFF.DEFENSEDOWN: // 防御力ダウン
        case BUFF.ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
        case BUFF.FRAGILE: // 脆弱
        case BUFF.DEFENSEDP: // DP防御力ダウン
        case BUFF.RESISTDOWN: // 耐性ダウン
        case BUFF.ETERNAL_DEFENSEDOWN: // 永続防御ダウン
        case BUFF.ELEMENT_ETERNAL_DEFENSEDOWN: // 永続属性防御ダウン
        case BUFF.PROVOKE: // 挑発
        case BUFF.COVER: // 注目
            // デバフ追加
            let add_count = 1;
            if (buffInfo.range_area === RANGE.ENEMY_ALL) {
                add_count = turn_data.enemy_count;
            }
            // デバフ強化を消費する。
            let index = use_unit_data.buffList.findIndex(function (buffInfo) {
                return buffInfo.buff_kind === BUFF.GIVEDEBUFFUP || buffInfo.buff_kind === BUFF.ARROWCHERRYBLOSSOMS;
            });
            if (index !== -1) {
                use_unit_data.buffList.splice(index, 1);
            }
            for (let i = 0; i < add_count; i++) {
                let debuff = createBuffData(buffInfo, use_unit_data);
                turn_data.enemyDebuffList.push(debuff);
            }
            break;
        case BUFF.HEALSP: // SP追加
            targetList = getTargetList(turn_data, buffInfo.range_area, buffInfo.target_element, placeNo, use_unit_data.buffTargetCharaId);
            targetList.forEach(function (target_no) {
                skillHealSp(turn_data, target_no, buffInfo.min_power, buffInfo.max_power, placeNo, false, buffInfo.buff_id);
            });
            break;
        case BUFF.HEALEP: // EP追加
            targetList = getTargetList(turn_data, buffInfo.range_area, buffInfo.target_element, placeNo, use_unit_data.buffTargetCharaId);
            targetList.forEach(function (target_no) {
                let unitData = getUnitData(turn_data, target_no);
                unitData.ep += buffInfo.min_power;
                if (unitData.ep > 10) {
                    unitData.ep = 10
                }
            });
            break;
        case BUFF.ADDITIONALTURN: // 追加ターン
            targetList = getTargetList(turn_data, buffInfo.range_area, buffInfo.target_element, placeNo, use_unit_data.buffTargetCharaId);
            targetList.forEach(function (target_no) {
                let unitData = getUnitData(turn_data, target_no);
                unitData.additionalTurn = true;
            });
            turn_data.additionalTurn = true;
            break;
        case BUFF.FIELD: // フィールド
            turn_data.field = buffInfo.buff_element;
            let fieldTurn = buffInfo.effect_count;
            if (fieldTurn > 0) {
                // 天長地久
                if (checkAbilityExist(use_unit_data[`ability_${ABILIRY_TIMING.OTHER}`], 603)) {
                    fieldTurn = 0;
                }
                // 天長地久
                if (checkAbilityExist(use_unit_data[`ability_${ABILIRY_TIMING.OTHER}`], 606) && checkBuffExist(use_unit_data.buffList, BUFF.MORALE, 6)) {
                    fieldTurn = 0;
                }
                // メディテーション
                if (checkPassiveExist(use_unit_data.passiveSkillList, 501)) {
                    fieldTurn = 0;
                }
            }
            // フィールド展開アビリティ
            abilityAction(ABILIRY_TIMING.FIELD_DEPLOY, turn_data);
            turn_data.fieldTurn = fieldTurn;
            break;
        case BUFF.DISPEL: // ディスペル
            targetList = getTargetList(turn_data, buffInfo.range_area, buffInfo.target_element, placeNo, use_unit_data.buffTargetCharaId);
            targetList.forEach(function (target_no) {
                let unit_data = getUnitData(turn_data, target_no);
                unit_data.buffList = unit_data.buffList.filter(function (buffInfo) {
                    return buffInfo.buff_kind !== BUFF.RECOIL && buffInfo.buff_kind !== BUFF.NAGATIVE;
                });
            });
            break;
        default:
            break;
    }
}

function skillHealSp(turnData, targetNo, addSp, limitSp, usePlaceNo, isRecursion, buffId) {
    let unitData = getUnitData(turnData, targetNo);
    if (unitData.blank) return;
    let unitSp = unitData.sp;
    let minusSp = 0;
    // クレール・ド・リュンヌ(＋)、収穫祭+は消費SPを加味する。
    if (buffId === 120 || buffId === 121 || buffId === 229) {
        minusSp = unitData.sp_cost;
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
        if (checkAbilityExist(unitData[`ability_${ABILIRY_TIMING.OTHER}`], 1605) && targetNo !== usePlaceNo) {
            skillHealSp(unitData, targetNo, 3, 30, null, true, 0)
        }
        // お裾分け/意気軒昂
        if ((checkAbilityExist(unitData[`ability_${ABILIRY_TIMING.OTHER}`], 1606) ||
            checkAbilityExist(unitData[`ability_${ABILIRY_TIMING.OTHER}`], 1612))
            && targetNo !== usePlaceNo) {
            let targetList = getTargetList(turnData, RANGE.ALLY_ALL, 0, targetNo, null);
            targetList.forEach(function (targetNo) {
                skillHealSp(turnData, targetNo, 2, 30, null, true, 0)
            });
        }
    }
}

function createBuffData(buffInfo, use_unit_data) {
    let buff = {};
    buff.buff_kind = buffInfo.buff_kind;
    buff.buff_element = buffInfo.buff_element;
    buff.effect_size = buffInfo.effect_size;
    buff.effect_count = buffInfo.effect_count;
    buff.buff_name = buffInfo.buff_name
    buff.skill_id = buffInfo.skill_id;
    buff.buff_id = buffInfo.buff_id;
    buff.max_power = buffInfo.max_power;
    buff.rest_turn = buffInfo.effect_count === 0 ? -1 : buffInfo.effect_count;
    buff.lv = 0;
    switch (buffInfo.buff_kind) {
        case BUFF.DEFENSEDOWN: // 防御力ダウン
        case BUFF.ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
        case BUFF.FRAGILE: // 脆弱
        case BUFF.DEFENSEDP: // DP防御力ダウン 
            // ダブルリフト
            if (checkAbilityExist(use_unit_data[`ability_${ABILIRY_TIMING.OTHER}`], 1516)) {
                buff.rest_turn++;
            }
            break;
        case BUFF.FUNNEL: // 連撃
            buff.effect_sum = buffInfo.effect_size * buffInfo.max_power;
            break;
        default:
            break;
    }
    return buff;
}

// 単独発動判定
function isAloneActivation(buffInfo) {
    if (ALONE_ACTIVATION_BUFF_KIND.includes(buffInfo.buff_kind)) {
        return buffInfo.effect_count > 0;
    }
    return false;
}

// 攻撃時にバフ消費
function consumeBuffUnit(turn_data, unit_data, attack_info, skillInfo) {
    let consume_kind = [];
    let consume_count = 2
    if (attack_info) {
        // 連撃消費
        getFunnelList(unit_data);
    }
    // バフ消費
    let buffList = unit_data.buffList;
    for (let i = buffList.length - 1; i >= 0; i--) {
        let buffInfo = buffList[i];
        const countWithFilter = consume_kind.filter(buff_kind => buff_kind === buffInfo.buff_kind).length;
        if (buffInfo.rest_turn > 0) {
            // 残ターンバフは現状単独発動のみ
            for (let j = 0; j < consume_count; j++) {
                consume_kind.push(buffInfo.buff_kind);
            }
            continue;
        }
        // 同一バフは制限
        if (countWithFilter < consume_count) {
            switch (buffInfo.buff_kind) {
                case BUFF.ELEMENT_ATTACKUP: // 属性攻撃力アップ
                    if (attack_info.attack_element !== buffInfo.buff_element) {
                        continue;
                    }
                // fallthrough
                case BUFF.ATTACKUP: // 攻撃力アップ
                case BUFF.MINDEYE: // 心眼
                case BUFF.CHARGE: // チャージ
                case BUFF.DAMAGERATEUP: // 破壊率アップ
                case BUFF.ARROWCHERRYBLOSSOMS: // 桜花の矢
                    // スキルでのみ消費
                    if (attack_info.attack_id === 0) {
                        continue;
                    }
                    if (buffInfo.buff_kind === BUFF.MINDEYE) {
                        // 弱点のみ消費
                        let physical = getCharaData(unit_data.style.styleInfo.chara_id).physical;
                        if (!isWeak(turn_data.enemyInfo, physical, attack_info.attack_element, attack_info.attack_id)) {
                            continue;
                        }
                    }
                    buffList.splice(i, 1);
                    break;
                case BUFF.ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
                case BUFF.ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
                    if (attack_info.attack_element !== buffInfo.buff_element) {
                        continue;
                    }
                // fallthrough
                case BUFF.CRITICALRATEUP:	// クリティカル率アップ
                case BUFF.CRITICALDAMAGEUP:	// クリティカルダメージアップ
                    // 通常攻撃でも消費
                    buffList.splice(i, 1);
                    // 星屑の航路は消費しない。
                    if (buffInfo.skill_id === 67 || buffInfo.skill_id === 491) {
                        continue;
                    }
                    break;
                default:
                    // 上記以外のバフ消費しない
                    break;
            }
            consume_kind.push(buffInfo.buff_kind);
        }
    };
}

// バフ名称取得
export function getBuffKindName(buffInfo) {
    let buff_kind_name = "";
    if (buffInfo.buff_element !== 0) {
        buff_kind_name = ELEMENT_NAME[buffInfo.buff_element] + "属性";
    }

    switch (buffInfo.buff_kind) {
        case BUFF.ATTACKUP: // 攻撃力アップ
        case BUFF.ELEMENT_ATTACKUP: // 属性攻撃力アップ
            buff_kind_name += "攻撃力アップ";
            break;
        case BUFF.MINDEYE: // 心眼
            buff_kind_name += "心眼";
            break;
        case BUFF.DEFENSEDOWN: // 防御力ダウン
        case BUFF.ELEMENT_DEFENSEDOWN: // 属性防御力ダウン
            buff_kind_name += "防御力ダウン";
            break;
        case BUFF.FRAGILE: // 脆弱
            buff_kind_name += "脆弱";
            break;
        case BUFF.CRITICALRATEUP:	// クリティカル率アップ
        case BUFF.ELEMENT_CRITICALRATEUP:	// 属性クリティカル率アップ
            buff_kind_name += "クリティカル率アップ";
            break;
        case BUFF.CRITICALDAMAGEUP:	// クリティカルダメージアップ
        case BUFF.ELEMENT_CRITICALDAMAGEUP:	// 属性クリティカルダメージアップ
            buff_kind_name += "クリティカルダメージアップ";
            break;
        case BUFF.CHARGE: // チャージ
            buff_kind_name += "チャージ";
            break;
        case BUFF.DAMAGERATEUP: // 破壊率アップ
            buff_kind_name += "破壊率アップ";
            break;
        case BUFF.FIGHTINGSPIRIT: // 闘志
            buff_kind_name += "闘志";
            break;
        case BUFF.MISFORTUNE: // 厄
            buff_kind_name += "厄";
            break;
        case BUFF.FUNNEL: // 連撃
        case BUFF.ABILITY_FUNNEL: // アビリティ連撃
            switch (buffInfo.effect_size) {
                case 6:
                    buff_kind_name += "連撃(小)";
                    break
                case 12:
                    buff_kind_name += "連撃(中)";
                    break
                case 25:
                    buff_kind_name += "連撃(大)";
                    break
                case 50:
                    buff_kind_name += "連撃(特大)";
                    break
                default:
                    break;
            }
            break;
        case BUFF.DEFENSEDP: // DP防御力ダウン
            buff_kind_name += "DP防御力ダウン";
            break;
        case BUFF.RESISTDOWN: // 耐性ダウン
            buff_kind_name += "耐性打ち消し/ダウン";
            break;
        case BUFF.ETERNAL_DEFENSEDOWN: // 永続防御ダウン
        case BUFF.ELEMENT_ETERNAL_DEFENSEDOWN: // 永続属性防御ダウン
            buff_kind_name += "防御力ダウン";
            break;
        case BUFF.RECOIL: // 行動不能
            buff_kind_name += "行動不能";
            break;
        case BUFF.PROVOKE: // 挑発
            buff_kind_name += "挑発";
            break;
        case BUFF.COVER: // 注目
            buff_kind_name += "注目";
            break;
        case BUFF.GIVEATTACKBUFFUP: // バフ強化
            buff_kind_name += "バフ強化";
            break;
        case BUFF.GIVEDEBUFFUP: // デバフ強化
            buff_kind_name += "デバフ強化";
            break;
        case BUFF.ARROWCHERRYBLOSSOMS: // 桜花の矢
            buff_kind_name += "桜花の矢";
            break;
        case BUFF.ETERNAL_OARH: // 永遠なる誓い
            buff_kind_name += "永遠なる誓い";
            break;
        case BUFF.EX_DOUBLE: // EXスキル連続使用
            buff_kind_name += "EXスキル連続使用";
            break;
        case BUFF.BABIED: // オギャり
            buff_kind_name += "オギャり";
            break;
        case BUFF.MORALE: // 士気
            buff_kind_name += "士気";
            break;
        case BUFF.DIVA_BLESS: // 歌姫の加護
            buff_kind_name += "歌姫の加護";
            break;
        case BUFF.SHREDDING: // 速弾き
            buff_kind_name += "速弾き";
            break;
        case BUFF.NAGATIVE: // ネガティブ
            buff_kind_name += "ネガティブ";
            break;
        case BUFF.YAMAWAKI_SERVANT: // 山脇様のしもべ
            buff_kind_name += "山脇様のしもべ";
            break;
        case BUFF.HIGH_BOOST: // ハイブースト状態
            buff_kind_name += "ハイブースト";
            break;
        case BUFF.MAKEUP: // メイクアップ
            buff_kind_name += "メイクアップ";
            break;
        default:
            break;
    }
    return buff_kind_name;
}


// ターゲットリスト追加
function getTargetList(turn_data, range_area, target_element, placeNo, buffTargetCharaId) {
    let targetList = [];
    let target_unit_data;
    switch (range_area) {
        case RANGE.FIELD: // 場
            break;
        case RANGE.ENEMY_UNIT: // 敵単体
            break;
        case RANGE.ENEMY_ALL: // 敵全体
            break;
        case RANGE.ALLY_UNIT: // 味方単体
        case RANGE.OTHER_UNIT: // 自分以外の味方単体
            target_unit_data = turn_data.unitList.filter(unit => unit?.style?.styleInfo?.chara_id === buffTargetCharaId);
            if (target_unit_data.length > 0) {
                targetList.push(target_unit_data[0].placeNo);
            }
            break;
        case RANGE.ALLY_FRONT: // 味方前衛
            targetList = [0, 1, 2];
            break;
        case RANGE.ALLY_BACK: // 味方後衛
            targetList = [3, 4, 5];
            break;
        case RANGE.ALLY_ALL: // 味方全員
            targetList = [...Array(6).keys()];
            break;
        case RANGE.SELF: // 自分
            targetList.push(placeNo);
            break;
        case RANGE.SELF_OTHER: // 自分以外
            targetList = [...Array(6).keys()].filter(num => num !== placeNo);
            break;
        case RANGE.SELF_AND_UNIT: // 味方単体
            target_unit_data = turn_data.unitList.filter(unit => unit?.style?.styleInfo?.chara_id === buffTargetCharaId);
            targetList.push(placeNo);
            if (target_unit_data.length > 0) {
                targetList.push(target_unit_data[0].placeNo);
            }
            break;
        case RANGE.FRONT_OTHER: // 自分以外の前衛
            targetList = [...Array(3).keys()].filter(num => num !== placeNo);
            break;
        case RANGE.MEMBER_31C: // 31Cメンバー
            targetList = getTargetPlaceList(turn_data.unitList, CHARA_ID.MEMBER_31C);
            break;
        case RANGE.MEMBER_31E: // 31Eメンバー
            targetList = getTargetPlaceList(turn_data.unitList, CHARA_ID.MEMBER_31E);
            break;
        case CHARA_ID.MARUYAMA: // 丸山部隊メンバー
            targetList = getTargetPlaceList(turn_data.unitList, CHARA_ID.MARUYAMA);
            break;
        case RANGE.RUKA_SHARO: // 月歌とシャロ
            targetList = getTargetPlaceList(turn_data.unitList, CHARA_ID.RUKA_SHARO);
            break;
        default:
            break;
    }
    // パッシブに属性未対応
    if (target_element && target_element !== 0) {
        for (let i = targetList.length - 1; i >= 0; i--) {
            let unit = getUnitData(turn_data, targetList[i]);
            if (unit.blank || (unit.style.styleInfo.element !== target_element && unit.style.styleInfo.element2 !== target_element)) {
                targetList.splice(i, 1);
            }
        }
    }
    return targetList;
}

// メンバーリスト作成
function getTargetPlaceList(unitList, member_id_list) {
    return member_id_list.reduce((acc, member_id) => {
        const placeNo = charaIdToPlaceNo(unitList, member_id);
        if (placeNo !== null) { // nullを除外
            acc.push(placeNo);
        }
        return acc;
    }, []);
}
// キャラIDから場所番号を取得
function charaIdToPlaceNo(unitList, member_id) {
    for (let unit of unitList) {
        if (unit.style?.styleInfo?.chara_id === member_id) {
            return unit.placeNo;
        }
    }
    return null;
}

// 行動順を取得
const sortActionSeq = (turn_data) => {
    let buff_seq = [];
    let attack_seq = [];

    // 前衛のスキルを取得
    turn_data.unitList.forEach((unit, index) => {
        let skill_id = unit.selectSkillId;
        let placeNo = unit.placeNo;
        // 前衛以外
        if (skill_id === 0 || 3 <= placeNo) {
            return true;
        }
        // 追加ターン以外
        if (turn_data.additionalTurn && !unit.additionalTurn) {
            return true;
        }
        // 行動不能
        if (checkBuffExist(unit.buffList, BUFF.RECOIL)) {
            return true;
        }
        let skillInfo = getSkillData(skill_id);
        let skill_data = {
            skillInfo: skillInfo,
            placeNo: placeNo
        };
        let attackInfo = getSkillIdToAttackInfo(turn_data, skill_id);
        if (attackInfo || skillInfo.skill_attribute === ATTRIBUTE.NORMAL_ATTACK) {
            attack_seq.push(skill_data);
        } else {
            buff_seq.push(skill_data);
        }
    });
    attack_seq.sort((a, b) => a.placeNo - b.placeNo);
    buff_seq.sort((a, b) => a.placeNo - b.placeNo);
    // バフとアタックの順序を結合
    return buff_seq.concat(attack_seq);
}


// ターンデータ再生成
export const recreateTurnData = (turnList, turnData, userOperationList, isLoadMode) => {
    // ユーザ操作リストのチェック
    userOperationList.forEach((item) => {
        item.used = compereUserOperation(item, turnData) <= 0;
    })

    while (compereUserOperation(turnData.userOperation, userOperationList[userOperationList.length - 1]) < 0) {
        // 現ターン処理
        turnData = deepClone(turnData);
        startAction(turnData);
        initTurn(turnData, false);
        // proceedTurn(turnData, false);
        turnList.push(turnData);
        // ユーザ操作の更新
        updateUserOperation(userOperationList, turnData);
        // ユーザ操作をターンに反映
        reflectUserOperation(turnData, isLoadMode);
    }
}

// ターン初期処理
export function initTurn(turnData) {
    unitSort(turnData);
    if (turnData.additionalTurn) {
        turnProceed(KB_NEXT.ADDITIONALTURN, turnData);
        // 追加ターン開始
        abilityAction(ABILIRY_TIMING.ADDITIONALTURN, turnData);
    } else {
        let kbAction = turnData.userOperation.kb_action;
        if (kbAction === KB_NEXT.ACTION) {
            // 行動開始時
            abilityAction(ABILIRY_TIMING.ACTION_START, turnData);
        }
        let turnProgress = turnProceed(kbAction, turnData);
        if (turnProgress) {
            // ターン開始時
            abilityAction(ABILIRY_TIMING.SELF_START, turnData);
        }
    }

    // ターンごとに初期化
    turnData.triggerOverDrive = false;
    turnData.startOverDriveGauge = turnData.overDriveGauge;
    turnData.oldField = turnData.field;
    turnData.seqTurn++;
    setUserOperation(turnData);
}


//** ターンデータ部 */
const unitLoop = (func, unitList, arg1) => {
    unitList.forEach(function (unit) {
        if (!unit.blank) {
            func(unit, arg1);
        }
    });
}

const unitOrderLoop = (func, unitList) => {
    ACTION_ORDER.forEach(function (index) {
        let unit = unitList[index];
        if (!unit.blank) {
            func(unit);
        }
    });
}

// 1:通常戦闘,2:後打ちOD,3:追加ターン
const turnProceed = (kb_next, turn) => {
    let turnProgress = false;
    turn.enemyDebuffList.sort((a, b) => a.buff_kind - b.buff_kind);
    if (kb_next === KB_NEXT.ACTION) {
        // オーバードライブ
        if (turn.overDriveMaxTurn > 0) {
            turn.overDriveNumber++;
            unitLoop(unitOverDriveTurnProceed, turn.unitList)
            if (turn.overDriveMaxTurn < turn.overDriveNumber) {
                // オーバードライブ終了
                turn.overDriveMaxTurn = 0;
                turn.overDriveNumber = 0;
                turn.endDriveTriggerCount++;
                if (turn.finishAction) {
                    turnProgress = true;
                    nextTurn(turn);
                }
            }
        } else {
            turnProgress = true;
            nextTurn(turn);
        }
        turn.additionalCount = 0;
    } else if (kb_next === KB_NEXT.ADDITIONALTURN) {
        // 追加ターン
        turn.additionalCount++;
    } else {
        // 行動開始＋OD発動
        startOverDrive(turn);
        turn.finishAction = true;
        turn.endDriveTriggerCount = 0;
        unitLoop(unitOverDriveTurnProceed, turn.unitList);
    }
    unitLoop(function (unit) {
        if (unit.noAction) {
            unit.noAction = false;
            return;
        }
        buffConsumption(turnProgress, unit);
        unitTurnInit(turn.additionalTurn, unit);
    }, turn.unitList);
    return turnProgress
}

export const setUserOperation = (turn) => {
    // 初期値を設定
    turn.userOperation = {
        field: null,
        enemy_count: null,
        select_skill: turn.unitList.map(function (unit) {
            if (unit.blank) {
                return null;
            }
            setInitSkill(unit)
            return { skill_id: unit.selectSkillId };
        }),
        placeStyle: turn.unitList.map(function (unit) {
            return unit.blank ? 0 : unit.style.styleInfo.style_id;
        }),
        triggerOverDrive: false,
        selectedPlaceNo: -1,
        kb_action: KB_NEXT.ACTION,
        finishAction: turn.finishAction,
        endDriveTriggerCount: turn.endDriveTriggerCount,
        turn_number: turn.turn_number,
        additionalCount: turn.additionalCount,
        overDriveNumber: turn.overDriveNumber,
        remark: "",
    }
}

const nextTurn = (turn) => {
    // 通常進行
    unitLoop(unitTurnProceed, turn.unitList, turn);

    turn.turn_number++;
    turn.finishAction = false;
    turn.endDriveTriggerCount = 0;
    abilityAction(ABILIRY_TIMING.RECEIVE_DAMAGE, turn);
    if (turn.turn_number % turn.stepTurnOverDrive === 0) {
        turn.overDriveGauge += turn.stepOverDriveGauge;
        if (turn.overDriveGauge < -300) {
            turn.overDriveGauge = -300;
        }
        if (turn.overDriveGauge > 300) {
            turn.overDriveGauge = 300;
        }
    }
    // 敵のデバフ消費
    debuffConsumption(turn);
}

const unitSort = (turn) => {
    turn.unitList.sort((a, b) => a.placeNo - b.placeNo);
}

export const getTurnNumber = (turn) => {
    const defalt_turn = "ターン" + turn.turn_number;
    // 追加ターン
    if (turn.additionalTurn) {
        return `${defalt_turn} 追加ターン`;
    }
    // オーバードライブ中
    if (turn.overDriveNumber > 0) {
        return `${defalt_turn} OverDrive${turn.overDriveNumber}/${turn.overDriveMaxTurn}`;
    }
    return defalt_turn;
}

export const addOverDrive = (add_od_gauge, turn) => {
    turn.overDriveGauge += add_od_gauge;
    if (turn.overDriveGauge > 300) {
        turn.overDriveGauge = 300;
    }
}

export const startOverDrive = (turn) => {
    let over_drive_level = Math.floor(turn.overDriveGauge / 100)
    turn.overDriveNumber = 1;
    turn.overDriveMaxTurn = over_drive_level;
    turn.overDriveGauge = 0;
    turn.addOverDriveGauge = 0;

    let sp_list = [0, 5, 12, 20];
    unitLoop(function (unit) {
        unit.overDriveSp = sp_list[over_drive_level];
        unit.sp_cost = getSpCost(turn, getSkillData(unit.selectSkillId), unit);
    }, turn.unitList);
    abilityAction(ABILIRY_TIMING.OD_START, turn);
    turn.triggerOverDrive = true;
}

export const removeOverDrive = (turn) => {
    turn.overDriveNumber = 0;
    turn.overDriveMaxTurn = 0;
    turn.overDriveGauge = turn.startOverDriveGauge;
    turn.addOverDriveGauge = 0;

    unitLoop(function (unit) {
        unit.overDriveSp = 0;
        unit.sp_cost = getSpCost(turn, getSkillData(unit.selectSkillId), unit);
    }, turn.unitList);
    turn.triggerOverDrive = false;
}

const debuffConsumption = (turn) => {
    for (let i = turn.enemyDebuffList.length - 1; i >= 0; i--) {
        let debuff = turn.enemyDebuffList[i];
        if (debuff.rest_turn === 1) {
            turn.enemyDebuffList.splice(i, 1);
        } else {
            debuff.rest_turn -= 1;
        }
    }
}

export const abilityAction = (action_kbn, turn) => {
    unitOrderLoop(function (unit) {
        abilityActionUnit(turn, action_kbn, unit)
    }, turn.unitList);
}

/** TurnDataここまで */

/** UnitDataここから */
const unitTurnInit = (additionalTurn, unit) => {
    unit.buffEffectSelectType = 0;
    if (!additionalTurn || unit.additionalTurn) {
        setInitSkill(unit);
    } else {
        unit.selectSkillId = SKILL.NONE;
    }
}

const unitTurnProceed = (unit, turn) => {
    buffSort(unit);
    if (unit.nextTurnMinSp > 0) {
        if (unit.nextTurnMinSp > unit.sp) {
            unit.sp = unit.nextTurnMinSp;
            unit.nextTurnMinSp = -1
        }
    }
    if (unit.sp < unit.limitSp) {
        unit.sp += 2;
        if (unit.placeNo < 3) {
            unit.sp += turn.frontSpAdd;
        } else {
            unit.sp += turn.backSpAdd;
        }
        if ((turn.turn_number + 1) % turn.stepTurnSp === 0) {
            unit.sp += turn.stepSpAllAdd;
            if (unit.placeNo < 3) {
                unit.sp += turn.stepSpFrontAdd;
            } else {
                unit.sp += turn.stepSpBackAdd;
            }
        }
        if (checkBuffExist(unit.buffList, BUFF.FIRE_MARK)) {
            // 火の印6人
            if (targetCountInclude(turn, ELEMENT.FIEE) >= 5) {
                unit.sp += 1;
            }
        }
        if (unit.sp > unit.limitSp) {
            unit.sp = unit.limitSp
        }
    }
}

// 対象数判定
function targetCountInclude(turnData, targetElement) {
    let count = 0;
    unitLoop(function (unit) {
        if (unit.style.styleInfo.element === targetElement || unit.style.styleInfo.element2 === targetElement) {
            count++;
        }
    }, turnData.unitList);
    return count;
}

export const setInitSkill = (unit) => {
    if (unit.placeNo < 3) {
        unit.selectSkillId = unit.initSkillId;
        unit.sp_cost = 0;
    } else {
        if (checkAbilityExist(unit[`ability_${ABILIRY_TIMING.OTHER}`], 1530)) {
            // 湯めぐり
            unit.selectSkillId = SKILL.AUTO_PURSUIT;
        } else {
            unit.selectSkillId = SKILL.NONE;
        }
        unit.sp_cost = 0;
    }
    unit.buffEffectSelectType = null;
    unit.buffTargetCharaId = null;
}

const unitOverDriveTurnProceed = (unit) => {
    buffSort(unit);
    // OverDriveゲージをSPに加算
    unit.sp += unit.overDriveSp;
    if (unit.sp > 99) unit.sp = 99;
    unit.overDriveSp = 0;
}

const buffConsumption = (turnProgress, unit) => {
    for (let i = unit.buffList.length - 1; i >= 0; i--) {
        let buffInfo = unit.buffList[i];
        if (!turnProgress) {
            // 単独発動と行動不能
            if (isAloneActivation(buffInfo) || buffInfo.buff_kind === BUFF.RECOIL) {
                if (buffInfo.rest_turn === 1) {
                    unit.buffList.splice(i, 1);
                } else {
                    buffInfo.rest_turn -= 1;
                }
            }
        } else {
            // 全バフターン消費
            if (buffInfo.rest_turn === 1) {
                unit.buffList.splice(i, 1);
            } else {
                buffInfo.rest_turn -= 1;
            }
        }
    }
}

const buffSort = (unit) => {
    unit.buffList.sort((a, b) => {
        if (a.buff_kind === b.buff_kind) {
            return a.effect_size - b.effect_size;
        }
        return a.buff_kind - b.buff_kind;
    });
}

const payCost = (unit) => {
    // OD上限突破
    if (unit.sp + unit.overDriveSp > 99) {
        unit.sp = 99 - unit.overDriveSp;
    }
    if (unit.selectSkillId === 591) {
        // ノヴァエリミネーション
        unit.ep -= unit.sp_cost;
    } else {
        unit.sp -= unit.sp_cost;
    }
    unit.sp_cost = 0;
}

const getearringEffectSize = (hit_count, unit) => {
    // ドライブ
    if (unit.earringEffectSize !== 0) {
        hit_count = hit_count < 1 ? 1 : hit_count;
        hit_count = hit_count > 10 ? 10 : hit_count;
        return (unit.earringEffectSize - ((unit.earringEffectSize - 5) / 9 * (10 - hit_count)));
    }
    return 0;
}

const getFunnelList = (unit) => {
    let ret = [];
    let buff_funnel_list = unit.buffList.filter(function (buffInfo) {
        return BUFF.FUNNEL === buffInfo.buff_kind && !isAloneActivation(buffInfo);
    });
    let buff_unit_funnel_list = unit.buffList.filter(function (buffInfo) {
        return BUFF.FUNNEL === buffInfo.buff_kind && isAloneActivation(buffInfo);
    });
    let ability_list = unit.buffList.filter(function (buffInfo) {
        return BUFF.ABILITY_FUNNEL === buffInfo.buff_kind;
    });

    // effect_sumで降順にソート
    buff_funnel_list.sort(function (a, b) {
        return b.effect_sum - a.effect_sum;
    });
    buff_unit_funnel_list.sort(function (a, b) {
        return b.effect_sum - a.effect_sum;
    });
    ability_list.sort(function (a, b) {
        return b.effect_sum - a.effect_sum;
    });
    // 単独発動の効果値判定
    let buff_total = buff_funnel_list.slice(0, 2).reduce(function (sum, element) {
        return sum + element["effect_sum"];
    }, 0);
    let buff_unit_total = buff_unit_funnel_list.slice(0, 1).reduce(function (sum, element) {
        return sum + element["effect_sum"];
    }, 0);
    if (buff_total <= buff_unit_total) {
        ret = buff_unit_funnel_list.slice(0, 1)
    } else {
        ret = buff_funnel_list.slice(0, 2)
        buff_funnel_list = buff_funnel_list.slice(2);
    }
    // アビリティを追加
    if (ability_list.length > 0) {
        ret.push(ability_list[0]);
    }

    // 新しいリストを作成
    let result_list = [];

    // 各要素のeffect_count分effect_unitを追加
    ret.forEach(function (item) {
        for (let i = 0; i < item.max_power; i++) {
            result_list.push(item.effect_size);
        }
        item.use_funnel = true;
    });
    // 使用後にリストから削除
    unit.buffList = unit.buffList.filter(function (item) {
        return !item.use_funnel || isAloneActivation(item) || ALONE_ACTIVATION_ABILITY_LIST.includes(item.ability_id);
    })
    return result_list;
}

const abilityActionUnit = (turn_data, action_kbn, unit) => {
    let action_list = [];
    action_list = unit[`ability_${action_kbn}`];
    // 被ダメージ時
    if (action_kbn === ABILIRY_TIMING.RECEIVE_DAMAGE) {
        // 前衛のみ
        if (unit.placeNo >= 3) {
            action_list = [];
        }
    }
    action_list.forEach((ability, index) => {
        // 前衛
        if (ability.activation_place === 1 && unit.placeNo >= 3) {
            return true;
        }
        // 後衛
        if (ability.activation_place === 2 && unit.placeNo < 3) {
            return true;
        }
        let targetList = getTargetList(turn_data, ability.range_area, ability.target_element, unit.placeNo, null);
        let buff;
        switch (ability.conditions) {
            case "火属性フィールド":
                if (turn_data.field !== FIELD.FIRE) {
                    return;
                }
                break;
            case "歌姫の加護":
                if (!checkBuffExist(unit.buffList, BUFF.DIVA_BLESS)) {
                    return;
                };
                break;
            case "チャージ状態":
                if (!checkBuffExist(unit.buffList, BUFF.CHARGE)) {
                    return;
                };
                break;
            case "SP0以下":
                if (unit.sp > 0) {
                    return;
                }
                break;
            case "OD100%未満":
                if (turn_data.overDriveGauge >= 100) {
                    return;
                }
                break;
            case "OD0%未満":
                if (turn_data.overDriveGauge >= 0) {
                    return;
                }
                break;
            case "山脇様のしもべ6人":
                for (let i = 0; i < 6; i++) {
                    let unit = turn_data.unitList[i];
                    if (unit.blank) return;
                    if (!checkBuffExist(unit.buffList, BUFF.YAMAWAKI_SERVANT)) {
                        return;
                    }
                }
                break;
            case "破壊率が200%以上":
            case "トークン4つ以上":
            case "敵のバフ解除":
            case "ブレイク中":
                return;
            default:
                break;
        }
        switch (ability.effect_type) {
            case EFFECT.FUNNEL: // 連撃数アップ
                buff = {};
                buff.ability_id = ability.ability_id;
                buff.buff_kind = BUFF.ABILITY_FUNNEL;
                buff.buff_name = ability.ability_name;
                buff.buff_element = 0;
                buff.max_power = ability.effect_count;
                buff.effect_size = ability.effect_size;
                buff.effect_sum = ability.effect_size * ability.effect_count;
                buff.rest_turn = -1;
                unit.buffList.push(buff);
                break;
            case EFFECT.OVERDRIVE_SP: // ODSPアップ
                targetList.forEach(function (target_no) {
                    let unit_data = getUnitData(turn_data, target_no);
                    unit_data.overDriveSp += ability.effect_size;
                });
                break;
            case EFFECT.HEALSP: // SP回復
                if (ability.used && ability.ability_id === 1528) {
                    // 戦場の華
                    return;
                }
                ability.used = true;
                targetList.forEach(function (target_no) {
                    let unit_data = getUnitData(turn_data, target_no);
                    if (unit_data.sp + unit_data.overDriveSp < unit_data.limitSp) {
                        if (ability.ability_id) {
                            switch (ability.ability_id) {
                                case 1109: // 吉報
                                case 1119: // 旺盛
                                    unit_data.addSp += ability.effect_size;
                                    break;
                                case 1112: // 好機
                                    if (unit_data.sp <= 3) {
                                        unit_data.sp += ability.effect_size;
                                    }
                                    break;
                                case 1118: // 充填
                                    // チャージ存在チェック
                                    if (checkBuffExist(unit_data.buffList, BUFF.CHARGE)) {
                                        unit_data.sp += ability.effect_size;
                                    }
                                    break;
                                case 1111: // みなぎる士気
                                    let exist_list = unit_data.buffList.filter(function (buffInfo) {
                                        return buffInfo.buff_kind === BUFF.MORALE;
                                    });
                                    if (exist_list.length > 0) {
                                        if (exist_list[0].lv >= 6) {
                                            unit_data.sp += ability.effect_size;
                                        }
                                    }
                                    break;
                                case 1204: // エンゲージリンク
                                    // 永遠なる誓いチェック
                                    if (checkBuffExist(unit_data.buffList, BUFF.ETERNAL_OARH)) {
                                        unit_data.sp += ability.effect_size;
                                    }
                                    break;
                                case 1140: // 世界を滅ぼすお手伝いでゲス！
                                    // 山脇様のしもべチェック
                                    if (checkBuffExist(unit_data.buffList, BUFF.YAMAWAKI_SERVANT)) {
                                        unit_data.sp += ability.effect_size;
                                    };
                                    break;
                                default:
                                    unit_data.sp += ability.effect_size;
                                    break;
                            }
                        }
                        if (ability.skill_id) {
                            switch (ability.skill_id) {
                                case 524: // 痛気持ちいぃ～！
                                    unit_data.addSp += ability.effect_size;
                                    break;
                                default:
                                    unit_data.sp += ability.effect_size;
                                    break;
                            }
                        }
                        if (unit_data.sp + unit_data.overDriveSp > unit_data.limitSp) {
                            unit_data.sp = unit_data.limitSp - unit_data.overDriveSp;
                        }
                    }
                });
                break;
            case EFFECT.HEALEP: // EP回復
                unit.ep += ability.effect_size;
                if (unit.ep > 10) {
                    unit.ep = 10
                }
                break;
            case EFFECT.MORALE: // 士気
                targetList.forEach(function (target_no) {
                    let unit_data = getUnitData(turn_data, target_no);
                    if (!unit_data.style) {
                        return true;
                    }

                    let exist_list = unit_data.buffList.filter(function (buffInfo) {
                        return buffInfo.buff_kind === BUFF.MORALE;
                    });
                    let buff;
                    if (exist_list.length > 0) {
                        buff = exist_list[0];
                    } else {
                        buff = {};
                        buff.buff_kind = BUFF.MORALE;
                        buff.buff_element = 0;
                        buff.rest_turn = -1;
                        buff.lv = 0;
                        buff.buff_name = ability.ability_name;
                        unit_data.buffList.push(buff);
                    }
                    if (buff.lv < 10) {
                        buff.lv += ability.effect_size;
                    }
                });
                break;
            case EFFECT.OVERDRIVEPOINTUP: // ODアップ
                // V字回復,世界征服の始まりでゲス！
                const onlyUseList = [1207, 1209]
                if (ability.used && onlyUseList.includes(ability.ability_id)) {
                    return;
                }
                ability.used = true;
                turn_data.overDriveGauge += ability.effect_size;
                if (turn_data.overDriveGauge > 300) {
                    turn_data.overDriveGauge = 300;
                }
                break;
            case EFFECT.ARROWCHERRYBLOSSOMS: // 桜花の矢
                addAbilityBuffUnit(BUFF.ARROWCHERRYBLOSSOMS, ability.ability_name, -1, targetList, turn_data)
                break;
            case EFFECT.CHARGE: // チャージ
                addAbilityBuffUnit(BUFF.CHARGE, ability.ability_name, -1, targetList, turn_data)
                break;
            case EFFECT.YAMAWAKI_SERVANT: // 山脇様のしもべ
                addAbilityBuffUnit(BUFF.YAMAWAKI_SERVANT, ability.ability_name, -1, targetList, turn_data)
                break;
            case EFFECT.NEGATIVE: // ネガティブ
                addAbilityBuffUnit(BUFF.NAGATIVE, ability.ability_name, ability.effect_count + 1, targetList, turn_data)
                break;
            case EFFECT.MAKEUP: // メイクアップ
                addAbilityBuffUnit(BUFF.MAKEUP, ability.ability_name, -1, targetList, turn_data)
                break;
            case EFFECT.HIGH_BOOST: // ハイブースト
                addAbilityBuffUnit(BUFF.HIGH_BOOST, ability.passive_name, ability.effect_count + 1, targetList, turn_data)
                targetList.forEach(function (target_no) {
                    let unit = getUnitData(turn_data, target_no);
                    unit.limitSp = 30;
                })
                break;
            case EFFECT.FIRE_MARK: // 火の印
                addAbilityBuffUnit(BUFF.FIRE_MARK, ability.passive_name, -1, targetList, turn_data)
                break;
            case EFFECT.FIELD_DEPLOYMENT: // フィールド
                if (ability.element) {
                    turn_data.field = ability.element;
                } else if (ability.skill_id === 525) {
                    // いつの日かここで
                    turn_data.field = FIELD.RICE;
                }
                break;
            case EFFECT.ADDITIONALTURN: // 追加ターン
                if (turn_data.additionalCount === 0) {
                    unit.additionalTurn = true;
                    turn_data.additionalTurn = true;
                }
                break;
            default:
                break;
        }
    });
}

function addAbilityBuffUnit(buff_kind, ability_name, rest_turn, targetList, turn_data) {
    targetList.forEach(function (target_no) {
        let unit = getUnitData(turn_data, target_no);
        let buff = {};
        buff.buff_kind = buff_kind;
        buff.buff_element = 0;
        buff.rest_turn = rest_turn;
        buff.buff_name = ability_name;
        unit.buffList.push(buff);
    })
}
/** UnitDataここまで */
