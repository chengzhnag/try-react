import React, { Component } from "react";
import { Button, InputItem, Toast } from "antd-mobile";
import modules from "./login.module.scss";
import { register } from "@/common/api.js";
import { getUrlKey } from "@/utils";

class Login extends Component {
  componentDidMount() {
    console.log("componentDidMount");
  }
  constructor() {
    super();
    this.state = {
      openId: getUrlKey("openId") || "zs",
      mobile: "",
      area: "",
      nickname: "",
      password: "",
      againPassword: ""
    };
  }
  handleChange(key, event) {
    this.setState({
      [`${key}`]: event
    });
  }
  submit(e) {
    let flag = false;
    let fields = ["nickname", "mobile", "area", "password", "againPassword"];
    fields.forEach(it => {
      if (!this.state[it]) {
        flag = true;
      }
    });
    if (flag) {
      Toast.info("带*号的为必填项");
      return;
    }
    register(this.state)
      .then(res => {
        Toast.success(res.Message || "注册成功!");
        setTimeout(() => {
          this.props.history.push("/entrance");
        }, 500);
      })
      .catch(err => {
        Toast.fail(err.Message || err, 3);
      });
  }
  render() {
    return (
      <div className={modules.box}>
        <InputItem
          clear
          placeholder="请输入姓名"
          value={this.state.nickname}
          onChange={this.handleChange.bind(this, "nickname")}
        >
          姓名
        </InputItem>
        <InputItem
          clear
          placeholder="请输入手机号"
          type="phone"
          value={this.state.mobile}
          onChange={this.handleChange.bind(this, "mobile")}
        >
          手机号
        </InputItem>
        <InputItem
          clear
          placeholder="请输入所属区域"
          value={this.state.area}
          onChange={this.handleChange.bind(this, "area")}
        >
          所属区域
        </InputItem>
        <InputItem
          clear
          placeholder="请输入密码"
          type="password"
          value={this.state.password}
          onChange={this.handleChange.bind(this, "password")}
        >
          密码
        </InputItem>
        <InputItem
          clear
          placeholder="请确认密码"
          type="password"
          value={this.state.againPassword}
          onChange={this.handleChange.bind(this, "againPassword")}
        >
          确认密码
        </InputItem>
        <Button
          className="button"
          type="primary"
          onClick={this.submit.bind(this)}
        >
          登录
        </Button>
      </div>
    );
  }
}

export default Login;
