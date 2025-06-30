const HardLayer = ({ state, dispatch }) => {

    const enemyInfo = state.enemy_info;
    if (enemyInfo === undefined || enemyInfo.enemy_class != ENEMY_CLASS_HARD_LAYER) {
        return null;
    }

    //  サブメンバー呼び出し
    const changeSubTroops = (sub_troops) => {
        loadSubTroopsList(sub_troops);
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
                <label className="mt-3">他部隊選択</label>
                <select className="mt-3" id="sub_troops" onChange={(e) => changeSubTroops(e.target.value)}>
                    <option value="-1">なし</option>
                    <option value="0">部隊0</option>
                    <option value="1">部隊1</option>
                    <option value="2">部隊2</option>
                    <option value="3">部隊3</option>
                    <option value="4">部隊4</option>
                    <option value="5">部隊5</option>
                    <option value="6">部隊6</option>
                    <option value="7">部隊7</option>
                    <option value="8">部隊8</option>
                </select>
                {Array.from({ length: 6 }, (_, i) => (
                    <div id={`sub_chara_container_${i}`} key={`chara_${i}`}>
                        <img className="sub_style" data-chara_no={i} id={`sub_chara_${i}`} src="img/cross.png" />
                    </div>
                ))}
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
