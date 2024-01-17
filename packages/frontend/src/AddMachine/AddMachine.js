import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

const AddMachine = (props) => {
  const navigate = useNavigate();
  const [MNAME, setMNAME] = useState([]);
  const [MID, setMID] = useState([]);
  const addHeader = props.addHeader;
  const UID = props.UID;

  function fetchData() {
    const promise = fetch(`http://localhost:5000/users/` + UID, {
        headers: addHeader()
    });
    return promise;
  }

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
  }, [UID, addHeader]);

  const [formData, setFormData] = useState({
    name: 'ex',
    ID: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
      if(MNAME.includes(formData.name)){
          alert("Name already given to different machine");
          return;
      }
      if(MID.includes(formData.ID)){
          alert("ID already registered with user");
          return;
      }
      handleSubmit();
      navigate("/month")
  }

  const handleSubmit = async () => {
      try {
        fetch(
        `http://localhost:5000/users/` + UID + '/' + formData.name + '/' + formData.ID,
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
      <h2>Simple Form</h2>
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
      <button onClick={() => navigate("/month")}>Back</button>
    </div>
  );
};

export default AddMachine;