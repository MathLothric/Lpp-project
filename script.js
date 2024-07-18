document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expensesList = document.getElementById('expenses-list');
    const totalAmount = document.getElementById('total-amount');
    const filterCategory = document.getElementById('filter-category');
    const ctx = document.getElementById('expense-chart').getContext('2d');
    let chart;
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    const saveExpenses = () => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    };

    const updateExpensesList = () => {
        const selectedCategory = filterCategory.value;
        expensesList.innerHTML = '';
        expenses
            .filter(expense => selectedCategory === 'todas' || expense.category === selectedCategory)
            .forEach((expense, index) => {
                const expenseItem = document.createElement('div');
                expenseItem.className = 'expense-item';
                expenseItem.innerHTML = `
                    ${expense.name} - R$${expense.amount.toFixed(2)} (${expense.category})
                    <button onclick="removeExpense(${index})">Remover</button>
                `;
                expensesList.appendChild(expenseItem);
            });
    };

    const updateTotalAmount = () => {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    };

    const updateChart = () => {
        const categories = ['salario', 'equipamento', 'medicamento', 'outros'];
        const categorySums = categories.map(category =>
            expenses.filter(expense => expense.category === category)
                    .reduce((sum, expense) => sum + expense.amount, 0)
        );

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Despesas por Categoria',
                    data: categorySums,
                    backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    const removeExpense = (index) => {
        expenses.splice(index, 1);
        saveExpenses();
        updateExpensesList();
        updateTotalAmount();
        updateChart();
    };

    window.removeExpense = removeExpense;

    const loadExpenses = () => {
        expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        updateExpensesList();
        updateTotalAmount();
        updateChart();
    };

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const expense = { name, amount, category };

        expenses.push(expense);
        saveExpenses();
        updateExpensesList();
        updateTotalAmount();
        updateChart();
        expenseForm.reset();
    });

    filterCategory.addEventListener('change', updateExpensesList);

    loadExpenses();
});
