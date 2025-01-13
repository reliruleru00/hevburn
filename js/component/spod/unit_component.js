const UnitSp = ({ unit }) => {
    let unit_sp;
    if (unit.sp_cost == 99) {
        unit_sp = 0;
    } else {
        unit_sp = unit.sp + unit.over_drive_sp;
        if (unit_sp > 99) unit_sp = 99;
        unit_sp -= unit.sp_cost;
    }

    let className = "unit_sp" + (unit_sp < 0 ? " minus" : "");
    return <div className={className}>{unit_sp + (unit.add_sp > 0 ? ("+" + unit.add_sp) : "")}</div>;
}

const UnitSkillSelect = ({ turn, unit, place_no }) => {
    let skill_list = unit.skill_list
    if (place_no < 3) {
        skill_list = skill_list.filter(skill => {
            if (skill.skill_id == 495) {
                // 夜醒
                return !turn.additional_turn;
            }
            if (skill.skill_attribute === ATTRIBUTE_NORMAL_ATTACK) {
                // 通常攻撃
                return unit.style.style_info.role != ROLE_ADMIRAL;
            }
            if (skill.skill_attribute === ATTRIBUTE_COMMAND_ACTION) {
                // 指揮行動
                return unit.style.style_info.role == ROLE_ADMIRAL;
            }
            if (skill.skill_attribute === ATTRIBUTE_PURSUIT || skill.skill_id == 2) {
                // 後衛専用
                return false;
            }
            return true;
        })
    } else {
        skill_list = unit.skill_list.filter(skill => {
            if (skill.skill_attribute === ATTRIBUTE_PURSUIT || skill.skill_id == 2) {
                // 後衛専用
                return true;
            }
            return false;
        })
    }

    const recoil = unit.buff_list.filter((obj) => obj.buff_kind == BUFF_RECOIL);
    let not_action = (recoil.length > 0 || !unit.style || (turn.additional_turn && !unit.additional_turn && index <= 2))
    let className = "unit_skill " + (not_action ? "invisible" : "");
    return (<select className={className} onChange={(e) => chengeSkill(Number(e.target.value), place_no)} value={unit.select_skill_id} >
        {skill_list.map(skill => {
            let text = skill.skill_name;
            let sp_cost = 0;
            if (skill.skill_attribute === ATTRIBUTE_NORMAL_ATTACK) {
                text += `(${physical_name[skill.attack_physical]}・${element_name[unit.normal_attack_element]})`;
            } else if (skill.skill_id === 2) {
            } else if (skill.skill_attribute === ATTRIBUTE_COMMAND_ACTION) {
            } else if (skill.skill_attribute === ATTRIBUTE_PURSUIT) {
                text += `(${physical_name[skill.attack_physical]})`;
            } else if (skill.attack_id) {
                sp_cost = getSpCost(turn, skill, unit);
                text += `(${physical_name[skill.attack_physical]}・${element_name[skill.attack_element]}/${sp_cost})`;
            } else if (skill.skill_id == 0) {
                sp_cost = 0;
            } else {
                sp_cost = getSpCost(turn, skill, unit);
                text += `(${sp_cost})`;
            }
            return (<option value={skill.skill_id} key={`skill${skill.skill_id}`} data-sp_cost={sp_cost}>{text}</option>)
        }
        )}
    </select>
    );
}

const BuffIconComponent = ({ buff_list, loop_limit, loop_step, place_no, turn_number }) => {
    const scrollContentRef = React.useRef(null);

    React.useEffect(() => {
        const scrollContent = scrollContentRef.current;
        if (!scrollContent) return;

        const unitBuffs = scrollContent.querySelectorAll(".unit_buff");

        if (unitBuffs.length > loop_limit * loop_step) {
            scrollContent.classList.add("scroll");

            // 動的アニメーション生成
            const duration = unitBuffs.length * 0.5; // 例: アイコン数に応じて2秒ごとに1アイコンがスクロール
            const translateXValue = unitBuffs.length * 24;
            const animationName = `scroll-${turn_number}-${place_no}`;

            // @keyframesを動的に追加
            const styleSheet = document.styleSheets[0];
            const keyframes = `
          @keyframes ${animationName} {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-${translateXValue}px);
            }
          }
        `;

            // 古いアニメーションを削除
            for (let i = 0; i < styleSheet.cssRules.length; i++) {
                if (styleSheet.cssRules[i].name === animationName) {
                    styleSheet.deleteRule(i);
                    break;
                }
            }

            // 新しいアニメーションを挿入
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
            scrollContent.style.animation = `${animationName} ${duration}s linear infinite`;
            scrollContent.classList.remove("flex-wrap");

            // アイコンを複製
            unitBuffs.forEach((buff) => {
                const clonedBuff = buff.cloneNode(true);
                scrollContent.appendChild(clonedBuff);
            });
        } else {
            scrollContent.classList.remove("scroll");
            scrollContent.classList.add("flex-wrap");
        }
    }, [buff_list, loop_limit, loop_step, place_no, turn_number]);

    // バフリストの表示    
    const showBuffList = (e, buff_list) => {
        if (buff_list.length > 0) {
            e.stopPropagation();
            setBuffList(buff_list);
            MicroModal.show('modal_buff_detail_list');
        }
    };

    return (
        <div className="scroll-container icon_list" onClick={(e) => showBuffList(e, buff_list)}>
            <div className="scroll-content" ref={scrollContentRef}>
                {buff_list.map((buffInfo, index) => (
                    <img
                        key={index}
                        src={getBuffIconImg(buffInfo)}
                        className="unit_buff"
                    />
                ))}
            </div>
        </div>
    );
}

const UnitComponent = ({ turn, place_no, selected_place_no }) => {
    const filterUnit = turn.unit_list.filter(unit => unit.place_no === place_no);
    if (filterUnit.size === 0) {
        return null;
    }
    const unit = filterUnit[0];
    let icon = "img/cross.png";
    if (unit?.style?.style_info?.image_url) {
        icon = "icon/" + unit.style.style_info.image_url;
    }

    let className = "unit_select " + (place_no == selected_place_no ? "unit_selected" : "");
    return (<div className={className} onClick={(e) => { chengeSelectUnit(e, place_no) }}>
        <UnitSkillSelect turn={turn} unit={unit} place_no={place_no} />
        <div className="flex">
            <div>
                <img className="unit_style" src={icon} />
                {
                    unit?.style?.style_info ? <UnitSp unit={unit} /> : null
                }
            </div>
            <BuffIconComponent buff_list={unit.buff_list} loop_limit={3} loop_step={2} place_no={place_no} turn_number={turn.turn_number} />
        </div>
    </div>
    )
};