const path = require('path');
const express = require('express');
const webpack = require('webpack');
// const internalIp = require('internal-ip');
const config = require('./tools/webpack.config');

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
  },
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './src/index.html'));
});

const port = 8888;
// const ip = internalIp.v4();

app.listen(port, (err) => {
  if (err) {
    console.log(err); // eslint-disable-line
    return;
  }

  console.log(' --------------------------------------'); // eslint-disable-line
  console.log(`    Local: http://0.0.0.0:${port}`); // eslint-disable-line
  // console.log(` External: http://${ip}:${port}`);
  console.log(' --------------------------------------'); // eslint-disable-line
});
