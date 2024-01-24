import React, {useState, useEffect} from "react";
import CalendarSquare from './CalMonthSquare';
import { useParams} from 'react-router-dom';
import Dial from "../DialComp/Dial";
import {Backend_URL} from "../Const/Urls";




//Add events by using the events0, events1, and events2 arrays
//Add colors to events by using the respective eventcolors arrays
//Arrays are assumed to be in the same order
const CalMonth = props => {
  const target = props.Target;
  const addHeader = props.addHeader;
  console.info("Target: " + target);
  /* HELPER FUNCTIONS */
  function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  }

  function changeDate(d){
    setDate(d);
    var newH = 0;
    var newPC = 0;
    var newTDS = 0;
    var newAT = 0;
    var newWP = 0;
    var newWL = 0;
    var newdata = null;
    console.info(data);
    if(data != null){
      for(var i = 0; i < data.length; i++){
        var newtime = data[i]['timestamp'];
        var startDate = new Date(newtime);
        //var startDate = new Date(newtime.replace(/-/g, "/").replace("T", " "));
        console.info(startDate);
        if(sameDay(d, startDate)){
          newdata = data[i];
          newH = newdata['humidity'];
          newPC = newdata['power'];
          newTDS = newdata['tds'];
          newAT = newdata['temp'];
          newWP = newdata['waterproduced'];
          newWL = newdata['waterlevel'];
        }
        
      }
    }
    setH(newH);
    setPC(newPC);
    setTDS(newTDS);
    setAT(newAT);
    setWP(newWP);
    setWL(newWL);
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
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  //Note: Vulnerable to invalid dates
  let params = useParams();
  var pstDate = params['newdate'] + " PST";
  var [date,setDate] = useState(new Date(pstDate));
  var firstdate = new Date(date.getFullYear(), date.getMonth(), 1);
  var month = firstdate.getMonth();
  var day = firstdate.getDay();
  var year = firstdate.getFullYear();

  //Leap Year Calculation
  if(year % 4 === 0){
    if(year % 100 === 0){
      if(year % 400 === 0){
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
  
  //Filling Up A Size 42 Array With The Dates To Display For The Month
  var displaydays = new Array(42);
  var hasdata = new Array(42);
  var WParray = new Array(42);
  var PCarray = new Array(42);
  for(var i = 0; i < 42; i++){
    hasdata[i] = false;
    WParray[i] = 0;
    //First day isn't always Sunday
    if(i < day){
      var newyear = year;
      var newmonth = month - 1;
      if(newmonth < 0){
        newyear = year - 1;
        newmonth = 11;
      }
      displaydays[i] = new Date(newyear, newmonth, maxDays[newmonth] - day + i + 1);
    }
    else{
      displaydays[i] = new Date(year, month, i - day + 1);
    }
  }

  //Calendar Position
  const calendarx = 90;
  const calendary = 200;
  const dialx = 1300;
  const dialdx = 300;
  const dialy = 200;
  const dialdy = 250;

  const [ambientTemp, setAT] = useState(0);
  const [waterLevel, setWL] = useState(0);
  const [humidity, setH] = useState(0);
  const [TDS, setTDS] = useState(0);
  const [powerConsumption, setPC] = useState(0);
  const [waterProd, setWP] = useState(0);

  if(data != null){
    for(i = 0; i < data.length; i++){
        var newtime = data[i]['timestamp'];
        var startDate = new Date(newtime);
        //var startDate = new Date(newtime.replace(/-/g, "/").replace("T", " "));
        for(var j = 0; j < 42; j++){
          if(sameDay(displaydays[j], startDate)){
            hasdata[j] = true;
            WParray[j] = data[i]['waterproduced'];
            PCarray[j] = data[i]['power'];
            break;
          }
        }
    }
  }

  return (
    <div className="Main">
    <style>{'body { background-color: #000000; }'}</style> 

      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41].map( (num) => <CalendarSquare 
        key = {num}
        num = {num}
        date = {displaydays[num]}
        month = {month}
        cx = {calendarx}
        cy = {calendary}
        weekdays = {weekdays}
        changeDate = {changeDate}
        hasdata = {hasdata[num]}
        WP = {WParray[num]}
      />)}

      <div 
      style = {{
        position: 'absolute',
        transform: `translate(${dialx + dialdx}px, ${dialy + dialdy}px)`}}>
          <Dial
            title = 'Humidity'
            value = {humidity}
            unit = '%'
            min={0}
            max={100}
            size={200}
            threshold={0.15}
            errorThreshold={0.05}
          />       
      </div>

      <div 
      style = {{
        position: 'absolute',
        transform: `translate(${dialx + dialdx}px, ${dialy + dialdy * 2}px)`}}>
          <Dial
            title = 'Ambient Temperature'
            value = {ambientTemp}
            unit = 'F'
            min={0}
            max={120}
            size={200}
            threshold={0.15}
            errorThreshold={0.05}
          />       
      </div>

      <div 
      style = {{
        position: 'absolute',
        transform: `translate(${dialx}px, ${dialy + dialdy}px)`}}>
          <Dial
            title = 'Water Level'
            value = {waterLevel}
            unit = 'L'
            min={0}
            max={10}
            size={200}
            threshold={0.15}
            errorThreshold={0.05}
          />       
      </div>

      <div 
      style = {{
        position: 'absolute',
        transform: `translate(${dialx + dialdx}px, ${dialy}px)`}}>
          <Dial
            title = 'Water Production'
            value = {waterProd}
            unit = 'L'
            min={0}
            max={10}
            size={200}
            threshold={0.15}
            errorThreshold={0.05}
          />      
      </div>

      <div 
      style = {{
        position: 'absolute',
        transform: `translate(${dialx}px, ${dialy}px)`}}>
          <Dial
            title = 'Power Consumption'
            value = {powerConsumption}
            unit = 'KWH'
            min={0}
            max={500}
            size={200}
            threshold={0.15}
            errorThreshold={0.05}
          />       
      </div>

      <div 
      style = {{
        position: 'absolute',
        transform: `translate(${dialx}px, ${dialy + dialdy * 2}px)`}}>
          <Dial
            title = 'Total Disolved Solid'
            value = {TDS}
            unit = 'ppm'
            min={0}
            max={10000}
            size={200}
            threshold={0.15}
            errorThreshold={0.05}
          />       
      </div>

    </div>
  );
}

export default CalMonth;