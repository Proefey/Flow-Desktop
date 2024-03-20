import React, { useState, useEffect, useCallback} from 'react';
import { useNavigate } from "react-router-dom";
import Colors from "../Const/Colors"
import {Backend_URL} from "../Const/Urls";

const AddMachine = (props) => {
  const navigate = useNavigate();
  const [MNAME, setMNAME] = useState([]);
  const [MID, setMID] = useState([]);
  const addHeader = props.addHeader;
  const UID = props.UID;

  const [formData, setFormData] = useState({
    name: 'ex',
    ID: 0,
  });

  //Checks if string only contains letters and numbers
  function onlyLettersAndNumbers(str) {
    return /^[A-Za-z0-9]*$/.test(str);
  }

  //Fetches the set of machine IDs and machine Names related to the user
  const fetchData = useCallback(() => {
    const promise = fetch(Backend_URL + `/users/` + UID, {
    headers: addHeader()
    });
    return promise;
  }, [UID, addHeader]); 

  useEffect(() => {
      fetchData()
          .then((res) => res.json())
          .then((json) => {
              setMNAME(json["machineName"]);
              setMID(json["machineID"]);
            })
          .catch((error) => {
              console.log(error);
              setMNAME(null); // To indicate API call failed
          });
  }, [UID, addHeader, fetchData]);

  //Updates formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Checks the input for proper validation
  const onsave = (e) => {
      e.preventDefault();
      // Check if name is given
      if (formData.name === "") {
          alert("Please give a name for the machine.");
          return;
      }
      // Check if ID is given
      if (formData.ID <= 0 ){
          alert("Please give a valid ID for the machine.");
          return;
      }
      // Check if name is already taken
      if(MNAME.includes(formData.name)){
          alert("Name already given to different machine");
          return;
      }

      // Check if name is valid
      if(!onlyLettersAndNumbers(formData.name)){
          alert("Name may only contain letters and numbers");
          return; 
      }

      // Check if ID is already taken
      if(MID.includes(Number(formData.ID))){
          alert("ID already registered with user");
          return;
      }

      handleSubmit();
      //Return to overview
      navigate("/overview")
  }

  //Sends machine data to backend
  const handleSubmit = async () => {
      try {
        fetch(
        Backend_URL + `/users/` + UID + '/' + formData.name + '/' + formData.ID,
          {
            method: "PUT",
            headers: props.addHeader()
          }
        );
      } catch (error) {
        console.error("Error adding machine:", error.message);
      }

  };

  return (
    <div>
      <style>{'body { background-color: #000000; }'}</style> 
      <div         
        style = {{
        transform: `translate(${10}vw, ${25}vh)`,
        position:'absolute',
        background: Colors.flightblue,
        opacity: 1,
        width: '50vw',
        height: '50vh',
        border: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
        }}>
        <div>
        <h2>Add Machine</h2>
        <form>
          <label>
            Machine Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Machine ID Number
            <input
              type="number"
              name="ID"
              value={formData.ID}
              onChange={handleChange}
            />
          </label>
          <br />
          <button onClick={onsave}>Submit</button>
        </form>
        <button onClick={() => navigate("/overview")}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default AddMachine;