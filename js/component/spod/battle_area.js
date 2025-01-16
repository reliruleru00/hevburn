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

    return (
        <>
            {turnList.turn_list.map((turn, index) => {
                return <TurnDataComponent turn={turn} last_turn={turnList.last_turn} index={index} key={`turn${index}-${key}`} />
            })}
        </>
    )
};

$(function () {
    const rootElement = document.getElementById('battle_area');
    ReactDOM.createRoot(rootElement).render(<BattleAreaComponent />);
});