import React, { useState } from 'react';
import axios from 'axios';

function SearchRecipesByIngredients() {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false); // Pour afficher un message de chargement
    const [error, setError] = useState(''); // Pour gérer les erreurs

    const handleSearch = async () => {
        setLoading(true); // Commencer le chargement
        setError(''); // Réinitialiser les erreurs
        try {
            const response = await axios.get('http://localhost:3000/api/search', {
                params: { ingredients }, // On envoie les ingrédients dans les paramètres de la requête
            });
            setRecipes(response.data); // Les données renvoyées par l'API contiennent déjà les recettes
        } catch (error) {
            setError('Erreur lors de la recherche. Veuillez réessayer.'); // Gérer l'erreur
            console.error('Erreur lors de la recherche:', error);
        } finally {
            setLoading(false); // Arrêter le chargement
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Rechercher des recettes par tous les ingrédients</h1>
            <div style={styles.searchBar}>
                <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Entrez les ingrédients séparés par des virgules"
                    style={styles.input}
                />
                <button onClick={handleSearch} style={styles.button}>Rechercher</button>
            </div>

            {loading ? (
                <p style={styles.loadingText}>Chargement...</p> // Affichage pendant le chargement
            ) : error ? (
                <p style={styles.errorText}>{error}</p> // Affichage des erreurs
            ) : recipes.length > 0 ? (
                <div style={styles.recipeList}>
                    {recipes.map((recipe, index) => (
                        <div key={index} style={styles.recipeCard}>
                            <h3 style={styles.recipeTitle}>{recipe.title}</h3>  {/* Affichage du titre */}
                            {recipe.image && <img src={recipe.image} alt={recipe.title} style={styles.recipeImage} />}  {/* Affichage de l'image */}
                            <p style={styles.ingredientsText}>Ingrédients trouvés : {recipe.ingredients.join(', ')}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={styles.noRecipesText}>Aucune recette trouvée pour les ingrédients fournis.</p>
            )}
        </div>
    );
}

// Styles en ligne pour la page
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: '"Arial", sans-serif',
        backgroundColor: '#f8f8f8',
        minHeight: '100vh',
    },
    header: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '20px',
    },
    searchBar: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
    },
    input: {
        padding: '10px',
        fontSize: '1rem',
        marginRight: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        width: '300px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    loadingText: {
        fontSize: '1.2rem',
        color: '#333',
    },
    errorText: {
        fontSize: '1.2rem',
        color: '#f44336',
    },
    recipeList: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        marginTop: '20px',
    },
    recipeCard: {
        backgroundColor: '#fff',
        padding: '15px',
        marginBottom: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    recipeTitle: {
        fontSize: '1.5rem',
        color: '#333',
    },
    recipeImage: {
        width: '100%',
        height: 'auto',
        marginTop: '15px',
        borderRadius: '8px',
    },
    ingredientsText: {
        fontSize: '1rem',
        color: '#555',
        marginTop: '10px',
    },
    noRecipesText: {
        fontSize: '1.2rem',
        color: '#999',
    },
};

export default SearchRecipesByIngredients;
