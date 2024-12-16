import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams } from 'react-router-dom';

export default function EditRecipe() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [recipe, setRecipe] = useState({ title: "", description: "", image: "", instructions: [], ingredients: [] });
    const { recipeId } = useParams();

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const apiUrl = `http://localhost:5000/api/recipes/${recipeId}`;
                console.log(recipeId);

                const response = await axios.get(apiUrl);
                const data = await response.data;

                console.log("recipe data:", data);

                // Set fetched data into state
                setRecipe({
                    title: data.recipe.title,
                    description: data.recipe.description,
                    image: data.recipe.image,
                    instructions: data.instructions,
                    ingredients: data.ingredients,
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchRecipeDetails();
    }, [recipeId]);

    const getUserIdFromSessionStorage = () => {
        const userData = sessionStorage.getItem('authenticatedUser');
        if (userData) {
            try {
                const parsedData = JSON.parse(userData);
                return parsedData.user.userId;
            } catch (error) {
                console.error('Error parsing sessionStorage data:', error);
                return null;
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const userId = getUserIdFromSessionStorage();
            console.log('ID utilisateur récupéré :', userId);

            // Send the updated data to the backend
            await axios.put(`http://localhost:5000/api/recipes/${recipeId}`, {
                title: recipe.title,
                description: recipe.description,
                image: recipe.image,
                instructions: recipe.instructions,
                ingredients: recipe.ingredients,
            });

            navigate('/recipes');
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="recipe-page">
            <div className="recipe-container">
                <h2>Modifier la recette</h2>
                <form onSubmit={handleSubmit} className="recipe-form">
                    <input
                        type="text"
                        placeholder="Titre"
                        value={recipe.title}
                        onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
                        className="input-field"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={recipe.description}
                        onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
                        className="input-field"
                        required
                    />

                    {recipe.image && <img src={recipe.image} alt="Recipe" className="recipe-image" />}
                    <div className="ingredients-section">
                        <div className="ingredients-header">
                            <h4>Ingrédients</h4>
                            <button
                                type="button"
                                onClick={() => setRecipe({ ...recipe, ingredients: [...recipe.ingredients, { name: "" }] })}
                                className="btn add-btn"
                            >
                                +
                            </button>
                        </div>
                        {recipe.ingredients.map((ingredient, index) => (
                            <div key={index} className="input-row">
                                <input
                                    type="text"
                                    placeholder={`Ingrédient ${index + 1}`}
                                    value={ingredient.name}
                                    onChange={(e) => {
                                        const updatedIngredients = [...recipe.ingredients];
                                        updatedIngredients[index] = { name: e.target.value };
                                        setRecipe({ ...recipe, ingredients: updatedIngredients });
                                    }}
                                    className="input-field"
                                    required
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
                                            setRecipe({ ...recipe, ingredients: updatedIngredients });
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
                                onClick={() => setRecipe({ ...recipe, instructions: [...recipe.instructions, { step: "" }] })}
                                className="btn add-btn"
                            >
                                +
                            </button>
                        </div>
                        {recipe.instructions.map((instruction, index) => (
                            <div key={index} className="input-row">
                                <input
                                    type="text"
                                    placeholder={`Instruction ${index + 1}`}
                                    value={instruction.step}
                                    onChange={(e) => {
                                        const updatedInstructions = [...recipe.instructions];
                                        updatedInstructions[index] = { step: e.target.value };
                                        setRecipe({ ...recipe, instructions: updatedInstructions });
                                    }}
                                    className="input-field"
                                    required
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedInstructions = recipe.instructions.filter((_, i) => i !== index);
                                            setRecipe({ ...recipe, instructions: updatedInstructions });
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
                        {isLoading ? 'Modification en cours...' : 'Modifier la recette'}
                    </button>
                </form>
            </div>

            <style jsx>{`
                .recipe-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f5f5f5;
                    padding: 20px;
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
                .recipe-image {
                    max-width: 100%;
                    height: auto;
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
}
