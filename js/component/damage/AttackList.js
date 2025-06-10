const AttackList = ({ attackInfo, setAttackInfo, selectSKillLv, setSelectSKillLv}) => {
    const { styleList } = useStyleList();

    const TYPE_PHYSICAL = ["none", "slash", "stab", "strike"];
    const TYPE_ELEMENT = ["none", "fire", "ice", "thunder", "light", "dark"];

    const handleChangeAttackId = (value) => {
        let selectAttackInfo = getAttackInfo(value);
        if (selectAttackInfo) {
            const physical = getCharaData(selectAttackInfo.chara_id).physical;
            selectAttackInfo.attack_physical = physical;
            setSelectSKillLv(selectAttackInfo.max_lv);
            setAttackInfo(selectAttackInfo);
        }
    }

    const getAttackInfo = (value) => {
        const filteredAttack = memberAttackList.filter((obj) => obj.attack_id === value);
        return filteredAttack.length > 0 ? filteredAttack[0] : undefined;
    }

    const [checkSpecial, setCheckSpecial] = React.useState(true);

    const memberAttackList = React.useMemo(() => {
        let memberAttackList = [];
        for (let memberInfo of styleList.selectStyleList) {
            if (!memberInfo) continue;
            const charaId = memberInfo.style_info.chara_id;
            const styleId = memberInfo.style_info.style_id;
            const matchedSkill = skill_attack.filter(skill =>
                skill.chara_id === charaId &&
                (skill.style_id === styleId || skill.style_id === 0) &&
                (!checkSpecial || skill.attack_id < 1000)
            ).sort((x, y) => y.style_id - x.style_id || y.skill_id - x.skill_id);
            if (matchedSkill.length > 0) {
                memberAttackList.push(...matchedSkill);
            }
        }
        return memberAttackList;
    }, [checkSpecial, styleList.selectStyleList]);

    React.useEffect(() => {
        if (!attackInfo || !memberAttackList.some(a => a.attack_id === attackInfo.attack_id)) {
            if (memberAttackList.length > 0) {
                const firstAttack = memberAttackList[0];
                const newInfo = {
                    ...firstAttack,
                    attack_physical: getCharaData(firstAttack.chara_id).physical,
                };
                setAttackInfo(newInfo);
                setSelectSKillLv(newInfo.max_lv);
            } else {
                setAttackInfo(undefined);
                setSelectSKillLv(undefined);
            }
        }
    }, [memberAttackList, attackInfo]);

    return (
        <div className="attack_area surround_area mx-auto mt-2 adjust_width">
            <label className="area_title">攻 撃</label>
            <div className="flex">
                <select className="ml-6" id="attack_list" value={attackInfo?.attack_id} onChange={e => handleChangeAttackId(Number(e.target.value))}>
                    {styleList.selectStyleList.filter(memberInfo => memberInfo && memberInfo.is_select).map((memberInfo, index) => {
                        let charaData = getCharaData(memberInfo.style_info.chara_id)
                        return (
                            <optgroup key={`chara${memberInfo.style_info.chara_id}`} label={charaData.chara_name}>
                                {memberAttackList.filter(obj =>
                                    obj.chara_id === memberInfo.style_info.chara_id
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
                {attackInfo && (() => {
                    const { attack_element, range_area } = attackInfo;
                    const attack_physical = getCharaData(attackInfo.chara_id).physical;
                    return (
                        <>
                            <div className="lv">
                                <select id="skill_lv" value={selectSKillLv} onChange={e => setSelectSKillLv(e.target.value)} >
                                    {attackInfo && (() =>
                                        Array.from({ length: attackInfo.max_lv }, (_, i) => i + 1).map(value => (
                                            <option key={`skill${value}`} value={value}>
                                                {value}
                                            </option>
                                        ))
                                    )()}
                                </select>
                            </div>
                            <img className="w-6 h-6" src={`img/${TYPE_PHYSICAL[attack_physical]}.webp`} alt="物理属性" />
                            <img className="w-6 h-6" src={`img/${TYPE_ELEMENT[attack_element]}.webp`} alt="属性" />
                            <label id="range_area">{range_area === 1 ? "単体" : "全体"}</label>
                        </>
                    );
                })()}
            </div>
            <div className="ml-6">
                <div className="mb-2">
                    <input id="skill_special_display" type="checkbox" checked={checkSpecial} onChange={e => setCheckSpecial(e.target.checked)} />
                    <label className="checkbox01" htmlFor="skill_special_display">
                        EXスキル以外を非表示にする
                    </label>
                </div>
                <SkillUnique attackInfo={attackInfo} />
            </div>
        </div >
    )
};

const DP_LIST = [115, 136, 187, 2167, 166];
const SP_LIST = [154, 155, 2162];

function SkillUnique({ attackInfo }) {
    if (!attackInfo) return null;

    const { attack_id, chara_id } = attackInfo;

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