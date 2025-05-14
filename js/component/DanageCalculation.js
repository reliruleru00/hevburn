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
    passive_skill_list: [],
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
        saveExclusionSkill(member_info);
    }
}

// ステータスを読み込む
const loadStyle = (member_info, style_info) => {
    let style_id = member_info.style_info.style_id;
    let save_item = localStorage.getItem("style_" + style_id);
    if (save_item) {
        let items = save_item.split(",");
        $.each(statusKbn, function (index, value) {
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

const DanageCalculation = () => {
    // モーダル
    ReactModal.setAppElement("#root");

    const [selectTroops, setSelectTroops] = React.useState(() => {
        // スタイルリスト読み込み
        let selectTroops = localStorage.getItem('select_troops');
        return selectTroops ? selectTroops : 0;
    });
    let styleList = loadTroopsList(selectTroops);

    const [attackInfo, setAttackInfo] = React.useState(undefined);

    return (
        <StyleListProvider selectStyleList={styleList} selectTroops={selectTroops}>
            <CharaStatus attackInfo={attackInfo} />
            <AttackList setAttackInfo={setAttackInfo} />
            <ContentsArea attackInfo={attackInfo} />
        </StyleListProvider>
    );
}

$(function () {
    const rootElement = document.getElementById('status_area');
    ReactDOM.createRoot(rootElement).render(<DanageCalculation />);
});