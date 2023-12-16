import React, {useState, useEffect} from "react";
import CalendarSquare from './CalMonthSquare';
import { useParams, Link } from 'react-router-dom';
import Form from "./Form";
import Dial from "../DialComp/Dial";
import axios from 'axios';
import Colors from "../Const/Colors"
import Triangle from "@react-native-toolkit/triangle";

const port = 5000;

async function fetchAll() {
  try {
    const response = await axios.get('http://localhost:' + port + '/data', {
      params: {
        id: 1,
      },
    });
    return response.data.datapack;
  } catch (error) {
    console.log(error);
    return false;
  }
}



//Add events by using the events0, events1, and events2 arrays
//Add colors to events by using the respective eventcolors arrays
//Arrays are assumed to be in the same order
const CalMonth = props => {

  /* HELPER FUNCTIONS */
  //Increases or Decreases The Selected Month
  function IncreaseMonth(left){
    var newmonth = date.getMonth() + left;
    var newyear = date.getFullYear();
    if(newmonth > 11) {
      newmonth = 0;
      newyear ++;
    }
    if(newmonth < 0) {
      newmonth = 11;
      newyear --;
    }
    setDate(new Date(newyear, newmonth, 1))
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

  function changeDate(d){
    setDate(d);
    var newH = 0;
    var newPC = 0;
    var newTDS = 0;
    var newAT = 0;
    var newWP = 0;
    var newWL = 0;
    var newdata = null;
    for(var i = 0; i < data.length; i++){
      var newtime = data[i]['timestamp'];
      var startDate = new Date(newtime.replace(/-/g, "/").replace("T", " "));
      
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
    /*
    newH = Math.random(1) * 100;
    newPC = Math.random(1) * 500;
    newTDS = Math.random(1) * 10000;
    newAT = Math.random(1) * 130;
    newWP = Math.random(1) * 10;
    newWL = Math.random(1) * 10;
    */
    setH(newH);
    setPC(newPC);
    setTDS(newTDS);
    setAT(newAT);
    setWP(newWP);
    setWL(newWL);
  }

  useEffect(() => {
    fetchAll().then(result => {
      if (result) {
        setData(result);
      }
    });
  }, []);

  //Constants
  const [data, setData] = useState([]);
  const { innerWidth: width, innerHeight: height } = window;
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 
                   'April', 'May', 'June', 
                   'July', 'August', 'September', 
                   'October', 'November', 'December'];
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
  const headerx = 350;
  const headery = 25;
  const header_width = 600;
  const header_height = 60;
  const calendarx = 90;
  const calendary = 200;
  const dialx = 1300;
  const dialdx = 300;
  const dialy = 200;
  const dialdy = 250;
  const topheight = 120;
  const topwidth = window.innerWidth;

  const [ambientTemp, setAT] = useState(0);
  const [waterLevel, setWL] = useState(0);
  const [humidity, setH] = useState(0);
  const [TDS, setTDS] = useState(0);
  const [powerConsumption, setPC] = useState(0);
  const [waterProd, setWP] = useState(0);

  const [view, setView] = useState(false);

  for(var i = 0; i < data.length; i++){
      var newtime = data[i]['timestamp'];
      var startDate = new Date(newtime.replace(/-/g, "/").replace("T", " "));
      for(var j = 0; j < 42; j++){
        if(sameDay(displaydays[j], startDate)){
          hasdata[j] = true;
          WParray[j] = data[i]['waterproduced'];
          PCarray[j] = data[i]['power'];
          break;
        }
      }
  }

  console.info(hasdata);

  return (
    <div className="Main">
    <style>{'body { background-color: #000000; }'}</style> 
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
        <Triangle mode={"left"} base={topheight - 5} color={"black"}/>
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
        <Triangle mode={"left"} base={topheight} color={"black"}/>
      </div>

      <div style ={{
        position: 'absolute',
        transform: `translate(${topwidth / 2 + 160}px, ${2.5}px)`
      }}>
        <Triangle mode={"right"} base={topheight - 5} color={"black"}/>
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
        <Triangle mode={"right"} base={topheight} color={"black"}/>
      </div>

      <div
      style = {{
        transform: `translate(${topwidth / 2 - 150}px, ${0}px)`,
        position:'absolute',
        backgroundColor: 'black',
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
      {months[date.getMonth()]} {date.getDate()} <br/> {date.getFullYear()}
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
      onClick={() => IncreaseMonth(-1)}> Prev
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
      onClick={() => IncreaseMonth(1)}> Forw
      </button>
      </div>

      <div>
      <Link to={"/week/" + linkString(date)}>
      <button style = {{
        background: Colors.fpink, 
        position: 'absolute', 
        transform: `translate(${100}px, ${topheight / 4}px)`,
        width: topheight,
        height: topheight / 2,
        fontSize: 20
      }}> 
      To Chart
      </button>
      </Link>
      </div>

      {!view && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
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