import React, { useState } from 'react';
import Colors from '../Const/Colors';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid} from 'recharts';

const MultiLineChart = props => {
  const data = props.data;
  const [visibleLines, setVisibleLines] = useState(data.map((line) => line.key));
  const [allLinesVisible, setAllLinesVisible] = useState(true);

  const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
      '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
      '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
      '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
      '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
      '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
      '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
      '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

  const handleLineClick = (key) => {
    if (allLinesVisible && visibleLines.length > 1) {
      const updatedVisibleLines = visibleLines.filter(line => line !== key);
      setVisibleLines(updatedVisibleLines);
    }
  };

  const handleRemoveLine = (key) => {
    if (visibleLines.length > 1) {
      const updatedVisibleLines = visibleLines.filter(line => line !== key);
      setVisibleLines(updatedVisibleLines);
    }
  };

  const handleResetClick = () => {
    setVisibleLines(data.map((line) => line.key));
    setAllLinesVisible(true);
  };

  return (
    <div>
        <LineChart 
        width={props.width} 
        height={props.height} 
        data={data.data} 
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
          dataKey="date" 
          allowDuplicatedCategory={false}
          />
          <YAxis domain={[0, props.amax]}/>
          <Tooltip />
          <Legend />
          {data.map((line, index) => ( visibleLines.includes(line.key) &&
            <Line
              name = {line.key}
              key={line.key}
              type="monotone"
              dataKey= {props.datakey}
              data={line.data}
              stroke={colors[index % colors.length]}
              activeDot={{r: 8}}
              onClick={() => handleLineClick(line.key)}
            />
          ))}
        </LineChart>
      <div
        style = {{
          position: 'absolute', 
          transform: `translate(${3}vw, ${0}vh)`,
        }}
      >
        {data.map((line, index) => ( visibleLines.includes(line.key) &&
          <button 
          key={line.key} 
          onClick={() => handleRemoveLine(line.key)}
          style = {{
            width: '15vw',
            height: '5vh',
            background: Colors.fdarkblue,
            borderColor: Colors.flightblue,
            color: colors[index % colors.length]
          }}
          >
            Remove {line.key}
          </button>
        ))}
        <button onClick={handleResetClick}>Reset</button>
      </div>
    </div>
  );
};

export default MultiLineChart;