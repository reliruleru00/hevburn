const TurnDataComponent = ({ turn, last_turn, index }) => {
    const [turnData, setTurnData] = React.useState({
        user_operation: turn.user_operation
    });

    // 敵の数変更
    const chengeEnemyCount = (e) => {
        let user_operation = turnData.user_operation;
        user_operation.enemy_count = Number(e.target.value);
        turn.enemy_count = Number(e.target.value);
        setTurnData({ ...turnData, user_operation: user_operation });
    }

    // フィールド変更
    const chengeField = (e) => {
        let user_operation = turnData.user_operation;
        user_operation.field = Number(e.target.value);
        turn.field = Number(e.target.value);
        setTurnData({ ...turnData, user_operation: user_operation });
    }

    // 行動選択変更
    const chengeAction = (e) => {
        let user_operation = turnData.user_operation;
        user_operation.kb_action = Number(e.target.value);
        setTurnData({ ...turnData, user_operation: user_operation });
    }

    // スキル変更
    const chengeSkill = (skill_id, place_no) => {
        let user_operation = turnData.user_operation;
        let select_skill = user_operation.select_skill[place_no];
        select_skill.skill_id = skill_id;
        skillUpdate(turn, skill_id, place_no);
        const unit = turn.unit_list.filter(unit => unit.place_no === place_no)[0];
        processSkillChange(unit, skill_id, user_operation, select_skill);
    }

    // スキルデータ更新
    const skillUpdate = (turn_data, skill_id, place_no) => {
        const unit = turn_data.unit_list.filter(unit => unit.place_no === place_no)[0];
        unit.select_skill_id = skill_id;
        if (skill_id !== 0) {
            unit.sp_cost = getSpCost(turn_data, getSkillData(skill_id), unit);
        } else {
            unit.sp_cost = 0;
        }
    }

    // スキル変更時の追加処理
    async function processSkillChange(unit, skill_id, user_operation, select_skill) {
        const buff_list = getBuffInfo(skill_id);
        if (!await handleTargetSelection(unit, turn, buff_list)) {
            // 未選択時に初期値に戻す
            unit.select_skill_id = unit.init_skill_id;
            chengeSkill(unit.init_skill_id, unit.place_no);
        }
        if (!await handleEffectSelection(unit, skill_id, buff_list)) {
            // 未選択時に初期値に戻す
            unit.select_skill_id = unit.init_skill_id;
            chengeSkill(unit.init_skill_id, unit.place_no);
        }

        let sp_cost = unit.sp_cost;
        let skill_info = getSkillData(skill_id);
        const selectionConditions = [CONDITIONS_HAS_SHADOW, CONDITIONS_DOWN_TURN];
        if (selectionConditions.includes(skill_info.attribute_conditions)) {
            if (unit.buff_effect_select_type == 1) {
                if (skill_info.skill_attribute == ATTRIBUTE_SP_HALF) {
                    sp_cost = Math.floor(sp_cost / 2);
                }
                if (skill_info.skill_attribute == ATTRIBUTE_SP_ZERO) {
                    sp_cost = 0;
                }
            }
        }
        unit.sp_cost = sp_cost;
        select_skill.buff_target_chara_id = unit.buff_target_chara_id;
        select_skill.buff_effect_select_type = unit.buff_effect_select_type;
        setTurnData({ ...turnData, user_operation: user_operation });
    }

    // OD発動/解除
    function triggerOverDrive(checked) {
        let user_operation = turnData.user_operation;
        if (checked) {
            turn.startOverDrive();
        } else {
            turn.removeOverDrive();
        }
        user_operation.trigger_over_drive = checked;
        setTurnData({ ...turnData, user_operation: user_operation });
    }

    // ユニット選択/入れ替え
    const chengeSelectUnit = ((e, place_no) => {
        if (e.target.tagName === 'SELECT') {
            e.stopPropagation();
            return;
        }
        let new_unit = getUnitData(turn, place_no);
        if (new_unit.blank) {
            return;
        }
        // 追加ターンの制約
        if (turn.additional_turn) {
            if (2 < place_no) {
                return;
            }
            if (!new_unit.additional_turn) {
                return;
            }
        }
        let user_operation = turnData.user_operation;
        let old_place_no = user_operation.selected_place_no;
        let select_skill = user_operation.select_skill;
        let place_style = user_operation.place_style;
        if (old_place_no != -1) {
            if (old_place_no != place_no) {
                let old_unit = getUnitData(turn, old_place_no)
                if (new_unit && old_unit) {
                    new_unit.place_no = old_place_no;
                    old_unit.place_no = place_no;
                }
                // 前衛と後衛の交換
                if (place_no <= 2 && 3 <= old_place_no) {
                    old_unit.select_skill_id = old_unit.init_skill_id;
                    new_unit.select_skill_id = 0;
                    new_unit.sp_cost = 0;
                    new_unit.buff_effect_select_type = 0;
                    new_unit.buff_target_chara_id = 0;
                    select_skill[lace_no] = {skill_id: 0};
                }
                // 後衛と前衛の交換
                if (3 <= place_no && old_place_no <= 2) {
                    old_unit.select_skill_id = 0;
                    old_unit.sp_cost = 0;
                    old_unit.buff_effect_select_type = 0;
                    old_unit.buff_target_chara_id = 0;
                    select_skill[old_place_no] = {skill_id: 0};
                    new_unit.select_skill_id = new_unit.init_skill_id;
                }
                const tmp_skill = select_skill[place_no];
                select_skill[place_no] = select_skill[old_place_no]
                select_skill[old_place_no] = tmp_skill;

                const tmp_style = place_style[place_no];
                place_style[place_no] = place_style[old_place_no]
                place_style[old_place_no] = tmp_style;
            }
            place_no = -1;
        }
        user_operation.selected_place_no = place_no;
        setTurnData({ ...turnData, user_operation: user_operation });
    })

    // 次ターン
    function clickNextTurn() {
        turn.user_operation = turnData.user_operation;
        user_operation_list.push(turnData.user_operation);
        let turn_data = deepClone(turn);
        startAction(turn_data, last_turn);
        // 次ターンを追加
        proceedTurn(turn_data, true);
    };

    React.useEffect(() => {
        if (last_turn !== index) {
            console.log('次ターン以降を更新');
            // 指定されたnumber以上の要素を削除
            turn_list = turn_list.slice(0, index + 1);

            for (let i = index; i < last_turn; i++) {
                let turn_data = turn_list[i];
                turn_data.user_operation = user_operation_list[i];
                // 配置変更
                turn_data.unit_list.forEach((unit) => {
                    if (unit.blank) return;
                    unit.place_no = turn_data.user_operation.place_style.findIndex((item) =>
                        item === unit.style.style_info.style_id);
                })
                // スキル設定
                turn_data.unit_list.forEach((unit) => {
                    if (unit.blank) return;
                    // スキル設定
                    const skill = turn_data.user_operation.select_skill[unit.place_no];
                    unit.buff_target_chara_id = skill.buff_target_chara_id;
                    unit.buff_effect_select_type = skill.buff_effect_select_type;
                    skillUpdate(turn_data, turn_data.user_operation.select_skill[unit.place_no].skill_id, unit.place_no);
                })
                // OD再計算
                turn_data.add_over_drive_gauge = getOverDrive(turn_data);

                turn_data = deepClone(turn_list[i]);
                startAction(turn_data, i);
                proceedTurn(turn_data, false);
            }
            updateTurnList(turn_list);
        }
    }, [turnData]); // 空の依存配列を指定

    return (
        <div className="turn">
            <div className="header_area">
                <div>
                    <div className="turn_number">{turn.getTurnNumber()}</div>
                    <div className="left flex">
                        <img className="enemy_icon" src="icon/BtnEventBattleActive.webp" />
                        <div>
                            <select className="enemy_count" value={turn.enemy_count} onChange={(e) => chengeEnemyCount(e)}>
                                {[1, 2, 3].map(enemy_count => <option value={enemy_count} key={`enemy_count${enemy_count}`}>{`${enemy_count}体`}</option>)}
                            </select>
                            <label className="ml-2">場</label>
                            <select className="enemy_count" value={turn.field} onChange={(e) => chengeField(e)}>
                                {Object.keys(FIELD_LIST).map(field => <option value={field} key={`field${field}`}>{FIELD_LIST[field]}</option>)}
                            </select>
                            <div className="scroll-container enemy_icon_list">
                                <div className="scroll-content flex-wrap" />
                                <BuffIconComponent buff_list={turn.enemy_debuff_list} loop_limit={6} loop_step={1} place_no={7} turn_number={turn.turn_number} />
                            </div>
                        </div>
                    </div>
                </div>
                <OverDriveGauge turn={turn} select_skill={turnData.user_operation.select_skill.skill_id} />
            </div>
            <div className="party_member">
                <div className="flex front_area">
                    {[0, 1, 2].map(place_no =>
                        <UnitComponent turn={turn} key={`unit${place_no}`} place_no={place_no} selected_place_no={turnData.user_operation.selected_place_no}
                            chengeSkill={chengeSkill} chengeSelectUnit={chengeSelectUnit} />
                    )}
                </div>
                <div className="flex back_area">
                    {[3, 4, 5].map(place_no =>
                        <UnitComponent turn={turn} key={`unit${place_no}`} place_no={place_no} selected_place_no={turnData.user_operation.selected_place_no}
                            chengeSkill={chengeSkill} chengeSelectUnit={chengeSelectUnit} />
                    )}
                    <div>
                        <select className="action_select" value={turnData.user_operation.kb_action} onChange={(e) => chengeAction(e)}>
                            <option value={KB_NEXT_ACTION}>行動開始</option>
                            {turn.over_drive_gauge >= 100 ? <option value={KB_NEXT_ACTION_OD}>行動開始+OD</option> : null}
                        </select>
                        <div
                            className="flex"
                            style={{
                                justifyContent: "flex-end",
                            }}>
                            {turn.start_over_drive_gauge >= 100 && !turn.additional_turn ?
                                <input type="checkbox" className="trigger_over_drive" checked={turn.trigger_over_drive} onChange={(e) => triggerOverDrive(e.target.checked)} />
                                : null}
                            {last_turn === index ?
                                <input className="turn_button next_turn" defaultValue="次ターン" type="button" onClick={clickNextTurn} />
                                :
                                <input className="turn_button return_turn" defaultValue="ここに戻す" type="button" onClick={() => returnTurn(turn.turn_number)} />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="remark_area">
                <textarea className="remaek_text" />
            </div>
        </div>
    )
};
