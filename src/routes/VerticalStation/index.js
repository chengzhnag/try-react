import React, { Component } from "react";
import Unify from './unify.module.scss';
import { NavBar, Icon } from 'antd-mobile';

class Page extends Component {
  render() {
    return <div className={Unify.xxx}>
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => console.log('onLeftClick')}
      >岗位类别</NavBar>
    </div>;
  }
}

export default Page;
