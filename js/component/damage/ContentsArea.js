const ContentsArea = ({ attackInfo, enemyInfo, enemyClass, enemySelect, setEnemyInfo, setEnemyClass, setEnemySelect, state, dispatch }) => {

    const handleChange = (newClass, newSelect) => {
        const filteredEnemy = enemy_list.filter((obj) => obj.enemy_class == newClass && obj.enemy_class_no == newSelect);
        let enemyInfo = filteredEnemy.length > 0 ? filteredEnemy[0] : undefined;
        setEnemyClass(newClass);
        setEnemySelect(newSelect);
        setEnemyInfo(enemyInfo);
        dispatch({ type: "SET_ENEMY", enemy_info: enemyInfo });
    };

    // 移行中の暫定対応
    if (enemyClass == ENEMY_CLASS_SCORE_ATTACK) {
        $("#prediction_score").show();
    } else {
        $("#prediction_score").hide();
    }
    if (state.dpRate.reduce((sum, value) => sum + value, 0) == 0) {
        $(".row_dp").css("display", "none");
    } else {
        $(".row_dp").css("display", "table-cell");
    }
    return (
        <>
            <div id="contents_area" className="surround_area adjust_width mx-auto mt-2">
                <label className="area_title">コンテンツ情報</label>
                <EnmeyListComponent enemyClass={enemyClass} enemySelect={enemySelect} handleChange={handleChange} isFreeInput={true} />
                <HardLayerComponent enemy_info={enemyInfo} />
                <ScoreSettingComponent enemy_info={enemyInfo} state={state} dispatch={dispatch} />
                <BikePartsComponent enemy_info={enemyInfo} />
                <SeraphCardList enemy_info={enemyInfo} />
            </div>
            <div id="enemy_status" className="surround_area adjust_width mx-auto mt-2">
                <EnemyAreaComponent state={state} dispatch={dispatch} attackInfo={attackInfo} />
            </div>
        </>
    )
};
