const saveResourcesToTxt = async ({ uid, aria2 = false }) => {
  logger.log(`[start]: ${uid}`);
  const { urls, data, user } = await getResources({ uid });
  if (urls.length === 0) {
    logger.log(`[finished]: 没有新图片`);
    return;
  }
  logger.log(urls.join('\n'));
  const dataTxtPath = path.join(config.saveDir, `data/${uid}.txt`);
  if (fs.existsSync(dataTxtPath)) {
    const tmpPath = path.join(os.tmpdir(), `${uid}.txt`);
    const writeStream = fs.createWriteStream(tmpPath);
    const contentStream = new Readable();
    writeStream.on('end', () => {
      fs.unlinkSync(dataTxtPath);
      fs.rename(tmpPath, dataTxtPath);
    });
    contentStream.pipe(writeStream, { end: false });
    contentStream.on('end', () => {
      fs.createReadStream(dataTxtPath).pipe(writeStream);
    });
    urls.forEach((url) => {
      contentStream.push(url + '\n');
    });
    contentStream.push(null);
  } else {
    const writeStream = fs.createWriteStream(dataTxtPath);
    const contentStream = new Readable();
    contentStream.pipe(writeStream);
    urls.forEach((url) => {
      contentStream.push(url + '\n');
    });
    contentStream.push(null);
  }
  logger.log(`[saved]: ${uid}`);
};

module.exports = saveResourcesToTxt;
