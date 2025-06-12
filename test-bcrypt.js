const bcrypt = require('bcryptjs');

async function testBcrypt() {
    try {
        // Test password
        const password = 'testPassword123';
        
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        console.log('Salt generated successfully');
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Password hashed successfully');
        console.log('Hashed password:', hashedPassword);
        
        // Verify password
        const isMatch = await bcrypt.compare(password, hashedPassword);
        console.log('Password verification:', isMatch ? 'Success' : 'Failed');
        
        // Test wrong password
        const wrongMatch = await bcrypt.compare('wrongPassword', hashedPassword);
        console.log('Wrong password verification:', wrongMatch ? 'Success' : 'Failed');
        
    } catch (error) {
        console.error('Error testing bcrypt:', error);
    }
}

testBcrypt(); 