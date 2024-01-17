import React from 'react';
import './Chart.scss';
import Colors from '../Const/Colors'

//Import Local Files
//...

//Import Components
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label
} from 'recharts';

/**
 * Chart, using recharts: recharts.org
 */
const Chart = props => {

    return (
      <div className='Chart'>
        <LineChart 
          width={1500} 
          height={800} 
          data={props.data}
          margin={{top: 45, bottom: 45, right: 20, left: 20}}
        >
          <XAxis dataKey="date" />
          <YAxis yAxisId="left">
          <Label
             style={{
                 textAnchor: "middle",
                 fontSize: "130%",
                 fill: "white",
              }}
              angle={270} 
              position="insideLeft"
              value={"Power Consumption (KWH)"} />
          </YAxis>
          <YAxis yAxisId="right" orientation="right"  >
          <Label
             style={{
                 textAnchor: "middle",
                 fontSize: "130%",
                 fill: "white",
              }}
              angle={90} 
              position="insideRight"
              value={"Water Production (L/S)"} />
          </YAxis>
          <CartesianGrid strokeDasharray="3 3" fill="black"/>
          <Tooltip/>
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="powerConsumption" stroke={Colors.fpink} activeDot={{r: 8}}/>
          <Line yAxisId="right" type="monotone" dataKey="waterProduction" stroke={Colors.flightblue} activeDot={{r: 8}}/>
        </LineChart>
      </div>
    );
}

export default Chart;
