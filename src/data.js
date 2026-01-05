const db = require('./db');

function listInvoices() {
	const stmt = db.prepare('SELECT id, amount, status, customer, due_date, description, created_at FROM invoices ORDER BY created_at DESC');
	return stmt.all();
}

function getInvoiceById(id) {
	const stmt = db.prepare('SELECT id, amount, status, customer, due_date, description, created_at FROM invoices WHERE id = ?');
	return stmt.get(id);
}

function createInvoice(inv) {
	const stmt = db.prepare('INSERT INTO invoices (id, amount, status, customer, due_date, description) VALUES (?, ?, ?, ?, ?, ?)');
	stmt.run(inv.id, inv.amount, inv.status || 'PENDING', inv.customer || null, inv.due_date || null, inv.description || null);
	return getInvoiceById(inv.id);
}

function deleteInvoice(id) {
	const stmt = db.prepare('DELETE FROM invoices WHERE id = ?');
	const info = stmt.run(id);
	return info.changes > 0;
}

function addPayment(payment) {
	const stmt = db.prepare('INSERT INTO payments (id, invoiceId, amount, status, date, card_last4, card_name, card_expiry) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
	stmt.run(payment.id, payment.invoiceId, payment.amount, payment.status, payment.date, payment.card ? payment.card.last4 : null, payment.card ? payment.card.name : null, payment.card ? payment.card.expiry : null);
	return payment;
}

module.exports = { listInvoices, getInvoiceById, createInvoice, deleteInvoice, addPayment };