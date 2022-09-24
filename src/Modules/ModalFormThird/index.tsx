import './ModalFormThird.scss';
import Button from '../../components/Button';
import {useRef, useState} from 'react';
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';
import Link from '@mui/material/Link';

interface ModalFormThirdValues {
  isChecked: boolean
}

function ModalFormThird({changeFormsValue,nextStep, onClose}: {changeFormsValue: any, nextStep: any, onClose: any}) {

  const [inputsValue, setInputsValue] = useState<ModalFormThirdValues>({
    isChecked: false,
  })

  const inputLogin: any = useRef(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputsValue({isChecked: !inputsValue.isChecked})
  }

  const onSubmit = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    console.log(!inputsValue.isChecked)

    //Валидация на заполнены ли поля
    if(!inputsValue.isChecked ) {return}

      changeFormsValue(inputsValue)
      nextStep()
      onClose()
  }

  return (
      <div>
          <div className="relative">
              <label htmlFor="checkbox">
                  <Checkbox
                      ref={inputLogin}
                      id="checkbox"
                      aria-label="asdfas"
                      sx={{
                          color: pink[800],
                          '&.Mui-checked': {
                              color: pink[600],
                          },
                      }}
                      onChange={handleChange}
                      value={inputsValue.isChecked}
                  />
                  <Link underline='none'>Принимаю пользовательское соглашение</Link>
              </label>

              <Button className={'btn-component__sign-modal btn'} onClick={onSubmit} text={'Зарегистрироваться'} />
          </div>
      </div>
  );
}

export default ModalFormThird;