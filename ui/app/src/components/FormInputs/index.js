import React, { useState } from 'react';

function TextInput(props) {
    // Declare a new state variable, which we'll call "count"
    // const [count, setCount] = useState(0);

    return(
        <input style={{width: props.width, marginLeft: "10px"}} type="text" onChange={props.onChange("aaa")} className="form-control" placeholder={props.placeholder} />
    )
}

export default TextInput;