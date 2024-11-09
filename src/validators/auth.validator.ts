import * as z from "zod";

export const authSchema = z.object({
  name: z.string({ message: "Name has to be a string" }).trim().min(1, {
    message: "Name field is required.",
  }),
  password: z.string({ message: "Password has to be a string" }).trim().min(1, {
    message: "Password field is required.",
  }),
});
