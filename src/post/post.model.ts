import {
  Model,
  Table,
  Column,
  HasMany,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

import { Comment } from '../comment/comment.model';

@Table({ tableName: 'posts' })
export class Post extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  title: string;

  @Column
  content: string;

  @HasMany(() => Comment)
  comments: Comment[];

  @Column
  createdBy: number;
}
