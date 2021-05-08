let modal = document.querySelector(".modal-overlay");
const Modal = {
	toggleOpen() {
		modal.classList.toggle("on");
	},
};

const Transaction = {
	all: [
		{
			description: "Luz",
			amount: -50000,
			date: "23/01/2021",
		},
		{
			description: "Comision",
			amount: 3000,
			date: "23/01/2021",
		},
		{
			description: "Internet",
			amount: -20000,
			date: "23/01/2021",
		},
	],
	add(transaction) {
		Transaction.all.push(transaction);
		App.reload();
	},
	remove(index) {
		Transaction.all.splice(index, 1);

		App.reload();
	},

	incomes() {
		let income = 0;
		Transaction.all.forEach((transaction) => {
			if (transaction.amount > 0) {
				income += transaction.amount;
			}
		});

		return income;
	},
	expenses() {
		let expense = 0;
		Transaction.all.forEach((transaction) => {
			if (transaction.amount < 0) {
				expense += transaction.amount;
			}
		});

		return expense;
	},
	total() {
		return Transaction.incomes() + Transaction.expenses();
	},
};

const DOM = {
	transactionsContainer: document.querySelector(".transactions-list tbody"),
	addTransaction(transaction, index) {
		const tr = document.createElement(`tr`);
		tr.dataset.index = index;
		tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);

		DOM.transactionsContainer.appendChild(tr);
	},
	innerHTMLTransaction(transaction, index) {
		const CSSclass = transaction.amount > 0 ? "income" : "expense";

		const amount = Utils.formatCurrency(transaction.amount);

		const html = `
        <td class="desc">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td class="remove"><img src="./src/remove.svg" alt="Remover Transação" onclick="Transaction.remove(${index})"></td>
        `;

		return html;
	},

	updateBalence() {
		document.getElementById(
			"income-display"
		).innerHTML = Utils.formatCurrency(Transaction.incomes());
		document.getElementById(
			"expense-display"
		).innerHTML = Utils.formatCurrency(Transaction.expenses());
		document.getElementById(
			"total-display"
		).innerHTML = Utils.formatCurrency(Transaction.total());
	},

	clearTransactions() {
		DOM.transactionsContainer.innerHTML = "";
	},
};

const Utils = {
	formatCurrency(value) {
		const signal = Number(value) < 0 ? "-" : "";
		value = String(value).replace(/\D/g, "");
		value = Number(value) / 100;
		value = value.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
		});

		return signal + " " + value;
	},

	formatAmount(value) {
		value = Number(value) * 100;

		return value;
	},
	formatDate(date) {
		const splittedDate = date.split("-");
		return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
	},
};

const Form = {
	description: document.querySelector("input#desc"),
	amount: document.querySelector("input#amount"),
	date: document.querySelector("input#date"),

	getValues() {
		return {
			description: Form.description.value,
			amount: Form.amount.value,
			date: Form.date.value,
		};
	},

	formatValues() {
		let { description, amount, date } = Form.getValues();
		amount = Utils.formatAmount(amount);
		date = Utils.formatDate(date);

		return {
			description,
			amount,
			date,
		};
	},
	validateFields() {
		const { description, amount, date } = Form.getValues();
		if (
			description.trim() === "" ||
			amount.trim() === "" ||
			date.trim() === ""
		) {
			throw new Error("Por favor, preencha todos os campos");
		}
	},
	clearFields() {
		Form.description.value = "";
		Form.amount.value = "";
		Form.date.value = "";
	},

	submit(event) {
		event.preventDefault();

		try {
			Form.validateFields();
			const transaction = Form.formatValues();
			Transaction.add(transaction);
			Form.clearFields();
			Modal.toggleOpen();
		} catch (error) {
			alert(error.message);
		}
	},
};

const App = {
	init() {
		Transaction.all.forEach(DOM.addTransaction);

		DOM.updateBalence();
	},
	reload() {
		DOM.clearTransactions();
		App.init();
	},
};

App.init();
