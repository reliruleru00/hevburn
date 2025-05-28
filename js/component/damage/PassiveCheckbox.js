const PassiveCheckbox = ({ attackInfo, passiveList }) => {
    if (!attackInfo) return null;
   
    let attackCharaId = attackInfo.chara_id;
    return (
        <>
            {passiveList.map(passive => {
                const key = `passive-${passive.skill_id}-${passive.chara_id}`
                const name = passive.chara_name;
                let checked = true;

                return (
                    <div key={key}>
                        <input
                            type="checkbox"
                            className="passive"
                            id={key}
                            defaultChecked={checked}
                            data-effect_size={passive.effect_size}
                            data-skill_id={passive.skill_id}
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