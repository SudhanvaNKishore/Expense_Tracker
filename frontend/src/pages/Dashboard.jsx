import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';

function Dashboard() {
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Travel', amount: 50.00, category: 'Transport', date: '2024-07-21' },
    { id: 2, name: 'Maggi', amount: 20.00, category: 'Food', date: '2024-07-15' },
  ]);

  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [editingExpense, setEditingExpense] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Others'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.category) {
      setExpenses(prev => [...prev, {
        id: Date.now(),
        ...newExpense
      }]);
      setNewExpense({
        name: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (editingExpense) {
      setExpenses(prev =>
        prev.map(expense =>
          expense.id === editingExpense.id ? editingExpense : expense
        )
      );
      setIsEditModalOpen(false);
      setEditingExpense(null);
    }
  };

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const filteredExpenses = filterCategory === 'All'
    ? expenses
    : expenses.filter(expense => expense.category === filterCategory);

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const iconButtonSx = {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:focus': {
      outline: 'none',
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Add Expense Form */}
          <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="Expense Name"
              name="name"
              value={newExpense.name}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              label="Amount (₹)"
              name="amount"
              type="number"
              value={newExpense.amount}
              onChange={handleInputChange}
              size="small"
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={newExpense.category}
                name="category"
                label="Category"
                onChange={handleInputChange}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              type="date"
              name="date"
              value={newExpense.date}
              onChange={handleInputChange}
              size="small"
              sx={{
                '& input': {
                  padding: '8.5px 14px',
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddExpense}
              sx={{
                bgcolor: '#4CAF50',
                '&:hover': { bgcolor: '#45a049' },
              }}
            >
              Add Expense
            </Button>
          </Paper>

          {/* Filter and Total */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={filterCategory}
                label="Filter by Category"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="h6">
              Total: ₹{totalAmount.toFixed(2)}
            </Typography>
          </Box>

          {/* Expenses Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Expense Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.name}</TableCell>
                    <TableCell>₹{expense.amount}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(expense)}
                        sx={iconButtonSx}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(expense.id)}
                        sx={iconButtonSx}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Edit Modal */}
          <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Expense Name"
                  name="name"
                  value={editingExpense?.name || ''}
                  onChange={handleEditInputChange}
                  fullWidth
                />
                <TextField
                  label="Amount (₹)"
                  name="amount"
                  type="number"
                  value={editingExpense?.amount || ''}
                  onChange={handleEditInputChange}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editingExpense?.category || ''}
                    name="category"
                    label="Category"
                    onChange={handleEditInputChange}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="date"
                  name="date"
                  value={editingExpense?.date || ''}
                  onChange={handleEditInputChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleEditSave} variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard; 