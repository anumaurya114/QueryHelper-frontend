import React, { useState, useEffect, useContext } from 'react';
import OnboardingAndSetupContext from '../context/OnboardingAndSetupContext';
import EditableModelModal from './modals/TemplateModal';
import ProfileOnboardingPage from './ProfileOnboarding';
import ConfigSetupOnboardingPage from './ConfigSetupOnboarding';


export interface Org {
    id?:number;
    [key:string]:any;
}

const OrgOnboardingPage = () => {
    const {
        fetchAllOrgs,
        createOrg,
        updateOrg,
        deleteOrg,
    } = useContext(OnboardingAndSetupContext);
    const [orgs, setOrgs] = useState<Org[] | null>([]);
    const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        fetchAllOrgs().then((data: any) => {
          setOrgs(data);
        });
    }, []);

    const renderOrgs = () => {
        if (orgs && orgs.length > 0) {
            return (
                <>
                    <div style={{
                        height: '200px',
                        width: '100%',
                        overflow: 'scroll',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <table style={{ alignSelf: 'center', alignItems: 'center' }}>
                            <tr>
                                {Object.keys(orgs[0]).filter(key => ['setups'].includes(key)==false).map((key => <th style={{ fontWeight: 'normal' }} key={key}>{key}</th>))}
                                <th style={{ fontWeight: 'normal' }}>Action Button</th>
                            </tr>
                            {orgs.map(org => {
                                return (<tr>
                                    {Object.keys(org).filter(key => ['setups'].includes(key)==false).map((key, index) => <th style={{ fontWeight: 'normal' }} key={key}>{Object.values(org)[index]}</th>)}
                                    <th><button onClick={() => handleEditUser(org)}>Edit</button></th>
                                </tr>);
                            })}
                        </table>
                    </div>
                </>
            );
        }
    }

    const handleEditUser = (org: Org) => {
        setSelectedOrg(org);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedOrg(null);
    };

    const handleSaveUser = (org: Org) => {
        updateOrg(org).then((data: any) => {
            setAlertMessage(JSON.stringify(data));
            setTimeout(()=> {
                setAlertMessage("");
            }, 20000);
        }).catch((error:any) => console.log(error));
    };

    const handleCreateUser = (org: Org) => {
        setAlertMessage("");
        createOrg(org).then((data: any) => {
            setAlertMessage(JSON.stringify(data));
            setTimeout(()=> {
                setAlertMessage("");
            }, 20000);
        }).catch((error:any) => console.log(error));
    };

    const handleDeleteUser = (org: Org) => {
        setAlertMessage("");
        deleteOrg(org).then((data: any) => {
            setAlertMessage(JSON.stringify(data));
            setTimeout(()=> {
                setAlertMessage("");
            }, 20000);
        }).catch((error:any) => console.log(error));
    }


    return (orgs && <>
        <h3>OrgOnboardingPage</h3>
        <div>
            <button onClick={() => {setSelectedOrg({name:''}); setIsEditModalOpen(true);}}>
                Create New Org
            </button>
        </div>
        {renderOrgs()}
        {selectedOrg && <EditableModelModal model={selectedOrg} isOpen={isEditModalOpen}
            onClose={handleCloseEditModal} onSave={handleSaveUser}
            onDelete={handleDeleteUser}
            readonlyKeys={["id"]}
            OnCreate={handleCreateUser}
            title='Org'
            disableKeys={['setups']}
            >
            {alertMessage && <p>{alertMessage}</p>}
            <ProfileOnboardingPage org={selectedOrg}/>
            <ConfigSetupOnboardingPage org={selectedOrg}/>
            </EditableModelModal>}
        
    </>
    );
};

export default OrgOnboardingPage;
