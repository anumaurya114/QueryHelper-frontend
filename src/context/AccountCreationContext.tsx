import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { ReactNode } from 'react';

interface AccountContextProps {
    children: ReactNode;
}

export interface OrgInfo {id:string, name:string};

export interface UserInfo {
    id:string,
    name:string,
    username:string,
    password?:string,
}


const AccountContext = createContext<any>(null);

export default AccountContext;


export const AccountProvider: React.FC<AccountContextProps> = ({children}) => {

    const getTokens = () => {
        const tokensString = localStorage.getItem('authTokens');
        if(tokensString===undefined || tokensString===null){
            return null;
        }
        return JSON.parse(tokensString);
    }

    const getAllOrgs = async () => {
        const authTokens = getTokens();
        const response = await fetch('http://127.0.0.1:8000/auth/api/orgs/', {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            }
        })
       
        const data = await response.json();
        console.log(data, 'orgs');
        if (response.status === 200) {
            return data;
        } else return null;
    }

    const updateOrg = async (orgInfo:OrgInfo) => {
        const authTokens = getTokens();
        const response = await fetch(`http://127.0.0.1:8000/auth/api/orgs/${orgInfo.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            },
            body:JSON.stringify({name:orgInfo.name})
        })
       
        const data = await response.json();
        if (response.status === 200) {
            return data;
        } else return null;
    }

    const createNewOrg = async (orgInfo:OrgInfo) => {
        const authTokens = getTokens();
        const response = await fetch(`http://127.0.0.1:8000/auth/api/orgs/`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            },
            body:JSON.stringify({name:orgInfo.name})
        })
       
        const data = await response.json();
        if (response.status === 200) {
            return data;
        } else return null;
    }

    const createUser = async (orgInfo:OrgInfo) => {
        const authTokens = getTokens();
        const response = await fetch(`http://127.0.0.1:8000/auth/api/orgs/`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            },
            body:JSON.stringify({name:orgInfo.name})
        })
       
        const data = await response.json();
        if (response.status === 200) {
            return data;
        } else return null;
    }


    let contextData = {
        getAllOrgs,
        updateOrg,
        createNewOrg,
    }

    return(
        <AccountContext.Provider value={contextData}>
            {children}
        </AccountContext.Provider>
    )
}