import bcrypt from 'bcryptjs';

export async function HashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function Verify(inputPassword, storedHash) {
  return bcrypt.compare(inputPassword, storedHash);
}
