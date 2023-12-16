import React, { Component } from 'react';
import {Link } from 'react-router-dom';

//Note:This Is Also Used For the Daily Calendar
const CalWeekSquare = props => {

	/* HELPER FUNCTIONS */
	//Convert Date to String For Linking
  	function linkString(linkDate){
	    const linkYear = linkDate.getFullYear();
	    const linkMonth = linkDate.getMonth() + 1;
	    const linkDay = linkDate.getDate();
	    return linkYear + "-" + linkMonth + "-" + linkDay;
  	}

	//Constants (Controls Width and Height of all calendar squares)
	const headerheight = 31;
	const weekdays = ['Sunday', 'Monday', 'Tuesday', 
	'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	//Position and Time Inputs
	const num = props.num;					//The Index of The Square
	const date = props.date;				//Date The Square is Displaying
	const calheight = props.calheight;		//Height of calendar
	const width = props.width;				//Width of calendar square
	const xpos = props.x + width * num;		//Position of calendar square
	const ypos = props.y;					//Position of calendar square
	const hourbegin = props.begin;			//Beginning Hour of Calendar
	const hourend = props.end;				//Ending Hour Of Calendar

	//Create schedule background
	const hourarray = props.hourarray;
	const hourheight = props.hourheight;
	const totalhours = props.totalhours;

	//Event inputs
	/*Note for Implementing With Backend
	times and durations are assumed to be in minutes
	*/
	const titles = props.titles;
	const times = props.times;				
	const durations = props.durations;		
	const descriptions = props.descriptions;
	const colors = props.colors;
	var toMap;
	var hasevent = false;
	var percentduration;
	//If there are events to be displayed
	if(titles != null && titles.length > 0){
		hasevent = true;
		const len = titles.length;
		//Used for looping in div
		toMap = new Array(len);
		//Used for calculating the height of the event square
		percentduration = new Array(len);
		for(var i = 0; i < len; i++){
			toMap[i] = i;
			percentduration[i] = durations[i] / 60;
		}
	}

	//Trunacte Function
	function truncate(str, maxlength) {
	  if (str.length > maxlength){
	    return str.slice(0, maxlength - 1) + '…';
	  }
	  else return str;
	}

	//Depending On How Time Is Passed, This Function May Be Unnecessary
	function timeToString(num){
		const passedtime = times[num];
		const passedduration = durations[num];
		const passedendtime = Number(passedtime) + Number(passedduration);
		//Hours 
		var passedbeginhour = Math.floor(passedtime / 60);
		var passedendhour = Math.floor(passedendtime / 60);
		var beginAM = " AM";
		var endAM = " AM";
		//Minutes
		var beginminutes = Math.floor(passedtime % 60);
		if(beginminutes < 10) beginminutes = "0" + beginminutes;
		var endminutes = Math.floor(passedendtime % 60);
		if(endminutes < 10) endminutes = "0" + endminutes;
		//Format hours
		if(passedbeginhour == 0) passedbeginhour = 12;
		else if(passedbeginhour > 12){
			passedbeginhour -= 12;
			beginAM = " PM";
		}
		else if(passedbeginhour == 12){
			beginAM = " PM";
		}
		if(passedendhour == 0) passedendhour = 12;
		else if(passedendhour > 12){
			passedendhour -= 12;
			endAM = " PM";
		}
		else if(passedendhour == 12){
			endAM = " PM";
		}
		return passedbeginhour + ":" + beginminutes + beginAM + "-" + passedendhour + ":" + endminutes + endAM;
	}

	return(
		<div>
		   <div 
			style={{ background: '#d3d3d3', 
			position: 'absolute', 
			transform: `translate(${xpos}px, ${ypos - headerheight * 2}px)`,
			border: 'solid',
			borderBottom: 'none',
			width: width,
			height: headerheight * 2
			}}>
			<p 
			align = 'justify'
			align = 'center'
			style = {{
        		fontSize: 16,
        		fontWeight: 'bold'
      		}}>
			{weekdays[date.getDay()]}
			<br />
			{date.toLocaleDateString()}
			</p>
		  </div>

		  <div 
			style={{ background: 'white', 
			position: 'absolute', 
			transform: `translate(${xpos}px, ${ypos}px)`,
			border: 'solid',
			borderTop: 'none',
			width: width,
			height: hourheight * totalhours
			}}/>

		  {hourarray.map((num) => <div
		 	key = {num}
		  	style={{ background: '#ADD8E6', 
			position: 'absolute', 
			transform: `translate(${xpos}px, ${ypos + (num * hourheight) }px)`,
			border: 'solid',
			borderBottom: 'none',
			width: width,
			height: hourheight / 2
			}}>
			</div>
		  	)}

		  {hasevent && toMap.map((num) => <div	
		  	key = {num}	
		  	style={{ background: colors[num], 
			position: 'absolute', 
			transform: `translate(${xpos}px, ${ypos + Math.floor(hourheight * (times[num] - hourbegin * 60) / 60)}px)`,
			border: 'solid',
			width: width,
			height: hourheight * percentduration[num],
			overflow: 'hidden',
			}}>      
			<p 
		      align = 'justify'
		      align = 'left'
		      style = {{
		            fontSize: 16,
		            fontWeight: 'bold',
		          }}>
		      {titles[num]} <br />
		      <span style = {{fontSize: 12}}>	      
		      {timeToString(num)} <br />
		      {descriptions[num]}
		      </span>
      		</p>
      		</div>
		  	)}

		  	<div>
		  	<Link to= {"/day/" + linkString(date)}>
		  	<button style = {{
	        background: 'transparent',
	        position: 'absolute', 
	        transform: `translate(${xpos}px, ${ypos}px)`,
	        border: 'solid',
	        borderTop: 'none',
	        width: width,
	        height: calheight,
	        fontSize: 20,
	        color: 'black',
	      	}}
	      	>
	      	</button>
	      	</Link>
	      	</div>

		</div>
		);
};

export default CalWeekSquare;