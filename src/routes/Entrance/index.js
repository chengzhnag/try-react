import React, { Component } from "react";
import { Button } from 'antd-mobile';
import Modules from './index.module.scss';

class Entrance extends Component {
  render() {
    return <div className={Modules.box}>
      <span className="like">hello</span>
      <Button type="primary">primary</Button>
    </div>;
  }
}

export default Entrance;
