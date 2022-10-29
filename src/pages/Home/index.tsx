import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../../components/Button';
import Navigation from '../../Modules/Navigation';
import './Home.scss';
import Options from '../../components/Options';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Aside from '../../Modules/Aside';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {CustomPost, fetch, post, PostStore, remove, update, uploadImg} from '../../store/post/postSlice';
import { UserProc, fetch as fetchUser, Role } from '../../store/user/userSlice';
import UploadIcon from '@mui/icons-material/Upload';



function Home() {
	const [searchText, setSearchText] = useState('');
	const [textPost, setTextPost] = useState<string>('');
	const [changeMode, setChangeMod] = useState<boolean>(false);
	const [currentPost, setCurrentPost] = useState<number>();
	const [file, setFile] = useState<Blob | null>(null);
	const posts: PostStore = useAppSelector((store: any) => store.post)
	const user: UserProc = useAppSelector((store: any) => store.user.user)
	const [drag, setDrag] = useState<boolean>(false)

	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(fetchUser(Number(sessionStorage.getItem('userId'))))
		fetchPosts()
	}, [])

	const options = useMemo(() =>[
		'Редактировать',
		'Удалить',
	],[])


	const handleClickEdit = useCallback((id?: number) => {
		setChangeMod(true)
		setCurrentPost(id)
		// переносит текст поста в инпут
		posts.posts.forEach((post) => {
			if (post.id === id) {
				setTextPost(post.body ? post.body : '')
			}
		})
	}, [posts])

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

	const handleClickDelete = useCallback((id: number) => {
		dispatch(remove(id)).then(fetchPosts)
	}, [])
	
	const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(event.target.value)
	}, [])

	const handlePostsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTextPost(event.target.value)
	}

	const handleTwit = () => {
		const payload: CustomPost = {
			body: textPost,
			idUser: user.id,
			img: file,
		} as CustomPost;

		if (payload.body) {
			dispatch(post(payload)).then(fetchPosts)
			setTextPost('')
		}
	}



	const fetchPosts = () => {
		dispatch(fetch())
	}

	const handleFileChange = (e) => {
		// setFile(e.target.files[0])
		dispatch(uploadImg(e.target.files[0]))
		setDrag(false);
	}

	const dragDropHandler = (evt) => {
		evt.preventDefault();
		setDrag(false);
	}
	const dragLeaveHandler = (evt) => {
		evt.preventDefault();
		setDrag(false);
	}

	const dragOverHandler = (evt) => {
		evt.preventDefault();
		setDrag(true);
	}

	console.log(drag)
	return (
		<section className="home">
			<Navigation />
			<section className="home__posts">
				<section className='status'>
					<h2 className="status-title">Главная</h2>
					<div className="status__img-wrapper">
						<AccountCircleIcon className='status__img-avatar'/>
					</div>
					<div className="status__input" onDragOver={dragOverHandler} >
						<textarea className='status__input-textArea' rows={2} cols={49} value={textPost} onChange={handlePostsChange} placeholder='Что происходит?'> </textarea>
						

						{drag &&<input className='upload-input' style={{zIndex: drag ? 10 : 0}} type="file" onChange={handleFileChange} name="" id=""/>}

						{drag && <div className={drag ? 'dropzone' : ''} onDragLeave={dragLeaveHandler} onDrop={dragDropHandler} >
							<UploadIcon color='primary'/>
						</div>}
						
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