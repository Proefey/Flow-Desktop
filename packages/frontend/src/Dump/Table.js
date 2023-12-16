import React from "react";
function TableHeader(props) {
  const currentdate = props.current;
  return (
    <thead>
      <td>  
              <button onClick={() =>
                  props.increasemonth(-1)}>
                  Previous Month
              </button>
      </td>
      <td>  
              <button onClick={() =>
                  props.increasemonth(1)}>
                  Next Month
              </button>
      </td>
      <tr> 
        Current Date: {currentdate.toLocaleDateString()} 
      </tr>
      <tr>
        <th scope = "col">Sunday</th>
        <th scope = "col">Monday</th>
        <th scope = "col">Tuesday</th>
        <th scope = "col">Wednesday</th>
        <th scope = "col">Thursday</th>
        <th scope = "col">Friday</th>
        <th scope = "col">Saturday</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.displaydays.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row[0]}</td>
        <td>{row[1]}</td>
        <td>{row[2]}</td>
        <td>{row[3]}</td>
        <td>{row[4]}</td>
        <td>{row[5]}</td>
        <td>{row[6]}</td>
      </tr>
    );
   }
  );
  return (
      <tbody>
        {rows}
       </tbody>
   );
}

function Table(props) {
    return (
      <table>
        <TableHeader current = {props.current}
        increasemonth = {props.increasemonth}/>
        <TableBody displaydays = {props.displaydays}/>
      </table>
    );
}

export default Table;