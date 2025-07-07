import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { redisClient } from "../utils/redisClient";
import { SmsService } from "./SmsService";

export class UserService {
  private userRepo = AppDataSource.getRepository(User);

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepo.findOneBy({ id });
  }

  async getUserByPhone(phone: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ phone });
  }

  // async getUserByWechatOpenid(openid: string): Promise<User | null> {
  //   return await this.userRepo.findOneBy({ wechatOpenid: openid });
  // }

  async createUser(data: {
    phone: string;
    password: string;
    username: string;
    wechatOpenid?: string;
  }): Promise<User> {
    const { phone, password, username, wechatOpenid } = data;

    // 检查手机号是否存在
    const existUser = await this.getUserByPhone(phone);
    if (existUser) {
      throw new Error("Phone number already registered");
    }

    // 如果有wechatOpenid，检查是否被占用
    // if (wechatOpenid) {
    //   const existWechatUser = await this.getUserByWechatOpenid(wechatOpenid);
    //   if (existWechatUser) {
    //     throw new Error("WechatOpenid already linked with another user");
    //   }
    // }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      phone,
      passwordHash,
      username,
      // wechatOpenid,
      // isActive: true,
    });

    return await this.userRepo.save(user);
  }

  async verifyUser(phone: string, password: string): Promise<User | null> {
    const user = await this.getUserByPhone(phone);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash!);
    if (!isValid) return null;

    // 登录成功，更新 lastLoginAt
    // user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    return user;
  }

  // 微信登录或绑定时更新 lastLoginAt 和 wechatOpenid
  // async loginOrBindWechat(openid: string, username: string): Promise<User> {
  //   let user = await this.getUserByWechatOpenid(openid);
  //   if (!user) {
  //     // 新建用户
  //     user = this.userRepo.create({
  //       username,
  //       wechatOpenid: openid,
  //       isActive: true,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       lastLoginAt: new Date(),
  //       // phone, passwordHash 可留空或另外处理
  //     });
  //     await this.userRepo.save(user);
  //   } else {
  //     // 更新登录时间
  //     user.lastLoginAt = new Date();
  //     await this.userRepo.save(user);
  //   }
  //   return user;
  // }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepo.update(id, updateData);
    const updatedUser = await this.getUserById(id);
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  }

  static async generateAndSendCode(phone: string): Promise<void> {
    const existingCode = await redisClient.get(`code:${phone}`);
    console.log(existingCode, 'sss')
    // if (existingCode) {
    //   throw new Error("验证码已发送，请稍后再试");
    // }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.set(`code:${phone}`, code, { EX: 300 });
    await SmsService.sendCode(phone, code);
  }

  static async verifyCode(phone: string, code: string): Promise<boolean> {
    // TODO 资质问题 暂时跳过短信验证
    // const storedCode = await redisClient.get(`code:${phone}`);
    // if (!storedCode) return false;
    // if (storedCode !== code) return false;
    // await redisClient.del(`code:${phone}`);
    return true;
  }
}
