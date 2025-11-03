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
      color: "#ffffffff",      
      fontSize: 14,       
      fontWeight: "none",  
      fontFamily: "Arial"  
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
