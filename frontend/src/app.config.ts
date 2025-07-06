export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/mine/index',
    'pages/record/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },tabBar: {
    color: '#888',
    selectedColor: '#0088ff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/record/index',
        text: '历史',
        iconPath: 'assets/icons/record.png',
        selectedIconPath: 'assets/icons/record-active.png'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/icons/mine.png',
        selectedIconPath: 'assets/icons/mine-active.png'
      }
    ]
  }
})
