import app from "./app";
import { logger } from "./configs/logger";

const PORT = 8080;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
