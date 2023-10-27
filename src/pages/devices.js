import React, { useEffect, useState } from 'react';
import '../App.css';
import {DeviceList} from '../components/devicelist';

export function Devices(props) {
    return (
        <div className="App-header">
            <DeviceList/> 
        </div>
    );
}