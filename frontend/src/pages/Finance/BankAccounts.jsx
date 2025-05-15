import React, { useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    branch: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (
      formData.accountName &&
      formData.accountNumber &&
      formData.bankName &&
      formData.branch
    ) {
      setAccounts([...accounts, formData]);
      setFormData({
        accountName: "",
        accountNumber: "",
        bankName: "",
        branch: "",
      });
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <Container>
      <h2 className="mb-4">Bank Account Management</h2>

      {/* Add Account Form */}
      <Form onSubmit={handleAddAccount}>
        <Form.Group className="mb-3">
          <Form.Label>Account Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter account name"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Account Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter account number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bank Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter bank name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Branch</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Account
        </Button>
      </Form>

      {/* Accounts Table */}
      {accounts.length > 0 && (
        <>
          <h4 className="mt-5">Bank Accounts List</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Account Name</th>
                <th>Account Number</th>
                <th>Bank Name</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{acc.accountName}</td>
                  <td>{acc.accountNumber}</td>
                  <td>{acc.bankName}</td>
                  <td>{acc.branch}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default BankAccounts;
