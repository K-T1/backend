import { } from 'dotenv/config'
import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import fileUpload from 'express-fileupload'

import mongoose from './mongoose'

import indexRouter from './routes/index'
import usersRouter from './routes/User'
import photoRouter from './routes/Photo'


const DB_PORT = 27017
const DB_URL = process.env.MONGODB_HOST || 'mongodb://db'

// MongoDB
mongoose.connect(
  `${DB_URL}:${DB_PORT}/koomtone`,
  { useUnifiedTopology: true, useNewUrlParser: true },
)
const db = mongoose.connection
db.once('open', () => console.log('connected to MongoDB.'))
db.on('error', console.error.bind(console, 'connection error:'))

const port = process.env.PORT || 3000
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload({ createParentPath: true, useTempFiles: true }))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/photo', photoRouter);

app.use((req, res, next) => {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({ nope: true });
  } else {
    next();
  }
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log("Server started")
})
