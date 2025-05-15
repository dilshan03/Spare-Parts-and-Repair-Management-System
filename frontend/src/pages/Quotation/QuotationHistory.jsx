import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const QuotationHistory = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");//RY
    axios.get('http://localhost:5000/api/quotations', {//RT
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setQuotations(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");//RY
    axios.delete(`http://localhost:5000/api/quotations/${id}`, {//RT
      headers: { Authorization: `Bearer ${token}` }
    })//RY
      .then(() => setQuotations(quotations.filter(q => q._id !== id)))
      .catch(err => console.log(err));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer Name</TableCell>
            <TableCell>Vehicle Number</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quotations.map(q => (
            <TableRow key={q._id}>
              <TableCell>{q.customerName}</TableCell>
              <TableCell>{q.vehicleNumber}</TableCell>
              <TableCell>{q.totalAmount}</TableCell>
              <TableCell>
                <Button onClick={() => handleDelete(q._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuotationHistory;