
const CharaSetting = () => {
    const BRACELET_LIST = ["無し", "火撃", "氷撃", "雷撃", "光撃", "闇撃"];
    const EARRING_LIST = [10, 12, 15];

    const [selectStyle, setSelectStyle] = React.useState([]);

    // 設定変更
    const setSetting = (place_no, item, value) => {
        let style = select_style_list[place_no]
        style[item] = Number(value);
        setSelectStyle([...select_style_list]);
    }

    // リセットボタン押下
    const resetStyle = () => {
        styleReset(select_style_list, true);
        setSelectStyle([...select_style_list]);
    }

    // 部隊変更
    const changeTroops = (e) => {
        if (e.target.value == select_troops) {
            return;
        }
        styleReset(select_style_list, false);
        select_troops = e.target.value;
        localStorage.setItem('select_troops', select_troops);
        loadTroopsList(select_style_list, select_troops);
        setSelectStyle([...select_style_list]);
    }

    // メンバー追加
    window.loadMember = function () {
        setSelectStyle([...select_style_list]);
    }

    // メンバーを外す
    window.removeMember = function () {
        setSelectStyle([...select_style_list]);
    }

    return (
        <>
            <label className="mt-3 mb-3 small_font">部隊選択</label>
            <div className="col-span-6 flex">
                {Array.from({ length: 9 }, (_, i) => {
                    let className = "troops_btn " + (i === Number(select_troops) ? "selected_troops" : "")
                    return (
                        <input key={i}
                            className={className}
                            defaultValue={i}
                            onClick={(e) => changeTroops(e)}
                            type="button"
                        />
                    )
                })}
            </div>
            <div>
                <div className="h-[64px]">
                    <label className="small_font">スタイル</label>
                    <input defaultValue="リセット" id="style_reset_btn" type="button" onClick={resetStyle} />
                </div>
                <label className="label_status">限界突破</label>
                <label className="label_status text-xs leading-6 whitespace-nowrap">ドライブピアス</label>
                <label className="label_status text-xs leading-5 whitespace-nowrap">ブレスレット</label>
                <label className="label_status">チェーン</label>
                <label className="label_status">初期SP</label>
                <label className="label_status">パッシブ</label>
            </div>
            {select_style_list.map((value, index) => {
                let style = value;
                let rarity = 1;
                let bracelet = 0;
                let chain = 3;
                let earring = 0;
                let init_sp = 1;
                let limit = 0;
                if (style) {
                    rarity = style.style_info.rarity;
                    limit = style.limit_count;
                    earring = style.earring;
                    bracelet = style.bracelet;
                    chain = style.chain;
                    init_sp = style.init_sp;
                }
                return (
                    <div key={`chara_no${index}`} >
                        <StyleIcon place_no={index} />
                        <select className="limit" value={limit} onChange={(e) => { setSetting(index, "limit_count", e.target.value) }}>
                            {rarity == 1 ?
                                Array.from({ length: 5 }, (_, i) => (
                                    <option value={i} key={`limit_${i}`}>{i}</option>
                                ))
                                : null
                            }
                            {rarity == 2 ? <option value="10">10</option> : null}
                            {rarity == 3 ? <option value="20">20</option> : null}
                        </select>
                        <select className="earring" value={earring} onChange={(e) => { setSetting(index, "earring", e.target.value) }}>
                            <option value="0">無し</option>
                            {EARRING_LIST.map((value, index) => (
                                <option value={value} key={`earring_${index}`}>{value}%</option>
                            ))}
                        </select>
                        <select className="bracelet" value={bracelet} onChange={(e) => { setSetting(index, "bracelet", e.target.value) }}>
                            {BRACELET_LIST.map((value, index) => (
                                <option value={index} key={`bracelet_${index}`}>{value}</option>
                            ))}
                        </select>
                        <select className="chain" value={chain} onChange={(e) => { setSetting(index, "chain", e.target.value) }}>
                            {Array.from({ length: 4 }, (_, i) => (
                                <option value={i} key={`chain_${i}`}>SP+{i}</option>
                            ))}
                        </select>
                        <input className="init_sp" value={init_sp} type="number" onChange={(e) => { setSetting(index, "init_sp", e.target.value) }} />
                        <input className="passive" data-chara_no="0" defaultValue="設定" type="button" />
                    </div>
                )
            }
            )}
        </>
    )
};


$(function () {
    const rootElement = document.getElementById('chara_setting');
    ReactDOM.createRoot(rootElement).render(<CharaSetting />);
});