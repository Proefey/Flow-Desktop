import React, {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import CalMonth from "./Calendar/CalMonth";
import CalWeek from "./Calendar/CalWeek";
import CalDay from "./Calendar/CalDay";

const curdate = new Date();
const curyear = curdate.getFullYear();
const curmonth = curdate.getMonth() + 1;
const curday = curdate.getDate();
function MyApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "week" element={<Navigate replace to = {curyear + "-" + curmonth + "-" + curday} />} />
        <Route path = "week/:newdate" element = {<div> <CalWeek/> </div>} />
        <Route path = "month" element={<Navigate replace to = {curyear + "-" + curmonth + "-" + curday} />} />
        <Route path = "month/:newdate" element = {<div> <CalMonth/> </div>} />
        <Route path = "day" element={<Navigate replace to = {curyear + "-" + curmonth + "-" + curday} />} />
        <Route path = "day/:newdate" element = {<div> <CalDay/> </div>} />
      </Routes>
    </BrowserRouter>
    );
 }

 export default MyApp;