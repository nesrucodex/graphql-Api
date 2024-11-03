import fs from "fs/promises";

const createDirectory: (
  dirPath: string
) => Promise<{ success: boolean }> = async (dirPath) => {
  try {
    await fs.access(dirPath);
    return {
      success: true,
    };
  } catch (error: any) {
    if (error.code && error.code === "ENOENT") {
      await fs.mkdir(dirPath, { recursive: true });
      return {
        success: true,
      };
    }
    return {
      success: false,
    };
  }
};

export default {
  createDirectory,
};
