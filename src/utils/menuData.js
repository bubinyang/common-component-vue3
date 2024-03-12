const menuList = [
  {
    name: "基础设置",
    url: "one",
    // meta:{label:'jcsz'},
    children: [
      {
        name: "首页",
        url: "/"
      },

      {
        name: "产品列表",
        url: "/productList/index"
      },
      {
        name: "程序选择",
        url: "/programSelection/index"
      },
      {
        name: "测量记录",
        url: ""
      },
      {
        name: "校准测头",
        url: ""
      },
      {
        name: "公差调整",
        url: ""
      }
    ]
  },

  {
    name: "系统管理",
    url: "two",
    children: [
      {
        name: "用户管理",
        url: "/system/mangerUser/index"
      },
      {
        name: "角色管理",
        url: "/system/mangerRole/index"
      },
      {
        name: "密码修改",
        url: "/system/editPassword/index"
      }
    ]
  }

  // {
  //   name: "大屏看板类demo",
  //   url: "one",
  //   children: [
  //     {
  //       name: "大屏看板",
  //       url: "/largeScreen/index"
  //     }
  //   ]
  // },

  // {
  //   name: "ElTable自定义样式",
  //   url: "/elTableCostomStyle/index"
  // },

  // {
  //   name: "增删改查系列",
  //   url: "/crudDemo/index"
  // },
  // {
  //   name: "elementui的Table合并展示",
  //   url: "/elTableMerge/index"
  // }
];
export { menuList };
