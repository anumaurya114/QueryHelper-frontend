import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { ReactNode } from 'react';

interface AuthContextProps {
    children: ReactNode;
}

const AuthContext = createContext<any>(null);

export default AuthContext;

export const AuthProvider: React.FC<AuthContextProps> = ({children}) => {

    const getTokens = () => {
        const tokensString = localStorage.getItem('authTokens');
        if(tokensString===undefined || tokensString===null){
            return null;
        }
        return JSON.parse(tokensString);
    }
    let [authTokens, setAuthTokens] = useState(getTokens());
    let [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    let loginUser = async ({username, password}:  { username: string; password: string }) => {
        const response = await fetch('https://1225-2409-40e3-36-721d-349d-78c5-592-3829.ngrok-free.app/auth/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password })
        });

        let data = await response.json();

        if(data){
            localStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data);
            navigate('/');
        } else {
            alert('Something went wrong while logging in the user!')
        }
    }

    let logoutUser = () => {
        localStorage.removeItem('authTokens');
        console.log("logging out ...");
        setAuthTokens(null);
        navigate('/login');
    }

    const updateToken = async () => {
        const authTokens = getTokens();
        const response = await fetch('https://1225-2409-40e3-36-721d-349d-78c5-592-3829.ngrok-free.app/auth/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({refresh:authTokens?.refresh})
        })
       
        const data = await response.json();
        if (response.status === 200) {
            const newtokens = {access:data.access, refresh:authTokens?.refresh}
            setAuthTokens(newtokens)
            localStorage.setItem('authTokens',JSON.stringify(newtokens))
        } else {
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    useEffect(()=>{
        if(loading){
            updateToken()
        }

        const REFRESH_INTERVAL = 1000 * 60 * 2 // 60 minutes
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    },[authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}