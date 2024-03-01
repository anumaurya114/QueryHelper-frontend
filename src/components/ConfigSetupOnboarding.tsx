import React, { useState, useEffect, useContext } from 'react';
import OnboardingAndSetupContext from '../context/OnboardingAndSetupContext';
import EditableModelModal from './modals/TemplateModal';


export interface ConfigSetup {
    id?:number;
    [key:string]: any;
}

const ConfigSetupOnboardingPage = ({org}:{id?:number; [key:string]:any}) => {
    const {
      createConfigSetup,
      fetchAllConfigSetups,
      updateConfigSetup,
      deleteConfigSetup,
    } = useContext(OnboardingAndSetupContext);
    const [configsetups, setConfigsetups] = useState<ConfigSetup[] | null>([]);
    const [selectedConfigsetup, setSelectedConfigsetup] = useState<ConfigSetup | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
      fetchAllConfigSetups().then((data: any) => {
          setConfigsetups(data);
        });
    }, []);

    const renderOrgs = () => {
        if (configsetups && configsetups.length > 0) {
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
                                {Object.keys(configsetups[0]).map((key => <th style={{ fontWeight: 'normal' }} key={key}>{key}</th>))}
                                <th style={{ fontWeight: 'normal' }}>Action Button</th>
                            </tr>
                            {configsetups.map(configsetup => {
                                return (<tr>
                                    {Object.keys(configsetup).map((key, index) => <th style={{ fontWeight: 'normal' }} key={key}>{Object.values(configsetup)[index]}</th>)}
                                    <th><button onClick={() => handleEditUser(configsetup)}>Edit</button></th>
                                </tr>);
                            })}
                        </table>
                    </div>
                </>
            );
        }
    }

    const handleEditUser = (configsetup: ConfigSetup) => {
        setSelectedConfigsetup(configsetup);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedConfigsetup(null);
    };

    const handleSaveUser = (configsetup: ConfigSetup) => {
      setAlertMessage("");
      updateConfigSetup(configsetup).then((data: any) => {
          setAlertMessage(JSON.stringify(data));
          setTimeout(()=> {
              setAlertMessage("");
          }, 20000);
      }).catch((error:any) => console.log(error));
    };

    const handleCreateProfile = (configsetup: ConfigSetup) => {
        setAlertMessage("");
        createConfigSetup(configsetup).then((data: any) => {
            setAlertMessage(JSON.stringify(data));
            setTimeout(()=> {
                setAlertMessage("");
            }, 20000);
        }).catch((error:any) => console.log(error));
    };

    const handleDeleteUser = (configsetup: ConfigSetup) => {
      setAlertMessage("");
      deleteConfigSetup(configsetup).then((data: any) => {
          setAlertMessage(JSON.stringify(data));
          setTimeout(()=> {
              setAlertMessage("");
          }, 20000);
      }).catch((error:any) => console.log(error));
    }

    if(selectedConfigsetup?.setupName=='' && org){
      selectedConfigsetup['org_id'] = org.id;
      selectedConfigsetup['org_name'] = org.name;
    }
    


    return (<>
        <h3>ConfigsetupOnboardingPage</h3>
        <div>
            <button onClick={() => {setSelectedConfigsetup({setupName:'', setupData:'',isPrivate:false}); setIsEditModalOpen(true);}}>
                Create New ConfigSetup
            </button>
        </div>
        {renderOrgs()}
        {selectedConfigsetup && <EditableModelModal model={selectedConfigsetup} isOpen={isEditModalOpen}
            onClose={handleCloseEditModal} onSave={handleSaveUser}
            onDelete={handleDeleteUser}
            readonlyKeys={["id", "org_id", "org_name", "user_id"]}
            OnCreate={handleCreateProfile}
            title='ConfigSetup'
            disableKeys={[]}
            >
            {alertMessage && <p>{alertMessage}</p>}
            </EditableModelModal>}
        
    </>
    );
};

export default ConfigSetupOnboardingPage;


