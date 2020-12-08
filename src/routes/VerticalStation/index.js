import React, { Component } from "react";
import Unify from './unify.module.scss';
import { NavBar, Icon, Toast } from 'antd-mobile';
import { checkOrgIsGroup, unApprovedList } from "@/common/api.js";

class Page extends Component {
  componentWillMount() {
    console.log('Component WILL MOUNT!')
  }
  componentDidMount() {
    console.log('Component DID MOUNT!')
    this.initData();
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
      title: '岗位类别',
      myMenulist: [],
      manageMenulist: [],
      auditNum: 0
    }
  }
  get _info() {
    return window._storage.read('_userinfo');
  }
  enterMenu(item) {
    console.log(item);
    let name = `stationlist?id=${item.id}`;
    if (item.id === 3) {
      name = 'stationaudit';
    };
    window._storage.write('verticalmenuid', item.id);
    this.props.history.push(name);
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
    this.checkOrgIsGroup(res => {
      if (['Group', 'Area', 'HeightGroup'].includes(res)) {
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
        this.getAuditNum();
      } else if (['School', 'SubSchool'].includes(res)) {
        this.setState({
          myMenulist: list
        })
      }
    })
  }
  checkOrgIsGroup(call) {
    let params = {
      orgId: this._info['OrganizeId']
    }
    checkOrgIsGroup(params).then(res => {
      if (res.status === 1) {
        window._storage.write('identification', res.results);
        call && call(res.results)
      } else {
        Toast.info(res.message || '出错了');
      }
    }).catch(err => {
      Toast.info(err.message || err);
    })
  }
  getAuditNum() {
    let params = {
      orgId: this._info['OrganizeId'], //创建机构Id
      uid: this._info['Uid'],
      rows: 0, //每页10条
      page: 1 //页码
    }
    unApprovedList(params).then(res => {
      if (res.status === 1) {
        this.setState({
          auditNum: res.total * 1
        })
      } else {
        Toast.info(res.message || '出错了');
      }
    }).catch(err => {
      Toast.info(err.message || err);
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
