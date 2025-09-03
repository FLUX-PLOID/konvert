import formidable from "formidable";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data"; // penting!

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error parsing file" });

    const file = files.file[0];
    const stream = fs.createReadStream(file.filepath);

    try {
      const fd = new FormData();
      fd.append("file", stream, file.originalFilename);

      const uploadRes = await fetch("https://file.io", {
        method: "POST",
        body: fd,
      });

      const data = await uploadRes.json();
      return res.status(200).json({ url: data.link || null });
    } catch (error) {
      return res.status(500).json({ error: "Upload gagal", detail: error.message });
    }
  });
  }
