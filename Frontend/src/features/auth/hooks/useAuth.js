import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth.context';
import { login, register, logout, getMe, googleLogin } from "../services/auth.api"
export const useAuth = () => {

    const context = useContext(AuthContext);

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            const data = await login(email, password);
            setUser(data.user);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register(username, email, password)
            setUser(data.user);
        } catch (err) {

        } finally {
            setLoading(false);
        }

    }


    const handleGoogleLogin = async (email, username, googleId, profilePicture) => {
        setLoading(true);
        try {
            const data = await googleLogin(email, username, googleId, profilePicture);
            setUser(data.user);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                setUser(data?.user || null);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        getAndSetUser();
    }, []);
    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGoogleLogin
    }
}


