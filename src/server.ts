import app, { PORT } from "./app";

const bootstrap = () => {
  try {
    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit with failure code
  }
};

bootstrap();
