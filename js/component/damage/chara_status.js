const { DragDropContext, Droppable, Draggable } = window["ReactBeautifulDnd"];

const CharaStatus = () => {
    const [selectStyle, setSelectStyle] = React.useState([]);
    const [key, setKey] = React.useState(0);

    // ステータス保存
    const saveStatus = (chara_no, item, value) => {
        let status = Number(value);
        select_style_list[chara_no][item] = status;
        saveStyle(select_style_list[chara_no]);
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
        setKey(key + 1);
    }

    // メンバー追加
    window.updateMember = function () {
        setSelectStyle([...select_style_list]);
    }

    // メンバー入れ替え
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const [removed] = select_style_list.splice(result.source.index, 1);
        select_style_list.splice(result.destination.index, 0, removed);

        setSelectStyle([...select_style_list]);
    };

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
            <div className="mt-2">
                <label className="small_font">スタイル</label>
                <input defaultValue="リセット" id="style_reset_btn" type="button" onClick={resetStyle} />
            </div>
            <div className="col-span-6 flex">
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(provided) => (
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="col-span-6"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    listStyleType: 'none',
                                    padding: 0,
                                }}
                            >
                                {select_style_list.map((value, index) => {
                                    let id = `style_${index}`
                                    return (
                                        <Draggable key={id} draggableId={id} index={index}>
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        cursor: 'grab',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <StyleIcon place_no={index} />
                                                </li>
                                            )}
                                        </Draggable>)
                                })}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <div>
                <label className="label_status">限界突破</label>
                <label className="label_status">力</label>
                <label className="label_status">器用さ</label>
                <label className="label_status">体力</label>
                <label className="label_status">精神</label>
                <label className="label_status">知性</label>
                <label className="label_status">運</label>
                <label className="label_status">宝珠Lv</label>
                <label className="label_status">消費SP</label>
            </div>
            {select_style_list.map((value, index) => {
                let style = value;
                let rarity = style ? style.style_info.rarity : 0;
                let str = style ? style.str : 400;
                let dex = style ? style.dex : 400;
                let con = style ? style.con : 400;
                let mnd = style ? style.mnd : 400;
                let int = style ? style.int : 400;
                let luk = style ? style.luk : 400;
                let limit = style ? style.limit_count : 2;
                let jewel = style ? style.jewel_lv : 0;
                return (
                    <div key={`chara_no${index}`} >
                        <select className="limit" value={limit} onChange={(e) => { saveStatus(index, "limit_count", e.target.value) }}>
                            {rarity == 1 ?
                                Array.from({ length: 5 }, (_, i) => (
                                    <option value={i} key={`limit_${i}`}>{i}</option>
                                ))
                                : null
                            }
                            {rarity == 2 ? <option value="10">10</option> : null}
                            {rarity == 3 ? <option value="20">20</option> : null}
                        </select>
                        <input className="status" key={`str_${key}`} defaultValue={str} id={`str_${index}`} type="number" onChange={(e) => { saveStatus(index, "str", e.target.value) }}/>
                        <input className="status" key={`dex_${key}`} defaultValue={dex} id={`dex_${index}`} type="number" onChange={(e) => { saveStatus(index, "dex", e.target.value) }}/>
                        <input className="status" key={`con_${key}`} defaultValue={con} id={`con_${index}`} type="number" onChange={(e) => { saveStatus(index, "con", e.target.value) }}/>
                        <input className="status" key={`mnd_${key}`} defaultValue={mnd} id={`mnd_${index}`} type="number" onChange={(e) => { saveStatus(index, "mnd", e.target.value) }}/>
                        <input className="status" key={`int_${key}`} defaultValue={int} id={`int_${index}`} type="number" onChange={(e) => { saveStatus(index, "int", e.target.value) }}/>
                        <input className="status" key={`luk_${key}`} defaultValue={luk} id={`luk_${index}`} type="number" onChange={(e) => { saveStatus(index, "luk", e.target.value) }}/>
                        <select className="jewel" value={jewel} id={`jewel_${index}`} onChange={(e) => { saveStatus(index, "jewel_lv", e.target.value) }}>
                            {Array.from({length: 6 }, (_, i) => (
                                <option value={i} key={`jewel_${i}`}>{i}</option>
                            ))}
                        </select>
                        <label id={`sp_cost_${index}`}>0</label>
                    </div>
                )
            }
            )}
        </>
    )
};

$(function () {
    const rootElement = document.getElementById('chara_status');
    ReactDOM.createRoot(rootElement).render(<CharaStatus />);
});