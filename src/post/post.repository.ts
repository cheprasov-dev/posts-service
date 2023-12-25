import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

interface InsertParams {
  text: string;
  groupId: number;
  id: number;
}

interface InsertResponse {
  id: number;
  text: string;
  groupId: number;
  createdBy: number;
}

interface InsertDatabaseResult {
  id: number;
  text: string;
  group_id: number;
  created_by: number;
}

@Injectable()
export class PostRepository {
  constructor(private databaseService: DatabaseService) {}

  async insertOne(params: InsertParams): Promise<InsertResponse> {
    const queryString = `
      INSERT INTO 
      posts (text, group_id, created_by) 
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const insertedResult =
      await this.databaseService.query<InsertDatabaseResult>(queryString, [
        params.text,
        params.groupId,
        params.id,
      ]);

    const insertedData = insertedResult.rows[0];

    return {
      id: insertedData.id,
      text: insertedData.text,
      groupId: insertedData.group_id,
      createdBy: insertedData.created_by,
    };
  }
}
