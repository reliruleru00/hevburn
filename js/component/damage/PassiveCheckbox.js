const PassiveCheckbox = ({ passiveList, passiveSettingMap, setPassiveSettingMap }) => {
    return (
        <>
            {passiveList.map(passive => {
                const key = passive.key;
                if (passiveSettingMap[key] === undefined) {
                    return null;
                }
                const name = passive.chara_name;
                return (
                    <div key={key}>
                        <input type="checkbox" className="passive"
                            id={key} checked={passiveSettingMap[key].checked}
                            onChange={e => {
                                const newPassiveSettingMap = { ...passiveSettingMap };
                                newPassiveSettingMap[key].checked = e.target.checked;
                                setPassiveSettingMap(newPassiveSettingMap);
                            }}
                        />
                        <label htmlFor={key}
                            className="checkbox01">
                            {`${name}: ${passive.passive_name} (${passive.passive_short_explan})`}
                        </label>
                    </div>
                )
            }
            )}
        </>
    );
};