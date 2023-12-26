import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

interface InsertParams {
  text: string;
  postId: number;
  createdBy: number;
}

interface InsertResponse {
  id: number;
  text: string;
  createdBy: number;
}

interface InsertDatabaseResult {
  id: number;
  text: string;
  post_id: number;
  created_by: number;
}

@Injectable()
export class CommentRepository {
  private table: string = 'comments';
  constructor(private databaseService: DatabaseService) {}

  async insertOne(params: InsertParams): Promise<InsertResponse> {
    const queryString = `
      INSERT INTO 
      ${this.table} (text, post_id, created_by) 
      VALUES ($1, $2, $3)
      RETURNING id, text, created_by
    `;
    const insertedResult =
      await this.databaseService.query<InsertDatabaseResult>(queryString, [
        params.text,
        params.postId,
        params.createdBy,
      ]);

    const insertedData = insertedResult.rows[0];

    return {
      id: insertedData.id,
      text: insertedData.text,
      createdBy: insertedData.created_by,
    };
  }
}
