import { Router } from "express";

import path from "path";

const router = Router();

router.get(
  "/:filename",
  (req, res) => {

    const filePath =
      path.join(
        process.cwd(),
        "temp",
        req.params.filename
      );

    res.download(filePath);

  }
);

export default router;