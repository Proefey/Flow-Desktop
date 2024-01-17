import React, {useState, useEffect} from "react";
import CalWeekSquare from './CalWeekSquare';
import { useParams, Link } from 'react-router-dom';
import Chart from "../ChartComp/Chart";
import Colors from "../Const/Colors"
import Triangle from "@react-native-toolkit/triangle";

import axios from 'axios';

const port = 5000;

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

  function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  }

    useEffect(() => {
        function fetchData() {
            const promise = fetch(`http://localhost:5000/data/` + target, {
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
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 
                   'April', 'May', 'June', 
                   'July', 'August', 'September', 
                   'October', 'November', 'December'];
  const maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  //Obtaining Date Information
  //Note: Vulnerable to invalid dates

  //Header
  const headerx = 250;
  const headery = 50;
  const header_width = 800;
  const header_height = 60;

  //Calendar Position
  const topheight = 120;
  const topwidth = window.innerWidth;


  var chartarr = new Array();
  var data_num = 0;
  var total_power = 0;
  var total_water = 0;
  var total_humidity = 0;
  var total_temp = 0;
  var total_tds = 0;
  if(data != null){
    for(var i = 0; i < data.length; i++){
      var newtime = data[i]['timestamp'];
      var startDate = new Date(newtime.replace(/-/g, "/").replace("T", " "));
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