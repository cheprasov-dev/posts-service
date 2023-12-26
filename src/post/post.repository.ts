import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

interface InsertParams {
  text: string;
  groupId: number;
  userId: number;
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

interface FindOneDatabaseResult {
  id: number;
  text: string;
  group_id: number;
  created_by: number;
}

interface FindOneResult {
  id: number;
  text: string;
  groupId: number;
  createdBy: number;
}

@Injectable()
export class PostRepository {
  private table: string = 'posts';

  constructor(private databaseService: DatabaseService) {}

  async insertOne(params: InsertParams): Promise<InsertResponse> {
    const queryString = `
      INSERT INTO 
      ${this.table} (text, group_id, created_by) 
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const insertedResult =
      await this.databaseService.query<InsertDatabaseResult>(queryString, [
        params.text,
        params.userId,
        params.groupId,
      ]);

    const insertedData = insertedResult.rows[0];

    return {
      id: insertedData.id,
      text: insertedData.text,
      groupId: insertedData.group_id,
      createdBy: insertedData.created_by,
    };
  }

  async findOne(filter: object): Promise<FindOneResult | null> {
    const fields = Object.keys(filter).map(
      (elem, index) => `${elem} = $${index + 1}`,
    );
    const values = Object.values(filter);

    const queryString = `
      SELECT * FROM ${this.table} WHERE ${fields.join(', ')}
    `;

    const foundData = await this.databaseService.query<FindOneDatabaseResult>(
      queryString,
      values,
    );
    const post = foundData.rows[0];

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      text: post.text,
      groupId: post.group_id,
      createdBy: post.created_by,
    };
  }
}
