const statusKbn = ["", "str", "dex", "con", "mnd", "int", "luk"];
const defaultSelectStyleList = Array(6).fill(undefined);
const StyleListContext = React.createContext({
    selectTroops: 0,
    styleList: defaultSelectStyleList,
    loadMember: () => { },
    setMember: () => { },
    removeMember: () => { },
    setStyle: () => { },
});

const initialMember = {
    styleInfo: undefined,
    chara_no: -1,
    str: 400,
    dex: 400,
    con: 400,
    mnd: 400,
    int: 400,
    luk: 400,
    jewelLv: 5,
    limitCount: 2,
    earring: 0,
    bracelet: 1,
    chain: 3,
    initSp: 1,
    exclusionSkillList: [],
};

// ステータスを保存
const saveStyle = (memberInfo) => {
    if (memberInfo === undefined) {
        return
    }
    if (navigator.cookieEnabled) {
        let styleId = memberInfo.styleInfo.style_id;
        let saveItem = [memberInfo.styleInfo.rarity,
        memberInfo.str, memberInfo.dex,
        memberInfo.con, memberInfo.mnd,
        memberInfo.int, memberInfo.luk,
        memberInfo.limitCount, memberInfo.jewelLv,
        memberInfo.earring, memberInfo.bracelet,
        memberInfo.chain, memberInfo.initSp].join(",");
        localStorage.setItem(`style_${styleId}`, saveItem);
        saveExclusionSkill(memberInfo);
    }
}

// ステータスを読み込む
const loadStyle = (memberInfo, styleInfo) => {
    let styleId = memberInfo.styleInfo.style_id;
    let saveItem = localStorage.getItem("style_" + styleId);
    if (saveItem) {
        let items = saveItem.split(",");
        statusKbn.forEach((value, index) => {
            if (index == 0) return true;
            memberInfo[value] = Number(items[index]);
        });
        memberInfo.limitCount = Number(items[7]);
        memberInfo.jewelLv = Number(items[8]);
        if (items.length > 9) {
            memberInfo.earring = Number(items[9]);
            memberInfo.bracelet = Number(items[10]);
            memberInfo.chain = Number(items[11]);
            memberInfo.initSp = Number(items[12]);
        }
    }
    if (styleInfo.rarity == 2) {
        memberInfo.limitCount = 10;
    } else if (styleInfo.rarity == 3) {
        memberInfo.limitCount = 20;
    }
}

// 除外スキルを保存
const saveExclusionSkill = (memberInfo) => {
    let styleId = memberInfo.styleInfo.style_id;
    localStorage.setItem(`exclusion_${styleId}`, memberInfo.exclusionSkillList.join(","));
}

// 除外スキルを読み込む
const loadExclusionSkill = (memberInfo) => {
    let styleId = memberInfo.styleInfo.style_id;
    let exclusionSkillList = localStorage.getItem(`exclusion_${styleId}`);
    if (exclusionSkillList) {
        memberInfo.exclusionSkillList = exclusionSkillList.split(",").map(Number);
    } else {
        memberInfo.exclusionSkillList = [];
    }
}

// 部隊リストの呼び出し
const loadTroopsList = (troopsNo) => {
    let selectStyleList = Array(6).fill(undefined);
    for (let i = 0; i < 6; i++) {
        const styleId = localStorage.getItem(`troops_${troopsNo}_${i}`);
        if (!isNaN(styleId) && Number(styleId) !== 0) {
            setStyleMember(selectStyleList, troopsNo, i, Number(styleId));
        }
    }
    return selectStyleList;
}

// メンバーを設定する。
const setStyleMember = (selectStyleList, selectTroops, index, styleId) => {
    let styleInfo = style_list.find((obj) => obj.style_id === styleId);

    // 同一のキャラIDは不許可
    for (let i = 0; i < selectStyleList.length; i++) {
        if (i !== index && selectStyleList[i]?.styleInfo.chara_id === styleInfo?.chara_id) {
            // メンバーを入れ替える
            selectStyleList[i] = selectStyleList[index];
            localStorage.setItem(`troops_${selectTroops}_${i}`, selectStyleList[i] ? selectStyleList[i].styleInfo.style_id : null);
        }
    }

    // メンバー情報作成
    let memberInfo = { ...initialMember };
    memberInfo.styleInfo = styleInfo;

    // ステータスを読み込む
    loadStyle(memberInfo, styleInfo);
    loadExclusionSkill(memberInfo);
    selectStyleList[index] = memberInfo;
}

// メンバーを削除する。
const removeStyleMember = (selectStyleList, index) => {
    selectStyleList[index] = undefined;
}

// Providerコンポーネントを作成
const StyleListProvider = ({ selectStyleList, selectTroops, children }) => {
    const [styleList, setStyleList] = React.useState({
        selectTroops: selectTroops,
        selectStyleList, selectStyleList
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

    return (
        <StyleListContext.Provider value={{ styleList, setStyleList, loadMember, setMember, removeMember, saveMember, setStyle }}>
            {children}
        </StyleListContext.Provider>
    );
};
const useStyleList = () => React.useContext(StyleListContext);

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

// ターンデータ再生成
const recreateTurnData = (turnList, turnData, userOperationList, isLoadMode) => {
    // ユーザ操作リストのチェック
    userOperationList.forEach((item) => {
        item.used = compereUserOperation(item, turnData) <= 0;
    })

    while (compereUserOperation(turnData.user_operation, userOperationList[userOperationList.length - 1]) < 0) {
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

const SpOdSimulation = () => {
    // モーダル
    ReactModal.setAppElement("#root");

    const [selectTroops, setSelectTroops] = React.useState(() => {
        // スタイルリスト読み込み
        let selectTroops = localStorage.getItem('select_troops');
        return  selectTroops ? selectTroops : 0;
    });
    let styleList = loadTroopsList(selectTroops);

    return (
        <StyleListProvider selectStyleList={styleList} selectTroops={selectTroops}>
            <div className="frame w-screen pt-3 overflow-y-scroll border-b">
                <SettingArea />
            </div>
        </StyleListProvider>
    );
}

$(function () {
    const rootElement = document.getElementById('root');
    ReactDOM.createRoot(rootElement).render(<SpOdSimulation />);
});