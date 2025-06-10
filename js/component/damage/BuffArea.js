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

const BuffArea = ({ attackInfo, state, dispatch,
    selectBuffKeyMap, setSelectBuffKeyMap, buffKeyList, 
    buffSettingMap, setBuffSettingMap,
    attackUpBuffs, defDownBuffs, criticalBuffs }) => {

    const { styleList } = useStyleList();
    const [checkUpdate, setCheckUpdate] = React.useState(true);

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
                (BUFF_KBN[buff.buff_kind]) &&
                (buff.buff_id != 2607 || member_info.style_info.style_id === 145) // 月光(歌姫の加護)
            );

            const newStyleBuffList = JSON.parse(JSON.stringify(styleBuffList));
            newStyleBuffList.forEach(buff => {
                buff.key = `${buff.buff_id}-${charaId}`;
                buff.member_info = member_info;
                buff.chara_name = charaName;
                buff.use_chara_id = charaId;
            });

            buffList.push(...newStyleBuffList);

            const createFieldBuff = (key, skillName, fieldElement, effectSize) => {
                let fieldBuff = {
                    key: key,
                    use_chara_id: charaId,
                    buff_kind: BUFF.FIELD,
                    buff_name: skillName,
                    buff_element: fieldElement,
                    buff_id: key,
                    chara_name: charaName,
                    max_power: effectSize,
                    max_lv: 1,
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
    }, [attackInfo, state.enemy_info, styleList]);


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

    const getBuffKindEffectSize = (buffKind) => {
        const totalEffectSize = Object.keys(selectBuffKeyMap)
            .filter((buffKey) => buffKey.startsWith(`${BUFF_KBN[buffKind]}-${buffKind}`))
            .reduce((sum, buffKey) => {
                const buff = buffSettingMap[selectBuffKeyMap[buffKey]];
                return sum + (buff ? buff.effect_size : 0);
            }, 0);
        return totalEffectSize;
    }

    const handleSelectChange = (buffKey, newSelect) => {
        setSelectBuffKeyMap(prev => ({ ...prev, [buffKey]: newSelect }));
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
                ...kindBuffList,
                ...kindBuffList.filter(buffInfo =>
                    !(isAloneActivation(buffInfo) || isOnlyBuff(attackInfo, buffInfo) || isOnlyUse(attackInfo, buffInfo))
                ),
            ];
            handleSelectChange(buffKey, getBestBuffKeys(buffKind, buffItemList, buffSettingMap));
        })
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
            const bestKeys = getBestBuffKeys(buffKind, buffItemList, buffSettingMap);
            handleSelectChange(buffKey, bestKeys);
        });
        closeModal();
    };

    let resistDownEffectSize = getBuffKindEffectSize(BUFF.RESISTDOWN);
    React.useEffect(() => {
        if (attackInfo) {
            dispatch({ type: "SET_RRGIST_DOWN", element: attackInfo.attack_element, value: resistDownEffectSize });
        }
    }, [state.enemy_info, attackInfo, resistDownEffectSize]);

    React.useEffect(() => {
        if (checkUpdate) {
            setSelectBuffKeyMap(buffKeyList);
            if (attackInfo) {
                selectBestBuff();
            }
        }
    }, [buffSettingMap, attackInfo]);

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
                <table>
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
                        {attackUpBuffs.map((buff, index) => {
                            const buffKey = `${BUFF_KBN[buff.kind]}-${buff.kind}`
                            return (
                                <BuffField key={buffKey}
                                    index={index}
                                    rowSpan={attackUpBuffs.length * 2}
                                    buffName={buff.name}
                                    buffKey={buffKey}
                                    attackInfo={attackInfo}
                                    buffList={buffList}
                                    buffKind={buff.kind}
                                    buffSettingMap={buffSettingMap}
                                    handleChangeSkillLv={handleChangeSkillLv}
                                    selectedKey={selectBuffKeyMap[buffKey] || ""}
                                    handleSelectChange={handleSelectChange}
                                />
                            )
                        })}
                        <tr className="sp_only">
                            <td className="kind" colSpan="4">
                                デバフ
                            </td>
                        </tr>
                        {defDownBuffs.map((buff, index) => {
                            const buffKey = `${BUFF_KBN[buff.kind]}-${buff.kind}`
                            return (
                                <BuffField key={buffKey}
                                    index={index}
                                    rowSpan={defDownBuffs.length * 2}
                                    buffName={buff.name}
                                    buffKey={buffKey}
                                    attackInfo={attackInfo}
                                    buffList={buffList}
                                    buffKind={buff.kind}
                                    buffSettingMap={buffSettingMap}
                                    handleChangeSkillLv={handleChangeSkillLv}
                                    selectedKey={selectBuffKeyMap[buffKey] || ""}
                                    handleSelectChange={handleSelectChange}
                                />
                            )
                        })}
                        <tr className="sp_only">
                            <td className="kind" colSpan="4">
                                クリティカル
                            </td>
                        </tr>
                        {criticalBuffs.map((buff, index) => {
                            const buffKey = `${BUFF_KBN[buff.kind]}-${buff.kind}`
                            return (
                                <BuffField key={buffKey}
                                    index={index}
                                    rowSpan={criticalBuffs.length * 2}
                                    buffName={buff.name}
                                    buffKey={buffKey}
                                    attackInfo={attackInfo}
                                    buffList={buffList}
                                    buffKind={buff.kind}
                                    buffSettingMap={buffSettingMap}
                                    handleChangeSkillLv={handleChangeSkillLv}
                                    selectedKey={selectBuffKeyMap[buffKey] || ""}
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
                    </tbody>
                </table>
                <table>
                    <colgroup>
                        <col className="title_column pc_only" />
                        <col className="type1_column" />
                    </colgroup>
                    <tbody>
                        <tr className="sp_only">
                            <td className="kind" colSpan="3">
                                アビリティ
                            </td>
                        </tr>
                        <tr>
                            <td className="kind pc_only" rowSpan="4">
                                アビリティ
                            </td>
                            <td>攻撃者</td>
                            <td className="text-left">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={0} />
                            </td>
                        </tr>
                        <tr>
                            <td>前衛</td>
                            <td className="text-left">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={1} />
                            </td>
                        </tr>
                        <tr>
                            <td>後衛</td>
                            <td className="text-left">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={2} />
                            </td>
                        </tr>
                        <tr>
                            <td>全体</td>
                            <td className="text-left">
                                <AbilityCheckbox attackInfo={attackInfo} abilityList={abilityList} rengeArea={3} />
                            </td>
                        </tr>
                        <tr className="sp_only">
                            <td className="kind" colSpan="3">
                                パッシブ
                            </td>
                        </tr>
                        <tr>
                            <td className="kind pc_only">パッシブ</td>
                            <td className="text-left" colSpan="2" id="skill_passive">
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
