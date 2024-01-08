import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const AddMachine = (props) => {
  const navigate = useNavigate();
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

  const handleSubmit = async () => {
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
      if(props.MName.includes(formData.name)){
          alert("Name already given to different machine");
          return;
      }
      if(props.MID.includes(formData.ID)){
          alert("ID already registered with user");
          return;
      }
      try {
        await fetch(
        `http://localhost:5000/users/` + props.UID + '/' + formData.name + '/' + formData.ID,
          {
            method: "PUT",
            headers: props.addHeader()
          }
        );
      } catch (error) {
        console.error("Error adding machine:", error);
      }
  };

  return (
    <div>
      <h2>Simple Form</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => navigate("/month")}>Back</button>
    </div>
  );
};

export default AddMachine;