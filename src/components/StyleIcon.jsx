import icons from '../assets/thumbnail';
import plusIcon from '../assets/img/plus.png';

const StyleIcon = ({ style, place_no, onClick }) => {
    let icon = plusIcon;
    if (style && style.styleInfo && style.styleInfo.image_url) {
        const imageName = style.styleInfo.image_url.replace(/\.(webp)$/, '');
        icon = icons[imageName] || plusIcon;
    }

    return (
        <>
            <img
                className="showmodal select_style"
                src={icon}
                alt={'メンバー' + place_no}
                onClick={() => { onClick("style", place_no) }}
            />
        </>
    )
};

export default StyleIcon;