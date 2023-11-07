import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'

import '../App.css';

let logsEndpoint = process.env.REACT_APP_API_BASEURL + "logs"

export function LogList(props) {
    //Define the header for the log event table
    let header = [
        {
            name: "datetime",
            title: "Date/Time"
        },
        {
            name: "source",
            title:"Source"
        },
        {   name: "type",
            title: "Event type"
        },
        {
            name: "message",
            title: "Message"
        }
    ];

    const [logData, setLogData] = useState([]);

    async function loadDataFromEndpoint() {
        let startEntry = props.entriesPerPage * props.pageNum;
        let url = logsEndpoint + "?start=" + startEntry  + "&end="+ (startEntry + props.entriesPerPage) + "&device=" + props.deviceFilter;
        let result = await fetch(url);
        let data = await result.json();
        setLogData(data);
    }
    useEffect(()=> {
        loadDataFromEndpoint();
        //Load the list of users on component render
    }, [props]);

return (
    <div class="Table">
    <Table striped bordered hover variant="dark" key={header} >
    <thead><tr>
    {header.map(e=><th>{e.title}</th>)}
    </tr>
    </thead>
    <tbody>
    {
        logData.map(row=> {
        //For each row:
         return ( 
            <tr >
            {header.map(column => { 
                if (column.name == "type") {
                    switch (row[column.name]) {
                        case "LoginFail":
                            return <div class="LoginFailRow"> <td>{row[column.name]}</td></div>
                        case "Activated":
                            return <div class="ActivatedRow"> <td>{row[column.name]}</td></div>
                        case "Deactivated":
                            return <div class="DeactivatedRow"> <td>{row[column.name]}</td></div>
                        default:
                            return <td>{row[column.name]}</td>
                    }
                }
                else {
                    return <td>{row[column.name]}</td>
                }
            })}
            </tr>
        )           
        })
    }
    </tbody>
    </Table>   
    </div>
);
};