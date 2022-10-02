import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Navigation from '../../Modules/Navigation';
import './Home.scss';
import Options from '../../components/Options';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Aside from '../../Modules/Aside';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {CustomPost, fetch, post, PostStore, remove, update} from '../../store/post/postSlice';
import { UserProc, fetch as fetchUser, Role } from '../../store/user/userSlice';

const options = [
	'Редактировать',
	'Удалить',
];

function Home() {
	const [searchText, setSearchText] = useState('');
	const [textPost, setTextPost] = useState<string>('');
	const [changeMode, setChangeMod] = useState<boolean>(false);
	const [currentPost, setCurrentPost] = useState<number>();
	const posts: PostStore = useAppSelector((store: any) => store.post)
	const user: UserProc = useAppSelector((store: any) => store.user.user)

	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(fetchUser(Number(sessionStorage.getItem('userId'))))
		fetchPosts()
	}, [])


	const handleClickEdit = (id?: number) => {
		setChangeMod(true)
		setCurrentPost(id)
		// переносит текст поста в инпут
		posts.posts.forEach((post) => {
			if (post.id === id) {
				setTextPost(post.body ? post.body : '')
			}
		})
	};

	const handleUpdateTwit = () => {
		const payload = {
			id: currentPost,
			body: textPost
		} as CustomPost

		if (payload.body) {
			dispatch(update(payload)).then(fetchPosts)
			setTextPost('')
		}
	}

	const handleClickDelete = (id: number) => {
		dispatch(remove(id)).then(fetchPosts)
	};
	
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(event.target.value)
	}

	const handlePostsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTextPost(event.target.value)
	}

	const handleTwit = () => {
		const payload: CustomPost = {
			body: textPost,
			idUser: user.id
		} as CustomPost;

		if (payload.body) {
			dispatch(post(payload)).then(fetchPosts)
			setTextPost('')
		}
	}



	const fetchPosts = () => {
		dispatch(fetch())
	}

	console.log(posts.posts[0], user)
	return (
		<section className="home">
			<Navigation />
			<section className="home__posts">
				<section className='status'>
					<h2 className="status-title">Главная</h2>
					<div className="status__img-wrapper">
						<AccountCircleIcon className='status__img-avatar'/>
					</div>
					<div className="status__input">
						<textarea className='status__input-textArea' rows={2} cols={49} value={textPost} onChange={handlePostsChange} placeholder='Что происходит?'> </textarea>
					</div>
					<div className="status__icon">
						{!changeMode && <Button className={'home__twit'} onClick={handleTwit} text={'Твитнуть'}/>}
						{changeMode && <Button className={'home__twit'} onClick={handleUpdateTwit} text={'Сохранить'}/>}
					</div>
				</section>
				{posts.isLoading ? <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box> :
					posts.processPosts.filter(item => item.body.toLowerCase().includes(searchText.toLowerCase())).map(post => {
						return (
							<div key={post.id} className='home__posts-wrapper'>
								{(user.role === Role.ADMIN || post.idUser === user.id) ? <Options className={'home__posts-option'} onClickEdit={handleClickEdit} options={options} id={post.id} onClickDelete={handleClickDelete} /> : ''}
								<div className='home__posts-container'>
									<h3 className='home__posts-title'>{post.name} {post.login}</h3>
									<p className='home__posts-body'>{post.body}</p>
								</div>
							</div>
						)
					}).reverse()}
			</section>
			<Aside handleChange={handleChange} searchText={searchText} />
		</section>
	);
}

export default Home;