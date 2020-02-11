import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Owner {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Index()
  @Column()
  name: string;
  @Column()
  purchaseDate: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
