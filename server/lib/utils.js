import jwt from 'jsonwebtoken';

//function to generate a JWT token
export function generateToken(userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token valid for 30 days
  });
  return token;
}