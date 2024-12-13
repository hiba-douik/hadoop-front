import HeroSection from "../components/HeroSection";
import ImproveSkills from "../components/ImproveSkills";
import QuoteSection from "../components/QuoteSection";
import ChiefsSection from "../components/ChiefsSection";

export default function Home() {
       return (
        <div>
            <HeroSection />
            <ImproveSkills />
            <QuoteSection />
            <ChiefsSection />

            <style jsx>{`
    .recipes-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Taille minimum de la carte */
        gap: 1rem;
        padding: 1rem;
    }

    h1 {
        text-align: center;
        font-size: 2rem;
        margin-top: 1.5rem;
        color: #333;
    }

    /* Style des cartes */
    .recipe-card {
        width: 100%; /* La carte occupe toute la largeur de sa colonne */
        max-width: 180px; /* Limiter la taille maximale de la carte */
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        text-align: center;
        background-color: #fff;
    }

    .recipe-card img {
        width: 100%;
        height: 120px; /* Hauteur fixe pour une taille plus petite */
        object-fit: cover;
        border-bottom: 1px solid #ddd;
    }
`}</style>

        </div>
    );
}
