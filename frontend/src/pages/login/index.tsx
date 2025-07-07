import React, { useState } from 'react';
import { View, Input, Button, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';
import ApiService from '@/service';
import { authStore } from '@/stores/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Taro.showToast({ title: '请输入用户名和密码', icon: 'none' });
      return;
    }

    setLoading(true);

    try {
      ApiService.post<{
        statusCode: number;
        data: { token: string; userId: string; username: string };
      }>('/auth/login-by-password', {
        data: {
          username: username + '',
          password: password,
          phone: username
        },
      })
        .then((res) => {
          if (res.statusCode === 200) {
            Taro.showToast({ title: '登录成功', icon: 'success' });
            Taro.redirectTo({
              url: '/pages/index/index',
            });
          }
          authStore.setState((state) => {
            state.token = res.data.token ?? '';
            state.userId = res.data.userId ?? '';
            state.username = res.data.username ?? '';
            return state;
          });
        })
        .catch((err) => {
          console.log(err, '登录错误');
        });
    } catch (error) {
      Taro.showToast({ title: '网络错误', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    Taro.navigateTo({
      url: '/pages/register/index',
    });
  }

  return (
    <View className="login-page">
      <Text className="title">用户登录</Text>

      <Input
        className="input"
        placeholder="请输入用户名"
        value={username}
        onInput={(e) => setUsername(e.detail.value)}
      />

      <Input
        className="input"
        placeholder="请输入密码"
        password
        value={password}
        onInput={(e) => setPassword(e.detail.value)}
      />

      <Button className="login-button" loading={loading} onClick={handleLogin}>
        登录
      </Button>
      <Button className="login-button" loading={loading} onClick={handleRegister}>
        注册
      </Button>
    </View>
  );
};

export default Login;
