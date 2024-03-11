import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { ReactNode } from 'react';
import apiConfigs from '../configs/apiConfigs';
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

export type { DataLayout };

export const SetupProvider: React.FC<SetupContextProps> = ({ children }) => {

    const getTokens = () => {
        const tokensString = localStorage.getItem('authTokens');
        if (tokensString === undefined || tokensString === null) {
            return null;
        }
        return JSON.parse(tokensString);
    }

    const [datalayout, setDatalayout] = useState<DataLayout>({});
    const [selectConfigSetupId, setSelectedConfigsetupId] = useState();
    

    const getAndSetDataLayout = async (configSetupId:any) => {
        const authTokens = getTokens();
        try {
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/data-layout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(
                    {
                        configSetupId:configSetupId
                    }
                )
            })

            const data = await response.json();
            if (response.status === 200) {
               return (data as DataLayout);
            } else return {};
        } catch (error) {
            console.log(error);
            return {};
        }
    }

    const resetToDefaultSelection = async (configSetupId:any) => {
        const authTokens = getTokens();
        try {
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/reset-data-layout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(
                    {
                        configSetupId:configSetupId
                    }
                )
            })


            const data = await response.json();
            if (response.status === 200) {
                return (data as DataLayout);
            } else return null;
        } catch (error) {
            console.log(error)
        }
    }

    const setDataLayoutSelection = async (tablesAndColsSelection: Record<string, string[]>) => {
        const authTokens = getTokens();
        const response = await fetch(`${apiConfigs.baseUrl}/core/api/set-selection/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            },
            body: JSON.stringify({configSetupId:selectConfigSetupId,  tablesAndColsSelection: tablesAndColsSelection })
        })

        const data = await response.json();
        if (response.status === 200) {
            return (data as DataLayout);
        } else return null;
    }

    let contextData = {
        setDataLayoutSelection: setDataLayoutSelection,
        resetToDefaultSelection: resetToDefaultSelection,
        getAndSetDataLayout: getAndSetDataLayout,
        datalayout: datalayout,
        setDatalayout: setDatalayout,
        selectConfigSetupId,
        setSelectedConfigsetupId,
    }

    return (
        <SetupContext.Provider value={contextData}>
            {children}
        </SetupContext.Provider>
    )
}