import React, {useState} from 'react'
import { useNavigate,Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const { loading , handleLogin } = useAuth();
    const navigate = useNavigate();
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    const handleSubmit =  async (e) => {
        e.preventDefault();
        await handleLogin(email , password)
        navigate('/')
    }

    if(loading) {
        return (<main className="auth-layout"><h1 style={{color: 'white'}}>Authenticating...</h1></main>)
    }
     
    return (
        <main className="auth-layout">
            <div className="auth-split">
                <div className="auth-banner">
                    <div className="banner-content">
                        <h2>CareerCraft</h2>
                        <p>Unlock your dream job with AI-tailored resumes and personalized interview strategies.</p>
                        <div className="abstract-shape"></div>
                    </div>
                </div>
                
                <div className="auth-form-wrapper">
                    <div className="form-container">
                        <div className="form-header">
                            <h1>Welcome back</h1>
                            <p>Enter your details to access your account.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
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
                                    type="password" name="password" id="password" placeholder="••••••••" />
                            </div>
                            
                            <button className="button primary-button">Sign in</button>
                        </form>
                        
                        <p className="auth-footer">Don't have an account? <Link to={"/register"}>Sign up</Link></p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login