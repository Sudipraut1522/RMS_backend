import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "items" })
export class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  // We store price as a double/decimal type.
  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "varchar", length: 500, nullable: true, name: "image_url" })
  imageUrl!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true, name: "cloudinary_id" })
  cloudinaryId!: string | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
  createdAt!: Date;
}
