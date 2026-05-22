// =====================================
// GOOGLE SHEETS CSV URL
// =====================================

const CSV_URL =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSk_BOFEPDad7eFLLlOJM68OsxuOPK9lADl60u1RvHbEct1E4LC3BfknP16oj7ef_jsv1mjQeCNjAt-/pub?gid=490700574&single=true&output=csv';

// =====================================
// LOAD GOOGLE SHEETS DATA
// =====================================

Papa.parse(CSV_URL, {

  download: true,

  header: true,

  complete: function(results) {

    const data = results.data;

    console.log(data);

    renderDashboard(data);
  }
});

// =====================================
// MAIN DASHBOARD FUNCTION
// =====================================

function renderDashboard(data) {

  if (!data.length) return;

  const columns = Object.keys(data[0]);

  // =====================================
  // AUTO DETECT COLUMNS
  // =====================================

  const statusKey = findColumn(columns, [
    'status',
    'task status'
  ]);

  const employeeKey = findColumn(columns, [
    'employee',
    'assigned',
    'staff',
    'person'
  ]);

  const priorityKey = findColumn(columns, [
    'priority'
  ]);

  // =====================================
  // COUNTERS
  // =====================================

  let completed = 0;
  let pending = 0;
  let progress = 0;

  const employeeTasks = {};
  const priorityCount = {};

  // =====================================
  // PROCESS DATA
  // =====================================

  data.forEach(row => {

    const status =
      (row[statusKey] || '').toLowerCase();

    const employee =
      row[employeeKey] || 'Unknown';

    const priority =
      row[priorityKey] || 'Normal';

    // TASK STATUS

    if (status.includes('complete')) {

      completed++;

    } else if (status.includes('pending')) {

      pending++;

    } else {

      progress++;
    }

    // EMPLOYEE PRODUCTIVITY

    employeeTasks[employee] =
      (employeeTasks[employee] || 0) + 1;

    // PRIORITY

    priorityCount[priority] =
      (priorityCount[priority] || 0) + 1;
  });

  // =====================================
  // UPDATE KPI CARDS
  // =====================================

  document.getElementById('totalTasks')
    .innerText = data.length;

  document.getElementById('completedTasks')
    .innerText = completed;

  document.getElementById('pendingTasks')
    .innerText = pending;

  document.getElementById('progressTasks')
    .innerText = progress;

  // =====================================
  // CREATE CHARTS
  // =====================================

  createStatusChart(completed,
                    pending,
                    progress);

  createEmployeeChart(employeeTasks);

  createPriorityChart(priorityCount);

  // =====================================
  // TABLE
  // =====================================

  renderTable(data);
}

// =====================================
// FIND COLUMN
// =====================================

function findColumn(columns, keywords) {

  return columns.find(col =>

    keywords.some(keyword =>

      col.toLowerCase().includes(keyword)

    )
  );
}

// =====================================
// STATUS CHART
// =====================================

function createStatusChart(completed,
                           pending,
                           progress) {

  new Chart(

    document.getElementById('statusChart'),

    {

      type: 'doughnut',

      data: {

        labels: [
          'Completed',
          'Pending',
          'In Progress'
        ],

        datasets: [{

          data: [
            completed,
            pending,
            progress
          ]
        }]
      },

      options: {

        responsive: true,

        plugins: {

          legend: {

            labels: {
              color: 'white'
            }
          }
        }
      }
    }
  );
}

// =====================================
// EMPLOYEE PRODUCTIVITY CHART
// =====================================

function createEmployeeChart(employeeTasks) {

  new Chart(

    document.getElementById('employeeChart'),

    {

      type: 'bar',

      data: {

        labels:
          Object.keys(employeeTasks),

        datasets: [{

          label: 'Tasks',

          data:
            Object.values(employeeTasks)
        }]
      },

      options: {

        responsive: true,

        plugins: {

          legend: {

            labels: {
              color: 'white'
            }
          }
        },

        scales: {

          x: {

            ticks: {
              color: 'white'
            }
          },

          y: {

            ticks: {
              color: 'white'
            }
          }
        }
      }
    }
  );
}

// =====================================
// PRIORITY CHART
// =====================================

function createPriorityChart(priorityCount) {

  new Chart(

    document.getElementById('priorityChart'),

    {

      type: 'pie',

      data: {

        labels:
          Object.keys(priorityCount),

        datasets: [{

          data:
            Object.values(priorityCount)
        }]
      },

      options: {

        responsive: true,

        plugins: {

          legend: {

            labels: {
              color: 'white'
            }
          }
        }
      }
    }
  );
}

// =====================================
// TABLE
// =====================================

function renderTable(data) {

  const tableHead =
    document.querySelector('#dataTable thead');

  const tableBody =
    document.querySelector('#dataTable tbody');

  const headers = Object.keys(data[0]);

  // TABLE HEADERS

  tableHead.innerHTML = `
    <tr>
      ${headers.map(header =>
        `<th>${header}</th>`
      ).join('')}
    </tr>
  `;

  // TABLE ROWS

  tableBody.innerHTML = data
    .slice(0, 50)
    .map(row => `
      <tr>
        ${headers.map(header =>
          `<td>${row[header]}</td>`
        ).join('')}
      </tr>
    `)
    .join('');
}
