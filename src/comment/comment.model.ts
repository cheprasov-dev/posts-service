import {
  Model,
  Table,
  Column,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

import { Post } from '../post/post.model';

@Table({ tableName: 'comments' })
export class Comment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  text: string;

  @ForeignKey(() => Post)
  @Column
  postId: number;

  @BelongsTo(() => Post)
  post: Post;

  @Column
  createdBy: number;
}
