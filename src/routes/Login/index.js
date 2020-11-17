import React, { Component } from "react";
import { Button, InputItem } from 'antd-mobile';
import modules from './login.module.scss';

class Login extends Component {
  componentDidMount() {
    console.log('componentDidMount');
  }
  render() {
    return <div className={modules.box}>
      <InputItem
        clear
        placeholder="auto focus"
      >姓名</InputItem>
      <InputItem
        clear
        placeholder="auto focus"
      >手机号</InputItem>
      <InputItem
        clear
        placeholder="auto focus"
      >所属区域</InputItem>
      <InputItem
        clear
        placeholder="auto focus"
      >密码</InputItem>
      <InputItem
        clear
        placeholder="auto focus"
      >确认密码</InputItem>
      <Button className="button" type="primary">登录</Button>
    </div>;
  }
}

export default Login;
