import Avatar from '@mui/material/Avatar';
import React from 'react';
import InputEdit from '../../components/InputEdit';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import Navigation from '../../Modules/Navigation';
import { UserProc, update } from '../../store/user/userSlice';
import './Profile.scss';


const Profile = () => {
    const dispatch = useAppDispatch()

    const user: UserProc = useAppSelector((store: any) => store.user.user)
    const onChangeAvatar = () => {};

    const updateName = (newValue: string) => {
      const payload = {
        ...user,
        name: newValue
      }
      dispatch(update(payload))
    }

    return (
        <section className="profile">
            <Navigation />
            <section className="profile__main">
              <InputEdit value={user.name} onSave={updateName}/>
                
                <div className="profile__background">
                    <div className="profile__avatar-wrap" onClick={onChangeAvatar}>
                        <Avatar alt="avatar" src={''} sx={{ width: 120, height: 120 }} />
                    </div>
                </div>
                <InputEdit value={user.name} onSave={updateName}/>
                <h3 className="profile__email">{user.email}</h3>
            </section>
        </section>
    );
};

export default Profile;
