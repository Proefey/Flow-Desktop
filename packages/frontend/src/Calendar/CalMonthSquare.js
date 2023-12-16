import React, { Component } from 'react';
import {Link } from 'react-router-dom';
import Colors from '../Const/Colors'

const CalMonthSquare = props => {

	/* HELPER FUNCTIONS */
	//Trunacte Function
	function truncate(str, maxlength) {
	  if (str.length > maxlength){
	    return str.slice(0, maxlength - 1) + '…';
	  }
	  else return str;
	}

	//Convert Date to String For Linking
  	function linkString(linkDate){
	    const linkYear = linkDate.getFullYear();
	    const linkMonth = linkDate.getMonth() + 1;
	    const linkDay = linkDate.getDate();
	    return linkYear + "-" + linkMonth + "-" + linkDay;
  	}



	//Constants (Controls Width and Height of all calendar squares)
	const height = 124;
	const width = 160;
	const weekdays = ['Sunday', 'Monday', 'Tuesday', 
	'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	//Inputs
	const num = props.num; //Determines position of square
	var isTop = false; //Determines if square is on top
	if(num < 7) isTop = true;
	//Calculates position of square based on calendar position and num
	const calendarx = props.cx;
	const calendary = props.cy;
	const x_pos = (width * 1.05 * (num % 7)) + calendarx;
	const y_pos = (height * 1.05 * (Math.floor(num / 7))) + calendary;

	//Thing to display
	const date = props.date;

	//Out of month days are greyed out
	var titleopacity = 1;
	var inmonth = true;
	if((props.month) != date.getMonth()) {
		titleopacity = 0.25;
		inmonth = false;
	}

	return(
		<div className='CalendarSquare'>
			<div 
			style={{ background: Colors.flightblue, 
			opacity: titleopacity,
			position: 'absolute', 
			transform: `translate(${x_pos}px, ${y_pos}px)`,
			width: width,
			height: height,
			border: 'none'
			}}>
			<p 
			align = 'justify'
			align = 'center'
			style = {{
        		fontSize: 16,
        		fontWeight: 'bold'
      		}}>
			{date.getDate()}
			</p>
			</div>

			{isTop && (<div 
			style={{ background: 'white', 
			position: 'absolute', 
			transform: `translate(${x_pos}px, ${y_pos - height * 1 / 4}px)`,
			border: 'solid',
			width: width,
			height: height * 1 / 4,
			}}>
			<p 
			align = 'justify'
			align = 'center'
			style = {{
        		fontSize: 16,
        		fontWeight: 'bold'
      		}}>
			{weekdays[num]}
			</p>
			</div>)}

			{props.hasdata && inmonth &&  (
				<div style = {{
					opacity: titleopacity
				}}>
					<div style={{
					 position: "absolute", 
					 transform: `translate(${x_pos + width * 0.01}px, ${y_pos + height * 0.55}px)`,
					 width: width / 2, 
					 height: height * 0.3, 
					 backgroundColor: "#0E87CC", 
					 borderRadius: "50%"  
					}}/>

					<div style={{
					 position: "absolute", 
					 transform: `translate(${x_pos + width * 0.7}px, ${y_pos + height * 0.55}px)`,
					 width: width * 0.30, 
					 height: height / 3, 
					 backgroundColor: "#0E87CC", 
					 borderRadius: "50%"  
					}}/>

					<div style={{
					 position: "absolute", 
					 transform: `translate(${x_pos}px, ${y_pos + height * 2 / 3}px)`,
					 width: width, 
					 height: height / 3, 
					 backgroundColor: "#0E87CC", 
					 textAlign: 'center',
					 fontWeight: 'bold'
					}}>
					{props.WP + " Liters Prod"}
					</div>

					<div style={{
					 position: "absolute", 
					 transform: `translate(${x_pos + width * 0.35}px, ${y_pos + height * 0.35}px)`,
					 width: width / 2, 
					 height: height / 3, 
					 backgroundColor: Colors.flightblue, 
					 borderRadius: "50%" , 
					 border: 'none'
					}}/>
				</div>
			)}

			<div>
			<button 
			onClick = {() => {props.changeDate(date)}}
			style = {{
	        background: 'transparent',
	        position: 'absolute', 
	        transform: `translate(${x_pos}px, ${y_pos}px)`,
	        width: width,
	        height: height,
	        fontSize: 20,
	        color: 'black',
	        opacity: titleopacity,
	        borderColor: Colors.flightblue
	      	}}
	      	>
	      	</button>
	      	</div>
		</div>
		);
};

export default CalMonthSquare;