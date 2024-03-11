import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React, { ReactNode } from 'react';
import apiConfigs from '../configs/apiConfigs';

interface RunQueryContextProps {
    children: ReactNode;
}
interface CSVData {
    [key: string]: string[];
}

const RunQueryContext = createContext<any>(null);

export default RunQueryContext;

export type {CSVData};

export const RunQueryProvider: React.FC<RunQueryContextProps> = ({children}) => {

    const getTokens = () => {
        const tokensString = localStorage.getItem('authTokens');
        if(tokensString===undefined || tokensString===null){
            return null;
        }
        return JSON.parse(tokensString);
    }

    const [queryInput, setQueryInput] = useState("");
    const [outputText, setOutputText] = useState('');
    const [outputDf, setOutputDf] = useState<CSVData>({});
    const [processingStatus, setProcessingStatus] = useState<boolean>(false);


    const downloadCSV = () => {
        const csvContent = convertToCSV(outputDf);
    
        const blob = new Blob([csvContent], { type: 'text/csv' });
    
        // Create a temporary link and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.csv';
        link.click();
      };
    
      const convertToCSV = (data: CSVData) => {
        const headers = Object.keys(data);
        const csvRows = [];
    
        csvRows.push(headers.join(','));
    
        (Object.keys(data).length>0? data[Object.keys(data)[0]] :[]).forEach(function (cellValue, index) {
          const values = Object.keys(data).map(function (column) {
            return (
                data[column][index]
            );
          })
          csvRows.push(values);
         });
    
        return csvRows.join('\n');
      };



    const getRunQueryResponse = async (inputText: string, configSetupId:any) => {
        const authTokens = getTokens();
        const response = await fetch(`${apiConfigs.baseUrl}/core/api/get-run-query-response/`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token ' + authTokens?.access,
            },
            body:JSON.stringify({sql:inputText, configSetupId})
        })
       
        const data = await response.json();
        if (response.status === 200) {
            return data;
        } else return null;
    }

    const handleSubmit = (queryInput:string, configSetupId:any) => {
        setOutputDf({});
        setOutputText('');
        setProcessingStatus(true);
        if (true) {
          getRunQueryResponse(queryInput, configSetupId).then((response:any) => {
                setTimeout(() => {
                    if(response!==null)
                        {
                          setOutputText(response.text);
                          const dataframe = (JSON.parse(JSON.stringify(response.dataframe)) as CSVData)
                          setOutputDf(dataframe);
                          setProcessingStatus(false);
                        }
                }, 1000)
            });
            
        }
      };
    
    let contextData = {
        queryInput: queryInput,
        setQueryInput: setQueryInput,
        getRunQueryResponse:getRunQueryResponse,
        downloadCSV:downloadCSV,
        handleSubmit:handleSubmit,
        outputDf:outputDf,
        outputText:outputText,
        setOutputDf:setOutputDf,
        setOutputText:setOutputText,
        processingStatus:processingStatus,
    }

    return(
        <RunQueryContext.Provider value={contextData}>
            {children}
        </RunQueryContext.Provider>
    )
}