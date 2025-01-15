import { TableBasicFieldEntity } from "src/common/entities/basic.entity";
import { Account } from "src/modules/accounts/entities/account.entity";
import { Category } from "src/modules/categories/entities/category.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('transactions')
export class Transaction extends TableBasicFieldEntity {
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: ['income', 'expense'] })
    type: 'income' | 'expense';

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    transactionDate: Date;

    @ManyToOne(() => Account, (account) => account.transactions, { eager: true, onDelete: 'CASCADE' })
    account: Account;

    @ManyToOne(() => Category, (category) => category.transactions, { eager: true, nullable: true })
    category: Category;

    @ManyToOne(() => User, (user) => user.transactions, { nullable: false, onDelete: 'CASCADE' })
    user: User;
}
