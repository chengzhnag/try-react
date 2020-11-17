import React, { Component } from "react";
import { Button } from 'antd-mobile';

class Login extends Component {
  render() {
    return <div className="box">
      <span className="like">login</span>
      <Button type="primary">登录</Button>
    </div>;
  }
}

export default Login;
