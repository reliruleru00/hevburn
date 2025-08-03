import React, { useState } from "react";
import ReactModal from "react-modal";
import { useStyleList } from "components/StyleListProvider";
import ModalSkillSelectList from "components/ModalSkillSelectList";
import ModalStyleSelection from "components/ModalStyleSelection";
import StyleIcon from "components/StyleIcon";
import { getBuffIdToBuff, getSkillData } from "utils/common";
import { STATUS_KBN } from "utils/const";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import editIcon from 'assets/img/edit.png';

const CharaStatus = ({ attackInfo, selectBuffKeyMap }) => {
    const { styleList, setStyleList, loadTroops, removeMember, setLastUpdatedIndex } = useStyleList();

    // 設定変更
    const setSetting = (index, item, value) => {
        if (styleList.selectStyleList[index]) {
            const updatedStyleList = [...styleList.selectStyleList];
            updatedStyleList[index] = {
                ...updatedStyleList[index],
                [item]: Number(value)
            };
            setLastUpdatedIndex(index);
            setStyleList({ ...styleList, selectStyleList: updatedStyleList });
        }
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
        if (e.target.value === styleList.selectTroops) {
            return;
        }
        const updatedStyleList = [...styleList.selectStyleList];
        updatedStyleList.forEach((style, index) => {
            removeMember(index);
        })
        let selectTroops = e.target.value;
        localStorage.setItem('select_troops', selectTroops);
        loadTroops(selectTroops);
    }

    // 部隊名変更
    const editTroopsName = () => {
        let troopsName = localStorage.getItem(`troops_${styleList.selectTroops}_name`);
        if (troopsName === null) {
            troopsName = "部隊" + (styleList.selectTroops);
        }
        troopsName = window.prompt("保存名称を入力してください", troopsName);
        if (troopsName === null) {
            return;
        }
        localStorage.setItem(`troops_${styleList.selectTroops}_name`, troopsName);
        setStyleList({ ...styleList, troopsName: troopsName });
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
                style_id = style.styleInfo.style_id;
            }
            localStorage.setItem(`troops_${styleList.selectTroops}_${index}`, style_id);
        })

        setStyleList({ ...styleList, selectStyleList: updatedStyleList });
    };

    // スキルリストの表示    
    const showSkillList = (index) => {
        if (styleList.selectStyleList[index]) {
            openModal(index, "skill");
        }
    };

    const [modalSetting, setModalSetting] = useState({
        isOpen: false,
        modalIndex: -1,
        modalType: null,
    });
    const openModal = (index, type) => setModalSetting({ isOpen: true, modalIndex: index, modalType: type, });

    const closeModal = () => {
        if (modalSetting.modalType === "skill") {
            setLastUpdatedIndex(modalSetting.modalIndex);
        }
        setModalSetting({ isOpen: false });
    };

    const [narrowStyle, setNarrowStyle] = useState({
        physical: null,
        element: null,
        role: null,
        rarity: 1,
        target: "none",
        buff_1: -1,
        buff_2: -1,
        buff_3: -1,
    });

    return (
        <>
            <div id="chara_status" className="grid grid-cols-7 text-center gap-y-px gap-x-0">
                <span className="mt-3 mb-3 small_font">部隊選択</span>
                <div className="col-span-6 flex">
                    {Array.from({ length: 9 }, (_, i) => {
                        let className = "troops_btn " + (i === Number(styleList.selectTroops) ? "selected_troops" : "")
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
                <span className="mt-1 small_font">部隊名</span>
                <div className="col-span-6 flex justify-center">
                    <span className="text-base">{styleList.troopsName ? styleList.troopsName : `部隊${styleList.selectTroops}`}</span>
                    <input type="image" className="w-6 h-6" src={editIcon} onClick={editTroopsName} alt="編集" />
                </div>
                <div className="mt-2">
                    <span className="small_font">スタイル</span>
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
                    <span className="label_status">限界突破</span>
                    <span className="label_status">力</span>
                    <span className="label_status">器用さ</span>
                    <span className="label_status">体力</span>
                    <span className="label_status">精神</span>
                    <span className="label_status">知性</span>
                    <span className="label_status">運</span>
                    <span className="label_status">宝珠Lv</span>
                    <span className="label_status">トークン</span>
                    <span className="label_status">士気</span>
                    <span className="label_status">スキル</span>
                    <span className="label_status">消費SP</span>
                </div>
                {styleList.selectStyleList.map((value, index) => {
                    let style = value;
                    let charaId = style ? style.styleInfo.chara_id : 0;
                    let rarity = style ? style.styleInfo.rarity : 0;
                    let str = style ? style.str : 400;
                    let dex = style ? style.dex : 400;
                    let con = style ? style.con : 400;
                    let mnd = style ? style.mnd : 400;
                    let int = style ? style.int : 400;
                    let luk = style ? style.luk : 400;
                    let limit = style ? style.limitCount : 2;
                    let jewel = style ? style.jewelLv : 0;
                    let token = style ? style.token ? style.token : 0 : 0;
                    let morale = style ? style.morale ? style.morale : 0 : 0;
                    let results = [];
                    let spCost = {};
                    if (attackInfo && attackInfo.chara_id === charaId) {
                        for (let i = 1; i <= 3; i++) {
                            if (STATUS_KBN[attackInfo["ref_status_" + i]]) {
                                results.push(STATUS_KBN[attackInfo["ref_status_" + i]]);
                            }
                        }
                        spCost[attackInfo.skill_id] = 1;
                    }
                    for (const [, values] of Object.entries(selectBuffKeyMap)) {
                        let tempCount = {};
                        for (const entry of values) {
                            if (!entry) continue;
                            const [, buffId, useCharaId] = entry.split("_");
                            if (Number(useCharaId) !== charaId) continue;
                            const buffInfo = getBuffIdToBuff(Number(buffId));
                            if (!buffInfo) continue;

                            tempCount[buffInfo.skill_id] = (tempCount[buffInfo.skill_id] ?? 0) + 1;

                            for (let i = 1; i <= 2; i++) {
                                const statusKey = buffInfo[`ref_status_${i}`];
                                if (STATUS_KBN[statusKey] && buffInfo.min_power !== buffInfo.max_power) {
                                    results.push(STATUS_KBN[statusKey]);
                                }
                            }
                        }
                        for (const [skillId, count] of Object.entries(tempCount)) {
                            spCost[skillId] = Math.max(spCost[skillId] ?? 0, count);
                        }
                    };
                    let strClassName = "status " + (results.includes("str") ? "status_active" : "");
                    let dexClassName = "status " + (results.includes("dex") ? "status_active" : "");
                    let conClassName = "status " + (results.includes("con") ? "status_active" : "");
                    let mndClassName = "status " + (results.includes("mnd") ? "status_active" : "");
                    let intClassName = "status " + (results.includes("int") ? "status_active" : "");
                    let lukClassName = "status " + (results.includes("luk") ? "status_active" : "");
                    let sp_cost = 0;
                    for (const [key, value] of Object.entries(spCost)) {
                        let skill = getSkillData(key);
                        if (skill) {
                            sp_cost += skill.sp_cost * value;
                        }
                    }
                    return (
                        <div key={`chara_no${index}`}>
                            <select className="status" value={limit} onChange={(e) => { setSetting(index, "limitCount", e.target.value) }}>
                                {rarity === 1 ?
                                    Array.from({ length: 5 }, (_, i) => (
                                        <option value={i} key={`limit_${i}`}>{i}</option>
                                    ))
                                    : null
                                }
                                {rarity === 2 ? <option value="10">10</option> : null}
                                {rarity === 3 ? <option value="20">20</option> : null}
                            </select>
                            <input className={strClassName} value={str} type="number" onChange={(e) => { setSetting(index, "str", e.target.value) }} />
                            <input className={dexClassName} value={dex} type="number" onChange={(e) => { setSetting(index, "dex", e.target.value) }} />
                            <input className={conClassName} value={con} type="number" onChange={(e) => { setSetting(index, "con", e.target.value) }} />
                            <input className={mndClassName} value={mnd} type="number" onChange={(e) => { setSetting(index, "mnd", e.target.value) }} />
                            <input className={intClassName} value={int} type="number" onChange={(e) => { setSetting(index, "int", e.target.value) }} />
                            <input className={lukClassName} value={luk} type="number" onChange={(e) => { setSetting(index, "luk", e.target.value) }} />
                            <select className="status" value={jewel} onChange={(e) => { setSetting(index, "jewelLv", e.target.value) }}>
                                {Array.from({ length: 6 }, (_, i) => (
                                    <option value={i} key={`jewel_${i}`}>{i}</option>
                                ))}
                            </select>
                            <select className="status" value={token} onChange={(e) => { setSetting(index, "token", e.target.value) }} >
                                {Array.from({ length: 11 }, (_, i) => (
                                    <option value={i} key={`token_${i}`}>{i}</option>
                                ))}
                            </select>
                            <select className="status" value={morale} onChange={(e) => { setSetting(index, "morale", e.target.value) }}>
                                {Array.from({ length: 11 }, (_, i) => (
                                    <option value={i} key={`morale_${i}`}>{i}</option>
                                ))}
                            </select>
                            <input className="status show_skill" defaultValue="設定" type="button" onClick={() => showSkillList(index)} />
                            <div>
                                <span>{sp_cost}</span>
                            </div>
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
                            modalSetting.modalType === "skill" ?
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

export default CharaStatus;