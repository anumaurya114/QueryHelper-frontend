import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { ReactNode } from 'react';
import apiConfigs from '../configs/apiConfigs';
interface ChatContextProps {
    children: ReactNode;
}

const ChatContext = createContext<any>(null);

export default ChatContext;

export const ChatProvider: React.FC<ChatContextProps> = ({children}) => {

    const getTokens = () => {
        const tokensString = localStorage.getItem('authTokens');
        if(tokensString===undefined || tokensString===null){
            return null;
        }
        return JSON.parse(tokensString);
    }

    const [messages, setMessages] = useState([
        { id: 1, content: `Hello! How can I help you?`, isUser:false },
    ]);


    const appendMessages = (inputText:string, botMessage:string) => {
        setMessages([...messages,  { id: messages.length + 2, content: inputText, isUser:true}, { id: messages.length + 1, content: botMessage, isUser:false}]);
    }

    const getBotMessage = async (inputText: string) => {
        const authTokens = getTokens();
        const response = await fetch(`${apiConfigs.baseUrl}/core/api/get-response/`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            },
            body:JSON.stringify({message:inputText})
        })
       
        const data = await response.json();
        if (response.status === 200) {
            return data.response;
        } else return null;
    }
    
    let contextData = {
        getBotMessage: getBotMessage,
        appendMessages: appendMessages,
        messages: messages,
    }

    return(
        <ChatContext.Provider value={contextData}>
            {children}
        </ChatContext.Provider>
    )
}