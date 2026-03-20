import bcrypt from 'bcrypt';
const salt = bcrypt.genSaltSync(10);

const hashPassword = async (plainPassword: string) => {
  try {
    return await bcrypt.hash(plainPassword, salt);
  } catch (e) {
    console.log(e);
    throw new Error('Could not hash password');
  }
};
const checkPassword = async (
  plainPassword: string,
  hashPasswordInDB: string,
) => {
  const isMatch = await bcrypt.compare(plainPassword, hashPasswordInDB);
  return isMatch; // Trả về true nếu đúng, false nếu sai
};
export { hashPassword, checkPassword };
