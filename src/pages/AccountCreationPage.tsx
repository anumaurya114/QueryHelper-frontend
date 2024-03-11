import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Select, { MultiValue, SingleValue } from "react-select";
import makeAnimated from 'react-select/animated';
import AccountContext, { OrgInfo } from '../context/AccountCreationContext';


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LoginForm = styled.form`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const animatedComponents = makeAnimated();

const AccountCreationPage = () => {
  const {
    updateOrg,
    getAllOrgs,
    createNewOrg,
  } = useContext(AccountContext);
  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState<OrgInfo | null>(null);
  const [selectedOrgForUseCreation, setSelectedOrgUseCreation] = useState<OrgInfo | null>(null);
  const [selectedOrgName, setSelectedOrgName] = useState('');
  const [newOrgName, setNewOrgName] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reload, setReload] = useState<boolean>(false);

  const handleOrgSelection = (selectedOption: any) => {
    if (selectedOption.label && selectedOption.value) {
      setSelectedOrg({ id: selectedOption.value, name: selectedOption.label });
      setSelectedOrgName(selectedOption.label);
    } else setSelectedOrg(null);
  }

  const handleOrgSelectionForUserCreation = (selectedOption: any) => {
    if (selectedOption.label && selectedOption.value) {
      setSelectedOrgUseCreation({ id: selectedOption.value, name: selectedOption.label });
    } else setSelectedOrgUseCreation(null);
  }

  useEffect(() => {
    getAllOrgs().then((orgs: any) => {
      setOrgs(orgs);
    });
    setSelectedOrg(null);
  }, [reload]);

  const createAccount = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleUpdateOrg = () => {
    updateOrg({ id: selectedOrg?.id, name: selectedOrgName }).then((result: any) => {
    })
    setReload(!reload);
  }

  const handleCreateOrg = () => {
    createNewOrg({ name: newOrgName }).then((result: any) => {
      console.log(result);
    });
    setReload(!reload);
  }

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Setup</h1>
      <Container>
        <div style={{ flexDirection: 'column' }}>
          <LoginForm>
            <Title>Create/Update Org</Title>
            <Select
              id='orgs'
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={[]}
              options={orgs.map((orgInfo: OrgInfo) => { return { value: orgInfo.id, label: orgInfo.name } }).sort((a, b) => a.label > b.label ? 1 : -1) || []}
              onChange={(selectedOption: any) => handleOrgSelection(selectedOption)}
            />
            {
              <>
                <Input placeholder={"no org selected"} value={selectedOrgName}
                  onChange={(e) =>
                    setSelectedOrgName(e.target.value)}>
                </Input>
                <button onClick={() => handleUpdateOrg()}> Update Org</button>
              </>}
            {
              <>
                <Input value={newOrgName}
                  onChange={(e) =>
                    setNewOrgName(e.target.value)}>
                </Input>
                <button onClick={() => handleCreateOrg()}> Create New Org</button>
              </>}
          </LoginForm>
        </div>
        <LoginForm onSubmit={createAccount}>
          <Title>Create User Account</Title>
          <Select
            id='orgs'
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[]}
            options={orgs.map((orgInfo: OrgInfo) => { return { value: orgInfo.id, label: orgInfo.name } }).sort((a, b) => a.label > b.label ? 1 : -1) || []}
            onChange={(selectedOption: any) => handleOrgSelectionForUserCreation(selectedOption)}
          />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Create User</Button>
        </LoginForm>

        <LoginForm onSubmit={createAccount}>
          <Title>Update Account</Title>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Update User</Button>
        </LoginForm>
      </Container>
    </>
  );
};

export default AccountCreationPage;