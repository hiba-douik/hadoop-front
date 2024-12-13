import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateRecipe() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Récupérer l'userId depuis le sessionStorage
    const getUserFromSession = () => {
        const userData = sessionStorage.getItem('authenticatedUser');
        const parsedUserData = userData ? JSON.parse(userData) : null;
        return parsedUserData && parsedUserData.user ? parsedUserData.user.userId : null;
    };
    

    const [newRecipe, setNewRecipe] = useState({
        title: "",
        description: "",
        image: "",
        ingredients: [""],
        instructions: [""],
        userId: getUserFromSession() // Stocke l'userId au chargement
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
    
        // Vérification si l'utilisateur est connecté
        const userId = getUserFromSession();
        if (!userId) {
            setError("Utilisateur non connecté");
            setIsLoading(false);
            return;
        }
    
        // Validation des données requises
        if (!newRecipe.title.trim() || newRecipe.ingredients.some(ing => !ing.trim())) {
            setError("Le titre et tous les ingrédients sont requis");
            setIsLoading(false);
            return;
        }
    
        // Transformation des données avant envoi
        const recipeData = {
            title: newRecipe.title,
            description: newRecipe.description,
            image: newRecipe.image,
            // Convertir les ingrédients en objets avec la propriété 'name'
            ingredients: newRecipe.ingredients.filter(ing => ing.trim()).map(ing => ({ name: ing.trim() })),
            // Convertir les instructions en objets avec la propriété 'step'
            instructions: newRecipe.instructions.filter(inst => inst.trim()).map(inst => ({ step: inst.trim() }))
        };
    
        console.log("Données envoyées : ", recipeData);  // Ajoutez une console pour vérifier le format des données
    
        try {
            const response = await axios.post(
                `http://localhost:3000/api/recipes/${userId}`,
                recipeData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
    
            if (response.status === 201) {
                alert('Recette créée avec succès!');
                navigate('/RecetteForm'); // Redirection vers la liste des recettes
            }
        } catch (error) {
            console.error('Erreur lors de la création de la recette:', error);
            setError(
                error.response?.data?.message || 
                error.message || 
                'Échec de la création de la recette. Veuillez réessayer.'
            );
        } finally {
            setIsLoading(false);
        }
    };
    
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewRecipe({ ...newRecipe, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="recipe-page">
            <div className="recipe-container">
                <h2>Créer une nouvelle recette</h2>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="recipe-form">
                    <input
                        type="text"
                        placeholder="Titre"
                        value={newRecipe.title}
                        onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
                        className="input-field"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newRecipe.description}
                        onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                        className="input-field"
                        required
                    />
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="input-field"
                        accept="image/*"
                    />
                    <div className="ingredients-section">
                        <div className="ingredients-header">
                            <h4>Ingrédients</h4>
                            <button
                                type="button"
                                onClick={() => setNewRecipe({ 
                                    ...newRecipe, 
                                    ingredients: [...newRecipe.ingredients, ""] 
                                })}
                                className="btn add-btn"
                            >
                                +
                            </button>
                        </div>
                        {newRecipe.ingredients.map((ingredient, index) => (
                            <div key={index} className="input-row">
                                <input
                                    type="text"
                                    placeholder={`Ingrédient ${index + 1}`}
                                    value={ingredient}
                                    onChange={(e) => {
                                        const updatedIngredients = [...newRecipe.ingredients];
                                        updatedIngredients[index] = e.target.value;
                                        setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
                                    }}
                                    className="input-field"
                                    required
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedIngredients = newRecipe.ingredients.filter((_, i) => i !== index);
                                            setNewRecipe({ ...newRecipe, ingredients: updatedIngredients });
                                        }}
                                        className="btn remove-btn"
                                    >
                                        -
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="instructions-section">
                        <div className="instructions-header">
                            <h4>Étapes</h4>
                            <button
                                type="button"
                                onClick={() => setNewRecipe({ 
                                    ...newRecipe, 
                                    instructions: [...newRecipe.instructions, ""] 
                                })}
                                className="btn add-btn"
                            >
                                +
                            </button>
                        </div>
                        {newRecipe.instructions.map((instruction, index) => (
                            <div key={index} className="input-row">
                                <input
                                    type="text"
                                    placeholder={`Instruction ${index + 1}`}
                                    value={instruction}
                                    onChange={(e) => {
                                        const updatedInstructions = [...newRecipe.instructions];
                                        updatedInstructions[index] = e.target.value;
                                        setNewRecipe({ ...newRecipe, instructions: updatedInstructions });
                                    }}
                                    className="input-field"
                                    required
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedInstructions = newRecipe.instructions.filter((_, i) => i !== index);
                                            setNewRecipe({ ...newRecipe, instructions: updatedInstructions });
                                        }}
                                        className="btn remove-btn"
                                    >
                                        -
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="btn submit-btn" disabled={isLoading}>
                        {isLoading ? 'Création en cours...' : 'Ajouter la recette'}
                    </button>
                </form>
            </div>
            <style jsx>{`
                .recipe-page {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    min-height: calc(100vh - 160px);
                    background-color: #f5f5f5;
                    padding: 40px 20px;
                }
                .error-message {
                    background-color: #ffebee;
                    color: #c62828;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .recipe-container {
                    width: 100%;
                    max-width: 700px;
                    background: white;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    font-size: 1.5em;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .recipe-form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .input-field {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .input-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .btn {
                    padding: 10px;
                    background-color: #ff6b6b;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.2s, transform 0.2s;
                }
                .btn:hover {
                    background-color: #ff4747;
                    transform: translateY(-2px);
                }
                .btn:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                    transform: none;
                }
                .submit-btn {
                    margin-top: 20px;
                    align-self: flex-end;
                }
                .add-btn {
                    background-color: #4CAF50;
                    padding: 5px 10px;
                    font-size: 1.2em;
                }
                .remove-btn {
                    background-color: #f44336;
                    padding: 5px 10px;
                    font-size: 1.2em;
                }
                .ingredients-section,
                .instructions-section {
                    margin-bottom: 20px;
                }
                .ingredients-header,
                .instructions-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
}