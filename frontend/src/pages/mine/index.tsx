import React from 'react'
import { View, Text, Image, Navigator } from '@tarojs/components'
import './index.scss'

const MinePage: React.FC = () => {
  return (
    <View className='mine-page'>
      {/* 顶部用户信息 */}
      <View className='user-info'>
        <Image
          className='avatar'
          src='https://your-avatar-url.com/avatar.png'
          mode='aspectFill'
        />
        <Text className='nickname'>未登录用户</Text>
      </View>

      {/* 菜单项列表 */}
      <View className='menu-list'>
        <Navigator url='/pages/record/index' className='menu-item'>
          <Text className='label'>识别记录</Text>
        </Navigator>
        <View className='menu-item'>
          <Text className='label'>在线客服</Text>
        </View>
        <View className='menu-item'>
          <Text className='label'>意见反馈</Text>
        </View>
        <View className='menu-item'>
          <Text className='label'>好用分享</Text>
        </View>
        <View className='menu-item'>
          <Text className='label'>设置中心</Text>
        </View>
      </View>
    </View>
  )
}

export default MinePage
