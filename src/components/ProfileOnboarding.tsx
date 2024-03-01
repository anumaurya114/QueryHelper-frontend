import React, { useState, useEffect, useContext } from 'react';
import OnboardingAndSetupContext from '../context/OnboardingAndSetupContext';
import EditableModelModal from './modals/TemplateModal';


export interface Profile {
    id?:number;
    [key:string]: any;
}

const ProfileOnboardingPage = ({org}:{id?:number; [key:string]:any}) => {
    const {
      createProfile,
        updatePasswordViaProfile,
        deleteProfile,
        updateProfile,
        fetchAllProfiles,
    } = useContext(OnboardingAndSetupContext);
    const [profiles, setProfiles] = useState<Profile[] | null>([]);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
      fetchAllProfiles().then((data: any) => {
          setProfiles(data);
        });
    }, []);

    const renderOrgs = () => {
        if (profiles && profiles.length > 0) {
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
                                {Object.keys(profiles[0]).map((key => <th style={{ fontWeight: 'normal' }} key={key}>{key}</th>))}
                                <th style={{ fontWeight: 'normal' }}>Action Button</th>
                            </tr>
                            {profiles.map(profile => {
                                return (<tr>
                                    {Object.keys(profile).map((key, index) => <th style={{ fontWeight: 'normal' }} key={key}>{Object.values(profile)[index]}</th>)}
                                    <th><button onClick={() => handleEditUser(profile)}>Edit</button></th>
                                </tr>);
                            })}
                        </table>
                    </div>
                </>
            );
        }
    }

    const handleEditUser = (profile: Profile) => {
        setSelectedProfile(profile);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProfile(null);
    };

    const handleSaveUser = (profile: Profile) => {
      setAlertMessage("");
      console.log("saved profile", profile)
      updateProfile(profile).then((data: any) => {
          console.log("saved profile", data)
          setAlertMessage(JSON.stringify(data));
          setTimeout(()=> {
              setAlertMessage("");
          }, 20000);
      }).catch((error:any) => console.log(error));
    };

    const handleCreateProfile = (profile: Profile) => {
        setAlertMessage("");
        console.log("created profile", profile)
        createProfile(profile).then((data: any) => {
            console.log("created profile", data)
            setAlertMessage(JSON.stringify(data));
            setTimeout(()=> {
                setAlertMessage("");
            }, 20000);
        }).catch((error:any) => console.log(error));
    };

    const handleDeleteUser = (profile: Profile) => {
      setAlertMessage("");
      console.log("deleted profile", profile)
      deleteProfile(profile).then((data: any) => {
          console.log("deleted profile", data)
          setAlertMessage(JSON.stringify(data));
          setTimeout(()=> {
              setAlertMessage("");
          }, 20000);
      }).catch((error:any) => console.log(error));
    }

    const handleUpdatePassword = (profile:Profile) => {
      setAlertMessage("");
      updatePasswordViaProfile(profile).then((data: any) => {
          setAlertMessage(JSON.stringify(data));
          setTimeout(()=> {
              setAlertMessage("");
          }, 20000);
      }).catch((error:any) => console.log(error));
  }

    console.log(selectedProfile?.username, org, "selected profile")
    if(selectedProfile?.username=='' && org){
      selectedProfile['org_id'] = org.id;
      selectedProfile['org_name'] = org.name;
      console.log("selected profile" + JSON.stringify(selectedProfile));
    }
    


    return (profiles && <>
        <h3>ProfileOnboardingPage</h3>
        <div>
            <button onClick={() => {setSelectedProfile({username:'', email:'', role:''}); setIsEditModalOpen(true);}}>
                Create New Profile
            </button>
        </div>
        {renderOrgs()}
        {selectedProfile && <EditableModelModal model={selectedProfile} isOpen={isEditModalOpen}
            onClose={handleCloseEditModal} onSave={handleSaveUser}
            onDelete={handleDeleteUser}
            readonlyKeys={["id", "org_id", "org_name", "user_id"]}
            OnCreate={handleCreateProfile}
            title='Profile'
            disableKeys={[]}
            >
            <button onClick={() => handleUpdatePassword(selectedProfile)}>Update Password</button>

            {alertMessage && <p>{alertMessage}</p>}
            </EditableModelModal>}
        
    </>
    );
};

export default ProfileOnboardingPage;

