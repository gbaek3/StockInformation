var validationList = [];
const stocks = ['FB', 'NKE', 'GOOG', 'AAPL'];

$.ajax({
  url: `https://api.iextrading.com/1.0/ref-data/symbols`,
  method: 'GET'
}).then(function (response) {
  response.forEach(function (object, key) {
    validationList.push(object.symbol)
  });
});

const displayStockInfo = function () {
  const stock = $(this).attr('data-name');
  const queryURL = `https://cloud.iexapis.com/stable/stock/${stock}/batch?types=quote,logo,company&token=pk_960742b4a2a943298fc533080828eaca`;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    const stockDiv = $('<div>').addClass('stock');
    const stockLogo = response.logo.url;
    const companyName = response.quote.companyName;
    const stockPrice = response.quote.latestPrice;
    const stockDesc = response.company.description;
    const ceo = response.company.CEO;
    const tags = response.company.tags;
    const nameHolder = $('<h1>').text(`${companyName}`);
    const ceoHolder = $('<h5>').text(`Current CEO: ${ceo}`);
    const descHolder = $('<h6>').text(`${stockDesc}`);
    const priceHolder = $('<h6>').text(`Current Price: $${stockPrice}`);
    const tagHolder = $('<h6>').text(`Tags: ${tags} `);


    stockDiv.append($('<img>', { id: 'theImg', src: stockLogo }));
    stockDiv.append(nameHolder);
    stockDiv.append(ceoHolder);
    stockDiv.append(descHolder);
    stockDiv.append(priceHolder);
    stockDiv.append(tagHolder);
    $('#stocks-view').prepend(stockDiv);

    const APIKey = 'N14O77o1kDhs1YACTRGTTJMurF4E6gfA';
    const filterQ = 'source:("The New York Times")';
    var newsURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${companyName}&fq=${filterQ}&api-key=${APIKey}`;
    $.ajax({
      url: newsURL,
      method: 'GET'
    }).then(function (res) {
      for (let i = 0; i < 3; i++) {
        const urlLink = res.response.docs[i].web_url;
        stockDiv.append(`<div id="news-view"> <div class = "articleTitle">${res.response.docs[i].headline.main}</div><br> ${res.response.docs[i].snippet} <br> <a href = "${urlLink}">Article link</a></div>`);
      }
    });
  });
}

const render = function () {
  $('#buttons-view').empty();
  for (let i = 0; i < stocks.length; i++) {
    const newButton = $('<button>');
    newButton.addClass('stock-btn');
    newButton.addClass('btn-info');
    newButton.attr('data-name', stocks[i]);
    newButton.text(stocks[i]);
    $('#buttons-view').append(newButton);
  }
}

const addButton = function (event) {
  event.preventDefault();
  const stock = $('#stock-input').val().trim().toUpperCase();
  if (validationList.includes(stock)) {
    stocks.push(stock);
  }
  $('#stock-input').val('');
  render();
}

const clearPage = function (event) {
  event.preventDefault();
  $('#stocks-view').empty();
}

$('#add-stock').on('click', addButton);
$('#clear-stock').on('click', clearPage);
$('#buttons-view').on('click', '.stock-btn', displayStockInfo);
render();