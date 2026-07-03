import React, { useState } from "react";
import { Navigate, useNavigate , Link} from "react-router-dom";
import Login from "./login";
import { useAuth } from "../hooks/use.auth";
const Register = () =>{

    const navigate = useNavigate();
    
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

       const {loading , handleRegister} = useAuth()          
 
        const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({username , email , password})
        navigate("/")
    }

    if(loading){
        return (<main><h1>loading....</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
               <h2>Register</h2>
             <form onSubmit={handleSubmit}>

                 <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input onChange={(e) => { setUsername(e.target.value) }} 
                    type="text" id="username" name="username" placeholder="Enter Username"/>
                </div>
                <div className="input-group">
                    <label htmlFor="register">Email</label>
                    <input onChange={(e) => { setEmail(e.target.value) }}
                    type="email" id="email" name="email" placeholder="Enter email"/>
                </div>
                <div className="input-group">
                    <label htmlFor="Password">Password</label>
                    <input onChange={(e) => { setPassword(e.target.value) }}
                    type="Password" id="Password" name="Password" placeholder="Enter Password"/>
                </div>

                <button className="button primary-button">Register</button>
             </form>
                <p>Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register