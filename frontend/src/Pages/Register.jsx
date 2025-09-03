import { useState } from "react";
import axios from "axios";

export default function Register(){
    const [form,setForm] =useState ({username:"",email:"",password:""});
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            await axios.post("http://127.0.0.1:8000/api/auth/register/",form);
            alert("Registeration successful! Please login");
            window.location.href="/";


        }catch(err){
            alert("Registration failed "+ err.response?.error||"Try again.");
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text"
                placeholder="Username"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Register</button>

            </form>
        </div>
    );
}
