const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const imageRouter = require('./routes/image');
const fileRouter = require('./routes/file');
const changelogRouter = require('./routes/changelog');

const app = express();
require('./connections');

app.set('view engine', 'jade');
app.set('views', './views');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/image', imageRouter);
app.use('/file', fileRouter);
app.use('/changelog', changelogRouter);
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
