import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const PiChart = props => {
  var chartwidth = props.cw;
  var chartheight = props.ch;
  var data = props.data;
  var showLegend = props.Legend;
  var name = props.name;
  return (
    <div>
    {/*Render Title*/}
    <div         
    style = {{
      transform: `translate(${0}vw, ${3}vh)`,
      position:'absolute',
      background: 'black',
      color: 'white',
      width: chartwidth,
      height: '5vh',
      justifyContent: 'center',
      alignItems: 'center',
      }}>
        <p
          style = {{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 24
          }}
        >
        {name}
      </p>  
    </div>    
  {/*Render Pi Chart */}
  <PieChart width={chartwidth} height={chartheight}>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={data}
          cx={chartwidth/2}
          cy={chartheight/2}
          outerRadius={100}
          fill= 'black'
          label = 'top'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        {showLegend && <Legend />}
      </PieChart>
    </div>
  );
};

export default PiChart;