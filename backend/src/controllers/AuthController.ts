import { Controller, Post, Route, Tags, Body, SuccessResponse } from "tsoa";
import { UserService } from "../services/UserService";
import { signJwt } from "../utils/jwt";
import bcrypt from "bcrypt";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  private userService = new UserService();

  /**
   * 发送验证码
   */
  @SuccessResponse("200", "验证码发送成功")
  @Post("send-code")
  public async sendCode(
    @Body() body: { phone: string }
  ): Promise<{ message: string }> {
    const { phone } = body;

    await UserService.generateAndSendCode(phone);
    return { message: "验证码已发送，请注意查收" };
  }

  /**
   * 验证码登录
   */
  @SuccessResponse("200", "登录成功")
  @Post("login")
  public async login(
    @Body() body: { phone: string; code: string }
  ): Promise<{ token: string; id: number; username: string }> {
    const { phone, code } = body;

    const isValidCode = await UserService.verifyCode(phone, code);
    if (!isValidCode) {
      this.setStatus(400);
      return Promise.reject(new Error("验证码错误或已过期"));
    }

    let user = await this.userService.getUserByPhone(phone);
    if (!user) {
      user = await this.userService.createUser({
        phone,
        password: Math.random().toString(36).slice(-8),
        username: `user_${phone.slice(-4)}`,
      });
    }

    await this.userService.updateUser(user.id, user);

    const token = signJwt({ id: user.id, phone: user.phone }, "30d");

    return { token, id: user.id, username: user.username! };
  }

  @SuccessResponse("200", "登录成功")
  @Post("login-by-password")
  public async loginByPassword(
    @Body() body: { phone: string; password: string, username?: string }
  ): Promise<{ token: string; id: number; username: string }> {
     console.log(body, 'bbbbbddd')
    const { phone, password } = body;

   
    // 根据手机号查用户
    const user = await this.userService.getUserByPhone(phone);
    if (!user || !user.passwordHash) {
      this.setStatus(400);
      return Promise.reject(new Error("用户不存在或未设置密码"));
    }

    // 验证密码哈希
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      this.setStatus(400);
      return Promise.reject(new Error("用户名或密码错误"));
    }

    // 更新登录时间
    await this.userService.updateUser(user.id, {
      ...user,
    });

    // 生成JWT
    const token = signJwt({ id: user.id, phone: user.phone }, "30m");

    return { token, id: user.id, username: user.username! };
  }

  /**
   * 用户注册
   */
  @SuccessResponse("201", "注册成功")
  @Post("register")
  public async register(
    @Body()
    body: {
      phone: string;
      password: string;
      username?: string;
    }
  ): Promise<{ token: string; id: number; username: string }> {
    const { phone, password, username } = body;

    // 检查手机号是否已注册
    const existingUser = await this.userService.getUserByPhone(phone);
    if (existingUser) {
      this.setStatus(400);
      return Promise.reject(new Error("该手机号已注册"));
    }

    // 创建新用户
    const user = await this.userService.createUser({
      phone,
      password,
      username: username || `user_${phone.slice(-4)}`,
    });

    // 生成 token
    const token = signJwt({ id: user.id, phone: user.phone }, "30m");

    this.setStatus(201);
    return { token, id: user.id, username: user.username! };
  }
}
