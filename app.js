const stocks = ['FB', 'NKE', 'GOOG'];

const displayStockInfo = function () {
  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=1m&last=1`;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    $('#stocks-view').empty();

    // Creating a div to hold the stock
    const stockDiv = $('<div>').addClass('stock');

    // Storing the company name
    const companyName = response.quote.companyName;

    // Creating an element to display the company name
    const nameHolder = $('<p>').text(`Company Name: ${companyName}`);

    // Appending the name to our stockDiv
    stockDiv.append(nameHolder);

    // Storing the stock symbol
    const stockSymbol = response.quote.symbol;

    // Creating an element to display the stock symbol
    const symbolHolder = $('<p>').text(`Stock Symbol: ${stockSymbol}`);

    // Appending the symbol to our stockDiv
    stockDiv.append(symbolHolder);

    // Storing the price
    const stockPrice = response.quote.latestPrice;

    // Creating an element to display the price
    const priceHolder = $('<p>').text(`Stock Price: $${stockPrice}`);

    // Appending the price to our stockDiv
    stockDiv.append(priceHolder);

    // Storing the first news summary
    const companyNews = response.news[0].summary;

    // Creating an element to display the news summary
    const summaryHolder = $('<p>').text(`News Headline: ${companyNews}`);

    // Appending the summary to our stockDiv
    stockDiv.append(summaryHolder);

    // Finally adding the stockDiv to the DOM
    // Until this point nothing is actually displayed on our page
    $('#stocks-view').prepend(stockDiv);
  });

}

// Function for displaying stock data
const render = function () {
  $('#buttons-view').empty();
  for (let i = 0; i < stocks.length; i++) {
    const newButton = $('<button>');
    newButton.addClass('stock-btn');
    newButton.attr('data-name', stocks[i]);
    newButton.text(stocks[i]);
    $('#buttons-view').append(newButton);
  }
}

// This function handles events where one button is clicked
const addButton = function (event) {
  event.preventDefault();
  const stock = $('#stock-input').val().trim().toUpperCase();
  if (stock) {
    stocks.push(stock);
  }
  $('#stock-input').val('');
  render();
}

// Even listener for #add-stock button
$('#add-stock').on('click', addButton);

// Adding a click event listener to all elements with a class of 'stock-btn'
$('#buttons-view').on('click', '.stock-btn', displayStockInfo);

// Calling the renderButtons function to display the intial buttons
render();