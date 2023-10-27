import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from 'react';


export function CleverTable(props) {

    const [modifyButtonState, setmodifyButtonState] = useState(false);
    const [deleteButtonState, setdeleteButtonState] = useState(false);
    
    const [selectedIds, setselectedIds] = useState([]); //used to track selected items

    const [data, setdata] = useState([]);
    const [header, setheader] = useState([]);

    useEffect(()=> {
        if (typeof(props.data) !== 'undefined') {
            setdata(props.data);
        }
        if (typeof(props.header) !== 'undefined') {
            setheader(props.header);
        }       
    },[props]);

    //Props want to be:
    //callbacks for addFunction, modifyFunction, deleteFunction
    //table
    useEffect(() => {
        if (selectedIds.length === 0 ) {
          setmodifyButtonState(false);
          setdeleteButtonState(false);
        }
        else if (selectedIds.length === 1) {
            setmodifyButtonState(true);
            setdeleteButtonState(true);
        }
        else {
          //>1
          setmodifyButtonState(false);
          setdeleteButtonState(true);
        }
      }, [selectedIds]);

    function addClicked() {
        props.addFunction();
    }

    function checkboxChanged(e) {
        if (e.target.checked === true) {
            setselectedIds(prev=>[...prev, e.target.id]);
        }
        else {
            setselectedIds(prev => prev.filter(f=>f!==e.target.id))
        }
    }
    
    return (
        <div>
        <Table striped bordered hover variant="dark" key={header}>
        <thead><tr>
        <th>Select</th>
        {header.map(e=><th>{e.title}</th>)}
        </tr>
        </thead>
        <tbody>
        {
            data.map(row=> {
            console.log(row);
               return ( 
                <tr>
                <td><Form.Check type="checkbox" id={row.id} onChange={e=>checkboxChanged(e)} checked={selectedIds.find(e=>row.id == e)}/></td>
                
                {header.map(column => {
                    //Booleans will generate a 'checkbox', all other types are string values
                if (typeof row[column.name] === 'boolean') {
                    return <td><Form.Check type="checkbox" readOnly checked={row[column.name]}/> </td>
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

        <table buttontable align="center">
        <tbody>
        <tr><td>
        {
        props.addFunction && 
        <Button variant="primary" onClick={addClicked}>
        Add
        </Button>
        }              
        </td>
        <td>
        { 
            modifyButtonState && props.modifyFunction && 
            <Button variant="warning"  onClick={()=> { props.modifyFunction(selectedIds) }}>
            Modify
            </Button>  
        }
        </td>
        <td>
        { 
            deleteButtonState && props.deleteFunction && 
            <Button variant="danger"   onClick={()=> { props.deleteFunction(selectedIds);  setselectedIds([]); }}>
            Delete
            </Button>  
        }
        </td></tr>
        </tbody>
        </table>

        </div>
    );
}
