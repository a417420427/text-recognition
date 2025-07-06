import TCloud from "tencentcloud-sdk-nodejs-ocr";
import { imageSize } from "image-size";
import fs from "fs";

const OcrClient = TCloud.ocr.v20181119.Client;

export class OcrService {
  private client;

  constructor(secretId: string, secretKey: string) {
    this.client = new OcrClient({
      credential: {
        secretId,
        secretKey,
      },
      region: "ap-guangzhou",
      profile: {
        httpProfile: {
          endpoint: "ocr.tencentcloudapi.com",
        },
      },
    });
  }

  async recognizeText(imagePath: string) {
    // 读取图片 buffer 和 base64
    const buffer = fs.readFileSync(imagePath);
    const base64 = buffer.toString("base64");

    // 获取图片尺寸
    const { width, height } = imageSize(buffer);

    const params = {
      ImageBase64: base64,
    };

    // 调用腾讯云 OCR 接口
    const data = await this.client.GeneralBasicOCR(params);

    // 返回结果，含文字数组和图片尺寸
    return {
      textDetections: data.TextDetections,
      imageSize: { width, height },
    };
  }
}
