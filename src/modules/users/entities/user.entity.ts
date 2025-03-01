import { UserBasicInfoEntity } from 'src/common/entities/basic-user-info.entity';
import { Account } from 'src/modules/accounts/entities/account.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { Column, Entity, OneToMany } from 'typeorm';
  
@Entity()
export class User extends UserBasicInfoEntity {
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    budgetLimit: number;

    @OneToMany(() => Account, (account) => account.user, { cascade: true })
    accounts: Account[];

    @OneToMany(() => Category, (category) => category.user, { cascade: true })
    categories: Category[];

    @OneToMany(() => Transaction, (transaction) => transaction.user, { cascade: true })
    transactions: Transaction[];
}
  
