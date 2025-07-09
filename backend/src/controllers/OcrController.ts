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
// import { imageSize } from "image-size";
import { UploadRecord } from "../entities/UploadRecord";

import { AppDataSource } from "../data-source";
import { TencentCosFileService } from "../services/TencentCosFileService";

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
  public async recognize(@Request() req: any): Promise<UploadRecord> {
    if (!req.file) {
      this.setStatus(400);
      throw new Error("没有上传图片");
    }

    const file = req.file;
    const imagePath: string = file.path;

    try {
      const buffer = fs.readFileSync(imagePath);
      const base64 = buffer.toString("base64");

      const params = {
        ImageBase64: base64,
      };

      const user = req.user;

      const data = await this.client.GeneralBasicOCR(params);

      console.log(file, 'fffffffffff')
      file.buffer = buffer
      const fileService = new TencentCosFileService();
      const uploaded = await fileService.saveUploadedFile(file, req.user.id);
      
      const record = this.uploadRepo.create({
        user,
        imageUrl: uploaded.url, // 或者 file.filename / public URL
        type: "GENERAL_BASIC_OCR",
        resultText:
          data.TextDetections?.map((d: any) => d.DetectedText).join("\n") || "",
      });

      await this.uploadRepo.save(record);

      return record;
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
