import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // Number of salt rounds for hashing

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};

const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export default {
  hashPassword,
  verifyPassword,
};
