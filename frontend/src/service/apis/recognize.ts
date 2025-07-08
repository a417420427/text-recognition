import ApiService from '..';

interface User {
  id: number;
  passwordHash?: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
}

export interface UploadRecord {
  id: number;
  user: User;
  imageUrl: string;
  type?: string;
  resultText: string;
  uploadTime: Date;
  lastModified: Date;
}

export async function baseRecognize(filePath: string) {
  const uploadRes = await ApiService.uploadFile<UploadRecord>(
    '/ocr/recognize',
    filePath,
    'image'
  );

  return uploadRes;
}

export async function getRecordById(id) {
  return await ApiService.get<{ data: UploadRecord }>(`/records/${id}`);
}

export async function getRecordsList(param = { page: 1, size: 10 }) {
  return await ApiService.get<{ data: { data: UploadRecord[] } }>(
    '/records/list',
    { data: param }
  );
}

export async function saveRecord(id: number, resultText: string) {
  return await ApiService.put<{ data: { resultText: string } }>(
    '/records/' + id,
    {
      data: { resultText },
    }
  );
}
