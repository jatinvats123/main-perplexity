import axios from 'axios'


const api = axios.create({
    baseURL: "http://192.168.1.8:8000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

// Add interceptor to include token in Authorization header
api.interceptors.request.use(
    config => {
        config.withCredentials = true
        const token = localStorage.getItem('authToken')
        if (token) {
            console.log("🔑 Adding token to request header");
            config.headers.Authorization = `Bearer ${token}`
        } else {
            console.log("⚠️  No token found in localStorage");
        }
        return config
    }
)

// Add interceptor to handle token storage on response
api.interceptors.response.use(
    response => {
        if (response.data.token) {
            console.log("💾 TOKEN RECEIVED - Storing in localStorage");
            localStorage.setItem('authToken', response.data.token)
        }
        return response
    }
)

export async function register({ email, username, password }) {
    const response = await api.post("/api/auth/register", { email, username, password })
    return response.data
}

export async function login({ email, password }) {
    console.log("📤 SENDING LOGIN REQUEST:");
    console.log("   email:", email);
    console.log("   password:", password);
    
    try {
        const response = await api.post("/api/auth/login", { email, password })
        console.log("✅ LOGIN SUCCESS:");
        console.log(response.data);
        return response.data
    } catch (err) {
        console.log("❌ LOGIN ERROR:");
        console.log("   Status:", err.response?.status);
        console.log("   Message:", err.response?.data?.message);
        console.log("   Error:", err.response?.data?.err);
        console.log("   Full response:", err.response?.data);
        throw err
    }
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")
    return response.data
}

export function logout() {
    localStorage.removeItem('authToken')
}