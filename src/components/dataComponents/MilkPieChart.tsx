import { PieChart } from '@mui/x-charts/PieChart';
type PieData = { id: number; value: number; label: string }; 
type PieDataArr = PieData[];
type MilkPieChartProps = {
  data: PieDataArr; 
};

export default function MilkPieChart({ data }: MilkPieChartProps) {
  console.log('data in component:', data)
    if (!data || data.length === 0) {
    return <p>Loading milk data...</p>; 
  }
  return (
    <PieChart
      series={[
        {
          startAngle: -180,
          endAngle: 0,
          innerRadius: 70,
          outerRadius: 100,
          data,
        },
      ]}
      height={200}
      width={200}
    />
  );
}
