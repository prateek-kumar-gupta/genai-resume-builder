import React, {useState} from 'react'
import {useAuth} from "../hooks/useAuth"
import { useNavigate,Link } from 'react-router'
import "../auth.form.scss"

const Register = () => {
    const navigate = useNavigate();
    const [username , setUsername] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const {loading , handleRegister} = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister({username , email , password})
        navigate('/')
    }

    if(loading) {
        return (<main className="auth-layout"><h1 style={{color: 'white'}}>Creating account...</h1></main>)
    }

    return (
        <main className="auth-layout">
            <div className="auth-split">
                <div className="auth-banner">
                    <div className="banner-content">
                        <h2>CareerCraft</h2>
                        <p>Join today and start crafting the perfect resume and interview strategy.</p>
                        <div className="abstract-shape"></div>
                    </div>
                </div>
                
                <div className="auth-form-wrapper">
                    <div className="form-container">
                        <div className="form-header">
                            <h1>Create an account</h1>
                            <p>Enter your details below to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text" name="username" id="username" placeholder="johndoe" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email" name="email" id="email" placeholder="name@example.com" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    type="password" name="password" id="password" placeholder="********" />
                            </div>
                            
                            <button className="button primary-button">Sign up</button>
                        </form>
                        
                        <p className="auth-footer">Already have an account? <Link to={"/login"}>Sign in</Link></p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register

