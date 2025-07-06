// src/pages/record/index.tsx
import React, { useState } from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import './index.scss'

interface RecordItem {
  id: string
  thumbnail: string
  uploadTime: string
  lastModified: string
}

const RecordPage: React.FC = () => {
  const [records, setRecords] = useState<RecordItem[]>([
    {
      id: '1',
      thumbnail: 'https://your-image-url.com/thumb1.jpg',
      uploadTime: '2025-07-05 14:23',
      lastModified: '2025-07-05 15:02',
    },
    {
      id: '2',
      thumbnail: 'https://your-image-url.com/thumb2.jpg',
      uploadTime: '2025-07-04 10:12',
      lastModified: '2025-07-04 11:00',
    },
    // 更多数据...
  ])

  return (
    <ScrollView className='record-page' scrollY>
      {records.map((item) => (
        <View className='record-card' key={item.id}>
          <Image className='thumb' src={item.thumbnail} mode='aspectFill' />
          <View className='info'>
            <Text className='time'>上传时间：{item.uploadTime}</Text>
            <Text className='time'>上次修改：{item.lastModified}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

export default RecordPage
