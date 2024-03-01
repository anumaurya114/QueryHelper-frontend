import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { ReactNode } from 'react';
import apiConfigs from '../configs/apiConfigs';
import { User } from '../components/UserOnboarding';
import { Org } from '../components/OrgOnboarding';
import { Profile } from '../components/ProfileOnboarding';
import { getInternalServerErrorMessage } from '../utils/utilMethods';
import { ConfigSetup } from '../components/ConfigSetupOnboarding';

interface OnboardingAndSetupProps {
    children: ReactNode;
}

const OnboardingAndSetupContext = createContext<any>(null);

export default OnboardingAndSetupContext;

export const OnboardingAndSetupProvider: React.FC<OnboardingAndSetupProps> = ({ children }) => {

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

    let fetchAllusers = async () => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/users/`, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } 
            return null;
        } catch (error) {
            console.log(error);
        }
    }

    let createUser = async (user:User) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(user),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let updateUser = async (user:User) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/users/${user.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(user),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let updatePassword = async (user:User) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/users/password/${user.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(user),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let deleteUser = async (user:User) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/users/${user.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(user),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }


    let fetchAllProfiles = async () => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/profiles/`, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } 
            return null;
        } catch (error) {
            console.log(error);
        }
    }

    let createProfile = async (profile:Profile) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/profiles/`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(profile),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let updateProfile = async (profile: Profile) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/profiles/${profile.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(profile),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let deleteProfile = async (profile:Profile) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/profiles/${profile.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(profile),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let updatePasswordViaProfile = async (profile:Profile) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/profiles/password/${profile.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(profile),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let fetchAllOrgs = async () => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/organizations/`, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } 
            return null;
        } catch (error) {
            console.log(error);
        }
    }

    let createOrg = async (org:Org) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/organizations/`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(org),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let updateOrg = async (org: Org) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/organizations/${org.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(org),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status.toString().includes('40')) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let deleteOrg = async (org:Org) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/organizations/${org.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(org),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let fetchAllConfigSetups = async () => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/configsetups/`, {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
            });

            let data = await response.json();
            console.log("configsetups data", data);

            if (data && response.status==200) {
                return data;
            } 
            return null;
        } catch (error) {
            console.log(error);
        }
    }

    let createConfigSetup = async (config:ConfigSetup) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/configsetups/`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(config),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let updateConfigSetup = async (config: ConfigSetup) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/configsetups/${config.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(config),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status.toString().includes('40')) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    let deleteConfigSetup = async (config:ConfigSetup) => {
        try {
            const authTokens = getTokens();
            const response = await fetch(`${apiConfigs.baseUrl}/core/api/configsetups/${config.id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Token ' + authTokens?.access,
                },
                body:JSON.stringify(config),
            });

            let data = await response.json();

            if (data && response.status==200) {
                return data;
            } else if(response.status==400) {
                return data;
            } else if(response.status==500){
                const errorMessage = getInternalServerErrorMessage();
                return {error:errorMessage};
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    

    

    let contextData = {
        fetchAllusers: fetchAllusers,
        createUser: createUser,
        updateUser: updateUser,
        updatePassword: updatePassword,
        deleteUser: deleteUser,
        fetchAllOrgs: fetchAllOrgs,
        createOrg: createOrg,
        deleteOrg: deleteOrg,
        updateOrg: updateOrg,
        fetchAllProfiles: fetchAllProfiles,
        createProfile,
        updateProfile,
        deleteProfile,
        updatePasswordViaProfile,
        fetchAllConfigSetups,
        createConfigSetup,
        updateConfigSetup,
        deleteConfigSetup,
    }


    return (
        <OnboardingAndSetupContext.Provider value={contextData}>
            {children}
        </OnboardingAndSetupContext.Provider>
    )
}