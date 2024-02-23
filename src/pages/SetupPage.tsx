import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import styled from 'styled-components';
import Select, { MultiValue, SingleValue } from "react-select";
import makeAnimated from 'react-select/animated';
import SetupContext, { DataLayout } from '../context/SetupContext';



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
  margin:auto;
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

interface TableInfo {
  name: string;
  isSelected: boolean;
  columns: {
    name: string;
    isSelected: boolean;
  }[];
}

const animatedComponents = makeAnimated();


const SetupPage = () => {
  const {
    setDataLayoutSelection,
    resetToDefaultSelection,
    getAndSetDataLayout,
    datalayout,
    setDatalayout,
  } = useContext(SetupContext);

  const [tablesSelected, setTablesSelected] = useState(Object.keys((datalayout as DataLayout).selectedTables || {}));
  const [updateSelectionEnabled, setUpdateSelectionEnabled] = useState<boolean>(false);
  useEffect(() => {
    setTablesSelected(Object.keys((datalayout as DataLayout).selectedTables || {}));
  }, [])



  const handleTableSelection = (selectedOptions: MultiValue<{ value: string, label: string }>) => {
    const datalayoutCopy = (datalayout as DataLayout);
    selectedOptions.forEach(({value, label}) => {
      if(datalayoutCopy?.selectedTables && datalayoutCopy.selectedTables.hasOwnProperty(value)==false){
        datalayoutCopy.selectedTables[value] = [];
      }
    });
    Object.keys((datalayout as DataLayout)?.selectedTables || {}).forEach((tableName) => {
      if(selectedOptions.map(({value, label}) => value).includes(tableName)==false && datalayoutCopy?.selectedTables){
        delete datalayoutCopy.selectedTables[tableName];
      }
    })
    setDatalayout(datalayoutCopy);
    setTablesSelected(Object.keys((datalayoutCopy).selectedTables || {}));
    setUpdateSelectionEnabled(true);
  };

  const handleColumnSelection = (tableName: string, selectedOptions: MultiValue<{ value: string, label: string }>) => {
    const datalayoutCopy = (datalayout as DataLayout);
      selectedOptions.forEach(({value, label}) => {
        if(datalayoutCopy?.selectedTables){
        datalayoutCopy.selectedTables[tableName].push(value);
        }
      })
    setDatalayout(datalayoutCopy);
    setTablesSelected(Object.keys((datalayoutCopy.selectedTables || {})));
    setUpdateSelectionEnabled(true);
  };



  const handleSelection = () => {
    setDataLayoutSelection((datalayout as DataLayout).selectedTables).then((datalayout: DataLayout) => { 
      setDatalayout(datalayout) });
      setTablesSelected(Object.keys((datalayout.selectedTables || {})));
    setUpdateSelectionEnabled(false);
  };

  const handleResetDefault = () => {
    resetToDefaultSelection().then((datalayout: DataLayout) => { 
      setDatalayout(datalayout) });
      setTablesSelected(Object.keys((datalayout.selectedTables || {})));
  }
  
  const getAllColumns = (tableName: string) => {
    const datalayoutCopy = (datalayout as DataLayout);
    if(datalayoutCopy?.allTables){
      return datalayoutCopy?.allTables[tableName].map((columnName) => {return {value:columnName, label:columnName}})
    }
    return [];
  }
  const getSelectedColumns = (tableName: string) => {
    const datalayoutCopy = (datalayout as DataLayout);
    if(datalayoutCopy?.selectedTables){
      return datalayoutCopy?.selectedTables[tableName].map((columnName) => {return {value:columnName, label:columnName}})
    }
    return [];
  }
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Setup</h1>
      <div>
        <div>
          <h3>Select Tables:</h3>
          <Select
            isMulti
            id='tables'
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={tablesSelected.map(tableName => { return { value: tableName, label: tableName } }).sort((a,b) => a.label>b.label? 1 : -1) || []}
            options={Object.keys((datalayout as DataLayout).allTables || {}).map(tableName => { return { value: tableName, label: tableName } }).sort((a,b) => a.label>b.label? 1 : -1) || []}
            onChange={(selectedOptions) => handleTableSelection(selectedOptions)} />
        </div>
        <div>
          <h3>Select Columns:</h3>
          {(tablesSelected.map(tableName => { return { value: tableName, label: tableName } }).sort((a,b) => a.label>b.label? 1 : -1) || []).map(({value, label}) => (
            <div key={value}>
              <h4>{value}</h4>
              <Select
                isMulti
                id={value}
                closeMenuOnSelect={false}
                components={animatedComponents}
                defaultValue={getSelectedColumns(value)}
                options={getAllColumns(value)}
                onChange={(selectedOptions) => handleColumnSelection(value, selectedOptions)} />
            </div>
          ))}
        </div>
        <FloatingContainer>
          <button disabled={!updateSelectionEnabled} onClick={handleSelection}>Update Selection</button>
          <button onClick={handleResetDefault}>Reset to Default</button>
        </FloatingContainer>
      </div>
    </>
  );
};

export default SetupPage;


