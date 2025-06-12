import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Deals = () => {
    const [deals, setDeals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDeals();
    }, [currentPage]);

    const fetchDeals = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/deals?page=${currentPage}&limit=10`);
            setDeals(res.data.deals);
            setTotalPages(res.data.totalPages);
            setError('');
        } catch (err) {
            setError('Failed to fetch deals');
            console.error('Error fetching deals:', err);
        } finally {
            setLoading(false);
        }
    };

    const pageStyle = {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const dealsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
    };

    const dealCardStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '4px',
        marginBottom: '10px'
    };

    const titleStyle = {
        fontSize: '1.2em',
        fontWeight: 'bold',
        marginBottom: '10px'
    };

    const priceStyle = {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '10px'
    };

    const originalPriceStyle = {
        textDecoration: 'line-through',
        color: '#666'
    };

    const discountedPriceStyle = {
        color: '#e53935',
        fontWeight: 'bold'
    };

    const discountBadgeStyle = {
        backgroundColor: '#e53935',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.9em'
    };

    const paginationStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px'
    };

    const pageButtonStyle = {
        padding: '8px 16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff',
        cursor: 'pointer'
    };

    const activePageButtonStyle = {
        ...pageButtonStyle,
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none'
    };

    if (loading) return <div style={pageStyle}>Loading...</div>;
    if (error) return <div style={pageStyle}>{error}</div>;

    return (
        <div style={pageStyle}>
            <h1>Special Deals</h1>
            <div style={dealsGridStyle}>
                {deals.map(deal => (
                    <div key={deal._id} style={dealCardStyle}>
                        <img src={deal.image} alt={deal.title} style={imageStyle} />
                        <h2 style={titleStyle}>{deal.title}</h2>
                        <p>{deal.description}</p>
                        <div style={priceStyle}>
                            <span style={originalPriceStyle}>${deal.originalPrice}</span>
                            <span style={discountedPriceStyle}>${deal.discountedPrice}</span>
                            <span style={discountBadgeStyle}>{deal.discountPercentage}% OFF</span>
                        </div>
                        <p>Valid until: {new Date(deal.endDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
            <div style={paginationStyle}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={currentPage === pageNum ? activePageButtonStyle : pageButtonStyle}
                    >
                        {pageNum}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Deals; 