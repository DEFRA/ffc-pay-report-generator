const streamToString = async (readableStream) => {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on('data', data => chunks.push(data))
    readableStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    readableStream.on('error', reject)
  })
}

module.exports = {
  streamToString
}
