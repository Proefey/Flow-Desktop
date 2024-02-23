import React, {useState, useEffect} from "react";
import Dial from "../DialComp/Dial";
import {Backend_URL} from "../Const/Urls";
import MultiLineChart from "../ChartComp/MultiLineChart";
import Triangle from "@react-native-toolkit/triangle";
import Colors from "../Const/Colors";
import PiChart from "../PiChartComp/PiChart";

const MultiView = props => {
  const target = props.Target;
  const addHeader = props.addHeader;
  const MID = props.MID;
  const options = props.options;

  if(Array.isArray(MID) && MID.length !== 0){
    var MIDLink = MID.join('-');
  }

  function IncreaseMonth(left) {
    var datearr = [];
    var i = 0;
    while(i < maxDays[date.getMonth()]){
      datearr[i] = new Date(date.getFullYear(), date.getMonth() + left, i + 1);
      i++;
    }
    setDays(datearr);
    setDate(new Date(year, month + left, 1));
  }

  //Increases (And decreases) the week
  function IncreaseWeek(left) {
    var datearr = new Array(7);
    datearr[0] = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7 * left);
    for (let i = 1; i < 7; i++) {
        datearr[i] = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + i + 7 * left);
    }
    setDays(datearr);
    setDate(new Date(year, month, dayDate + 7 * left));
  }

  function IncreaseDay(left){
    var datearr = new Array(1);
    datearr[0] = new Date(date.getFullYear(), date.getMonth(), date.getDate() + left);
    setDays(datearr);
    setDate(new Date(year, month, dayDate + left));
  }

  function handleDateChange(left, timeframe){
    switch(timeframe){
      case 0:
        IncreaseDay(left);
        setTimeframe(0);
        break;
      case 1:
        IncreaseWeek(left);
        setTimeframe(1);
        break;
      case 2:
        IncreaseMonth(left);
        setTimeframe(2);
        break;
      default:
        break;
    }
  }

  function displayState(){
    switch(timeframe){
      case 0:
        return "Daily:"
      case 1:
        return "Weekly:"
      case 2:
        return "Monthly:"
      default:
        break;
    }
  }

  function displayBeginDate(){
    if(days.length > 0){
      return days[0].toLocaleDateString();
    }
    else return "";
  }

  function displayEndDate(){
    if(days.length > 0){
      return days[days.length - 1].toLocaleDateString();
    }
    else return "";
  }


  function generateDateArray(start, end){
    const datearr = [];
    let currentDate = start;

    while (currentDate <= end) {
      datearr.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDays(datearr);
  }

  function groupDatesByDay() {
    // Create an object to store dates grouped by day
    const groupedDates = {};

    // Iterate through each date in the input array
    data.forEach((entry) => {
      // Format the date to consider only the day (ignoring time)
      var entry_date = new Date(entry['timestamp']);
      const formattedDate = new Date(entry_date.toDateString());

      // Check if the formatted date exists in the groupedDates object
      if (groupedDates[formattedDate]) {
        // If it exists, push the current date to the corresponding array
        groupedDates[formattedDate].push(entry);
      } else {
        // If it doesn't exist, create a new array with the current date
        groupedDates[formattedDate] = [entry];
      }
    });

    // Convert the groupedDates object to a 2D array
    const resultArray = Object.values(groupedDates);
    return resultArray;
  }

  function findIndexByDate(resultArray, searchDate) {
    // Format the search date to consider only the day (ignoring time)
    const formattedSearchDate = new Date(searchDate.toDateString());

    // Iterate through each sub-array in resultArray
    for (let i = 0; i < resultArray.length; i++) {
      // Check if the formatted search date exists in the current sub-array
      if (resultArray[i].some((entry) => new Date(new Date(entry['timestamp']).toDateString()).getTime() === formattedSearchDate.getTime())) {
        // If found, return the index
        return i;
      }
    }

    // If not found, return -1
    return -1;
  }

  const toggleButton = (button) => {
    // Check if the button is already selected
    const isSelected = selectedButtons.includes(button);

    if (isSelected) {
      // If selected, remove it from the array
      setSelectedButtons(selectedButtons.filter(selectedButton => selectedButton !== button));
    } else {
        setSelectedButtons([button]);
    }
  };

  const handleDateInput = () => {
      // Prompt the user for the start date
      const startDateInput = window.prompt('Enter the start date (YYYY-MM-DD):');
      
      // Check if the user clicked "Cancel" or entered an invalid date
      if (startDateInput === null || !/^\d{4}-\d{2}-\d{2}$/.test(startDateInput)) {
        alert('Invalid start date. Please enter a date in the format YYYY-MM-DD.');
        return;
      }

      // Prompt the user for the end date
      const endDateInput = window.prompt('Enter the end date (YYYY-MM-DD):');

      // Check if the user clicked "Cancel" or entered an invalid date
      if (endDateInput === null || !/^\d{4}-\d{2}-\d{2}$/.test(endDateInput)) {
        alert('Invalid end date. Please enter a date in the format YYYY-MM-DD.');
        return;
      }

      // Set the state with the parsed dates
      generateDateArray(new Date(startDateInput), new Date(endDateInput));
      setTimeframe(4);
      setDate(new Date(startDateInput));
      return;
    };

  useEffect(() => {
      function fetchData() {
          //const promise = fetch(Backend_URL + `/data/` + target, {
          const promise = fetch(Backend_URL + `/data/multi/` + MIDLink , {
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
    }, [target, MID]);

  //Constants
  const [data, setData] = useState([]);
  //Handle Buttons To Change Chart
  const [selectedButtons, setSelectedButtons] = useState([]);

  //Day = 0, Week = 1, Month = 2, Custom = 3
  const [timeframe, setTimeframe] = useState(0);
  const maxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  //Note: Vulnerable to invalid dates
  var [date,setDate] = useState(new Date());
  var month = date.getMonth();
  var year = date.getFullYear();
  var dayDate = date.getDate();
  var [days, setDays] = useState([new Date()]);

  //Const Chart Variables
  const dataNames = ["powerConsumption", "waterProduction", "humidity", "temp", "tds"];
  const axisNames = ["Power Consumption (KWH)", "Water Production (L)", "Humidity (%)", "Temp (F)", "TDS (PPM)"];
  var chartColors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
      '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
      '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
      '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
      '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
      '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
      '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
      '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

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

  //Chart Data
  var chartarr = [];
  var waterChart = [];
  var powerChart = [];
  var piChartWater = new Array(MID.length).fill(0);
  var piChartPower = new Array(MID.length).fill(0);
  for(var i = 0; i < MID.length; i++){
    chartarr[i] = [];
  }
  var DateArray2d = groupDatesByDay();
  if(data != null && days != null){
    for(var j = 0; j < days.length; j++){
      const index = findIndexByDate(DateArray2d, days[j]);
      if(index < 0) continue;
      const date_entries = DateArray2d[index];
      if(timeframe === 0){
        var data_num = 0;
        var total_power = 0;
        var total_water = 0;
        var total_humidity = 0;
        var total_temp = 0;
        var total_tds = 0;
        for(var i = 0; i < date_entries.length; i++){
          var chartdata = {};
          chartdata["date"] = date_entries[i]['timestamp'].toString();
          chartdata["powerConsumption"] = date_entries[i]['power'];
          chartdata["waterProduction"] = date_entries[i]['waterproduced'];
          chartdata["humidity"] = date_entries[i]['humidity'];
          chartdata["temp"] = date_entries[i]['temp'];
          chartdata["tds"] = date_entries[i]['tds'];
          chartarr[MID.indexOf(date_entries[i]['machineID'])].push(chartdata);

          piChartWater[MID.indexOf(date_entries[i]['machineID'])] += date_entries[i]['waterproduced'];
          piChartPower[MID.indexOf(date_entries[i]['machineID'])] += date_entries[i]['power'];
        }
      }
      else{
        var data_num = new Array(MID.length).fill(0);
        var total_power = new Array(MID.length).fill(0);
        var total_water = new Array(MID.length).fill(0);
        var total_humidity = new Array(MID.length).fill(0);
        var total_temp = new Array(MID.length).fill(0);
        var total_tds = new Array(MID.length).fill(0);

        for(var i = 0; i < date_entries.length; i++){
          var target_index = MID.indexOf(date_entries[i]['machineID']);
          total_power[target_index] += date_entries[i]['power'];
          total_water[target_index] += date_entries[i]['waterproduced'];
          total_humidity[target_index] += date_entries[i]['humidity'];
          total_temp[target_index] += date_entries[i]['temp'];
          total_tds[target_index] += date_entries[i]['tds'];
          data_num[target_index] += 1;
          piChartWater[MID.indexOf(date_entries[i]['machineID'])] += date_entries[i]['waterproduced'];
          piChartPower[MID.indexOf(date_entries[i]['machineID'])] += date_entries[i]['power'];
        }     
        for(var i = 0; i < MID.length; i++){
          var chartdata = {};
          chartdata["date"] = days[j].toString();
          chartdata["powerConsumption"] = total_power[i];
          chartdata["waterProduction"] = total_water[i];
          if(data_num[i] > 0){
            chartdata["humidity"] = total_humidity[i] / data_num[i];
            chartdata["temp"] = total_temp[i] / data_num[i];
            chartdata["tds"] = total_tds[i] / data_num[i];
          }
          else{
            chartdata["humidity"] = 0;
            chartdata["temp"] = 0;
            chartdata["tds"] = 0;
          }
          chartarr[i].push(chartdata);
        }
      }
    }
  }
  var newarray = [];
  for(var i = 0; i < MID.length; i++){
    var newdata = {};
    newdata["key"] = options[i];
    newdata["data"] = chartarr[i];
    newarray.push(newdata);
  }

  for (var i = 0; i < MID.length; i++){
    var chartdata = {};
    var chartdata2 = {};
    chartdata["name"] = options[i];
    chartdata["value"] = piChartWater[i];
    chartdata["color"] = chartColors[i % chartColors.length];
    waterChart.push(chartdata);

    chartdata2["name"] = options[i];
    chartdata2["value"] = piChartPower[i];
    chartdata2["color"] = chartColors[i % chartColors.length];
    powerChart.push(chartdata2);
  }

  return (
    <div>
    <style>{'body { background-color: #000000; }'}</style> 
      
      <div style = {{
        position: 'absolute', 
        transform: `translate(${0}vw, ${10}vh)`
      }}>
        <PiChart
        data = {waterChart}
        cw = {400}
        ch = {400}
        Legend = {false}
        name = {axisNames[1]}
        />
      </div>

      <div style = {{
        position: 'absolute', 
        transform: `translate(${0}vw, ${45}vh)`
      }}>
        <PiChart
        data = {powerChart}
        cw = {400}
        ch = {400}
        Legend = {true}
        name = {axisNames[0]}
        />
      </div> 
      
      <div style = {{
        position: 'absolute', 
        transform: `translate(${20}vw, ${15}vh)`
      }}>
        {<MultiLineChart
        data = {newarray}
        datakey = {dataNames[selectedButtons[0]]}
        aname = {axisNames[selectedButtons[0]]}
        width = {1500}
        height = {500}
        />
        }
      </div>

      <div style ={{
        position: 'absolute',
        transform: `translate(${0}vw, ${93}vh)`,
        background: Colors.flightblue,
        width: '100vw',
        height: '0.5vh'
      }}
      />

      <div style ={{
        position: 'absolute',
        transform: `translate(${0}vw, ${94}vh)`,
        background: Colors.fdarkblue,
        width: '100vw',
        height: '6vh'
      }}
      />

      <div style ={{
          position: 'absolute',
          transform: `translate(${20}vw, ${85}vh)`,
        }}>
          <Triangle 
            type={"rightAngle"}
            mode={"bottom-right"} 
            base= '5vw' 
            height= '10vh'
            color={Colors.fdarkblue}
          />
      </div>

      <div style ={{
          position: 'absolute',
          transform: `translate(${75}vw, ${85}vh)`,
        }}>
          <Triangle 
            type={"rightAngle"}
            mode={"bottom-left"} 
            base= '5vw' 
            height= '10vh'
            color={Colors.fdarkblue}
          />
      </div>

      <div style ={{
        position: 'absolute',
        transform: `translate(${25}vw, ${85}vh)`,
        background: Colors.fdarkblue,
        width: '50vw',
        height: '10vh'
      }}
      >
      <p 
        align = 'center'
        style = {{
          fontSize: 32,
          fontWeight: 'bold',
          color: Colors.flightblue,
        }}>
        Displaying {displayState()} {" "}
         From {displayBeginDate()} {" "}
         To {displayEndDate()}
        </p>
      </div>

      <button 
      onClick = {() => {handleDateChange(0, 0)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${25}vw, ${90}vh)`,
          width: '10vw',
          height: '5vh',
          fontSize: 20,
          background: timeframe === 0 ? Colors.flightblue : 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Daily
      </p>
      </button>

      <button 
      onClick = {() => {handleDateChange(0, 1)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${35}vw, ${90}vh)`,
          width: '10vw',
          height: '5vh',
          fontSize: 20,
          background: timeframe === 1 ? Colors.flightblue : 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Weekly
      </p>
      </button>

      <button 
      onClick = {() => {handleDateChange(0, 2)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${45}vw, ${90}vh)`,
          width: '10vw',
          height: '5vh',
          background: timeframe === 2 ? Colors.flightblue : 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Monthly
      </p>
      </button>

      <button 
      onClick = {() => {handleDateChange(-1, timeframe)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${55}vw, ${90}vh)`,
          width: '10vw',
          height: '5vh',
          background: 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Decrease
      </p>
      </button>

      <button 
      onClick = {() => {handleDateChange(1, timeframe)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${65}vw, ${90}vh)`,
          width: '10vw',
          height: '5vh',
          background: 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Increase
      </p>
      </button>

      {[0, 1, 2, 3, 4].map((buttonNumber) => (
        <button
          key={buttonNumber}
          onClick={() => toggleButton(buttonNumber)}
          style={{
            position: 'absolute', 
            transform: `translate(${25 + buttonNumber * 10}vw, ${95}vh)`,
            width: '10vw',
            height: '5vh',
            backgroundColor: selectedButtons.includes(buttonNumber) ? Colors.flightblue : 'black',
            color: selectedButtons.includes(buttonNumber) ? 'white' : '',
          }}
        >
          {dataNames[buttonNumber]}
        </button>
      ))}

      <button 
        style = {{
          position: 'absolute', 
          transform: `translate(${80}vw, ${95}vh)`,
          width: '10vw',
          height: '5vh',
          background: 'black',
          borderColor: Colors.flightblue
        }}
        onClick={handleDateInput}> 
        Select Dates
      </button>

    </div>
  );
}

export default MultiView;