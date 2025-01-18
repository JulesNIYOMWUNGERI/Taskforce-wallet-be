import { TableBasicFieldEntity } from "src/common/entities/basic.entity";
import { Transaction } from "src/modules/transactions/entities/transaction.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('accounts')
export class Account extends TableBasicFieldEntity {
    @ManyToOne(() => User, (user) => user.accounts, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'enum', enum: ['Bank', 'Mobile Money', 'Cash'], default: 'Cash' })
    type: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    balance: number;

    @Column({ type: 'varchar', length: 3, default: 'RWF' })
    currency: string;

    @OneToMany(() => Transaction, (transaction) => transaction.account, { cascade: true })
    transactions: Transaction[];
}