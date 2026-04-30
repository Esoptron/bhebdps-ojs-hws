const loader = document.getElementById('loader');
const items = document.getElementById('items');

const renderCurrencies = (valute) => {
  const currencies = Object.values(valute)
    .map(
      ({ CharCode, Value }) => `
        <div class="item">
          <div class="item__code">${CharCode}</div>
          <div class="item__value">${Value}</div>
          <div class="item__currency">руб.</div>
        </div>
      `,
    )
    .join('');

  items.innerHTML = currencies;
};

const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://students.netoservices.ru/nestjs-backend/slow-get-courses');

xhr.addEventListener('load', () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    const response = JSON.parse(xhr.responseText);
    renderCurrencies(response.response.Valute);
  }

  loader.classList.remove('loader_active');
});

xhr.addEventListener('error', () => {
  loader.classList.remove('loader_active');
});

xhr.send();
