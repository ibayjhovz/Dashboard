const CSV_URL =
        }]
      }
    }
  );
}

function createPriorityChart(priorityCount) {

  new Chart(
    document.getElementById('priorityChart'),
    {
      type: 'pie',

      data: {
        labels: Object.keys(priorityCount),

        datasets: [{
          data: Object.values(priorityCount),

          backgroundColor: [
            '#ef4444',
            '#f59e0b',
            '#22c55e',
            '#3b82f6'
          ]
        }]
      }
    }
  );
}

function renderTable(data) {

  const tableHead =
    document.querySelector('#dataTable thead');

  const tableBody =
    document.querySelector('#dataTable tbody');

  const headers = Object.keys(data[0]);

  tableHead.innerHTML = `
    <tr>
      ${headers.map(header =>
        `<th>${header}</th>`).join('')}
    </tr>
  `;

  tableBody.innerHTML = data
    .slice(0, 100)
    .map(row => `
      <tr>
        ${headers.map(header =>
          `<td>${row[header]}</td>`).join('')}
      </tr>
    `)
    .join('');
}
