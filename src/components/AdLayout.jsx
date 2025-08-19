// 広告（左右 or SP 用）
import { useEffect, useRef } from "react";

const RakutenAd = ({ size = "120x600", mediaId = "20011811", imgSrc }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 設定スクリプトを生成
        const configScript = document.createElement("script");
        configScript.type = "text/javascript";
        configScript.text = `
      rakuten_affiliateId="0ea62065.34400275.0ea62066.204f04c0";
      rakuten_items="ranking";
      rakuten_genreId="101205";
      rakuten_recommend="on";
      rakuten_design="slide";
      rakuten_size="${size}";
      rakuten_target="_blank";
      rakuten_border="on";
      rakuten_auto_mode="on";
      rakuten_adNetworkId="a8Net";
      rakuten_adNetworkUrl="https%3A%2F%2Frpx.a8.net%2F...";
      rakuten_pointbackId="a20031977341_3Z2I86_ER2ODU_2HOM_BS629";
      rakuten_mediaId="${mediaId}";
    `;

        // ウィジェットスクリプトを生成
        const widgetScript = document.createElement("script");
        widgetScript.type = "text/javascript";
        widgetScript.src = "//xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js";

        // container に挿入
        containerRef.current.innerHTML = ""; // 前回分クリア
        containerRef.current.appendChild(configScript);
        containerRef.current.appendChild(widgetScript);
    }, [size, mediaId]);

    return (
        <div ref={containerRef}>
            {/* トラッキング用 1px 画像 */}
            <img
                border="0"
                width="1"
                height="1"
                src={imgSrc}
                alt=""
            />
        </div>
    );
};

// 共通レイアウト
const AdLayout = ({ children }) => {
    return (
        <>
            {/* スマホ用広告 */}
            <div className="display_sp_only overflow-x-scroll">
                <RakutenAd
                    size="468x60"
                    mediaId="20011816"
                    imgSrc="https://www18.a8.net/0.gif?a8mat=3Z2I86+ER2ODU+2HOM+BS629"
                />
            </div>

            {/* PC用：左右に広告＋中央にコンテンツ */}
            <div className="flex">
                <RakutenAd
                    size="120x600"
                    mediaId="20011811"
                    imgSrc="https://www19.a8.net/0.gif?a8mat=3Z2I86+ER2ODU+2HOM+BS629"
                />

                <div className="mx-auto">{children}</div>

                <RakutenAd
                    size="120x600"
                    mediaId="20011811"
                    imgSrc="https://www19.a8.net/0.gif?a8mat=3Z2I86+ER2ODU+2HOM+BS629"
                />
            </div>
        </>
    );
};

export default AdLayout;