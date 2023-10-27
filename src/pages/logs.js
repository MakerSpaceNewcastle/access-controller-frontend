import '../App.css';
import {LogList} from '../components/loglist';
import React, { useEffect, useState } from 'react';

let logsEndpoint = process.env.REACT_APP_API_BASEURL + "logs/count"

export function Logs(props) {

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);


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

  useEffect(() => {
    async function loadDataFromEndpoints() {
      let result = await fetch(logsEndpoint);
      let json = await result.json();
      setPageCount(json.count);
    };
    loadDataFromEndpoints();
  },[props]);

  return (
    <div className="App-header">
      <LogList page={currentPage}></LogList>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class= {currentPage == 0 && "page-item disabled" || "page item"}><a class="page-link" onClick={prevPage} href="#">Previous</a></li> 
          <li class="page-item"> <a class="page-link" href="#">1</a></li>
          <li class="page-item" ><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class={currentPage == pageCount-1 && "page-item disabled" || "page item"}><a class="page-link" onClick={nextPage}>Next</a></li>
        </ul>
      </nav>
    </div>
  );
};