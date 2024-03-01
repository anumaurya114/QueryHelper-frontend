import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import styled from 'styled-components';

// Styled component for the header
const HeaderContainer = styled.div`
  background-color: #333;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5em;
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

    return (
        <HeaderContainer>
      <Logo>Query Helper</Logo>
      <NavLinks>
        <Link to="/" style={{borderRadius:'1px', color:'white'}} onClick={() => setSelectedItem("QueryHelper")} >QueryHelper</Link>
        <Link to="/run-query" style={{borderRadius:'1px', color:'white'}} onClick={() => setSelectedItem("RunQuery")} >Run Query</Link>
        <Link to="/setup" style={{borderRadius:'1px', color:'white'}} onClick={() => setSelectedItem("Setup")} >Setup</Link>
        <Link to="/logs" style={{borderRadius:'1px', color:'white'}} onClick={() => setSelectedItem("Logs")} >Logs</Link>
        <Link to='/onboarding-setup' style={{borderRadius:'1px', color:'white'}} onClick={()=> setSelectedItem("onboardingSetup")}>Onboarding/Setup</Link>
        <button style={{borderRadius:'1px'}} onClick={logoutUser}>Logout</button>
      </NavLinks>
    </HeaderContainer>
        // <div>
        //     <Link to="/">Home</Link>
        //     <span> | </span>
        //     {authTokens ? (
        //         <>
        //         <button onClick={logoutUser}>Logout</button>
        //         <Link to="/login" >Login</Link>
        //         <Link to="/login" >Login</Link>
        //         </>
        //     ) : (
        //         <Link to="/login" >Login</Link>
        //     )}
        //     {authTokens && <p>Hello! you are in</p>}
        // </div>
    )
}

export default Header;