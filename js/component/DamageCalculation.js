const statusKbn = ["", "str", "dex", "con", "mnd", "int", "luk"];
const defaultSelectStyleList = Array(6).fill(undefined);
const StyleListContext = React.createContext({
    selectTroops: 0,
    styleList: defaultSelectStyleList,
    loadMember: () => { },
    setMember: () => { },
    removeMember: () => { },
    setStyle: () => { },
    setLastUpdatedIndex: () => { },
});

const initialMember = {
    style_info: null,
    is_select: false,
    chara_no: -1,
    str: 400,
    dex: 400,
    con: 400,
    mnd: 400,
    int: 400,
    luk: 400,
    jewel_lv: 5,
    limit_count: 2,
    earring: 0,
    bracelet: 1,
    chain: 3,
    init_sp: 1,
    exclusion_skill_list: [],
};

// ステータスを保存
const saveStyle = (member_info) => {
    if (member_info === undefined) {
        return
    }
    if (navigator.cookieEnabled) {
        let style_id = member_info.style_info.style_id;
        let save_item = [member_info.style_info.rarity,
        member_info.str, member_info.dex,
        member_info.con, member_info.mnd,
        member_info.int, member_info.luk,
        member_info.limit_count, member_info.jewel_lv,
        member_info.earring, member_info.bracelet,
        member_info.chain, member_info.init_sp].join(",");
        localStorage.setItem(`style_${style_id}`, save_item);
    }
}

// ステータスを読み込む
const loadStyle = (member_info, style_info) => {
    let style_id = member_info.style_info.style_id;
    let save_item = localStorage.getItem("style_" + style_id);
    if (save_item) {
        let items = save_item.split(",");
        statusKbn.forEach((value, index) => {
            if (index == 0) return true;
            member_info[value] = Number(items[index]);
        });
        member_info.limit_count = Number(items[7]);
        member_info.jewel_lv = Number(items[8]);
        if (items.length > 9) {
            member_info.earring = Number(items[9]);
            member_info.bracelet = Number(items[10]);
            member_info.chain = Number(items[11]);
            member_info.init_sp = Number(items[12]);
        }
    }
    if (style_info.rarity == 2) {
        member_info.limit_count = 10;
    } else if (style_info.rarity == 3) {
        member_info.limit_count = 20;
    }
}

// 部隊リストの呼び出し
const loadTroopsList = (troops_no) => {
    let styleList = Array(6).fill(undefined);
    for (let i = 0; i < 6; i++) {
        const style_id = localStorage.getItem(`troops_${troops_no}_${i}`);
        if (!isNaN(style_id) && Number(style_id) !== 0) {
            setStyleMember(styleList, troops_no, i, Number(style_id));
        }
    }
    return styleList;
}

// メンバーを設定する。
const setStyleMember = (selectStyleList, selectTroops, index, style_id) => {
    let style_info = style_list.find((obj) => obj.style_id === style_id);

    // 同一のキャラIDは不許可
    for (let i = 0; i < selectStyleList.length; i++) {
        if (i !== index && selectStyleList[i]?.style_info.chara_id === style_info?.chara_id) {
            // メンバーを入れ替える
            selectStyleList[i] = selectStyleList[index];
            localStorage.setItem(`troops_${selectTroops}_${i}`, selectStyleList[i] ? selectStyleList[i].style_info.style_id : null);
        }
    }

    // メンバー情報作成
    let member_info = { ...initialMember };
    member_info.is_select = true;
    member_info.chara_no = Number(index);
    member_info.style_info = style_info;

    // ステータスを読み込む
    loadStyle(member_info, style_info);
    selectStyleList[index] = member_info;
}

// メンバーを削除する。
const removeStyleMember = (selectStyleList, index) => {
    selectStyleList[index] = undefined;
}

// Providerコンポーネントを作成
const StyleListProvider = ({ selectStyleList, selectTroops, children }) => {
    const [styleList, setStyleList] = React.useState({
        selectStyleList,
        selectTroops,
    });

    const loadMember = (selectTroops) => {
        const updatedStyleList = loadTroopsList(selectTroops);
        setStyleList({ ...styleList, selectStyleList: updatedStyleList, selectTroops: selectTroops });
    }

    const setMember = (index, style_id) => {
        const updatedStyleList = [...styleList.selectStyleList];
        setStyleMember(updatedStyleList, styleList.selectTroops, index, style_id)
        setStyleList({ ...styleList, selectStyleList: updatedStyleList });
    };

    const removeMember = (index) => {
        const updatedStyleList = [...styleList.selectStyleList];
        removeStyleMember(updatedStyleList, index)
        setStyleList({ ...styleList, selectStyleList: updatedStyleList });
    };

    const saveMember = (index) => {
        saveStyle(styleList.selectStyleList[index]);
    };

    const setStyle = (style, index) => {
        const updatedStyleList = [...styleList.selectStyleList];
        updatedStyleList[index] = style;
        setStyleList({ ...styleList, selectStyleList: updatedStyleList });
    }

    // 編集したステータスの保存
    const [lastUpdatedIndex, setLastUpdatedIndex] = React.useState(null);
    React.useEffect(() => {
        if (lastUpdatedIndex !== null) {
            saveStyle(styleList.selectStyleList[lastUpdatedIndex]);
            setLastUpdatedIndex(null);
        }
    }, [styleList, lastUpdatedIndex]);

    return (
        <StyleListContext.Provider value={{ styleList, setStyleList, loadMember, setMember, removeMember, saveMember, setStyle, setLastUpdatedIndex }}>
            {children}
        </StyleListContext.Provider>
    );
};
const useStyleList = () => React.useContext(StyleListContext);

const setEnemy = (state, action) => {
    const enemy = action.enemy_info;
    return {
        ...state,
        enemy_info: enemy,
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
                newMaxDamageRate = state.enemy_info.destruction_limit + updated.destruction_limit + (state.strongBreak ? 300 : 0);
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
        case "RESET_DP": return { ...state, dpRate: Array(state.enemy_info.max_dp.split(",").length).fill(0), };
        case "SET_DAMAGE_RATE": {
            let value = Number(action.value);
            return {
                ...state,
                damageRate: Math.min(value, state.maxDamageRate),
                dpRate: value > 100 ? Array(state.enemy_info.max_dp.split(",").length).fill(0) : state.dpRate,
            };
        }
        case "STRONG_BREAK": {
            const base = Number(state.enemy_info.destruction_limit || 0);
            const correction = Number(state.correction.destruction_limit || 0);
            const bonus = action.checked ? 300 : 0;
            const limit = base + correction + bonus;
            return {
                ...state,
                strongBreak: action.checked,
                maxDamageRate: limit,
                damageRate: limit,
                dpRate: Array(state.enemy_info.max_dp.split(",").length).fill(0),
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

const DamageCalculation = ({ selectTroops, setSelectTroops }) => {
    const { styleList } = useStyleList();
    const [attackInfo, setAttackInfo] = React.useState(undefined);
    const [selectSKillLv, setSelectSKillLv] = React.useState(undefined);
    const [buffSettingMap, setBuffSettingMap] = React.useState({});

    // 敵選択
    const [enemyClass, setEnemyClass] = React.useState(() => {
        let enemy_class = localStorage.getItem("enemy_class");
        return enemy_class ? enemy_class : "1";
    });
    const [enemySelect, setEnemySelect] = React.useState(() => {
        let enemy_select = localStorage.getItem("enemy_select");
        return enemy_select ? enemy_select : "1";
    });
    const filteredEnemy = enemy_list.filter((obj) => obj.enemy_class == enemyClass && obj.enemy_class_no == enemySelect);
    let initEnemyInfo = filteredEnemy.length > 0 ? filteredEnemy[0] : undefined;
    if (!initEnemyInfo) {
        // データ消えたりしてたら初期値に戻す
        enemyClass = "1";
        enemySelect = "1";
        initEnemyInfo = enemy_list[0];
    }

    const initialState = {
        enemy_info: initEnemyInfo,
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
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const [selectBuffKeyMap, setSelectBuffKeyMap] = React.useState({});
    const [abilitySettingMap, setAbilitySettingMap] = React.useState([]);
    const [passiveSettingMap, setPassiveSettingMap] = React.useState([]);

    const [otherSetting, setOtherSetting] = React.useState({
        ring: "0",
        earring: "0",
        chain: "0",
        overdrive: false,
    });

    let damageResult = getDamageResult(attackInfo, styleList, state, selectSKillLv,
        selectBuffKeyMap, buffSettingMap, abilitySettingMap, passiveSettingMap, otherSetting);

    return (
        <>
            <div className="display_area mx-auto">
                <div className="status_area mx-auto">
                    <CharaStatus attackInfo={attackInfo} selectTroops={selectTroops} setSelectTroops={setSelectTroops} selectBuffKeyMap={selectBuffKeyMap} />
                    <AttackList attackInfo={attackInfo} setAttackInfo={setAttackInfo} selectSKillLv={selectSKillLv} setSelectSKillLv={setSelectSKillLv} />
                    <ContentsArea attackInfo={attackInfo} enemyInfo={state.enemy_info} enemyClass={enemyClass}
                        enemySelect={enemySelect} setEnemyClass={setEnemyClass} setEnemySelect={setEnemySelect}
                        state={state} dispatch={dispatch} />
                    <OtherSetting attackInfo={attackInfo} otherSetting={otherSetting} setOtherSetting={setOtherSetting} />
                    {enemyClass == ENEMY_CLASS.SCORE_ATTACK && damageResult ?
                        <PredictionScore damageResult={damageResult} state={state} />
                        : null
                    }
                </div>
                <BuffArea attackInfo={attackInfo} state={state} dispatch={dispatch}
                    selectBuffKeyMap={selectBuffKeyMap} setSelectBuffKeyMap={setSelectBuffKeyMap}
                    buffSettingMap={buffSettingMap} setBuffSettingMap={setBuffSettingMap}
                    abilitySettingMap={abilitySettingMap} setAbilitySettingMap={setAbilitySettingMap}
                    passiveSettingMap={passiveSettingMap} setPassiveSettingMap={setPassiveSettingMap} />
            </div>
            <DamageResult damageResult={damageResult} enemyInfo={state.enemy_info} dispatch={dispatch} />
        </>
    );
}
const RootComponent = () => {
    // モーダル
    ReactModal.setAppElement("#root");

    const [selectTroops, setSelectTroops] = React.useState(() => {
        let selectTroops = localStorage.getItem('select_troops');
        return selectTroops ? Number(selectTroops) : 0;
    });

    // 自由入力取得
    React.useEffect(() => {
        for (let i = 0; i < 10; i++) {
            let freeEnemy = localStorage.getItem("free_enemy_" + i);
            if (freeEnemy !== null) {
                updateEnemyStatus(i, JSON.parse(freeEnemy));
            }
        }
    })
    return (
        <StyleListProvider selectStyleList={loadTroopsList(selectTroops)} selectTroops={selectTroops}>
            <DamageCalculation selectTroops={selectTroops} setSelectTroops={setSelectTroops} />
        </StyleListProvider>
    );
}

$(function () {
    const rootElement = document.getElementById('status_area');
    ReactDOM.createRoot(rootElement).render(<RootComponent />);
});