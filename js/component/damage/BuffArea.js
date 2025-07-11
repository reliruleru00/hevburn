
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

const TROOP_KBN = {
    MAIN: "1",
    SUB: "2",
}

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
    let selectList = styleList.selectStyleList.concat(styleList.subStyleList).map(style =>{
        return style?.styleInfo.style_id + style?.exclusionSkillList.map(skill => skill).join(',');
    }).join(',');

    const { buffList, abilityList, passiveList } = React.useMemo(() => {
        return generateBuffAbilityPassiveLists(styleList, attackInfo);
    }, [attackInfo, state.enemyInfo, selectList]);

    const refBuffSettingMap = React.useRef(buffSettingMap);
    const refAbilitySettingMap = React.useRef(abilitySettingMap);
    const refPassiveSettingMap = React.useRef(passiveSettingMap);

    // バフ初期化
    React.useEffect(() => {
        const initialMap = {};
        buffList.forEach(buff => {
            const memberInfo = getCharaIdToMember(styleList, buff.use_chara_id)
            initialMap[buff.key] = {
                buff_id: buff.buff_id,
                skill_lv: buff.max_lv,
                effect_size: getEffectSize(buff, buff.max_lv, memberInfo, state, abilitySettingMap, passiveSettingMap, buff.kbn),
            };
        });
        setBuffSettingMap(initialMap);
        refBuffSettingMap.current = initialMap;
    }, [buffList]);

    // アビリティ初期化   
    React.useEffect(() => {
        const initialMap = {};
        abilityList.forEach(ability => {
            const key = `${ability.ability_id}-${ability.chara_id}`
            let checked = true;
            let disabled = !ability.conditions;
            let limit_border = ability.limit_border;
            let memberInfo = getCharaIdToMember(styleList, ability.chara_id);
            let limitCount = memberInfo.limitCount;
            switch (ability.range_area) {
                case RANGE.SELF:	// 自分
                    disabled = limitCount < limit_border || (ability.chara_id === attackCharaId && disabled);
                    checked = limitCount >= limit_border && ability.chara_id === attackCharaId;
                    break
                case RANGE.ALLY_FRONT:	// 味方前衛
                case RANGE.ALLY_BACK:	// 味方後衛
                    // 前衛または後衛かつ、本人以外
                    if ((ability.activation_place == 1 || ability.activation_place == 2) && !ability.chara_id !== attackCharaId || !disabled) {
                        disabled = false;
                    } else {
                        disabled = true;
                    }
                    checked = limitCount >= limit_border && ability.chara_id === attackCharaId;
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
                    if (limitCount < limit_border) {
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
        refAbilitySettingMap.current = initialMap;
        setAbilitySettingMap(initialMap);
    }, [styleList, abilityList]);

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
        refPassiveSettingMap.current = initialMap;
        setPassiveSettingMap(initialMap);
    }, [passiveList]);

    // バフ効果量更新
    React.useEffect(() => {
        const updateMap = { ...refBuffSettingMap.current };
        const newAbilitySettingMap = { ...refAbilitySettingMap.current };
        const newPassiveSettingMap = { ...refPassiveSettingMap.current };
        buffList.forEach(buff => {
            const key = buff.key;
            const buffSetting = updateMap[key];
            const memberInfo = getCharaIdToMember(styleList, buff.use_chara_id)
            updateMap[key].effect_size = getEffectSize(buff, buffSetting.skill_lv, memberInfo, state, newAbilitySettingMap, newPassiveSettingMap, buff.kbn);
        })
        setBuffSettingMap(updateMap);
        refBuffSettingMap.current = updateMap;
    }, [styleList, state.hard.tearsOfDreams, abilitySettingMap, passiveSettingMap, passiveList]);

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
        const memberInfo = getCharaIdToMember(styleList, buff.use_chara_id)
        const newSetting = buffSettingMap[buffKey[index]]
        newSetting.skill_lv = lv;
        newSetting.effect_size = getEffectSize(buff, lv, memberInfo, state, abilitySettingMap, passiveSettingMap);
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
            const memberInfo = getCharaIdToMember(styleList, buff.use_chara_id)
            newSetting.effect_size = getEffectSize(buff, newSetting.skill_lv, memberInfo, state, abilitySettingMap, passiveSettingMap);
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
   
    // 存在しないバフの設定を外す
    const outNotExistBuff = () => {
        Object.keys(selectBuffKeyMap).forEach((buffKey) => {
            const selectedKeys = selectBuffKeyMap[buffKey].map(selectedKey => {
                if (refBuffSettingMap.current[selectedKey]) {
                    return selectedKey;
                } else {
                    return "";
                }
            })
            handleSelectChange(buffKey, selectedKeys);
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
    }, [state.enemyInfo, attackInfo?.attack_id, resistDownEffectSize]);

    React.useEffect(() => {
        if (checkUpdate) {
            setSelectBuffKeyMap(buffKeyList);
            if (attackInfo) {
                selectBestBuff();
            }
        } else {
            outNotExistBuff();
        }
    }, [selectList, attackInfo?.attack_id, state.enemyInfo]);

    React.useEffect(() => {
        // 山脇様のしもべ変更
        if (checkUpdate) {
            let funnel = buffList.filter(buff => buff.buff_kind == BUFF.FUNNEL)
            setBestBuff(getBuffKey(BUFF.FUNNEL), BUFF.FUNNEL, funnel);
        }
    }, [attackInfo?.servant_count]);

    const [modal, setModal] = React.useState({
        isOpen: false,
        mode: "",
        buffInfo: {}
    });
    const openModal = (mode, buffInfo) =>
        setModal({ isOpen: true, mode: mode, buffInfo: buffInfo }
        );
    const closeModal = () => setModal({ isOpen: false, mode: "" });

    return (
        <div className="buff_area text-right mx-auto">
            <div className="flex justify-between items-center w-full">
                <div className="ml-6">
                    <input
                        className="buff_btn"
                        defaultValue="全て外す"
                        type="button"
                        onClick={selectNoneBuff}
                    />
                    <input
                        className="buff_btn"
                        defaultValue="一括設定"
                        onClick={() => openModal("bulkSetting")}
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
                                    openModal={openModal}
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
                                    openModal={openModal}
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
                                    openModal={openModal}
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
                                openModal={openModal}
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
                                openModal={openModal}
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
                    <li>
                        ・バフ強化/デバフ強化/桜花の矢によるデバフ強化は、「詳細」ボタンで設定してください。
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
                {
                    modal.mode === "bulkSetting" && <BuffBulkSetting buffList={buffList} attackInfo={attackInfo} setMultiBuff={setMultiBuff} />
                }
                {
                    modal.mode === "buffDetail" &&
                    (
                        modal.buffInfo.kbn === "buff" ?
                            <BuffDetail buffInfo={modal.buffInfo} styleList={styleList} state={state}
                                buffSettingMap={buffSettingMap}
                                abilitySettingMap={abilitySettingMap} passiveSettingMap={passiveSettingMap} closeModal={closeModal} />
                            :
                            <AbilityDetail buffInfo={modal.buffInfo} closeModal={closeModal} />
                    )
                }
            </ReactModal>
        </div >
    )
};

// バフ、アビリティ、パッシブ作成
function generateBuffAbilityPassiveLists(styleList, attackInfo) {
    const buffList = [];
    const abilityList = [];
    const passiveList = [];
    addBuffAbilityPassiveLists(
        styleList, styleList.selectStyleList, attackInfo, buffList, abilityList, passiveList, TROOP_KBN.MAIN
    )

    addBuffAbilityPassiveLists(
        styleList, styleList.subStyleList, attackInfo, buffList, abilityList, passiveList, TROOP_KBN.SUB
    )
    return { buffList, abilityList, passiveList };
}

// バフ、アビリティ、パッシブ追加
function addBuffAbilityPassiveLists(styleList, targetStyleList, attackInfo, buffList, abilityList, passiveList, troopKbn) {
    let attackCharaId = attackInfo?.chara_id;

    targetStyleList
        .filter(memberInfo => memberInfo)
        .filter(memberInfo => !(troopKbn === TROOP_KBN.SUB && checkDuplicationChara(styleList.selectStyleList, memberInfo?.styleInfo.chara_id)))
        .forEach(memberInfo => {
            const charaId = memberInfo.styleInfo.chara_id;
            const styleId = memberInfo.styleInfo.style_id;
            const charaName = getCharaData(charaId).chara_short_name;

            const styleBuffList = skill_buff.filter(buff =>
                (buff.chara_id === charaId || buff.chara_id === 0) &&
                (buff.style_id === styleId || buff.style_id === 0) &&
                BUFF_KBN[buff.buff_kind]
            ).filter(buff => {
                switch (buff.buff_id) {
                    case BUFF_ID_MOON_LIGHT: // 月光(歌姫の加護)
                        return styleId === STYLE_ID_ONLY_MONN_LIGHT;
                    case BUFF_ID_MEGA_DESTROYER5: // メガデストロイヤー(5人以上)
                        return attackInfo?.servant_count >= 5;
                    case BUFF_ID_MEGA_DESTROYER6: // メガデストロイヤー(6人以上)
                        return attackInfo?.servant_count === 6;
                }
                // サブ部隊
                if (troopKbn === TROOP_KBN.SUB) {
                    return DEBUFF_LIST.includes(buff.buff_kind);
                }
                // 除外スキル
                if (memberInfo.exclusionSkillList.includes(buff.skill_id)) return false;
                return true;
            });

            const newStyleBuffList = JSON.parse(JSON.stringify(styleBuffList));
            newStyleBuffList.forEach(buff => {
                buff.key = `buff_${buff.buff_id}_${charaId}`;
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
            };

            let styleAbility = {
                "0": memberInfo.styleInfo.ability0,
                "00": memberInfo.styleInfo.ability00,
                "1": memberInfo.styleInfo.ability1,
                "3": memberInfo.styleInfo.ability3,
                "5": memberInfo.styleInfo.ability5,
                "10": memberInfo.styleInfo.ability10
            };
            if (memberInfo.styleInfo.role == ROLE.ADMIRAL) {
                styleAbility["00"] = ABILITY_ID_ADMIRAL_COMMON;
            }

            Object.keys(styleAbility).forEach(key => {
                const abilityId = styleAbility[key];
                // 1000番以降は不要
                if (!abilityId || abilityId > 1000 || !attackInfo) return;

                const abilityInfo = getAbilityInfo(abilityId);

                if (troopKbn === TROOP_KBN.SUB) {
                    // 他部隊のアビリティは一部のみ許可
                    if ([EFFECT.FIELD_DEPLOYMENT, EFFECT.FIELD_STRENGTHEN,
                    EFFECT.GIVEATTACKBUFFUP, EFFECT.GIVEDEFFENCEDEBUFFUP].includes(abilityInfo.effect_type)) {
                        return;
                    }
                }
                const buffTypeMap = {
                    [EFFECT.FIELD_DEPLOYMENT]: BUFF.FIELD,
                    [EFFECT.CHARGE]: BUFF.CHARGE,
                    [EFFECT.ARROWCHERRYBLOSSOMS]: BUFF.ARROWCHERRYBLOSSOMS,
                    [EFFECT.SHADOW_CLONE]: BUFF.SHADOW_CLONE,
                    [EFFECT.YAMAWAKI_SERVANT]: BUFF.YAMAWAKI_SERVANT,
                };

                if (abilityInfo.range_area === RANGE.SELF && charaId !== attackCharaId) return;
                if (abilityInfo.element !== 0 && abilityInfo.element !== attackInfo.attack_element) return;
                if (abilityInfo.physical !== 0 && abilityInfo.physical !== attackInfo.attack_physical) return;

                const buffType = buffTypeMap[abilityInfo.effect_type];
                if (buffType) {
                    addBuffAbility("ability", abilityId, charaId, abilityInfo.ability_name, buffType, abilityInfo.element, abilityInfo.effect_size);
                    return;
                }

                const newAbility = JSON.parse(JSON.stringify(abilityInfo));
                newAbility.key = `${abilityId}_${charaId}`;
                newAbility.limit_border = Number(key);
                newAbility.chara_id = charaId;
                newAbility.chara_name = charaName;
                abilityList.push(newAbility);
            });

            const stylePassiveList = skill_list.filter(obj =>
                obj.chara_id === charaId &&
                (obj.style_id === styleId || obj.style_id === 0) &&
                obj.skill_active === 1
            );

            stylePassiveList.forEach(skill => {
                const passive = getPassiveInfo(skill.skill_id);
                if (!passive || !TARGET_KIND.includes(passive.effect_type)) return;

                if (passive.range_area === RANGE.FIELD) {
                    addBuffAbility("passive", passive.skill_id, charaId, passive.passive_name, BUFF.FIELD, 0, passive.effect_size);
                } else {
                    passive.key = `${passive.skill_id}_${charaId}`;
                    passive.memberInfo = memberInfo;
                    passive.chara_id = charaId;
                    passive.chara_name = charaName;
                    passiveList.push(passive);
                }
            });
        });
}

const getAttackUpBuffs = function (isElement, isWeak, attackInfo, selectStyleList) {
    const isShadowClone = CHARA_ID_SHADOW_CLONE.includes(attackInfo?.chara_id);
    const isWedingSharo = selectStyleList.some(
        (memberInfo) => memberInfo?.styleInfo.style_id === STYLE_ID_WEDING_SHARO
    );
    const isRisa = selectStyleList.some(
        (memberInfo) => memberInfo?.styleInfo.chara_id === CHARA_ID_RISA
    );
    const isMiya = attackInfo?.chara_id === CHARA_ID_MIYA;
    const isServant = STYLE_ID_SERVANT.includes(attackInfo?.style_id) || selectStyleList.some(
        (memberInfo) => memberInfo?.styleInfo.style_id === STYLE_ID_UNISON_BUNGO
    );
    return [
        { name: "攻撃力UP", kind: BUFF.ATTACKUP, overlap: true },
        ...(isElement ? [{ name: "属性攻撃力UP", kind: BUFF.ELEMENT_ATTACKUP, overlap: true },] : []),
        ...(isShadowClone ? [{ name: "影分身", kind: BUFF.SHADOW_CLONE, overlap: false },] : []),
        ...(isMiya ? [{ name: "桜花の矢", kind: BUFF.ARROWCHERRYBLOSSOMS, overlap: false },] : []),
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

const getBuffEffectDisplay = (buffInfo, skillLv) => {
    let minPower;
    let maxPower;
    switch (buffInfo.buff_kind) {
        case BUFF.FUNNEL:
            let unit = buffInfo.effect_size;
            minPower = buffInfo.min_power;
            maxPower = buffInfo.max_power;
            if (minPower == maxPower) {
                return `${unit}%×${minPower}Hit`
            } else {
                return `${unit}%×${minPower}Hit～${maxPower}Hit`
            }
        default:
            minPower = buffInfo.min_power * (1 + 0.03 * (skillLv - 1));
            maxPower = buffInfo.max_power * (1 + 0.02 * (skillLv - 1));
            if (minPower == maxPower) {
                return `${minPower.toLocaleString()}%`
            } else {
                return `${minPower.toLocaleString()}%～${maxPower.toLocaleString()}%`
            }
    }
}

const BuffDetail = ({ buffInfo, styleList, state, buffSettingMap, abilitySettingMap, passiveSettingMap, closeModal }) => {
    const charaId = buffInfo.chara_id;
    const memberInfo = getCharaIdToMember(styleList, charaId);
    const enemyInfo = state.enemyInfo;
    const isDebuff = DEBUFF_LIST.includes(buffInfo.buff_kind);
    const isJewel = isDebuff || [BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP, BUFF.CRITICALRATEUP, BUFF.ELEMENT_CRITICALRATEUP].includes(buffInfo.buff_kind)

    let statUp = getStatUp(state, memberInfo, buffInfo.collect, abilitySettingMap, passiveSettingMap);
    let enemyStatDown = 0;
    let enemyStat = 0;
    if (isDebuff) {
        enemyStat = enemyInfo.enemy_stat;
        if (buffInfo.collect?.hacking) {
            enemyStatDown = 100;
        } else if (buffInfo.collect?.misfortune) {
            enemyStatDown = 20;
        }
    }

    let molecule = 0;
    let denominator = 0;
    if (buffInfo.ref_status_1 != 0) {
        molecule += (memberInfo[STATUS_KBN[buffInfo.ref_status_1]] + statUp) * 2;
        denominator += 2;
    }
    if (buffInfo.ref_status_2 != 0) {
        molecule += memberInfo[STATUS_KBN[buffInfo.ref_status_2]] + statUp;
        denominator += 1;
    }
    let status = molecule / denominator;

    const buffSeting = buffSettingMap[buffInfo.key];

    const jpnName = ["", "力", "器用さ", "体力", "精神", "知性", "運"];

    const effectTypeMap = new Map([
        [KIND_ATTACKUP, EFFECT.GIVEATTACKBUFFUP],
        [KIND_DEFENSEDOWN, EFFECT.GIVEDEFFENCEDEBUFFUP],
        [[BUFF.FIELD], EFFECT.FIELD_STRENGTHEN]
    ]);

    function getAbilityListByBuff(buffKind, charaId) {
        for (const [kindList, effectType] of effectTypeMap) {
            if (kindList.includes(buffKind)) {
                return Object.values(abilitySettingMap)
                    .filter(ability => ability.chara_id === charaId)
                    .filter(ability => {
                        const abilityInfo = getAbilityInfo(ability.ability_id);
                        return abilityInfo.effect_type === effectType;
                    });
            }
        }
        return [];
    }

    function getPassiveListByBuff(buffKind, charaId) {
        for (const [kindList, effectType] of effectTypeMap) {
            if (kindList.includes(buffKind)) {
                return Object.values(passiveSettingMap)
                    .filter(passive => passive.chara_id === charaId)
                    .filter(passive => {
                        const passiveInfo = getPassiveInfo(passive.skill_id);
                        return passiveInfo.effect_type === effectType;
                    });
            }
        }
        return [];
    }

    const abilityList = getAbilityListByBuff(buffInfo.buff_kind, charaId);
    const PassiveList = getPassiveListByBuff(buffInfo.buff_kind, charaId);
    return (
        <div className="modal__container container_damage">
            <div className="modal text-left w-[350px] mx-auto">
                <div>
                    <label className="damage_label">スキル詳細</label>
                    <button className="modal-close" onClick={closeModal}>&times;</button>
                </div>
                <div className="w-[350px] mx-auto grid grid-cols-2 text-center">
                    <span>スキル</span>
                    <span>{buffInfo.buff_name}</span>
                    <span>効果量</span>
                    <span>{getBuffEffectDisplay(buffInfo, buffSeting.skill_lv)}</span>
                    <div></div>
                    <span>(スキルLv{buffSeting.skill_lv})</span>
                    {buffInfo.ref_status_1 !== 0 && buffInfo.min_power != buffInfo.max_power &&
                        <>
                            <span>参照ステータス</span>
                            <span>
                                {buffInfo.ref_status_1 !== 0 ? <span className={`ref_status ${STATUS_KBN[buffInfo.ref_status_1]}`}>
                                    {jpnName[buffInfo.ref_status_1]}</span> : null}
                                {buffInfo.ref_status_1 !== 0 && buffInfo.ref_status_2 !== 0 ? <span className={`ref_status ${STATUS_KBN[buffInfo.ref_status_1]}`}>
                                    {jpnName[buffInfo.ref_status_1]}</span> : null}
                                {buffInfo.ref_status_2 !== 0 ? <span className={`ref_status ${STATUS_KBN[buffInfo.ref_status_2]}`}>
                                    {jpnName[buffInfo.ref_status_2]}</span> : null}
                            </span>
                        </>
                    }
                </div>
                {buffInfo.param_limit != 0 && buffInfo.min_power != buffInfo.max_power && (
                    <>
                        <div className="mt-2">
                            <label className="damage_label">ステータス情報</label>
                        </div>
                        <div className="w-[350px] mx-auto grid grid-cols-2 text-center">
                            <span>スキル上限</span>
                            <span>{enemyStat + buffInfo.param_limit - enemyStatDown}</span>
                            {isJewel &&
                                <>
                                    <span>宝珠上限</span>
                                    <span>{enemyStat + buffInfo.param_limit + 100 - enemyStatDown}</span>
                                </>
                            }
                            <span>使用者ステータス</span>
                            <span>{Math.floor(status * 100) / 100}</span>
                            {isJewel &&
                                <>
                                    <span>使用者宝珠強化</span>
                                    <span className="explain">{`${JEWEL_EXPLAIN[memberInfo.styleInfo.jewel_type]}(Lv${memberInfo.jewelLv})`}</span>
                                </>
                            }
                            <span>闘志</span>
                            <div className="text-center status_checkbox">
                                <input type="checkbox" id="fightingspirit" checked={buffInfo.collect?.fightingspirit}
                                // onChange={(e) => setAttackInfo({ ...buffInfo, collect: { ...buffInfo.collect, fightingspirit: e.target.checked } })}
                                />
                                <label htmlFor="fightingspirit" className="checkbox01"></label>
                            </div>
                            {isDebuff &&
                                <>
                                    <span>厄</span>
                                    <div className="text-center status_checkbox">
                                        <input type="checkbox" id="misfortune" checked={buffInfo.collect?.misfortune}
                                        // onChange={(e) => setAttackInfo({ ...buffInfo, collect: { ...buffInfo.collect, misfortune: e.target.checked } })}
                                        />
                                        <label htmlFor="misfortune" className="checkbox01"></label>
                                    </div>
                                    <span>ハッキング</span>
                                    <div className="text-center status_checkbox">
                                        <input type="checkbox" id="hacking" checked={buffInfo.collect?.hacking}
                                        // onChange={(e) => setAttackInfo({ ...buffInfo, collect: { ...buffInfo.collect, hacking: e.target.checked } })}
                                        />
                                        <label htmlFor="hacking" className="checkbox01"></label>
                                    </div>
                                </>
                            }
                        </div>
                    </>
                )}
                {abilityList.length > 0 &&
                    <>
                        <div className="mt-2">
                            <label className="damage_label">関連アビリティ</label>
                        </div>
                        <div className="w-[350px] mx-auto">
                            {abilityList.map((ability, index) => {
                                const key = ability.key;
                                const abilityInfo = getAbilityInfo(ability.ability_id);
                                return (
                                    <div key={key} className="explain">
                                        <input type="checkbox" className="ability" id={key} checked={abilitySettingMap[key].checked} />
                                        <label htmlFor={key}
                                            className="checkbox01">
                                            {`${abilityInfo.ability_name}:${abilityInfo.ability_short_explan}`}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                }
                {PassiveList.length > 0 &&
                    <>
                        <div className="mt-2">
                            <label className="damage_label">関連パッシブ</label>
                        </div>
                        <div className="w-[350px] mx-auto">
                            {PassiveList.map((passive, index) => {
                                const key = passive.key;
                                const passiveInfo = getPassiveInfo(passive.skill_id);
                                return (
                                    <div key={key} className="explain">
                                        <input type="checkbox" className="ability" id={key} checked={passiveSettingMap[key].checked} />
                                        <label htmlFor={key}
                                            className="checkbox01">
                                            {`${passiveInfo.passive_name}:${passiveInfo.passive_short_explan}`}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

const AbilityDetail = ({ buffInfo, closeModal }) => {
    let effectSize = 0;
    // アビリティ
    switch (buffInfo.buff_kind) {
        case BUFF.CHARGE: // チャージ
            effectSize = 30;
            break;
        case BUFF.FIELD: // フィールド
            effectSize = buffInfo.max_power;
            break;
        case BUFF.ARROWCHERRYBLOSSOMS: // 桜花の矢
            effectSize = 50;
            break;
        case BUFF.YAMAWAKI_SERVANT: // 山脇様のしもべ
            effectSize = 30;
            break;
        case BUFF.SHADOW_CLONE: // 影分身
            effectSize = 30;
            break;
        default:
            break;
    }
    return (
        <div className="modal__container container_damage">
            <div className="modal text-left w-[350px] mx-auto">
                <div>
                    <label className="damage_label">アビリティ詳細</label>
                    <button className="modal-close" onClick={closeModal}>&times;</button>
                </div>
                <div className="w-[350px] mx-auto grid grid-cols-2 text-center">
                    <span>アビリティ</span>
                    <span>{buffInfo.buff_name}</span>
                    <span>効果量</span>
                    <span>{effectSize}%</span>
                </div>
            </div>
        </div>)
}