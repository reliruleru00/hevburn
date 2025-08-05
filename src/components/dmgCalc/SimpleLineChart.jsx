import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Label, Tooltip } from 'recharts';
import { calcDebuffEffectSize } from './logic'

export default function SimpleLineChart() {
    const data = [];
    const enemyStat = 750;
    const skillStat = 150;
    const baseMinPower = 42;
    const baseMaxPower = 60;
    for (let x = 700; x <= 1000; x++) {
        data.push({ x: x, y: calcDebuffEffectSize(x, enemyStat, skillStat, baseMinPower, baseMaxPower, 1, 5) });
    }
    let stat = 780;
    if (stat < 700) {
        stat = 700;
    }
    return (
        <LineChart width={400} height={300} data={data} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" domain={['dataMin', 'dataMax']} interval={49}>
                <Label value="ステータス" offset={40} position="insideBottom" />
            </XAxis>
            <YAxis domain={[baseMinPower * 0.9, baseMaxPower * 1.2]} ticks={[baseMinPower + 4, baseMaxPower + 6]}
                tickFormatter={(value) => `${value}%`} width={40} >
                <Label value="効果量" offset={20} angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="y" stroke="#ff3333" strokeWidth={2} dot={false} />

            <ReferenceLine x={stat} stroke="deepskyblue" strokeWidth={2}>
                <Label value={stat} position="top" fill="deepskyblue" fontSize={24} />
            </ReferenceLine>
        </LineChart>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const point = payload[0].payload; // データ全体
        return (
            <div style={{ backgroundColor: '#fff', padding: 10, border: '1px solid #ccc' }}>
                <p><strong>{point.x}:</strong> {`${Math.floor(point.y * 100) / 100}%`}</p>
                {/* 必要に応じて他のフィールドや条件分岐も追加可能 */}
            </div>
        );
    }

    return null;
};