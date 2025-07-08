/* eslint-disable jsx-quotes */
import React, { useEffect, useState } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import './index.scss';
import { getRecordById, saveRecord } from '@/service/apis/recognize';

const DetailPage: React.FC = () => {
  const [ocrText, setOcrText] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showImage, setShowImage] = useState<boolean>(false);

  const router = useRouter();

  console.log(router.params);

  const handleCopy = () => Taro.setClipboardData({ data: ocrText });
  const handleExport = () =>
    Taro.showToast({ title: '导出未实现', icon: 'none' });
  const handleShare = () => Taro.showShareMenu({});
  const handleTranslate = () =>
    Taro.showToast({ title: '翻译未实现', icon: 'none' });

  const handleSave = () => {
    saveRecord(Number(router.params?.id)!, ocrText).then((res) => {
      console.log(res)
    })
  }
  useEffect(() => {
    getRecordById(router.params?.id || '').then((res) => {
      setImageUrl(res.data.imageUrl);
      setOcrText(res.data.resultText); // 清洗换行符
    });
  }, []);
  return (
    <View className="page">
      {/* 背景图片区域 */}
      <Image className="bg-image" src={imageUrl} mode="aspectFill" />

      {/* 查看大图按钮 */}
      <View className="view-full-btn" onClick={() => setShowImage(true)}>
        <Text>查看大图</Text>
      </View>

      {/* 内容区域 */}
      <View className="content">
        <View className="editor">
          <textarea
            className="textarea"
            value={ocrText}
            onInput={(e) => setOcrText(e.target['value'])}
            placeholder="识别内容为空"
          />
        </View>

        {/* 底部操作栏 */}
        <View className="actions">
          <View className="btn" onClick={handleShare}>
            分享
          </View>
          <View className="btn" onClick={handleExport}>
            导出
          </View>
          <View className="btn" onClick={handleCopy}>
            复制
          </View>
          <View className="btn" onClick={handleTranslate}>
            翻译
          </View>
          <View className="btn" onClick={handleSave}>
            保存
          </View>
        </View>
      </View>

      {/* 查看大图弹窗 */}
      {showImage && (
        <View className="image-modal" onClick={() => setShowImage(false)}>
          <Image className="full-image" src={imageUrl} mode="widthFix" />
        </View>
      )}
    </View>
  );
};

export default DetailPage;
