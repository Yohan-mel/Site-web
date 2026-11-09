/* =====================================================
   1. CHANGEMENT DE THEME (clair / sombre)
   ===================================================== */

const themeToggle = document.querySelector("#theme-toggle");

// Récupérer le thème enregistré et l'appliquer au chargement
const savedTheme = localStorage.getItem("portfolio-theme");

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


/* =====================================================
   2. MENU MOBILE (hamburger)
   ===================================================== */

const boutonMenu = document.getElementById("menu-toggle");
const liensNav = document.getElementById("nav-links");

function fermerMenu() {
    liensNav.classList.remove("open");
    boutonMenu.setAttribute("aria-expanded", "false");
    boutonMenu.textContent = "☰";
}

boutonMenu.addEventListener("click", () => {
    const ouvert = liensNav.classList.toggle("open");
    boutonMenu.setAttribute("aria-expanded", ouvert);
    boutonMenu.textContent = ouvert ? "✕" : "☰";
});

// On referme le menu quand on clique sur un lien
liensNav.querySelectorAll("a").forEach(lien => lien.addEventListener("click", fermerMenu));


/* =====================================================
   3. SCROLL : barre de progression, header, lien actif, bouton "haut"
   ===================================================== */

const header = document.getElementById("header");
const barreProgression = document.getElementById("progress");
const boutonHaut = document.getElementById("to-top");
const sections = document.querySelectorAll("main section");
const liensMenu = document.querySelectorAll(".nav-links a");

function auDefilement() {

    const y = window.scrollY;

    // Le filet du header devient doré dès qu'on descend
    header.classList.toggle("scrolled", y > 10);

    // Bouton retour en haut
    boutonHaut.classList.toggle("visible", y > 600);

    // Barre de progression (0 en haut, 1 tout en bas)
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = total > 0 ? y / total : 0;
    barreProgression.style.transform = "scaleX(" + ratio + ")";

    // Lien du menu correspondant à la section visible
    let courant = "";
    sections.forEach(section => {
        if (y >= section.offsetTop - 160) {
            courant = section.id;
        }
    });
    liensMenu.forEach(lien => {
        lien.classList.toggle("active", lien.getAttribute("href") === "#" + courant);
    });

}

window.addEventListener("scroll", auDefilement, { passive: true });
auDefilement();

boutonHaut.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* =====================================================
   4. APPARITION DES ELEMENTS AU SCROLL
   ===================================================== */

const observateur = new IntersectionObserver((entrees, obs) => {

    entrees.forEach(entree => {
        if (entree.isIntersecting) {
            entree.target.classList.add("visible");
            obs.unobserve(entree.target);   // une seule fois suffit
        }
    });

}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(element => observateur.observe(element));


/* =====================================================
   5. NIVEAUX DE COMPETENCES : la barre se remplit et le chiffre monte
   ===================================================== */

const zoneNiveaux = document.querySelector(".skills-list");

// Fait monter un nombre de 0 jusqu'à la cible (ex. 80 -> "80%")
function compter(element, cible, duree) {

    const debut = performance.now();

    function pas(maintenant) {
        const progression = Math.min((maintenant - debut) / duree, 1);
        const adoucie = 1 - Math.pow(1 - progression, 3);   // démarre vite, finit doucement
        element.textContent = Math.round(cible * adoucie) + "%";
        if (progression < 1) requestAnimationFrame(pas);
    }

    requestAnimationFrame(pas);

}

if (zoneNiveaux) {

    // Au départ : tout à 0 (le chiffre aussi, pour rester cohérent avec la barre)
    zoneNiveaux.querySelectorAll(".pct").forEach(p => { p.textContent = "0%"; });

    new IntersectionObserver((entrees, obs) => {

        entrees.forEach(entree => {
            if (entree.isIntersecting) {

                entree.target.querySelectorAll(".skill-box").forEach((boite, index) => {

                    const barre = boite.querySelector(".skill-per");
                    const chiffre = boite.querySelector(".pct");
                    const niveau = Number(barre.dataset.level);   // lit data-level="80"
                    const delai = index * 120;                    // l'une après l'autre

                    barre.style.transitionDelay = delai + "ms";
                    barre.style.width = niveau + "%";
                    setTimeout(() => compter(chiffre, niveau, 1400), delai);

                });

                obs.unobserve(entree.target);
            }
        });

    }, { threshold: 0.25 }).observe(zoneNiveaux);

}


/* =====================================================
   6. BANDEAUX DEFILANTS (texte et logos)
   On duplique le contenu : quand la piste a glissé de 50 %,
   la copie est exactement à la place de l'original -> boucle invisible.
   ===================================================== */

document.querySelectorAll(".marquee .track").forEach(piste => {

    [...piste.children].forEach(element => {
        const copie = element.cloneNode(true);
        copie.setAttribute("aria-hidden", "true");
        piste.appendChild(copie);
    });

});


/* =====================================================
   7. ANIMATION DE FRAPPE (HOME)
   - le texte "fantôme" garde la place : la page ne saute plus
   - les boutons apparaissent dès que le titre est écrit
   - un clic n'importe où termine l'animation
   ===================================================== */

const titreDebut = document.getElementById("debut-titre");
const titreNom = document.getElementById("nom-home");
const descriptionHome = document.getElementById("description-home");
const boutonsHome = document.getElementById("boutons-home");

const reduireAnimations = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let animationPassee = false;
document.addEventListener("click", () => { animationPassee = true; }, { once: true });

// Prépare un élément : une partie "tapée" (visible) + une partie "fantôme" (invisible)
function preparer(element) {

    const texte = element.textContent;

    const tape = document.createElement("span");
    const fantome = document.createElement("span");
    fantome.className = "fantome";
    fantome.textContent = texte;

    element.textContent = "";
    element.append(tape, fantome);

    return { tape, fantome, texte };

}

// Tape le texte lettre par lettre ; renvoie une promesse terminée à la fin
function taper(zone, vitesse) {

    return new Promise(resolve => {

        let i = 0;
        zone.tape.classList.add("curseur");

        function pas() {

            if (animationPassee) {
                i = zone.texte.length;       // on affiche tout d'un coup
            } else {
                i++;
            }

            zone.tape.textContent = zone.texte.slice(0, i);
            zone.fantome.textContent = zone.texte.slice(i);

            if (i < zone.texte.length) {
                setTimeout(pas, vitesse);
            } else {
                zone.tape.classList.remove("curseur");
                resolve();
            }

        }

        pas();

    });

}

async function lancerAnimation() {

    // Si la personne préfère moins d'animations : on laisse tout affiché
    if (reduireAnimations) return;

    // On prépare les 3 textes AVANT de commencer (sinon on les verrait en entier)
    const zoneDebut = preparer(titreDebut);
    const zoneNom = preparer(titreNom);
    const zoneDescription = preparer(descriptionHome);

    boutonsHome.classList.add("cache");

    await taper(zoneDebut, 60);
    await taper(zoneNom, 55);

    boutonsHome.classList.remove("cache");

    await taper(zoneDescription, 12);

}

lancerAnimation();


/* =====================================================
   8. FORMULAIRE DE CONTACT
   Sans serveur, on ouvre l'application mail du visiteur
   avec le message déjà rempli (lien "mailto:").
   ===================================================== */

const formulaire = document.getElementById("contact-form");
const messageFormulaire = document.getElementById("form-message");

formulaire.addEventListener("submit", e => {

    e.preventDefault();   // empêche le rechargement de la page

    const nom = document.getElementById("nom").value.trim();
    const email = document.getElementById("email").value.trim();
    const sujet = document.getElementById("sujet").value.trim();
    const texte = document.getElementById("message").value.trim();

    if (!nom || !email || !sujet || !texte) {
        messageFormulaire.textContent = "Merci de remplir tous les champs.";
        messageFormulaire.className = "form-message error";
        return;
    }

    const lien = "mailto:melyohan225@gmail.com"
        + "?subject=" + encodeURIComponent(sujet)
        + "&body=" + encodeURIComponent(texte + "\n\n— " + nom + " (" + email + ")");

    window.location.href = lien;

    messageFormulaire.textContent = "Votre application mail va s'ouvrir pour envoyer le message. Merci !";
    messageFormulaire.className = "form-message ok";
    formulaire.reset();

});


/* =====================================================
   9. ANNEE DU FOOTER
   ===================================================== */

document.getElementById("annee").textContent = new Date().getFullYear();
