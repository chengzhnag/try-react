import React, { Component } from "react";
import Unify from "./unify.module.scss";
import {
  NavBar,
  Icon,
  TextareaItem,
  InputItem,
  Picker,
  List,
  Toast
} from "antd-mobile";
import { createStation } from "@/common/api.js";

class Page extends Component {
  componentWillMount() {
    console.log("Component WILL MOUNT!");
  }
  componentDidMount() {
    console.log("Component DID MOUNT!");
    this.init();
  }
  componentWillReceiveProps(newProps) {
    console.log("Component WILL RECEIVE PROPS!");
  }
  shouldComponentUpdate(newProps, newState) {
    return true;
  }
  componentWillUpdate(nextProps, nextState) {
    console.log("Component WILL UPDATE!");
  }
  componentDidUpdate(prevProps, prevState) {
    console.log("Component DID UPDATE!");
  }
  componentWillUnmount() {
    console.log("Component WILL UNMOUNT!");
    if (this.state.backTimer) {
      clearTimeout(this.state.backTimer);
    }
  }
  constructor() {
    super();
    this.state = {
      title: "新增岗位类别",
      Name: "",
      Quanity: "",
      PublishingType: 0,
      Remark: "",
      rangeColumns: [],
      rangeVal: [],
      isEdit: 0,
      backTimer: null
    };
  }
  // get 取用户信息
  get _info() {
    return window._storage.read("_userinfo");
  }
  // get 取用户类型
  get _ident() {
    return window._storage.read("identification");
  }
  // 初始化选择器数据
  init() {
    let _range = [
      {
        label: "本单位及所辖组织",
        value: 1
      }
    ];
    if (["Group", "HeightGroup"].includes(this._ident)) {
      _range.push({
        label: "全市组织",
        value: 2
      });
    }
    this.setState({
      rangeColumns: _range
    });
  }
  // 输入框change事件设置state的值
  handleChange(key, event) {
    this.setState({
      [`${key}`]: event
    });
  }
  // 选择器的确定按钮事件
  confirmPicker(val) {
    const rangeVal = [...val];
    this.setState({
      rangeVal,
      PublishingType: val[0]
    });
  }
  // 进行操作 取消 创建
  operation(type) {
    switch (type) {
      case 1:
        this.props.history.go(-1);
        break;
      case 2:
        this.submit();
        break;
      default:
        break;
    }
  }
  // 创建岗位
  submit() {
    if (this.checkForm()) {
      return;
    }
    let _p = { ...this.state };
    delete _p["backTimer"];
    delete _p["isEdit"];
    delete _p["rangeVal"];
    delete _p["rangeColumns"];
    delete _p["title"];
    let params = Object.assign(
      {
        OrgId: this._info["OrganizeId"], //所属组织ID
        F_Id: "", //岗位Id
        Uid: this._info["Uid"] //登录用户ID
      },
      _p
    );

    if (this.state.isEdit === 1) {
      /* let _data = this.$storage.read('_station_detail_data');
      if (_data['F_Quanity'] > this.params.Quanity) {
        this.$toast('人数确定后，编辑时只能增大，不能改小。');
        return;
      } */
    }
    createStation(params)
      .then(res => {
        if (res.status === 1) {
          Toast.info(
            `${this.state.isEdit === 1 ? "更新" : "新增"}岗位类别成功!`
          );
          let _timer = setTimeout(() => {
            this.props.history.go(-1);
          }, 1000);
          this.setState({
            backTimer: _timer
          });
        } else {
          Toast.info(res.message || "出错了");
        }
      })
      .catch(err => {
        Toast.info(err.message || err);
      });
  }
  // 检查form表单是否完整
  checkForm() {
    let flag = false,
      _msg = [];
    if (!this.state.Name) {
      _msg.push("请填写岗位类别名称");
      flag = true;
    }
    if (this.state.Quanity === "") {
      _msg.push("请填写可加入人数");
      flag = true;
    }
    if (this.state.Quanity < 1) {
      _msg.push("请填写正确的可加入人数");
      flag = true;
    }
    if (!this.state.Name) {
      _msg.push("请填写岗位类别名称");
      flag = true;
    }
    if (!this.state.Remark) {
      _msg.push("请填写岗位描述");
      flag = true;
    }
    if (_msg.length) {
      Toast.info(_msg[0] || "带*号为必填项");
    }
    return flag;
  }
  render() {
    return (
      <div className={Unify["addstation-box"]}>
        <NavBar
          mode="light"
          icon={
            <Icon
              onClick={() => this.props.history.go(-1)}
              size="lg"
              color="#333"
              type="left"
            />
          }
        >
          {this.state.title}
        </NavBar>
        <div className="content-box">
          <List style={{ backgroundColor: "white" }} className="picker-list">
            <InputItem
              clear
              maxLength={30}
              placeholder="请输入岗位类别"
              value={this.state.Name}
              onChange={this.handleChange.bind(this, "Name")}
            >
              岗位类别
            </InputItem>
            <InputItem
              clear
              type="number"
              maxLength={2}
              labelNumber={9}
              placeholder="请输入可加入人数"
              value={this.state.Quanity}
              onChange={this.handleChange.bind(this, "Quanity")}
            >
              每个组织可加入人数
            </InputItem>
            <div className="tips">
              注意：人数确定后，编辑时只能增大，不能改小。
            </div>
            {this._ident !== "Area" ? (
              <Picker
                extra="请选择发布范围"
                data={this.state.rangeColumns}
                value={this.state.rangeVal}
                title="选择发布范围"
                cols={1}
                onOk={this.confirmPicker.bind(this)}
                onDismiss={e => console.log("dismiss", e)}
              >
                <List.Item arrow="horizontal">发布范围</List.Item>
              </Picker>
            ) : null}
            {this.state.PublishingType === 2 ? (
              <div className="tips">
                注意：您选择的发布范围为全市组织，提交后不可改为“本单位及所辖组织。
              </div>
            ) : null}
            <TextareaItem
              title="岗位描述"
              placeholder="请输入相关描述，让老师知道自己是否可申请本岗位。"
              clear
              autoHeight
              value={this.state.Remark}
              onChange={this.handleChange.bind(this, "Remark")}
            />
          </List>
        </div>
        <div className="bottom-btn-box">
          <span className="cancel" onClick={this.operation.bind(this, 1)}>
            取消
          </span>
          <span className="creact" onClick={this.operation.bind(this, 2)}>
            创建
          </span>
        </div>
      </div>
    );
  }
}

export default Page;
