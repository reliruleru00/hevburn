const AttackList = ({ attackInfo, setAttackInfo, selectSKillLv, setSelectSKillLv }) => {
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
                <SkillUnique attackInfo={attackInfo} setAttackInfo={setAttackInfo} />
            </div>
        </div >
    )
};

const SkillUnique = ({ attackInfo, setAttackInfo }) => {
    if (!attackInfo) return null;

    const { skill_id } = attackInfo;

    if (skill_id === SKILL_ID_MEGA_DESTROYER) {
        return <YamawakiServant attackInfo={attackInfo} setAttackInfo={setAttackInfo} />;
    }

    if (attackInfo.rest_dp) {
        let dpRate = attackInfo.dp_rate ? attackInfo.dp_rate : 100;
        let background = getApplyGradient("#4F7C8B", dpRate / 1.5);
        return (
            <div className="skill_unique">
                <div className="flex">
                    自身のDP
                    <div className="dp_gauge">
                        <input type="range" className="player_dp_range dp_range w-[160px]"
                            value={dpRate} max="150" min="0" step="1" style={{ background: background }}
                            onChange={e => { setAttackInfo({ ...attackInfo, dp_rate: e.target.value }); }}
                        />
                        <output className="gauge_rate">{dpRate}%</output>
                    </div>
                </div>
            </div>
        );
    }

    if (attackInfo.rest_sp) {
        let costSp = attackInfo.cost_sp ? attackInfo.cost_sp : 30;
        return (
            <div className="skill_unique">
                <div className="flex">
                    残りSP
                    <input type="number" className="ml-2 w-12" max="30" min="0" id="skill_unique_sp" value={costSp}
                        onChange={e => setAttackInfo({ ...attackInfo, cost_sp: e.target.value })} />
                </div>
            </div>
        );
    }
    return null;
}

const YamawakiServant = ({ attackInfo, setAttackInfo }) => {
    const [servantCount, setServantCount] = React.useState(1);
    const handleChangeServantCount = (servantCount) => {
        let val = 0;
        if (servantCount < 2) {
            val = 300;
        } else if (servantCount < 4) {
            val = 350;
        } else {
            val = 400;
        }
        setServantCount(servantCount);
        const newAttackInfo = { ...attackInfo, servant_count: servantCount, penetration: val };
        setAttackInfo(newAttackInfo);
    }

    return (
        <div className="skill_unique">
            <div className="flex">
                山脇様のしもべ
                <select value={servantCount} onChange={e => handleChangeServantCount(Number(e.target.value))} >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num}人</option>
                    ))}
                </select>
            </div>
        </div>
    );
}