import { TableBasicFieldEntity } from "src/common/entities/basic.entity";
import { Transaction } from "src/modules/transactions/entities/transaction.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('categories')
export class Category extends TableBasicFieldEntity {
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'uuid', nullable: true })
    parentId: string | null;

    @ManyToOne(() => Category, (category) => category.subcategories, { onDelete: 'CASCADE' })
    parent: Category | null;

    @OneToMany(() => Category, (category) => category.parent)
    subcategories: Category[];

    @ManyToOne(() => User, (user) => user.categories, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Transaction, (transaction) => transaction.category, { cascade: true })
    transactions: Transaction[];
}