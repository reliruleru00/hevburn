const AbilityCheckbox = ({ attackInfo, abilityList, rengeArea }) => {
    if (!attackInfo) return null;
    const kindAbilityList = abilityList.filter(ability => {
        switch (ability.range_area) {
            case RANGE.FIELD:
                return false;
            case RANGE.SELF:
                if (attackInfo && attackInfo.chara_id !== ability.chara_id) {
                    return false;
                }
                if (rengeArea !== 0) {
                    return false;
                }
                break;
            case RANGE.ALLY_FRONT:
            case RANGE.ALLY_BACK:
            case RANGE.ALLY_ALL:
            case RANGE.ENEMY_ALL:
            case RANGE.OTHER:
                switch (ability.activation_place) {
                    case 1: // 前衛
                        if (rengeArea !== 1) {
                            return false;
                        }
                        break;
                    case 2: // 後衛
                        if (rengeArea !== 2) {
                            return false;
                        }
                        break;
                    case 3: // 全体
                    case 0: // その他
                        if (rengeArea !== 3) {
                            return false;
                        }
                        break;
                }
                break;
        }
        if (ability.element !== 0 && ability.element !== attackInfo.attack_element) {
            return false;
        }
        if (ability.physical !== 0 && ability.physical !== attackInfo.attack_physical) {
            return false;
        }

        return true;
    });

    let attackCharaId = attackInfo.chara_id;
    return (
        <>
            {kindAbilityList.map(ability => {
                const key = `ability-${ability.ability_id}-${ability.chara_id}`
                const name = ability.chara_name;
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
                return (
                    <div key={key}>
                        <input
                            type="checkbox"
                            className="ability"
                            id={key}
                            disabled={disabled}
                            defaultChecked={checked}
                            data-effect_size={ability.effect_size}
                            data-ability_id={ability.ability_id}
                        />
                        <label htmlFor={key}
                            className="checkbox01">
                            {`${name}: ${ability.ability_name} (${ability.ability_short_explan})`}
                        </label>
                    </div>
                )
            }
            )}
        </>
    );
};