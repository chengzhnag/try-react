import request from '@/utils/request.js';
import qs from 'qs';

export const getData = query => {
	console.log(query);
	return request({
		url: '/api',
		method: 'get',
		params: query
	});
};

export const register = data => {
	return request({
		url: '/api/register',
		method: 'post',
		data
	});
};

// 封装一层统一设置请求域名
const baseRequest = (params = {}) => {
  if (params.method === 'post' && params.isFormData) {
    params.data = qs.stringify(params.data);
  }
  return request(
    Object.assign(
      {
        baseURL: 'http://sso3.dledc.com'
      },
      params
    )
  );
};
/* 
  新增岗位
  params: {
    OrgId,     string36创建机构Id
    Name,      string36岗位名称
    Quanity,   int3每个组织可申请人数  
    PublishingType,  Int2  0:初始值1,本单位及所管辖组织  2，全市
    Remark,   String200岗位说明
    Uid,     String36用户Id
    F_Id     String36岗位Id
  }
*/
export const createStation = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/Create",
    method: "post",
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    isFormData: true
  });
};

/* 
  查看岗位学校查看
  params: {
    orgId   string36所属组织ID
    id   string36岗位Id
    uid   String36登录用户ID
  }
*/
export const getDetailById = query => {
  return baseRequest({
    url: "/api/verticalrole/roles/DetailById",
    method: "get",
    params: query
  });
};

/* 
  查看已匹配岗位组织用户
  根据上级组织ID及岗位Id,查看已匹配岗位组织用户
  params: {
    orgId   string36创建机构Id
    id   string36岗位Id
    rows   Int每页行数
    page   Int页数
    text   人名搜索
  }
*/
export const getMatchOrgUser = query => {
  return baseRequest({
    url: "/api/verticalrole/roles/GetMatchOrgUser",
    method: "get",
    params: query
  });
};

/* 
  删除岗位
  params: {
    orgId   string36创建机构Id
    id   string36岗位Id
    uid   string36用户Id
  }
*/
export const deleteStation = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/RemoveRole",
    method: "get",
    params: params
  });
};
export const getUsersByOrgId = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/GetUsersByOrgId",
    method: "get",
    params: params
  });
};

/* 
  待审核岗位列表
  如果机构管理员，根据创建机构Id及他上级机构创建并发布范围全市的申请列表
  如果是学校的管理员，可以根据本学校Id去查询待审核的岗位列表
  params: {
    orgId      string36创建机构Id
    rows       int每页10条
    page       Int页码
    text       String30搜索条件（电话，人名，组织名称）
  }
*/
export const unApprovedList = query => {
  return baseRequest({
    url: "/api/verticalrole/roles/UnApprovedList",
    method: "get",
    params: query
  });
};


/* 
  岗位类别列表（组织或者机构人员）
  params: {
    orgId   string36创建机构Id（本校ID）
    id      String36创建岗位Id
  }
*/
export const getDetailByGroup = query => {
  return baseRequest({
    url: "/api/verticalrole/roles/DetailByGroup",
    method: "get",
    params: query
  });
};


/* 
  我创建的岗位列表
  params: {
    uid       string36创建用户Id
    orgId     string36组织Id
    text      String36搜索框
    status    Int默认为0，未匹配完成，1，已完成匹配，
    rows      int每页条数
    page      Int页数
  }
*/
export const getMyCreateRole = query => {
  return baseRequest({
    url: "/api/verticalrole/roles/GetMyCreateRole",
    method: "get",
    params: query
  });
};

/* 
  审核岗位[批量]
  params: {
    F_OrganizeId     string36创建机构Id（本校ID）
    F_VerticalId     string36岗位Id
    F_Uid            string36用户人员Id
    F_Remark         String200审核拒绝备注
  }
*/
export const batchAuditStation = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/BatchApprovedVertical",
    method: "post",
    data: params
  });
};


/* 
  申请岗位人员移除
  params: {
    id       string36岗位Id
    uid      string36被删除用户人员Id
    orgId    String36所在的组织ID
  }
*/
export const removeStationUser = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/RemoveUser",
    method: "get",
    params: params
  });
};


/* 
  确认移交管理员
  params: {
    orgId        string36组织Id
    id           string36岗位Id
    uid          String36用户Id
    userId       String36更换人员ID
  }
*/
export const transferStationAdmin = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/ResettingRole",
    method: "get",
    params: params
  });
};


export const settingRoleUser = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/SettingRoleUse",
    method: "post",
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    isFormData: true
  });
};


/* 
  我的申请，待审核，未申请的岗位列表
  params: {
    orgId     string36组织Id
    uid       String36用户Id
    status    Int36 -1:我申请的岗位，0：未申请，1，待审核
    rows      Int每页条数
    page      Int页数
    text      String36岗位搜索
  }
*/
export const getMyStationList = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/GetMyRoles",
    method: "get",
    params: params
  });
};
export const getUnMatchOrgByParent = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/GetUnMatchOrgByParent",
    method: "get",
    params: params
  });
};
export const getMatchOrg = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/GetMatchOrg",
    method: "get",
    params: params
  });
};
export const getUnMatchOrg = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/GetUnMatchOrg",
    method: "get",
    params: params
  });
};
export const checkOrgIsGroup = params => {
  return baseRequest({
    url: "/api/verticalrole/roles/CheckOrgIsGroup",
    method: "get",
    params: params
  });
};

