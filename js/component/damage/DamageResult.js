
const DamageDetail = ({ mode, enemyInfo, detail }) => {

    const baseData = mode === "normal" ? detail.nomarlResult : detail.criticalResult;
    const minData = mode === "normal" ? detail.nomarlMinResult : detail.criticalMinResult;
    const maxData = mode === "normal" ? detail.nomarlMaxResult : detail.criticalMaxResult;


    let dispRestHp = calculatePercentage(maxData.restHp, minData.restHp, enemyInfo.max_hp, "hp");
    let gradientStyleHp = generateGradientFromRange(dispRestHp, "#BE71BE")

    // 破壊率
    const maxRate = Math.round(maxData.damageRate * 10) / 10;
    const minRate = Math.round(minData.damageRate * 10) / 10;

    const rateText = maxRate === minRate ? `${maxRate}%` : `${maxRate}%～${minRate}%`;
    const dpSize = baseData.restDp.length;
    return (
        <div className="modal__container container_damage">
            <div className="modal text-left w-[250px] mx-auto mt-2">
                <div>
                    <label className="damage_label">ダメージ詳細</label>
                </div>
                <div className="text-center mx-auto">
                    <input type="text" className="text-center damage"
                        value={baseData.damage} readOnly />
                    <div>
                        最大
                        <input type="text" className="text-center min_damage" value={maxData.damage} readOnly />
                    </div>
                    <div>
                        最小
                        <input type="text" className="text-center min_damage" value={minData.damage} readOnly />
                    </div>
                    <label className="detail_max_damage">最終破壊率</label>
                    <label className="damage_label">{rateText}</label>
                </div>
                <div className="enemy_rest_hp text-center w-[240px] mx-auto">
                    <div className="flex">
                        <div className="w-8">DP</div>
                        <div>
                            {baseData.restDp.map((dp, revIndex) => {
                                const index = baseData.restDp.length - 1 - revIndex;
                                let enemyDp = Number(enemyInfo.max_dp.split(",")[index]);
                                let dispRestDp = calculatePercentage(maxData.restDp[index], minData.restDp[index], enemyDp, "hp");
                                return (
                                    <output key={index} className="rest_gauge_rate"
                                        style={{ background: generateGradientFromRange(dispRestDp, "#A7BEC5") }}>{dispRestDp}</output>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-8">HP</div>
                        <div>
                            <div className="flex">
                                <output className="rest_gauge_rate" style={{ background: gradientStyleHp }}>{dispRestHp}</output>
                            </div>
                        </div>
                    </div>
                    <input
                        className="durability_reflection"
                        defaultValue="敵情報に反映"
                        type="button"
                    />
                </div>
                <div className="w-[250px] mx-auto mt-3">
                    <div className="font-bold">補正詳細(初段Hit時点)</div>
                    <div>
                        <div className="magnification">スキル攻撃力</div>
                        <input type="text" className="text-center magnification_value" value={mode === "normal" ? detail.skillPower : detail.criticalPower} readOnly />
                    </div>
                    <div>
                        <div className="magnification">×攻撃力アップ</div>
                        <input type="text" className="text-center magnification_value" value={detail.buff} readOnly />
                    </div>
                    <div>
                        <div className="magnification">×防御力ダウン</div>
                        <input type="text" className="text-center magnification_value" value={detail.debuff} readOnly />

                    </div>
                    <div>
                        <div className="magnification">×フィールド</div>
                        <input type="text" className="text-center magnification_value" value={detail.field} readOnly />
                    </div>
                    <div>
                        <div className="magnification">×HP/DP特攻</div>
                        <input type="text" className="text-center magnification_value" value={detail.special} readOnly />
                    </div>
                    <div>
                        <div className="magnification">×連撃</div>
                        <input type="text" className="text-center magnification_value" value={detail.funnel} readOnly />
                    </div>
                    <div>
                        <div className="magnification">×トークン補正</div>
                        <input type="text" className="text-center magnification_value" value={detail.token} readOnly />
                    </div>
                    <div>
                        <div className="magnification">×武器相性</div>
                        <input type="text" className="text-center magnification_value" value={detail.physical} readOnly />
                    </div>
                    <div>
                        <div className="magnification">×属性相性</div>
                        <input type="text" className="text-center magnification_value" value={detail.element} readOnly />
                    </div>
                    <div>
                        <div className="magnification">×心眼</div>
                        <input type="text" className="text-center magnification_value" value={detail.mindeye} readOnly />
                    </div>
                    <div>
                        <div className="magnification">×脆弱</div>
                        <input type="text" className="text-center magnification_value" value={detail.fragile} readOnly />
                    </div>
                    <div>
                        <div className="magnification">×破壊率</div>
                        <input type="text" className="text-center magnification_value" value={detail.damageRate} readOnly />
                    </div>
                    {mode == "critical" && (
                        <div>
                            <div className="magnification">×クリティカル倍率</div>
                            <input type="text" className="text-center magnification_value" value={detail.criticalBuff} readOnly />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// 残りの実数値と全体値から、割合範囲を取得する。
function calculatePercentage(min, max, total, dphp) {
    if (total == 0) {
        return "0%";
    }
    // 最小値、最大値、全体値が0以下の場合、それぞれ0に設定
    let temp_min = Math.max(0, min);
    let temp_max = Math.max(0, max);

    // 最小値と最大値が同じ場合は、範囲指定しない
    if (Math.ceil((temp_min / total) * 100) === Math.ceil((temp_max / total) * 100)) {
        return Math.ceil((temp_min / total) * 100) + '%';
    } else {
        if (dphp == "hp") {
            return Math.ceil((min / total) * 100) + '%～' + Math.ceil((max / total) * 100) + '%';
        } else {
            return Math.ceil((temp_min / total) * 100) + '%～' + Math.ceil((temp_max / total) * 100) + '%';
        }
    }
}

// ダメージの詳細計算
function calculateDamage(state, basePower, attackInfo, buff, debuff, fixed, damageRateUp, funnelList) {
    let enemyInfo = state.enemy_info;
    let damageRate = state.damageRate;
    let maxDamageRate = state.maxDamageRate;
    let destruction = Number(enemyInfo.destruction);
    let dpPenetration = state.dpRate[0] == 0;
    let restDp = Array(state.dpRate.length).fill(0);
    let dp_no = -1;  // 現在の使用DPゲージ番号を取得
    for (let i = 0; i < state.dpRate.length; i++) {
        restDp[i] = 0;
        if (state.dpRate[i] > 0) {
            restDp[i] = Number(enemyInfo.max_dp.split(",")[i]) * state.dpRate[i] / 100;
        }
        if (restDp[i] > 0) {
            dp_no = i;
        }
    }
    let restHp = enemyInfo.max_hp * state.hpRate / 100;
    let hit_count = attackInfo.hit_count;
    let destruction_size = destruction * attackInfo.destruction * damageRateUp;
    let damage = 0;
    let special;
    let add_buff = 0;
    let add_debuff = 0;

    // ダメージ処理
    function procDamage(power, add_destruction) {
        if (restDp[0] <= 0 && dpPenetration) {
            special = 1 + attackInfo.hp_damege / 100;
            // add_buff = getEarringEffectSize("attack", hit_count) / 100;
            // add_debuff = 0;
        } else {
            special = 1 + attackInfo.dp_damege / 100;
            // add_buff = getEarringEffectSize("break", hit_count) / 100;
            // add_debuff = getSumEffectSize("dp_debuff") / 100;
        }
        let hit_damage = Math.floor(power * (buff + add_buff) * (debuff + add_debuff) * fixed * special * damageRate / 100);

        if (restDp[dp_no] > 0) {
            restDp[dp_no] -= hit_damage;
        } else if (dp_no >= 1) {
            restDp[dp_no - 1] -= hit_damage;
        } else {
            restHp -= hit_damage;
        }
        if (restDp[0] <= 0 && dpPenetration) {
            damageRate += add_destruction;
            if (damageRate > maxDamageRate) damageRate = maxDamageRate;
        }
        damage += hit_damage
    }
    // 通常分ダメージ処理
    let hit_list = [];
    if (attackInfo.damege_distribution) {
        hit_list = attackInfo.damege_distribution.split(",");
    } else {
        const value = 100 / hit_count;
        hit_list = new Array(hit_count).fill(value);
    }
    hit_list.forEach(value => {
        procDamage(basePower * value / 100, destruction_size / hit_count);
    });
    // 連撃分ダメージ処理
    funnelList.forEach(value => {
        procDamage(basePower * value / 100, destruction_size * value / 100);
    });

    const billion = 1000000000;
    if (damage > billion) {
        damage = billion * (2 - Math.exp(0.7 - 0.7 * (damage / billion)));
    }
    if (damage > billion * 2) {
        damage = billion * 2;
    }

    return {
        damage: Math.floor(damage).toLocaleString(),
        restDp: restDp,
        restHp: restHp,
        damageRate: Math.round(damageRate * 100) / 100,
    };
}

const DamageResult = ({ attackInfo, styleList, state, selectSKillLv, selectBuffKeyMap, buffSettingMap }) => {
    if (!attackInfo) {
        return null;
    }
    let enemyInfo = state.enemy_info;
    let attackMemberInfo = styleList.filter(style => style?.style_info.chara_id === attackInfo.chara_id)[0];

    // // グレード
    // let grade_sum = getGradeSum();
    // // メンバー
    // let chara_id = $("#attack_list option:selected").data("chara_id");

    // // 闘志
    // let fightingspirit = $("#fightingspirit").prop("checked") ? 20 : 0;
    // // 厄
    // let misfortune = $("#misfortune").prop("checked") ? 20 : 0;
    // // ハッキング
    // let hacking = $("#hacking").prop("checked") ? 100 : 0;

    // // 士気
    // let morale = Number($("#morale_count").val()) * 5;
    // let stat_up = getStatUp(member_info)
    // // 闘志or士気
    // stat_up += (morale > fightingspirit ? morale : fightingspirit);
    // // 厄orハッキング
    // let stat_down = hacking || misfortune;
    let statUp = 0;
    let enemyStatDown = 0;

    let skillPower = getSkillPower(attackInfo, selectSKillLv, attackMemberInfo, statUp, enemyInfo, enemyStatDown);
    let buff = getSumBuffEffectSize(selectBuffKeyMap, buffSettingMap);
    // let mindeye_buff = getSumEffectSize("mindeye") + getSumEffectSize("servant");
    let mindeye = 1 + getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.MINDEYE]) / 100;
    let debuff = getSumDebuffEffectSize(selectBuffKeyMap, buffSettingMap)
    let fragile = 1 + getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.FRAGILE]) / 100;

    let damageRateUp = getDamagerateEffectSize(selectBuffKeyMap, buffSettingMap, attackInfo.hit_count);
    let funnelList = getSumFunnelEffectList(selectBuffKeyMap);

    // let token = getSumTokenEffectSize(attack_info, member_info);
    let field = 1 + getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.FIELD]) / 100;
    let [physical, element] = getEnemyResist(attackInfo, enemyInfo, state.correction);
    // let enemy_defence_rate = getEnemyDefenceRate(grade_sum);

    // 表示用
    let funnel = 1 + funnelList.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / 100;
    let special = 1 + Number(state.dpRate[0] == 0 ? attackInfo.hp_damege / 100 : attackInfo.dp_damege / 100);

    // 個別設定
    let skill_unique_rate = 1;
    // // バーチカルフォース/パドマ・ナーチュナー/ディナミコ・アチェーゾ
    // if (attack_info.attack_id == 115 || attack_info.attack_id == 2167 || attack_info.attack_id == 187) {
    //     let dp_rate = Number($("#skill_unique_dp_rate").val());
    //     dp_rate = dp_rate < 60 ? 60 : dp_rate;
    //     skill_unique_rate += (dp_rate - 100) / 200
    // }
    // // 花舞う、可憐のフレア/プレゼント・フォー・ユー
    // if (attack_info.attack_id == 136 || attack_info.attack_id == 166) {
    //     let dp_rate = Number($("#skill_unique_dp_rate").val());
    //     dp_rate = dp_rate > 100 ? 100 : dp_rate;
    //     skill_unique_rate += (100 - dp_rate) / 100 * 75 / 100;
    // }
    // // コーシュカ・アルマータ/疾きこと風の如し
    // if (attack_info.attack_id == 2162 || attack_info.attack_id == 154 || attack_info.attack_id == 155) {
    //     let sp = Number($("#skill_unique_sp").val());
    //     skill_unique_rate = (sp > 30 ? 30 : sp) / 30;
    // }
    // // 桜花の矢
    // if (attack_info.chara_id == 45 && $("#skill_unique_cherry_blossoms").prop("checked")) {
    //     buff += 0.5
    // }
    // // 影分身(アーデルハイト)
    // if (attack_info.chara_id == 17 && $("#skill_unique_shadow_clone").prop("checked")) {
    //     buff += 0.3;
    // }
    // // 影分身(マリー)
    // if (attack_info.chara_id == 18 && $("#skill_unique_shadow_clone").prop("checked")) {
    //     buff += 0.3;
    // }

    let criticalPower = getSkillPower(attackInfo, selectSKillLv, attackMemberInfo, statUp, enemyInfo, 50);
    // let critical_rate = getCriticalRate(member_info);
    let criticalBuff = getCriticalBuff(selectBuffKeyMap, buffSettingMap);

    let token = 1;
    let enemy_defence_rate = 1;

    let fixed = mindeye * fragile * token * field * physical / 100 * element / 100 * enemy_defence_rate * skill_unique_rate;
    const nomarlResult =
        calculateDamage(state, skillPower, attackInfo, buff, debuff, fixed, damageRateUp, funnelList);
    const nomarlMinResult =
        calculateDamage(state, skillPower * 0.9, attackInfo, buff, debuff, fixed, damageRateUp, funnelList);
    const nomarlMaxResult =
        calculateDamage(state, skillPower * 1.1, attackInfo, buff, debuff, fixed, damageRateUp, funnelList);
    const criticalResult =
        calculateDamage(state, criticalPower, attackInfo, buff, debuff, fixed * criticalBuff, damageRateUp, funnelList);
    const criticalMinResult =
        calculateDamage(state, criticalPower * 0.9, attackInfo, buff, debuff, fixed * criticalBuff, damageRateUp, funnelList);
    const criticalMaxResult =
        calculateDamage(state, criticalPower * 1.1, attackInfo, buff, debuff, fixed * criticalBuff, damageRateUp, funnelList);

    // if ($("#dp_range_0").val() && Number($("#dp_range_0").val())) {
    //     let dp_debuff = getSumEffectSize("dp_debuff") / 100;
    //     debuff += dp_debuff;
    // }

    const detail = {
        nomarlResult: nomarlResult,
        nomarlMinResult: nomarlMinResult,
        nomarlMaxResult: nomarlMaxResult,
        criticalResult: criticalResult,
        criticalMinResult: criticalMinResult,
        criticalMaxResult: criticalMaxResult,
        skillPower: skillPower,
        criticalPower: criticalPower,
        buff: convertToPercentage(buff),
        debuff: convertToPercentage(debuff),
        special: convertToPercentage(special),
        funnel: convertToPercentage(funnel),
        physical: convertToPercentage(physical / 100),
        element: convertToPercentage(element / 100),
        token: convertToPercentage(token),
        mindeye: convertToPercentage(mindeye),
        fragile: convertToPercentage(fragile),
        field: convertToPercentage(field),
        damageRate: state.damageRate + "%",
        criticalBuff: convertToPercentage(criticalBuff),
    }

    const [modal, setModal] = React.useState({
        isOpen: false,
        mode: ""
    });
    const openModal = (mode) => setModal({ isOpen: true, mode: mode });
    const closeModal = () => setModal({ isOpen: false, mode: "" });
    return (
        <>
            <div className="footer">
                <div className="text-center mx-auto" id="damage_result">
                    <div className="flex">
                        <div className="mt-2 damage-flex">
                            <div>
                                <label className="damage_label">クリティカル</label>
                                <label className="damage_label" id="critical_rate" />
                            </div>
                            <div>
                                <label className="damage_label">最終破壊率</label>
                                <label className="damage_label">{`${criticalResult.damageRate}%`}</label>
                                <input type="button" className="open_detail" defaultValue="詳細" onClick={() => openModal("critical")} />

                            </div>
                            <div className="text-center mx-auto">
                                <input type="text" className="text-center damage" value={criticalResult.damage} readOnly />
                                <div className="leading-4 items-end">
                                    <label className="pb-0.5">(</label>
                                    <input type="text" className="text-center min_damage" value={criticalMinResult.damage} readOnly />
                                    <label className="pb-0.5">～</label>
                                    <input type="text" className="text-center min_damage" value={criticalMaxResult.damage} readOnly />
                                    <label className="pb-0.5">)</label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 damage-flex">
                            <div>
                                <label className="damage_label">通常ダメージ</label>
                            </div>
                            <div>
                                <label className="damage_label">最終破壊率</label>
                                <label className="damage_label">{`${nomarlResult.damageRate}%`}</label>
                                <input type="button" className="open_detail" defaultValue="詳細" onClick={() => openModal("normal")} />
                            </div>
                            <div className="text-center mx-auto">
                                <input className="text-center damage" value={nomarlResult.damage} readOnly type="text" />
                                <div className="leading-4 items-end">
                                    <label className="pb-0.5">(</label>
                                    <input type="text" className="text-center min_damage" value={nomarlMinResult.damage} readOnly />
                                    <label className="pb-0.5">～</label>
                                    <input type="text" className="text-center min_damage" value={nomarlMaxResult.damage} readOnly />
                                    <label className="pb-0.5">)</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ReactModal
                isOpen={modal.isOpen}
                onRequestClose={closeModal}
                className={"modal-content " + (modal.isOpen ? "modal-content-open" : "")}
                overlayClassName={"modal-overlay " + (modal.isOpen ? "modal-overlay-open" : "")}
            >
                <DamageDetail mode={modal.mode} enemyInfo={enemyInfo} detail={detail} />
            </ReactModal>
        </>
    )
}


// 基礎攻撃力取得
function getSkillPower(attackInfo, selectSKillLv, memberInfo, statUp, enemyInfo, enemyStatDown) {
    let jewelLv = 0;
    if (memberInfo.style_info.jewel_type == "1") {
        jewelLv = memberInfo.jewel_lv;
    }
    let molecule = 0;
    let denominator = 0;
    if (attackInfo.ref_status_1 != 0) {
        molecule += (memberInfo[status_kbn[attackInfo.ref_status_1]] + statUp) * 2;
        denominator += 2;
    }
    if (attackInfo.ref_status_2 != 0) {
        molecule += memberInfo[status_kbn[attackInfo.ref_status_2]] + statUp;
        denominator += 1;
    }
    if (attackInfo.ref_status_3 != 0) {
        molecule += memberInfo[status_kbn[attackInfo.ref_status_3]] + statUp;
        denominator += 1;
    }
    let enemyStat = enemyInfo.enemy_stat - enemyStatDown;
    let status = molecule / denominator;

    let minPower = attackInfo.min_power * (1 + 0.05 * (selectSKillLv - 1));
    let maxPower = attackInfo.max_power * (1 + 0.02 * (selectSKillLv - 1));
    let skillStat = attackInfo.param_limit;
    let basePower;
    // 宝珠分以外
    if (enemyStat - skillStat / 2 > status) {
        basePower = 1;
    } else if (enemyStat > status) {
        basePower = minPower / (skillStat / 2) * (status - (enemyStat - skillStat / 2));
    } else if (enemyStat + skillStat > status) {
        basePower = (maxPower - minPower) / skillStat * (status - enemyStat) + minPower;
    } else {
        basePower = maxPower;
    }

    // 宝珠分(SLvの恩恵を受けない)
    if (jewelLv > 0) {
        let jewelStat = skillStat + jewelLv * 20;
        if (enemyStat - skillStat / 2 > status) {
            basePower += 0;
        } else if (enemyStat > status) {
            basePower += attackInfo.min_power / (jewelStat / 2) * (status - (enemyStat - jewelStat / 2)) * jewelLv * 0.02;
        } else if (enemyStat + jewelStat > status) {
            basePower += ((attackInfo.max_power - attackInfo.min_power) / jewelStat * (status - enemyStat) + attackInfo.min_power) * jewelLv * 0.02;
        } else {
            basePower += attackInfo.max_power * jewelLv * 0.02;
        }
    }
    return Math.floor(basePower * 100) / 100;
}

// 効果量合計
function getSumEffectSize(selectBuffKeyMap, buffSettingMap, BUFF_KIND_LIST) {
    let effectSize = 0;
    BUFF_KIND_LIST.forEach(buffKind => {
        const buffKey = getBuffKey(buffKind);
        const selectedKeys = selectBuffKeyMap[buffKey];
        if (selectedKeys) {
            selectedKeys.forEach(selectedKey => {
                if (selectedKey.length > 0) {
                    effectSize += buffSettingMap[selectedKey].effect_size;
                }
            })
        }
    });
    return effectSize;
}

// 合計バフ効果量取得
function getSumBuffEffectSize(selectBuffKeyMap, buffSettingMap) {
    // スキルバフ合計
    let sumBuff = getSumEffectSize(selectBuffKeyMap, buffSettingMap,
        [BUFF.ATTACKUP, BUFF.ELEMENT_ATTACKUP, BUFF.CHARGE]);
    // // 攻撃力アップアビリティ
    // sum_buff += getSumAbilityEffectSize(EFFECT_ATTACKUP);
    // // 属性リング(0%-10%)
    // if (attack_info.attack_element != 0) {
    //     sum_buff += Number($("#elememt_ring option:selected").val());
    // }
    // // オーバードライブ10%
    // if ($("#overdrive").prop("checked")) {
    //     sum_buff += 10;
    // }
    // sum_buff += getChainEffectSize("skill");
    // // トークン
    // sum_buff += getSumTokenAbilirySize(EFFECT_TOKEN_ATTACKUP);
    // // 士気
    // sum_buff += Number($("#morale_count").val()) * 5;
    // // 永遠なる誓い
    // sum_buff += $("#eternal_vows").prop("checked") ? 50 : 0;
    // // オギャり
    // sum_buff += $("#babied").prop("checked") ? 30 : 0;
    // // スコアタグレード
    // if (grade_sum.power_up) {
    //     sum_buff += grade_sum.power_up;
    // }
    // if (attack_info.attack_element != 0) {
    //     let name = "element_power_up_" + attack_info.attack_element;
    //     if (grade_sum[name]) {
    //         sum_buff += grade_sum[name];
    //     }
    // }
    // // 制圧戦
    // sum_buff += getBikePartsEffectSize("buff");
    return 1 + sumBuff / 100;
}

// 合計デバフ効果量取得
function getSumDebuffEffectSize(selectBuffKeyMap, buffSettingMap) {
    // スキルデバフ合計
    let sumBuff = getSumEffectSize(selectBuffKeyMap, buffSettingMap,
        [BUFF.DEFENSEDOWN, BUFF.ELEMENT_DEFENSEDOWN, BUFF.ETERNAL_DEFENSEDOWN, BUFF.ELEMENT_ETERNAL_DEFENSEDOWN]);
    // // 防御ダウンアビリティ
    // sum_debuff += getSumAbilityEffectSize(2);
    // // 制圧戦
    // sum_debuff += getBikePartsEffectSize("debuff");
    return 1 + sumBuff / 100;
}


// 合計連撃効果量取得
function getSumFunnelEffectList(selectBuffKeyMap) {
    let funnel_list = [];

    // スキルデバフ合計
    const funnelKey = getBuffKey(BUFF.FUNNEL);
    const selectedKey = selectBuffKeyMap[funnelKey];
    if (selectedKey) {
        selectedKey.forEach(selectedKey => {
            let buffId = Number(selectedKey.split('-')[0]);
            let buffInfo = getBuffIdToBuff(buffId);
            if (buffInfo) {
                let loop = buffInfo.max_power;
                let size = buffInfo.effect_size;
                for (let i = 0; i < loop; i++) {
                    funnel_list.push(size);
                }
            }
        })
    }

    // $("input[type=checkbox].ability:checked").each(function (index, value) {
    //     if ($(value).parent().css("display") === "none") {
    //         return true;
    //     }
    //     let ability_info = getAbilityInfo(Number($(value).data("ability_id")));
    //     if (ability_info.effect_type == 6) {
    //         let size = ability_info.effect_size;
    //         let loop = ability_info.effect_count;
    //         for (let i = 0; i < loop; i++) {
    //             funnel_list.push(size);
    //         }
    //     }
    // });
    // // 降順でソート
    // funnel_list.sort(function (a, b) {
    //     return b - a;
    // });
    return funnel_list;
}

// 破壊率上昇
function getDamagerateEffectSize(selectBuffKeyMap, buffSettingMap, hit_count) {
    let destruction_effect_size = 100;
    destruction_effect_size += getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.DAMAGERATEUP]);
    // destruction_effect_size += getSumAbilityEffectSize(5);
    // destruction_effect_size += getSumTokenAbilirySize(EFFECT_TOKEN_DAMAGERATEUP)
    // destruction_effect_size += getEarringEffectSize("blast", 10 - hit_count);
    // destruction_effect_size += getChainEffectSize("blast");
    // // 制圧戦
    // destruction_effect_size += getBikePartsEffectSize("destruction_rate");
    // let grade_sum = getGradeSum();
    // destruction_effect_size += grade_sum.destruction;
    return destruction_effect_size / 100;
}

// クリティカル率取得
function getCriticalRate(member_info) {
    let criticalRate = 1.5;
    // let diff = (member_info.luk - Number($("#enemy_stat").val()));
    // critical_rate += diff > 0 ? diff * 0.04 : 0;
    // critical_rate = critical_rate > 15 ? 15 : critical_rate;
    // critical_rate += getSumEffectSize("critical_rate");
    // critical_rate += getSumAbilityEffectSize(3);
    // critical_rate += $("#charge").prop("selectedIndex") > 0 ? 20 : 0;
    // let grade_sum = getGradeSum();
    // critical_rate -= grade_sum.critical;
    // critical_rate = critical_rate < 0 ? 0 : critical_rate;
    // // 永遠なる誓い
    // critical_rate += $("#eternal_vows").prop("checked") ? 50 : 0;
    // // 制圧戦
    // critical_rate += getBikePartsEffectSize("critical_rate");
    return criticalRate > 100 ? 100 : criticalRate;
}

// クリティカルバフ取得
function getCriticalBuff(selectBuffKeyMap, buffSettingMap) {
    let criticalBuff = 50;
    criticalBuff += getSumEffectSize(selectBuffKeyMap, buffSettingMap, [BUFF.CRITICALDAMAGEUP, BUFF.ELEMENT_CRITICALDAMAGEUP]);
    // critical_buff += getSumAbilityEffectSize(4);
    // // 制圧戦
    // critical_buff += getBikePartsEffectSize("critical_buff");
    // // セラフ遭遇戦
    // if ($("#enemy_class").val() == ENEMY_CLASS.SERAPH_ENCOUNTER) {
    //     critical_buff += getCardEffect("CLIRICAL_DAMAGE");
    // }
    return 1 + criticalBuff / 100;
}