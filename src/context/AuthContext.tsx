import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { ReactNode } from 'react';
import apiConfigs from '../configs/apiConfigs';

interface AuthContextProps {
    children: ReactNode;
}

const AuthContext = createContext<any>(null);

export default AuthContext;

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {

    const getTokens = () => {
        const tokensString = localStorage.getItem('authTokens');
        if (tokensString === undefined || tokensString === null) {
            return null;
        }
        return JSON.parse(tokensString);
    }
    let [authTokens, setAuthTokens] = useState(getTokens());
    let [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    let loginUser = async ({ username, password }: { username: string; password: string }) => {
        try {
            const response = await fetch(`${apiConfigs.baseUrl}/auth/api/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            });

            let data = await response.json();

            if (data) {
                localStorage.setItem('authTokens', JSON.stringify(data));
                setAuthTokens(data);
                navigate('/');
            } else {
                alert('Something went wrong while logging in the user!')
            }
        } catch (error) {
            console.log(error);
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

        try {
            const response = await fetch(`${apiConfigs.baseUrl}/auth/api/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refresh: authTokens?.refresh })
            })

            const data = await response.json();
            if (response.status === 200) {
                const newtokens = { access: data.access, refresh: authTokens?.refresh }
                setAuthTokens(newtokens)
                localStorage.setItem('authTokens', JSON.stringify(newtokens))
            } else {
                logoutUser()
            }

            if (loading) {
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
        }
    }

    let contextData = {
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    useEffect(() => {
        if (loading) {
            updateToken()
        }

        const REFRESH_INTERVAL = 1000 * 60 * 2 // 60 minutes
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}