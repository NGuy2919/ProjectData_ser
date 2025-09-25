import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null, path.join(process.cwd(), 'public', 'uploads')),
  filename: (req,file,cb)=> {
    const ext = path.extname(file.originalname);
    cb(null, Date.now()+'-'+Math.random().toString(36).slice(2,7)+ext);
  }
});
export default multer({storage});
