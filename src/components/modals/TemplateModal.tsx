import React, { ReactNode, useState } from 'react';
import Modal from 'react-modal';

// Define the type of the model
interface Model {
    id?: number;
    [key: string]: any; // This allows for flexibility in properties
}

interface EditableModelModalProps<T extends Model> {
    model: T;
    isOpen: boolean;
    onClose: () => void;
    onSave: (model: T) => void;
    OnCreate: (model: T) => void;
    onDelete: (model: T) => void;
    readonlyKeys?: string[];
    disableKeys: string[];
    children: ReactNode;
    title?:string;
}

const EditableModelModal = <T extends Model>({
    model,
    isOpen,
    onClose,
    onSave,
    OnCreate,
    onDelete,
    readonlyKeys=undefined,
    children,
    title,
    disableKeys=[],
}: EditableModelModalProps<T>) => {
    const [editedModel, setEditedModel] = useState<T>({ ...model });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedModel(prevModel => ({ ...prevModel, [name]: value }));
    };
    console.log(Object.keys(editedModel),'jjjjj')


    const isNewModel = !editedModel.id;

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <button onClick={onClose}>Close</button>
            <h2>{isNewModel ? 'Create New' : 'Edit'} {title ? title : "Model"}</h2>
            <div>
                {Object.keys(editedModel).filter(key => disableKeys.includes(key)==false).filter(key => (readonlyKeys?readonlyKeys:[]).includes(key)).map((key) => (
                    <div key={key}>
                        <label>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                            {<span >{editedModel[key]}
                            </span>}
                        </label>
                    </div>
                ))}
                {Object.keys(editedModel).filter(key => disableKeys.includes(key)==false).filter(key => (readonlyKeys?readonlyKeys:[]).includes(key)==false).map((key) => (
                    <div key={key}>
                        <label>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                            { <input
                                type="text"
                                name={key}
                                value={editedModel[key]}
                                onChange={handleInputChange}
                            />}
                        </label>
                    </div>
                ))}
                <button type="submit" onClick={() => isNewModel? OnCreate(editedModel): onSave(editedModel)}>{isNewModel ? 'Create' : 'Save'}</button>
                {!isNewModel && <button type="button" onClick={() => onDelete(editedModel)}>Delete</button>}
                <button type="button" onClick={onClose}>Cancel</button>
            </div>
            {children}
        </Modal>
    );
};

export default EditableModelModal;
