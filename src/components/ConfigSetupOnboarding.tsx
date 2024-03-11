import React, { useState, useEffect, useContext } from 'react';
import OnboardingAndSetupContext from '../context/OnboardingAndSetupContext';
import EditableModelModal from './modals/TemplateModal';
import ConfigForm, { ConfigData } from './ConfigForm';
import Modal from 'react-modal';

// Define the type of the model
interface Model {
    id?: number;
    [key: string]: any; // This allows for flexibility in properties
}

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
    const [isEditConfigModalOpen, setIsEditConfigModalOpen] = useState<boolean>(false);
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
                                {Object.keys(configsetups[0]).filter((key) => key!="setupData").map((key => <th style={{ fontWeight: 'normal' }} key={key}>{key}</th>))}
                                <th style={{ fontWeight: 'normal' }}>Action Button</th>
                                <th style={{fontWeight: 'normal'}}>Action Button 2</th>
                            </tr>
                            {configsetups.map(configsetup => {
                                return (<tr>
                                    {Object.keys(configsetup).filter((key) => key!="setupData").map((key, index) => <th style={{ fontWeight: 'normal' }} key={key}>{configsetup[key].toString()}</th>)}
                                    <th><button onClick={() => handleEditUser(configsetup)}>Edit</button></th>
                                    <th><button onClick={() => handleEditConfigData(configsetup)}>Edit ConfigData</button></th>
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

    const handleEditConfigData = (configsetup: ConfigSetup) => {
        Object.keys(configDataExample).forEach((key) => {
            if((configsetup.setupData!=undefined) && !Object.keys(configsetup.setupData).includes(key)){
                configsetup.setupData[key] = configDataExample[key];
            }
        })
        setSelectedConfigsetup(configsetup);
        setIsEditConfigModalOpen(true);

    }

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
    const configDataExample:ConfigData = {'SCHEMA_NAME': 'sxxx nxxx', 
  'PLATFORM': 'Axxx Rxxxx',
  'selectedTablesAndCols': {'table anme': ['col1xxx', 'col1xxx']},
  'DEFAULT_TABLES_COLS': 
  {'table anme': ['col1xxx', 'col1xxx']}, 'DB_CREDS_DATA': {'database': 'xxxxx', 'user': 'xxxx', 'password': 'xxxx', 'host': 'xxxx', 'port': 'xxxx'}}

    


    return (<>
        <h3>ConfigsetupOnboardingPage</h3>
        <div>
            <button onClick={() => {setSelectedConfigsetup({setupName:'', setupData:{},isPrivate:false}); setIsEditModalOpen(true);}}>
                Create New ConfigSetup
            </button>
        </div>
        {renderOrgs()}
        {selectedConfigsetup && isEditModalOpen && <EditableModelModal model={selectedConfigsetup} isOpen={isEditModalOpen}
            onClose={handleCloseEditModal} onSave={handleSaveUser}
            onDelete={handleDeleteUser}
            readonlyKeys={["id", "org_id", "org_name", "user_id"]}
            OnCreate={handleCreateProfile}
            title='ConfigSetup'
            disableKeys={["setupData"]}
            >
            {alertMessage && <p>{alertMessage}</p>}
            </EditableModelModal>}
        {selectedConfigsetup?.setupData && isEditConfigModalOpen && 
        <Modal isOpen={isEditConfigModalOpen} onRequestClose={() => setIsEditConfigModalOpen(false)}>
            <button onClick={() => setIsEditConfigModalOpen(false)}>Close</button>
            <ConfigForm obj={selectedConfigsetup.setupData} onUpdate={(updateValues:ConfigData) => 
                {
                    selectedConfigsetup.setupData = updateValues;
                    setSelectedConfigsetup(selectedConfigsetup)
                    handleSaveUser(selectedConfigsetup);

                } 

                    }></ConfigForm>
        </Modal>
        }
        
    </>
    );
};

export default ConfigSetupOnboardingPage;


