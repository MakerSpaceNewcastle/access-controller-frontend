import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

export function UserFormAddDeviceModal(props) {

  const [showModal, setShowModal] = useState(false);
  const [devicesToChoose, setDevicesToChoose] = useState([])
  const [selectedDevice, setSelectedDevice] = useState({});


  useEffect(()=> {
    if (props.allDevices!==undefined) {
      setDevicesToChoose(props.allDevices.filter(e=>  { return  props.currentDevices.find(f=> f.id == e.id  )  == undefined    }));
      setShowModal(props.show);
    };
   },[props]);

  function checkValid() {
    let result = true;
  }

  function clearModal() {
    setSelectedDevice();
  }

  return (
    <Modal show={showModal} onHide={ ()=> {clearModal(); props.closeFunction();}} onExit ={()=> {clearModal(); props.closeFunction();}} >
     <Modal.Header closeButton>
     <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
        <Form.Group className="mb-3" controlId="formDevice">
        <Form.Label>Device to add:</Form.Label>
        <Form.Select
         onChange={(e)=> {
            setSelectedDevice(props.allDevices.find(device=> device.id == e.target.value));
            }
        }>
        <option>Choose a device:</option>
        {devicesToChoose.map(device=> {
           return <option value={device.id}>{device.name}{device.available === 1? "" : " (unavailable)"}</option>
        })}
        </Form.Select>
        </Form.Group>
      </Form>

    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={()=> { 
        props.closeFunction(); clearModal(); }
      }>
      Cancel
      </Button>
      <Button variant="primary" onClick={()=> { 
        if (selectedDevice.id)  {
          props.okFunction(selectedDevice); clearModal();}
        }}
      >
      Add
      </Button>
    </Modal.Footer>   
  </Modal>
  );
}