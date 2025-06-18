import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Chip,
    Avatar,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    DataGrid,
    GridActionsCellItem
} from '@mui/x-data-grid';
import {
    Visibility,
    Edit,
    Delete,
    Person
} from '@mui/icons-material';
import { apiService } from '../services/apiService';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/crm/customers');
            
            console.log('API Response:', response); // Debug log
            
            if (response.success) {
                // Ensure each customer has an id field for DataGrid
                const customersWithId = response.data.map(customer => ({
                    ...customer,
                    id: customer._id // Add id field for DataGrid
                }));
                setCustomers(customersWithId);
            } else {
                setError(response.message);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
            valueGetter: (params) => {
                console.log('ID params:', params); // Debug log
                return params.row?._id || params.row?.id || 'N/A';
            }
        },
        {
            field: 'profileImage',
            headerName: 'Avatar',
            width: 100,
            renderCell: (params) => (
                <Avatar src={params.value}>
                    <Person />
                </Avatar>
            )
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            flex: 1
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250
        },
        {
            field: 'mobileNumber',
            headerName: 'Mobile',
            width: 150
        },
        {
            field: 'role',
            headerName: 'Role',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value || 'N/A'}
                    color={params.value === 'user' ? 'primary' : 'secondary'}
                    size="small"
                />
            )
        },
        {
            field: 'isActive',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Active' : 'Inactive'}
                    color={params.value ? 'success' : 'error'}
                    size="small"
                />
            )
        },
        {
            field: 'createdAt',
            headerName: 'Joined',
            width: 150,
            valueGetter: (params) => formatDate(params.value)
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<Tooltip title="View Details"><Visibility /></Tooltip>}
                    label="View"
                    onClick={() => handleView(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="Edit Customer"><Edit /></Tooltip>}
                    label="Edit"
                    onClick={() => handleEdit(params.row)}
                />,
                <GridActionsCellItem
                    icon={<Tooltip title="Delete Customer"><Delete /></Tooltip>}
                    label="Delete"
                    onClick={() => handleDelete(params.row)}
                />
            ]
        }
    ];

    const handleView = (customer) => {
        console.log('View customer:', customer);
        // TODO: Implement view customer details
    };

    const handleEdit = (customer) => {
        console.log('Edit customer:', customer);
        // TODO: Implement edit customer
    };

    const handleDelete = (customer) => {
        console.log('Delete customer:', customer);
        // TODO: Implement delete customer
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h4" gutterBottom>
                Customers
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Manage all customer accounts ({customers.length} customers)
            </Typography>
            
            <Paper sx={{ height: 500, width: '100%', mt: 2 }}>
                <DataGrid
                    rows={customers}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    getRowId={(row) => row._id || row.id}
                    sx={{
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none'
                        }
                    }}
                />
            </Paper>
        </Box>
    );
};

export default Customers; 