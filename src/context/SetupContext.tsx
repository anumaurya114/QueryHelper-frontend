import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { ReactNode } from 'react';

interface SetupContextProps {
    children: ReactNode;
}

interface DataLayout {
    schema?: string;
    selectedTables?: Record<string, string[]>;
    allTables?: Record<string, string[]>;
}

const SetupContext = createContext<any>(null);

export default SetupContext;

export type {DataLayout};

export const SetupProvider: React.FC<SetupContextProps> = ({children}) => {

    const getTokens = () => {
        const tokensString = localStorage.getItem('authTokens');
        if(tokensString===undefined || tokensString===null){
            return null;
        }
        return JSON.parse(tokensString);
    }

    const [datalayout, setDatalayout] = useState<DataLayout>({});

    const getAndSetDataLayout = async () => {
        const authTokens = getTokens();
        const response = await fetch('https://1225-2409-40e3-36-721d-349d-78c5-592-3829.ngrok-free.app/core/api/data-layout/', {
            method: 'GET',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            }
        })
       
        const data = await response.json();
        if (response.status === 200) {
            setDatalayout(data as DataLayout);
        } else return null;
    }

    const resetToDefaultSelection = async () => {
        const authTokens = getTokens();
        const response = await fetch('https://1225-2409-40e3-36-721d-349d-78c5-592-3829.ngrok-free.app/core/api/reset-data-layout/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            },
        })

       
        const data = await response.json();
        if (response.status === 200) {
            return (data as DataLayout);
        } else return null;
    }

    const setDataLayoutSelection = async (tablesAndColsSelection: Record<string, string[]>) => {
        const authTokens = getTokens();
        const response = await fetch('https://1225-2409-40e3-36-721d-349d-78c5-592-3829.ngrok-free.app/core/api/set-selection/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            },
            body:JSON.stringify({tablesAndColsSelection:tablesAndColsSelection})
        })
       
        const data = await response.json();
        if (response.status === 200) {
            console.log("response ", data);
            return (data as DataLayout);
        } else return null;
    }

    useEffect(() => {
        getAndSetDataLayout()
    }, [])
    
    let contextData = {
        setDataLayoutSelection: setDataLayoutSelection,
        resetToDefaultSelection: resetToDefaultSelection,
        getAndSetDataLayout: getAndSetDataLayout,
        datalayout:datalayout,
        setDatalayout: setDatalayout,
    }

    return(
        <SetupContext.Provider value={contextData}>
            {children}
        </SetupContext.Provider>
    )
}