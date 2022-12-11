import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import AsideTopic from '../AsideTopic';
import './AsideCurrent.scss';
import { fetch as fetchUser, UserData, fetchUsers as fetch } from '../../store/user/userSlice';

function AsideCurrent() {
  const user: UserData = useAppSelector((store: any) => store.user)

	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(fetchUser(Number(sessionStorage.getItem('userId'))))
		fetchUsers()
	}, [])

	const fetchUsers = () => {
		dispatch(fetch())
	}

  return (
    <div className="home-aside__current">
      <h2 className="home-aside__current-title">
        Топ пользователей
      </h2>
      <div className="home-aside__current-wrapper">
        {user.users.map(user => {
          return <AsideTopic title={user.login} signature={user.name} imgUrl={user.imgUrl || ''}></AsideTopic>
        })}
      </div>
    </div>
  );
}

export default React.memo(AsideCurrent);