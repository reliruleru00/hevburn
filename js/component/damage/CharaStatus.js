const { DragDropContext, Droppable, Draggable } = window["ReactBeautifulDnd"];

const CharaStatus = ({ attackInfo, selectTroops, setSelectTroops }) => {
    const { styleList, setStyleList, loadMember, removeMember } = useStyleList();

    // 設定変更
    const setSetting = (place_no, item, value) => {
        const updatedStyleList = [...styleList.selectStyleList];
        updatedStyleList[place_no] = {
            ...updatedStyleList[place_no],
            [item]: Number(value)
        };
        setStyleList({ ...styleList, selectStyleList: updatedStyleList });
    }

    // リセットボタン押下
    const resetStyle = () => {
        styleList.selectStyleList.forEach((style, index) => {
            localStorage.removeItem(`troops_${styleList.selectTroops}_${index}`);
        })
        setStyleList({ ...styleList, selectStyleList: Array(6).fill(undefined) });
    }

    // 部隊変更
    const changeTroops = (e) => {
        if (e.target.value == styleList.selectTroops) {
            return;
        }
        const updatedStyleList = [...styleList.selectStyleList];
        updatedStyleList.forEach((style, index) => {
            removeMember(index);
        })
        let selectTroops = e.target.value;
        localStorage.setItem('select_troops', selectTroops);
        loadMember(selectTroops);
        setSelectTroops(selectTroops);
    }

    // メンバー入れ替え
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const updatedStyleList = [...styleList.selectStyleList];
        const [removed] = updatedStyleList.splice(result.source.index, 1);
        updatedStyleList.splice(result.destination.index, 0, removed);

        updatedStyleList.forEach((style, index) => {
            let style_id = null;
            if (style) {
                style_id = style.style_info.style_id;
            }
            localStorage.setItem(`troops_${select_troops}_${index}`, style_id);
        })

        setStyleList({ ...styleList, selectStyleList: updatedStyleList });
    };

    const [modalSetting, setModalSetting] = React.useState({
        isOpen: false,
        modalIndex: -1,
        modalType: null,
    });
    const openModal = (index, type) => setModalSetting({ isOpen: true, modalIndex: index, modalType: type, });
    const closeModal = () => setModalSetting({ isOpen: false });

    const [narrowStyle, setNarrowStyle] = React.useState({
        physical: null,
        element: null,
        role: null,
        rarity: 1,
        target: "none",
        buff_1: -1,
        buff_2: -1,
        buff_3: -1,
    });

    // 移行時暫定対応
    select_style_list = styleList.selectStyleList;
    let list = [];
    if (attackInfo) {
        for (let i = 1; i <= 3; i++) {
            if (status_kbn[attackInfo["ref_status_" + i]]) {
                list.push(status_kbn[attackInfo["ref_status_" + i]] + attackInfo.chara_id);
            }
        }
    }
    ref_status_list["status_attack"] = list;
    return (
        <>
            <div id="chara_status" className="grid grid-cols-7 text-center gap-y-px gap-x-0">
                <label className="mt-3 mb-3 small_font">部隊選択</label>
                <div className="col-span-6 flex">
                    {Array.from({ length: 9 }, (_, i) => {
                        let className = "troops_btn " + (i === Number(selectTroops) ? "selected_troops" : "")
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
                                    {styleList.selectStyleList.map((style, index) => {
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
                                                        <StyleIcon style={style} place_no={index} onClick={() => { openModal(index, "style") }} />
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
                    <label className="label_status">トークン</label>
                    <label className="label_status">消費SP</label>
                </div>
                {styleList.selectStyleList.map((value, index) => {
                    let style = value;
                    let chara_id = style ? style.style_info.chara_id : 0;
                    let rarity = style ? style.style_info.rarity : 0;
                    let str = style ? style.str : 400;
                    let dex = style ? style.dex : 400;
                    let con = style ? style.con : 400;
                    let mnd = style ? style.mnd : 400;
                    let int = style ? style.int : 400;
                    let luk = style ? style.luk : 400;
                    let limit = style ? style.limit_count : 2;
                    let jewel = style ? style.jewel_lv : 0;
                    let token = style ? style.token ? style.token : 0 : 0;
                    let results = [];
                    Object.keys(ref_status_list).forEach(key => {
                        if (ref_status_list[key].length == 0) {
                            return null;
                        }
                        ref_status_list[key].forEach(status => {
                            if (status.includes(chara_id)) {
                                results.push(status.replace(chara_id, ""));
                            }
                        });
                    })
                    let strClassName = "status " + (results.includes("str") ? "status_active" : "");
                    let dexClassName = "status " + (results.includes("dex") ? "status_active" : "");
                    let conClassName = "status " + (results.includes("con") ? "status_active" : "");
                    let mndClassName = "status " + (results.includes("mnd") ? "status_active" : "");
                    let intClassName = "status " + (results.includes("int") ? "status_active" : "");
                    let lukClassName = "status " + (results.includes("luk") ? "status_active" : "");
                    let sp_cost = chara_sp_list[chara_id] ? chara_sp_list[chara_id] : 0;
                    return (
                        <div key={`chara_no${index}`} >
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
                            <input className={strClassName} value={str} id={`str_${chara_id}`} type="number" onChange={(e) => { setSetting(index, "str", e.target.value) }} />
                            <input className={dexClassName} value={dex} id={`dex_${chara_id}`} type="number" onChange={(e) => { setSetting(index, "dex", e.target.value) }} />
                            <input className={conClassName} value={con} id={`con_${chara_id}`} type="number" onChange={(e) => { setSetting(index, "con", e.target.value) }} />
                            <input className={mndClassName} value={mnd} id={`mnd_${chara_id}`} type="number" onChange={(e) => { setSetting(index, "mnd", e.target.value) }} />
                            <input className={intClassName} value={int} id={`int_${chara_id}`} type="number" onChange={(e) => { setSetting(index, "int", e.target.value) }} />
                            <input className={lukClassName} value={luk} id={`luk_${chara_id}`} type="number" onChange={(e) => { setSetting(index, "luk", e.target.value) }} />
                            <select className="jewel" value={jewel} onChange={(e) => { setSetting(index, "jewel_lv", e.target.value) }}>
                                {Array.from({ length: 6 }, (_, i) => (
                                    <option value={i} key={`jewel_${i}`}>{i}</option>
                                ))}
                            </select>
                            <select className="token" value={token} onChange={(e) => { setSetting(index, "token", e.target.value) }} id={`token_${chara_id}`}>
                                {Array.from({ length: 11 }, (_, i) => (
                                    <option value={i} key={`token_${i}`}>{i}</option>
                                ))}
                            </select>
                            <label id={`sp_cost_${index}`}>{sp_cost}</label>
                        </div>
                    )
                })}
                <div>
                    <ReactModal
                        isOpen={modalSetting.isOpen}
                        onRequestClose={closeModal}
                        className={"modal-content modal-narrwow " + (modalSetting.isOpen ? "modal-content-open" : "")}
                        overlayClassName={"modal-overlay " + (modalSetting.isOpen ? "modal-overlay-open" : "")}
                    >
                        {
                            modalSetting.modalType == "skill" ?
                                <ModalSkillSelectList index={modalSetting.modalIndex} closeModal={closeModal} />
                                :
                                <ModalStyleSelection index={modalSetting.modalIndex} closeModal={closeModal} narrowStyle={narrowStyle} setNarrowStyle={setNarrowStyle} />
                        }
                    </ReactModal>
                </div>
            </div>
        </>
    )
};
