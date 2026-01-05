const express=require('express');
const cors=require('cors');
const invoiceRoutes=require('./routes/invoice.routes');
const paymentRoutes=require('./routes/payment.routes');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/invoices', invoiceRoutes);
app.use('/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));