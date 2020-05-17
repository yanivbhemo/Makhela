
import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const Reasercher = () => {
    // Declare a new state variable, which we'll call "count"
    const startDate = new Date()
    const [sellectedDate, setDate] = useState(startDate);
    // const [count, setCount] = useState(0);
    useEffect(() => {
        console.log(sellectedDate)
        console.log(sellectedDate.getDate())
        console.log(sellectedDate.getMonth()+1)
        console.log(sellectedDate.getFullYear())

        // Fetch the keywords before and after the date

      });
     var saveSearch = () => {
          console.log("Saved")
          // save to db
      }
    return (
        <div>
            {/* <p>You clicked {count} times</p> */}
            <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={sellectedDate}
                onChange={date => setDate(date)}
            />
            {/* <button onClick={() => setCount(count + 1)}>
                Click me
            </button> */}
         {/* {sellectedDate} */}
         <button onClick={saveSearch}>Save search</button>
        </div>
    );
}
export default Reasercher;

// class Reasercher extends React.Component {
//     state = {
//       startDate: new Date()
//     };
   
//     handleChange = date => {
//       this.setState({
//         startDate: date
//       });
//     };
   
//     render() {
//       return (
        // <DatePicker
        //   selected={this.state.startDate}
        //   onChange={this.handleChange}
        // />
//       );
//     }
//   }
//   export default Reasercher;