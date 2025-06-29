const ContentsArea = ({ attackInfo, enemyInfo, enemyClass, enemySelect, setEnemyClass, setEnemySelect, state, dispatch }) => {

    const handleChange = (newClass, newSelect) => {
        const filteredEnemy = enemy_list.filter((obj) => obj.enemy_class == newClass && obj.enemy_class_no == newSelect);
        let enemyInfo = filteredEnemy.length > 0 ? filteredEnemy[0] : undefined;
        setEnemyClass(newClass);
        setEnemySelect(newSelect);
        dispatch({ type: "SET_ENEMY", enemy_info: enemyInfo });
    };

    return (
        <>
            <div id="contents_area" className="surround_area adjust_width mx-auto mt-2">
                <label className="area_title">コンテンツ情報</label>
                <EnmeyListComponent enemyClass={enemyClass} enemySelect={enemySelect} handleChange={handleChange} isFreeInput={true} />
                <HardLayer state={state} dispatch={dispatch} />
                {enemyClass == ENEMY_CLASS.SCORE_ATTACK ?
                    <ScoreSetting state={state} dispatch={dispatch} />
                    : null
                }
                <BikePartsComponent enemy_info={enemyInfo} />
                <SeraphCardList enemy_info={enemyInfo} />
            </div>
            <div id="enemy_status" className="surround_area adjust_width mx-auto mt-2">
                <EnemyAreaComponent state={state} dispatch={dispatch} attackInfo={attackInfo} />
            </div>
        </>
    )
};
