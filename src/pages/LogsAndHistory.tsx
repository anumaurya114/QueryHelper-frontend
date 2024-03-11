import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components';
import LogsAndHistoryContext from '../context/LogsAndHistoryContext';
import SetupContext from '../context/SetupContext';
import ConfigForm, { ConfigData } from '../components/ConfigForm';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
  background-color: #f5f5f5;
`;


const LogsAndHistoryPage: React.FC = () => {

  const {
    downloadLogFile,
    getLogFiles,
  } = useContext(LogsAndHistoryContext);
  const {
    selectConfigSetupId,
    setSelectedConfigsetupId,
  } = useContext(SetupContext);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    getLogFiles(selectConfigSetupId)
        .then((data:any[]) => setFileList(data))
        .catch((error:string) => console.error('Error fetching file list:', error));
  }, [selectConfigSetupId]);
  return (
   <>
    <h1 style={{textAlign:'center'}}>Logs and History</h1>
    <Container style={{flexDirection:'column'}}>
      {fileList.map((file:string) => {
        return <div key={file} style={{margin:'auto', minWidth:'20px'}}><button onClick={() => downloadLogFile(file, selectConfigSetupId)}>{file}</button></div>
      })}
    </Container>
    </>
  );
};

export default LogsAndHistoryPage;
