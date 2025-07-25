import React from "react";
import { getBuffIconImg } from "./logic";

const BuffIconComponent = ({ buffList, loop_limit, loop_step, place_no, turn_number, clickBuffIcon }) => {
    const scrollContentRef = React.useRef(null);

    React.useEffect(() => {
        const scrollContent = scrollContentRef.current;
        if (!scrollContent) return;

        const styleSheet = document.styleSheets[0];
        const animationName = `scroll-${turn_number}-${place_no}`;

        // 古いアニメーションを削除
        for (let i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].name === animationName) {
                styleSheet.deleteRule(i);
                break;
            }
        }
        if (buffList.length > loop_limit * loop_step) {
            scrollContent.classList.add("scroll");

            // 動的アニメーション生成
            const duration = buffList.length * 0.5; // 例: アイコン数に応じて2秒ごとに1アイコンがスクロール
            const translateXValue = buffList.length * 24;
        // @keyframesを動的に追加
        const keyframes = `
          @keyframes ${animationName} {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-${translateXValue}px);
            }
          }
        `;

            // 新しいアニメーションを挿入
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
            scrollContent.style.animation = `${animationName} ${duration}s linear infinite`;
            scrollContent.classList.remove("flex-wrap");
        } else {
            scrollContent.classList.remove("scroll");
            scrollContent.classList.add("flex-wrap");
        }
    }, [buffList]);

    let className = "scroll-container " + (place_no == 7 ? "enemy_icon_list" : "icon_list");
    return (buffList.length > 0 ?
        <div className={className} onClick={() => clickBuffIcon(buffList)}>
            <div className="scroll-content" ref={scrollContentRef}>
                {buffList.map((buffInfo, index) => (
                    <img
                        key={index}
                        src={getBuffIconImg(buffInfo)}
                        className="unit_buff"
                    />
                ))}
                {(buffList.length > loop_limit * loop_step) ?
                    buffList.map((buffInfo, index) => (
                        <img
                            key={index}
                            src={getBuffIconImg(buffInfo)}
                            className="unit_buff"
                        />
                    )) : null
                }
            </div>
        </div>
        : null
    );
}

export default BuffIconComponent;