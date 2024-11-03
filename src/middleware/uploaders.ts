import multer from "multer";
import path from "path";
import { Request } from "express";
import { BadRequest } from "../utils/errors";
import { fsUtils, RouteError } from "../utils";

const ALLOWED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg"];

const profileStorage = multer.diskStorage({
  destination: async (_, __, cb) => {
    const destinationPath = path.resolve(path.join("uploads", "profiles")); // project_directory/uploads/profiles
    const { success } = await fsUtils.createDirectory(destinationPath);
    cb(
      success
        ? null
        : new RouteError.InternalServerError(
            "Error occured while creating a folder for profile images!"
          ),
      destinationPath
    );
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: (error: any, status: boolean) => void
) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension))
    cb(new BadRequest("Unsupported image format"), false);
  else cb(null, true);
};

const profileUploader = multer({
  fileFilter: fileFilter,
  storage: profileStorage,
});

export default {
  profileUploader,
};
