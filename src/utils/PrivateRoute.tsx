import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext';
import React, { ReactNode } from 'react';


interface PrivateRouteProps {
    children: React.ReactElement;
  }
  
  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
    const { authTokens } = useContext(AuthContext);
    if(!authTokens){
        return <Navigate to="/login" />;
    }
    return (children as React.ReactElement || null);
  };
  
  export default PrivateRoute;