import '../App.css';

import {LogList} from '../components/loglist';
import React, { useEffect, useState } from 'react';

let entriesPerPage=10;

let countEndpoint = process.env.REACT_APP_API_BASEURL + "logs/count"

//Used to filter by device
let devicesEndpoint = process.env.REACT_APP_API_BASEURL + "devices"

export function Logs(props) {

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  //These are used to allow the user to filter by device
  const [deviceList, setDeviceList] = useState([]);
  const [deviceFilter, setDeviceFilter] = useState("all");
  
  function nextPage() {
    setCurrentPage(prev=>{return prev+1})
  }

  function prevPage() {
    let tempPage = currentPage;
    if (tempPage > 0) {
      tempPage -=1;
    }
    setCurrentPage(tempPage); 
  }

  useEffect(() =>  {
    async function loadDataFromEndpoints() {
      //Work out how many pages we are going to need to display results.
      let count = await fetch(countEndpoint + "?device=" + deviceFilter)
      let json = await count.json();
      setPageCount(Math.ceil(json.count / entriesPerPage));
      
      //Populate device list to allow filtering
      let deviceList = await fetch(devicesEndpoint);
      let devicejson = await deviceList.json();
      setDeviceList(devicejson);
    };

    const autoRefresh = setInterval(()=> {
	loadDataFromEndpoints();
	}, 10000);
    
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

      <LogList pageNum={currentPage} entriesPerPage={entriesPerPage} deviceFilter={deviceFilter}></LogList>
      <nav aria-label="Navigation">
        <ul class="pagination justify-content-center table">     
          <li class= {currentPage == 0 && "page-item disabled" || "page item"}>
            <a class="page-link" onClick={prevPage} href="#">Previous</a>
          </li> 
          <li class={currentPage + 1 > pageCount-1 && "page-item disabled" || "page item"}> 
            <a class="page-link" onClick={()=>{setCurrentPage(currentPage+1)}}>{currentPage + 1}</a>
          </li>
          <li class={currentPage + 2 > pageCount-1 && "page-item disabled" || "page item"}> 
            <a class="page-link" onClick={()=>{setCurrentPage(currentPage+2)}}>{currentPage + 2}</a>
          </li>
          <li class={currentPage + 3 > pageCount-1 && "page-item disabled" || "page item"}> 
            <a class="page-link" onClick={()=>{setCurrentPage(currentPage+3)}}>{currentPage + 3}</a>
          </li>
          <li class={currentPage + 4 > pageCount-1 && "page-item disabled" || "page item"}> 
            <a class="page-link" onClick={()=>{setCurrentPage(currentPage+4)}}>{currentPage + 4}</a>
          </li>
          <li class={currentPage == pageCount-1 && "page-item disabled" || "page item"}>
            <a class="page-link" onClick={nextPage}>Next</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
