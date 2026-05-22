// ===============================
// GOOGLE SHEETS PUBLISHED CSV URL
// ===============================

const CSV_URL =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSk_BOFEPDad7eFLLlOJM68OsxuOPK9lADl60u1RvHbEct1E4LC3BfknP16oj7ef_jsv1mjQeCNjAt-/pub?gid=490700574&single=true&output=csv';

// ===============================
// LOAD DATA
// ===============================

Papa.parse(CSV_URL, {
  download: true,
  header: true,
  complete: function(results) {

    const data = results.data;

    console.log(data);

    renderDashboard(data);
  }
});

// ===============================
// MAIN DASHBOARD
// ===============================

function renderDashboard(data) {

  if (!data.length) return;

  const columns = Object.keys(data[0]);

  // AUTO DETECT COLUMNS
  const salesKey = findColumn(columns, [
    'sales',
    'amount',
    'total',
    'price'
  ]);

  const categoryKey = findColumn(columns, [
    'category',
    'product',
    'item',
    'type'
  ]);

  let totalSales = 0;

  const categoryTotals = {};

  data.forEach(row => {

    const sale = parseFloat(row[salesKey]) || 0;

    totalSales += sale;

    const category = row[categoryKey] || 'Unknown';

    categoryTotals[category] =
      (categoryTotals[category] || 0) + sale;
  });

  const totalOrders = data.length;

  const avgSale = totalSales / totalOrders;

  const bestCategory = Object.keys(categoryTotals)
    .reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

  // KPI CARDS
  document.getElementById('totalSales').innerText =
    `₱${totalSales.toLocaleString()}`;

  document.getElementById('totalOrders').innerText =
    totalOrders;

  document.getElementById('bestCategory').innerText =
    bestCategory;

  document.getElementById('avgSale').innerText =
    `₱${avgSale.toFixed(2)}`;

  // CHARTS
  createSalesChart(categoryTotals);
  createCategoryChart(categoryTotals);

  // TABLE
  renderTable(data);
}

// ===============================
// FIND COLUMN
// ===============================

function findColumn(columns, keywords) {

  return columns.find(col =>
    keywords.some(keyword =>
      col.toLowerCase().includes(keyword)
    )
  );
}

// ===============================
// BAR CHART
// ===============================

function createSalesChart(categoryTotals) {

  new Chart(document.getElementById('salesChart'), {

    type: 'bar',

    data: {
      labels: Object.keys(categoryTotals),

      datasets: [{
        label: 'Sales',

        data: Object.values(categoryTotals)
      }]
    },

    options: {
      responsive: true
    }
  });
}

// ===============================
// PIE CHART
// ===============================

function createCategoryChart(categoryTotals) {

  new Chart(document.getElementById('categoryChart'), {

    type: 'pie',

    data: {
      labels: Object.keys(categoryTotals),

      datasets: [{
        data: Object.values(categoryTotals)
      }]
    },

    options: {
      responsive: true
    }
  });
}

// ===============================
// TABLE
// ===============================

function renderTable(data) {

  const tableHead =
    document.querySelector('#dataTable thead');

  const tableBody =
    document.querySelector('#dataTable tbody');

  const headers = Object.keys(data[0]);

  tableHead.innerHTML = `
    <tr>
      ${headers.map(h => `<th>${h}</th>`).join('')}
    </tr>
  `;

  tableBody.innerHTML = data.slice(0, 20)
    .map(row => `
      <tr>
        ${headers.map(h => `<td>${row[h]}</td>`).join('')}
      </tr>
    `).join('');
}
