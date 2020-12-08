import React, { Component } from "react";
import imgSrc from '@/assets/images/not-data.png';

class NotData extends Component {
    render() {
        return (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20% 0' }}>
                <img style={{ width: '68px' }} src={imgSrc} alt=""></img>
                <span style={{ fontSize: '16px', color: '#ccc', marginTop: '16px' }}>{this.props.tips}</span>
            </div>
        );
    }
}

export default NotData;
