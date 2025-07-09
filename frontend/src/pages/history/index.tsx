// src/pages/record/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Image, Text, ScrollView } from '@tarojs/components';

import { getRecordsList, UploadRecord } from '@/service/apis/recognize';
import dayjs from 'dayjs';
import './index.scss';
import Taro from '@tarojs/taro';

const RecordPage: React.FC = () => {
  const [records, setRecords] = useState<UploadRecord[]>([]);

  useEffect(() => {
    getRecordsList().then((r) => {
      console.log(r);
      setRecords(r.data.data);
    });
  }, []);

  const onViewRecord = (record: UploadRecord) => {
    if(!record.id) {
      return
    }
    Taro.navigateTo({
      url: `/pages/record/index?id=${record.id}`,
    });
  };
  return (
    <ScrollView className="record-page" scrollY>
      {records.map((item) => (
        <View
          onClick={() => onViewRecord(item)}
          className="record-card"
          key={item.id}
        >
          <Image className="thumb" src={item.imageUrl} mode="aspectFill" />
          <View className="info">
            <Text className="time">
              上传时间：{dayjs(item.uploadTime).format('YYYY-MM-DD HH:mm')}
            </Text>
            <Text className="time">
              上次修改：{dayjs(item.lastModified).format('YYYY-MM-DD HH:mm')}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default RecordPage;
