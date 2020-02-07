import {
  Column,
  Entity,
  Index,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Manufacturer } from "../../manufacturer/entities/manufacturer.entity";
import { Owner } from "../../owner/entities/owner.entity";

@Entity()
export class Car {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Index()
  @ManyToOne(
    type => Manufacturer,
    manufacturer => manufacturer.cars
  )
  manufacturer: Manufacturer;
  @Column()
  price: number;
  @Column()
  firstRegistrationDate: Date;
  @ManyToMany(type => Owner)
  @JoinTable()
  owners: Owner[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
