import { useState, useEffect } from 'react';
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
  Alert,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { getExpenses, addExpense } from '../services/expenseService';

function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);

  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [editingExpense, setEditingExpense] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [error, setError] = useState('');

  const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Others'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to fetch expenses');
    }
  };

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

  const handleAddExpense = async () => {
    if (newExpense.title && newExpense.amount && newExpense.category) {
      try {
        const expenseData = {
          title: newExpense.title,
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          date: newExpense.date,
        };
        
        console.log('Sending expense data:', expenseData);
        const createdExpense = await addExpense(expenseData);
        console.log('Response:', createdExpense);
        
        setExpenses(prev => [...prev, createdExpense]);
        setError('');
        
        // Reset form
        setNewExpense({
          title: '',
          amount: '',
          category: '',
          date: new Date().toISOString().split('T')[0],
        });
      } catch (error) {
        console.error('Error adding expense:', error);
        setError('Failed to add expense. Please try again.');
      }
    } else {
      setError('Please fill in all required fields');
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
    : expenses.filter(expense => expense.category_name === filterCategory);

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

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
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* Add Expense Form */}
          <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="Expense Name"
              name="title"
              value={newExpense.title}
              onChange={handleInputChange}
              size="small"
              required
            />
            <TextField
              label="Amount (₹)"
              name="amount"
              type="number"
              value={newExpense.amount}
              onChange={handleInputChange}
              size="small"
              required
            />
            <FormControl size="small" required sx={{ minWidth: 120 }}>
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
              required
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
                    <TableCell>{expense.title}</TableCell>
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
                  name="title"
                  value={editingExpense?.title || ''}
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