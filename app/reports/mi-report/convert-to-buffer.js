const v8 = require('node:v8')
const maxHeap = v8.getHeapStatistics().heap_size_limit

const convertToBuffer = (data) => {
  const csv = data.map(row => Object.values(row))
  csv.unshift(Object.keys(data[0]))

  console.log('node memory used: ', (v8.getHeapStatistics().used_heap_size / maxHeap) * 100)
  const bufferArray = csv.map((row) => {
    const formattedRow = row.join('","').concat('"\n"')
    return Buffer.from(formattedRow)
  })
  console.log('node memory used: ', (v8.getHeapStatistics().used_heap_size / maxHeap) * 100)
  return Buffer.concat(bufferArray)
}

module.exports = {
  convertToBuffer
}
