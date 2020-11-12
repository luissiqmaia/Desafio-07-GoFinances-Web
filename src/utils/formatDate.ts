const formatDate = (dateTime: Date, timeZone = 'America/Sao_Paulo', dateTimes: boolean = false): string =>
  dateTimes ?
    new Date(dateTime).toLocaleString('pt-br', { timeZone }) :
    new Date(dateTime).toLocaleDateString('pt-br', { timeZone })

export default formatDate;
