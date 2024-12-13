import React from "react";

export default function RecipeCard({ recipe }) {
    return (
        <div className="recipe-card">
            <div className="image-container">
                <img
                    src={recipe.image || "/default-recipe.jpg"} 
                    alt={recipe.title}
                    className="recipe-image"
                />
            </div>
            <div className="recipe-details">
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-description">{recipe.description}</p>
            </div>

            <style jsx>{`
                .recipe-card {
                    position: relative;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s ease; /* Effet de survol */
                }

                .recipe-card:hover {
                    transform: scale(1.05); /* Zoom léger au survol */
                }

                .image-container {
                    width: 100%;
                    height: 200px;
                    overflow: hidden;
                }

                .recipe-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .recipe-details {
                    padding: 1rem;
                    flex-grow: 1;
                     margin-bottom: 1rem; 
                }

                .recipe-title {
                    font-size: 1.25rem;
                    margin: 0 0 0.5rem;
                    font-weight: bold;
                    word-wrap: break-word;
                }

                

                .user-info {
                    position: absolute;
                    bottom: 8px;
                    left: 8px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(255, 255, 255, 0.8);
                    padding: 4px 8px;
                    border-radius: 8px;
            
                }

                .user-image {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .username {
                    font-size: 0.875rem;
                    color: #333;
                }

                /* Adaptation pour les petits écrans */
                @media (max-width: 600px) {
                    .recipe-card {
                        font-size: 0.9rem;
                    }

                    .image-container {
                        height: 150px;
                    }
                }
            `}</style>
        </div>
    );
}
