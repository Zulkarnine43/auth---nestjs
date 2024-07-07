import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DISABLED = 'disabled',
    ONREVIEW = 'on review',
}

export enum UserType {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    Staff = 'staff',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: UserType })
    type: UserType;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatar: string;

    @Column({ type: 'varchar', name: 'first_name', length: 255, nullable: true })
    firstName: string;

    @Column({ type: 'varchar', name: 'last_name', length: 255, nullable: true })
    lastName: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    phone: string;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender: Gender;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({
        type: 'varchar',
        name: 'facebook_key',
        length: 255,
        nullable: true,
    })
    facebookKey: string;

    @Column({ type: 'varchar', name: 'gmail_key', length: 255, nullable: true })
    gmailKey: string;

    @Column({ type: 'varchar', name: 'apple_key', length: 255, nullable: true })
    appleKey: string;

    @Column({ type: 'varchar', name: 'admin_type', length: 255, nullable: true })
    adminType: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
