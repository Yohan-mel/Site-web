
/* ================= CHANGEMENT DE THEME ================= */

const themeToggle = document.querySelector("#theme-toggle");

// Récupérer le thème enregistré
const savedTheme = localStorage.getItem("portfolio-theme");

// Appliquer le thème enregistré au chargement
if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "☀️";
}

// Changer de thème au clic
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("portfolio-theme", "light");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("portfolio-theme", "dark");
    }

});


/* ================= ANIMATION HOME ================= */

// Récupérer les éléments HTML
const titreElement = document.getElementById("titre-home");
const descriptionElement = document.getElementById("description-home");
const boutons = document.getElementById("boutons-home");

// Textes du titre
const debutTitre = "Je suis ";
const nom = "MEL YOHAN CLOVIS MAXIMILIEN";
const finTitre = ",";

// Récupérer la description depuis le HTML
const description = descriptionElement.textContent.trim();

// Préparer le titre
titreElement.textContent = "";

const spanNom = document.createElement("span");
titreElement.appendChild(document.createTextNode(""));
titreElement.appendChild(spanNom);

// Vider temporairement la description
descriptionElement.textContent = "";

// Cacher les boutons
boutons.style.visibility = "hidden";

// Compteurs
let i = 0;
let j = 0;

// Ecriture du titre
function ecrireTitre() {

    if (i < debutTitre.length) {
        titreElement.firstChild.textContent += debutTitre.charAt(i);
        i++;
        setTimeout(ecrireTitre, 70);

    } else if (j < nom.length) {
        spanNom.textContent += nom.charAt(j);
        j++;
        setTimeout(ecrireTitre, 70);

    } else {
        titreElement.appendChild(document.createTextNode(finTitre));
        ecrireDescription();
    }

}

// Ecriture de la description
let k = 0;

function ecrireDescription() {

    if (k < description.length) {

        descriptionElement.textContent += description.charAt(k);

        k++;

        setTimeout(ecrireDescription, 20);

    } else {

        // Afficher les boutons à la fin
        boutons.style.visibility = "visible";

    }

}

// Lancer l'animation
ecrireTitre();
