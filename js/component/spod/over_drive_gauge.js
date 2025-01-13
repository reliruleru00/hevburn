const OverDriveGauge = ({ turn }) => {
    const getOverDrive = (turn) => {
        // OD上昇量取得
        let seq = sortActionSeq(turn);
        let enemy_count = turn.enemy_count;
        let od_plus = 0;
        let temp_turn = deepClone(turn);
        $.each(seq, function (index, skill_data) {
            let skill_info = skill_data.skill_info;
            let unit_data = getUnitData(temp_turn, skill_data.place_no);
            let buff_list = getBuffInfo(skill_info.skill_id);
            let attack_info = getAttackInfo(skill_info.attack_id);
            let unit_od_plus = 0;

            let correction = 1;
            let badies = 0;
            // オギャり状態
            if (checkBuffExist(unit_data.buff_list, BUFF_BABIED)) {
                badies += 20;
            }
            let earring = 0;
            if (skill_info.attack_id) {
                earring = unit_data.getEarringEffectSize(attack_info.hit_count);
            }

            buff_list.forEach(function (buff_info) {
                // OD増加
                if (buff_info.buff_kind == BUFF_OVERDRIVEPOINTUP) {
                    // 条件判定
                    if (buff_info.conditions != null) {
                        if (!judgmentCondition(buff_info.conditions, temp_turn, unit_data, buff_info.skill_id)) {
                            return true;
                        }
                    }

                    // サービス・エースが可変
                    if (skill_info.attack_id) {
                        correction = 1 + (badies + earring) / 100;
                    } else {
                        correction = 1 + badies / 100;
                    }
                    unit_od_plus += Math.floor(buff_info.max_power * correction * 100) / 100;
                }
                // 連撃のみとオギャり状態処理
                if (BUFF_FUNNEL_LIST.includes(buff_info.buff_kind) || buff_info.buff_kind == BUFF_BABIED) {
                    addBuffUnit(temp_turn, buff_info, skill_data.place_no, unit_data);
                }
            });
            let physical = getCharaData(unit_data.style.style_info.chara_id).physical;

            if (skill_info.skill_attribute == ATTRIBUTE_NORMAL_ATTACK) {
                if (isResist(physical, unit_data.normal_attack_element, skill_info.attack_id)) {
                    correction = 1 + badies / 100;
                    let hit_od = Math.floor(2.5 * correction * 100) / 100;
                    unit_od_plus += hit_od * 3;
                }
            } else if (skill_info.attack_id) {
                if (isResist(physical, attack_info.attack_element, skill_info.attack_id)) {
                    correction = 1 + (badies + earring) / 100;
                    let hit_od = Math.floor(2.5 * correction * 100) / 100;
                    let enemy_target = enemy_count;
                    if (attack_info.range_area == 1) {
                        enemy_target = 1;
                    }
                    let funnel_list = unit_data.getFunnelList();
                    unit_od_plus += attack_info.hit_count * hit_od * enemy_target;
                    unit_od_plus += funnel_list.length * hit_od * enemy_target;
                    // EXスキル連続使用
                    if (checkBuffExist(unit_data.buff_list, BUFF_EX_DOUBLE)) {
                        buff_list.forEach(function (buff_info) {
                            // 連撃のみ処理
                            if (BUFF_FUNNEL_LIST.includes(buff_info.buff_kind)) {
                                addBuffUnit(temp_turn, buff_info, skill_data.place_no, unit_data);
                            }
                        });
                        let funnel_list = unit_data.getFunnelList();
                        unit_od_plus += attack_info.hit_count * hit_od * enemy_target;
                        unit_od_plus += funnel_list.length * hit_od * enemy_target;
                    }
                }
            }
            od_plus += unit_od_plus;
        });
        // // 後衛の選択取得
        [3, 4, 5].forEach(function (place_no) {
            let unit_data = getUnitData(temp_turn, place_no);
            let skill_id = unit_data.select_skill_id;
            if (skill_id == 0) {
                return true;
            }
            // 追撃
            if (skill_id == 3) {
                let chara_data = getCharaData(unit_data.style.style_info.chara_id);
                od_plus += chara_data.pursuit * 2.5;
            }
        });
        return od_plus;
    }

    let over_drive_gauge = turn.over_drive_gauge;
    let add_over_drive_gauge = getOverDrive(turn);
    turn.add_over_drive_gauge = add_over_drive_gauge;
    over_drive_gauge += add_over_drive_gauge;
    over_drive_gauge = over_drive_gauge > 300 ? 300 : over_drive_gauge;
    let gauge = Math.floor(turn.over_drive_gauge / 100);
    return (
        <div className="flex">
            <label className="od_text">
                <span className={turn.over_drive_gauge < 0 ? "od_minus" : ""}>{`${(turn.over_drive_gauge).toFixed(2)}%`}</span><br />⇒
                <span className={over_drive_gauge < 0 ? "od_minus" : ""}>{`${over_drive_gauge.toFixed(2)}%`}</span>
            </label>
            <div className="inc_od_icon">
                {gauge > 0 ?
                    <img className="od_number" src={`img/ButtonOverdrive${gauge}Default.webp`} />
                    :
                    <img className="od_icon" src="img/FrameOverdriveGaugeR.webp" />
                }
            </div>
        </div>
    );
}
