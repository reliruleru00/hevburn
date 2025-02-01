const BattleAreaComponent = () => {
    const [key, setKey] = React.useState(0);

    const [updatedTurnIndexList, setUpdatedTurnIndexList] = React.useState([]);

    const [hideMode, setHideMode] = React.useState(false);

    window.startBattle = () => {
        setKey(key + 1);
    }
    window.updateTurnList = (last_turn) => {
        setUpdatedTurnIndexList(last_turn)
    };

    const clickDownload = () => {
        const element = document.getElementById("battle_display");
        domtoimage.toPng(element)
            .then(dataUrl => {
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = "capture.png";
                link.click();
            })
            .catch(error => console.error("Error capturing image", error));
    }

    const changeHideMode = (e) => {
        const hideMode = e.target.checked;
        if (hideMode) {
            $("#setting_area").addClass("hidden");
        } else {
            $("#setting_area").removeClass("hidden");
        }
        setHideMode(hideMode);
    }

    const clickSave = () => {
        let save_data = {
            unit_data_list: convertUnitDataList(),
            user_operation_list: user_operation_list,
        }
        let compress = compressString(JSON.stringify(save_data));
        localStorage.setItem('test_save', compress);
    }

    const clickLoad = () => {
        let jsonstr = localStorage.getItem('test_save');
        let save_data = []
        if (jsonstr) {
            let decompress = decompressString(jsonstr)
            save_data = JSON.parse(decompress);
            // 戦闘データ初期化
            cleanBattleData();
            user_operation_list = save_data.user_operation_list;
            // 初期データ作成
            let turn_init = getInitBattleData();
            // 最終ターンの情報
            const last_turn_operation = user_operation_list[user_operation_list.length - 1];
            // ターンデータ再生成
            recreateTurnData(turn_init, last_turn_operation)
        }
    }

    // メンバー情報からユニットデータに変換
    function convertUnitDataList() {
        return select_style_list.map((style, index) => {
            if (style) {
                return {
                    style_id: style.style_info.style_id,
                    limit_count: style.limit_count,
                    earring: style.earring,
                    bracelet: style.bracelet,
                    chain: style.chain,
                    init_sp: style.init_sp,
                    exclusion_skill_list: style.exclusion_skill_list,
                }
            }
        })
    }

    let display_class = hideMode ? "hide_mode" : "show_mode";
    if (turn_list.length != 0) {
        return (
            <div className={display_class}>
                <div className="flex justify-between">
                    <div className="flex mode_button">
                        <input type="checkbox" className="switch" id="mode_switch" onChange={(e) => changeHideMode(e)} /><label htmlFor="mode_switch">設定画面を隠す</label>
                    </div>
                    <div>
                        <input type="button" id="btnSave" value="保存" onClick={clickSave} />
                        <input type="button" id="btnload" value="読み込み" onClick={clickLoad} />
                        <input type="button" id="btnDownload" value="画像として保存" onClick={clickDownload} />
                    </div>
                </div>
                <div id="battle_display" className="text-left">
                    {turn_list.map((turn, index) => {
                        return <TurnDataComponent turn={turn} index={index} key={`turn${index}-${key}`} is_last_turn={seq_last_turn == index} hideMode={hideMode} />
                    })}
                </div>
            </div>
        )
    }
};

$(function () {
    const rootElement = document.getElementById('battle_area');
    ReactDOM.createRoot(rootElement).render(<BattleAreaComponent />);
});