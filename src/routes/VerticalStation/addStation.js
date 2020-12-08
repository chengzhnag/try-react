import React, { Component } from "react";
import Unify from './unify.module.scss';
import { NavBar, Icon, TextareaItem, InputItem, Picker, List, Toast, Button } from 'antd-mobile';
import { getMyStationList, getMyCreateRole } from "@/common/api.js";

class Page extends Component {
  componentWillMount() {
    console.log('Component WILL MOUNT!')
  }
  componentDidMount() {
    console.log('Component DID MOUNT!')
  }
  componentWillReceiveProps(newProps) {
    console.log('Component WILL RECEIVE PROPS!')
  }
  shouldComponentUpdate(newProps, newState) {
    return true;
  }
  componentWillUpdate(nextProps, nextState) {
    console.log('Component WILL UPDATE!');
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('Component DID UPDATE!')
  }
  componentWillUnmount() {
    console.log('Component WILL UNMOUNT!')
  }
  constructor() {
    super();
    this.state = {
      title: '新增岗位类别',
      Name: '',
      Quanity: '',
      PublishingType: 0,
      Remark: ''
    }
  }
  handleChange(key, event) {
    this.setState({
      [`${key}`]: event
    });
  }
  render() {
    return <div className={Unify['addstation-box']}>
      <NavBar
        mode="light"
        icon={<Icon onClick={() => this.props.history.go(-1)} size="lg" color="#333" type="left" />}
      >{this.state.title}</NavBar>
      <div className="content-box">
        <List style={{ backgroundColor: 'white' }} className="picker-list">
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
          <div className="tips">注意：人数确定后，编辑时只能增大，不能改小。</div>

          <Picker extra="请选择发布范围"
            // data={district}
            title="选择发布范围"
            onOk={e => console.log('ok', e)}
            onDismiss={e => console.log('dismiss', e)}
          >
            <List.Item arrow="horizontal">发布范围</List.Item>
          </Picker>
          <div className="tips">注意：您选择的发布范围为全市组织，提交后不可改为“本单位及所辖组织。</div>
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
        <span className="cancel">取消</span>
        <span className="creact" >创建</span>
      </div>
    </div>;
  }
}

export default Page;
