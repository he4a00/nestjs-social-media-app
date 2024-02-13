import { JwtService } from '@nestjs/jwt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Types } from 'mongoose';
import { Post } from 'src/posts/schemas/post.schema';

enum roles {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema()
export class User extends Document {
  @Prop({ required: true, type: String })
  username: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, default: roles.USER, type: String })
  role: string;

  @Prop({ type: Types.ObjectId, ref: Post.name })
  posts: Post[];

  async hashedPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  createJWTForAuthorizedUser(): string {
    const jwtService = new JwtService();
    return jwtService.sign(
      { userId: this._id, role: this.role },
      { secret: process.env.JWT_SECRET, expiresIn: '30d' },
    );
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);
