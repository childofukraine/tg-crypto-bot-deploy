import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Favourites {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  chatId!: number;

  @Column()
  symbol!: string;
}
