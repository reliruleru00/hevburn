const AttackList = ({ setAttackInfo }) => {
    const { styleList } = useStyleList();

    const [cehckSpecial, setCehckSpecial] = React.useState(true);
    const [selectAttackId, setSelectAttackId] = React.useState(undefined);
    const [selectSlillLv, setSelectSlillLv] = React.useState(undefined);

    const TYPE_PHYSICAL = ["", "slash", "stab", "strike"];
    const TYPE_ELEMENT = ["none", "fire", "ice", "thunder", "light", "dark"];

    // 初回起動時の自動選択
    React.useEffect(() => {
        if (styleList.selectStyleList.length === 0) return;

        for (let memberInfo of styleList.selectStyleList) {
            const charaId = memberInfo.style_info.chara_id;
            const styleId = memberInfo.style_info.style_id;

            const matchedSkill = skill_attack.filter(skill =>
                skill.chara_id === charaId &&
                (skill.style_id === styleId || skill.style_id === 0) &&
                (!cehckSpecial || skill.attack_id < 1000)
            ).sort((x, y) => y.skill_id - x.skill_id);
            if (matchedSkill.length > 0) {
                handleChangeAttackId(matchedSkill[0].attack_id);
                break;
            }
        }
    }, [cehckSpecial]);

    const handleChangeAttackId = (value) => {
        setSelectAttackId(value);
        let selectAttackInfo = getAttackInfo(value);
        if (selectAttackInfo) {
            const physical = getCharaData(selectAttackInfo.chara_id).physical;
            selectAttackInfo.attack_physical = physical;
            setSelectSlillLv(selectAttackInfo.max_lv);
            setAttackInfo(selectAttackInfo);
        }
    }

    const getAttackInfo = (value) => {
        const filteredAttack = skill_attack.filter((obj) => obj.attack_id === value);
        return filteredAttack.length > 0 ? filteredAttack[0] : undefined;
    }
    let selectAttackInfo = getAttackInfo(selectAttackId);

    return (
        <div className="attack_area surround_area mx-auto mt-2 adjust_width">
            <label className="area_title">攻 撃</label>
            <div className="flex">
                <select className="ml-6" id="attack_list" value={selectAttackId} onChange={e => handleChangeAttackId(Number(e.target.value))}>
                    {styleList.selectStyleList.filter(memberInfo => memberInfo && memberInfo.is_select).map((memberInfo, index) => {
                        let charaData = getCharaData(memberInfo.style_info.chara_id)
                        return (
                            <optgroup key={`chara${memberInfo.style_info.chara_id}`} label={charaData.chara_name}>
                                {skill_attack.filter(obj =>
                                    obj.chara_id === memberInfo.style_info.chara_id
                                    && (obj.style_id === memberInfo.style_info.style_id || obj.style_id === 0)
                                    && (!cehckSpecial || obj.attack_id < 1000)
                                ).sort((x, y) => y.style_id - x.style_id
                                ).map((skill, index) => {
                                    return (
                                        <option key={`attack${skill.attack_id}`} value={skill.attack_id} data-chara_id={skill.chara_id}>
                                            {skill.attack_name}
                                        </option>
                                    );
                                })}
                            </optgroup>
                        )
                    })}
                </select>
                <div className="lv" style={{ display: "block" }}>
                    <select id="skill_lv" value={selectSlillLv} onChange={e => setSelectSlillLv(e.target.value)} >
                        {selectAttackInfo && (() =>
                            Array.from({ length: selectAttackInfo.max_lv }, (_, i) => selectAttackInfo.max_lv - i).map(value => (
                                <option key={`skill${value}`} value={value}>
                                    {value}
                                </option>
                            ))
                        )()}
                    </select>
                </div>
                {selectAttackInfo && (() => {
                    const { attack_element, attack_physical, range_area } = selectAttackInfo;
                    return (
                        <>
                            <img className="w-6 h-6" src={`img/${TYPE_PHYSICAL[attack_physical]}.webp`} alt="物理属性" />
                            <img className="w-6 h-6" src={`img/${TYPE_ELEMENT[attack_element]}.webp`} alt="属性" />
                            <label id="range_area">{range_area === 1 ? "単体" : "全体"}</label>
                        </>
                    );
                })()}
            </div>
            <div className="ml-6">
                <div className="mb-2">
                    <input id="skill_special_display" type="checkbox" checked={cehckSpecial} onChange={e => setCehckSpecial(e.target.checked)} />
                    <label className="checkbox01" htmlFor="skill_special_display">
                        EXスキル以外を非表示にする
                    </label>
                </div>
                <SkillUnique selectAttackInfo={selectAttackInfo} />
            </div>
        </div >
    )
};

const DP_LIST = [115, 136, 187, 2167, 166];
const SP_LIST = [154, 155, 2162];

function SkillUnique({ selectAttackInfo }) {
    if (!selectAttackInfo) return null;

    const { attack_id, chara_id } = selectAttackInfo;

    if (attack_id === 190) {
        return (
            <div className="skill_unique">
                <div className="flex">
                    山脇様のしもべ
                    <select id="servant_count">
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num}人</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    if (DP_LIST.includes(attack_id)) {
        return (
            <div className="skill_unique">
                <div className="flex">
                    自身のDP
                    <div className="dp_gauge">
                        <input type="range" className="player_dp_range dp_range w-[160px]" defaultValue="100" id="skill_unique_dp_rate" max="150" min="0" step="1"
                            style={{
                                background:
                                    "linear-gradient(to right, rgb(79, 124, 139) 0%, rgb(196, 211, 216) 66.6667%, rgb(255, 255, 255) 66.6667%)",
                            }}
                        />
                        <output className="gauge_rate" id="player_dp_rate">
                            100%
                        </output>
                    </div>
                </div>
            </div>
        );
    }

    if (SP_LIST.includes(attack_id)) {
        return (
            <div className="skill_unique">
                <div className="flex">
                    残りSP
                    <input className="ml-2 w-12" defaultValue="30" max="30" mix="0" id="skill_unique_sp" type="number" />
                </div>
            </div>
        );
    }

    if (chara_id === 45) {
        return (
            <div className="skill_unique">
                <input id="skill_unique_cherry_blossoms" type="checkbox" />
                <label className="checkbox01" htmlFor="skill_unique_cherry_blossoms">
                    桜花の矢
                </label>
            </div>
        );
    }

    if (chara_id === 17 || chara_id === 18) {
        return (
            <div className="skill_unique">
                <input id="skill_unique_shadow_clone" type="checkbox" />
                <label className="checkbox01" htmlFor="skill_unique_shadow_clone">
                    影分身
                </label>
            </div>
        );
    }

    return null;
}