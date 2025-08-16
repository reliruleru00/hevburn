import icons from 'assets/thumbnail';
import plusIcon from 'assets/img/plus.png';
import changeIcon from 'assets/img/IconSwitchSkill.png';
import { useStyleList } from "components/StyleListProvider";
import { changeStyle } from "utils/const";
import { getStyleData } from "utils/common";

const StyleIcon = ({ styleId, placeNo, onClick, styleClass = "select_style" }) => {
    const { styleList, setMember } = useStyleList();

    let icon = plusIcon;
    const style = getStyleData(styleId);
    if (style &&  style.image_url) {
        const imageName = style.image_url;
        icon = icons[imageName] || plusIcon;
    }

    const clickSetMember = (styleId) => {
        setMember(placeNo, styleId);
        localStorage.setItem(`troops_${styleList.selectTroops}_${placeNo}`, styleId);
    }

    return (
        <div className="relative">
            <img
                className={`showmodal ${styleClass}`}
                src={icon}
                alt={'メンバー' + placeNo}
                onClick={() => { onClick("style", placeNo) }}
            />
            {changeStyle[styleId] && styleClass === "select_style" &&
                <img
                    className="absolute bottom-[0px] left-[0px] w-[24px] h-[24px]"
                    src={changeIcon}
                    alt={"変更"}
                    onClick={() => { clickSetMember(changeStyle[styleId]) }}
                />
            }
        </div>
    )
};

export default StyleIcon;