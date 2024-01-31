import React, { useState, useEffect, useContext, useRef } from 'react'
import AuthContext from '../context/AuthContext';
import ChatContext from '../context/ChatContext';

import 'react-chat-elements/dist/main.css';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import RunQueryContext from '../context/RunQueryContext';


const ChatbotContainer = styled.div`
  max-width: calc(100% - 20px);
  margin: auto;
`;

const MessagesContainer = styled.div`
  overflow-y: auto;
  max-height: 200px;
  padding: 10px;
  border: 1px solid #ccc;
`;

const Message = styled.div<{ isUser?: boolean }>`
  padding: 8px;
  margin: 8px 0;
  border-radius: 8px;
  max-width: 70%;
  margin-left:${(props) => (props.isUser ? '20%' : '0%')}
  margin-right:${(props) => (props.isUser ? '0%' : '20%')}
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.isUser ? '#4caf50' : '#f2f2f2')};
  color: ${(props) => (props.isUser ? 'white' : 'black')};
`;


const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Input = styled.textarea`
  width: 100%;
  resize: none;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  margin-left: 8px;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
`;

const HomePage = () => {
    const navigate = useNavigate();
    const { authTokens, logoutUser } = useContext(AuthContext);
    const {
        getBotMessage,
        appendMessages,
        messages
    } = useContext(ChatContext);
    const {
        queryInput,
        setQueryInput,
        handleSubmit : handleSubmitOfRunQuery,
    } = useContext(RunQueryContext);

    let [profile, setProfile] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e:any) => {
        setInputValue(e.target.value);
    };
    const [inputText, setInputText] = useState('');

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        inputRef?.current?.focus();
    }, []);
    
    const handleSubmit = () => {
        if (inputText.trim() !== '') {
            setInputText('');
            getBotMessage(inputText).then((responseText: any) => {
                setTimeout(() => {
                    if(responseText!==null)
                        {appendMessages(inputText, responseText);}
                }, 1000)
            });
            
        }
    };

    const handleKeyDown = (event:any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = async () => {
        let response = await fetch('http://127.0.0.1:8000/auth/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        console.log(data, "response data");
        if (response.status === 200) {
            setProfile(data)
        } else if (response.statusText === 'Unauthorized') {
            logoutUser()
        }
    }

    return (
        <>
        <h1 style={{textAlign:'center'}}>Query Helper</h1>
        
        <div>
            <ChatbotContainer>
                <MessagesContainer>
                    {messages.map((msg:any) => (
                        <Message key={msg.id} isUser={msg.isUser}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                            {(msg.id==messages.length-1) && <button onClick={() => {
                                setQueryInput(msg.content);
                                navigate('run-query');
                                handleSubmitOfRunQuery(msg.content);
                                }}>Run query</button>} 
                        </Message>
                    ))}
                </MessagesContainer>
                <InputContainer>
                    <Input
                        ref={inputRef}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        rows={4}
                    />
                    <SubmitButton onClick={handleSubmit}>Send</SubmitButton>
                </InputContainer>
            </ChatbotContainer>

        </div>
        </>
    )
}

export default HomePage;