/* eslint-disable jsx-quotes */
import React, { useState } from 'react';
import { View, Image, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { camera, pictures } from '@/assets/icons';
import background from '@/assets/background.jpg';

import './index.scss';
import { baseRecognize } from '@/service/apis/recognize';

const Index: React.FC = () => {
  const [ocrResult, setOcrResult] = useState<string>('');

  // 上传图片到后端OCR接口
  const uploadImage = async (filePath: string) => {
    try {
      const uploadRes = await baseRecognize(filePath);
      console.log(uploadRes, 'rrr')
      Taro.navigateTo({
        url: 'pages/record/index?id=' + uploadRes.id,
      });
    } catch (error) {
      Taro.showToast({ title: '上传失败', icon: 'error' });
      console.error(error);
    }
  };

  // 拍照识别
  const handleCamera = () => {
    Taro.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        uploadImage(tempFilePath);
      },
    });
  };

  // 传图识别（相册选图）
  const handleAlbum = () => {
    Taro.chooseImage({
      count: 1,
      sourceType: ['album'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        uploadImage(tempFilePath);
      },
    });
  };

  return (
    <View className="page">
      {/* 背景图区域 */}
      <View className="top-section">
        <Image
          className="background-image"
          src={background}
          mode="aspectFill"
        />
      </View>

      {/* 功能区域 */}
      <View className="bottom-section">
        {/* 第一行：两个大按钮带图标 */}
        <View className="row">
          <View className="icon-button" onClick={handleCamera}>
            <Image className="icon" src={camera} />
            <Text className="text">拍照识别</Text>
          </View>
          <View className="icon-button" onClick={handleAlbum}>
            <Image className="icon" src={pictures} />
            <Text className="text">传图识别</Text>
          </View>
        </View>

        {/* 第二行：两个纯文字按钮 */}
        <View className="row">
          <View className="text-button">
            <Text className="text">批量上传</Text>
          </View>
          <View className="text-button">
            <Text className="text">图片翻译</Text>
          </View>
        </View>

        {/* 第三行：两个纯文字按钮 */}
        <View className="row">
          <View className="text-button">
            <Text className="text">手写文字识别</Text>
          </View>
          <View className="text-button">
            <Text className="text">表格/发票/营业执照识别</Text>
          </View>
        </View>

        {/* 显示识别结果 */}
        {ocrResult && (
          <View className="ocr-result">
            <Text className="result-title">识别结果：</Text>
            <Text className="result-text">{ocrResult}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Index;
