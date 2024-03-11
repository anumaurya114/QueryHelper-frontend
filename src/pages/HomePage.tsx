import React, { useState, useEffect, useContext, useRef } from 'react'
import AuthContext from '../context/AuthContext';
import ChatContext from '../context/ChatContext';

import 'react-chat-elements/dist/main.css';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import RunQueryContext from '../context/RunQueryContext';
import OnboardingAndSetupContext from '../context/OnboardingAndSetupContext';
import { ConfigSetup } from '../components/ConfigSetupOnboarding';
import { Dropdown, Option } from '../components/DropDown';
import SetupContext from '../context/SetupContext';


interface ProcessingStatusProps {
  processing: boolean;
}

const ProcessingStatus = styled.div<ProcessingStatusProps>`
  background-color: ${(props) => (props.processing ? '#ffc107' : '#28a745')};
  color: ${(props) => (props.processing ? '#000' : '#fff')};
  padding: 10px;
  border-radius: 5px;
`;



const ChatbotContainer = styled.div`
  max-width: calc(100% - 20px);
  margin: auto;
  height: 70vh; /* Set the height to 70% of the viewport height */
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse; /* Reverse the column direction to display messages from bottom to top */
`;

const MessagesContainer = styled.div`
  flex-grow: 1; /* Allow the container to grow and fill the remaining space */
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  scroll-behavior: smooth; /* Enable smooth scrolling */
  margin-bottom:20px;
`;

const Message = styled.div<{ isUser?: boolean }>`
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
  max-width: 70%;
  margin-left: ${(props) => (props.isUser ? '20%' : '0%')};
  margin-right: ${(props) => (props.isUser ? '0%' : '20%')};
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.isUser ? '#4caf50' : '#f2f2f2')};
  color: ${(props) => (props.isUser ? 'white' : 'black')};
`;


const InputContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Input = styled.textarea`
  width: 100%;
  resize: none;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow-y: auto;
  min-height: 10px; /* Initial height */
  resize: none; /* Prevent resizing */
  overflow-y: hidden; /* Hide vertical scrollbar */
  border: 1px solid #ccc;
  margin-left:20px;
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
    messages,
    processingStatus,
  } = useContext(ChatContext);
  const {
    fetchAllConfigSetups,
  } = useContext(OnboardingAndSetupContext);
  const {
    queryInput,
    setQueryInput,
    handleSubmit: handleSubmitOfRunQuery,
  } = useContext(RunQueryContext);

  const {
    selectConfigSetupId,
    setSelectedConfigsetupId
  } = useContext(SetupContext);



  const [configsetups, setConfigsetups] = useState<ConfigSetup[] | null>([]);
  let [profile, setProfile] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [inputText, setInputText] = useState('');
  const [copiedStatus, setCopiedStatus] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  useEffect(() => {
    fetchAllConfigSetups().then((data: any) => {
      setConfigsetups(data);
    });
  }, []);


  const handleSubmit = () => {
    if (inputText.trim() !== '') {
      setInputText('');
      getBotMessage(inputText, selectConfigSetupId.toString()).then((responseText: any) => {
        setTimeout(() => {
          if (responseText !== null) { appendMessages(inputText, responseText); }
        }, 1000)
      });

    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopiedStatus(true);
        setTimeout(() => {
          setCopiedStatus(false);
        }, 2000); // Reset copied state after 2 seconds
      })
      .catch((error) => {
        alert('Failed to copy:');
      });
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Query Helper</h1>

      <div>
        <Dropdown defaultSelection={configsetups?.map(configsetup => {
          return ({ label: configsetup.setupName, value: (configsetup.id || '') } as Option)
        }).find(configsetupOption => configsetupOption.value == (selectConfigSetupId || '').toString())}
          onHandleSelection={
            (option: Option) =>
              setSelectedConfigsetupId(Number(option.value))}
          options={configsetups?.map(configsetup => { return ({ label: configsetup.setupName, value: configsetup.id?.toString() } as Option) }) || []} />
        <ChatbotContainer>
          <MessagesContainer style={{margin:'30px'}}>
            {messages.map((msg: any) => (
              <Message key={msg.id} isUser={msg.isUser}>
                <ReactMarkdown children={msg.content.replaceAll("\n", "  \n")} ></ReactMarkdown>
                {(msg.id % 2 == (messages.length - 1) % 2) && <div><button onClick={() => {
                  setQueryInput(msg.content);
                  navigate('run-query');
                  handleSubmitOfRunQuery(msg.content, selectConfigSetupId);
                }}>Run query</button>
                  <button onClick={() => copyToClipboard(msg.content)}>copy</button>
                  {copiedStatus && <p>Text copied to clipboard!</p>}
                </div>}
              </Message>
            ))}
            <div ref={messagesEndRef}></div>
          </MessagesContainer >
          {processingStatus && <ProcessingStatus processing={processingStatus}>getting response...</ProcessingStatus>}
          <InputContainer style={{marginTop:'20px'}}>
            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value); e.target.style.height = 'auto'; // Reset the height
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
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