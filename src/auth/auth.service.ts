/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from 'src/users/schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<object> {
    const user = await this.userModel.findOne({ email: signUpDto.email });
    if (!user) {
      const newUser = await this.userModel.create(signUpDto);
      await newUser.hashedPassword();
      await newUser.save();
      return {
        status: 'success',
        newUser,
      };
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    const { password, ...rest } = user.toObject();
    if (!user || !user.comparePassword(loginDto.password)) {
      throw new UnauthorizedException('Invalid credintials');
    }
    const token = user.createJWTForAuthorizedUser();
    return {
      rest,
      token,
    };
  }
}
