import CustomImage from "./CustomImage";
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
    const navigate = useNavigate();
    const images = [
        "/img/gallery/img_1.jpg",
        "/img/gallery/img_2.jpg",
        "/img/gallery/img_3.jpg"
    ];

    const handleExploreClick = () => {
        navigate('/recipes'); 
    };

    return (
        <div className="section hero">
            <div className="col typography">
                <h1 className="title">À propos de nous</h1>
                <p className="info">
                    FoodiesHub est une plateforme dédiée aux amateurs de cuisine. Ici, vous pouvez découvrir des recettes savoureuses du monde entier, et partager vos propres créations culinaires avec la communauté. Notre service est entièrement gratuit, alors commencez à explorer et à publier vos recettes dès maintenant !
                </p>
                <button className="btn" onClick={handleExploreClick}>explorer maintenant</button>
            </div>
            <div className="col gallery">
                {images.map((src, index) => (
                    <div className="image-container" key={index}>
                        <CustomImage imgSrc={src} className="custom-image" />
                    </div>
                ))}
            </div>

            <style jsx>{`
                .hero {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2rem;
                }

                .col.typography {
                    max-width: 50%;
                }

                .col.gallery {
                    display: flex;
                    gap: 1rem;
                }

                /* Taille des conteneurs d'image pour les rendre plus petits */
                .image-container {
                    width: 100px; /* Réduit la taille de chaque conteneur d'image */
                    height: 100px;
                    overflow: hidden;
                    border-radius: 8px; /* Optionnel pour des coins arrondis */
                }

                .custom-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover; /* Adaptation de l'image dans le conteneur sans déformation */
                }

                .title {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }

                .info {
                    margin-bottom: 1.5rem;
                    color: #555;
                    line-height: 1.6;
                }

                .btn {
                    background-color: #ff6347;
                    color: white;
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                }
            `}</style>
        </div>
    );
}
