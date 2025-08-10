import icons from 'assets/thumbnail';
import plusIcon from 'assets/img/plus.png';
import changeIcon from 'assets/img/change.png';
import { useStyleList } from "components/StyleListProvider";
import { changeStyle } from "utils/const";

const StyleIcon = ({ style, placeNo, onClick }) => {
    const { styleList, setMember } = useStyleList();

    let icon = plusIcon;
    if (style && style.styleInfo && style.styleInfo.image_url) {
        const imageName = style.styleInfo.image_url;
        icon = icons[imageName] || plusIcon;
    }

    const clickSetMember = (styleId) => {
        setMember(placeNo, styleId);
        localStorage.setItem(`troops_${styleList.selectTroops}_${placeNo}`, styleId);
    }

    return (
        <div className="relative">
            <img
                className="showmodal select_style"
                src={icon}
                alt={'メンバー' + placeNo}
                onClick={() => { onClick("style", placeNo) }}
            />
            {changeStyle[style?.styleInfo.style_id] &&
                <img
                    className="absolute bottom-[0px] left-[0px] w-[24px] h-[24px]"
                    src={changeIcon}
                    alt={"変更"}
                    onClick={() => { clickSetMember(changeStyle[style?.styleInfo.style_id]) }}
                />
            }
        </div>
    )
};

export default StyleIcon;