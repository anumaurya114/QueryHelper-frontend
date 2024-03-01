import React, { useState, useEffect, useContext } from 'react';
import OnboardingAndSetupContext from '../context/OnboardingAndSetupContext';
import UserOnboardingPage from '../components/UserOnboarding';
import ProfileOnboardingPage from '../components/ProfileOnboarding';
import OrgOnboardingPage from '../components/OrgOnboarding';
import ConfigSetupOnboardingPage from '../components/ConfigSetupOnboarding';


const OnboardingAndSetupPage = () => {
    
    return (<div>
        <UserOnboardingPage></UserOnboardingPage>
        <OrgOnboardingPage></OrgOnboardingPage>

        

        {/* <h3>ConfigSetupOnboardingPage</h3>
        <ConfigSetupOnboardingPage></ConfigSetupOnboardingPage> */} 
        
    </div>)
}
export default OnboardingAndSetupPage;
