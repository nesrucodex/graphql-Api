import { JwtPayload, verify, sign } from "jsonwebtoken";
import { ENV } from "../config";
import { PrismaClient, User } from "@prisma/client";

const generateToken = (payload: { userId: number }) =>
  sign(payload, ENV.JWT_SECRET);

const authenticateUser = async (
  prisma: PrismaClient,
  request: Request
): Promise<User | null> => {
  const header = request.headers.get("Authorization");
  console.log({ header });
  if (header !== null) {
    const token = header.split(" ")[1];
    const tokenPayload = verify(token, ENV.JWT_SECRET) as JwtPayload;
    const userId = tokenPayload.userId;
    return await prisma.user.findUnique({ where: { id: userId } });
  }

  return null;
};

export default { authenticateUser, generateToken };
