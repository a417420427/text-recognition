import { Controller, Post, Route, Tags, Request, Response, UploadedFile } from 'tsoa'
import dotenv from 'dotenv'
import fs from 'fs'

import * as TCloud from 'tencentcloud-sdk-nodejs-ocr'
import { imageSize } from 'image-size'

// 读取 .env
const config = dotenv.config().parsed || {}
console.log(TCloud)
const OcrClient = TCloud.ocr.v20181119.Client

@Route('ocr')
@Tags('OCR')
export class OcrController extends Controller {
  private client = new OcrClient({
    credential: {
      secretId: config.TENCENT_SECRET_ID || '',
      secretKey: config.TENCENT_SECRET_KEY || '',
      // @ts-ignore
      signMethod: 'TC3-HMAC-SHA256',
    },
    region: 'ap-guangzhou',
    profile: {
      httpProfile: {
        endpoint: 'ocr.tencentcloudapi.com',
      },
    },
  })

  /**
   * 文字识别接口，接收单张图片Base64编码，返回识别结果
   */
  @Post('recognize')
  public async recognize(
    @Request() req: any
  ): Promise<{ textDetections: any[]; imageSize: { width: number; height: number } }> {
    if (!req.file) {
      this.setStatus(400)
      throw new Error('没有上传图片')
    }

    const imagePath: string = req.file.path

    try {
      const buffer = fs.readFileSync(imagePath)
      const base64 = buffer.toString('base64')
      const { width, height } = imageSize(buffer)

      const params = {
        ImageBase64: base64,
      }

      const data = await this.client.GeneralBasicOCR(params)

      return {
        textDetections: data.TextDetections!,
        imageSize: { width, height },
      }
    } catch (error) {
      this.setStatus(500)
      throw new Error('OCR识别失败')
    } finally {
      // 删除临时文件
      fs.unlink(imagePath, (err) => {
        if (err) console.error('删除文件失败:', err)
      })
    }
  }
}
