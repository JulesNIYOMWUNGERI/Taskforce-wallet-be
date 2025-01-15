import { Entity, Column } from "typeorm";
import { TableBasicFieldEntity } from "./basic.entity";

@Entity()
export abstract class UserBasicInfoEntity extends TableBasicFieldEntity {
  @Column({ type: 'varchar', length: 500 })
  fullName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;
}