import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import flash from './src/middleware/flash.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection, hasDatabaseConfig } from './src/models/db.js';
import router from './src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'development';

// Define the port number
const PORT = process.env.PORT || 3000;

const SESSION_SECRET = process.env.SESSION_SECRET || 'development-secret';

if (!process.env.SESSION_SECRET && NODE_ENV !== 'production') {
  console.warn('Warning: SESSION_SECRET is not set. Using development fallback secret.');
}

const app = express();

/**
 * Configure Express middleware
 */

// Allow Express to receive POST form data
app.use(express.urlencoded({ extended: true }));

// Allow Express to receive JSON data
app.use(express.json());

// Configure session management
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Use custom flash message middleware
app.use(flash);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// Middleware to log all incoming requests
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

// Routes
app.use(router);

// Catch-all route for 404 errors
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);

  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';

  const context = {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: err.message,
    stack: err.stack,
    NODE_ENV,
  };

  res.status(status).render(`errors/${template}`, context);
});

// Start the server after testing the database connection
app.listen(PORT, async () => {
  if (hasDatabaseConfig) {
    try {
      await testConnection();
      console.log(`Server is running at http://127.0.0.1:${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
    return;
  }

  console.warn('Skipping database connection test because DB_URL/DATABASE_URL is not configured.');
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});