import * as z from "zod";

export const signInSchema = z.object({
  username: z.string({ message: "Username has to be a string" }).trim().min(1, {
    message: "Username field is required.",
  }),
  password: z.string({ message: "Password has to be a string" }).trim().min(1, {
    message: "Password field is required.",
  }),
});
