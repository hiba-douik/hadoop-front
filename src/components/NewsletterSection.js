import React, { useState } from 'react';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setMessage(`Merci pour votre inscription, ${email}!`);
            setEmail('');
        } else {
            setMessage('Veuillez entrer une adresse email valide.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Inscrivez-vous à notre Newsletter</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input 
                    type="email" 
                    placeholder="Votre adresse email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>S'inscrire</button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f8f8f8',
        padding: '20px',
        borderRadius: '5px',
        margin: '20px 0',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        padding: '10px',
        marginRight: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    message: {
        marginTop: '10px',
        color: '#28a745',
    },
};

export default NewsletterSection;
