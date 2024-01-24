import React, {useState, useEffect} from "react";
import Chart from "../ChartComp/Chart";
import Colors from "../Const/Colors"
import {Backend_URL} from "../Const/Urls";

const CalWeek = props => {
  const target = props.Target;
  const addHeader = props.addHeader;
  const [beginDate, setBegin] = useState(new Date(0));
  const [endDate, setEnd] = useState(new Date());

  const handleBegin = (e) => {
    setBegin(e.target.value);
  };
  const handleEnd = (e) => {
    setEnd(e.target.value);
  };

  function dateCompare(date1, date2){
      if(date1 == null || date2 == null) return true;
      return date1 >= date2;
  }

    useEffect(() => {
        function fetchData() {
            const promise = fetch(Backend_URL + `/data/` + target, {
                headers: addHeader()
            });
            return promise;
        }
        fetchData()
            .then((res) => res.json())
            .then((json) => setData(json["data"]))
            .catch((error) => {
                console.log(error);
                setData(null); // To indicate API call failed
            });
    }, [target, addHeader]);

  //Constants
  const [data, setData] = useState([]);

  var chartarr = [];
  var data_num = 0;
  var total_power = 0;
  var total_water = 0;
  var total_humidity = 0;
  var total_temp = 0;
  var total_tds = 0;
  if(data != null){
    for(var i = 0; i < data.length; i++){
      var newtime = data[i]['timestamp'];
      var startDate = new Date(newtime);
      //var startDate = new Date(newtime.replace(/-/g, "/").replace("T", " "));
      if(dateCompare(startDate, new Date(beginDate)) && dateCompare(new Date(endDate), startDate)){
        data_num++;
        total_power += data[i]['power'];
        total_water += data[i]['waterproduced'];
        total_humidity += data[i]['humidity'];
        total_temp += data[i]['temp'];
        total_tds += data[i]['tds'];

        var chartdata = {};
        chartdata["date"] = startDate.toString();
        chartdata["powerConsumption"] = data[i]['power'];
        chartdata["waterProduction"] = data[i]['waterproduced'];
        chartdata["humidity"] = data[i]['humidity'];
        chartdata["temp"] = data[i]['temp'];
        chartdata["waterlevel"] = data[i]['waterlevel'];
        chartdata["tds"] = data[i]['tds'];
        chartarr.push(chartdata);
      }
    }
    console.info(chartarr);
    console.info(data);
  }

  return (
    <div className="Main">
    <style>{`body { background-color: ${Colors.black}; }`}</style> 
      <div style = {{
        position: 'absolute', 
        transform: `translate(${0}px, ${200}px)`
      }}>
        <Chart
        data = {chartarr}
        front = {false}
        />
      </div>

      <div         
        style = {{
        transform: `translate(${1600}px, ${200}px)`,
        position:'absolute',
        background: Colors.fdarkblue,
        opacity: 1,
        width: 400,
        height: 700,
        border: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
        }}>
      <h2
        style = {{
        textAlign: 'center',
        color: 'white'
        }}
      >
      Options
      </h2>
      <label
        style = {{
        textAlign: 'center',
        color: 'white'
        }}
      >
        Select a Beginning Date:
        <input
          type="date"
          value={beginDate}
          onChange={handleBegin}
        />
      </label>
      <label
        style = {{
        textAlign: 'center',
        color: 'white'
        }}
      >
        Select an End Date:
        <input
          type="date"
          value={endDate}
          onChange={handleEnd}
        />
      </label>
      <p        
        style = {{
          color: 'white',
          fontSize: 24,
        }}
      >
      average power = {(total_power / data_num).toFixed(2)} W <br/>
      average water = {(total_water / data_num).toFixed(2)} L <br/>
      average temp = {(total_temp / data_num).toFixed(2)} F <br/>
      average humidity = {(total_humidity / data_num).toFixed(2)} % <br/>
      average tds = {(total_tds / data_num).toFixed(2)} ppm <br/>
      </p>
      </div>

    </div>
  );
}

export default CalWeek;