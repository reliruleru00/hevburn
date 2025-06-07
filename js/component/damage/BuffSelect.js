

const BuffField = ({ buffKey, index, rowSpan, buffName, attackInfo,
    buffList, buffKind, buffSettingMap, handleChangeSkillLv, selectedKey, handleSelectChange, filteredBuffList }) => {

    let isAlone = false;
    if (selectedKey[0]) {
        let buffId = Number(selectedKey[0].split('-')[0]);
        let buffInfo = getBuffIdToBuff(buffId);
        isAlone = isAloneActivation(buffInfo);
    }

    return (
        <>
            <tr>
                {index === 0 && (
                    <td className="kind pc_only" rowSpan={rowSpan}>
                        {buffKind == BUFF.ATTACKUP ? "バフ" : buffKind == BUFF.DEFENSEDOWN ? "デバフ" : "クリティカル"}
                    </td>
                )}
                <td rowSpan="2">{buffName}</td>
                <BuffSelect
                    attackInfo={attackInfo}
                    buffList={buffList}
                    buffKind={buffKind}
                    buffKey={buffKey}
                    buffSettingMap={buffSettingMap}
                    handleChangeSkillLv={handleChangeSkillLv}
                    selectedKey={selectedKey}
                    index={0}
                    handleSelectChange={handleSelectChange}
                    filteredBuffList={filteredBuffList}
                />
            </tr>
            <tr>
                {isAlone ?
                    <>
                        <td>
                            <select className="buff" disabled>
                                <option value={""}>使用不可</option>
                            </select>
                        </td>
                        <td></td>
                        <td></td>
                    </>
                    :
                    <BuffSelect
                        attackInfo={attackInfo}
                        buffList={buffList}
                        buffKind={buffKind}
                        buffKey={buffKey}
                        buffSettingMap={buffSettingMap}
                        handleChangeSkillLv={handleChangeSkillLv}
                        selectedKey={selectedKey}
                        index={1}
                        handleSelectChange={handleSelectChange}
                        filteredBuffList={filteredBuffList}
                    />
                }

            </tr>
        </>
    )
}

const BuffSelect = ({ attackInfo, buffList, buffKind, buffKey, buffSettingMap, handleChangeSkillLv, selectedKey, index, handleSelectChange, filteredBuffList }) => {
    let kindBuffList = filteredBuffList(buffList, buffKind, attackInfo)
    if (Object.keys(buffSettingMap).length > 0) {
        kindBuffList.sort((a, b) => buffSettingMap[b.key]?.effect_size - buffSettingMap[a.key]?.effect_size);
    }

    const onChangeBuff = (value) => {
        selectedKey[index] = value;
        if (value) {
            const buffId = Number(value.split('-')[0]);
            let buffInfo = getBuffIdToBuff(buffId);
            if (isOnlyBuff(attackInfo, buffInfo, buffSettingMap) && selectedKey[index ^ 1] == value) {
                if (!confirm(buffInfo.buff_name + "は\r\n通常、複数付与出来ませんが、設定してよろしいですか？")) {
                    selectedKey[index] = "";
                }
            }
            if (isOnlyUse(attackInfo, buffInfo)) {
                if (!confirm(buffInfo.buff_name + "は\r\n通常、他スキルに設定出来ませんが、設定してよろしいですか？")) {
                    selectedKey[index] = "";
                }
            }
            if (isAloneActivation(buffInfo)) {
                selectedKey = [value, ""];
            }
        }
        handleSelectChange(buffKey, selectedKey);
    }
    const value = selectedKey.length > index ? selectedKey[index] : "";
    const selectBuff = kindBuffList.find(buff => buff.key === value);
    return (
        <>
            <td>
                <select className="buff" value={value} onChange={(e) => onChangeBuff(e.target.value)}>
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
