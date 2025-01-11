


const TurnDataComponent = ({turn}) => {
    const [turnData, setTurnData] = React.useState(turn);

    React.useEffect(() => {
        setTurnData(turn);
    }, [turn]);

    turnData.getTurnNumber();

    return (
        <div className="turn">
            <div className="header_area">
                <div>
                    <div className="turn_number">{turnData.getTurnNumber()}</div>
                    <div className="left flex">
                        <img className="enemy_icon" src="icon/BtnEventBattleActive.webp" />
                        <div>
                            <select className="enemy_count" id="enemy_count_turn1">
                                <option value="1">1体</option>
                                <option value="2">2体</option>
                                <option value="3">3体</option>
                            </select>
                            <label className="ml-2">場</label>
                            <select className="enemy_count" id="field_turn1" value={turnData.field}>
                                {Object.keys(FIELD_LIST).map(field => <option value={field} key={`field${field}`}>{FIELD_LIST[field]}</option>)}
                            </select>
                            <div className="scroll-container enemy_icon_list">
                                <div className="scroll-content flex-wrap" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <label className="od_text">
                        <span>0.00%</span>
                        <br />⇒<span>22.50%</span>
                    </label>
                    <div className="inc_od_icon">
                        <img className="od_icon" src="img/FrameOverdriveGaugeR.webp" />
                    </div>
                </div>
            </div>
            <div className="party_member">
                <div className="flex front_area">
                    <div className="unit_select">
                        <select className="unit_skill">
                            <option
                                className="back"
                                disabled
                                style={{
                                    display: "none",
                                }}
                                value="0">
                                なし
                            </option>
                            <option className="front" value="1">
                                通常攻撃(突・火)
                            </option>
                            <option
                                className="back"
                                disabled
                                style={{
                                    display: "none",
                                }}
                                value="8">
                                追撃(突)
                            </option>
                            <option className="front" value="48">
                                エンハンス(6)
                            </option>
                            <option className="front" value="49">
                                ドーピング(7)
                            </option>
                            <option className="front" value="50">
                                トリック・カノン(突・雷/13)
                            </option>
                            <option className="front" value="258">
                                リサイクル(突・無/7)
                            </option>
                            <option className="front" value="273">
                                フィルエンハンス(9)
                            </option>
                            <option className="front" value="274">
                                アブソリュートフェノメノン(9)
                            </option>
                            <option className="front" value="427">
                                ファンタズム(突・火/8)
                            </option>
                            <option className="front" value="543">
                                トリック・カノン+(突・雷/11)
                            </option>
                            <option className="front" value="554">
                                リバイバル・ライト(8)
                            </option>
                            <option className="front" value="9001">
                                クリティカルシンキング(5)
                            </option>
                            <option className="front" value="9002">
                                リペアライト(11)
                            </option>
                            <option className="front" value="9003">
                                ドライブゲイン(6)
                            </option>
                            <option className="front" value="9004">
                                プロテクション(3)
                            </option>
                            <option className="front" value="9005">
                                アタックライズ(4)
                            </option>
                            <option className="front" value="9006">
                                コンセントレーション(4)
                            </option>
                            <option className="front" value="9007">
                                ポイントケア(1)
                            </option>
                            <option className="front" value="9008">
                                セルフエイド(4)
                            </option>
                            <option className="front" value="9009">
                                ソフニング(9)
                            </option>
                            <option className="front" value="9010">
                                ウィークンパワー(6)
                            </option>
                            <option className="front" value="9011">
                                ファイアグラビトン(6)
                            </option>
                            <option className="front" value="9012">
                                アイスグラビトン(6)
                            </option>
                            <option className="front" value="9013">
                                サンダーグラビトン(6)
                            </option>
                            <option className="front" value="9014">
                                ライトニンググラビトン(6)
                            </option>
                            <option className="front" value="9015">
                                ダークグラビトン(6)
                            </option>
                            <option className="front" value="9999">
                                行動無し(0)
                            </option>
                        </select>
                        <div className="flex">
                            <div>
                                <img
                                    className="unit_style"
                                    src="icon/SHiguchiGrace_R3_Thumbnail.webp"
                                />
                                <div className="unit_sp">7</div>
                            </div>
                        </div>
                    </div>
                    <div className="unit_select">
                        <select className="unit_skill">
                            <option
                                className="back"
                                disabled
                                style={{
                                    display: "none",
                                }}
                                value="0">
                                なし
                            </option>
                            <option className="front" value="1">
                                通常攻撃(斬・火)
                            </option>
                            <option
                                className="back"
                                disabled
                                style={{
                                    display: "none",
                                }}
                                value="8">
                                追撃(斬)
                            </option>
                            <option className="front" value="44">
                                残影(斬・無/5)
                            </option>
                            <option className="front" value="45">
                                残心撃(斬・無/7)
                            </option>
                            <option className="front" value="202">
                                風斬りの刃(斬・無/9)
                            </option>
                            <option className="front" value="203">
                                スパークル・トライエッジ(斬・雷/14)
                            </option>
                            <option className="front" value="251">
                                ランブルシャーク(斬・無/8)
                            </option>
                            <option className="front" value="433">
                                スパークル・トライエッジ+(斬・雷/14)
                            </option>
                            <option className="front" value="462">
                                ねこじゃらし(5)
                            </option>
                            <option className="front" value="541">
                                ロココ・デストラクション(斬・無/7)
                            </option>
                            <option className="front" value="9001">
                                クリティカルシンキング(5)
                            </option>
                            <option className="front" value="9002">
                                リペアライト(11)
                            </option>
                            <option className="front" value="9003">
                                ドライブゲイン(6)
                            </option>
                            <option className="front" value="9004">
                                プロテクション(3)
                            </option>
                            <option className="front" value="9005">
                                アタックライズ(4)
                            </option>
                            <option className="front" value="9006">
                                コンセントレーション(4)
                            </option>
                            <option className="front" value="9007">
                                ポイントケア(1)
                            </option>
                            <option className="front" value="9008">
                                セルフエイド(4)
                            </option>
                            <option className="front" value="9009">
                                ソフニング(9)
                            </option>
                            <option className="front" value="9010">
                                ウィークンパワー(6)
                            </option>
                            <option className="front" value="9011">
                                ファイアグラビトン(6)
                            </option>
                            <option className="front" value="9012">
                                アイスグラビトン(6)
                            </option>
                            <option className="front" value="9013">
                                サンダーグラビトン(6)
                            </option>
                            <option className="front" value="9014">
                                ライトニンググラビトン(6)
                            </option>
                            <option className="front" value="9015">
                                ダークグラビトン(6)
                            </option>
                            <option className="front" value="9999">
                                行動無し(0)
                            </option>
                        </select>
                        <div className="flex">
                            <div>
                                <img
                                    className="unit_style"
                                    src="icon/SMinaseDoll_R3_Thumbnail.webp"
                                />
                                <div className="unit_sp">7</div>
                            </div>
                        </div>
                    </div>
                    <div className="unit_select">
                        <select className="unit_skill">
                            <option
                                className="back"
                                disabled
                                style={{
                                    display: "none",
                                }}
                                value="0">
                                なし
                            </option>
                            <option className="front" value="1">
                                通常攻撃(斬・火)
                            </option>
                            <option className="front" value="2">
                                クロス斬り(斬・無/6)
                            </option>
                            <option className="front" value="3">
                                スピニングスラッシュ(斬・無/7)
                            </option>
                            <option className="front" value="4">
                                リカバー(5)
                            </option>
                            <option className="front" value="5">
                                フルブレイカー(斬・無/10)
                            </option>
                            <option className="front" value="6">
                                夢幻泡影(斬・無/12)
                            </option>
                            <option className="front" value="7">
                                星火燎原(斬・火/14)
                            </option>
                            <option
                                className="back"
                                disabled
                                style={{
                                    display: "none",
                                }}
                                value="8">
                                追撃(斬)
                            </option>
                            <option className="front" value="215">
                                ノーブルウェッジ(斬・無/8)
                            </option>
                            <option className="front" value="248">
                                バーニングインパクト(斬・火/8)
                            </option>
                            <option className="front" value="303">
                                サンダーパルス(斬・雷/7)
                            </option>
                            <option className="front" value="304">
                                迅雷風烈(斬・雷/16)
                            </option>
                            <option className="front" value="451">
                                炯眼の構え(5)
                            </option>
                            <option className="front" value="454">
                                星火燎原+(斬・火/14)
                            </option>
                            <option className="front" value="567">
                                月光(7)
                            </option>
                            <option className="front" value="9001">
                                クリティカルシンキング(5)
                            </option>
                            <option className="front" value="9002">
                                リペアライト(11)
                            </option>
                            <option className="front" value="9003">
                                ドライブゲイン(6)
                            </option>
                            <option className="front" value="9004">
                                プロテクション(3)
                            </option>
                            <option className="front" value="9005">
                                アタックライズ(4)
                            </option>
                            <option className="front" value="9006">
                                コンセントレーション(4)
                            </option>
                            <option className="front" value="9007">
                                ポイントケア(1)
                            </option>
                            <option className="front" value="9008">
                                セルフエイド(4)
                            </option>
                            <option className="front" value="9009">
                                ソフニング(9)
                            </option>
                            <option className="front" value="9010">
                                ウィークンパワー(6)
                            </option>
                            <option className="front" value="9011">
                                ファイアグラビトン(6)
                            </option>
                            <option className="front" value="9012">
                                アイスグラビトン(6)
                            </option>
                            <option className="front" value="9013">
                                サンダーグラビトン(6)
                            </option>
                            <option className="front" value="9014">
                                ライトニンググラビトン(6)
                            </option>
                            <option className="front" value="9015">
                                ダークグラビトン(6)
                            </option>
                            <option className="front" value="9999">
                                行動無し(0)
                            </option>
                        </select>
                        <div className="flex">
                            <div>
                                <img
                                    className="unit_style"
                                    src="icon/RKayamoriAnniv2023_R3_Thumbnail.webp"
                                />
                                <div className="unit_sp">7</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex back_area">
                    <div className="unit_select">
                        <select
                            className="unit_skill"
                            style={{
                                visibility: "hidden",
                            }}>
                            <option className="back" value="0">
                                なし
                            </option>
                        </select>
                        <img className="unit_style" src="img/cross.png" />
                    </div>
                    <div className="unit_select">
                        <select
                            className="unit_skill"
                            style={{
                                visibility: "hidden",
                            }}>
                            <option className="back" value="0">
                                なし
                            </option>
                        </select>
                        <img className="unit_style" src="img/cross.png" />
                    </div>
                    <div className="unit_select">
                        <select
                            className="unit_skill"
                            style={{
                                visibility: "hidden",
                            }}>
                            <option className="back" value="0">
                                なし
                            </option>
                        </select>
                        <img className="unit_style" src="img/cross.png" />
                    </div>
                    <div>
                        <select className="action_select">
                            <option value="1">行動開始</option>
                            <option
                                disabled
                                style={{
                                    display: "none",
                                }}
                                value="2">
                                行動開始+OD
                            </option>
                        </select>
                        <div
                            className="flex"
                            style={{
                                justifyContent: "flex-end",
                            }}>
                            <input
                                className="turn_button next_turn"
                                defaultValue="次ターン"
                                type="button"
                            />
                            <input
                                className="turn_button return_turn"
                                defaultValue="ここに戻す"
                                style={{
                                    display: "none",
                                }}
                                type="button"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="remark_area">
                <textarea className="remaek_text" />
            </div>
        </div>
    )
};


const BattleAreaComponent = () => {
    const [turnList, setTurnList] = React.useState([]);

    // 状態を外部で更新できるようにする
    window.updateTurnList = (newTurnList) => {
        setTurnList([...newTurnList]);
    };

    return (
        <>
            {turnList.map((turn, index) => {
                return <TurnDataComponent turn={turn} key={index} />
            })}
        </>
    )
};

$(function () {
    const rootElement = document.getElementById('battle_area2');
    ReactDOM.createRoot(rootElement).render(<BattleAreaComponent />);
});