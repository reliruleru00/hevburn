
import React, { useState } from "react";
import ReactModal from "react-modal";
import { ROLE } from "utils/const";
import { ABILIRY_TIMING, NOT_USE_STYLE, CONSTRAINTS_ABILITY } from "./const";
import { checkPassiveExist, recreateTurnData, initTurn, abilityAction, setUserOperation } from "./logic";
import { getCharaData, getStyleData, getEnemyInfo, getPassiveInfo, getAbilityInfo, deepClone } from "utils/common";
import { useStyleList } from "components/StyleListProvider";
import skillList from "data/skillList";
import CharaSetting from "./CharaSetting";
import EnemyArea from "./EnemyArea";
import DetailSetting from "./DetailSetting";
import ConstraintsList from "./ConstraintsList";
import ModalExplanation from "./ModalExplanation";
import BattleArea from "./BattleArea";

// リスト更新用のReducer
const reducer = (state, action) => {
    switch (action.type) {
        case "INIT_TURN_LIST":
            return {
                ...state,
                turn_list: action.turn_list
            };

        case "ADD_TURN_LIST":
            return {
                ...state,
                turn_list: [...state.turn_list, action.payload]
            };

        case "DEL_TURN_LIST": {
            return {
                ...state,
                turn_list: state.turn_list.slice(0, action.payload + 1),
            };
        }
        case "UPD_TURN_LIST": {
            // 最終ターンの情報
            const userOperationList = state.turn_list.map(turn => turn.user_operation);
            let turnData = state.turn_list[action.payload];
            let turnLsit = state.turn_list.slice(0, action.payload + 1)
            recreateTurnData(turnLsit, turnData, userOperationList, false);

            return {
                ...state,
                turn_list: turnLsit,
            };
        }
        default:
            return state;
    }
};

// 戦闘初期データ作成
function getInitBattleData(selectStyleList, saveMember, detailSetting) {
    // 初期データ作成
    let turnInit = {
        turn_number: 0,
        seq_turn: -1,
        over_drive_number: 0,
        end_drive_trigger_count: 0,
        over_drive_max_turn: 0,
        trigger_over_drive: false,
        additional_turn: false,
        additional_count: 0,
        enemy_debuff_list: [],
        unit_list: [],
        start_over_drive_gauge: 0,
        step_over_drive_gauge: 0,
        over_drive_gauge: 0,
        add_over_drive_gauge: 0,
        sp_cost_down: 0,
        enemy_count: 1,
        finish_action: false,
        field: 0,
        field_turn: 0,
        user_operation: {}
    }
    let unit_list = [];
    let constraints_list = [];

    let initSpAdd = Number(detailSetting.initSpAdd);
    // スタイル情報を作成
    selectStyleList.forEach((member, index) => {
        if (index >= 6) {
            return false;
        }
        let unit = {
            place_no: 99,
            sp: 1,
            ep: 0,
            over_drive_sp: 0,
            add_sp: 0,
            sp_cost: 0,
            buff_list: [],
            additional_turn: false,
            normalAttackElement: 0,
            earringEffectSize: 0,
            skillList: [],
            passiveSkillList: [],
            blank: false,
            useSkillList: [],
            buff_target_chara_id: null,
            buff_effect_select_type: 0,
            next_turn_min_sp: -1,
            select_skill_id: 0,
            init_skill_id: 0,
            no_action: false,
            limit_sp: 20,
            spCostUp: 0,
            spCostDown: 0,
        };
        unit.place_no = index;
        if (member) {
            saveMember(index);

            unit.style = member;
            unit.sp = member.initSp;
            unit.sp += member.chain + initSpAdd;
            unit.normalAttackElement = member.bracelet;
            unit.earringEffectSize = member.earring;
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
            unit.passiveSkillList = skillList.filter(obj =>
                (obj.chara_id === member.styleInfo.chara_id || obj.chara_id === 0) &&
                (obj.style_id === member.styleInfo.style_id || obj.style_id === 0) &&
                obj.skill_active === 1 &&
                !member.exclusionSkillList.includes(obj.skill_id)
            )
            if (unit.style.styleInfo.role === ROLE.ADMIRAL) {
                unit.init_skill_id = 4; // 指揮行動
            } else {
                unit.init_skill_id = 1; // 通常攻撃
            }
            // 曙
            if (checkPassiveExist(unit.passiveSkillList, 606)) {
                unit.normalAttackElement = 4;
            }
            // アビリティ設定
            Object.values(ABILIRY_TIMING).forEach(timing => {
                unit[`ability_${timing}`] = [];
            });
            ["0", "00", "1", "3", "4", "5", "10"].forEach(numStr => {
                const num = parseInt(numStr, 10);
                if (member.styleInfo[`ability${numStr}`] && num <= member.limitCount) {
                    let ability_info = getAbilityInfo(member.styleInfo[`ability${numStr}`]);
                    if (!ability_info) {
                        return;
                    }
                    if (CONSTRAINTS_ABILITY.includes(ability_info.ability_id)) {
                        constraints_list.push(ability_info.ability_id);
                    }
                    unit[`ability_${ability_info.activation_timing}`].push(ability_info);
                    if (ability_info.ability_id === 510) {
                        // 蒼天
                        turnInit.sp_cost_down = ability_info.effect_size;
                    }
                }
            });
            unit.passiveSkillList.forEach(skill => {
                let passive_info = getPassiveInfo(skill.skill_id);
                if (!passive_info) {
                    return;
                }
                unit[`ability_${passive_info.activation_timing}`].push(passive_info);
            });
        } else {
            unit.blank = true;
        }
        unit_list.push(unit);
    });

    // 初期設定を読み込み
    turnInit.field = Number(detailSetting.initField);
    if (turnInit.field > 0) {
        turnInit.field_turn = -1;
    }
    turnInit.over_drive_gauge = Number(detailSetting.initOverDrive);
    turnInit.front_sp_add = Number(detailSetting.frontSpAdd);
    turnInit.back_sp_add = Number(detailSetting.backSpAdd);
    turnInit.step_turn_over_drive = Number(detailSetting.stepTurnOverDrive);
    turnInit.step_over_drive_gauge = Number(detailSetting.stepOverDriveGauge);
    turnInit.step_turn_sp = Number(detailSetting.stepTurnSp);
    turnInit.step_sp_front_add = Number(detailSetting.stepSpFrontAdd);
    turnInit.step_sp_back_add = Number(detailSetting.stepSpBackAdd);
    turnInit.step_sp_all_add = Number(detailSetting.stepSpAllAdd);

    // turnInit.enemy_count = Number($("#enemy_select_count").val());;
    turnInit.unit_list = unit_list;
    turnInit.enemy_info = getEnemyInfo()
    // 戦闘開始アビリティ
    abilityAction(ABILIRY_TIMING.BATTLE_START, turnInit);
    setUserOperation(turnInit);

    return turnInit;
}

const SettingArea = () => {
    // 敵選択
    let enemy_class = localStorage.getItem("enemy_class");
    enemy_class = enemy_class ? enemy_class : "1";
    let enemy_select = localStorage.getItem("enemy_select");
    enemy_select = enemy_select ? enemy_select : "1";

    // 上書き確認
    let is_overwrite = localStorage.getItem("is_overwrite");
    is_overwrite = is_overwrite === "true" ? true : false;

    const changeOverwrite = (e) => {
        is_overwrite = e.target.checked;
        localStorage.setItem("is_overwrite", e.target.checked);
    }

    const { styleList, setStyleList, saveMember, removeMember } = useStyleList();

    const [hideMode, setHideMode] = React.useState(false);

    const [simProc, dispatch] = React.useReducer(reducer, {
        turn_list: [],
        seq_last_turn: 0,
        enemy_info: {}
    });

    // 戦闘開始前処理
    const startBattle = (update, setUpdate) => {
        for (let i = 0; i < styleList.selectStyleList.length; i++) {
            let style = styleList.selectStyleList[i]?.styleInfo;
            if (NOT_USE_STYLE.includes(style?.style_id)) {
                let chara_data = getCharaData(style.chara_id);
                alert(`[${style.style_name}]${chara_data.chara_name}は現在使用できません。`);
                return;
            }
        };
        // 後衛が居る場合、前衛に空き不可
        const hasBlankFront = styleList.selectStyleList.some(function (style, index) {
            return style === undefined && index <= 2
        });
        const hasBack = styleList.selectStyleList.some(function (style, index) {
            return style !== undefined && index >= 3
        });
        if (hasBlankFront && hasBack) {
            alert("後衛がいるとき 前衛には3名必要です");
            return;
        }

        if (is_overwrite) {
            // if (simProc.turn_list.length > 0 && !confirm("現在の結果が消えますが、よろしいですか？")) {
            //     return;
            // }
        }

        /** 戦闘開始処理 */
        // 初期データ作成
        let turnInit = getInitBattleData(styleList.selectStyleList, saveMember, detailSetting);
        // 制約事項更新
        setUpdate(update + 1);
        // 初期処理
        initTurn(turnInit, true);
        let turn_list = [turnInit];
        dispatch({ type: "INIT_TURN_LIST", turn_list: turn_list });
    };

    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const loadData = (saveData, key, setKey) => {
        // 部隊情報上書き
        const updatedStyleList = [...styleList.selectStyleList];
        saveData.unit_data_list.forEach((unit_data, index) => {

            if (unit_data) {
                // let member_info = { ...initialMember };
                let member_info = {};
                let styleInfo = getStyleData(unit_data.style_id);
                // メンバー情報作成
                member_info.styleInfo = styleInfo;
                member_info.limitCount = unit_data.limitCount || unit_data.limit_count;
                member_info.earring = unit_data.earring;
                member_info.bracelet = unit_data.bracelet;
                member_info.chain = unit_data.chain;
                member_info.initSp = unit_data.initSp || unit_data.init_sp;
                member_info.exclusionSkillList = unit_data.exclusionSkillList || unit_data.exclusion_skill_list;
                updatedStyleList[index] = member_info;
            } else {
                updatedStyleList[index] = undefined;
            }
        })
        setStyleList({ ...styleList, selectStyleList: updatedStyleList });
        // 初期データ作成
        let turnInit = getInitBattleData(updatedStyleList, saveMember, detailSetting);
        // 制約事項更新
        setKey(key + 1);
        let turn_list = [];
        recreateTurnData(turn_list, turnInit, saveData.user_operation_list, true);
        // 画面反映
        dispatch({ type: "INIT_TURN_LIST", turn_list: turn_list });
    }

    const [enemy, setEnemy] = React.useState({
        enemy_class: enemy_class,
        enemy_select: enemy_select
    });

    const [detailSetting, setDetailSetting] = React.useState({
        initField: 0,
        initOverDrive: 0,
        initSpAdd: 0,
        changeElement0: 0,
        changeElement1: 0,
        changeElement2: 0,
        changeElement3: 0,
        changeElement4: 0,
        changeElement5: 0,
        frontSpAdd: 0,
        backSpAdd: 0,
        stepTurnOverDrive: 1,
        stepOverDriveGauge: 0,
        stepTurnSp: 1,
        stepSpAllAdd: 0,
        stepSpFrontAdd: 0,
        stepSpBackAdd: 0,
    });

    const [update, setUpdate] = useState(0);
    const [constraints, setConstraints] = useState([]);

    return (
        <>
            {
                hideMode ?
                    null
                    :
                    <div className="setting_area">
                        <div className="unit_setting_area">
                            <input className="w-20" defaultValue="注意事項" role="button" type="button"
                                onClick={openModal} />
                            <CharaSetting />
                        </div>
                        <div>
                            <EnemyArea enemy={enemy} setEnemy={setEnemy} detailSetting={detailSetting} />
                            <DetailSetting detailSetting={detailSetting} setDetailSetting={setDetailSetting} />
                        </div>
                        <div className="flex justify-center mt-2 text-sm">
                            <input id="is_overwrite" type="checkbox" onChange={(e) => { changeOverwrite(e) }} defaultChecked={is_overwrite} />
                            <label className="checkbox01 text-sm" htmlFor="is_overwrite">
                                上書き確認
                            </label>
                            <input className="battle_start" defaultValue="戦闘開始" type="button" onClick={e => startBattle(update, setUpdate)} />
                        </div>
                        <div>
                            <ConstraintsList constraints={constraints} />
                        </div>
                        <div>
                            <ReactModal
                                isOpen={modalIsOpen}
                                onRequestClose={closeModal}
                                className={"modal-content modal-wide " + (modalIsOpen ? "modal-content-open" : "")}
                                overlayClassName={"modal-overlay " + (modalIsOpen ? "modal-overlay-open" : "")}
                            >
                                <ModalExplanation />
                            </ReactModal>
                        </div>
                    </div>
            }
            <BattleArea hideMode={hideMode} setHideMode={setHideMode} turnList={simProc.turn_list} dispatch={dispatch} loadData={loadData} update={update} setUpdate={setUpdate} />
        </>
    )
};

export default SettingArea;