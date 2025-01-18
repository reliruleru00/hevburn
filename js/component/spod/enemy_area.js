const EnemyAreaComponent = ({ enemy_class, enemy_select }) => {
    const physical = ["slash", "stab", "strike"];
    const element = ["none", "fire", "ice", "thunder", "light", "dark"];

    const [enemy, setEnemy] = React.useState({
        enemy_class: enemy_class,
        enemy_select: enemy_select
    });

    const setEnemyStatus = (enemy_class, enemy_select) => {
        setEnemy({enemy_class: enemy_class, enemy_select: enemy_select});
    }
    
    const enemy_status = enemy_list.filter((obj) => 
        obj.enemy_class == enemy.enemy_class && obj.enemy_class_no == enemy.enemy_select)[0];

    return (
        <div>
            <EnmeyListComponent enemy_class={enemy.enemy_class} enemy_select={enemy.enemy_select} handleChange={setEnemyStatus} />
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
                                <input className={className} id={`enemy_physical_${index + 1}`} type="text" onChange={(e) =>changeEnemyType(e)}
                                    value={enemy_status[`physical_${index + 1}`]} />
                            </div>
                        );
                    })}
                    {element.map((item, index) => {
                        let className = "enemy_type_value enemy_input";
                        let val = enemy_status[`element_${index}`];
                        if (val < 100) {
                            className += " enemy_resist";
                        } else if (val > 100) {
                            className += " enemy_weak";
                        }
                        return (
                            <div key={`element_${index}`} className={item}>
                                <input className="enemy_type_icon" src={`img/${item}.webp`} type="image" />
                                <input className={className} id={`enemy_element_${index}`} type="text" onChange={(e) =>changeEnemyType(e)}
                                    value={enemy_status[`element_${index}`]} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
};

$(function () {
    let enemy_class = localStorage.getItem("enemy_class");
    enemy_class = enemy_class ? enemy_class : "1";
    let enemy_select = localStorage.getItem("enemy_select");
    enemy_select = enemy_select ? enemy_select : "1";
    const rootElement = document.getElementById('enemy_area');
    ReactDOM.createRoot(rootElement).render(<EnemyAreaComponent enemy_class={enemy_class} enemy_select={enemy_select} />);
});
