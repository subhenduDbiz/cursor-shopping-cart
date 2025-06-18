import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CardHeader
} from '@mui/material';
import {
    People,
    ShoppingCart,
    Inventory,
    TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        {
            title: 'Total Customers',
            value: '1,234',
            icon: <People />,
            color: '#1976d2'
        },
        {
            title: 'Total Orders',
            value: '567',
            icon: <ShoppingCart />,
            color: '#388e3c'
        },
        {
            title: 'Products',
            value: '89',
            icon: <Inventory />,
            color: '#f57c00'
        },
        {
            title: 'Revenue',
            value: '$12,345',
            icon: <TrendingUp />,
            color: '#7b1fa2'
        }
    ];

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                Welcome back, {user?.name}!
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <Box>
                                        <Typography color="textSecondary" gutterBottom>
                                            {stat.title}
                                        </Typography>
                                        <Typography variant="h4" component="div">
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            color: stat.color,
                                            fontSize: 40
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activity
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            No recent activity to display.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Quick actions will be available here.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 