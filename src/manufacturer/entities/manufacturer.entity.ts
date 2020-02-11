import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Car } from "../../car/entities/car.entity";

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Index()
  @Column()
  name: string;
  @OneToMany(
    type => Car,
    car => car.manufacturer
  )
  cars: Car[];
  @Column()
  phone: string;
  @Column({type: "bigint"})
  siret: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
