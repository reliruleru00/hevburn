import React, { useState, useReducer } from "react";
import { useStyleList } from "../StyleListProvider";
import enemyList from "../../data/enemyList";
import CharaStatus from "./CharaStatus";
import DamageResult from "./DamageResult";

const setEnemy = (state, action) => {
    const enemy = action.enemyInfo;
    return {
        ...state,
        enemyInfo: enemy,
        hpRate: 100,
        dpRate: Array(enemy.max_dp.split(",").length).fill(0),
        damageRate: enemy.destruction_limit,
        maxDamageRate: enemy.destruction_limit,
        strongBreak: false,
        correction: Object.fromEntries(Object.keys(state.correction).map(k => [k, 0])),
        resistDown: [0, 0, 0, 0, 0, 0],
    };
};

const setDp = (state, action) => {
    const { index, value } = action;
    const newDpRate = state.dpRate.map((_, i) => {
        if (i > index) return 0;
        if (i === index) return value;
        return 100;
    });
    return {
        ...state,
        dpRate: newDpRate,
        hpRate: value > 0 ? 100 : state.hpRate,
        damageRate: 100,
    };
};

const setCollect = (state, action) => {
    const updated = { ...state.correction };
    let newMaxDamageRate = state.maxDamageRate;
    for (let i = 1; i <= 5; i++) {
        const kind = action.grade[`effect_kind${i}`];
        if (kind) {
            const size = action.grade[`effect_size${i}`];
            updated[kind] = action.checked ? size : 0;
            if (kind === "destruction_limit") {
                newMaxDamageRate = state.enemyInfo.destruction_limit + updated.destruction_limit + (state.strongBreak ? 300 : 0);
            }
        }
    }
    let newDamageRate = newMaxDamageRate < state.damageRate ? newMaxDamageRate : state.damageRate;
    return {
        ...state,
        correction: updated,
        maxDamageRate: newMaxDamageRate,
        damageRate: newDamageRate,
        score: { ...state.score, totalGradeRate: action.totalGradeRate }
    };
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_ENEMY": return setEnemy(state, action);
        case "SET_HP": return { ...state, hpRate: action.value };
        case "SET_DP": return setDp(state, action);
        case "RESET_DP": return { ...state, dpRate: Array(state.enemyInfo.max_dp.split(",").length).fill(0), };
        case "SET_DAMAGE_RATE": {
            let value = Number(action.value);
            return {
                ...state,
                damageRate: Math.min(value, state.maxDamageRate),
                dpRate: value > 100 ? Array(state.enemyInfo.max_dp.split(",").length).fill(0) : state.dpRate,
            };
        }
        case "STRONG_BREAK": {
            const base = Number(state.enemyInfo.destruction_limit || 0);
            const correction = Number(state.correction.destruction_limit || 0);
            const bonus = action.checked ? 300 : 0;
            const limit = base + correction + bonus;
            return {
                ...state,
                strongBreak: action.checked,
                maxDamageRate: limit,
                damageRate: limit,
                dpRate: Array(state.enemyInfo.max_dp.split(",").length).fill(0),
            };
        }
        case "SET_SCORE_LV":
            return { ...state, score: { ...state.score, lv: action.lv } };

        case "SET_SCORE_TURN":
            return { ...state, score: { ...state.score, turnCount: action.turn } };

        case "SET_SCORE_HALF":
            return { ...state, score: { ...state.score, half: action.half } };

        case "RESET_COLLECT":
            return {
                ...state,
                correction: Object.fromEntries(Object.keys(state.correction).map(k => [k, 0])),
                score: { ...state.score, totalGradeRate: 0, half: action.half },
            };

        case "SET_COLLECT": {
            return setCollect(state, action)
        }

        case "SET_TEARS_OF_DREAMS":
            return {
                ...state,
                hard: { ...state.hard, tearsOfDreams: action.value }
            };

        case "SET_SKULL_FEATHER_DEFFENSE_DOWN":
            return {
                ...state,
                hard: { ...state.hard, skullFeatherDeffense: action.value }
            };

        case "SET_RRGIST_DOWN": {
            const newResist = [0, 0, 0, 0, 0, 0];
            newResist[action.element] = Number(action.value);
            return {
                ...state,
                resistDown: newResist,
            };
        }

        default: return state;
    }
};

const DamageCalculation = () => {
    const { styleList } = useStyleList();
    const [attackInfo, setAttackInfo] = useState(undefined);
    const [selectSKillLv, setSelectSKillLv] = useState(undefined);
    const [buffSettingMap, setBuffSettingMap] = useState({});

    // 敵選択
    const [enemyClass, setEnemyClass] = useState(() => {
        let enemyClass = localStorage.getItem("enemy_class");
        return enemyClass ? Number(enemyClass) : 1;
    });
    const [enemySelect, setEnemySelect] = useState(() => {
        let enemySelect = localStorage.getItem("enemy_select");
        return enemySelect ? Number(enemySelect) : 1;
    });
    const filteredEnemy = enemyList.filter((obj) =>
        obj.enemy_class === enemyClass && obj.enemy_class_no === enemySelect);

    let initEnemyInfo = filteredEnemy.length > 0 ? filteredEnemy[0] : undefined;
    if (!initEnemyInfo) {
        // データ消えたりしてたら初期値に戻す
        enemyClass = "1";
        enemySelect = "1";
        initEnemyInfo = enemyList[0];
    }

    const initialState = {
        enemyInfo: initEnemyInfo,
        hpRate: 100,
        dpRate: Array(initEnemyInfo.max_dp.split(",").length).fill(0),
        damageRate: initEnemyInfo.destruction_limit,
        maxDamageRate: initEnemyInfo.destruction_limit,
        strongBreak: false,
        score: {
            lv: 150,
            turnCount: 1,
            totalGradeRate: 0,
            half: 1,
        },
        correction: {
            physical_1: 0,
            physical_2: 0,
            physical_3: 0,
            element_0: 0,
            element_1: 0,
            element_2: 0,
            element_3: 0,
            element_4: 0,
            element_5: 0,
            hp_rate: 0,
            dp_rate: 0,
            destruction_limit: 0,
            destruction_resist: 0,
        },
        hard: {
            tearsOfDreams: 0,
            skullFeatherDeffense: 0,
        },
        resistDown: [0, 0, 0, 0, 0, 0],
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    const [selectBuffKeyMap, setSelectBuffKeyMap] = useState({});
    const [abilitySettingMap, setAbilitySettingMap] = useState([]);
    const [passiveSettingMap, setPassiveSettingMap] = useState([]);

    const [otherSetting, setOtherSetting] = useState({
        ring: "0",
        earring: "0",
        chain: "0",
        overdrive: false,
    });

    // let damageResult = getDamageResult(attackInfo, styleList, state, selectSKillLv,
    //     selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap, otherSetting);

    return (
        <>
            <div className="pt-3 display_area mx-auto">
                <div className="status_area mx-auto">
                    <CharaStatus attackInfo={attackInfo} selectBuffKeyMap={selectBuffKeyMap} />
                    {/* <AttackList attackInfo={attackInfo} setAttackInfo={setAttackInfo}
                        selectSKillLv={selectSKillLv} setSelectSKillLv={setSelectSKillLv}
                        abilitySettingMap={abilitySettingMap} passiveSettingMap={passiveSettingMap} state={state} dispatch={dispatch} />
                    <ContentsArea attackInfo={attackInfo} enemyInfo={state.enemyInfo} enemyClass={enemyClass}
                        enemySelect={enemySelect} setEnemyClass={setEnemyClass} setEnemySelect={setEnemySelect}
                        state={state} dispatch={dispatch} />
                    <OtherSetting attackInfo={attackInfo} otherSetting={otherSetting} setOtherSetting={setOtherSetting} />
                    {enemyClass == ENEMY_CLASS.SCORE_ATTACK && damageResult ?
                        <PredictionScore damageResult={damageResult} state={state} />
                        : null
                    } */}
                </div>
                {/* <BuffArea attackInfo={attackInfo} state={state} dispatch={dispatch}
                    selectBuffKeyMap={selectBuffKeyMap} setSelectBuffKeyMap={setSelectBuffKeyMap}
                    buffSettingMap={buffSettingMap} setBuffSettingMap={setBuffSettingMap}
                    abilitySettingMap={abilitySettingMap} setAbilitySettingMap={setAbilitySettingMap}
                    passiveSettingMap={passiveSettingMap} setPassiveSettingMap={setPassiveSettingMap} /> */}
            </div>
            {/* <DamageResult damageResult={damageResult} enemyInfo={state.enemyInfo} dispatch={dispatch} /> */}
            <DamageResult enemyInfo={state.enemyInfo} dispatch={dispatch} />
        </>
    );
}

export default DamageCalculation;