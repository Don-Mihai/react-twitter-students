import React, { useEffect, useState } from 'react';
import './InputEdit.scss';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

interface Props {
    className?: string;
    fontSize?: number;
    value?: string;
    onSave?: (value: string) => void;
}

function InputEdit({ className, value, fontSize, onSave }: Props) {
    const [inputText, setInputText] = useState<string>('');
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        setInputText(value ? value : '')
    }, [value])

    const handleChange = (e: any) => {
        setInputText(e.target.value);
    };

    const handleClickEdit = () => {
        setIsEdit(true);
    };

    const handleCLickSave = () => {
      onSave && onSave(inputText);
      setIsEdit(false);
    };

    return (
        <div className={`input-edit-component ${className ? className : ''}`}>
            {isEdit ? (
                <input
                    className="input-edit-component__input"
                    style={{ height: fontSize ? fontSize : '36px', fontSize: fontSize ? fontSize : '36px' }}
                    value={inputText}
                    onChange={handleChange}
                />
            ) : (
                <h3 style={{ height: fontSize ? fontSize : '36px', fontSize: fontSize ? fontSize : '36px' }}>{inputText}</h3>
            )}
            <IconButton onClick={handleClickEdit}>
                <EditIcon color="primary" sx={{ cursor: 'pointer' }} />
            </IconButton>
            {isEdit && (
                <IconButton onClick={handleCLickSave}>
                    <DoneOutlineIcon color="success" sx={{ cursor: 'pointer' }} />
                </IconButton>
            )}
        </div>
    );
}

export default InputEdit;
