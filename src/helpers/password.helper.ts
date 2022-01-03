import bcrypt from "bcryptjs";

export const hashPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err: Error, enc_pass: string) => {
      if (err) reject(err);
      else resolve(enc_pass);
    });
  });
};

export const comparePassword = (
  hashed: string,
  password: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashed, (err: Error, same: boolean) => {
      if (err) reject(err);
      resolve(same);
    });
  });
};
