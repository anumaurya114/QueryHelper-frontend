import React, { useState, useEffect, useContext } from 'react';
import OnboardingAndSetupContext from '../context/OnboardingAndSetupContext';
import EditableModelModal from './modals/TemplateModal';


export interface User {
    id?:number;
    username:string;
    email:string;
}

const UserOnboardingPage = () => {
    const {
        fetchAllusers,
        createUser,
        updateUser,
        updatePassword,
        deleteUser,
    } = useContext(OnboardingAndSetupContext);
    const [users, setUsers] = useState<User[] | null>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        fetchAllusers().then((data: any) => setUsers(data));
    }, []);

    const renderUsers = () => {
        if (users && users.length > 0) {
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
                                {Object.keys(users[0]).map((key => <th style={{ fontWeight: 'normal' }} key={key}>{key}</th>))}
                                <th style={{ fontWeight: 'normal' }}>Action Button</th>
                            </tr>
                            {users.map(user => {
                                return (<tr>
                                    {Object.keys(user).map((key, index) => <th style={{ fontWeight: 'normal' }} key={key}>{Object.values(user)[index]}</th>)}
                                    <th><button onClick={() => handleEditUser(user)}>Edit</button></th>
                                </tr>);
                            })}
                        </table>
                    </div>
                </>
            );
        }
    }

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = (editedUser: User) => {
        updateUser(editedUser).then((data: any) => {
            setAlertMessage(JSON.stringify(data));
            setTimeout(()=> {
                setAlertMessage("");
            }, 20000);
        }).catch((error:any) => console.log(error));
    };

    const handleUpdatePassword = (editedUser: User) => {
        updatePassword(editedUser).then((data: any) => {
            setAlertMessage(JSON.stringify(data));
            setTimeout(()=> {
                setAlertMessage("");
            }, 20000);
        }).catch((error:any) => console.log(error));
    }

    const handleCreateUser = (editedUser: User) => {
        setAlertMessage("");
        createUser(editedUser).then((data: any) => {
            setAlertMessage(JSON.stringify(data));
            setTimeout(()=> {
                setAlertMessage("");
            }, 20000);
        }).catch((error:any) => console.log(error));
    };

    const handleDeleteUser = (editedUser:User) => {
        setAlertMessage("");
        deleteUser(editedUser).then((data: any) => {
            setAlertMessage(JSON.stringify(data));
            setTimeout(()=> {
                setAlertMessage("");
            }, 20000);
        }).catch((error:any) => console.log(error));
    }



    return (users && <>
        <h3>UserOnboardingPage</h3>
        <div>
            <button onClick={() => {setSelectedUser({username:'', email:''}); setIsEditModalOpen(true);}}>
                Create New User
            </button>
        </div>
        {renderUsers()}
        {selectedUser && <EditableModelModal model={selectedUser} isOpen={isEditModalOpen}
            onClose={handleCloseEditModal} onSave={handleSaveUser}
            onDelete={handleDeleteUser}
            readonlyKeys={["id"]}
            OnCreate={handleCreateUser}
            title='User'
            disableKeys={[]}
            >
            <>
            <button onClick={() => handleUpdatePassword(selectedUser)}>Update Password</button>
            </>
            {alertMessage && <p>{alertMessage}</p>}
            </EditableModelModal>}
        
    </>
    );
};

export default UserOnboardingPage;
