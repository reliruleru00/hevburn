const BattleAreaComponent = () => {
    const [turnList, setTurnList] = React.useState({
        "last_turn": 0,
        "turn_list": []
    });

    window.updateTurnList = (turn_list) => {
        setTurnList({
            "last_turn": turn_list.length - 1,
            "turn_list": turn_list
        });
    };

    return (
        <>
            {turnList.turn_list.map((turn, index) => {
                return <TurnDataComponent turn={turn} last_turn={turnList.last_turn} index={index} key={`turn${index}`} />
            })}
        </>
    )
};

$(function () {
    const rootElement = document.getElementById('battle_area');
    ReactDOM.createRoot(rootElement).render(<BattleAreaComponent />);
});