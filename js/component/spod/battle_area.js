const BattleAreaComponent = () => {
    const [turnList, setTurnList] = React.useState({
        "last_turn": 0,
        "turn_list": []
    });
    const [key, setKey] = React.useState(0);

    window.startBattle = () => {
        setKey(key + 1);
    }
    window.updateTurnList = (turn_list) => {
        setTurnList({
            "last_turn": turn_list.length - 1,
            "turn_list": turn_list
        });
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

    if (turnList.turn_list.length != 0) {
        return (
            <div className="text-right">
                <input type="button" id="btnDownload" value="画像として保存" onClick={clickDownload} />
                <div id="battle_display" className="text-left">
                    {turnList.turn_list.map((turn, index) => {
                        return <TurnDataComponent turn={turn} last_turn={turnList.last_turn} index={index} key={`turn${index}-${key}`} />
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