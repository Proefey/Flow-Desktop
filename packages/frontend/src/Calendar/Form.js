import React, {useState} from 'react';

function Form(props){
	const[task, setTask] = useState(
		{
			name: "",
			desc: "",
			date: '',
			time: '',
			duration: 0,
		}
	);

	function handleChange(event){
		const {name, value} = event.target;
		if(name === "name")
			setTask(
				{name: value, desc: task['desc'], date: task['date'], time: task['time'], duration: task['duration']}
			);
		else if (name === "desc")
			setTask(
				{name: task['name'], desc: value, date: task['date'], time: task['time'], duration: task['duration']}
			);
		else if (name === "date")
			setTask(
				{name: task['name'], desc: task['desc'], date: value, time: task['time'], duration: task['duration']}
			);
		else if (name === "time")
		setTask(
				{name: task['name'], desc: task['desc'], date: task['date'], time: value, duration: task['duration']}
			);
		else
			setTask(
				{name: task['name'], desc: task['desc'], date: task['date'], time: task['time'], duration: value}
			);
	}

	function submitForm(){
		console.info(task);
		props.handleSubmit(task);
		setTask({name: '', desc: '', date: '', duration: 0});
	}

	return(
		<div style={{ background: '#ADD8E6', 
      		position: 'absolute', 
      		transform: `translate(${1300}px, ${120}px)`,
      		border: 'solid',
      		width: 600
      	}}>
		<form>
      		<label htmlFor="name">Name</label>
      	<input
        	type="text"
        	name="name"
        	id="name"
        	value={task.name}
        	onChange={handleChange} />
      	<label htmlFor="desc">Description</label>
      	<input
        	type= "text"
        	name="desc"
        	id="desc"
        	value={task.desc}
        	onChange={handleChange} />
        <label htmlFor="date">Date</label>
      	<input
        	type="date"
        	name="date"
        	id="date"
        	value={task.date}
        	onChange={handleChange} />
        <label htmlFor="time">Time</label>
      	<input
        	type="time"
        	name="time"
        	id="time"
        	value={task.time}
        	onChange={handleChange} />
        <label htmlFor="duration">Duration (In Minutes)</label>
      	<input
        	type= "number"
        	name="duration"
        	id="duration"
        	value={task.duration}
        	onChange={handleChange} />
        <input 
        	type="button" 
        	value="Submit" 
        	onClick={submitForm} />
    	</form>
    	</div>
	);
		
}

export default Form;