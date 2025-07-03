const HardLayer = ({ state, dispatch }) => {

    const enemyInfo = state.enemy_info;
    const { styleList, loadSubMember } = useStyleList();

    // サブメンバー呼び出し
    const changeSubTroops = (subTroops) => {
        loadSubMember(subTroops);
    }

    // 夢の泪変更
    const handleTearsOfDreamsChange = (e) => {
        dispatch({ type: "SET_TEARS_OF_DREAMS", value: e.target.value });
    }

    // スカルフェザー防御ダウン変更
    const handleSkullFeatherDefenseDownChange = (e) => {
        dispatch({ type: "SET_SKULL_FEATHER_DEFFENSE_DOWN", value: e.target.value });
    }

    const ENEMY_CLASS_SKULL_FEATHER = [12, 13]

    return (
        <div className="hard_layer adjust_width">
            <div className="flex ml-0 mt-2">
                <div className="mt-3">他部隊選択</div>
                <select className="mt-3" value={styleList.subTroops} onChange={(e) => changeSubTroops(e.target.value)}>
                    <option value="-1">なし</option>
                    {Array.from({ length: 9 }, (_, i) => i)
                        .filter(i => String(i) !== String(styleList.selectTroops)) // 不一致のみ表示
                        .map(i => (
                            <option key={i} value={i}>部隊{i}</option>
                        ))
                    }
                </select>
                {styleList.subStyleList.map((member, index) =>
                    <div key={`chara_${index}`}>
                        {member ?
                            <img className="sub_style" src={`icon/${member?.style_info.image_url}`} />
                            :
                            <img className="sub_style" src="img/cross.png" />
                        }
                    </div>
                )}
            </div>
            <div>
                <div className="flex ml-6 leading-6">夢の泪
                    <select className="ml-2 w-12 text-center h-6" value={state.hard.tearsOfDreams} type="number" onChange={handleTearsOfDreamsChange}>
                        {Array.from({ length: 6 }, (_, i) => (
                            <option value={i} key={`tear_${i}`}>{i}</option>
                        ))}
                    </select>
                    {ENEMY_CLASS_SKULL_FEATHER.includes(enemyInfo.enemy_class_no) ?
                        <div className="ml-2">
                            防御力アップ×
                            <input type="number" className="text-center h-6" max="20" min="0"
                                value={state.hard.skullFeatherDeffense} onChange={handleSkullFeatherDefenseDownChange}
                            />
                        </div>
                        : null}
                </div>
            </div>
        </div>
    )
};
