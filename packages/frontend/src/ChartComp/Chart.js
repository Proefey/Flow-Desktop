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

    //Arrays that holds the data
    var dataKeyA = props.a;
    var dataKeyB = props.b;
    //Name of the data to display
    var nameA = props.aname;
    var nameB = props.bname;
    //Width and height of the chart
    var chartwidth = props.cw;
    var chartheight = props.ch;
    //The maximum value the data (See Code Documentation)
    var maxA = props.amax;
    var maxB = props.bmax;
    return (
      <div className='Chart'>
        {/*Creates Chart*/}
        <LineChart 
          width={chartwidth} 
          height={chartheight} 
          data={props.data}
          margin={{top: 45, bottom: 45, right: 20, left: 20}}
        >
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" domain={[0, maxA]}>
          <Label
             style={{
                 textAnchor: "middle",
                 fontSize: "130%",
                 fill: "white",
              }}
              angle={270} 
              position="insideLeft"
              value={nameA} />
          </YAxis>
          <YAxis yAxisId="right" orientation="right" domain={[0, maxB]} >
          <Label
             style={{
                 textAnchor: "middle",
                 fontSize: "130%",
                 fill: "white",
              }}
              angle={90} 
              position="insideRight"
              value={nameB} />
          </YAxis>
          <CartesianGrid strokeDasharray="3 3" fill="black"/>
          <Tooltip/>
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey= {dataKeyA} stroke={Colors.fpink} activeDot={{r: 8}}/>
          <Line yAxisId="right" type="monotone" dataKey= {dataKeyB} stroke={Colors.flightblue} activeDot={{r: 8}}/>
        </LineChart>
      </div>
    );
}

export default Chart;
