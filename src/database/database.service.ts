import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    const HOST = this.configService.get('PG_HOST');
    const PORT = this.configService.get<number>('PG_PORT');
    const USERNAME = this.configService.get('PG_USERNAME');
    const PASSWORD = this.configService.get('PG_PASSWORD');
    const DATABASE = this.configService.get('PG_DATABASE');

    this.pool = new Pool({
      user: USERNAME,
      host: HOST,
      database: DATABASE,
      password: PASSWORD,
      port: PORT,
    });
  }

  async query<T extends QueryResultRow>(text: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      const result = client.query<T>(text, params);
      return result;
    } finally {
      client.release();
    }
  }
}
