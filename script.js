document.addEventListener('DOMContentLoaded', () => {
  const trackerKey = 'off-efficiency-tracker';
  const savedState = JSON.parse(localStorage.getItem(trackerKey) || '{}');

  const getRowKey = (row) => {
    const categoryId = row.closest('.category')?.id || 'unknown-category';
    return `${categoryId}:${row.dataset.label}`;
  };

  const state = {};

  document.querySelectorAll('.label-row').forEach((row) => {
    const key = getRowKey(row);
    state[key] = {
      yes: Number(savedState[key]?.yes || 0),
      no: Number(savedState[key]?.no || 0),
    };

    const yesCountEl = row.querySelector('.yes-count');
    const noCountEl = row.querySelector('.no-count');
    const efficiencyEl = row.querySelector('.cat-efficiency');
    const yesBtn = row.querySelector('.yes-btn');
    const noBtn = row.querySelector('.no-btn');
    const resetBtn = row.querySelector('.reset-label-btn');

    const saveState = () => {
      localStorage.setItem(trackerKey, JSON.stringify(state));
    };

    const renderRow = () => {
      const yes = Number(state[key].yes || 0);
      const no = Number(state[key].no || 0);
      const total = yes + no;
      const efficiency = total ? (yes / total) * 100 : 0;

      yesCountEl.textContent = yes;
      noCountEl.textContent = no;
      efficiencyEl.textContent = `${Math.round(efficiency)}%`;
    };

    const renderSummary = () => {
      let totalYes = 0;
      let totalNo = 0;

      document.querySelectorAll('.label-row').forEach((item) => {
        const itemKey = getRowKey(item);
        totalYes += Number(state[itemKey]?.yes || 0);
        totalNo += Number(state[itemKey]?.no || 0);
      });

      const total = totalYes + totalNo;
      const totalEfficiency = total ? (totalYes / total) * 100 : 0;

      document.querySelector('#totalYes').textContent = totalYes;
      document.querySelector('#totalNo').textContent = totalNo;
      document.querySelector('#efficiency').textContent = `${Math.round(totalEfficiency)}%`;
    };

    yesBtn.addEventListener('click', () => {
      state[key].yes += 1;
      saveState();
      renderRow();
      renderSummary();
    });

    noBtn.addEventListener('click', () => {
      state[key].no += 1;
      saveState();
      renderRow();
      renderSummary();
    });

    resetBtn.addEventListener('click', () => {
      state[key].yes = 0;
      state[key].no = 0;
      saveState();
      renderRow();
      renderSummary();
    });

    renderRow();
  });

  document.getElementById('resetBtn')?.addEventListener('click', () => {
    document.querySelectorAll('.label-row').forEach((row) => {
      const key = getRowKey(row);
      state[key].yes = 0;
      state[key].no = 0;
      row.querySelector('.yes-count').textContent = 0;
      row.querySelector('.no-count').textContent = 0;
      row.querySelector('.cat-efficiency').textContent = '0%';
    });

    localStorage.setItem(trackerKey, JSON.stringify(state));

    document.querySelector('#totalYes').textContent = 0;
    document.querySelector('#totalNo').textContent = 0;
    document.querySelector('#efficiency').textContent = '0%';
  });

  const summaryTotal = document.querySelector('#efficiency');
  if (summaryTotal) {
    summaryTotal.textContent = '0%';
  }

  document.querySelectorAll('.label-row').forEach((row) => {
    const key = getRowKey(row);
    if (!state[key]) {
      state[key] = { yes: 0, no: 0 };
    }
  });

  const totalYesEl = document.querySelector('#totalYes');
  const totalNoEl = document.querySelector('#totalNo');
  const totalEffEl = document.querySelector('#efficiency');

  if (totalYesEl && totalNoEl && totalEffEl) {
    let totalYes = 0;
    let totalNo = 0;

    document.querySelectorAll('.label-row').forEach((row) => {
      const key = getRowKey(row);
      totalYes += Number(state[key]?.yes || 0);
      totalNo += Number(state[key]?.no || 0);
    });

    const total = totalYes + totalNo;
    const totalEfficiency = total ? (totalYes / total) * 100 : 0;

    totalYesEl.textContent = totalYes;
    totalNoEl.textContent = totalNo;
    totalEffEl.textContent = `${Math.round(totalEfficiency)}%`;
  }
});
