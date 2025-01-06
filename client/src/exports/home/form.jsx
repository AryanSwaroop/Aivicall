import { useState } from "react";
import Navbar from "./navbar";

const Form = () => {

    const [login , setLogin] = useState({
        "FirstName" : "",
        "LastName" : "",
        Email:"",
        Password:""
    });

    const setValue = (e) => {

        setLogin({
            ...login,
            [e.target.placeholder] : e.target.value
        })

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(login);
    }

    return (
        <>
        <Navbar/>
        <form className="fromDiv" onSubmit={(e) => {handleSubmit(e)}}>

            <div className="nameDiv">
                <input className="nameDivInput" type="text" placeholder="FirstName" onChange={(e) => setValue(e)}/>
                <input className="nameDivInput" type="text" placeholder="LastName" onChange={(e) => setValue(e)}/>
            </div>

            <input className="BigDiv" type="email" placeholder="Email" onChange={(e) => setValue(e)}/>
            <input className="BigDiv" type="password" placeholder="Password" onChange={(e) => setValue(e)}/>
            
        <button className="submitBtn" typeof="submit">Submit</button>
        </form>
        </>
    )
}

export default Form;