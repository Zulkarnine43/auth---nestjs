import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { json } from 'express';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: number;

  @Prop()
  type: string;

  @Prop()
  avatar: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  gender: string;

  @Prop()
  password: string;

  @Prop()
  status: string;

  @Prop()
  facebookKey: string;

  @Prop()
  gmailKey: string;

  @Prop()
  appleKey: string;

  @Prop()
  adminType: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
