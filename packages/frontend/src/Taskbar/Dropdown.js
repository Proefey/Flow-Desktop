import React, { useState } from 'react';
import Colors from '../Const/Colors';
import { Link, useNavigate } from "react-router-dom";


const Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  function handleOptionSelect(index){
    setSelectedOption(index);
    setIsOpen(false);
    props.changeTarget(index);
    console.info(index);
  };

  const handleDeleteOption = async (index) => {
    console.info("ToDelete" + index);
    const DeleteMID = props.MID[index];
    const DeleteMNAME = props.MName[index];
    try {
        await fetch(
        `http://localhost:5000/users/` + props.UID + '/' + DeleteMNAME + '/' + DeleteMID,
          {
            method: "DELETE",
            headers: props.addHeader(),
          }
        );
        const updatedMName = [...props.MName];
        const updatedMID = [...props.MID];
        updatedMName.splice(index, 1);
        updatedMID.splice(index, 1);
        props.setMName(updatedMName);
        props.setMID(updatedMID);

        // Clear the selected option if it's deleted
        if (selectedOption === index) {
          setSelectedOption(null);
        }
      } catch (error) {
        console.error("Error deleting machine:", error);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${280}px, ${30}px)`
      }}
    >
      <div
        style={{
          cursor: 'pointer',
          padding: '15px 30px 15px 30px',
          border: '1px solid',
          backgroundColor: 'black',
          color: Colors.flightblue,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onClick={toggleDropdown}
      >
        <span>Machine ID</span>
        <div
          style={{
            transition: 'transform 0.3s ease-in-out',
            transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0)',
          }}
        >
          &#9660;
        </div>
      </div>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            width: '200px',
            backgroundColor: 'black',
            border: '1px solid #ccc',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            borderColor: Colors.flightblue
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              margin: '0',
              padding: '0',
            }}
          >
            {/* Dynamically generate list items from the options array */}
            {props.MName.map((option, index) => (
              <li
                key={index}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease-in-out',
                  color: Colors.flightblue,
                }}
              onClick={() => handleOptionSelect(index)}
              >
                <span onClick={() => handleOptionSelect(index)}>{option}</span>
                <button onClick={() => handleDeleteOption(index)} style={{ marginLeft: '10px' }}>
                  Delete
                </button>
              </li>
            ))}
              <div>
                <Link to = {"/addMachine"}>
                <li
                  key={props.MName.length + 1}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease-in-out',
                    color: Colors.flightblue,
                  }}
                >
                  Add New Machine
                </li>
                </Link>
              </div>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;