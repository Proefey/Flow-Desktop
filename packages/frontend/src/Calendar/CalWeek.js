import React, {useState, useEffect} from "react";
import CalWeekSquare from './CalWeekSquare';
import { useParams, Link } from 'react-router-dom';
import Chart from "../ChartComp/Chart";
import Colors from "../Const/Colors"
import Triangle from "@react-native-toolkit/triangle";

import axios from 'axios';

const port = 5000;

const CalWeek = props => {

  const addHeader = props.addHeader;
  //HELPER FUNCTIONS
  //Increases (And decreases) the week
  function IncreaseWeek(num){
    setDate(new Date(year, month, dayDate + (7 * num)));
  }

  //Convert Date to String For Linking
  function linkString(linkDate){
    const linkYear = linkDate.getFullYear();
    const linkMonth = linkDate.getMonth() + 1;
    const linkDay = linkDate.getDate();
    return linkYear + "-" + linkMonth + "-" + linkDay;
  }

  function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  }

    useEffect(() => {
        function fetchData() {
            const promise = fetch(`http://localhost:5000/data/2`, {
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
    }, [addHeader]);

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
  let params = useParams();
  var pstDate = params['newdate'] + " PST";
  var [date,setDate] = useState(new Date(pstDate));
  var month = date.getMonth();
  var day = date.getDay();
  var dayDate = date.getDate();
  var year = date.getFullYear();

  //Leap Year Calculation
  if(year % 4 == 0){
    if(year % 100 == 0){
      if(year % 400 == 0){
        maxDays[1] = 29;
      }
      else{
        maxDays[1] = 28;
      }
    }
    else{
      maxDays[1] = 29;
    }
  }
  else{
    maxDays[1] = 28;
  }

  //Calculate Current Week
  var datearr = new Array(7);
  datearr[0] = new Date(year, month, dayDate - day);
  for(var i = 1; i < 7; i++){
    datearr[i] = new Date(year, month, dayDate - day + i);
  }

  //Header
  const headerx = 250;
  const headery = 50;
  const header_width = 800;
  const header_height = 60;

  //Calendar Position
  const topheight = 120;
  const topwidth = window.innerWidth;

  var humidity = new Array(7);
  var powerConsumption = new Array(7);
  var TDS = new Array(7);
  var ambientTemp = new Array(7);
  var waterProduction = new Array(7);
  var waterLevel = new Array(7);
  var display = new Array(6);


  var chartarr = new Array();
  if(data != null){
    for(var i = 0; i < 7; i++){
        var newPC = null;
        var newWP = null;
        for(var j = 0; j < data.length; j++){
          var newtime = data[j]['timestamp'];
          var startDate = new Date(newtime.replace(/-/g, "/").replace("T", " "));
          console.info(startDate);
          if(sameDay(datearr[i], startDate)){
            var newdata = data[j];
            newPC = newdata['power'];
            newWP = newdata['waterproduced'];
          }
        }
      var chartdata = {};
      chartdata["weekday"] = weekdays[i];
      chartdata["powerConsumption"] = newPC;
      chartdata["waterProduction"]= newWP;
      
      chartarr.push(chartdata);
    }
  }

  return (
    <div className="Main">
    <style>{`body { background-color: ${Colors.black}; }`}</style> 
    <div
      style = {{
        transform: `translate(${0}px, ${10}px)`,
        position:'absolute',
        background: Colors.fblue,
        opacity: 0.5,
        width: topwidth,
        height: topheight - 20,
        border: 'none',
      }}

      />

      <div
      style = {{
        transform: 'translate(${0}px, ${0}px)',
        position:'absolute',
        opacity: 1,
        width: topwidth,
        height: topheight,
        border: 'none',
        borderBottom: 'solid',
        borderTop: 'solid',
        borderColor: Colors.flightblue,
      }}
      />

      <div style ={{
        position: 'absolute',
        transform: `translate(${topwidth / 2 - 260}px, ${2.5}px)`
      }}>
        <Triangle mode={"left"} base={topheight - 5} color={Colors.black}/>
      </div>

      <div style ={{
        position: 'absolute',
        transform: `translate(${topwidth / 2 - 250}px, ${0}px)`
      }}>
        <Triangle mode={"left"} base={topheight} color={Colors.flightblue}/>
      </div>

      <div style ={{
        position: 'absolute',
        transform: `translate(${topwidth / 2 - 240}px, ${0}px)`
      }}>
        <Triangle mode={"left"} base={topheight} color={Colors.black}/>
      </div>

      <div style ={{
        position: 'absolute',
        transform: `translate(${topwidth / 2 + 160}px, ${2.5}px)`
      }}>
        <Triangle mode={"right"} base={topheight - 5} color={Colors.black}/>
      </div>

      <div style ={{
        position: 'absolute',
        transform: `translate(${topwidth / 2 + 150}px, ${0}px)`
      }}>
        <Triangle mode={"right"} base={topheight} color={Colors.flightblue}/>
      </div>

      <div style ={{
        position: 'absolute',
        transform: `translate(${topwidth / 2 + 140}px, ${0}px)`
      }}>
        <Triangle mode={"right"} base={topheight} color={Colors.black}/>
      </div>

      <div
      style = {{
        transform: `translate(${topwidth / 2 - 150}px, ${0}px)`,
        position:'absolute',
        backgroundColor: Colors.black,
        opacity: 1,
        width: 300,
        height: topheight,
      }}
      >
      <p 
      align = 'justify'
      align = 'center'
      style = {{
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.flightblue,
      }}>
      {months[datearr[0].getMonth()] 
      + " " + datearr[0].getDate() 
      + " - " + months[datearr[6].getMonth()]
      + " " + datearr[6].getDate()}
      </p>
      </div>

      <div>
      <button style = {{
        background: Colors.fviolet, 
        position: 'absolute', 
        transform: `translate(${topwidth / 2 - 420}px, ${topheight / 4}px)`,
        width: topheight,
        height: topheight / 2,
        fontSize: 20,
        border: 'none',
      }}
      onClick={() => IncreaseWeek(-1)}> Prev
      </button>
      </div>

      <div>
      <button style = {{
        background: 'green', 
        position: 'absolute', 
        transform: `translate(${topwidth / 2 + 300}px, ${topheight / 4}px)`,
        width: topheight,
        height: topheight / 2,
        fontSize: 20
      }}
      onClick={() => IncreaseWeek(1)}> Forw
      </button>
      </div>

      <div>
      <Link to= {"/month/" + linkString(datearr[3])}>
      <button style = {{
        background: Colors.fpink, 
        position: 'absolute', 
        transform: `translate(${100}px, ${topheight / 4}px)`,
        width: topheight,
        height: topheight / 2,
        fontSize: 20
      }}> 
      To Calendar
      </button>
      </Link>
      </div>

      <div style = {{
        position: 'absolute', 
        transform: `translate(${50}px, ${200}px)`
      }}>
        <Chart
        data = {chartarr}
        front = {false}
        />
      </div>

    </div>
  );
}

export default CalWeek;