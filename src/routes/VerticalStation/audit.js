import React, { Component } from "react";
import Unify from "./unify.module.scss";
import {
  NavBar,
  Icon,
  SearchBar,
  Toast,
  ListView,
  PullToRefresh,
  Checkbox,
  List,
  Modal
} from "antd-mobile";
import { unApprovedList, batchAuditStation } from "@/common/api.js";
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
    if (this.state.backTimer) {
      clearTimeout(this.state.backTimer);
    }
  }
  constructor() {
    super();
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
    this.state = {
      dataSource,
      title: "审核",
      searchValue: "",
      page: {
        page: 1,
        pageSize: 15,
        list: [],
        refreshing: false,
        isLoading: true,
        total: 0
      },
      isAllChecked: false,
      backTimer: null,
      refuseResult: ""
    };
  }
  // get 取用户信息
  get _info() {
    return window._storage.read("_userinfo");
  }
  // 初始化数据
  initData() {
    this.getData();
  }
  // 获取审核列表数据
  getData() {
    let params = {
      orgId: this._info["OrganizeId"], //创建机构Id
      uid: this._info["Uid"],
      rows: this.state.page.pageSize, //每页10条
      page: this.state.page.page, //页码
      text: this.state.searchValue //搜索条件（电话，人名，组织名称）
    };
    unApprovedList(params)
      .then(res => {
        if (res.status === 1) {
          let _list = (res.results || []).map(it => {
            it["checked"] = false;
            return it;
          });
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
        } else {
          Toast.info(res.message || "出错了");
        }
      })
      .catch(err => {
        Toast.info(err.message || err);
      });
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
  // 列表刷新
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
  // 列表上拉加载更多
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
  // 多选框的change事件
  checkboxChange(val, index) {
    let _list = [...this.state.page.list];
    val["checked"] = !val["checked"];
    _list.splice(index * 1, 1, val);
    let _count = 0;
    _list.forEach(it => {
      if (it["checked"]) _count++;
    });
    this.setState({
      page: Object.assign({}, this.state.page, { list: _list }),
      isAllChecked: _count === this.state.page.list.length
    });
  }
  // 全选框的change事件
  allSelectChange() {
    this.setState(
      {
        isAllChecked: !this.state.isAllChecked
      },
      () => {
        let _list = [...this.state.page.list];
        _list.forEach(it => (it["checked"] = this.state.isAllChecked));
        this.setState({
          page: Object.assign({}, this.state.page, { list: _list })
        });
      }
    );
  }
  // 操作 拒绝 同意
  operation(type) {
    console.log(type);
    let _length = this.state.page.list.filter(it => it["checked"]).length;
    if (!_length) {
      Toast.info("请先选择待审核人员!");
      return;
    }
    const prompt = Modal.prompt;
    switch (type) {
      case 1:
        prompt(
          "是否确认拒绝?",
          "填写拒绝原因：",
          [
            {
              text: "取消"
            },
            {
              text: "确认",
              onPress: value => {
                this.setState(
                  {
                    refuseResult: value
                  },
                  () => {
                    this.funcOperation(3);
                  }
                );
              }
            }
          ],
          "default",
          null,
          ["请输入拒绝原因（选填）"]
        );
        break;
      case 2:
        this.funcOperation(2);
        break;
      default:
        break;
    }
  }
  // 统一封装的操作方法 2 审核通过 3 审核拒绝
  funcOperation(type) {
    let _list = this.state.page.list.filter(it => it["checked"]);
    let _data = _list.map(it => {
      return {
        OrgId: it["F_OrganizeId"], //string36创建岗位机构Id（本校ID）
        Id: it["F_VerticalRoleId"], //string36岗位Id
        UserId: it["F_Uid"], //string36申请岗位用户Id
        Uid: this._info["Uid"], //string36审核人用户ID
        Status: type, //Int2:审核通过，3，审核拒绝
        Remark: type === 3 ? this.state.refuseResult : ""
      };
    });
    batchAuditStation(_data)
      .then(res => {
        if (res.status === 1) {
          Toast.info(`审核${type === 2 ? "通过" : "拒绝"}成功!`);
          let _timer = setTimeout(() => {
            this.getData();
          }, 800);
          this.setState({
            backTimer: _timer,
            isAllChecked: false,
            page: Object.assign({}, this.state.page, { page: 1 })
          });
        } else {
          Toast.info(res.message || "出错了");
        }
      })
      .catch(err => {
        Toast.info(err.message || err);
      });
  }
  render() {
    const CheckboxItem = Checkbox.CheckboxItem;
    const row = (rowData, sectionID, rowID) => {
      // 这里rowData,就是上面方法cloneWithRows的数组遍历的单条数据了，直接用就行
      return (
        <CheckboxItem
          key={rowID}
          checked={rowData.checked}
          onChange={() => this.checkboxChange(rowData, rowID)}
        >
          <div className="like">
            <span>申请岗位：{rowData["F_Name"]}</span>
            <span>创建组织：{rowData["F_CreateOrganizeName"]}</span>
            <span>申请单位：{rowData["F_OrganizeName"]}</span>
            <span>{`申 请 人  ：${rowData["F_RealName"]}`}</span>
            <span>手机号码：{rowData["F_MobilePhone"] || "无"}</span>
          </div>
        </CheckboxItem>
      );
    };
    return (
      <div className={Unify["audit-box"]}>
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
          <SearchBar
            placeholder="请输入搜索关键词"
            value={this.state.searchValue}
            onCancel={this.searchCancel.bind(this)}
            onSubmit={this.searchSubmit.bind(this)}
            onChange={this.onChange.bind(this)}
          />
          <List>
            <CheckboxItem
              checked={this.state.isAllChecked}
              onChange={this.allSelectChange.bind(this)}
            >
              全选{" "}
              <span style={{ fontSize: "13px", color: "#999" }}>
                全选只能选中已显示的内容
              </span>
            </CheckboxItem>
          </List>
          <div className="scroll-box">
            <ListView
              className="list-scroll"
              dataSource={this.state.dataSource}
              renderFooter={() => (
                <div className="footer">
                  {!this.state.page.list.length ? (
                    <NotData tips="暂无审核数据"></NotData>
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
        </div>
        <div className="bottom-btn-box">
          <span className="refuse" onClick={this.operation.bind(this, 1)}>
            批量拒绝
          </span>
          <span className="pass" onClick={this.operation.bind(this, 2)}>
            批量通过
          </span>
        </div>
      </div>
    );
  }
}

export default Page;
