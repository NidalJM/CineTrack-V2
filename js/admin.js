import { getContents, createContent, updateContent, deleteContent } from "./api.js"
import { renderAdminTable, showStatus, showFieldErrors } from "./dom.js"
import { validateContent } from "./validation.js";

let items = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById("contentForm");
    const formTitle = document.getElementById("formTitle");
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const statusEl = document.getElementById('statusMessage');
    const titleInput = document.getElementById('title');
    const typeSelect = document.getElementById('type');
    const yearInput = document.getElementById('releaseYear');
    const durationInput = document.getElementById('duration');
    const seasonsInput = document.getElementById('seasons');
    const imageInput = document.getElementById('image');
    const preview = document.getElementById('imagePreview');
    const genresInput = document.getElementById('genres');
    const directorsInput = document.getElementById('directors');
    const countriesInput = document.getElementById('productionCountries');
    const descInput = document.getElementById('description');
    const loader = document.getElementById('tableLoader');
    const table = document.getElementById('adminTable');
    const tbody = document.getElementById('adminTableBody');

    typeSelect.addEventListener("change", () => {
        if (typeSelect.value === "series") {
            document.getElementById("durationGroup").classList.add("hidden");
            document.getElementById("seasonsGroup").classList.remove("hidden");
        } else {
            document.getElementById('seasonsGroup').classList.add("hidden");
            document.getElementById('durationGroup').classList.remove('hidden');
        }
    });
    imageInput.addEventListener("input", () => {
        const url = imageInput.value.trim();
        if (url.startsWith("http")) {
            preview.src = url;
            preview.classList.remove('hidden');
        } else {
            preview.classList.add('hidden')
        }
    })

    function resetForm() {
        editingId = null;
        form.reset();
        showFieldErrors();
        document.getElementById("seasonsGroup").classList.add("hidden");
        document.getElementById('durationGroup').classList.remove('hidden');
        preview.classList.add('hidden');
        formTitle.textContent = "Ajouter un titre";
        submitBtn.textContent = "Ajouter";
        cancelBtn.classList.add('hidden');
    }
    cancelBtn.addEventListener("click", resetForm);

    try {
        items = await getContents();
        loader.classList.add("hidden");
        table.classList.remove("hidden");
        renderAdminTable(items, tbody);
    } catch {
        loader.textContent = "Erreur lors du chargement des donnes.";
        loader.classList.add("text-red-500");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const rawData = {
            title: titleInput.value, type: typeSelect.value, releaseYear: yearInput.value, duration: durationInput.value, seasons: seasonsInput.value, image: imageInput.value.trim(),
        };

        const check = validateContent(rawData)
        if (!check.isValid) {
            showFieldErrors(check.errors);
            return;
        }

        const seasonsList = [];
        if (typeSelect.value === "series") {
            for (let i = 1; i <= Number(seasonsInput.value); i++) {
                seasonsList.push(i)
            }
        }

        const data = {
            title: titleInput.value.trim(), type: typeSelect.value, releaseYear: Number(yearInput.value), duration: typeSelect.value === "movie" ? Number(durationInput.value) : null, seasons: seasonsList, image: imageInput.value.trim(), genres: genresInput.value.split(',').map(g => g.trim()).filter(g => g !== ""), directors: directorsInput.value.split(",").map(d => d.trim()).filter(d => d !== ""), productionCountries: countriesInput.value.split(",").map(c => c.trim()).filter(c => c !== ""), description: descInput.value.trim(),
        };

        try {
            if (editingId)  {
                const oldItem = items.find(i => i.id === editingId);
                const updated = await updateContent(editingId, {...oldItem, ...data})
                items = items.map(i=> (i.id === editingId ? updated : i));
                showStatus(statusEl, `"${updated.title}" modifie avec succes.`);
            }   else {
                const created = await createContent(data);
                items = [created, ... items];
                showStatus(statusEl, `"${created.title}" ajoute avec succes.`);
            }
            renderAdminTable(items, tbody);
            resetForm();
        }   catch   {
            showStatus(statusEl, "Erreur lors de l'enregistrement.", true);
        }
    });

    tbody.addEventListener("click", async (e) => {
        const editBtn = e.target.closest(".edit-btn");
        if (editBtn)    {
            const item = items.find(i => i.id === editBtn.dataset.id);
            if (!item) return;

            editingId = item.id;
            titleInput.value = item.title || "";
            typeSelect.value = item.type || "";
            yearInput.value = item.releaseYear || "";
            durationInput.value = item.duration || "";
            seasonsInput.value = Array.isArray(item.seasons) ? item.seasons.length : (item.seasons || "");
            imageInput.value = item.image || "";
            genresInput.value = Array.isArray(item.genres) ? item.genres.join(", "):"";
            directorsInput.value = Array.isArray(item.directors) ? item.directors.join(", "):"";
            countriesInput.value = Array.isArray(item.productionCountries) ? item.productionCountries.join(", "): "";
            descInput.value = item.description || "";

            if(item.type === "series")  {
                document.getElementById("durationGroup").classList.add("hidden");
                document.getElementById("seasonsGroup").classList.remove("hidden");
            }   else {
                document.getElementById("seasonsGroup").classList.add('hidden')
                document.getElementById('durationGroup').classList.remove('hidden');
            }
            if (item.image) {
                preview.src = item.image;
                preview.classList.remove("hidden");
            }

            formTitle.textContent = `Modifier : ${item.title}`;
            submitBtn.textContent = "Enregistrer";
            cancelBtn.classList.remove('hidden');
            return;
        }

        const delBtn = e.target.closest(".delete-btn");
        if (delBtn) {
            const item = items.find(i => i.id === delBtn.dataset.id);
            if (!item) return;
            if (!confirm(`Supprimer "${item.title}" ?`)) return;

            try {
                await deleteContent(item.id);
                items = items.filter(i => i.id !== item.id);
                renderAdminTable(items, tbody);
                showStatus(statusEl, `"${item.title}" supprime.`);
                if (editingId === item.id) resetForm();
            }   catch {
                showStatus(statusEl, "Erreur lors de la suppresion.", true)
            }
        }
    })
});