import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    Switch,
    FormControlLabel,
    Grid,
    Card,
    CardContent,
    Alert,
    Snackbar,
    CircularProgress,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Avatar,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Visibility as ViewIcon,
    ExpandMore as ExpandMoreIcon,
    LocalShipping as ShippingIcon,
    Payment as PaymentIcon,
    Person as PersonIcon,
    ShoppingCart as CartIcon,
    TrendingUp as TrendingUpIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { apiService } from '../services/apiService';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [showFilters, setShowFilters] = useState(false);
    const [summary, setSummary] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        status: 'pending',
        paymentStatus: 'pending',
        priority: 'normal',
        shippingDetails: {
            trackingNumber: '',
            carrier: '',
            estimatedDelivery: ''
        },
        notes: {
            admin: ''
        },
        tags: []
    });

    useEffect(() => {
        fetchOrders();
    }, [page, rowsPerPage, searchTerm, statusFilter, paymentStatusFilter, priorityFilter, dateFrom, dateTo]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page + 1,
                limit: rowsPerPage,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && { status: statusFilter }),
                ...(paymentStatusFilter && { paymentStatus: paymentStatusFilter }),
                ...(priorityFilter && { priority: priorityFilter }),
                ...(dateFrom && { dateFrom }),
                ...(dateTo && { dateTo })
            });

            const response = await apiService.get(`/crm/orders?${params}`);
            
            if (response.success) {
                setOrders(response.data);
                setTotalOrders(response.pagination.total);
                setSummary(response.summary || {});
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            showSnackbar('Failed to fetch orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewOrder = (order) => {
        setEditingOrder(order);
        setFormData({
            status: order.status,
            paymentStatus: order.paymentStatus,
            priority: order.priority,
            shippingDetails: order.shippingDetails || {
                trackingNumber: '',
                carrier: '',
                estimatedDelivery: ''
            },
            notes: order.notes || { admin: '' },
            tags: order.tags || []
        });
        setDialogOpen(true);
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        setFormData({
            status: order.status,
            paymentStatus: order.paymentStatus,
            priority: order.priority,
            shippingDetails: order.shippingDetails || {
                trackingNumber: '',
                carrier: '',
                estimatedDelivery: ''
            },
            notes: order.notes || { admin: '' },
            tags: order.tags || []
        });
        setDialogOpen(true);
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                const response = await apiService.delete(`/crm/orders/${orderId}`);
                if (response.success) {
                    showSnackbar('Order deleted successfully', 'success');
                    fetchOrders();
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                showSnackbar('Failed to delete order', 'error');
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const orderData = {
                ...formData,
                shippingDetails: {
                    ...formData.shippingDetails,
                    estimatedDelivery: formData.shippingDetails.estimatedDelivery ? new Date(formData.shippingDetails.estimatedDelivery).toISOString() : null
                }
            };

            const response = await apiService.put(`/crm/orders/${editingOrder._id}`, orderData);

            if (response.success) {
                showSnackbar('Order updated successfully', 'success');
                setDialogOpen(false);
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            showSnackbar('Failed to update order', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            confirmed: 'info',
            processing: 'primary',
            shipped: 'secondary',
            out_for_delivery: 'secondary',
            delivered: 'success',
            cancelled: 'error',
            returned: 'error'
        };
        return colors[status] || 'default';
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            paid: 'success',
            failed: 'error',
            refunded: 'info',
            partially_refunded: 'info'
        };
        return colors[status] || 'default';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'success',
            normal: 'primary',
            high: 'warning',
            urgent: 'error'
        };
        return colors[priority] || 'default';
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setPaymentStatusFilter('');
        setPriorityFilter('');
        setDateFrom('');
        setDateTo('');
        setPage(0);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Orders
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <CartIcon color="primary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">{summary.totalOrders || 0}</Typography>
                                    <Typography variant="body2" color="textSecondary">Total Orders</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">{formatPrice(summary.totalRevenue || 0)}</Typography>
                                    <Typography variant="body2" color="textSecondary">Total Revenue</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <PaymentIcon color="info" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">{formatPrice(summary.averageOrderValue || 0)}</Typography>
                                    <Typography variant="body2" color="textSecondary">Avg Order Value</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <ShippingIcon color="secondary" sx={{ mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">{summary.statusBreakdown?.pending || 0}</Typography>
                                    <Typography variant="body2" color="textSecondary">Pending Orders</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters */}
            {showFilters && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    label="Status"
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="confirmed">Confirmed</MenuItem>
                                    <MenuItem value="processing">Processing</MenuItem>
                                    <MenuItem value="shipped">Shipped</MenuItem>
                                    <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                                    <MenuItem value="delivered">Delivered</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                    <MenuItem value="returned">Returned</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Payment Status</InputLabel>
                                <Select
                                    value={paymentStatusFilter}
                                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                                    label="Payment Status"
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="paid">Paid</MenuItem>
                                    <MenuItem value="failed">Failed</MenuItem>
                                    <MenuItem value="refunded">Refunded</MenuItem>
                                    <MenuItem value="partially_refunded">Partially Refunded</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    label="Priority"
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="normal">Normal</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                    <MenuItem value="urgent">Urgent</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                type="date"
                                label="From Date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={1}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={clearFilters}
                                size="small"
                            >
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Orders Table */}
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order #</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payment</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {order.orderNumber}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                                <PersonIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2">
                                                    {order.customerName || 'Unknown Customer'}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {order.user?.email || 'No email'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {order.items?.length || 0} items
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {formatPrice(order.totalAmount)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.paymentStatus}
                                            color={getPaymentStatusColor(order.paymentStatus)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.priority}
                                            color={getPriorityColor(order.priority)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatDate(order.createdAt)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleViewOrder(order)}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEditOrder(order)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteOrder(order._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalOrders}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </Paper>

            {/* View/Edit Order Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingOrder ? `Order ${editingOrder.orderNumber}` : 'New Order'}
                </DialogTitle>
                <DialogContent>
                    {editingOrder && (
                        <Box>
                            {/* Order Details */}
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">Order Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2">Order Number</Typography>
                                            <Typography variant="body1">{editingOrder.orderNumber}</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2">Customer</Typography>
                                            <Typography variant="body1">
                                                {editingOrder.customerName || 'Unknown Customer'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2">Total Amount</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {formatPrice(editingOrder.totalAmount)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2">Created Date</Typography>
                                            <Typography variant="body1">{formatDate(editingOrder.createdAt)}</Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            {/* Order Items */}
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">Order Items</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {editingOrder.items?.map((item, index) => (
                                        <Box key={index} mb={2} p={2} border={1} borderColor="divider" borderRadius={1}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle2">
                                                        {item.product?.name || 'Product Name'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <Typography variant="body2">Qty: {item.quantity}</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <Typography variant="body2">Price: {formatPrice(item.price)}</Typography>
                                                </Grid>
                                                <Grid item xs={12} md={2}>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        Total: {formatPrice(item.totalPrice)}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                </AccordionDetails>
                            </Accordion>

                            <Divider sx={{ my: 2 }} />

                            {/* Update Order Form */}
                            <Typography variant="h6" gutterBottom>Update Order</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Order Status</InputLabel>
                                        <Select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            label="Order Status"
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="confirmed">Confirmed</MenuItem>
                                            <MenuItem value="processing">Processing</MenuItem>
                                            <MenuItem value="shipped">Shipped</MenuItem>
                                            <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                                            <MenuItem value="delivered">Delivered</MenuItem>
                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                            <MenuItem value="returned">Returned</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Payment Status</InputLabel>
                                        <Select
                                            value={formData.paymentStatus}
                                            onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                            label="Payment Status"
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="paid">Paid</MenuItem>
                                            <MenuItem value="failed">Failed</MenuItem>
                                            <MenuItem value="refunded">Refunded</MenuItem>
                                            <MenuItem value="partially_refunded">Partially Refunded</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Priority</InputLabel>
                                        <Select
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            label="Priority"
                                        >
                                            <MenuItem value="low">Low</MenuItem>
                                            <MenuItem value="normal">Normal</MenuItem>
                                            <MenuItem value="high">High</MenuItem>
                                            <MenuItem value="urgent">Urgent</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Tracking Number"
                                        value={formData.shippingDetails.trackingNumber}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            shippingDetails: {
                                                ...formData.shippingDetails,
                                                trackingNumber: e.target.value
                                            }
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Carrier"
                                        value={formData.shippingDetails.carrier}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            shippingDetails: {
                                                ...formData.shippingDetails,
                                                carrier: e.target.value
                                            }
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Estimated Delivery"
                                        value={formData.shippingDetails.estimatedDelivery}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            shippingDetails: {
                                                ...formData.shippingDetails,
                                                estimatedDelivery: e.target.value
                                            }
                                        })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Admin Notes"
                                        value={formData.notes.admin}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            notes: {
                                                ...formData.notes,
                                                admin: e.target.value
                                            }
                                        })}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Update Order
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Orders; 