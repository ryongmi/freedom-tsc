import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    // cb(null, file.originalname);
    cb(null, `${uuid()}.${file.mimetype.split("/").reverse()[0]}`);
    // cb(null, `${uuid()}.${file.originalname.split(".").reverse()[0]}`);
  },
});

const imgUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype))
      cb(null, true);
    else cb(null, false);
    //cb(new Error("해당 파일의 형식을 지원하지 않습니다."), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

export default imgUpload;
