const ELEMENT_KIND = [
    BUFF.ELEMENT_ATTACKUP,
    BUFF.ELEMENT_DEFENSEDOWN,
    BUFF.ELEMENT_ETERNAL_DEFENSEDOWN,
    BUFF.ELEMENT_CRITICALRATEUP,
    BUFF.ELEMENT_CRITICALDAMAGEUP,
    BUFF.RESISTDOWN
]
const OTHER_ONLY_AREA = [
    RANGE.ALLY_BACK,
    RANGE.SELF_OTHER,
    RANGE.FRONT_OTHER,
    RANGE.OTHER_UNIT,
]

const BUFF_KBN = {
    0: "power_up",
    1: "element_up",
    2: "mindeye",
    3: "defense_down",
    4: "element_down",
    5: "fragile",
    6: "critical_up",
    7: "critical_damege",
    8: "critical_element",
    9: "critical_damege_element",
    10: "charge",
    11: "element_field",
    12: "destruction_rete_up",
    14: "fightingspirit",
    15: "misfortune",
    16: "funnel",
    18: "strong_break",
    19: "dp_defense_down",
    20: "resist_down",
    21: "permanent_defense_down",
    22: "permanent_element_down",
    39: "servant"
};

const TARGET_KIND = [
    EFFECT.ATTACKUP, // 攻撃力アップ
    EFFECT.DAMAGERATEUP, // 破壊率上昇
    EFFECT.CRITICAL_UP, // クリティカル率アップ
    EFFECT.FIELD_DEPLOYMENT, // フィールド展開
    EFFECT.STATUSUP_VALUE, // 能力固定上昇
    EFFECT.STATUSUP_RATE, // 能力%上昇
    EFFECT.FIELD_STRENGTHEN, // フィールド強化
    EFFECT.BUFF_STRENGTHEN, // バフ強化
]
const SUB_TARGET_KIND = [
    EFFECT.FIELD_DEPLOYMENT, // フィールド展開
    EFFECT.STATUSUP_VALUE, // 能力固定上昇
    EFFECT.STATUSUP_RATE, // 能力%上昇
    EFFECT.FIELD_STRENGTHEN, // フィールド強化
    EFFECT.BUFF_STRENGTHEN, // バフ強化
]
const BuffArea = ({ attackInfo, state, dispatch }) => {

    const { styleList } = useStyleList();
    const [buffSettingMap, setBuffSettingMap] = React.useState({});
    let enemyInfo = state.enemy_info;

    const { buffList, abilityList, passiveList } = React.useMemo(() => {
        let buffList = [];
        let abilityList = [];
        let passiveList = [];

        styleList.selectStyleList.filter(memberInfo => memberInfo && memberInfo.is_select).forEach(member_info => {
            const charaId = member_info.style_info.chara_id;
            const styleId = member_info.style_info.style_id;
            const charaName = getCharaData(charaId).chara_short_name;
            const styleBuffList = skill_buff.filter(obj =>
                (obj.chara_id === charaId || obj.chara_id === 0) &&
                (obj.style_id === member_info.style_info.style_id || obj.style_id === 0)
            );

            const newStyleBuffList = JSON.parse(JSON.stringify(styleBuffList));
            newStyleBuffList.forEach(buff => {
                buff.key = `${buff.buff_id}_${charaId}`;
                buff.member_info = member_info;
                buff.chara_name = charaName;
            });

            buffList.push(...newStyleBuffList);

            const createFieldBuff = (key, skillName, fieldElement, effectSize) => {
                let fieldBuff = {
                    key: key,
                    buff_kind: BUFF.FIELD,
                    buff_name: skillName,
                    buff_element: fieldElement,
                    buff_id: key,
                    chara_name: charaName,
                    max_power: effectSize,
                    max_lv: 1
                };
                return fieldBuff;
            }

            const limitCount = member_info.limit_count;
            // ロールアビリティ
            let styleAbility = {
                "0": member_info.style_info.ability0,
                "00": member_info.style_info.ability00,
                "1": member_info.style_info.ability1,
                "3": member_info.style_info.ability3,
                "5": member_info.style_info.ability5,
                "10": member_info.style_info.ability10
            };
            if (member_info.style_info.role == ROLE.ADMIRAL) {
                styleAbility["00"] = 299;
            }
            Object.keys(styleAbility).forEach(key => {
                let abilityId = styleAbility[key];
                if (abilityId == null || abilityId > 1000) {
                    const servant_list = [1019, 1020, 1021];
                    if (servant_list.includes(abilityId)) {
                        let name = getCharaData(charaId).chara_short_name;
                    }
                    // 1000番以降は不要
                    return;
                }
                // if (!is_select && ability_info.range_area != RANGE_FIELD) {
                //     // 他部隊のアビリティはフィールドのみ許可
                //     return;
                // }

                let abilityInfo = getAbilityInfo(abilityId);
                if (abilityInfo.range_area == RANGE.FIELD) {
                    let buff = createFieldBuff(
                        `ability-${abilityId}_${charaId}`,
                        abilityInfo.ability_name,
                        abilityInfo.element,
                        abilityInfo.effect_size)
                    buffList.push(buff);
                } else {
                    const newAbility = JSON.parse(JSON.stringify(abilityInfo));
                    newAbility.key = `${abilityId}_${charaId}`;
                    newAbility.limit_count = limitCount;
                    newAbility.limit_border = Number(key);
                    newAbility.chara_id = charaId;
                    newAbility.chara_name = charaName;
                    abilityList.push(newAbility)
                }
            })

            let stylePassiveList = skill_list.filter(obj =>
                obj.chara_id === charaId &&
                (obj.style_id === styleId || obj.style_id === 0) &&
                obj.skill_active == 1
            );
            stylePassiveList.forEach(skill => {
                let passive = getPassiveInfo(skill.skill_id);
                if (!passive || !TARGET_KIND.includes(passive.effect_type)) {
                    return;
                }
                // if (!is_select && !SUB_TARGET_KIND.includes(passive_info.effect_type)) {
                //     // 他部隊のアビリティは一部のみ許可
                //     return true;
                // }
                if (passive.range_area === RANGE.FIELD) {
                    let buff = createFieldBuff(`passive-${passive.skill_id}_${charaId}`, passive.passive_name, 0, passive.effect_size)
                    buffList.push(buff);
                } else {
                    passive.key = `${passive.skill_id}_${charaId}`;
                    passive.member_info = member_info;
                    passive.chara_name = charaName;
                    passiveList.push(passive);
                }
            });
        });
        return { buffList, abilityList, passiveList };
    }, [attackInfo, enemyInfo, styleList]);


    React.useEffect(() => {
        const initialMap = {};
        buffList.forEach(buff => {
            initialMap[buff.key] = {
                buff_id: buff.buff_id,
                skill_lv: buff.max_lv,
                effect_size: getEffectSize(buff, buff.max_lv)
            };
        });
        setBuffSettingMap(initialMap);
    }, [buffList]);

    const handleChangeSkillLv = (buffKey, lv) => {
        let buff = buffList.filter(buff => buff.key === buffKey)[0];
        const newSetting = buffSettingMap[buffKey]
        newSetting.skill_lv = lv;
        newSetting.effect_size = getEffectSize(buff, lv)
        setBuffSettingMap(prev => ({
            ...prev,
            [buffKey]: newSetting
        }));
    };

    let isElement = attackInfo?.attack_element !== 0;
    let isWeak = React.useMemo(() => {
        if (attackInfo === undefined) return false;
        let physical_resist = enemyInfo[`physical_${attackInfo?.attack_physical}`];
        let element_resist = enemyInfo[`element_${attackInfo?.attack_element}`] - state.correction[`element_${attackInfo?.attack_element}`];
        return physical_resist * element_resist > 10000;
    }, [attackInfo, state.enemy_info, state.correction]);
    let isDp = state.dpRate[0] !== 0;

    const attackUpBuffs = [
        { name: "攻撃力UP1", kind: BUFF.ATTACKUP, num: 1 },
        { name: "攻撃力UP2", kind: BUFF.ATTACKUP, num: 2 },
        ...(isElement
            ? [
                { name: "属性攻撃力UP1", kind: BUFF.ELEMENT_ATTACKUP, num: 1 },
                { name: "属性攻撃力UP2", kind: BUFF.ELEMENT_ATTACKUP, num: 2 },
            ]
            : []),
        ...(isWeak
            ? [
                { name: "心眼1", kind: BUFF.MINDEYE, num: 1 },
                { name: "心眼2", kind: BUFF.MINDEYE, num: 2 },
            ]
            : []),
        { name: "連撃1", kind: BUFF.FUNNEL, num: 1 },
        { name: "連撃2", kind: BUFF.FUNNEL, num: 2 },
        { name: "破壊率UP1", kind: BUFF.DAMAGERATEUP, num: 1 },
        { name: "破壊率UP2", kind: BUFF.DAMAGERATEUP, num: 2 },
    ];

    const defDownBuffs = [
        { name: "防御力DOWN1", kind: BUFF.DEFENSEDOWN, num: 1 },
        { name: "防御力DOWN2", kind: BUFF.DEFENSEDOWN, num: 2 },
        ...(isDp
            ? [
                { name: "DP防御力DOWN1", kind: BUFF.DEFENSEDP, num: 1 },
                { name: "DP防御力DOWN2", kind: BUFF.DEFENSEDP, num: 2 },
            ]
            : []),
        ...(isElement
            ? [
                { name: "属性防御力DOWN1", kind: BUFF.ELEMENT_DEFENSEDOWN, num: 1 },
                { name: "属性防御力DOWN2", kind: BUFF.ELEMENT_DEFENSEDOWN, num: 2 },
            ]
            : []),
        { name: "防御力DOWN1(永)", kind: BUFF.ETERNAL_DEFENSEDOWN, num: 1 },
        { name: "防御力DOWN2(永)", kind: BUFF.ETERNAL_DEFENSEDOWN, num: 2 },
        ...(isElement
            ? [
                { name: "属性防御力DOWN1(永)", kind: BUFF.ELEMENT_ETERNAL_DEFENSEDOWN, num: 1 },
                { name: "属性防御力DOWN2(永)", kind: BUFF.ELEMENT_ETERNAL_DEFENSEDOWN, num: 2 },
            ]
            : []),
        ...(isWeak
            ? [
                { name: "脆弱1", kind: BUFF.FRAGILE, num: 1 },
                { name: "脆弱2", kind: BUFF.FRAGILE, num: 2 },
            ]
            : []),
        ...(isElement
            ? [
                { name: "耐性ダウン1", kind: BUFF.RESISTDOWN, num: 1 },
                { name: "耐性ダウン2", kind: BUFF.RESISTDOWN, num: 2 },
            ]
            : []),
    ];

    const criticalBuffs = [
        { name: "クリティカル率UP1", kind: BUFF.CRITICALRATEUP, num: 1 },
        { name: "クリティカル率UP2", kind: BUFF.CRITICALRATEUP, num: 2 },
        { name: "クリダメUP1", kind: BUFF.CRITICALDAMAGEUP, num: 1 },
        { name: "クリダメUP2", kind: BUFF.CRITICALDAMAGEUP, num: 2 },
        ...(isElement
            ? [
                { name: "属性クリ率UP1", kind: BUFF.ELEMENT_CRITICALRATEUP, num: 1 },
                { name: "属性クリ率UP2", kind: BUFF.ELEMENT_CRITICALRATEUP, num: 2 },
                { name: "属性クリダメUP1", kind: BUFF.ELEMENT_CRITICALDAMAGEUP, num: 1 },
                { name: "属性クリダメUP2", kind: BUFF.ELEMENT_CRITICALDAMAGEUP, num: 2 }
            ]
            : []),
    ];

    let buffKeyList = {};
    const filedKey = `filed-${BUFF.FIELD}`
    const chargeKey = `charge-${BUFF.CHARGE}`
    attackUpBuffs.forEach(buff => {
        buffKeyList[`${BUFF_KBN[buff.kind]}-${buff.kind}-${buff.num}`] = "";
    });
    defDownBuffs.forEach(buff => {
        buffKeyList[`${BUFF_KBN[buff.kind]}-${buff.kind}-${buff.num}`] = "";
    });
    criticalBuffs.forEach(buff => {
        buffKeyList[`${BUFF_KBN[buff.kind]}-${buff.kind}-${buff.num}`] = "";
    });
    buffKeyList[filedKey] = "";
    buffKeyList[chargeKey] = "";

    const [selectBuffKeyMap, setSelectBuffKeyMap] = React.useState(buffKeyList);

    const getBuffKindEffectSize = (buffKind) => {
        const totalEffectSize = Object.keys(selectBuffKeyMap)
            .filter((buffKey) => buffKey.startsWith(`${BUFF_KBN[buffKind]}-${buffKind}`))
            .reduce((sum, buffKey) => {
                const buff = buffSettingMap[selectBuffKeyMap[buffKey]];
                return sum + (buff ? buff.effect_size : 0);
            }, 0);
        return totalEffectSize;
    }

    const handleSelectChange = (buffKey, buffKind, newSelect) => {
        setSelectBuffKeyMap(prev => ({ ...prev, [buffKey]: newSelect }));
    };

    // 上から2番目のbuffを子にセット
    const selectSecondBuff = () => {
        Object.keys(buffKeyList).forEach((buffKey) => {
            let buffKind = Number(buffKey.split('-')[1]);
            let kindBuffList = filteredBuffList(buffList, buffKind, attackInfo);
            kindBuffList.sort((a, b) => buffSettingMap[b.key].effect_size - buffSettingMap[a.key].effect_size);
            if (kindBuffList.length >= 1) {
                handleSelectChange(buffKey, buffKind, kindBuffList[0].key);
            }
        })
    }

    // バフの絞り込み
    const filteredBuffList = (buffList, buffKind, attackInfo) => {
        if (!attackInfo) return [];
        return buffList.filter(buff => {
            if (buff.buff_kind !== buffKind) {
                return false;
            }
            if (ELEMENT_KIND.includes(buff.buff_kind) && attackInfo.attack_element !== buff.buff_element) {
                return false;
            }
            if (buff.buff_kind === BUFF.FIELD && buff.buff_element !== 0 && buff.buff_element !== attackInfo.attack_element) {
                return false;
            }
            if (buff.range_area === RANGE.SELF && buff.chara_id !== attackInfo.chara_id) {
                return false;
            }
            if (OTHER_ONLY_AREA.includes(buff.range_area) && buff.chara_id === attackInfo.chara_id) {
                return false;
            }
            if (buff.buff_id == 2607 && buff.member_info.style_info.style_id != 145) {
                // 月光(歌姫の加護)
                return; false;
            }
            return true;
        });
    }

    const selectNoneBuff = () => {
        Object.keys(selectBuffKeyMap).forEach((buffKey) => {
            handleSelectChange(buffKey, "");
        })
    }

    let resistDownEffectSize = getBuffKindEffectSize(BUFF.RESISTDOWN);
    React.useEffect(() => {
        if (attackInfo) {
            dispatch({ type: "SET_RRGIST_DOWN", element: attackInfo.attack_element, value: resistDownEffectSize });
        }
    }, [state.enemy_info, state.resist_down, attackInfo, resistDownEffectSize]);

    React.useEffect(() => {
        setSelectBuffKeyMap(buffKeyList);
        if (attackInfo) {
            selectSecondBuff();
        }
    }, [state.enemy_info, attackInfo]);

    // if (attackInfo) {
    //     let effectSize = getBuffKindEffectSize(BUFF.RESISTDOWN);
    //     dispatch({ type: "SET_RRGIST_DOWN", element: attackInfo.attack_element, value: effectSize });
    // }

    return (
        <div className="buff_area text-right mx-auto">
            <div className="flex justify-between items-center w-full">
                <div className="ml-6">
                    <input
                        className="buff_btn"
                        defaultValue="全て外す"
                        id="all_delete"
                        type="button"
                        onClick={selectNoneBuff}
                    />
                    <input
                        className="buff_btn"
                        defaultValue="一括設定"
                        id="open_select_buff"
                        type="button"
                    />
                </div>
                <div className="flex items-center">
                    <input defaultChecked id="auto_skill" type="checkbox" onChange={selectSecondBuff} />
                    <label className="checkbox01 ml-2" htmlFor="auto_skill">
                        スタイル/攻撃スキル/敵選択時に最適スキルを自動選択する
                    </label>
                </div>
            </div>
            <div className="text-center">
                <table>
                    <colgroup>
                        <col className="title_column pc_only" />
                        <col className="type1_column" />
                        <col className="type2_column" />
                        <col className="skill_name_column" />
                        <col className="reinforce_column" />
                        <col className="skill_lv_column" />
                    </colgroup>
                    <tbody>
                        <tr className="sp_only">
                            <td className="kind" colSpan="5">
                                バフ
                            </td>
                        </tr>
                        {attackUpBuffs.map((buff, index) => {
                            const key = `${BUFF_KBN[buff.kind]}-${buff.kind}-${buff.num}`
                            return (
                                <tr key={key}>
                                    {index === 0 && (
                                        <td className="kind pc_only" rowSpan={attackUpBuffs.length}>
                                            バフ
                                        </td>
                                    )}
                                    <td colSpan="2">{buff.name}</td>
                                    <BuffSelect
                                        attackInfo={attackInfo}
                                        buffList={buffList}
                                        buffKind={buff.kind}
                                        buffSettingMap={buffSettingMap}
                                        handleChangeSkillLv={handleChangeSkillLv}
                                        selectedKey={selectBuffKeyMap[key] || ""}
                                        onChangeSelectedKey={(e) => handleSelectChange(key, buff.kind, e.target.value)}
                                        filteredBuffList={filteredBuffList}
                                    />
                                </tr>
                            )
                        })}
                        <tr className="sp_only">
                            <td className="kind" colSpan="5">
                                デバフ
                            </td>
                        </tr>
                        {defDownBuffs.map((buff, index) => {
                            const key = `${BUFF_KBN[buff.kind]}-${buff.kind}-${buff.num}`
                            return (
                                <tr key={key}>
                                    {index === 0 && (
                                        <td className="kind pc_only" rowSpan={defDownBuffs.length}>
                                            デバフ
                                        </td>
                                    )}
                                    <td colSpan="2">{buff.name}</td>
                                    <BuffSelect
                                        attackInfo={attackInfo}
                                        buffList={buffList}
                                        buffKind={buff.kind}
                                        buffSettingMap={buffSettingMap}
                                        handleChangeSkillLv={handleChangeSkillLv}
                                        selectedKey={selectBuffKeyMap[key] || ""}
                                        onChangeSelectedKey={(e) => handleSelectChange(key, buff.kind, e.target.value)}
                                        filteredBuffList={filteredBuffList}
                                    />
                                </tr>
                            )
                        })}
                        <tr className="sp_only">
                            <td className="kind" colSpan="5">
                                クリティカル
                            </td>
                        </tr>
                        {criticalBuffs.map((buff, index) => {
                            const key = `${BUFF_KBN[buff.kind]}-${buff.kind}-${buff.num}`
                            return (
                                <tr key={key}>
                                    {index === 0 && (
                                        <td className="kind pc_only" rowSpan={criticalBuffs.length}>
                                            クリティカル
                                        </td>
                                    )}
                                    <td colSpan="2">{buff.name}</td>
                                    <BuffSelect
                                        attackInfo={attackInfo}
                                        buffList={buffList}
                                        buffKind={buff.kind}
                                        buffSettingMap={buffSettingMap}
                                        handleChangeSkillLv={handleChangeSkillLv}
                                        selectedKey={selectBuffKeyMap[key] || ""}
                                        onChangeSelectedKey={(e) => handleSelectChange(key, buff.kind, e.target.value)}
                                        filteredBuffList={filteredBuffList}
                                    />
                                </tr>
                            )
                        })}
                        <tr className="sp_only">
                            <td className="kind" colSpan="5">
                                フィールド
                            </td>
                        </tr>
                        <tr>
                            <td className="kind pc_only">フィールド</td>
                            <td className="type " colSpan="2">
                                フィールド
                            </td>
                            <BuffSelect
                                attackInfo={attackInfo}
                                buffList={buffList}
                                buffKind={BUFF.FIELD}
                                buffSettingMap={buffSettingMap}
                                handleChangeSkillLv={handleChangeSkillLv}
                                selectedKey={selectBuffKeyMap[filedKey] || ""}
                                onChangeSelectedKey={(e) => handleSelectChange(filedKey, BUFF.FIELD, e.target.value)}
                                filteredBuffList={filteredBuffList}
                            />
                        </tr>
                        <tr className="sp_only">
                            <td className="kind" colSpan="5">
                                チャージ
                            </td>
                        </tr>
                        <tr>
                            <td className="kind pc_only">チャージ</td>
                            <td className="type" colSpan="2">
                                チャージ
                            </td>
                            <BuffSelect
                                attackInfo={attackInfo}
                                buffList={buffList}
                                buffKind={BUFF.CHARGE}
                                buffSettingMap={buffSettingMap}
                                handleChangeSkillLv={handleChangeSkillLv}
                                selectedKey={selectBuffKeyMap[chargeKey] || ""}
                                onChangeSelectedKey={(e) => handleSelectChange(chargeKey, BUFF.CHARGE, e.target.value)}
                                filteredBuffList={filteredBuffList}
                            />
                        </tr>
                        <tr className="sp_only">
                            <td className="kind" colSpan="5">
                                アビリティ
                            </td>
                        </tr>
                        <tr>
                            <td className="kind pc_only" rowSpan="4">
                                アビリティ
                            </td>
                            <td>攻撃者</td>
                            <td className="text-left" colSpan="4">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={0} />
                            </td>
                        </tr>
                        <tr>
                            <td>前衛</td>
                            <td className="text-left" colSpan="4">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={1} />
                            </td>
                        </tr>
                        <tr>
                            <td>後衛</td>
                            <td className="text-left" colSpan="4">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={2} />
                            </td>
                        </tr>
                        <tr>
                            <td>全体</td>
                            <td className="text-left" colSpan="4">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={3} />
                            </td>
                        </tr>
                        <tr className="sp_only">
                            <td className="kind" colSpan="5">
                                パッシブ
                            </td>
                        </tr>
                        <tr>
                            <td className="kind pc_only">パッシブ</td>
                            <td className="text-left" colSpan="5" id="skill_passive">
                                <PassiveCheckbox attackInfo={attackInfo} passiveList={passiveList} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-1 mx-auto text-left">
                <div className="font-bold">＜＜注意事項＞＞</div>
                <ul>
                    <li>・闘志/厄/ハッキングは、バフ/デバフ効果量に影響を与えません。</li>
                    <li>・士気は、バフ/デバフ効果量に影響します。</li>
                    <li>
                        ・バフ強化/デバフ強化/桜花の矢によるデバフ強化は、「強化」ボタンで設定してください。
                    </li>
                    <li>
                        ・現在、自動選択、一括選択において単独発動バフが効果量に関わらず優先度が高く表示されています。
                    </li>
                </ul>
                <div className="mx-auto text-right">
                    <a
                        className="text-blue-500 underline"
                        href="https://marshmallow-qa.com/ldboixq5xyndo94">
                        不具合/要望受付フォーム
                    </a>
                </div>
            </div>
        </div >
    )
};
