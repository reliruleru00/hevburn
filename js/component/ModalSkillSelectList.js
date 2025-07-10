const SkillCheckComponent = ({ skill, exclusionSkillList, changeSkillList }) => {
    const skill_id = skill.skill_id;
    const checked = !exclusionSkillList.includes(skill_id);
    return (
        <div key={skill_id}>
            <input className="passive_skill" id={`skill_${skill_id}`} type="checkbox" checked={checked} onChange={e => changeSkillList(e, skill_id)} />
            <label className="checkbox01" htmlFor={`skill_${skill_id}`}>{skill.skill_name}</label>
        </div>
    );
}

const ModalSkillSelectList = ({ index, closeModal }) => {
    const { styleList, setStyleList } = React.useContext(StyleListContext);
    const [skillSet, setSkillSet] = React.useState({
        exclusionSkillList: styleList.selectStyleList[index].exclusionSkillList,
    });

    let hasSkillList = [];
    if (styleList.selectStyleList[index]) {
        const styleInfo = styleList.selectStyleList[index].styleInfo;
        hasSkillList = skill_list.filter(obj =>
            (obj.chara_id === styleInfo.chara_id || obj.chara_id === 0) &&
            (obj.style_id === styleInfo.style_id || obj.style_id === 0) &&
            obj.skill_attribute != ATTRIBUTE.NORMAL_ATTACK &&
            obj.skill_attribute != ATTRIBUTE.PURSUIT &&
            obj.skill_attribute != ATTRIBUTE.COMMAND_ACTION &&
            obj.skill_attribute != ATTRIBUTE.NOT_ACTION
        );
    }

    const changeSkillList = (e, skill_id) => {
        const checked = e.target.checked;
        const updatedList = checked
            ? skillSet.exclusionSkillList.filter(id => id !== skill_id)
            : [...skillSet.exclusionSkillList, skill_id];

        setSkillSet({ ...skillSet, exclusionSkillList: updatedList });
    };

    const clickReleaseBtn = () => {
        const allSkillIds = hasSkillList.map(skill => skill.skill_id);
        setSkillSet({ ...skillSet, exclusionSkillList: [...allSkillIds] });
    };

    const clickOrbReleaseBtn = () => {
        const orbSkillIds = hasSkillList
            .filter(skill => skill.skill_id >= 9000)
            .map(skill => skill.skill_id);

        const updatedList = Array.from(new Set([
            ...skillSet.exclusionSkillList,
            ...orbSkillIds,
        ]));
        setSkillSet({ ...skillSet, exclusionSkillList: updatedList });
    };

    const clickSetBtn = () => {
        const updatedSelectStyleList = [...styleList.selectStyleList];
        updatedSelectStyleList[index] = {
            ...updatedSelectStyleList[index],
            exclusionSkillList: [...skillSet.exclusionSkillList],
        };

        setStyleList({ ...styleList, selectStyleList: updatedSelectStyleList });
        closeModal();
    };

    // 習得スキルは同一スキルを排除
    const learnSkillList = Array.from(
        new Map(hasSkillList.filter((skill) => skill.skill_id < 9000 && skill.skill_active == 0).map(item => [item.skill_id, item])).values()
    );
    const passiveSkillList = hasSkillList.filter((skill) => skill.skill_id < 9000 && skill.skill_active == 1);
    const orbSkillList = hasSkillList.filter((skill) => skill.skill_id > 9000);
    return (
        <div className="p-6">
            <div className="skill_select_container">
                <span className="modal_label">スキル設定</span>
                <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <div className="text-sm text-right">
                <input className="w-20" defaultValue="全て外す" type="button" onClick={clickReleaseBtn} />
            </div>
            <div>
                <span>■習得スキル</span>
                {learnSkillList.map((skill) =>
                    <SkillCheckComponent key={`skill${skill.skill_id}`} skill={skill} exclusionSkillList={skillSet.exclusionSkillList} changeSkillList={changeSkillList} />
                )}
                {passiveSkillList.length > 0 &&
                    <>
                        <span>■パッシブスキル</span>
                        {passiveSkillList.map((skill) =>
                            <SkillCheckComponent key={`skill${skill.skill_id}`} skill={skill} exclusionSkillList={skillSet.exclusionSkillList} changeSkillList={changeSkillList} />
                        )}
                    </>
                }
                <div>
                    <span>■オーブスキル</span>
                    <input className="w-32 text-sm" defaultValue="オーブのみ全て外す" type="button" onClick={clickOrbReleaseBtn} />
                </div>
                {orbSkillList.map((skill) =>
                    <SkillCheckComponent key={`skill${skill.skill_id}`} skill={skill} exclusionSkillList={skillSet.exclusionSkillList} changeSkillList={changeSkillList} />
                )}
            </div>
            <div className="text-center mt-2">
                <input type="button" className="w-24" onClick={clickSetBtn} value={"設定"} />
            </div>
        </div>
    )
};