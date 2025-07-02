
const BUFF_KBN = {
    0: "power_up",
    1: "element_up",
    2: "mindeye",
    3: "defense_down",
    4: "element_down",
    5: "fragile",
    6: "critical_rate_up",
    7: "critical_damege",
    8: "critical_element",
    9: "critical_damege_element",
    10: "charge",
    11: "field",
    12: "destruction_rete_up",
    14: "fightingspirit",
    15: "misfortune",
    16: "funnel",
    18: "strong_break",
    19: "dp_defense_down",
    20: "resist_down",
    21: "permanent_defense_down",
    22: "permanent_element_down",
    30: "arrow_cherry_blossoms",
    31: "eternal_ourh",
    33: "babied",
    39: "servant",
    41: "shadow_clone",
};

const TARGET_KIND = [
    EFFECT.ATTACKUP, // 攻撃力アップ
    EFFECT.DAMAGERATEUP, // 破壊率上昇
    EFFECT.CRITICALRATEUP, // クリティカル率アップ
    EFFECT.FIELD_DEPLOYMENT, // フィールド展開
    EFFECT.STATUSUP_VALUE, // 能力固定上昇
    EFFECT.STATUSUP_RATE, // 能力%上昇
    EFFECT.FIELD_STRENGTHEN, // フィールド強化
    EFFECT.GIVEATTACKBUFFUP, // 攻撃力バフ強化
    EFFECT.GIVEDEFFENCEDEBUFFUP, // 防御力デバフ強化
    EFFECT.HIGH_BOOST, // ハイブースト状態
]
const SUB_TARGET_KIND = [
    EFFECT.FIELD_DEPLOYMENT, // フィールド展開
    EFFECT.STATUSUP_VALUE, // 能力固定上昇
    EFFECT.STATUSUP_RATE, // 能力%上昇
    EFFECT.FIELD_STRENGTHEN, // フィールド強化
    EFFECT.GIVEATTACKBUFFUP, // 攻撃力バフ強化
    EFFECT.GIVEDEFFENCEDEBUFFUP, // 防御力デバフ強化
]

const filedKey = `field-${BUFF.FIELD}`
const chargeKey = `charge-${BUFF.CHARGE}`

const BuffArea = ({ attackInfo, state, dispatch,
    selectBuffKeyMap, setSelectBuffKeyMap,
    buffSettingMap, setBuffSettingMap,
    abilitySettingMap, setAbilitySettingMap,
    passiveSettingMap, setPassiveSettingMap }) => {

    const { styleList } = useStyleList();
    const [checkUpdate, setCheckUpdate] = React.useState(true);

    let attackCharaId = attackInfo?.chara_id;

    const { buffList, abilityList, passiveList } = React.useMemo(() => {
        let buffList = [];
        let abilityList = [];
        let passiveList = [];

        styleList.selectStyleList.filter(memberInfo => memberInfo && memberInfo.is_select).forEach(member_info => {
            const charaId = member_info.style_info.chara_id;
            const styleId = member_info.style_info.style_id;
            const charaName = getCharaData(charaId).chara_short_name;
            const styleBuffList = skill_buff.filter(buff =>
                (buff.chara_id === charaId || buff.chara_id === 0) &&
                (buff.style_id === member_info.style_info.style_id || buff.style_id === 0) &&
                (BUFF_KBN[buff.buff_kind])
            ).filter(buff => {
                switch (buff.buff_id) {
                    case BUFF_ID_MOON_LIGHT: // 月光(歌姫の加護)
                        return (member_info.style_info.style_id === STYLE_ID_ONLY_MONN_LIGHT);
                    case BUFF_ID_MEGA_DESTROYER5: // メガデストロイヤー(5人以上)
                        return (attackInfo?.servant_count >= 5);
                    case BUFF_ID_MEGA_DESTROYER6: // メガデストロイヤー(6人以上)
                        return (attackInfo?.servant_count === 6);
                    default:
                        return true;
                }
            });

            const newStyleBuffList = JSON.parse(JSON.stringify(styleBuffList));
            newStyleBuffList.forEach(buff => {
                buff.key = `buff_${buff.buff_id}_${charaId}`;
                buff.member_info = member_info;
                buff.chara_name = charaName;
                buff.use_chara_id = charaId;
                buff.kbn = "buff";
            });
            buffList.push(...newStyleBuffList);

            const addBuffAbility = (kbn, skillId, charaId, skillName, buffKind, fieldElement, effectSize) => {
                buffList.push({
                    key: `${kbn}_${skillId}_${charaId}`,
                    skill_id: skillId,
                    use_chara_id: charaId,
                    buff_kind: buffKind,
                    buff_name: skillName,
                    buff_element: fieldElement,
                    chara_name: charaName,
                    max_power: effectSize,
                    max_lv: 1,
                    kbn: kbn
                });
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
                styleAbility["00"] = ABILITY_ID_ADMIRAL_COMMON;
            }
            Object.keys(styleAbility).forEach(key => {
                let abilityId = styleAbility[key];
                if (!abilityId || abilityId > 1000 || Number(key) > member_info.limit_count) {
                    // 1000番以降は不要
                    return;
                }
                if (!attackInfo) {
                    return;
                }
                // if (!is_select && ability_info.range_area != RANGE_FIELD) {
                //     // 他部隊のアビリティはフィールドのみ許可
                //     return;
                // }

                let abilityInfo = getAbilityInfo(abilityId);

                const effectTypeToBuffMap = {
                    [EFFECT.FIELD]: BUFF.FIELD,
                    [EFFECT.CHARGE]: BUFF.CHARGE,
                    [EFFECT.SHADOW_CLONE]: BUFF.SHADOW_CLONE,
                    [EFFECT.YAMAWAKI_SERVANT]: BUFF.YAMAWAKI_SERVANT,
                };

                if (abilityInfo.range_area == RANGE.SELF && charaId !== attackCharaId) {
                    return;
                }
                if (abilityInfo.element !== 0 && abilityInfo.element !== attackInfo.attack_element) {
                    return;
                }
                if (abilityInfo.physical !== 0 && abilityInfo.physical !== attackInfo.attack_physical) {
                    return;
                }

                const buffType = effectTypeToBuffMap[abilityInfo.effect_type];
                if (buffType) {
                    addBuffAbility(
                        "ability", abilityId, charaId, abilityInfo.ability_name, buffType,
                        abilityInfo.element, abilityInfo.effect_size);
                    return;
                }

                const newAbility = JSON.parse(JSON.stringify(abilityInfo));
                newAbility.key = `${abilityId}_${charaId}`;
                newAbility.limit_count = limitCount;
                newAbility.limit_border = Number(key);
                newAbility.chara_id = charaId;
                newAbility.chara_name = charaName;
                abilityList.push(newAbility)
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
                    addBuffAbility(
                        "passive", passive.skill_id, charaId, passive.passive_name, BUFF.FIELD, 0, passive.effect_size);
                } else {
                    passive.key = `${passive.skill_id}_${charaId}`;
                    passive.member_info = member_info;
                    passive.chara_id = charaId;
                    passive.chara_name = charaName;
                    passiveList.push(passive);
                }
            });
        });
        return { buffList, abilityList, passiveList };
    }, [attackInfo, state.enemy_info, styleList]);

    const refBuffSettingMap = React.useRef(buffSettingMap); // 初期化済みフラグ
    // バフ初期化
    React.useEffect(() => {
        const initialMap = {};
        buffList.forEach(buff => {
            initialMap[buff.key] = {
                buff_id: buff.buff_id,
                skill_lv: buff.max_lv,
                effect_size: getEffectSize(buff, buff.max_lv, state, abilitySettingMap, passiveSettingMap, buff.kbn),
            };
        });
        setBuffSettingMap(initialMap);
        refBuffSettingMap.current = initialMap;
    }, [buffList]);

    // バフ効果量更新
    React.useEffect(() => {
        const updateMap = { ...refBuffSettingMap.current };
        buffList.forEach(buff => {
            const key = buff.key;
            const buffSetting = updateMap[key];
            if (buff && buffSetting) {
                updateMap[key].effect_size = getEffectSize(buff, buffSetting.skill_lv, state, abilitySettingMap, passiveSettingMap, buff.kbn);
            }
        })
        setBuffSettingMap(updateMap);
        refBuffSettingMap.current = updateMap;
    }, [state.hard.tearsOfDreams, abilitySettingMap, passiveSettingMap, passiveList]);

    React.useEffect(() => {
        const initialMap = {};
        abilityList.forEach(ability => {
            const key = `${ability.ability_id}-${ability.chara_id}`
            let checked = true;
            let disabled = !ability.conditions;
            let limit_border = ability.limit_border;
            let limit_count = ability.limit_count
            switch (ability.range_area) {
                case RANGE.SELF:	// 自分
                    disabled = limit_count < limit_border || (ability.chara_id === attackCharaId && disabled);
                    checked = limit_count >= limit_border && ability.chara_id === attackCharaId;
                    break
                case RANGE.ALLY_FRONT:	// 味方前衛
                case RANGE.ALLY_BACK:	// 味方後衛
                    // 前衛または後衛かつ、本人以外
                    if ((ability.activation_place == 1 || ability.activation_place == 2) && !ability.chara_id !== attackCharaId || !disabled) {
                        disabled = false;
                    } else {
                        disabled = true;
                    }
                    checked = limit_count >= limit_border && ability.chara_id === attackCharaId;
                    break
                case RANGE.ALLY_ALL:	// 味方全体
                case RANGE.ENEMY_ALL:	// 敵全体
                case RANGE.OTHER:	    // その他
                    // 前衛または後衛かつ、本人以外
                    if ((ability.activation_place == 1 || ability.activation_place == 2) && ability.chara_id !== attackCharaId || !disabled) {
                        disabled = false;
                    } else {
                        disabled = true;
                    }
                    if (limit_count < limit_border) {
                        disabled = true;
                        checked = false;
                    }
                    break;
            }
            initialMap[key] = {
                key: key,
                ability_id: ability.ability_id,
                chara_id: ability.chara_id,
                checked: checked,
                disabled: disabled,
                name: ability.chara_name,
            }
        });
        setAbilitySettingMap(initialMap);
    }, [abilityList]);

    React.useEffect(() => {
        const initialMap = {};
        passiveList.forEach(passive => {
            const key = passive.key;
            initialMap[key] = {
                key: passive.key,
                skill_id: passive.skill_id,
                chara_id: passive.chara_id,
                name: passive.chara_name,
                checked: true,
            }
        });
        setPassiveSettingMap(initialMap);
    }, [passiveList]);

    let isElement = false;
    let isWeak = false;
    if (attackInfo) {
        isElement = attackInfo.attack_element;
        const [physicalResist, elementResist] = getEnemyResist(attackInfo, state);
        isWeak = physicalResist * elementResist > 10000;
    }
    let isDp = Number(state.dpRate[0]) !== 0;

    const attackUpBuffs = getAttackUpBuffs(isElement, isWeak, attackInfo, styleList.selectStyleList);
    const defDownBuffs = getDefenseDownBuffs(isElement, isWeak, isDp);
    const criticalBuffs = getCriticalBuffs(isElement);

    let buffKeyList = {};
    attackUpBuffs.forEach(buff => {
        buffKeyList[getBuffKey(buff.kind)] = [];
    });
    defDownBuffs.forEach(buff => {
        buffKeyList[getBuffKey(buff.kind)] = [];
    });
    criticalBuffs.forEach(buff => {
        buffKeyList[getBuffKey(buff.kind)] = [];
    });
    buffKeyList[filedKey] = [];
    buffKeyList[chargeKey] = [];

    const handleChangeSkillLv = (buffKey, lv, index) => {
        let buff = buffList.filter(buff => buff.key === buffKey[index])[0];
        const newSetting = buffSettingMap[buffKey[index]]
        newSetting.skill_lv = lv;
        newSetting.effect_size = getEffectSize(buff, lv, state, abilitySettingMap, passiveSettingMap);
        setBuffSettingMap(prev => ({
            ...prev,
            [buffKey]: newSetting
        }));
    };

    const handleSelectChange = (buffKey, newSelect) => {
        setSelectBuffKeyMap(prev => ({ ...prev, [buffKey]: newSelect }));
    };

    const handleAbilityChange = (e, key) => {
        const newAbilitySettingMap = { ...abilitySettingMap };
        newAbilitySettingMap[key].checked = e.target.checked;
        setAbilitySettingMap(newAbilitySettingMap);

        // buffList.forEach(buff => {
        //     const buffKey = buff.key
        //     const newSetting = buffSettingMap[buffKey]
        //     newSetting.effect_size = getEffectSize(buff, newSetting.skill_lv, state, abilitySettingMap, passiveSettingMap);
        //     setBuffSettingMap(prev => ({
        //         ...prev,
        //         [buffKey]: newSetting
        //     }));
        // })
    };

    const handlePassiveChange = (e, key) => {
        const newPassiveSettingMap = { ...passiveSettingMap };
        newPassiveSettingMap[key].checked = e.target.checked;
        setPassiveSettingMap(newPassiveSettingMap);

        let skillId = newPassiveSettingMap[key].skill_id;
        let passiveInfo = getPassiveInfo(skillId);
        let targetCharaList = [];
        switch (passiveInfo.range_area) {
            case RANGE.SELF:
                targetCharaList.push(passiveInfo.use_chara_id);
                break;
            case RANGE.MEMBER_31C:
                targetCharaList = CHARA_ID.MEMBER_31C;
                break;
            case RANGE.MEMBER_31E:
                targetCharaList = CHARA_ID.MEMBER_31E;
                break;
            case RANGE.MARUYAMA_MEMBER:
                targetCharaList = CHARA_ID.MEMBER_31E;
                break;
            case RANGE.RUKA_SHARO:
                targetCharaList = CHARA_ID.RUKA_SHARO;
                break;
        }

        buffList.filter(buff => targetCharaList.includes(buff.chara_id)).forEach(buff => {
            const buffKey = buff.key
            const newSetting = buffSettingMap[buffKey]
            newSetting.effect_size = getEffectSize(buff, newSetting.skill_lv, state, abilitySettingMap, passiveSettingMap);
            setBuffSettingMap(prev => ({
                ...prev,
                [buffKey]: newSetting
            }));
        })
    };

    // 全て外す
    const selectNoneBuff = () => {
        Object.keys(selectBuffKeyMap).forEach((buffKey) => {
            handleSelectChange(buffKey, []);
        })
    }

    // 上から2番目のbuffを子にセット
    const selectBestBuff = () => {
        Object.keys(buffKeyList).forEach((buffKey) => {
            let buffKind = Number(buffKey.split('-')[1]);
            let kindBuffList = filteredBuffList(buffList, buffKind, attackInfo, false);
            const buffItemList = [
                ...kindBuffList.filter(buffInfo =>
                    !(isOnlyUse(attackInfo, buffInfo))
                ),
                ...kindBuffList.filter(buffInfo =>
                    !(isAloneActivation(buffInfo) || isOnlyBuff(attackInfo, buffInfo) || isOnlyUse(attackInfo, buffInfo))
                ),
            ];
            handleSelectChange(buffKey, getBestBuffKeys(buffKind, buffItemList, refBuffSettingMap.current));
        })
    }

    // 選択内から最良を設定
    const setBestBuff = (buffKey, buffKind, buffItemList) => {
        const bestKeys = getBestBuffKeys(buffKind, buffItemList, buffSettingMap);
        handleSelectChange(buffKey, bestKeys);
    }

    // バフ一括設定
    const setMultiBuff = (settingBuffList) => {
        Object.keys(buffKeyList).forEach(buffKey => {
            const buffKind = Number(buffKey.split('-')[1]);
            const buffItemList = Object.entries(settingBuffList).flatMap(([key, count]) => {
                if (count === 0) return [];
                const [skillId, charaId] = key.split('-').map(Number);
                const matchedBuffs = buffList.filter(buffInfo =>
                    buffInfo.buff_kind === buffKind &&
                    buffInfo.skill_id === skillId &&
                    buffInfo.use_chara_id === charaId
                );
                // countが1なら1回、2なら2回追加（同じ要素を重複追加）
                return Array(count).fill(matchedBuffs).flat();
            });
            setBestBuff(buffKey, buffKind, buffItemList)
        });
        closeModal();
    };

    let resistDownEffectSize = getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.RESISTDOWN])
    React.useEffect(() => {
        if (attackInfo) {
            dispatch({ type: "SET_RRGIST_DOWN", element: attackInfo.attack_element, value: resistDownEffectSize });
        }
    }, [state.enemy_info, attackInfo?.attack_id, resistDownEffectSize]);

    let selectList = styleList.selectStyleList.map(style =>
        style?.style_info.style_id,
    ).join(',');
    React.useEffect(() => {
        if (checkUpdate) {
            setSelectBuffKeyMap(buffKeyList);
            if (attackInfo) {
                selectBestBuff();
            }
        }
    }, [selectList, attackInfo?.attack_id, state.enemy_info]);

    React.useEffect(() => {
        // 山脇様のしもべ変更
        if (checkUpdate) {
            let funnel = buffList.filter(buff => buff.buff_kind == BUFF.FUNNEL)
            setBestBuff(getBuffKey(BUFF.FUNNEL), BUFF.FUNNEL, funnel);
        }
    }, [attackInfo?.servant_count]);

    const [modal, setModal] = React.useState({
        isOpen: false,
        mode: ""
    });
    const openModal = (mode) => setModal({ isOpen: true });
    const closeModal = () => setModal({ isOpen: false, mode: "" });

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
                        onClick={openModal}
                        type="button"
                    />
                </div>
                <div className="flex items-center">
                    <input id="auto_skill" type="checkbox" checked={checkUpdate} onChange={(e) => setCheckUpdate(e.target.checked)} />
                    <label className="checkbox01 ml-2" htmlFor="auto_skill">
                        スタイル/攻撃スキル/敵選択時に最適スキルを自動選択する
                    </label>
                </div>
            </div>
            <div className="text-center">
                <table className="buff_table">
                    <colgroup>
                        <col className="title_column pc_only" />
                        <col className="type_column" />
                        <col className="skill_name_column" />
                        <col className="reinforce_column" />
                        <col className="skill_lv_column" />
                    </colgroup>
                    <tbody>
                        <tr className="sp_only">
                            <td className="kind" colSpan="4">
                                バフ
                            </td>
                        </tr>
                        {attackUpBuffs.map((buffDef, index) => {
                            const buffKey = `${BUFF_KBN[buffDef.kind]}-${buffDef.kind}`
                            const totalRowCount = attackUpBuffs.reduce((sum, buff) => {
                                return sum + (buff.overlap ? 2 : 1);
                            }, 0);
                            return (
                                <BuffField key={buffKey}
                                    index={index}
                                    buffDef={buffDef}
                                    rowSpan={totalRowCount}
                                    buffKey={buffKey}
                                    attackInfo={attackInfo}
                                    buffList={buffList}
                                    buffSettingMap={buffSettingMap}
                                    handleChangeSkillLv={handleChangeSkillLv}
                                    selectedKey={selectBuffKeyMap[buffKey] || []}
                                    handleSelectChange={handleSelectChange}
                                />
                            )
                        })}
                        <tr className="sp_only">
                            <td className="kind" colSpan="4">
                                デバフ
                            </td>
                        </tr>
                        {defDownBuffs.map((buffDef, index) => {
                            const buffKey = `${BUFF_KBN[buffDef.kind]}-${buffDef.kind}`
                            return (
                                <BuffField key={buffKey}
                                    index={index}
                                    rowSpan={defDownBuffs.length * 2}
                                    buffDef={buffDef}
                                    buffKey={buffKey}
                                    attackInfo={attackInfo}
                                    buffList={buffList}
                                    buffSettingMap={buffSettingMap}
                                    handleChangeSkillLv={handleChangeSkillLv}
                                    selectedKey={selectBuffKeyMap[buffKey] || []}
                                    handleSelectChange={handleSelectChange}
                                />
                            )
                        })}
                        <tr className="sp_only">
                            <td className="kind" colSpan="4">
                                クリティカル
                            </td>
                        </tr>
                        {criticalBuffs.map((buffDef, index) => {
                            const buffKey = `${BUFF_KBN[buffDef.kind]}-${buffDef.kind}`
                            return (
                                <BuffField key={buffKey}
                                    index={index}
                                    rowSpan={criticalBuffs.length * 2}
                                    buffDef={buffDef}
                                    buffKey={buffKey}
                                    attackInfo={attackInfo}
                                    buffList={buffList}
                                    buffSettingMap={buffSettingMap}
                                    handleChangeSkillLv={handleChangeSkillLv}
                                    selectedKey={selectBuffKeyMap[buffKey] || []}
                                    handleSelectChange={handleSelectChange}
                                />
                            )
                        })}
                        <tr className="sp_only">
                            <td className="kind" colSpan="4">
                                フィールド
                            </td>
                        </tr>
                        <tr>
                            <td className="kind pc_only">フィールド</td>
                            <td className="type">
                                フィールド
                            </td>
                            <BuffSelect
                                attackInfo={attackInfo}
                                buffList={buffList}
                                buffKind={BUFF.FIELD}
                                buffKey={filedKey}
                                buffSettingMap={buffSettingMap}
                                handleChangeSkillLv={handleChangeSkillLv}
                                selectedKey={selectBuffKeyMap[filedKey] || ""}
                                index={0}
                                handleSelectChange={handleSelectChange}
                            />
                        </tr>
                        <tr className="sp_only">
                            <td className="kind" colSpan="4">
                                チャージ
                            </td>
                        </tr>
                        <tr>
                            <td className="kind pc_only">チャージ</td>
                            <td className="type">
                                チャージ
                            </td>
                            <BuffSelect
                                attackInfo={attackInfo}
                                buffList={buffList}
                                buffKind={BUFF.CHARGE}
                                buffKey={chargeKey}
                                buffSettingMap={buffSettingMap}
                                handleChangeSkillLv={handleChangeSkillLv}
                                selectedKey={selectBuffKeyMap[chargeKey] || ""}
                                index={0}
                                handleSelectChange={handleSelectChange}
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
                            <td className="text-left" colSpan="3">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={0}
                                    abilitySettingMap={abilitySettingMap} handleAbilityChange={handleAbilityChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>前衛</td>
                            <td className="text-left" colSpan="3">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={1}
                                    abilitySettingMap={abilitySettingMap} handleAbilityChange={handleAbilityChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>後衛</td>
                            <td className="text-left" colSpan="3">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={2}
                                    abilitySettingMap={abilitySettingMap} handleAbilityChange={handleAbilityChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>全体</td>
                            <td className="text-left" colSpan="3">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={3}
                                    abilitySettingMap={abilitySettingMap} handleAbilityChange={handleAbilityChange} />
                            </td>
                        </tr>
                        <tr className="sp_only">
                            <td className="kind" colSpan="5">
                                パッシブ
                            </td>
                        </tr>
                        <tr>
                            <td className="kind pc_only">パッシブ</td>
                            <td className="text-left" colSpan="4" id="skill_passive">
                                <PassiveCheckbox passiveList={passiveList}
                                    passiveSettingMap={passiveSettingMap} handlePassiveChange={handlePassiveChange} />
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
                </ul>
                <div className="mx-auto text-right">
                    <a
                        className="text-blue-500 underline"
                        href="https://marshmallow-qa.com/ldboixq5xyndo94">
                        不具合/要望受付フォーム
                    </a>
                </div>
            </div>
            <ReactModal
                isOpen={modal.isOpen}
                onRequestClose={closeModal}
                className={"modal-content " + (modal.isOpen ? "modal-content-open" : "")}
                overlayClassName={"modal-overlay " + (modal.isOpen ? "modal-overlay-open" : "")}
            >
                <BuffBulkSetting buffList={buffList} attackInfo={attackInfo} setMultiBuff={setMultiBuff} />
            </ReactModal>
        </div >
    )
};

const getAttackUpBuffs = function (isElement, isWeak, attackInfo, selectStyleList) {
    const isShadowClone = CHARA_ID_SHADOW_CLONE.includes(attackInfo?.chara_id);
    const isWedingSharo = selectStyleList.some(
        (member_info) => member_info?.style_info.style_id === STYLE_ID_WEDING_SHARO
    );
    const isRisa = selectStyleList.some(
        (member_info) => member_info?.style_info.chara_id === CHARA_ID_BABIED
    );
    const isServant = STYLE_ID_SERVANT.includes(attackInfo?.style_id) || selectStyleList.some(
        (member_info) => member_info?.style_info.style_id === STYLE_ID_UNISON_BUNGO
    );
    return [
        { name: "攻撃力UP", kind: BUFF.ATTACKUP, overlap: true },
        ...(isElement ? [{ name: "属性攻撃力UP", kind: BUFF.ELEMENT_ATTACKUP, overlap: true },] : []),
        ...(isShadowClone ? [{ name: "影分身", kind: BUFF.SHADOW_CLONE, overlap: false },] : []),
        ...(isWedingSharo ? [{ name: "永遠なる誓い", kind: BUFF.ETERNAL_OARH, overlap: false },] : []),
        ...(isRisa ? [{ name: "オギャり", kind: BUFF.BABIED, overlap: false },] : []),
        ...(isWeak ? [{ name: "心眼", kind: BUFF.MINDEYE, overlap: true },] : []),
        ...(isWeak && isServant ? [{ name: "山脇様のしもべ ", kind: BUFF.YAMAWAKI_SERVANT, overlap: false },] : []),
        { name: "連撃", kind: BUFF.FUNNEL, overlap: true },
        { name: "破壊率UP", kind: BUFF.DAMAGERATEUP, overlap: true },
    ];
}

const getDefenseDownBuffs = function (isElement, isWeak, isDp) {
    return [
        { name: "防御力DOWN", kind: BUFF.DEFENSEDOWN, overlap: true },
        ...(isDp ? [{ name: "DP防御力DOWN", kind: BUFF.DEFENSEDP, overlap: true },] : []),
        ...(isElement ? [{ name: "属性防御力DOWN", kind: BUFF.ELEMENT_DEFENSEDOWN, overlap: true },] : []),
        { name: "防御力DOWN(永)", kind: BUFF.ETERNAL_DEFENSEDOWN, overlap: true },
        ...(isElement ? [{ name: "属性防御力DOWN(永)", kind: BUFF.ELEMENT_ETERNAL_DEFENSEDOWN, overlap: true },] : []),
        ...(isWeak ? [{ name: "脆弱", kind: BUFF.FRAGILE, overlap: true },] : []),
        ...(isElement ? [{ name: "耐性ダウン", kind: BUFF.RESISTDOWN, overlap: true },] : []),
    ];
}
const getCriticalBuffs = function (isElement) {
    return [
        { name: "クリティカル率UP", kind: BUFF.CRITICALRATEUP, overlap: true },
        { name: "クリダメUP", kind: BUFF.CRITICALDAMAGEUP, overlap: true },
        ...(isElement ? [
            { name: "属性クリ率UP", kind: BUFF.ELEMENT_CRITICALRATEUP, overlap: true },
            { name: "属性クリダメUP", kind: BUFF.ELEMENT_CRITICALDAMAGEUP, overlap: true },
        ] : []),
    ]
}