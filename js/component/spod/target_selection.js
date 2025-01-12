


const TargetSelectionComponent = () => {

    const [unitList, setUnitList] = React.useState([]);

    function showModalSelectTarget(turn) {
        return new Promise((resolve) => {
            setUnitList(turn.unit_list);
            MicroModal.show('modal_target_selection', {
                onClose: (modal) => {
                    resolve($(modal).data('value') );
                    $(modal).removeData('value');
                }
            });
        });
    }

    window.handleTargetSelection = async function (unit, turn, buff_list) {
        if (buff_list.some(buff => buff.range_area == RANGE_ALLY_UNIT || buff.range_area == RANGE_SELF_AND_UNIT)) {
            const chara_id = await showModalSelectTarget(turn);
            if (!chara_id && chara_id !== 0) {
                unit.buff_target_chara_id = 0;
                return false;
            }
            unit.buff_target_chara_id = chara_id;
        } else {
            unit.buff_target_chara_id = 0;
        }
        return true;
    }

    const setSelectTarget = (chara_id) => {
        $('#modal_target_selection').data('value', chara_id);
        MicroModal.close('modal_target_selection');
    }
    return (
        <>
            <div>
                <label className="modal_label">対象選択</label>
            </div>
            <div className="troops">
                {unitList.map((unit, index) => {
                    let src = "icon/" + unit.style.style_info.image_url;
                    return <input className="select_target" type="image" src={src} data_value={unit.style.style_info.style_id} key={`select_target${index}`} 
                        onClick={() => setSelectTarget(unit.style.style_info.chara_id)}
                    />
                }
                )}
            </div>
        </>
    )
};
$(function () {
    const rootElement = document.getElementById('target_selection');
    ReactDOM.createRoot(rootElement).render(<TargetSelectionComponent />);
});