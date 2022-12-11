import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import React from 'react';
import './AsideTopic.scss';

interface Props {
    title: string;
    signature: string;
    imgUrl: string;
}

function AsideTopic({ title, signature, imgUrl }: Props) {
    return (
        <div className="home-aside__current-topic">
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Avatar alt="avatar" src={`http://localhost:5000/${imgUrl}`} sx={{ width: 60, height: 60, cursor: 'pointer' }} />
                <div className="home-aside__current-content">
                    <h4 className="home-aside__current-description aside-content">{title}</h4>
                    <h3 className="home-aside__current-signature">{signature}</h3>
                </div>
            </div>

            <Button color={'primary'} variant={'contained'} sx={{ fontSize: '8px'}}>Подписаться</Button>
        </div>
    );
}

export default AsideTopic;