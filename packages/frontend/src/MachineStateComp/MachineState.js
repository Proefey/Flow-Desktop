import React from 'react';
import Colors from "../Const/Colors";
import Dial from "../DialComp/Dial";

const MachineState = props => {
  
  function calculateTimeDifference(timestamp) {
    const currentDate = new Date();
    const startDate = new Date(timestamp);
    const timeDifference = currentDate - startDate;

    const years = Math.floor(timeDifference / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((timeDifference % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    const days = Math.floor((timeDifference % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));

    return { years, months, days, hours, minutes };
  };

  var name = props.name;
  var entry = props.entry;
  var width = props.width;
  var height = props.height;
  var vw = props.vw;
  var vh = props.vh;
  const staticwidth = window.innerWidth;
  const staticheight = window.innerWidth;
  if(entry && entry !== null) var TD = calculateTimeDifference(entry['timestamp']);
  return (
    <div style = {{
      position: 'absolute', 
      transform: `translate(${vw}vw, ${vh}vh)`
    }}>
      <div
        style = {{
          width: width,
          height: height,
          background: Colors.fdarkblue
        }}
      >
      <h3 style={{ 
        fontsize: '2vw', 
        textAlign: 'center', 
        color: 'white' 
      }}>
      {name}
      </h3>
      <p style={{ 
        fontsize: '2vw', 
        textAlign: 'center', 
        color: 'white' 
      }}>
      Last Updated: <br />
      {entry && entry !== null && TD.years > 0 && <> Years: {TD.years} <br/> </>}
      {entry && entry !== null && TD.months > 0 && <> Months: {TD.months} <br/> </>}
      {entry && entry !== null && TD.days > 0 && <> Days: {TD.days} <br/> </>}
      {entry && entry !== null && TD.hours > 0 && <> Hours: {TD.hours} <br/> </>}
      {entry && entry !== null && TD.minutes > 0 &&  <> Minutes: {TD.minutes} <br/> </>}
      </p>
      </div>

      <div 
      style = {{
        position: 'absolute',
        transform: `translate(${3}vw, ${-45}vh)`}}>
          <Dial
            title = 'Total Disolved Solid'
            value = {entry && entry !== null && entry["tds"]}
            unit = 'ppm'
            min={0}
            max={10000}
            size={staticwidth / 24 + staticheight / 18}
            threshold={0.15}
            errorThreshold={0.05}
          />       
      </div>

      <div 
      style = {{
        position: 'absolute',
        transform: `translate(${3}vw, ${-25}vh)`}}>
          <Dial
            title = 'Water Level'
            value = {entry && entry !== null && entry["waterlevel"]}
            unit = 'm'
            min={0}
            max={10}
            size={staticwidth / 24 + staticheight / 18}
            threshold={0.15}
            errorThreshold={0.05}
          />       
      </div>
    </div>
  );
};

export default MachineState;