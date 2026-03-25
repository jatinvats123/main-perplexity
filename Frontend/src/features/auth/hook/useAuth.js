import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";


export function useAuth() {


    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
            console.log("✅ Registration successful. Check your email to verify.");
            dispatch(setError("Registration successful! Check your email to verify your account before logging in."))
        } catch (error) {
            console.error("❌ Registration failed:", error.response?.data?.message);
            dispatch(setError(error.response?.data?.message || "Registration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            console.log("🔐 Attempting login for:", email);
            const data = await login({ email, password })
            console.log("✅ Login successful!");
            dispatch(setUser(data.user))
            dispatch(setError(null)) // Clear any previous errors
        } catch (err) {
            console.error("❌ Login failed:", err.response?.data?.message);
            dispatch(setError(err.response?.data?.message || "Login failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            
            // Check if token exists before making request
            const token = localStorage.getItem('authToken')
            if (!token) {
                console.log("⚠️  No token found - user not logged in");
                dispatch(setLoading(false))
                return
            }
            
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (err) {
            console.error("❌ Failed to fetch user data:", err.response?.data?.message);
            dispatch(setError(err.response?.data?.message || "Failed to fetch user data"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    function handleLogout() {
        logout()
        dispatch(setUser(null))
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
    }

}