import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';

interface InsertParams {
  text: string;
  postId: number;
  createdBy: number;
}

interface DataResponse {
  id: number;
  text: string;
  createdBy: number;
}

interface DataFromDatabase {
  id: number;
  text: string;
  post_id: number;
  created_by: number;
}

interface FindAllFilter {
  postId: number;
}

const filterConvertValues: { [key: string]: string } = {
  postId: 'post_id',
};

@Injectable()
export class CommentRepository {
  private table: string = 'comments';
  constructor(private databaseService: DatabaseService) {}

  async insertOne(params: InsertParams): Promise<DataResponse> {
    const queryString = `
      INSERT INTO 
      ${this.table} (text, post_id, created_by) 
      VALUES ($1, $2, $3)
      RETURNING id, text, created_by
    `;
    const insertedResult = await this.databaseService.query<DataFromDatabase>(
      queryString,
      [params.text, params.postId, params.createdBy],
    );

    const insertedData = insertedResult.rows[0];

    return {
      id: insertedData.id,
      text: insertedData.text,
      createdBy: insertedData.created_by,
    };
  }

  async findAll(filter: FindAllFilter): Promise<DataResponse[]> {
    const fields = Object.keys(filter).map(
      (elem: string, index) => `${filterConvertValues[elem]} = $${index + 1}`,
    );
    const values = Object.values(filter);
    const queryString = `
      SELECT * FROM ${this.table} ${
        fields.length > 0 && 'WHERE ' + fields.join(', ')
      }
    `;

    const foundData = await this.databaseService.query<DataFromDatabase>(
      queryString,
      values,
    );

    return foundData.rows.map((elem) => ({
      id: elem.id,
      text: elem.text,
      createdBy: elem.created_by,
    }));
  }
}
