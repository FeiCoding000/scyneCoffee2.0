// components/EChartLine.tsx
import React from "react";
import ReactECharts from "echarts-for-react";

interface EChartLineProps {
  xData: string[]; 
  yData: number[]; 
  title?: string;  
}

const DailyDataLineChart: React.FC<EChartLineProps> = ({ xData, yData, title }) => {
  const option = {
    title: {
      text: title || "",
      textStyle: {
      color: "#eee9e9ff",       // 字体颜色
      fontSize: 14,        // 字体大小
      fontWeight: "none",  // 粗细
      fontFamily: "Arial"  // 字体
    }
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: xData,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: yData,
        type: "line",
        smooth: true, 
        areaStyle: {}, 
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400, width: "100%" }} />;
};

export default DailyDataLineChart;
