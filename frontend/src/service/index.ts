import Taro from '@tarojs/taro';
import { authStore } from '@/stores/auth';

import interceptors from './interceptors';

const LOCAL_IP = ``;

const MOCK_PORT = { h5: '3000', weapp: '9528' }[process.env.TARO_ENV];

const MOCK_BASE_URL = `/api`;

const getBaseUrl = () => {
  if (process.env.TARO_ENV === 'weapp') {
    const {
      miniProgram: { envVersion },
    } = Taro.getAccountInfoSync();
    switch (envVersion) {
      case 'develop':
        return MOCK_BASE_URL;
      case 'trial':
        return '';
      case 'release':
        return '';
      default:
        return '';
    }
  } else {
    switch (process.env.NODE_ENV) {
      case 'development':
        return MOCK_BASE_URL;
      case 'production':
        return '';
      default:
        return '';
    }
  }
};

export const BASE_URL = getBaseUrl();

interceptors.forEach(i => Taro.addInterceptor(i));

export interface ExtraConfig {
  showLoading?: boolean;
  showStatusBarLoading?: boolean;
  isHasToken?: boolean;
  showErrorToast?: boolean;
}

export type CustomData = { [key: string]: any };
//后台返回的数据格式
export interface CustomResult<D = unknown> {
  data: D;
  statusCode: number;
  message: string;
  [key: string]: any;
}

type OmitMethodCustomOption = Omit<Taro.request.Option<CustomResult, CustomData>, 'method'> & {
  baseUrl?: string;
  extraConfig?: ExtraConfig;
};

export type CustomOption = Omit<OmitMethodCustomOption, 'url'>;

class ApiService {
  static baseOptions<D>(
    { url, data, header, baseUrl, extraConfig, ...otherConfig }: OmitMethodCustomOption,
    method: keyof Taro.request.Method
  ): Promise<D> {
    extraConfig = {
      showLoading: true,
      isHasToken: true,
      showErrorToast: true,
      showStatusBarLoading: false,
      ...(extraConfig ?? {}),
    };
    //将额外配置传递到拦截器中
    data = {
      extraConfig,
      ...(data ?? {}),
    };
    const contentType = ['POST', 'PUT'].includes(method) ? 'application/json' : 'application/x-www-form-urlencoded';

    const option: Taro.request.Option = {
      url: (baseUrl ?? BASE_URL) + url,
      data,
      method,
      header: {
        'content-type': contentType,
        //TODO添加自己的token
        Authorization: extraConfig.isHasToken ? 'Bearer ' + authStore.getState().token : '',
        ...header,
      },
      ...otherConfig,
    };

    return Taro.request<CustomData>(option).then(res => {
      return res as any;
    });
  }

  private static getMethod = (method: keyof Taro.request.Method) => {
    const apiMethod = <D>(url: string, option?: CustomOption): Promise<D> => {
      // 这里跟 baseOptions 保持一致
      return this.baseOptions<D>({ url, ...option }, method);
    };
    return apiMethod;
  };

  static uploadFile<D>(
    url: string,
    filePath: string,
    name = 'file',
    options?: {
      baseUrl?: string;
      formData?: Record<string, any>;
      extraConfig?: ExtraConfig;
      headers?: Record<string, string>;
    }
  ): Promise<D> {
    const { baseUrl = BASE_URL, formData = {}, extraConfig = {
      isHasToken: true
    }, headers = {} } = options ?? {};

    const isAbsoluteUrl = /^https?:\/\//i.test(url);
    const fullUrl = isAbsoluteUrl ? url : baseUrl + url;

    const uploadHeaders = {
      Authorization: extraConfig.isHasToken ? 'Bearer ' + authStore.getState().token : '',
      ...headers,
    };

    return new Promise((resolve, reject) => {
      if (extraConfig?.showLoading) {
        Taro.showLoading({ title: '上传中...' });
      }

      console.log('上传地址:', uploadHeaders, fullUrl);

      Taro.uploadFile({
        url: baseUrl + url,
        filePath,
        name,
        formData,
        header: uploadHeaders,
        success: res => {
          try {
            const data = JSON.parse(res.data);
            resolve(data);
          } catch (err) {
            console.error('JSON parse error:', err);
            reject({
              message: '上传成功但返回数据不是有效 JSON',
              rawResponse: res.data,
              error: err,
            });
          }
        },
        fail: err => {
          if (extraConfig?.showErrorToast) {
            Taro.showToast({ title: '上传失败', icon: 'error' });
          }
          reject({
            message: '文件上传失败',
            error: err,
          });
        },
        complete: () => {
          if (extraConfig?.showLoading) {
            Taro.hideLoading();
          }
        },
      });
    });
  }

  static get = this.getMethod('GET');
  static post = this.getMethod('POST');
  static put = this.getMethod('PUT');
  static delete = this.getMethod('DELETE');
}

export default ApiService;
