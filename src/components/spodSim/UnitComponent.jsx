import React from "react";
import { getCharaData } from "utils/common";
import { SKILL_ID, ABILITY_ID, BUFF, ROLE, ATTRIBUTE, SKILL } from "utils/const";
import { PHYSICAL_NAME, ELEMENT_NAME, ABILIRY_TIMING } from "./const";
import BuffIconComponent from "./BuffIconComponent";
import { getSkillIdToAttackInfo, getSpCost, checkAbilityExist } from "./logic";
import icons from 'assets/thumbnail';
import crossIcon from 'assets/img/cross.png';

const UnitSp = ({ unit }) => {
    let unit_sp;
    let unit_ep = unit.ep;
    if (unit.sp_cost >= 90) {
        unit_sp = 0;
    } else {
        unit_sp = unit.sp + unit.overDriveSp;
        if (unit_sp > 99) unit_sp = 99;

        // ノヴァエリミネーション
        if (unit.select_skill_id === SKILL_ID.NOVA_ELIMINATION) {
            unit_ep -= unit.sp_cost;
        } else {
            unit_sp -= unit.sp_cost;
        }
    }

    let className = "unit_sp" + (unit_sp < 0 ? " minus" : "");
    return (
        <>
            <div className={className}>
                <span>{unit_sp + (unit.add_sp > 0 ? ("+" + unit.add_sp) : "")}</span>
                {
                    (unit.ep !== 0 ? <span className="unit_ep">{`EP${unit_ep}`}</span> : "")
                }
            </div>
        </>
    )
}

const UnitSkillSelect = React.memo(({ turn, field, unit, place_no, select_skill_id, trigger_over_drive, chengeSkill, isCapturing }) => {
    if (unit.blank) {
        return (
            <select className={"unit_skill invisible"} >
            </select>
        );
    }
    let skillList = unit.skillList
    if (place_no < 3) {
        skillList = skillList.filter(skill => {
            if (skill.skill_id === SKILL_ID.WAKING_NIGHT) {
                // 夜醒
                return !turn.additional_turn;
            }
            if (skill.skill_attribute === ATTRIBUTE.NORMAL_ATTACK) {
                // 通常攻撃
                return unit.style.styleInfo.role !== ROLE.ADMIRAL;
            }
            if (skill.skill_attribute === ATTRIBUTE.COMMAND_ACTION) {
                // 指揮行動
                return unit.style.styleInfo.role === ROLE.ADMIRAL;
            }
            if (skill.skill_attribute === ATTRIBUTE.PURSUIT_ONLY) {
                // 追撃のみ発動可能
                return false;
            }
            const HIDDEN_SKILL_ID = [SKILL.NONE, SKILL.PURSUIT, SKILL.AUTO_PURSUIT]
            if (HIDDEN_SKILL_ID.includes(skill.skill_id)) {
                // 非表示スキルリスト
                return false;
            }
            return true;
        })
    } else {
        skillList = unit.skillList.filter(skill => {
            if (skill.skill_id === SKILL.AUTO_PURSUIT) {
                if (checkAbilityExist(unit[`ability_${ABILIRY_TIMING.OTHER}`], ABILITY_ID.AUTO_PURSUIT)) {
                    // 自動追撃
                    return true;
                }
            }
            if (skill.skill_id === SKILL.NONE) {
                // なし
                return true;
            }
            if (skill.skill_id === SKILL.PURSUIT) {
                // 追撃
                return true;
            }
            if (skill.skill_attribute === ATTRIBUTE.PURSUIT_ONLY) {
                // 追撃専用
                return true;
            }
            return false;
        })
    }

    const recoil = unit.buffList.filter((obj) => obj.buff_kind === BUFF.RECOIL);
    let not_action = (recoil.length > 0 || !unit.style || (turn.additional_turn && !unit.additional_turn && place_no <= 2))
    let className = "unit_skill " + (not_action ? "invisible" : "");
    let physical = getCharaData(unit.style.styleInfo.chara_id).physical;
    return (<select className={className} onChange={(e) => chengeSkill(Number(e.target.value), place_no)} value={unit.select_skill_id} >
        {skillList.filter((obj) => obj.skill_id === unit.select_skill_id || !isCapturing).map(skill => {
            let text = skill.skill_name;
            const attackInfo = getSkillIdToAttackInfo(turn, skill.skill_id);
            let sp_cost = 0;
            if (skill.skill_attribute === ATTRIBUTE.NORMAL_ATTACK) {
                text += `(${PHYSICAL_NAME[physical]}・${ELEMENT_NAME[unit.normalAttackElement]})`;
            } else if (skill.skill_id === 0 || skill.skill_id === 2) {
            } else if (skill.skill_attribute === ATTRIBUTE.COMMAND_ACTION) {
            } else if (skill.skill_attribute === ATTRIBUTE.PURSUIT) {
                text += `(${PHYSICAL_NAME[physical]})`;
            } else if (attackInfo) {
                sp_cost = getSpCost(turn, skill, unit);
                text += `(${PHYSICAL_NAME[physical]}・${ELEMENT_NAME[attackInfo.attack_element]}/${sp_cost})`;
            } else {
                sp_cost = getSpCost(turn, skill, unit);
                text += `(${sp_cost})`;
            }
            return (<option value={skill.skill_id} key={`skill${skill.skill_id}${skill.attack_id}`}>{text}</option>)
        }
        )}
    </select>
    );
}, (prevProps, nextProps) => {
    return prevProps.turn === nextProps.turn
        && prevProps.field === nextProps.field
        && prevProps.unit === nextProps.unit
        && prevProps.place_no === nextProps.place_no && prevProps.select_skill_id === nextProps.select_skill_id
        && prevProps.trigger_over_drive === nextProps.trigger_over_drive
        && prevProps.isCapturing === nextProps.isCapturing;
});

const UnitComponent = ({ turn, place_no, selected_place_no, chengeSkill, chengeSelectUnit, hideMode, isCapturing, clickBuffIcon }) => {
    const filterUnit = turn.unitList.filter(unit => unit.place_no === place_no);
    const unit = filterUnit[0];

    let icon = icons[unit?.style?.styleInfo?.image_url.replace(/\.webp$/, "")] || crossIcon;
    let loopLimit = 3;
    if (hideMode) {
        loopLimit = 4;
    }
    let className = "unit_select " + (place_no === selected_place_no ? "unit_selected" : "");
    return (
        <div className={className} onClick={(e) => { chengeSelectUnit(e, place_no) }}>
            <UnitSkillSelect turn={turn} field={turn.field}
                unit={unit} place_no={place_no} chengeSkill={chengeSkill} select_skill_id={unit.select_skill_id} trigger_over_drive={turn.trigger_over_drive} isCapturing={isCapturing} />
            <div className="flex">
                <div>
                    <img className="unit_style" src={icon} alt="" />
                    {
                        unit?.style?.styleInfo ? <UnitSp unit={unit} /> : null
                    }
                </div>
                {place_no <= 2 || hideMode ?
                    <BuffIconComponent buffList={unit.buffList} loopLimit={loopLimit} loopStep={2} placeNo={place_no} turnNumber={turn.turn_number} clickBuffIcon={clickBuffIcon} />
                    : null
                }
            </div>
        </div>
    )
};

export default UnitComponent;