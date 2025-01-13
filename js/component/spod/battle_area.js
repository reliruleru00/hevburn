const TurnDataComponent = ({ turn }) => {
    const [turnData, setTurnData] = React.useState({
        "filed": turn.field,
        "enemy_count": turn.enemy_count,
        "select_skill": [turn.unit_list[0].select_skill_id, turn.unit_list[1].select_skill_id, turn.unit_list[2].select_skill_id, 0, 0, 0],
        "trigger_over_drive": false,
        selected_place_no: -1,
    });

    const chengeEnemyCount = (e) => {
        turn.enemy_count = e.target.value;
        setTurnData({ ...turnData, "enemy_count": e.target.value });
    }

    const chengeField = (e) => {
        turn.field = e.target.value;
        setTurnData({ ...turnData, "field": e.target.value });
    }

    window.chengeSkill = function (skill_id, place_no) {
        let select_skill = turnData.select_skill;
        select_skill[place_no] = skill_id;
        const unit = turn.unit_list.filter(unit => unit.place_no === place_no)[0];
        unit.select_skill_id = skill_id;
        if (skill_id !== 0) {
            unit.sp_cost = getSpCost(turn, getSkillData(skill_id), unit);
        } else {
            unit.sp_cost = 0;
        }
        processSkillChange(unit, skill_id, select_skill);
    }

    async function processSkillChange(unit, skill_id, select_skill) {
        const buff_list = getBuffInfo(skill_id);
        if (!await handleTargetSelection(unit, turn, buff_list)) {
            unit.select_skill_id = unit.init_skill_id;
            chengeSkill(unit.init_skill_id, unit.place_no);
        }
        if (!await handleEffectSelection(unit, skill_id, buff_list)) {
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

        setTurnData({ ...turnData, "select_skill": select_skill });
    }

    function triggerOverDrive(checked) {
        if (checked) {
            turn.startOverDrive();
        } else {
            turn.removeOverDrive();
        }
        setTurnData({ ...turnData, "trigger_over_drive": checked });
    }

    window.chengeSelectUnit = function (e, place_no) {
        if (e.target.tagName === 'SELECT') {
            e.stopPropagation();
            return;
        }
        let new_unit = getUnitData(turn, place_no);
        if (new_unit.blank) {
            return;
        }
        let old_place_no = turnData.selected_place_no;
        let select_skill = turnData.select_skill;
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
                }
                // 後衛と前衛の交換
                if (3 <= place_no && old_place_no <= 2) {
                    old_unit.select_skill_id = 0;
                    old_unit.sp_cost = 0;
                    old_unit.buff_effect_select_type = 0;
                    old_unit.buff_target_chara_id = 0;
                    new_unit.select_skill_id = new_unit.init_skill_id;
                }
                select_skill[place_no] = old_unit.select_skill_id;
                select_skill[old_place_no] = new_unit.select_skill_id;
            }
            place_no = -1;
        }
        setTurnData({ ...turnData, "selected_place_no": place_no, "select_skill": select_skill});
    }

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
                            </div>
                        </div>
                    </div>
                </div>
                <OverDriveGauge turn={turn} select_skill={turnData.select_skill} />
            </div>
            <div className="party_member">
                <div className="flex front_area">
                    {[0, 1, 2].map(place_no => 
                        <UnitComponent turn={turn} key={`unit${place_no}`} place_no={place_no} selected_place_no={turnData.selected_place_no}/>
                    )}
                </div>
                <div className="flex back_area">
                    {[3, 4, 5].map(place_no =>
                        <UnitComponent turn={turn} key={`unit${place_no}`} place_no={place_no} selected_place_no={turnData.selected_place_no}/>
                    )}
                    <div>
                        <select className="action_select">
                            <option value="1">行動開始</option>
                            {turn.over_drive_gauge >= 100 ? <option value="2">行動開始+OD</option> : null}
                        </select>
                        <div
                            className="flex"
                            style={{
                                justifyContent: "flex-end",
                            }}>
                            {turn.start_over_drive_gauge >= 100 && !turn.additional_turn ?
                                <input type="checkbox" class="trigger_over_drive" onChange={(e) => triggerOverDrive(e.target.checked)} />
                                : null}
                            {last_turn === turn.turn_number ?
                                <input className="turn_button next_turn" defaultValue="次ターン" type="button" />
                                :
                                <input className="turn_button return_turn" defaultValue="ここに戻す" type="button" />
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


const BattleAreaComponent = () => {
    const [turnList, setTurnList] = React.useState({
        "last_turn": last_turn,
        "turn_list": turn_list
    });

    // 状態を外部で更新できるようにする
    window.updateTurnList = (last_turn, turn_list) => {
        setTurnList({
            "last_turn": last_turn,
            "turn_list": turn_list
        });
    };

    return (
        <>
            {turnList.turn_list.map((turn, index) => {
                return <TurnDataComponent turn={turn} key={index} />
            })}
        </>
    )
};

$(function () {
    const rootElement = document.getElementById('battle_area');
    ReactDOM.createRoot(rootElement).render(<BattleAreaComponent />);
});