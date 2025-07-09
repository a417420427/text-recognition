import COS from "cos-nodejs-sdk-v5";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

const config = dotenv.config().parsed || {};

const cos = new COS({
  SecretId: config.TENCENT_SECRET_ID!,
  SecretKey: config.TENCENT_SECRET_KEY!,
});

const Bucket = config.TENCENT_COS_BUCKET!;
const Region = config.TENCENT_COS_REGION!;

export class TencentCosFileService {
  async saveUploadedFile(file: Express.Multer.File, userId: string): Promise<{
    url: string;
    key: string;
    filename: string;
    size: number;
    mimetype: string;
  }> {
    const ext = path.extname(file.originalname);
    const filename = `${userId}/${Date.now()}-${uuidv4()}${ext}`;
    const key = `uploads/${filename}`;

    console.log({
      Bucket,
      Region,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
    await cos.putObject({
      Bucket,
      Region,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    const url = `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`;

    return {
      url,
      key,
      filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
