import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

export function UserFormAddRfidModal(props) {

  const [showModal, setShowModal] = useState(false);
  const [rfid, setRfid ] = useState({card_hash:"", active: true, description:""});
  const [hashValid, setHashValid ] = useState(true);

  useEffect(()=> {
    if (props.rfid !== undefined) {
      setRfid(props.rfid);
    } 
    else {
      setRfid(prev=> {return {card_hash:"", active: true, description:""}});
    }
    setShowModal(props.show);
  },[props]);

  function checkValid() {
    let result = true;
    if (rfid.card_hash.match(/^[0-9A-Fa-f]{32}$/) == null) {
      setHashValid(false);
      result = false;
    }
    return result;
  }

  function clearModal() {
    //Set the modal back to the default state.
    setRfid(prev=> {return {card_hash:"", active: true, description:""}});
    //To hide the red warning bar initially
    setHashValid(true);
  }

  return (
    <Modal show={showModal} onHide={ ()=> {clearModal(); props.closeFunction();}} onExit ={()=> {clearModal(); props.closeFunction();}} >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
        <Form.Group className="mb-3" controlId="formDevice">
        <Form.Label>RFID description</Form.Label>
        <Form.Control type="text" placeholder="Description" value={rfid.description}
            onChange={(e)=> { 
              setRfid(prev => {return {...prev, description: e.target.value}})}
           }
        />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDevice">
        <Form.Label>RFID hash</Form.Label>
        <Form.Control type="text" maxlength="32" placeholder="Hash in hex format"  value={rfid.card_hash}
          onChange={(e)=> { 
            setRfid(prev => {return {...prev, card_hash: e.target.value}})}
          }
        />

        {!hashValid && <Alert variant="danger">Card hash length must be 32 hex chars</Alert> }
        </Form.Group>

        <Form.Group className="mb-3" controlId="modalEnabled">
        <Form.Check type="checkbox" label="RFID enabled?" checked={rfid.active} 
         onChange={
          e=> setRfid(prev => { return {...prev, active: e.target.checked}})
         }
        />
        </Form.Group>
        
      </Form>

    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={()=> { 
        props.closeFunction(); clearModal(); }
      }>
      Close
      </Button>
      <Button variant="primary" onClick={()=> {
        if (checkValid() == true) {
          //Trigger the callback
          props.okFunction(rfid); 
          //Clear out our fields ready for a future operation
          clearModal();
        }
        }}
      >
      Save Changes
      </Button>
    </Modal.Footer>    
  </Modal>
  );
}