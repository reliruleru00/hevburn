


const ModalEffectSelection = ({ closeModal, onSelect, effectType }) => {

    const setSelectEffect = (effect) => {
        onSelect(effect);
        closeModal();
    }

    let value = [];
    switch (effectType) {
        case 1:
            value = ["攻撃力低下(50%)", "防御力低下(50%)"];
            break;
        case 2:
            value = ["破壊率200%未満", "破壊率200%以上"];
            break;
        case 3:
            value = ["BREAKなし", "BREAKあり"];
            break;
        case 4:
            value = ["SP回復なし", "SP回復(30%)"];
            break;
        case 5:
            value = ["影分身なし", "影分身あり"];
            break;
        case 6:
            value = ["ダウンターンなし", "ダウンターンあり"];
            break;
        case 7:
            value = ["バフ解除なし", "バフ解除あり"];
            break;
        case 8:
            value = ["DP100%未満", "DP100%以上"];
            break;
    }
    return (
        <div className="p-6">
            <div className="mb-4">
                <label className="modal_label">効果選択</label>
            </div>
            <div className="select_effect">
                <input
                    className="effect_button"
                    data-value="0"
                    defaultValue={value[0]}
                    onClick={() => setSelectEffect(0)}
                    type="button"
                />
                <input
                    className="effect_button"
                    data-value="1"
                    defaultValue={value[1]}
                    onClick={() => setSelectEffect(1)}
                    type="button"
                />
            </div>
        </div>
    )
};