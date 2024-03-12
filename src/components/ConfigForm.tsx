import React, { useState } from 'react';
import styled from 'styled-components';

export interface ConfigData {
  [key: string]: object | string | number;
}

interface ConfigFormProps {
  obj: ConfigData;
  onUpdate: (updatedValues: ConfigData) => void;
}

const Input = styled.input`
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
const FloatingContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  border: none;
  background-color: grey;
  color: white;
  cursor: pointer;
  z-index: 999; /* Ensure it appears on top of other elements */
`;


const ConfigForm: React.FC<ConfigFormProps> = ({ obj, onUpdate }) => {
  const [editedValues, setEditedValues] = useState<ConfigData>(obj);
  const [updateSelectionEnabled, setUpdateSelectionEnabled] = useState(false);

  const handleInputChange = (key: string, value:any) => {
    try {
      let parsedData;
      parsedData = JSON.parse(value.replaceAll("'",'"'));
      // if(typeof value==='string' || typeof value==='number'){
      //     parsedData = value;
      // } else parsedData = JSON.parse(value);
      setEditedValues({ ...editedValues, [key]: parsedData });
    } catch (error) {
      console.log("couldn't parse", error)
      setEditedValues({ ...editedValues, [key]: value });
    }
    setUpdateSelectionEnabled(true);
  };

  const onSubmitUpdate = (editedValues:ConfigData) => {
    onUpdate(editedValues);
    setUpdateSelectionEnabled(false);
  }


  return (
    <div>
      
      <ul>
        {Object.entries(editedValues).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong>{' '}
            {(typeof value==='string' || typeof value==='number')
            ? (<Input
              style={{resize: 'both',
                overflow: 'auto'}}
              value={value}
              onChange={(event) => handleInputChange(key, event.target.value)}
              
            />):
            <Input
            style={{resize: 'both',
                overflow: 'auto'}}
              value={JSON.stringify(value, null, '\n\n')}
              onChange={(event) => handleInputChange(key, event.target.value)}
              
            /> }
            <br />
          </li>
        ))}
        <FloatingContainer>
          <button disabled={!updateSelectionEnabled} onClick={() => onSubmitUpdate(editedValues)}>Update Selection</button>
        </FloatingContainer>
      </ul>
    </div>
  );
};

export default ConfigForm;
