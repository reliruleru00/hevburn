const EnemyArea = ({ enemy, setEnemy, detailSetting }) => {
    const physical = ["slash", "stab", "strike"];
    const element = ["none", "fire", "ice", "thunder", "light", "dark"];

    const setEnemyStatus = (enemy_class, enemy_select) => {
        setEnemy({ enemy_class: enemy_class, enemy_select: enemy_select });
    }

    let enemy_status = enemy_list.filter((obj) =>
        obj.enemy_class == enemy.enemy_class && obj.enemy_class_no == enemy.enemy_select)[0];
    if (!enemy_status) {
        enemy_status = enemy_list[0];
    }

    return (
        <div className="surround_area mx-auto mt-2 adjust_width" id="enemy_area">
            <label className="area_title">敵情報</label>
            <EnmeyListComponent enemyClass={enemy.enemy_class} enemySelect={enemy.enemy_select} handleChange={setEnemyStatus} isFreeInput={false} />
            <div className="resist_area mx-auto mt-2">
                <div className="grid grid-cols-9">
                    {physical.map((item, index) => {
                        let className = "enemy_type_value enemy_input";
                        let val = enemy_status[`physical_${index + 1}`];
                        if (val < 100) {
                            className += " enemy_resist";
                        } else if (val > 100) {
                            className += " enemy_weak";
                        }
                        return (
                            <div key={`physical_${index}`} className={item}>
                                <input className="enemy_type_icon" src={`img/${item}.webp`} type="image" />
                                <input className={className} id={`enemy_physical_${index + 1}`} type="text" onChange={(e) => changeEnemyType(e)}
                                    value={enemy_status[`physical_${index + 1}`]} />
                            </div>
                        );
                    })}
                    {element.map((item, index) => {
                        let className = "enemy_type_value enemy_input";
                        let val = enemy_status[`element_${index}`] + Number(detailSetting[`changeElement${index}`]);;
                        if (val < 100) {
                            className += " enemy_resist";
                        } else if (val > 100) {
                            className += " enemy_weak";
                        }
                        return (
                            <div key={`element_${index}`} className={item}>
                                <input className="enemy_type_icon" src={`img/${item}.webp`} type="image" />
                                <input className={className} id={`enemy_element_${index}`} type="text" onChange={(e) => changeEnemyType(e)}
                                    value={val} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
};