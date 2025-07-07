import React, { useState } from 'react';
import { View, Input, Button, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import ApiService from '@/service';
import './index.scss';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !phone || !password) {
      Taro.showToast({ title: '请输入用户名、手机号和密码', icon: 'none' });
      return;
    }

    setLoading(true);

    try {
      const res = await ApiService.post<{
        statusCode: number;
        message: string;
      }>('/auth/register', {
        data: { username, phone, password },
      });

      if (res.statusCode === 200) {
        Taro.showToast({ title: '注册成功，请登录', icon: 'success' });
        Taro.redirectTo({ url: '/pages/login/index' });
      } else {
        Taro.showToast({ title: res.message || '注册失败', icon: 'error' });
      }
    } catch (error) {
      Taro.showToast({ title: '网络错误', icon: 'error' });
      console.error('注册错误', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="register-page">
      <Text className="title">用户注册</Text>

      <Input
        className="input"
        placeholder="请输入用户名"
        value={username}
        onInput={(e) => setUsername(e.detail.value)}
      />

      <Input
        className="input"
        placeholder="请输入手机号"
        type="number"
        value={phone}
        onInput={(e) => setPhone(e.detail.value)}
      />

      <Input
        className="input"
        placeholder="请输入密码"
        password
        value={password}
        onInput={(e) => setPassword(e.detail.value)}
      />

      <Button className="register-button" loading={loading} onClick={handleRegister}>
        注册
      </Button>
    </View>
  );
};

export default Register;
