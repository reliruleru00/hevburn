const SkillSelectListComponent = () => {

    const [skillSet, setSkillSet] = React.useState({
        skill_list: [],
        exclusion_skill_list: [],
    });

    window.setSkillList = (skill_list, exclusion_skill_list) => {
        const state = { skill_list: skill_list, exclusion_skill_list: exclusion_skill_list }
        setSkillSet(state);
    }

    const changeSkillList = (e, skill_id) => {
        let exclusion_skill_list = skillSet.exclusion_skill_list;
        const checked = e.target.checked;
        if (checked) {
            exclusion_skill_list.splice(exclusion_skill_list.indexOf(skill_id), 1);
        } else {
            exclusion_skill_list.push(skill_id);
        }
        setSkillSet({ ...skillSet, exclusion_skill_list: exclusion_skill_list });
    }

    const clickReleaseBtn = () => {
        let exclusion_skill_list = skillSet.exclusion_skill_list;
        exclusion_skill_list.splice(0);
        skillSet.skill_list.forEach(element => {
            exclusion_skill_list.push(element.skill_id);
        });
        setSkillSet({ ...skillSet, exclusion_skill_list: exclusion_skill_list });
    }

    const closeModal = () => {
        MicroModal.close('modal_skill_select_list');
    }

    return (
        <>
            <div className="skill_select_container">
                <label className="modal_label">スキル設定</label>
                <button className="modal-close" aria-label="Close modal" onClick={closeModal}>&times;</button>
            </div>
            <div className="text-sm text-right">
                <input className="w-20 mt-2 mb-2 default" defaultValue="すべてはずす" type="button" onClick={clickReleaseBtn} />
            </div>
            <div id="exclusion_skill_list">
                <label>■習得スキル</label>
                {skillSet.skill_list.map((skill) => {
                    const skill_id = skill.skill_id;
                    const checked = !skillSet.exclusion_skill_list.includes(skill_id);
                    if (skill_id === 9001) {
                        return (
                            <>
                                <label>■オーブスキル</label>
                                <div key={skill_id}>
                                    <input className="passive_skill" id={`skill_${skill_id}`} type="checkbox" checked={checked} onChange={e => changeSkillList(e, skill_id)} />
                                    <label className="checkbox01" htmlFor={`skill_${skill_id}`}>{skill.skill_name}</label>
                                </div>
                            </>
                        )
                    } else {
                        return (
                            <div key={skill_id}>
                                <input className="passive_skill" id={`skill_${skill_id}`} type="checkbox" checked={checked} onChange={e => changeSkillList(e, skill_id)} />
                                <label className="checkbox01" htmlFor={`skill_${skill_id}`}>{skill.skill_name}</label>
                            </div>
                        )

                    }
                })
                }
            </div>
        </>
    )
};
$(function () {
    const rootElement = document.getElementById('skill_select_list');
    ReactDOM.createRoot(rootElement).render(<SkillSelectListComponent />);
});