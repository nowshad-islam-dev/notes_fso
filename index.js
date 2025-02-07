// utils import
import config from './utils/config.js'; // load necessary env variables
import logger from './utils/logger.js';

// import express app
import app from './app.js';

const port = config.PORT || 3001;

app.listen(port, () => logger.info(`Server running at port: ${port}`));
