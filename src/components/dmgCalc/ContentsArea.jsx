import React from "react";
import { ENEMY_CLASS } from "utils/const";
import enemyList from "data/enemyList";
import EnmeyListComponent from "components/EnmeyListComponent";
import EnemyArea from "./EnemyArea";
import HardLayer from "./HardLayer";
import ScoreSetting from "./ScoreSetting";

const ContentsArea = ({ attackInfo, enemyInfo, enemyClass, enemySelect, setEnemyClass, setEnemySelect, state, dispatch }) => {

    const handleChange = (newClass, newSelect) => {
        const filteredEnemy = enemyList.filter((obj) => obj.enemy_class === newClass && obj.enemy_class_no === newSelect);
        let enemyInfo = filteredEnemy.length > 0 ? filteredEnemy[0] : undefined;
        setEnemyClass(newClass);
        setEnemySelect(newSelect);
        dispatch({ type: "SET_ENEMY", enemyInfo: enemyInfo });
    };

    return (
        <>
            <div id="contents_area" className="surround_area adjust_width mx-auto mt-2">
                <label className="area_title">コンテンツ情報</label>
                <EnmeyListComponent enemyClass={enemyClass} enemySelect={enemySelect} handleChange={handleChange} isFreeInput={true} />
                {enemyClass === ENEMY_CLASS.HARD_LAYER &&
                    <HardLayer state={state} dispatch={dispatch} />
                }
                {enemyClass === ENEMY_CLASS.SCORE_ATTACK &&
                    <ScoreSetting state={state} dispatch={dispatch} />
                }
                {/* <BikePartsComponent enemyInfo={enemyInfo} /> */}
                {/* <SeraphCardList enemyInfo={enemyInfo} /> */}
            </div>
            <div id="enemy_status" className="surround_area adjust_width mx-auto mt-2">
                <EnemyArea state={state} dispatch={dispatch} attackInfo={attackInfo} />
            </div>
        </>
    )
};

export default ContentsArea;