import React from "react";
import axios from "axios";



    function Login() {
        const handleLogin = async () => {
          const { data } = await axios.get("http://localhost:3000/auth" ,{ withCredentials: true });
          window.location.href = data.url;
        }
        return(
            <div>
                <h1>Authenticate</h1>
                <button onClick={handleLogin}>Login with Google</button>
            </div>
        )
    }

export default Login;

