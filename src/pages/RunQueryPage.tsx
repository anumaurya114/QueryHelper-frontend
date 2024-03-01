import React, {useContext, useState, CSSProperties} from 'react'
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
  background-color: #f5f5f5;
  overflow: hidden;
  display: flex;
  margin: auto;
`;

const Input = styled.textarea`
  width: 100%;
  resize: none;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow-y: auto;
  min-height: 50px; /* Initial height */
  resize: none; /* Prevent resizing */
  overflow-y: hidden; /* Hide vertical scrollbar */
  border: 1px solid #ccc;
  margin-left:20px;
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

interface ProcessingStatusProps {
  processing: boolean;
}

const ProcessingStatus = styled.div<ProcessingStatusProps>`
  background-color: ${(props) => (props.processing ? '#ffc107' : '#28a745')};
  color: ${(props) => (props.processing ? '#000' : '#fff')};
  padding: 10px;
  border-radius: 5px;
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
} = useContext(RunQueryContext);

const [isHovered, setIsHovered] = useState(false);
const [disclaimerText, setDisclaimerText] = useState(`Results are stripped to show only top 100 rows.
Please add your custom limit to get extended result.
eg
 select * from schema.table limit 200. test`);

 const buttonStyle: CSSProperties = {
  width: '200px', // Set a fixed width for the button
  padding: '10px', // Optional: Add padding to make the button visually appealing
  position: 'relative',
  display: 'inline-block',
};

const hoverTextStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: 'white',
  backgroundColor: '#007bff', // Example background color for the flying text
  padding: '5px 10px', // Optional: Add padding to make the text visually appealing
  borderRadius: '4px', // Optional: Add border radius for the text
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Optional: Add box shadow for the text
  zIndex: 1, // Ensure the flying text is above the button
};



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
    <Container style={{marginTop:'10px', alignItems:'center', flexDirection:'column' }}>
      <Input style={{paddingTop:'10px', width:'100%', minHeight:'200px'}} placeholder='put your sql here' defaultValue={queryInput} onChange={(e) => {setQueryInput(e.target.value);  e.target.style.height = 'auto'; // Reset the height
                        e.target.style.height = `${e.target.scrollHeight}px`;}}>
      </Input>

      <div style={{flexDirection:'row'}}>
      <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
      <button style={buttonStyle} onClick={() => handleSubmit(queryInput)}
      >Run query</button>
      {isHovered && <p style={hoverTextStyle}>
 {disclaimerText}
</p>}
      </div>
      
      <button style={buttonStyle} onClick={() => downloadCSV()}>Download Result as CSV</button>
      </div>
    </Container>
    {<ProcessingStatus processing={processingStatus}>
      {processingStatus ? 'Processing...' : 'Processing completed.'}
    </ProcessingStatus>}
    {(outputText as string).toLowerCase().includes("error") && <p>{outputText}</p>}
    <div style={{minWidth:'100%', minHeight:'20px', textAlign:'center', border:'10px', borderColor:'black', margin:'20px'}}>Result Table</div>
    <div className="p-2 table-container" style={{alignItems:'center'}}>
      {getTableContent(outputDf)}
    </div>
    
    </>
  );
};

export default RunQueryPage;
