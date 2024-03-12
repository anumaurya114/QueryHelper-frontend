import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styled from 'styled-components';

const navtext = {
  fontSize: 16,
  color: '#222',
  backgroundColor: '#fff',
  paddingLeft: 8,
  paddingRight: 8,
  borderRadius: 8,
}

const theme = {
  blue: {
    default: "#3f51b5",
    hover: "#283593",
  },
  pink: {
    default: "#e91e63",
    hover: "#ad1457",
  },
};

const Button = styled.button`
  background-color: ${(props) => theme.blue.default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  border: 0; 
  text-transform: uppercase;
  
  cursor: pointer;
  box-shadow: 0px 1px 1px lightgray;
  transition: ease background-color 250ms;
  &:hover {
    background-color: ${(props) => theme.blue.hover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;



// Styled component for the header
const HeaderContainer = styled.div`
  background-color: #ebedf0;
  color: '#999';
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.2em;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  let { authTokens, logoutUser } = useContext(AuthContext);
  const [selectedItem, setSelectedItem] = useState('QueryHelper');

  if (!authTokens) {
    return (<div></div>);
  }
  else
    return (

      <HeaderContainer>
        <Logo>Query Helper</Logo>
        <NavLinks>
          <Link to="/" style={selectedItem === 'QueryLab' ? navtext : {}} onClick={() => setSelectedItem("QueryLab")} >QueryLab</Link>
          <Link to="/run-query" style={selectedItem === 'RunQuery' ? navtext : {}} onClick={() => setSelectedItem("RunQuery")} >Run Query</Link>
          <Link to="/setup" style={selectedItem === 'Setup' ? navtext : {}} onClick={() => setSelectedItem("Setup")} >Setup</Link>
          <Link to="/logs" style={selectedItem === 'Logs' ? navtext : {}} onClick={() => setSelectedItem("Logs")} >Logs</Link>
          <Link to='/onboarding-setup' style={selectedItem === 'onboardingSetup' ? navtext : {}} onClick={() => setSelectedItem("onboardingSetup")}>Onboarding/Setup</Link>
          <Button onClick={logoutUser}>Logout</Button>
        </NavLinks>
      </HeaderContainer>

    )
}

export default Header;