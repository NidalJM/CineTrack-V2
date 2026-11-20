export function validateContent(data) {
    const errors = {};
    let isValid = true;
    if (!data.title.trim()) {
        errors.title = "Le titre est obligatoire.";
        isValid = false;
    }
    if (!["movie", "series"].includes(data.type)) {
        errors.type = "Choisisser un type.";
        isValid = false
    }

    const year = Number(data.releaseYear);
    const currentYear = new Date().getFullYear();
    if (!year || year > currentYear)    {
        errors.releaseYear = `Annee valide requise`;
        isValid = false;
    }

    try {
        new URL(data.image);
    } catch {
        errors.image = "URL d'image invalide.";
        isValid = false
    }
    if (data.type === "movie" && (!Number(data.duration) || Number(data.duration) <= 0)) {
        errors.duration = "Duree obligatoire (en min).";
        isValid = false
    }
    if (data.type === "series" && (!Number(data.seasons) || Number(data.seasons) <= 0)) {
        errors.seasons = "Nombre de saisons obligatoire.";
        isValid = false
    }
    return { isValid, errors };
}