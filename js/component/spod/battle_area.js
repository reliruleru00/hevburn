const BattleAreaComponent = () => {
    const [key, setKey] = React.useState(0);

    const [updatedTurnIndexList, setUpdatedTurnIndexList] = React.useState([]);

    window.startBattle = () => {
        setKey(key + 1);
    }
    window.updateTurnList = (last_turn) => {
        setUpdatedTurnIndexList(last_turn)
    };

    const clickDownload = () => {
        const element = document.getElementById("battle_display");
        domtoimage.toPng(element)
            .then(dataUrl => {
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = "capture.png";
                link.click();
            })
            .catch(error => console.error("Error capturing image", error));
    }

    if (turn_list.length != 0) {
        return (
            <div className="text-right">
                <input type="button" id="btnDownload" value="画像として保存" onClick={clickDownload} />
                <div id="battle_display" className="text-left">
                    {turn_list.map((turn, index) => {
                        return <TurnDataComponent turn={turn} index={index} key={`turn${index}-${key}`} is_last_turn={seq_last_turn == index} />
                    })}
                </div>
            </div>
        )
    }
};

$(function () {
    const rootElement = document.getElementById('battle_area');
    ReactDOM.createRoot(rootElement).render(<BattleAreaComponent />);
});