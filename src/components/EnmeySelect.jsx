import React from "react";
import { ENEMY_CLASS } from "utils/const";
import enemyList from "data/enemyList";

const EnmeySelect = ({ enemyClass, enemySelect, handleChange, isFreeInput }) => {
    const handleClassChange = (newClass) => {
        localStorage.setItem("enemy_class", newClass);
        localStorage.setItem("enemy_select", "1");
        handleChange(Number(newClass), 1);
    };

    const handleSelectChange = (newSelect) => {
        localStorage.setItem("enemy_select", newSelect);
        handleChange(Number(enemyClass), Number(newSelect));
    };

    let class_List = enemyList.filter((obj) => obj.enemy_class === enemyClass);
    let enemy_status = enemyList.filter((obj) => obj.enemy_class === enemyClass && obj.enemy_class_no === enemySelect)[0];
    if (!enemy_status) {
        enemy_status = enemyList[0];
    }

    // 敵保存ボタンクリック
    const clickEnemySave = () => {
        // let enemy_class_no = Number($("#enemy_list option:selected").val());
        // let enemy_name = window.prompt("敵名称を入力してください", "敵" + enemy_class_no);
        // if (enemy_name === null) {
        //     return;
        // }
        // let enemyInfo = {};
        // enemyInfo.enemy_name = enemy_name
        // enemyInfo.enemy_stat = $("#enemy_stat").val();
        // enemyInfo.max_dp = removeComma($("#enemy_dp_0").val()) + "," + removeComma($("#enemy_dp_1").val()) + "," + removeComma($("#enemy_dp_2").val()) + "," + removeComma($("#enemy_dp_3").val());
        // enemyInfo.max_hp = removeComma($("#enemy_hp").val());
        // let enemyInfo_status_list = ["destruction_limit", "destruction"];
        // enemyInfo_status_list.forEach(value => {
        //     enemyInfo[value] = $("#enemy_" + value).val();
        // });
        // let enemyInfo_resist_list = ["physical_1", "physical_2", "physical_3", "element_0", "element_1", "element_2", "element_3", "element_4", "element_5",];
        // enemyInfo_resist_list.forEach(value => {
        //     enemyInfo[value] = $("#enemy_" + value).data("init");
        // });
        // $("#enemy_list option:selected").text(enemy_name);
        // updateEnemyStatus(enemy_class_no, enemyInfo);
        // localStorage.setItem("free_enemy_" + enemy_class_no, JSON.stringify(enemyInfo));
    }

    return (
        <>
            <div id="enemy_select">
                <select id="enemy_class" value={enemyClass} onChange={(e) => handleClassChange(e.target.value)}>
                    <option value="1">異時層</option>
                    <option value="2">オーブボス</option>
                    <option value="3">時計塔(N)</option>
                    <option value="4">時計塔(H)</option>
                    <option value="5">宝珠の迷宮</option>
                    <option value="6">スコアアタック</option>
                    <option value="7">プリズムバトル</option>
                    <option value="13">イベントプリズム</option>
                    {/* <option value="8">恒星掃戦線</option> */}
                    <option value="9">イベント隠しボス</option>
                    <option value="10">時の修練場/アリーナ</option>
                    {/* <option value="11">制圧戦</option> */}
                    {/* <option value="12">セラフ遭遇戦</option> */}
                    {isFreeInput ?
                        <option value="99">自由入力</option>
                        : null}
                </select>
                <select id="enemy_list" value={enemySelect} onChange={(e) => handleSelectChange(e.target.value)}>
                    {class_List.map((value) => {
                        let text = value.enemy_name;
                        if (enemyClass === ENEMY_CLASS.SCORE_ATTACK) {
                            text = `#${value.sub_no} ${value.enemy_name}`;
                        } else if (enemyClass === ENEMY_CLASS.CLOCK_TOWER_NORMAL || enemyClass === ENEMY_CLASS.CLOCK_TOWER_HARD) {
                            text = `(${value.sub_no}F) ${value.enemy_name}`;
                        }
                        return (
                            <option key={`enemy_class_no${value.enemy_class_no}`} value={value.enemy_class_no}>{text}</option>
                        )
                    })}
                </select>
                <select value={enemy_status.enemy_count} disabled id="enemy_select_count" >
                    <option value="1">1体</option>
                    <option value="2">2体</option>
                    <option value="3">3体</option>
                </select>
                {enemyClass === ENEMY_CLASS.FREE_INPUT ?
                    <input id="enemy_save" type="button" value="保存" onClick={clickEnemySave} />
                    : null
                }
            </div>
        </>
    )
};

export default EnmeySelect;