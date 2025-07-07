import {
  Controller,
  Post,
  Route,
  Tags,
  Request,
  Response,
  UploadedFile,
  FormField,
  Body,
} from "tsoa";
import dotenv from "dotenv";
import fs from "fs";

import * as TCloud from "tencentcloud-sdk-nodejs-ocr";
import { imageSize } from "image-size";
import { UploadRecord } from "../entities/UploadRecord";
import {  Repository } from "typeorm";
import { AppDataSource } from "../data-source";

// 读取 .env
const config = dotenv.config().parsed || {};

const OcrClient = TCloud.ocr.v20181119.Client;

@Route("ocr")
@Tags("OCR")
export class OcrController extends Controller {

  private uploadRepo = AppDataSource.getRepository(UploadRecord);
  private client = new OcrClient({
    credential: {
      secretId: config.TENCENT_SECRET_ID || "",
      secretKey: config.TENCENT_SECRET_KEY || "",
      // @ts-ignore
      signMethod: "TC3-HMAC-SHA256",
    },
    region: "ap-guangzhou",
    profile: {
      httpProfile: {
        endpoint: "ocr.tencentcloudapi.com",
      },
    },
  });

  /**
   * 文字识别接口，接收单张图片Base64编码，返回识别结果
   */
  @Post("recognize")
  public async recognize(@Request() req: any): Promise<{
    textDetections: any[];
    imageSize: { width: number; height: number };
    url: string;
  }> {
    if (!req.file) {
      this.setStatus(400);
      throw new Error("没有上传图片");
    }

    const file = req.file;
    const imagePath: string = file.path;

    try {
      const buffer = fs.readFileSync(imagePath);
      const base64 = buffer.toString("base64");
      const { width, height } = imageSize(buffer);

      const params = {
        ImageBase64: base64,
      };

      console.log(params, file);

      
      const data = await this.client.GeneralBasicOCR(params);
     
      const user = req.user
       const record = this.uploadRepo.create({
      user,
      imageUrl: file.path, // 或者 file.filename / public URL
      type: "GENERAL_BASIC_OCR",
      resultText: data.TextDetections?.map((d: any) => d.DetectedText).join("\n") || "",
    });

    await this.uploadRepo.save(record);

      return {
        textDetections: data.TextDetections!,
        imageSize: { width, height },
        url: params.ImageBase64,
      };
    } catch (error: any) {
      this.setStatus(500);

      throw new Error(error.message);
    } finally {
      // 删除临时文件
      // fs.unlink(imagePath, (err) => {
      //   if (err) console.error("删除文件失败:", err);
      // });
    }
  }
}
