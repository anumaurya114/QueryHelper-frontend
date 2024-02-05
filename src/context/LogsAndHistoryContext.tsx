import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { ReactNode } from 'react';
import apiConfigs from '../configs/apiConfigs';

interface LogsAndHistoryProps {
    children: ReactNode;
}

const LogsAndHistoryContext = createContext<any>(null);

export default LogsAndHistoryContext;


export const LogsAndHistoryProvider: React.FC<LogsAndHistoryProps> = ({children}) => {

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        getLogFiles()
        .then(data => setFileList(data))
        .catch(error => console.error('Error fetching file list:', error));
    }, []);


    const getTokens = () => {
        const tokensString = localStorage.getItem('authTokens');
        if(tokensString===undefined || tokensString===null){
            return null;
        }
        return JSON.parse(tokensString);
    }

    const getLogFiles = async () => {
        const authTokens = getTokens();
        const response = await fetch(`${apiConfigs.baseUrl}/core/api/log-files/`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            },
        })
       
        const data = await response.json();
        if (response.status === 200) {
            return data.files;
        } else return [];
    }

    const downloadLogFile = async (filename:string) => {
        try {
          const authTokens = getTokens();
          const response = await fetch(`${apiConfigs.baseUrl}/core/api/log-file/${filename}/`, {
              method: 'POST',
              headers: {
                  'Content-Type':'text',
                  'Authorization': 'Token ' + authTokens?.access,
              },
          })
    
          if (!response.ok) {
            throw new Error('File download failed');
          }
    
          const fileBlob = await response.blob();
    
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(fileBlob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
    
        } catch (error) {
          console.error('Error downloading file:', error);
        }
      };


    
    let contextData = {
        fileList:fileList,
        downloadLogFile:downloadLogFile,
    }

    return(
        <LogsAndHistoryContext.Provider value={contextData}>
            {children}
        </LogsAndHistoryContext.Provider>
    )
}