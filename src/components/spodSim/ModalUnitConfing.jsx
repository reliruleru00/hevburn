import React from "react";

const ModalUnitConfing = ({ turn, closeModal, placeNo }) => {
    const filterUnit = turn.unitList.filter(unit => unit.placeNo === placeNo);
    const unit = filterUnit[0];

    return (
        <div className="p-6">
            <div className="skill_select_container">
                <span className="modal_label">ユニット設定</span>
                <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="w-[350px] mx-auto grid grid-cols-2 text-center">
                <span>SP</span>
                <input className="status" type="number" value={unit.sp} />
                <span>EP</span>
                <input className="status" type="number" value={unit.ep} />
                <span>token</span>
                <input className="status" type="number" value={unit.token} />
            </div>
            <div className="text-center mt-2">
                <input type="button" className="w-24" value={"設定"} />
            </div>
        </div>
    )
};

export default ModalUnitConfing;