import {
  Controller,
  Get,
  Route,
  Tags,
  Request,
  Query,
  Path,
  Put,
  Body,
} from "tsoa";
import { UploadRecord } from "../entities/UploadRecord";
import { AppDataSource } from "../data-source";


@Route("records")
@Tags("Record")
export class RecordController extends Controller {
  private uploadRepo = AppDataSource.getRepository(UploadRecord);

  @Get("list")
  public async getUserRecords(
    @Request() req: any,
    @Query("page") page = 1,
    @Query("size") size = 10
  ): Promise<{
    data: UploadRecord[];
    total: number;
    page: number;
    size: number;
  }> {
    const user = req.user;

    const take = Number(size); // 每页数量
    const skip = (Number(page) - 1) * take; // 跳过数量

    const [data, total] = await this.uploadRepo.findAndCount({
      where: { user: { id: user.id } },
      order: { uploadTime: "DESC" },
      skip,
      take,
    });

    return {
      data,
      total,
      page: Number(page),
      size: Number(size),
    };
  }

  @Get(":id")
  public async getRecordById(@Path("id") id: number): Promise<UploadRecord> {
    const record = await this.uploadRepo.findOne({
      where: { id },
      relations: ["user"], // 如果你需要包含 user 信息
    });

    if (!record) {
      this.setStatus(404);
      throw new Error("记录未找到");
    }

    return record;
  }

  @Put("{id}")
  public async updateResultText(
    @Path() id: number,
    @Body() body: { resultText: string },
    @Request() req: any
  ): Promise<UploadRecord> {
    const user = req.user;

    const record = await this.uploadRepo.findOne({
      where: { id, user: { id: user.id } }, // 只允许操作自己的记录
    });

    if (!record) {
      this.setStatus(404);
      throw new Error("记录未找到或无权限");
    }

    record.resultText = body.resultText;
    await this.uploadRepo.save(record);

    return record;
  }
}
