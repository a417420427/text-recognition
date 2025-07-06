import { Controller, Get, Route, Tags, Post, Body, Query, Path } from 'tsoa'
import { getRepository } from 'typeorm'
import { UploadRecord } from '../entities/UploadRecord'

@Route('records')
@Tags('Record')
export class RecordController extends Controller {
  @Get('/')
  public async getAll(
    @Query() userId: number
  ): Promise<UploadRecord[]> {
    const repo = getRepository(UploadRecord)
    return await repo.find({
      where: { user: { id: userId } },
      order: { uploadTime: 'DESC' },
      relations: ['user']
    })
  }

  @Post('/')
  public async uploadRecord(@Body() body: {
    userId: number
    imageUrl: string
    type?: string
    resultText?: string
  }): Promise<UploadRecord> {
    const repo = getRepository(UploadRecord)
    const record = repo.create(body)
    return await repo.save(record)
  }
}
