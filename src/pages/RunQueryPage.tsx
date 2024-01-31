import React, {useContext, useState} from 'react'
import AuthContext from '../context/AuthContext';
import styled from 'styled-components';
import ChatContext from '../context/ChatContext';
import RunQueryContext from '../context/RunQueryContext';
import '../css/table.css';
import { CSVData } from '../context/RunQueryContext';
import ProcessingIndicator from "../components/Processing";

const Container = styled.div`
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Input = styled.textarea`
  width: 100%;
  resize: auto;
  padding: 20px;
  padding-left:10px;
  padding-right:10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height:100px;
`; 

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  background-color: #f2f2f2;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;



const RunQueryPage: React.FC = () => {
    const {
      getBotMessage,
      appendMessages,
      messages
  } = useContext(ChatContext);

  const {
    queryInput,
    setQueryInput,
    getRunQueryResponse,
    handleSubmit,
    downloadCSV,
    outputDf,
    outputText,
    processingStatus,
    setProcessingStatus,
} = useContext(RunQueryContext);



  const getTableContent = (arr: CSVData) => {
    const iterateItem = (arr:CSVData, index:number) => {
      return Object.keys(arr).map(function (column) {
        return (
            <td>{arr[column][index]}</td>
        );
      })
    }
    return (<table key={"table"} style={{ width: '100%' }}>
      <tr>{Object.keys(arr).map(function (key, index) {
        return (
          <th>
            {key}
          </th>

        );
      })}</tr>
      
      {(Object.keys(arr).length>0? arr[Object.keys(arr)[0]] :[]).map(function (cellValue, index) {
        return (
          <tr>
            {iterateItem(arr, index)}
          </tr>

        );
      })}
    </table>)

  };



  return (
    <>
    <h1 style={{textAlign:'center'}}>Run Query</h1>
    <Container style={{alignItems:'center', flexDirection:'column'}}>
     
      <Input placeholder='put your sql here' defaultValue={queryInput} onChange={(event) => setQueryInput(event.target.value)}>
      </Input>

      <div style={{flexDirection:'row'}}>
      <button style={{width:'auto', height:'30px'}} onClick={() => handleSubmit(queryInput)}>Run query</button>
      <button onClick={() => downloadCSV()}>Download Result as CSV</button>
      </div>
      {processingStatus==false ? <Input placeholder='result' value={outputText} style={{maxHeight:'50px'}}>
      </Input>: <span>"Processing..."</span>}
      
    </Container>

    <div className="p-2 table-container" >
      {processingStatus==false ? getTableContent(outputDf): <span>"Processing..."</span>}
    </div>
    </>
  );
};

export default RunQueryPage;
