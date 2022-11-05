import Avatar from '@mui/material/Avatar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InputEdit from '../../components/InputEdit';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import Navigation from '../../Modules/Navigation';
import { UserProc, update, fetch as fetchUser, uploadImg } from '../../store/user/userSlice';
import './Profile.scss';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';

import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

const Profile = () => {
    const dispatch = useAppDispatch();
    let navigate = useNavigate();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isOpenUrl, setIsOpenUrl] = useState<boolean>(false);
    const [inputTextUrl, setInputTextUrl] = useState<string>('')

    const user: UserProc = useAppSelector((store: any) => store.user.user);
    const onChangeAvatar = () => {};

    useEffect(() => {
      dispatch(fetchUser(Number(sessionStorage.getItem('userId'))))
    }, [])

    const updateName = useCallback((newValue: string) => {
        const payload = {
            ...user,
            name: newValue,
        };
        dispatch(update(payload));
    },[user])

    const handleClickOpenLogout = () => {
        setIsOpen(true);
    };

    const handleClickLogout = () => {
        sessionStorage.clear();

        navigate('/');
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleCloseUrl = () => {
      setIsOpenUrl(false);
    }

    const handleOpenUrl = () => {
      setIsOpenUrl(true)
    }

    const handleInputUrlChange = (e: any) => {
      setInputTextUrl(e.target.value)
    }

    const handleInputUrlSubmit = () => {
      const payload: UserProc = {
        ...user,
        userBackground: inputTextUrl
      }

      dispatch(update(payload))

      setIsOpenUrl(false)
    }

    const handleFileChange = async (e: any) => {
        const imgData: any = await dispatch(uploadImg(e.target.files[0]))

        const payload: UserProc = {
            ...user,
			imgUrl: imgData.payload.filePath,
		} as UserProc;

        dispatch(update(payload));
	}

    const AvatarMemo = useMemo(() => {
        return(
            <>
                <Avatar alt="avatar" src={`http://localhost:5000/${user?.imgUrl}`} sx={{ width: 120, height: 120, cursor: 'pointer' }} />
                <input className="upload-input"  type="file" onChange={handleFileChange} />
            </>
        )
    }, [user])

    return (
        <section className="profile">
            <Navigation />
            <section className="profile__main">
                <div className="profile__top">
                    <InputEdit value={user.name} onSave={updateName} />
                    <IconButton onClick={handleClickOpenLogout} color="primary">
                        <LogoutIcon />
                    </IconButton>
                    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">Вы действительно хотите выйти ?</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Остаться</Button>
                            <Button onClick={handleClickLogout} autoFocus>
                                Выйти
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

                <div className="profile__background" style={{backgroundImage: `url(${user?.userBackground ? user?.userBackground : ''})`}}>
                    <IconButton onClick={handleOpenUrl} color="primary">
                        <EditIcon />
                    </IconButton>
                    <Dialog open={isOpenUrl} onClose={handleCloseUrl}>
                        <DialogTitle>Subscribe</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Вставьте адрес картинки (url)
                            </DialogContentText>
                            <TextField value={inputTextUrl} onChange={handleInputUrlChange} autoFocus margin="dense" id="name" label="Img url" type="text" fullWidth variant="standard" />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Отменить</Button>
                            <Button onClick={handleInputUrlSubmit}>Изменить фоновое изображение</Button>
                        </DialogActions>
                    </Dialog>
                    <div className="profile__avatar-wrap" onClick={onChangeAvatar}>
                        {AvatarMemo}
                    </div>
                </div>
                <InputEdit value={user.name} onSave={updateName} />
                <h3 className="profile__email">{user.email}</h3>
            </section>
        </section>
    );
};

export default Profile;
