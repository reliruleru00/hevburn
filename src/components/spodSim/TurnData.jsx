import React, { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import { RANGE, CONDITIONS, ATTRIBUTE } from "utils/const";
import { KB_NEXT, ABILIRY_TIMING } from "./const";
import { getBuffList, getSkillData, getStyleData, getAbilityInfo, deepClone } from "utils/common";
import { FIELD_LIST } from "./const";
import skillList from "data/skillList";
import UnitComponent from "./UnitComponent";
import ModalTargetSelection from "./ModalTargetSelection";
import ModalEffectSelection from "./ModalEffectSelection";
import BuffDetailListComponent from "./ModalBuffDetailLlist";
import BuffIconComponent from "./BuffIconComponent";
import OverDriveGauge from "./OverDriveGauge";
import {
    getOverDrive, startOverDrive, removeOverDrive, skillUpdate, getUnitData, getTurnNumber,
    startAction, setInitSkill
} from "./logic";
import enemyIcon from 'assets/img/BtnEventBattleActive.webp';

const TurnData = React.memo(({ turn, index, isLastTurn, hideMode, isCapturing, handlers }) => {
    const isNextInfluence = useRef(false);
    // const [turnData, setTurnData] = useState({
    //     userOperation: turn.userOperation
    // });

    // 再描画
    const reRender = (userOperation, render) => {
        isNextInfluence.current = render;
        // OD再計算
        turn.addOverDriveGauge = getOverDrive(turn);
        turn.userOperation = userOperation;
        handlers.updateTurn(index, turn);
        // setTurnData({ ...turnData, userOperation: userOperation });
    }

    // 敵の数変更
    const chengeEnemyCount = (e) => {
        let userOperation = { ...turn.userOperation };
        userOperation.enemy_count = Number(e.target.value);
        turn.enemy_count = Number(e.target.value);
        reRender(userOperation, true);
    }

    // フィールド変更
    const chengeField = (e) => {
        let userOperation = { ...turn.userOperation };
        userOperation.field = Number(e.target.value);
        turn.field = Number(e.target.value);
        reRender(userOperation, true);
    }

    // 行動選択変更
    const chengeAction = (e) => {
        let userOperation = { ...turn.userOperation };
        userOperation.kb_action = Number(e.target.value);
        reRender(userOperation, true);
    }

    // スキル変更
    const chengeSkill = (skillId, placeNo) => {
        let userOperation = { ...turn.userOperation };
        let selectSkill = userOperation.select_skill[placeNo];
        selectSkill.skill_id = skillId;
        skillUpdate(turn, skillId, placeNo);
        const unit = turn.unitList.filter(unit => unit.placeNo === placeNo)[0];

        const buffList = getBuffList(skillId);
        const SELECT_RANGE = [RANGE.ALLY_UNIT, RANGE.SELF_AND_UNIT, RANGE.OTHER_UNIT];
        if (buffList.some(buff => SELECT_RANGE.includes(buff.range_area))) {
            openModal(placeNo, "target")
        } else {
            unit.buffTargetCharaId = null;
        }

        let effectType = 0;
        let skillInfo = getSkillData(skillId);
        const conditionsList = buffList.map(buff => buff.conditions).filter(condition => condition !== null);
        if (conditionsList.includes(CONDITIONS.DESTRUCTION_OVER_200) || skillInfo.attribute_conditions === CONDITIONS.DESTRUCTION_OVER_200) {
            effectType = 2;
        }
        if (conditionsList.includes(CONDITIONS.BREAK)) {
            effectType = 3;
        }
        if (conditionsList.includes(CONDITIONS.PERCENTAGE_30)) {
            effectType = 4;
        }
        if (conditionsList.includes(CONDITIONS.HAS_SHADOW) || skillInfo.attribute_conditions === CONDITIONS.HAS_SHADOW) {
            effectType = 5;
        }
        if (conditionsList.includes(CONDITIONS.DOWN_TURN) || skillInfo.attribute_conditions === CONDITIONS.DOWN_TURN) {
            effectType = 6;
        }
        if (conditionsList.includes(CONDITIONS.BUFF_DISPEL) || skillInfo.attribute_conditions === CONDITIONS.BUFF_DISPEL) {
            effectType = 7;
        }
        if (conditionsList.includes(CONDITIONS.DP_OVER_100) || skillInfo.attribute_conditions === CONDITIONS.DP_OVER_100) {
            effectType = 8;
        }

        switch (skillId) {
            case 50: // トリック・カノン
                effectType = 1;
                break;
            default:
                break;
        }

        if (effectType !== 0) {
            openModal(placeNo, "effect", effectType)
        } else {
            unit.buffEffectSelectType = null;
        }

        selectSkill.buffTargetCharaId = unit.buffTargetCharaId;
        selectSkill.buffEffectSelectType = unit.buffEffectSelectType;
        reRender(userOperation, true);
    }

    // OD発動/解除
    function triggerOverDrive(checked) {
        const userOperation = turn.userOperation;;
        if (checked) {
            startOverDrive(turn);
            userOperation.kb_action = KB_NEXT.ACTION;
        } else {
            removeOverDrive(turn);
        }
        userOperation.triggerOverDrive = checked;
        reRender(userOperation, true);
    }

    // ユニット選択/入れ替え
    const chengeSelectUnit = ((e, placeNo) => {
        if (e.target.tagName === 'SELECT' || e.target.classList.contains("style_change")) {
            e.stopPropagation();
            return;
        }
        let new_unit = getUnitData(turn, placeNo);
        if (new_unit.blank) {
            return;
        }
        // 追加ターンの制約
        if (turn.additionalTurn) {
            if (2 < placeNo) {
                return;
            }
            if (!new_unit.additionalTurn) {
                return;
            }
        }
        let userOperation = turn.userOperation;
        let old_placeNo = userOperation.selectedPlaceNo;
        let select_skill = userOperation.select_skill;
        let placeStyle = userOperation.placeStyle;
        let render = false;
        if (old_placeNo !== -1) {
            if (old_placeNo !== placeNo) {
                let old_unit = getUnitData(turn, old_placeNo)
                if (new_unit && old_unit) {
                    new_unit.placeNo = old_placeNo;
                    old_unit.placeNo = placeNo;
                }
                if (placeNo <= 2 && 3 <= old_placeNo) {
                    // 前衛と後衛の交換
                    exchangeUnit(new_unit, old_unit, select_skill);
                } else if (3 <= placeNo && old_placeNo <= 2) {
                    // 後衛と前衛の交換
                    exchangeUnit(old_unit, new_unit, select_skill);
                } else {
                    // 前衛同士/後衛同士
                    const tmp_skill = select_skill[placeNo];
                    select_skill[placeNo] = select_skill[old_placeNo]
                    select_skill[old_placeNo] = tmp_skill;
                }

                const tmp_style = placeStyle[placeNo];
                placeStyle[placeNo] = placeStyle[old_placeNo]
                placeStyle[old_placeNo] = tmp_style;
                render = true;
            }
            placeNo = -1;
        }
        userOperation.selectedPlaceNo = placeNo;
        reRender(userOperation, render);
    })

    // 前衛後衛ユニット交換
    const exchangeUnit = ((old_front, old_back, select_skill) => {
        setInitSkill(old_back);
        setInitSkill(old_front);
        select_skill[old_front.placeNo] = { skill_id: old_front.selectSkillId };
        select_skill[old_back.placeNo] = { skill_id: old_back.selectSkillId };
    })

    // 備考編集
    const chengeRemark = ((e) => {
        const userOperation = turn.userOperation;;
        userOperation.remark = e.target.value;
        reRender(userOperation, false);
    })

    // スタイル変更
    const chageStyle = (placeNo, styleId) => {
        let userOperation = { ...turn.userOperation };
        userOperation.placeStyle[placeNo] = styleId;
        let styleInfo = getStyleData(styleId);
        turn.unitList[placeNo].style.styleInfo = styleInfo;
        let unit = turn.unitList[placeNo]
        let member = unit.style;
        unit.skillList = skillList.filter(obj =>
            (obj.chara_id === member.styleInfo.chara_id || obj.chara_id === 0) &&
            (obj.style_id === member.styleInfo.style_id || obj.style_id === 0) &&
            obj.skill_active === 0 &&
            !member.exclusionSkillList.includes(obj.skill_id)
        ).map(obj => {
            const copiedObj = deepClone(obj);
            if (copiedObj.chara_id === 0) {
                copiedObj.chara_id = member.styleInfo.chara_id;
            }
            return copiedObj;
        });
        // アビリティ設定
        Object.values(ABILIRY_TIMING).forEach(timing => {
            unit[`ability_${timing}`] = [];
        });
        ["0", "00", "1", "3", "03", "4", "5", "10"].forEach(numStr => {
            const num = parseInt(numStr, 10);
            if (styleInfo[`ability${numStr}`] && num <= member.limitCount) {
                let abilityInfo = getAbilityInfo(styleInfo[`ability${numStr}`]);
                if (!abilityInfo) {
                    return;
                }
                unit[`ability_${abilityInfo.activation_timing}`].push(abilityInfo);
            }
        });
        reRender(userOperation, true);
    }

    // 次ターン
    function clickNextTurn() {
        turn.is_last_turn = false;
        let turn_data = deepClone(turn);
        turn_data.is_last_turn = true;
        startAction(turn_data);
        // ターン開始処理
        handlers.proceedTurn(turn_data, true);
    };

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (!isLastTurn && isNextInfluence.current) {
            handlers.recreateTurn(index);
        }
    }, [turn, index, isLastTurn]);
    /* eslint-enable react-hooks/exhaustive-deps */

    const [modalSetting, setModalSetting] = useState({
        isOpen: false,
        modalIndex: -1,
        modalType: null,
        effect_type: 0
    });

    const handleSelectTarget = (chara_id) => {
        const unit = turn.unitList.filter(unit => unit.placeNo === modalSetting.modalIndex)[0];
        unit.buffTargetCharaId = chara_id;
        turn.userOperation.select_skill[modalSetting.modalIndex].buffTargetCharaId = chara_id;
        reRender(turn.userOperation, true);
    };

    const handleSelectEffect = (effect_type) => {
        const unit = turn.unitList.filter(unit => unit.placeNo === modalSetting.modalIndex)[0];
        unit.buffEffectSelectType = effect_type;
        turn.userOperation.select_skill[modalSetting.modalIndex].buffEffectSelectType = effect_type;
        let skillInfo = getSkillData(unit.selectSkillId);

        const selectionConditions = [CONDITIONS.DESTRUCTION_OVER_200, CONDITIONS.HAS_SHADOW, CONDITIONS.DOWN_TURN, CONDITIONS.DP_OVER_100];
        if (selectionConditions.includes(skillInfo.attribute_conditions)) {
            if (unit.buffEffectSelectType === 1) {
                let sp_cost = skillInfo.sp_cost;
                if (skillInfo.skill_attribute === ATTRIBUTE.SP_HALF) {
                    sp_cost = Math.floor(sp_cost / 2);
                }
                if (skillInfo.skill_attribute === ATTRIBUTE.SP_ZERO) {
                    sp_cost = 0;
                }
                unit.sp_cost = sp_cost + unit.spCostUp - unit.spCostDown;
            }
        }
        reRender(turn.userOperation, true);
    };

    const clickBuffIcon = (buffList) => {
        openModal(0, "buff", buffList);
    };

    const openModal = (index, type, effect_type) => setModalSetting({ isOpen: true, modalIndex: index, modalType: type, effect_type: effect_type });
    const closeModal = () => setModalSetting({ isOpen: false });

    return (
        <div className="turn">
            <div className="turn_header_area">
                <div className="turn_header_top">
                    <div>
                        <div className="turn_number">{getTurnNumber(turn)}</div>
                        <div className="left flex">
                            <img className="enemy_icon" src={enemyIcon} alt="ENEMY" />
                            <div>
                                <select className="enemy_count" value={turn.enemy_count} onChange={(e) => chengeEnemyCount(e)}>
                                    {[1, 2, 3].filter(value => value === turn.enemy_count || !isCapturing)
                                        .map(enemy_count => <option value={enemy_count} key={`enemy_count${enemy_count}`}>{`${enemy_count}体`}</option>)}
                                </select>
                                <span className="ml-1">場</span>
                                <select className="enemy_count" value={turn.field} onChange={(e) => chengeField(e)}>
                                    {Object.keys(FIELD_LIST)
                                        .filter(value => Number(value) === turn.field || !isCapturing)
                                        .map(field => <option value={field} key={`field${field}`}>{FIELD_LIST[field]}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <OverDriveGauge turn={turn} />
                </div>
                <BuffIconComponent buffList={turn.enemyDebuffList} loopLimit={12} loopStep={1} placeNo={7} turnNumber={turn.turn_number} clickBuffIcon={clickBuffIcon} />
            </div>
            <div className="party_member">
                <div className="flex front_area">
                    {[0, 1, 2].map(placeNo =>
                        <UnitComponent turn={turn} key={`unit${placeNo}`} placeNo={placeNo} selectedPlaceNo={turn.userOperation.selectedPlaceNo}
                            chageStyle={chageStyle} chengeSkill={chengeSkill} chengeSelectUnit={chengeSelectUnit} clickBuffIcon={clickBuffIcon} hideMode={hideMode} isCapturing={isCapturing} />
                    )}
                </div>
                <div className="flex back_area">
                    {[3, 4, 5].map(placeNo =>
                        <UnitComponent turn={turn} key={`unit${placeNo}`} placeNo={placeNo} selectedPlaceNo={turn.userOperation.selectedPlaceNo}
                            chageStyle={chageStyle} chengeSkill={chengeSkill} chengeSelectUnit={chengeSelectUnit} clickBuffIcon={clickBuffIcon} hideMode={hideMode} isCapturing={isCapturing} />
                    )}
                    <div>
                        <select className="action_select" value={turn.userOperation.kb_action} onChange={(e) => chengeAction(e)}>
                            {turn.userOperation.kb_action === KB_NEXT.ACTION || !isCapturing ?
                                <option value={KB_NEXT.ACTION}>行動開始</option> : null}
                            {turn.userOperation.kb_action === KB_NEXT.ACTION_OD ||
                                (turn.overDriveGauge + turn.addOverDriveGauge >= 100 && turn.overDriveMaxTurn === 0) ?
                                <option value={KB_NEXT.ACTION_OD}>行動開始+OD</option> : null}
                        </select>
                        <div
                            className="flex"
                            style={{
                                justifyContent: "flex-end",
                            }}>
                            {turn.startOverDriveGauge >= 100 && !turn.additionalTurn && (turn.overDriveNumber === 0 || turn.triggerOverDrive) ?
                                <input type="checkbox" className="trigger_over_drive" checked={turn.triggerOverDrive} onChange={(e) => triggerOverDrive(e.target.checked)} />
                                : null}
                            {isLastTurn ?
                                <input className="turn_button next_turn" defaultValue="次ターン" type="button" onClick={clickNextTurn} />
                                :
                                <input className="turn_button return_turn" defaultValue="ここに戻す" type="button" onClick={() => handlers.returnTurn(turn.seqTurn)} />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="remark_area">
                <textarea className="remaek_text" onChange={(e) => chengeRemark(e)} value={turn.userOperation.remark} />
            </div>
            <div>
                <ReactModal
                    isOpen={modalSetting.isOpen}
                    onRequestClose={closeModal}
                    className={"modal-content " + (modalSetting.isOpen ? "modal-content-open" : "")}
                    overlayClassName={"modal-overlay " + (modalSetting.isOpen ? "modal-overlay-open" : "")}
                >
                    {
                        modalSetting.modalType === "target" ?
                            <ModalTargetSelection closeModal={closeModal} onSelect={handleSelectTarget} unitList={turn.unitList} />
                            : modalSetting.modalType === "effect" ?
                                <ModalEffectSelection closeModal={closeModal} onSelect={handleSelectEffect} effectType={modalSetting.effect_type} />
                                : modalSetting.modalType === "buff" ?
                                    <BuffDetailListComponent buffList={modalSetting.effect_type} />
                                    : null
                    }
                </ReactModal>
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
    // 再描画が必要ないなら true を返す
    return (
        prevProps.turn === nextProps.turn &&
        prevProps.isLastTurn === nextProps.isLastTurn &&
        prevProps.hideMode === nextProps.hideMode &&
        prevProps.isCapturing === nextProps.isCapturing
    );
});

export default TurnData