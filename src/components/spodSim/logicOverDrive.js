// 開始時点のODゲージを取得
export const getInitOverDriveGauge = (turn) => {
    return turn.startOverDriveGauge + turn.initAddOverDriveGauge;
};

// 開始時点のODゲージを計算
export const calcInitOverDriveGauge = (userOperation) => {
    let initOverDriveGauge = 0;
    if (userOperation.triggerKishin) {
        initOverDriveGauge = 15;
    }
    return initOverDriveGauge;
};