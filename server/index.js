// server/index.js
import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import path from "path";
import multer from "multer";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 3001;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const SAVEPATH = "uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SAVEPATH);
  },
  filename: (req, file, cb) => {
    // const uniqueName = `image_${Date.now()}${path.extname(file.originalname)}`;
    const uniqueName = `image_org${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post("/openai", upload.single("image"), async (req, res) => {
  try {
    const response = await openai.createImageVariation(
      fs.createReadStream(req.file.path),
      1,
      "512x512",
      "url"
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error processing image", error: error.message });
  }
  // fs.rmdir(SAVEPATH, { recursive: true }, (err) => {
  //   if (err) {
  //     console.error("Error deleting directory:", err);
  //   } else {
  //     console.log("Directory deleted successfully");
  //   }
  // });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// [
//   {
//       "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-tmcbY7exIefYaf4hG4Hps71I/user-Fd1U5NszX5TdsPMU7YbdK0nK/img-PpUfANeFAvgTXYn520Df0KU2.png?st=2023-03-20T04%3A14%3A27Z&se=2023-03-20T06%3A14%3A27Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-20T04%3A22%3A25Z&ske=2023-03-21T04%3A22%3A25Z&sks=b&skv=2021-08-06&sig=azkywotF8/aRP9vuKSaqQDHZYvJ6UnQM0zwQlJQ7BB4%3D"
//   },
//   {
//       "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-tmcbY7exIefYaf4hG4Hps71I/user-Fd1U5NszX5TdsPMU7YbdK0nK/img-CQNBR4KbskhINmz8PKfFyWzy.png?st=2023-03-20T04%3A14%3A27Z&se=2023-03-20T06%3A14%3A27Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-03-20T04%3A22%3A25Z&ske=2023-03-21T04%3A22%3A25Z&sks=b&skv=2021-08-06&sig=vK8xVaj74aYWnaUsj2sVjLDKBTsoPsQDFX12G9iFxRQ%3D"
//   }
// ]
