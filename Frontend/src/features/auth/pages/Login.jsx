import React, {useState} from 'react'
import { useNavigate,Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";


const Login = () => {
    
    const { loading , handleLogin, handleGoogleLogin } = useAuth();

    const onGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            await handleGoogleLogin(user.email, user.displayName, user.uid, user.photoURL);
            navigate('/');
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            setOtpError("Failed to sign in with Google.");
        }
    };

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
                                    
                                    <div style={{display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-secondary)'}}>
                                        <hr style={{flex: 1, borderTop: '1px solid var(--border-color)'}} />
                                        <span style={{padding: '0 10px', fontSize: '0.85rem'}}>OR</span>
                                        <hr style={{flex: 1, borderTop: '1px solid var(--border-color)'}} />
                                    </div>
                                    
                                    <button type="button" onClick={onGoogleSignIn} style={{width: '100%', padding: '0.75rem', borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s ease'}}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
                                        Continue with Google
                                    </button>

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



