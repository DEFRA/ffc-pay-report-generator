const groupEventsByCorrelationId = (events) => {
  return [...events.reduce((x, y) => {
    // group by correlation key, so create key representing the combination
    // exclude account code as past requests vary based on ledger
    const key = y.partitionKey

    // if key doesn't exist then first instance so create new group
    const item = x.get(key) || Object.assign({}, { correlationId: key, events: [] })
    item.events.push(y)

    return x.set(key, item)
  }, new Map()).values()]
}

module.exports = {
  groupEventsByCorrelationId
}
