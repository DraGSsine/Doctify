import { Types } from 'mongoose';

export interface AIAnalyzeDocumentResponse {
  mainTopic: string;
  documentType: string;
  keyEntities: string[];
  summary: string;
}

export interface FileInfo {
  fileId: string;
  topic: string;
  url: string;
  format: string;
  name: string;
  size: number;
  createdAt: Date;
  documentType: string;
  keyEntities: string[];
  summary: string;
}

export interface AiRespone {
  categorizations: Array<{
    mainTopic: string;
    categories: Array<{ name: string; confidence: number }>;
  }>;
}

export interface FolderInfoType {
  folderId: Types.ObjectId;
  name: string;
  files: FileInfo[];
  numberOfFiles: number;
  confidence: number;
}
