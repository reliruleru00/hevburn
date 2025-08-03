import React, { useState } from 'react';
import { isOnlyBuff, isOnlyUse, isAloneActivation } from "./logic";
import { getBuffIdToBuff } from "utils/common";
import ConfirmModal from 'components/ConfirmModal';

const BuffSelect = ({ attackInfo, buffList, buffKey, buffSettingMap, handleChangeSkillLv, selectedKey, index, handleSelectChange, openModal }) => {
    const [modalData, setModalData] = useState(null);
    if (Object.keys(buffSettingMap).length > 0) {
        buffList.sort((a, b) => buffSettingMap[b.key]?.effect_size - buffSettingMap[a.key]?.effect_size);
    }

    const confirmSet = (message, onConfirm) => {
        setModalData({
            title: "確認",
            message,
            onConfirm: () => {
                onConfirm();
                setModalData(null);
            },
            onCancel: () => setModalData(null),
        });
    };

    const onChangeBuff = (value) => {
        const newSelected = [...selectedKey];
        while (newSelected.length <= index) {
            newSelected.push({ key: "" });
        }
        newSelected[index]["key"] = value;

        if (value) {
            const buffId = Number(value.split('_')[1]);
            let buffInfo = getBuffIdToBuff(buffId);
            if (isOnlyBuff(attackInfo, buffInfo, buffSettingMap) && newSelected[index ^ 1] === value) {
                confirmSet(`${buffInfo.buff_name}は\r\n通常、複数付与出来ません。\r\n設定してよろしいですか？`, () => {
                    handleSelectChange(buffKey, newSelected);
                });
                return;
            }

            if (isOnlyUse(attackInfo, buffInfo)) {
                confirmSet(`${buffInfo.buff_name}は\r\n通常、他スキルに設定出来ません。\r\n設定してよろしいですか？`, () => {
                    handleSelectChange(buffKey, newSelected);
                });
                return;
            }
            if (isAloneActivation(buffInfo)) {
                handleSelectChange(buffKey, [{ key: value}, {}]);
                return;
            }
        }

        handleSelectChange(buffKey, newSelected);
    }
    const value = selectedKey.length > index ? selectedKey[index]["key"] : "";
    const selectBuff = buffList.find(buff => buff.key === value);
    return (
        <>
            <td>
                <select className="buff" value={value} onChange={(e) => onChangeBuff(e.target.value)}>
                    <option value="">無し</option>
                    {buffList.map((buff, index) => {
                        let effect_text = `${buff.chara_name}: ${buff.buff_name} ${Math.floor(buffSettingMap[buff.key]?.effect_size * 100) / 100}%`;
                        return <option key={buff.key}
                            value={buff.key}
                        >{effect_text}</option>
                    })}
                </select>
            </td>
            <td>
                {value &&
                    <input className="strengthen" type="button" value={"詳細"} onClick={() => openModal("buffDetail", selectBuff, buffKey, selectedKey, index)} />
                }
            </td>
            <td>
                {selectBuff ?
                    <div className="lv">
                        <select className="lv_effect" disabled={selectBuff.max_lv === 1} value={buffSettingMap[selectedKey[index].key]?.skill_lv}
                            onChange={(e) => handleChangeSkillLv(buffKey, selectedKey[index]["key"], Number(e.target.value), index)}>
                            {Array.from({ length: selectBuff.max_lv }, (_, index) => selectBuff.max_lv - index).map(
                                (lv, index) => <option key={index} value={lv}>{lv}</option>
                            )}
                        </select>
                    </div>
                    : null
                }
            </td>
            <ConfirmModal
                isOpen={!!modalData}
                title={modalData?.title}
                message={modalData?.message}
                onConfirm={modalData?.onConfirm}
                onCancel={modalData?.onCancel}
            />
        </>
    )
};

export default BuffSelect;