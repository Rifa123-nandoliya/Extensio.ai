import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {

  try {

    const { prompt } = req.body;

    if (!prompt) {

      return res.status(400).json({
        success: false,
        message: "Prompt required"
      });

    }

    const responseData = {

      success: true,

      message:
        "Extension generated successfully",

      projectId: "demo-project",

      downloadUrl:
        "https://example.com/demo.zip",

      data: {

        projectName:
          "Dark Mode Extension",

        description:
          `AI generated extension for: ${prompt}`,

        files: [

          {
            filename: "manifest.json",

            content: `{
  "manifest_version": 3,
  "name": "Dark Mode Extension",
  "version": "1.0"
}`
          },

          {
            filename: "popup.html",

            content: `<html>
<body>
<h1>Dark Mode Enabled</h1>
</body>
</html>`
          },

          {
            filename: "popup.js",

            content: `document.body.style.background = "black";`
          }

        ]

      }

    };

    return res.status(200).json(
      responseData
    );

  } catch (error: any) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        error.message ||
        "Server Error"

    });

  }

});

export default router;