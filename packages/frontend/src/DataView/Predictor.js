import React, {useState, useEffect, useCallback} from "react";
import Triangle from "@react-native-toolkit/triangle";
import Colors from "../Const/Colors";
import {Backend_URL} from "../Const/Urls";
import Chart from "../ChartComp/Chart";
import Dial from "../DialComp/Dial";

const Predictor = props => {
  //Target is determined by what you select in Taskbar
  const target = props.Target;
  //Used for authentication
  const addHeader = props.addHeader;
  //Machine IDs registered with the user
  const MID = props.MID;

  //Creates the MIDLink, which is used in getting data from multiple machine IDs from the backend
  if(Array.isArray(MID) && MID.length !== 0){
    var MIDLink = MID.join('-');
  }

  //Const Chart Variables
  const dataNames = ["powerConsumption", "waterProduction", "humidity", "temp", "tds"];
  const axisNames = ["Power Consumption (KWH)", "Water Production (L)", "Humidity (%)", "Temp (F)", "TDS (PPM)"];
  const highest = [1, 1, 100, 130, 1000];
  const [data, setData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [select1, set1] = useState(0);
  const [select2, set2] = useState(2);
  const [timeframe, setTimeframe] = useState(0);

  //Const Location Variables
 const [userCoordinates, setUserCoordinates] = useState(null);
 const [manualLatitude, setManualLatitude] = useState('');
 const [manualLongitude, setManualLongitude] = useState('');

 //Fetches data relating to all registered machines
  useEffect(() => {
      function fetchData() {
          const promise = fetch(Backend_URL + `/data/` + target, {
          //const promise = fetch(Backend_URL + `/data/multi/` + MIDLink , {
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
    }, [target, MID, MIDLink, addHeader]);

  //Gets current user's coordinates using navigator
  function getUserCoordinates () {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Extract latitude and longitude from the position object
          const { latitude, longitude } = position.coords;
          setUserCoordinates({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user coordinates:', error.message);
          setUserCoordinates(null);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
      setUserCoordinates(null);
    }
  };

  //Checks to see if user has overwritten the coordinates
  const checkUserCoordinates = useCallback(() => {
    if (manualLatitude && manualLongitude) {
      setUserCoordinates({ latitude: parseFloat(manualLatitude), longitude: parseFloat(manualLongitude) });
    } else {
      getUserCoordinates();
    }
  }, [manualLatitude, manualLongitude]);

  function resetToNavigatorCoordinates() {
    getUserCoordinates();
    setManualLatitude('');
    setManualLongitude('');
  };

  //Calculate a correlation amongst two arrays
  function calculateCorrelation(arrayX, arrayY) {
	  // Check if arrays are of equal length
	  if (arrayX.length !== arrayY.length) {
	    throw new Error('Arrays must have the same length for correlation calculation.');
	  }

	  // Calculate means of the arrays
	  const meanX = arrayX.reduce((acc, val) => acc + val, 0) / arrayX.length;
	  const meanY = arrayY.reduce((acc, val) => acc + val, 0) / arrayY.length;

	  // Calculate numerator and denominators for the correlation formula
	  let numerator = 0;
	  let denomX = 0;
	  let denomY = 0;

	  for (let i = 0; i < arrayX.length; i++) {
	    numerator += (arrayX[i] - meanX) * (arrayY[i] - meanY);
	    denomX += Math.pow((arrayX[i] - meanX), 2);
	    denomY += Math.pow((arrayY[i] - meanY), 2);
	  }

	  // Calculate correlation coefficient
	  const correlation = numerator / Math.sqrt(denomX * denomY);

	  return correlation;
  }

  //Standard Deviation Function
	function standardDeviation(values) {
	  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
	  const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
	  const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / values.length;
	  return Math.sqrt(variance);
	}

  //Predict a new array based on two previous arrays
	function predictValues(arrayX, arrayY, newX) {
	  const correlationCoefficient = calculateCorrelation(arrayX, arrayY);
	  // Calculate the slope and intercept for the linear regression line
	  const slope = correlationCoefficient * (standardDeviation(arrayY) / standardDeviation(arrayX));
	  const intercept = arrayY.reduce((acc, val) => acc + val, 0) / arrayY.length - slope * (arrayX.reduce((acc, val) => acc + val, 0) / arrayX.length);

	  // Predict values for newX using the linear regression equation
	  const predictedValues = newX.map(x => slope * x + intercept);

	  return predictedValues;
	}

  //Get data from link
  function fetchWeatherData(link){
    const promise = fetch(link);
    return promise;
  }

  //This function separates datapacks by date, creating a 2d array for each day in the timeframe
  function groupDatesByDay() {
    // Create an object to store dates grouped by day
    const groupedDates = {};

    // Iterate through each date in the input array
    futuretimes.forEach((entry) => {
      // Format the date to consider only the day (ignoring time)
      var entry_date = new Date(entry);
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

  // Trigger the check when the component mounts
  useEffect(() => {
  	checkUserCoordinates();
  }, [checkUserCoordinates]);

  //Get data from NWS based on coordinates
  useEffect(() => {
    function fetchWeather(link){
    fetchWeatherData(link)
    .then((res) => res.json())
    .then((json) => {
      fetchWeatherData(json["properties"]["forecastHourly"])
          .then((res) => res.json())
          .then((json) => setHourlyData(json["properties"]["periods"]))
          .catch((error) => console.log(error));
        })
    .catch((error) => {
      console.log(error);
    });
    }
  	if(userCoordinates != null){
		var newlink = "https://api.weather.gov/points/" + userCoordinates["latitude"] + "," + userCoordinates["longitude"];
		console.info(newlink);
		fetchWeather("https://api.weather.gov/points/" + userCoordinates["latitude"] + "," + userCoordinates["longitude"]);
	}
  }, [userCoordinates]);

  var chartarr = [];
  var datawater = [];
  var datapower = [];
  var datahumidity = [];
  var datatemp = [];
  var count = 0;
  var diffWater = 0;
  var diffPower = 0;
  //Prepare data for the correlation function
  for(var i = 1; i < data.length; i++){
  	if(data[i]['machineID'] === target){
      diffWater = data[i]['waterproduced'] - data[i-1]['waterproduced'];
      diffPower = data[i]['power'] - data[i-1]['power'];
      if(diffWater < 0) diffWater = 0;
      if(diffPower < 0) diffPower = 0;
  		datawater[count] = diffWater;
  		datapower[count] = diffPower;
  		datahumidity[count] = data[i]['humidity'];
  		datatemp[count] = data[i]['temp'];
  		count += 1;
  	}
  }
  var futurehumidity = [];
  var futuretemp = [];
  var futuretimes = [];
  var total_power = 0;
  var total_water = 0;
  //Prepare future data for correlation function
  for(i = 0; i < hourlyData.length; i++){
	futuretimes[i] = hourlyData[i]["startTime"];
	futurehumidity[i] = hourlyData[i]["relativeHumidity"]["value"];
	futuretemp[i] = hourlyData[i]["temperature"];
  }
  //Use humidity as the basis of the correlation
  if(select2 === 2){
	var futurewater = predictValues(datahumidity, datawater, futurehumidity);
	var futurepower = predictValues(datahumidity, datapower, futurehumidity);
  }
  //Use temperature as the basis of the correlation
  else{
  futurewater = predictValues(datatemp, datawater, futuretemp);
	futurepower = predictValues(datatemp, datapower, futuretemp);
  }
  var DateArray2d = groupDatesByDay();
  //Display prediction in 30 Minute Intervals
  if(timeframe === 0){
	  for(i = 0; i < futurehumidity.length; i++){
	  	var chartdata = {};
	    chartdata["date"] = futuretimes[i];
	    chartdata["waterProduction"] = futurewater[i];
	    chartdata["powerConsumption"] = futurepower[i];
	    chartdata["humidity"] = futurehumidity[i];
	    chartdata["temp"] = futuretemp[i];
	    chartarr.push(chartdata);
	  }
  }
  //Display prediction in Half Day Intervals
  else{
  	count = 0;
  	for(i = 0; i < DateArray2d.length; i++){
  		var temp_water = 0;
  		var temp_power = 0;
  		var temp_humidity = 0;
  		var temp_temp = 0;
  		chartdata = {}
  		chartdata["date"] = DateArray2d[i][0];
  		for(var j = 0; j < DateArray2d[i].length; j++){
  			temp_water += futurewater[count];
	    	temp_power += futurepower[count];
	    	temp_humidity += futurehumidity[count];
	    	temp_temp += futuretemp[count];
	    	count += 1;
  		}
  		chartdata["waterProduction"] = temp_water;
	    chartdata["powerConsumption"] = temp_power;
	    chartdata["humidity"] = temp_humidity / DateArray2d[i].length;
	    chartdata["temp"] = temp_temp / DateArray2d[i].length;
  		chartarr.push(chartdata);
  	}
  }
  total_water = futurewater.reduce((a, b) => a + b, 0);
  total_power = futurepower.reduce((a, b) => a + b, 0);

  const staticwidth = window.innerWidth;
  const staticheight = window.innerWidth;

  return(
  	<div>
  	<style>{'body { background-color: #000000; }'}</style> 

      <div style = {{
        position: 'absolute', 
        transform: `translate(${0}vw, ${10}vh)`
      }}>
    {/*Render Chart*/}
        <Chart
        data = {chartarr}
        front = {false}
        a = {dataNames[select2]}
        aname = {axisNames[select2]}
        amax = {highest[select2]}
        b = {dataNames[select1]}
        bname = {axisNames[select1]}
        bmax = {highest[select1]}
        cw = {staticwidth * 70 / 100}
        ch = {staticheight * 37 / 100}
        />
      </div>

    {/*Render Predicted Water Dial*/}
      <div 
      style = {{
        position: 'absolute',
        transform: `translate(${75}vw, ${20}vh)`}}>
          <Dial
            title = 'Predicted Water (Week)'
            value = {total_water}
            unit = 'L'
            min={0}
            max={30 * 7}
            size={staticwidth / 18 + staticheight / 12}
            threshold={0.15}
            errorThreshold={0.05}
          />      
      </div>

      {/*Render Predicted Power Dial*/}
      <div 
      style = {{
        position: 'absolute',
        transform: `translate(${75}vw, ${50}vh)`}}>
          <Dial
            title = 'Predicted Power (Week)'
            value = {total_power}
            unit = 'KWH'
            min={0}
            max={12 * 7}
            size={staticwidth / 18 + staticheight / 12}
            threshold={0.15}
            errorThreshold={0.05}
          />      
      </div>

    {/*Render Bottom Taskbar*/}
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
        </p>
      </div>

    {/*Render Hour Forecast Button*/}
      <button 
      onClick = {() => {setTimeframe(0)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${25}vw, ${88}vh)`,
          width: '8vw',
          height: '5vh',
          fontSize: 20,
          background: timeframe === 0 ? Colors.flightblue : 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Hour Forecast
      </p>
      </button>

      {/*Render Day Forecast Button*/}
      <button 
      onClick = {() => {setTimeframe(1)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${25}vw, ${93}vh)`,
          width: '8vw',
          height: '5vh',
          fontSize: 20,
          background: timeframe === 1 ? Colors.flightblue : 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Day Forecast
      </p>
      </button>

      {/*Render Power Cons Button*/}
      <button 
      onClick = {() => {set1(0)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${34}vw, ${88}vh)`,
          width: '8vw',
          height: '5vh',
          fontSize: 20,
          background: select1 === 0 ? Colors.flightblue : 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Power Cons
      </p>
      </button>

    {/*Render Water Prod Button*/}
      <button 
      onClick = {() => {set1(1)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${34}vw, ${93}vh)`,
          width: '8vw',
          height: '5vh',
          fontSize: 20,
          background: select1 === 1 ? Colors.flightblue : 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Water Prod
      </p>
      </button>

      {/*Render Humidity Button*/}
      <button 
      onClick = {() => {set2(2)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${43}vw, ${88}vh)`,
          width: '8vw',
          height: '5vh',
          fontSize: 20,
          background: select2 === 2 ? Colors.flightblue : 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Humidity
      </p>
      </button>

    {/*Render Temp Button*/}
      <button 
      onClick = {() => {set2(3)}}
      style = {{
          position: 'absolute', 
          transform: `translate(${43}vw, ${93}vh)`,
          width: '8vw',
          height: '5vh',
          fontSize: 20,
          background: select2 === 3 ? Colors.flightblue : 'black',
          borderColor: Colors.flightblue
          }}
          >
      <p 
        align = 'center'
        style = {{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'white'
        }}>
      Temp
      </p>
      </button>

    {/*Render Place To Input Coordinates*/}
      <div>
      <label
      	style = {{
          position: 'absolute', 
          transform: `translate(${61}vw, ${83}vh)`,
          fontSize: 14,
          fontWeight: 'bold',
          color: Colors.flightblue
      	}}>
        Manual Latitude:
        <input
          type="number"
          value={manualLatitude}
          onChange={(e) => setManualLatitude(e.target.value)}
        />
      </label>
      <label
      	style = {{
          position: 'absolute', 
          transform: `translate(${61}vw, ${90}vh)`,
          fontSize: 14,
          fontWeight: 'bold',
          color: Colors.flightblue
      	}}>
        Manual Longitude:
        <input
          type="number"
          value={manualLongitude}
          onChange={(e) => setManualLongitude(e.target.value)}
        />
      </label>
    {/*Render Check Coordinates Button*/}
	  <button 
	  onClick={checkUserCoordinates}
	  style = {{
          position: 'absolute', 
          transform: `translate(${52}vw, ${88}vh)`,
          width: '8vw',
          height: '5vh',
          fontSize: 16,
          background: 'black',
          borderColor: Colors.flightblue
      }}
	  >Check Coordinates</button>

    {/*Render Reset Coordinates Button*/}
      <button 
      onClick={resetToNavigatorCoordinates}
      style = {{
          position: 'absolute', 
          transform: `translate(${52}vw, ${93}vh)`,
          width: '8vw',
          height: '5vh',
          fontSize: 16,
          background: 'black',
          borderColor: Colors.flightblue
      }}
      >
      Reset Coordinates
      </button>

    {/*Display Coodiantes*/}
      {userCoordinates ? (
        <p
        style = {{
          position: 'absolute', 
          transform: `translate(${25}vw, ${85}vh)`,
          fontSize: 16,
          color: 'white'
      	}}>
          User coordinates: Latitude {userCoordinates.latitude}, Longitude {userCoordinates.longitude}
        </p>
      ) : (
        <p
        style = {{
          position: 'absolute', 
          transform: `translate(${25}vw, ${85}vh)`,
          fontSize: 16,
          color: 'white'
      	}}>Unable to retrieve user coordinates.</p>
      )}
    </div>
    </div>
  );
}

export default Predictor;