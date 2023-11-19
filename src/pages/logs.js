import '../App.css';
import Pagination from "react-js-pagination";


import {LogList} from '../components/loglist';
import React, { useEffect, useState } from 'react';

let entriesPerPage=10;

let countEndpoint = process.env.REACT_APP_API_BASEURL + "logs/count"
//Used to filter by device
let devicesEndpoint = process.env.REACT_APP_API_BASEURL + "devices"

export function Logs(props) {

  const [currentPage, setCurrentPage] = useState(1);
  const [numItems, setNumItems] = useState(0);

  //These are used to allow the user to filter by device
  const [deviceList, setDeviceList] = useState([]);
  const [deviceFilter, setDeviceFilter] = useState("all");
  
  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  useEffect(() =>  {
    async function loadDataFromEndpoints() {
      //Populate device list to allow filtering
      let deviceList = await fetch(devicesEndpoint);
      let devicejson = await deviceList.json();
      setDeviceList(devicejson);

      //Work out how many items there are - the paginator will use this to work out
      //what pages to display
      let count = await fetch(countEndpoint + "?device=" + deviceFilter)
      let json = await count.json();
      setNumItems(json.count);
    };

    if (currentPage == 1) {
      loadDataFromEndpoints();
      //Only worth autorefreshing if we're on 'first' page
      const autoRefresh = setInterval(()=> {
        loadDataFromEndpoints();
      }, 10000);      
      return () => clearInterval(autoRefresh);
    }
    else {
      loadDataFromEndpoints();
    }

  },[props, deviceFilter]);


  return (
    <div className="App-header">
      <div>
        Filter by device:
        <select name="device" id="device" onChange={e=>setDeviceFilter(e.target.value)}>
          <option key="all">all</option>
          {deviceList.map(e=> {return <option key={e.id} value = {e.name}>{e.name}</option>})}
        </select>
      </div>

      <LogList pageNum={currentPage-1} entriesPerPage={entriesPerPage} deviceFilter={deviceFilter}></LogList>
      <Pagination 
      activePage = {currentPage}
      pageRangeDisplayed ={5}
      itemsCountPerPage ={10}
      totalItemsCount = {numItems}
      itemClass="page-item"
      linkClass="page-link"
      onChange={(num)=>handlePageChange(num)}
      
      />

    </div>
  );
};
