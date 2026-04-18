import React from 'react';
import './Day.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Today from '../../components/today/Today'

const Day=()=>{
    return (
        <div className="day">
            <Sidebar/>
            <div className="dayContainer">
            <div className="today-title">
                <p>Today</p>
                <span>4</span>
            </div>

            <Today/>
            </div>
        </div>
    )
}
export default Day;