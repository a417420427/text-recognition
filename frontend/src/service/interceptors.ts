import Taro, { Chain } from '@tarojs/taro';

import { ExtraConfig } from '.';

export enum HTTP_STATUS {
  SUCCESS = 200,
  CREATED = 201,
  ACCEPTED = 202,
  CLIENT_ERROR = 400,
  AUTHENTICATE = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

const defaultErrorMessage = {
  [HTTP_STATUS.NOT_FOUND]: '请求的资源不存在',
  [HTTP_STATUS.BAD_GATEWAY]: '服务端出现了问题',
  [HTTP_STATUS.SERVER_ERROR]: '后端出现了问题',
  [HTTP_STATUS.FORBIDDEN]: '没有权限访问',
  [HTTP_STATUS.AUTHENTICATE]: '需要鉴权',
};

function showError(show, res?: any) {
  show &&
    Taro.showToast({
      title: res.data?.message || defaultErrorMessage[res.statusCode] || '请求异常',
      icon: 'none',
    });
}

const customInterceptor = function (chain: Chain) {
  let requestParams = chain.requestParams;
  //剔除掉额外配置参数
  const {
    data: { extraConfig, ...realRequestParams },
  } = requestParams;
  const { showErrorToast } = extraConfig as ExtraConfig;
  requestParams.data = realRequestParams;

  return chain.proceed(requestParams).then(res => {
    if (res.statusCode === HTTP_STATUS.AUTHENTICATE) {
      // 可选：弹个提示
      Taro.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500,
      });

      console.log('登录失效，即将去往登录页....');
      // 延迟 1.5 秒再跳转
      setTimeout(() => {
        Taro.reLaunch({
          url: '/pages/login/index', // 根据你的首页路径改
        });
      }, 1500);

      // 返回一个拒绝的 promise，阻止后续逻辑执行
      return Promise.reject(res.data ?? res);
    }

    // 只要请求成功，不管返回什么状态码，都走这个回调
    if (res.statusCode >= 400) {
      showError(showErrorToast, res);
      return res;
    } else {
      /**
         * res原始数据格式
          ---------
          开发者服务器返回的数据
          data: T
          开发者服务器返回的 HTTP Response Header
          header: TaroGeneral.IAnyObject
          开发者服务器返回的 HTTP 状态码
          statusCode: number
          调用结果
          errMsg: string
          cookies
          cookies?: string[]
         */
      return res;
    }
  });
};

const loadingInterceptor = async (chain: Chain) => {
  const { data } = chain.requestParams;
  const { showErrorToast, showLoading, showStatusBarLoading } = data.extraConfig as ExtraConfig;
  try {
    if (showStatusBarLoading) {
      Taro.showNavigationBarLoading();
    } else if (showLoading) {
      Taro.showLoading({
        title: '请稍候...',
        mask: true,
      });
    }
    const res = await chain.proceed(chain.requestParams);
    if (showStatusBarLoading) {
      Taro.hideNavigationBarLoading();
    } else if (showLoading) {
      Taro.hideLoading();
    }
    return res;
  } catch (error: any) {
    // 这个catch需要放到前面才能捕获request本身的错误，因为showError返回的也是Promise.reject
    console.error(error);
    return showError(error.errMsg, showErrorToast);
  }
};

const interceptors = [loadingInterceptor, customInterceptor];

export default interceptors;
