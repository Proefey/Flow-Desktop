import React, { useState, useEffect } from 'react';
import Colors from '../Const/Colors';
import { Link} from "react-router-dom";
import {Backend_URL} from "../Const/Urls";


const Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [options, setOptions] = useState([]);
  const [MID, setMID] = useState([]);
  const [displayName, setDisplayName] = useState("Machine ID");
  const changeOptions = props.changeOptions;
  const changeMID = props.changeMID;


  //For authentication purposes
  const addHeader = props.addHeader;
  const UID = props.UID;
  //This is the target machine for both singleview and the predictor
  var target = 0;

  function fetchData() {
    const promise = fetch(Backend_URL + `/users/` + UID, {
    headers: addHeader()
    });
    return promise;
  }; 

  //Fetch the machine names and machine IDs
  useEffect(() => {
    fetchData()
        .then((res) => res.json())
        .then((json) => {
            setOptions(json["machineName"]);
            setMID(json["machineID"]);
            changeOptions(json["machineName"]);
            changeMID(json["machineID"]);
          })
        .catch((error) => {
            console.log(error);
            setOptions(null); // To indicate API call failed
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [changeMID, changeOptions]);

  //Allow the user to activate and deactivate the dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  //Handle a user selecting an option
  function handleOptionSelect(index){
    setIsOpen(false);
    if(isDeleted === false) {
      props.changeTarget(MID[index]);
      setDisplayName(options[index]);
      target = index;
    }
    else if (options.length > 0){
      props.changeTarget(MID[0]);
      setDisplayName(options[0]);
      target = 0;
      setDeleted(false);
    }
  };

  const delay = ms => new Promise(res => setTimeout(res, ms));

  //Allow a user to delete a machine from the dropdown
  const handleDeleteOption = async (index) => {
    const DeleteMID = MID[index];
    const DeleteMNAME = options[index];
    try {
        //Send request to server to delete machine
        await fetch(
        Backend_URL  + `/users/` + props.UID + '/' + DeleteMNAME + '/' + DeleteMID,
          {
            method: "DELETE",
            headers: addHeader(),
          }
        );
        setDeleted(true);
        console.info(isDeleted);

        //Refetch the list of machine names and IDs
        fetchData()
        .then((res) => res.json())
        .then((json) => {
            setOptions(json["machineName"]);
            setMID(json["machineID"]);
            props.changeOptions(json["machineName"]);
            props.changeMID(json["machineID"]);
          })
        .catch((error) => {
            console.log(error);
            setOptions(null); // To indicate API call failed
        });
        //If no more options are left, display MACHINE ID
        if(options.length < 1){
          setDisplayName("Machine ID");
        }
        else if(target === index){
          props.changeTarget(MID[0]);
          setDisplayName(options[0]);
        }
      } catch (error) {
        delay(5000);
        console.error("Error deleting machine:", error);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${2}vw, ${3}vh)`
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
          width: '20vw'
        }}
        onClick={toggleDropdown}
      >
        <span>{displayName}</span>
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
            width: '20vw',
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
            {options.map((option, index) => (
              <li
                key={index + 2}
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
                  key={options.length + 1}
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