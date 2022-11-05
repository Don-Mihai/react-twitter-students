import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../../components/Button';
import Navigation from '../../Modules/Navigation';
import './Home.scss';
import Options from '../../components/Options';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Aside from '../../Modules/Aside';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {CustomPost, fetchPosts as fetch, post, PostStore, remove, update, uploadImg} from '../../store/post/postSlice';
import { UserProc, fetch as fetchUser, Role } from '../../store/user/userSlice';
import UploadIcon from '@mui/icons-material/Upload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Avatar from '@mui/material/Avatar';



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

	const handleTwit = async () => {

		const imgData: any = await dispatch(uploadImg(file))

		
		const payload: CustomPost = {
			body: textPost,
			idUser: user.id,
			imgUrl: imgData.payload.filePath,
		} as CustomPost;


		if (payload.body) {
			dispatch(post(payload)).then(fetchPosts)
			setTextPost('')
		}

		setFile(null)

	}



	const fetchPosts = () => {
		dispatch(fetch())
	}

	const handleFileChange = (e: any) => {
		setFile(e.target.files[0])
		setDrag(false);
	}

	const dragDropHandler = (evt: any) => {
		evt.preventDefault();
		setDrag(false);
	}
	const dragLeaveHandler = (evt: any) => {
		evt.preventDefault();
		setDrag(false);
	}

	const dragOverHandler = (evt: any) => {
		evt.preventDefault();
		setDrag(true);
	}

	const AvatarMemo = useMemo(() => {
        return(
            <>
                <Avatar alt="avatar" src={`http://localhost:5000/${user?.imgUrl}`} sx={{ width: 60, height: 60 }} />
            </>
        )
    }, [user])

	return (
        <section className="home">
            <Navigation />
            <section className="home__posts">
                <section className="status">
                    <h2 className="status-title">Главная</h2>
                    <div className="status__img-wrapper">
                        {AvatarMemo}
                    </div>
                    <div className="status__input" onDragOver={dragOverHandler}>
                        <textarea
                            className="status__input-textArea"
                            rows={2}
                            cols={49}
                            value={textPost}
                            onChange={handlePostsChange}
                            placeholder="Что происходит?"
                        ></textarea>

                        {drag && <input className="upload-input" style={{ zIndex: drag ? 10 : 0 }} type="file" onChange={handleFileChange} name="" id="" />}

                        {drag && (
                            <div className={drag ? 'dropzone' : ''} onDragLeave={dragLeaveHandler} onDrop={dragDropHandler}>
                                <UploadIcon color="primary" />
                            </div>
                        )}
                    </div>
                    {file && <div className="status__icon-container" onClick={() => setFile(null)}>
                        <AttachFileIcon color="primary" />
                        <div className="status__icon-counter">x</div>
                    </div>}
                    <div className="status__icon">
                        {!changeMode && <Button className={'home__twit'} onClick={handleTwit} text={'Твитнуть'} />}
                        {changeMode && <Button className={'home__twit'} onClick={handleUpdateTwit} text={'Сохранить'} />}
                    </div>
                </section>
                {posts.isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    posts.processPosts
                        .filter(item => item.body.toLowerCase().includes(searchText.toLowerCase()))
                        .map(post => {
                            return (
                                <div key={post.id} className="home__posts-wrapper">
                                    <div className="home__posts-header">
                                        <div className='home__posts-avatar-wrapper'>
                                            <Avatar alt="avatar" src={`http://localhost:5000/${post?.avatarUrl}`} sx={{ width: 40, height: 40 }}>
                                                {post.name}
                                            </Avatar>
                                            <h3 className="home__posts-title">
                                                {post.name} {post.login}
                                            </h3>
                                        </div>

                                        {user.role === Role.ADMIN || post.idUser === user.id ? (
                                            <Options
                                                className={'home__posts-option'}
                                                onClickEdit={handleClickEdit}
                                                options={options}
                                                id={post.id}
                                                onClickDelete={handleClickDelete}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </div>

                                    <div className="home__posts-container">
                                        <p className="home__posts-body">{post.body}</p>
                                        {post?.imgUrl && <img className="home__posts-img" src={`http://localhost:5000/${post?.imgUrl}`} alt="" />}
                                    </div>
                                </div>
                            );
                        })
                        .reverse()
                )}
            </section>
            <Aside handleChange={handleChange} searchText={searchText} />
        </section>
    );
}

export default Home;