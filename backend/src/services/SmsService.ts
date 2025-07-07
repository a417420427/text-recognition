import crypto from "crypto";
import http from "http";
import querystring from "querystring";
import dotenv from "dotenv";

dotenv.config();

const SMS_API_HOST = process.env.SMS_API_HOST || "api.smsbao.com";
const SMS_USER = process.env.SMS_USER || "";
const SMS_PASS = process.env.SMS_PASS || "";

export class SmsService {
  static async sendCode(phone: string, code: string): Promise<void> {
    if (!SMS_USER || !SMS_PASS) {
      throw new Error("短信账户信息未配置，请检查 .env 文件");
    }

    const passwordMd5 = crypto.createHash("md5").update(SMS_PASS).digest("hex");
    const content = encodeURIComponent(`【你的应用名】您的验证码是：${code}`);

    const queryParams = querystring.stringify({
      u: SMS_USER,
      p: passwordMd5,
      m: phone,
      c: content,
    });


    const options: http.RequestOptions = {
      hostname: SMS_API_HOST,
      path: `/sms?${queryParams}`,
      method: "GET",
    };

    console.log("开始发送短信:", options)

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        res.setEncoding("utf-8");
        let responseData = "";

        res.on("data", (chunk) => {
          responseData += chunk;
          console.log(chunk, 'ss')
        });

        res.on("end", () => {
          SmsService.handleStatus(responseData.trim());
          if (responseData.trim() === "0") {
            resolve();
          } else {
            reject(new Error("短信发送失败，状态码：" + responseData.trim()));
          }
        });
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.end();
    });
  }

  private static handleStatus(code: string) {
    const statusMap: Record<string, string> = {
      "0": "短信发送成功",
      "-1": "参数不全",
      "-2": "服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！",
      "30": "密码错误",
      "40": "账户不存在",
      "41": "余额不足",
      "42": "账户已过期",
      "43": "IP地址限制",
      "50": "内容含有敏感字",
    };

    const msg = statusMap[code] || "未知错误";
    console.log(msg);
  }
}


