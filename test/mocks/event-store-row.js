const { PARTITION_KEY } = require('./values/partition-key')
const { ROW_KEY } = require('./values/row-key')
const { CATEGORY } = require('./values/category')

const event = require('./events/event')

module.exports = {
  partitionKey: PARTITION_KEY,
  rowKey: ROW_KEY,
  category: CATEGORY,
  ...event,
  data: JSON.stringify(event.data)
}
