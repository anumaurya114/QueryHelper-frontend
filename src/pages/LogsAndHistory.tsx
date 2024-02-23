import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components';
import LogsAndHistoryContext from '../context/LogsAndHistoryContext';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
  background-color: #f5f5f5;
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
    <Container style={{flexDirection:'column'}}>
      {fileList.map((file:string) => {
        return <div style={{margin:'auto', minWidth:'20px'}}><button onClick={() => downloadLogFile(file)}>{file}</button></div>
      })}
    </Container>
    </>
  );
};

export default LogsAndHistoryPage;
