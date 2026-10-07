import React, {useState} from 'react'
import { useNavigate,Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const Login = () => {
    const { loading , handleLogin } = useAuth();
    const navigate = useNavigate();
    
    const [view, setView] = useState("login"); // "login", "request-otp", "verify-otp"
    
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    const [otpError, setOtpError] = useState("");
    const [otpSuccess, setOtpSuccess] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);

    const handleSubmit =  async (e) => {
        e.preventDefault();
        await handleLogin(email , password)
        navigate('/')
    }

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setOtpError("");
        setOtpSuccess("");
        setOtpLoading(true);
        try {
            const res = await axios.post("http://localhost:3000/api/auth/forgot-password/request-otp", { email }, { withCredentials: true });
            setOtpSuccess(res.data.message);
            setView("verify-otp");
        } catch (err) {
            setOtpError(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setOtpLoading(false);
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setOtpError("");
        setOtpSuccess("");
        setOtpLoading(true);
        try {
            const res = await axios.post("http://localhost:3000/api/auth/forgot-password/reset", { email, otp, newPassword }, { withCredentials: true });
            setOtpSuccess(res.data.message);
            setView("login");
            setPassword("");
        } catch (err) {
            setOtpError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setOtpLoading(false);
        }
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
                        
                        {view === "login" && (
                            <>
                                <div className="form-header">
                                    <h1>Welcome back</h1>
                                    <p>Enter your details to access your account.</p>
                                </div>
                                {otpSuccess && <p style={{color: '#10b981', marginBottom: '1rem', fontSize: '0.9rem'}}>{otpSuccess}</p>}
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group">
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email" name="email" id="email" placeholder="name@example.com" required />
                                    </div>
                                    <div className="input-group">
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <label htmlFor="password">Password</label>
                                            <button type="button" onClick={() => {setView("request-otp"); setOtpError(""); setOtpSuccess("");}} style={{background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer'}}>Forgot password?</button>
                                        </div>
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password" name="password" id="password" placeholder="********" required />
                                    </div>
                                    
                                    <button className="button primary-button">Sign in</button>
                                </form>
                                <p className="auth-footer">Don't have an account? <Link to={"/register"}>Sign up</Link></p>
                            </>
                        )}

                        {view === "request-otp" && (
                            <>
                                <div className="form-header">
                                    <h1>Reset Password</h1>
                                    <p>Enter your email to receive a verification code.</p>
                                </div>
                                {otpError && <p style={{color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem'}}>{otpError}</p>}
                                <form onSubmit={handleRequestOtp}>
                                    <div className="input-group">
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email" name="email" id="email" placeholder="name@example.com" required />
                                    </div>
                                    <button className="button primary-button" disabled={otpLoading}>
                                        {otpLoading ? "Sending..." : "Send Verification Code"}
                                    </button>
                                </form>
                                <p className="auth-footer"><button type="button" onClick={() => setView("login")} style={{background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'}}>Back to login</button></p>
                            </>
                        )}

                        {view === "verify-otp" && (
                            <>
                                <div className="form-header">
                                    <h1>Check your email</h1>
                                    <p>We sent a 6-digit code to <strong>{email}</strong></p>
                                </div>
                                {otpError && <p style={{color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem'}}>{otpError}</p>}
                                {otpSuccess && <p style={{color: '#10b981', marginBottom: '1rem', fontSize: '0.9rem'}}>{otpSuccess}</p>}
                                <form onSubmit={handleVerifyOtp}>
                                    <div className="input-group">
                                        <label htmlFor="otp">Verification Code (6 Digits)</label>
                                        <input 
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            type="text" name="otp" id="otp" placeholder="123456" maxLength="6" required style={{letterSpacing: '5px', fontSize: '1.2rem', textAlign: 'center'}} />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="newPassword">New Password</label>
                                        <input 
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            type="password" name="newPassword" id="newPassword" placeholder="********" required />
                                    </div>
                                    <button className="button primary-button" disabled={otpLoading}>
                                        {otpLoading ? "Verifying..." : "Reset Password"}
                                    </button>
                                </form>
                                <p className="auth-footer"><button type="button" onClick={() => setView("request-otp")} style={{background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'}}>Change email address</button></p>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login


