import React, { useContext, useState, CSSProperties } from 'react'
import AuthContext from '../context/AuthContext';
import styled from 'styled-components';
import ChatContext from '../context/ChatContext';
import RunQueryContext from '../context/RunQueryContext';
import '../css/table.css';
import { CSVData } from '../context/RunQueryContext';
import ProcessingIndicator from "../components/Processing";
import SetupContext from '../context/SetupContext';

const Container = styled.div`
  width:94%;
  align-content: center;
  margin: auto;
  
`;

const Input = styled.textarea`
  
`;

const Table = styled.table`
  
  border-collapse: collapse;
  margin:20px;
  // margin-top: 20px;
  // margin-bottom: 40px;
  // margin-left: 5px;
  // margin-right: 5px;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  background-color: #aed6f1;
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

  const {
    selectConfigSetupId,
    setSelectedConfigsetupId,
  } = useContext(SetupContext);

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
    borderRadius: 4,
    backgroundColor: '#AED6F1',
    color: 'black',
    cursor: 'pointer',
    marginRight: 10,
    border: '1px solid #999'

  };

  const buttonWhite: CSSProperties = {
    width: '200px', // Set a fixed width for the button
    padding: '10px', // Optional: Add padding to make the button visually appealing
    position: 'relative',
    display: 'inline-block',
    borderRadius: 12,
    backgroundColor: '#fff',
    color: 'black',
    cursor: 'pointer',
    marginRight: 10,
    border: '1px solid #999'

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

    const iterateItem = (arr: CSVData, index: number) => {
      return Object.keys(arr).map(function (column) {
        return (
          <TableCell>{arr[column][index]}</TableCell>
        );
      })
    }
    return (<Table key={"table"} style={{ width: '94%' }}>
      <tr>{Object.keys(arr).map(function (key, index) {
        return (
          <TableHeader>
            {key}
          </TableHeader>

        );
      })}</tr>

      {(Object.keys(arr).length > 0 ? arr[Object.keys(arr)[0]] : []).map(function (cellValue, index) {
        return (
          <TableRow>
            {iterateItem(arr, index)}
          </TableRow>

        );
      })}
    </Table>)

  };



  return (
    <>
      <div style={{ backgroundColor: '#EBF5FB' }}>
        <Container>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ marginTop: 20, flex: 1 }}>
              <Input style={{
                display: 'block',
                margin: 'auto', paddingTop: '10px', width: '100%', height: '200px', borderRadius: 10
              }}
                placeholder='Put your sql here' defaultValue={queryInput}
                onChange={(e) => {
                  setQueryInput(e.target.value);
                  // e.target.style.height = 'auto'; // Reset the height
                  //e.target.style.height = `${e.target.scrollHeight}px`;
                }}>
              </Input>
            </div>

            <div style={{ flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#ddd', marginTop: 20, marginLeft: 10, height: '200px', overflowY: 'scroll' }}>
              {(outputText as string).toLowerCase().includes("error") &&
                <span style={{ fontSize: 14, textAlign: 'center', maxHeight: '200px' }}>
                  Respose:- {outputText}
                </span>}
              {
                processingStatus != '' && < ProcessingStatus processing={processingStatus} >
                  {
                    processingStatus ? 'Processing...' : 'Processing completed.'
                  }
                </ProcessingStatus >
              }
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button style={buttonStyle} onClick={() => handleSubmit(queryInput, selectConfigSetupId)}
              >Run query</button>
              {isHovered && <p style={hoverTextStyle}>
                {disclaimerText}
              </p>}
            </div>

          </div>
        </Container >
      </div>

      {/* <div style={{ display: 'flex', flex: 1, backgroundColor: '#ddd', height: 5 }}></div> */}

      {Object.keys(outputDf).length > 0 &&
        <div style={{ margin: 10, border: '1px solid #333' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>

            <div style={{ flex: 1, textAlign: 'center', border: '10px', borderColor: 'black', margin: '20px' }}>
              <span style={{ fontSize: 18, fontWeight: 'bold' }}> Result Data </span>
            </div>

            <div style={{ margin: 'auto' }}>
              <button style={buttonWhite} onClick={() => downloadCSV()}>Download CSV</button>
            </div>
          </div>
          <div className="p-2 table-container" style={{ alignItems: 'center' }}>
            {getTableContent(outputDf)}
          </div>
        </div>
      }
    </>
  );
};

export default RunQueryPage;
