import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { LoginCredentials, LoginResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    await dbConnect();
    const { email, password }: LoginCredentials = await request.json();
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Email or password incorrect' }, { status: 401 });
    }
    
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Email or password incorrect' }, { status: 401 });
    }
    
    const token: string = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    const response = NextResponse.json({ 
      success: true, 
      user: { name: user.name, email: user.email } 
    });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}