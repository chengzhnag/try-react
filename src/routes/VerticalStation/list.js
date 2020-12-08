import React, { Component } from "react";
import Unify from './unify.module.scss';
import { SearchBar, Tabs, NavBar, Icon, ListView, Toast, Button, PullToRefresh } from 'antd-mobile';
import { getQueryByField } from '@/utils';
import { getMyStationList, getMyCreateRole } from "@/common/api.js";
import NotData from '@/components/NotData/index';

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
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.state = {
      dataSource,
      title: '待审核、未申请岗位',
      tabs: [
        { title: '待审核' },
        { title: '未申请' }
      ],
      active: 0,
      searchValue: '',
      mid: 1,
      page: {
        page: 1,
        pageSize: 15,
        list: [],
        refreshing: false,
        isLoading: true,
        total: 0
      }
    }
  }
  get _info() {
    return window._storage.read('_userinfo');
  }
  initData() {
    this.setState({
      mid: getQueryByField('id') * 1
    }, () => {
      this.getData();
      console.log(this.state.mid);
    })
  }
  getData() {
    this.funcRequest().then(res => {
      let _list = res.results || [];
      if (this.state.page.page > 1) {
        _list = _list.concat(this.state.page.list);
      }
      this.setState(
        Object.assign({}, this.state.page, { list: _list, refreshing: false, isLoading: false, total: res.total || 0 })
      , ()=> {
        console.log(this.state.page);
      })
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(_list)
      })
    })
  }
  funcRequest() {
    return new Promise((resolve, rejects) => {
      let params = {
        orgId: this._info['OrganizeId'], //组织Id
        uid: this._info['Uid'], //用户Id
        status: -1, // -1:我申请的岗位，0：未申请，1，待审核
        rows: this.state.page.pageSize, //每页条数
        page: this.state.page.page, //页数
        text: this.state.searchValue //岗位搜索
      }
      if (this.state.active) {
        if ([2, 4].includes(this.state.mid)) {
          params.status = 0
        }
        getMyCreateRole(params).then(res => {
          if (res.status === 1) {
            resolve(res);
          } else {
            Toast.info(res.message || '出错了');
            rejects();
          }
        }).catch(err => {
          Toast.info(err.message || err);
          rejects();
        })
      } else {
        if ([2, 4].includes(this.state.mid)) {
          params.status = 1
        }
        getMyStationList(params).then(res => {
          if (res.status === 1) {
            resolve(res);
          } else {
            Toast.info(res.message || '出错了');
            rejects();
          }
        }).catch(err => {
          Toast.info(err.message || err);
          rejects();
        })
      }
    })
  }
  tabClick(tab, index) {
    if (index !== this.state.active) {
      this.setState({
        active: index
      }, () => {
        console.log(this.state.active);
      })
    }
    console.log(this.state.searchValue);
  }
  onChange(val) {
    this.setState({
      searchValue: val.replace(/\s/g, '')
    })
  }
  addStation() {

  }
  listRefresh() {
    this.setState(
      Object.assign({}, this.state.page, { list: [], refreshing: true, isLoading: true, page: 1 }), () => {
        this.getData();
      })
  }
  onEndReached() {
    // 加载中或没有数据了都不再加载
    if (this.state.page.list.length >= this.state.page.total) {
      return
    }
    let _page = this.state.page;
    _page.page++;
    this.setState({
      isLoading: true,
      page: _page,
    }, () => {
      this.getData();
    })
  }
  goToDetail(item) {
    console.log(item);
  }
  render() {
    const row = (rowData, sectionID, rowID) => {
      // 这里rowData,就是上面方法cloneWithRows的数组遍历的单条数据了，直接用就行
      return (
        <div className="like" key={rowID} onClick={this.goToDetail.bind(this, rowData)}>
          <span className="station-name">{rowData['F_Name']}</span>
          <span className="org-name">{rowData['F_CreateOrganizeName']}</span>
        </div>
      )
    }
    return <div className={Unify['list-box']}>
      <NavBar
        mode="light"
        icon={<Icon onClick={() => this.props.history.go(-1)} size="lg" color="#333" type="left" />}
      >{this.state.title}</NavBar>
      <div className={this.state.mid === 4 ? 'content-box have-btn' : 'content-box'}>
        <Tabs tabs={this.state.tabs}
          initialPage={0}
          className="tabs-box"
          onTabClick={this.tabClick.bind(this)}
        ></Tabs>
        <SearchBar placeholder="请输入搜索关键词" value={this.state.searchValue} onChange={this.onChange.bind(this)} />
        {
          <div className={[2, 4].includes(this.state.mid) ? 'scroll-box have-tab' : 'scroll-box'}>
            <ListView
              className="list-scroll"
              dataSource={this.state.dataSource}
              renderFooter={() => (
              <div className="footer">
                {
                  this.state.page.list && !this.state.page.list.length ? (
                    <NotData tips="暂无数据"></NotData>
                  ) : (this.state.page.isLoading ? '加载中...' : '暂无更多数据')
                }
              </div>)}
              renderRow={row}
              useBodyScroll
              pullToRefresh={<PullToRefresh
                refreshing={this.state.page.refreshing}
                onRefresh={this.listRefresh.bind(this)}
              />}
              onEndReachedThreshold={10}
              onEndReached={this.onEndReached}
              pageSize={5}
            />
          </div>
        }
      </div>
      {
        this.state.mid === 4 ? (
          <div className="btn-box">
            <Button className="btn" activeClassName="active-btn" onClick={this.addStation.bind(this)}>新增</Button>
          </div>
        ) : null
      }
    </div>;
  }
}

export default Page;
