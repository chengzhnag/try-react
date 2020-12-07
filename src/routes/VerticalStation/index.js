import React, { Component } from "react";
import Unify from './unify.module.scss';
import { NavBar, Icon } from 'antd-mobile';
import { checkOrgIsGroup, unApprovedList } from "@/common/api.js";

class Page extends Component {
  componentDidMount() {
    console.log("componentDidMount");
    this.initData();
  }
  constructor() {
    super();
    this.state = {
      title: '岗位类别',
      myMenulist: [],
      manageMenulist: [],
      auditNum: 0
    }
  }
  enterMenu(item) {
    console.log(item);
  }
  initData() {
    let list = [{
      name: '我加入的',
      desc: '将收到上级岗位发送的通知公告或短信。',
      id: 1
    }, {
      name: '尚未加入',
      desc: '展示您未申请，或待审核的岗位',
      id: 2
    }]
    let manage = [{
      name: '审核',
      desc: '审核范围：我创建的岗位；上级创建的且我加入的岗位。',
      id: 3
    }, {
      name: '我创建、管理的岗位',
      desc: '管理下级组织岗位类别，可下发通知公告或短信。',
      id: 4
    }]
    this.setState({
      manageMenulist: manage,
      myMenulist: list
    })
  }
  render() {
    return <div className={Unify['index-box']}>
      <NavBar
        mode="light"
        icon={<Icon onClick={() => console.log('onLeftClick')} size="lg" color="#333" type="left" />}
      >{this.state.title}</NavBar>
      <div className="content-same">
        {
          this.state.manageMenulist.length ? (
            <div className="tips">管理</div>
          ) : null
        }
        {
          this.state.manageMenulist.map((item, index) => {
            return (
              <div className="alone" key={item.id} onClick={this.enterMenu.bind(this, item)}>
                <div className="center">
                  <span className="name">{item['name']}
                    {
                      <span style={{ display: (item['id'] === 3 && this.state.auditNum) ? 'block' : 'none' }} className="nums">{this.state.auditNum}</span>
                    }
                  </span>
                  <span className="desc">{item['desc']}</span>
                </div>
                <div className="right">
                  <Icon size="lg" color="#999" type="right" />
                </div>
              </div>
            )
          })
        }
        {
          this.state.manageMenulist.length ? (
            <div className="tips">我的</div>
          ) : null
        }
        {
          this.state.myMenulist.map((item, index) => {
            return (
              <div className="alone" key={item.id} onClick={this.enterMenu.bind(this, item)}>
                <div className="center">
                  <span className="name">{item['name']}</span>
                  <span className="desc">{item['desc']}</span>
                </div>
                <div className="right">
                  <Icon size="lg" color="#999" type="right" />
                </div>
              </div>
            )
          })
        }
      </div>
    </div>;
  }
}

export default Page;
