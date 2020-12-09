import React, { Component } from "react";
import Unify from "./unify.module.scss";
import {
  SearchBar,
  Tabs,
  NavBar,
  Icon,
  ListView,
  Toast,
  Button,
  PullToRefresh
} from "antd-mobile";
import { getQueryByField } from "@/utils";
import { getMyStationList, getMyCreateRole } from "@/common/api.js";
import NotData from "@/components/NotData/index";

class Page extends Component {
  componentWillMount() {
    console.log("Component WILL MOUNT!");
  }
  componentDidMount() {
    console.log("Component DID MOUNT!");
    this.initData();
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
  }
  constructor() {
    super();
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.state = {
      dataSource,
      title: "待审核、未申请岗位",
      tabs: [],
      active: 0,
      searchValue: "",
      mid: 1,
      page: {
        page: 1,
        pageSize: 15,
        list: [],
        refreshing: false,
        isLoading: true,
        total: 0
      }
    };
  }
  // get 取用户信息
  get _info() {
    return window._storage.read("_userinfo");
  }
  // 初始化
  initData() {
    let t = {
      1: "我的岗位",
      2: "待审核、未申请岗位",
      4: "我创建、管理的岗位"
    };
    let _id = getQueryByField("id") * 1;
    this.setState(
      {
        mid: _id,
        title: t[_id] || "我的岗位",
        tabs: this.setTabsText(_id)
      },
      () => {
        this.getData();
        console.log(this.state.tabs);
      }
    );
  }
  // 根据进入的菜单不同设置tabs的文本
  setTabsText(_id) {
    let arr = [];
    if (_id === 2) {
      arr = ["待审核", "未申请"];
    } else if (_id === 4) {
      arr = ["已完成匹配", "未完成匹配"];
    }
    return arr.map(it => {
      return { title: it };
    });
  }
  // 获取列表数据
  getData() {
    this.funcRequest().then(res => {
      let _list = res.results || [];
      if (this.state.page.page > 1) {
        _list = this.state.page.list.concat(_list);
      }
      let _page = Object.assign({}, this.state.page, {
        list: _list,
        refreshing: false,
        isLoading: false,
        total: res.total || 0
      });
      this.setState({ page: _page }, () => {
        console.log(this.state.page);
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(_list)
      });
    });
  }
  // 封装请求列表数据
  funcRequest() {
    return new Promise((resolve, rejects) => {
      let params = {
        orgId: this._info["OrganizeId"], //组织Id
        uid: this._info["Uid"], //用户Id
        status: -1, // -1:我申请的岗位，0：未申请，1，待审核
        rows: this.state.page.pageSize, //每页条数
        page: this.state.page.page, //页数
        text: this.state.searchValue //岗位搜索
      };
      if (this.state.mid === 4) {
        if ([2, 4].includes(this.state.mid)) {
          params.status = this.state.active ? 0 : 1;
        }
        getMyCreateRole(params)
          .then(res => {
            if (res.status === 1) {
              resolve(res);
            } else {
              Toast.info(res.message || "出错了");
              rejects();
            }
          })
          .catch(err => {
            Toast.info(err.message || err);
            rejects();
          });
      } else {
        if ([2, 4].includes(this.state.mid)) {
          params.status = this.state.active ? 0 : 1;
        }
        getMyStationList(params)
          .then(res => {
            if (res.status === 1) {
              resolve(res);
            } else {
              Toast.info(res.message || "出错了");
              rejects();
            }
          })
          .catch(err => {
            Toast.info(err.message || err);
            rejects();
          });
      }
    });
  }
  // 点击tabs的某一项
  tabClick(tab, index) {
    if (index !== this.state.active) {
      this.setState(
        {
          active: index
        },
        () => {
          this.listRefresh();
        }
      );
    }
  }
  // 搜索框的change事件
  onChange(val) {
    this.setState({
      searchValue: val.replace(/\s/g, "")
    });
  }
  // 搜索框的提交事件
  searchSubmit() {
    this.getData();
  }
  // 搜索框的取消事件
  searchCancel() {
    this.setState(
      {
        searchValue: ""
      },
      () => {
        this.getData();
      }
    );
  }
  // 跳转到新增岗位的页面
  addStation() {
    this.props.history.push("addstation");
  }
  // 列表刷新方法
  listRefresh() {
    this.setState(
      {
        page: Object.assign({}, this.state.page, {
          refreshing: true,
          isLoading: true,
          page: 1
        })
      },
      () => {
        this.getData();
      }
    );
  }
  // 列表页面上拉加载更多
  onEndReached() {
    // 加载中或没有数据了都不再加载
    if (this.state.page.list.length >= this.state.page.total) {
      return;
    }
    let _page = this.state.page;
    _page.page++;
    _page.isLoading = true;
    this.setState(
      {
        page: _page
      },
      () => {
        this.getData();
      }
    );
  }
  // 进入详情页面
  goToDetail(item) {
    console.log(item);
  }
  render() {
    const row = (rowData, sectionID, rowID) => {
      // 这里rowData,就是上面方法cloneWithRows的数组遍历的单条数据了，直接用就行
      return (
        <div
          className="like"
          key={rowID}
          onClick={this.goToDetail.bind(this, rowData)}
        >
          <span className="station-name">{rowData["F_Name"]}</span>
          <span className="org-name">{rowData["F_CreateOrganizeName"]}</span>
        </div>
      );
    };
    return (
      <div className={Unify["list-box"]}>
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
        <div
          className={
            this.state.mid === 4 ? "content-box have-btn" : "content-box"
          }
        >
          {[2, 4].includes(this.state.mid) ? (
            <Tabs
              tabs={this.state.tabs}
              initialPage={0}
              className="tabs-box"
              onTabClick={this.tabClick.bind(this)}
            ></Tabs>
          ) : null}
          <SearchBar
            placeholder="请输入搜索关键词"
            value={this.state.searchValue}
            onCancel={this.searchCancel.bind(this)}
            onSubmit={this.searchSubmit.bind(this)}
            onChange={this.onChange.bind(this)}
          />
          {
            <div
              className={
                [2, 4].includes(this.state.mid)
                  ? "scroll-box have-tab"
                  : "scroll-box"
              }
            >
              <ListView
                className="list-scroll"
                dataSource={this.state.dataSource}
                renderFooter={() => (
                  <div className="footer">
                    {!this.state.page.list.length ? (
                      <NotData tips="暂无数据"></NotData>
                    ) : this.state.page.isLoading ? (
                      "加载中..."
                    ) : (
                      "暂无更多数据"
                    )}
                  </div>
                )}
                renderRow={row}
                pullToRefresh={
                  <PullToRefresh
                    refreshing={this.state.page.refreshing}
                    onRefresh={this.listRefresh.bind(this)}
                  />
                }
                onEndReachedThreshold={10}
                pageSize={this.state.page.pageSize}
                onEndReached={this.onEndReached.bind(this)}
              />
            </div>
          }
        </div>
        {this.state.mid === 4 ? (
          <div className="btn-box">
            <Button
              className="btn"
              activeClassName="active-btn"
              onClick={this.addStation.bind(this)}
            >
              新增
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Page;
