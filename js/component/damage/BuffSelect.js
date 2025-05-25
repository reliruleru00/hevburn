const BuffSelect = ({ attackInfo, buffList, buffKind, buffSettingMap, handleChangeSkillLv, selectedKey, onChangeSelectedKey, filteredBuffList }) => {
    if (Object.keys(buffSettingMap).length === 0) return null;

    let kindBuffList = filteredBuffList(buffList, buffKind, attackInfo) 
    kindBuffList.sort((a, b) => buffSettingMap[b.key]?.effect_size - buffSettingMap[a.key]?.effect_size);

    let selectBuff = kindBuffList.find(buff => buff.key === selectedKey);
    return (
        <>
            <td>
                <select className="buff" value={selectedKey} onChange={onChangeSelectedKey}>
                    <option value="">無し</option>
                    {kindBuffList.map((buff, index) => {
                        let effect_text = `${buff.chara_name}: ${buff.buff_name} ${Math.floor(buffSettingMap[buff.key]?.effect_size * 100) / 100}%`;
                        return <option key={buff.key}
                            value={buff.key}
                            data-text_effect_size={buffSettingMap[buff.key]?.effect_size}
                        >{effect_text}</option>
                    })}
                </select>
            </td>
            <td>
                <label className="strengthen hidden">
                    <input type="checkbox" />
                    <span>強化</span>
                </label>
            </td>
            <td>
                {selectBuff ?
                    <div className="lv">
                        <select className="lv_effect" disabled={selectBuff.max_lv === 1} value={buffSettingMap[selectedKey]?.skill_lv}
                            onChange={(e) => handleChangeSkillLv(selectedKey, Number(e.target.value))}>
                            {Array.from({ length: selectBuff.max_lv }, (_, index) => selectBuff.max_lv - index).map(
                                (lv, index) => <option key={index} value={lv}>{lv}</option>
                            )}
                        </select>
                    </div>
                    : null
                }
            </td>
        </>
    )
};
