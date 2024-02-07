const unixToISO = unix => new Date(+unix * 1000).toISOString()

export default unixToISO
