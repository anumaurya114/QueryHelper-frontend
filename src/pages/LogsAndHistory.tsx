import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components';
import LogsAndHistoryContext from '../context/LogsAndHistoryContext';
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

const LogsAndHistoryPage: React.FC = () => {

  const {
    fileList,
    downloadLogFile,
  } = useContext(LogsAndHistoryContext);
  console.log(fileList);
  return (
   <>
    <h1 style={{textAlign:'center'}}>Logs and History</h1>
    <Container>
      {fileList.map((file:string) => {
        return <div><button onClick={() => downloadLogFile(file)}>{file}</button></div>
      })}
    </Container>
    </>
  );
};

export default LogsAndHistoryPage;
