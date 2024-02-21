const getValue = (events, type) => {
  const event = events.find(event => event.type === type)
  if (event) {
    return event.data.value
  }
  return events[0].data.value
}

module.exports = {
  getValue
}
