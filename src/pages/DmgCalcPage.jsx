import React from 'react';
import ReactModal from 'react-modal';
import StyleListProvider from 'components/StyleListProvider';
import DamageCalculation from 'components/dmgCalc/DamageCalculation';
import { updateEnemyStatus } from 'components/dmgCalc/logic';
import HeaderNav from 'components/HeaderNav';
import 'assets/styles/header.css';
import 'assets/styles/common.css';
import 'assets/styles/damege.css';
import 'assets/styles/micromodal.css';

const DmgCalcPage = () => {

  React.useEffect(() => {
    ReactModal.setAppElement("#root");
    for (let i = 0; i < 10; i++) {
      let freeEnemy = localStorage.getItem("free_enemy_" + i);
      if (freeEnemy !== null) {
        try {
          updateEnemyStatus(i, JSON.parse(freeEnemy));
        } catch (e) {
          // パースエラー時の処理
          console.error(`free_enemy_${i} の取得に失敗しました`, e);
        }
      }
    }
  }, []);

  return (
    <>
      <HeaderNav />
      <StyleListProvider>
        <DamageCalculation />
      </StyleListProvider>
    </>
  );
};

export default DmgCalcPage;