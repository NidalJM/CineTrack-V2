import { getContents, getComments, createComment } from "./api.js";
import { createCard, openModal, closeModal, renderFavorites, renderComments } from "./dom.js";

let allItems = [];
let filteredMedia = [];
let favIds = JSON.parse(localStorage.getItem("favorites")) || []
let currentPage = 1;
const itemsPerspage = 8;
let totalPages = 1;
document.addEventListener('DOMContentLoaded', async () => {
    // console.log(fetchCatalog());

    const grid = document.getElementById('cardGrid');
    const searchInput = document.getElementById('searchInput');
    const filterInput = document.getElementById('filter');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const pageCounter = document.getElementById('page-info')
    const modal = document.getElementById('detailModal');
    const closeModalBtn = document.getElementById('closeModal');
    const favoriteList = document.getElementById('favoriteList');
    const favoriteSidebar = document.getElementById('favoriteSidebar');
    const openFavBtn = document.getElementById('openFavBtn');
    try {
        allItems = await getContents()
        filteredMedia = [...allItems]
    } catch (error) {
        grid.innerHTML = `<div class="col-span-full text-center text-red-500 font-bold py-10">
            Impossible de charger les données. Veuillez réessayer plus tard.
        </div>`;
        return;
    }

    function updateFavorites() {
        localStorage.setItem("favorites", JSON.stringify(favIds));
        const favItems = allItems.filter(item => favIds.includes(item.id));
        renderFavorites(favItems);
        afficher()
    }

    function handleFilters() {
        const query = searchInput.value.toLowerCase().trim();
        const filterValue = filterInput.value;

        filteredMedia = allItems.filter((item) => {
            const matchTitle = item.title.toLowerCase().includes(query);

            let matchType = false;
            if (filterValue === "1" || filterValue === "Tous") {
                matchType = true;
            }
            else if (filterValue === "series") {
                matchType = item.type === "series"
            }
            else if (filterValue === "movies" || filterValue === "movie") {
                matchType = item.type === "movie";
            }
            return matchTitle && matchType;

        })
        currentPage = 1;
        afficher()
    }

    function afficher() {
        totalPages = Math.ceil(filteredMedia.length / itemsPerspage) || 1;
        const start = (currentPage - 1) * itemsPerspage;

        const pageItems = filteredMedia.slice(start, start + itemsPerspage)
        grid.innerHTML = pageItems.map(item => createCard(item, favIds.includes(item.id))).join('')
        pageCounter.textContent = `Page ${currentPage} sur ${totalPages}`;

        if (filteredMedia.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center text-red-500 font-bold py-10">
            Aucune correspondance trouvée.
        </div>`;
            return;
        }
        if (currentPage === 1) {
            btnPrev.className = 'px-3 py-3 rounded-lg bg-gray-600 text-white transition-all text-sm font-poppins font-medium'
            btnNext.className = 'px-3 py-3 rounded-lg bg-red-600 text-white hover:bg-red-300 transition-all text-sm font-poppins font-medium'
        }
        if (currentPage > 1 && currentPage < totalPages) {
            btnPrev.className = 'px-3 py-3 rounded-lg bg-red-600 text-white hover:bg-red-300 transition-all text-sm font-poppins font-medium'
            btnNext.className = 'px-3 py-3 rounded-lg bg-red-600 text-white hover:bg-red-300 transition-all text-sm font-poppins font-medium'
        }
        if (currentPage === totalPages) {
            btnPrev.className = 'px-3 py-3 rounded-lg bg-red-600 text-white hover:bg-red-300 transition-all text-sm font-poppins font-medium'
            btnNext.className = 'px-3 py-3 rounded-lg bg-gray-600 text-white transition-all text-sm font-poppins font-medium'
        }
    }

    async function handleModalOpen(item) {
        openModal(item);

        const loader = document.getElementById('commentsLoader');
        const form = document.getElementById('commentForm');
        const authorInput = document.getElementById('commentAuthor');
        const textInput = document.getElementById('commentText');
        const errorEl = document.getElementById('commentError');
        const submitBtn = document.getElementById('commentSubmitBtn');

        let itemComments = [];

        try {
            const allComments = await getComments();
            itemComments = allComments.filter(e => String(e.contentId) === String(item.id));
            loader.classList.add('hidden');
            renderComments(itemComments);
        } catch {
            loader.textContent = "Aucun commentaire.";
        }
        errorEl.classList.add('hidden');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const author = authorInput.value.trim();
            const text = textInput.value.trim();
            if (!author || !text) {
                errorEl.textContent = "Veuillez remplir votre nom et votre commentaire.";
                errorEl.classList.remove('hidden');
                return;
            }
            errorEl.classList.add('hidden');

            localStorage.setItem("cinetrack_pseudo", author);
            submitBtn.disabled = true;

            try {
                const newComment = await createComment({
                    contentId: String(item.id),
                    author,
                    text,
                    createdAt: new Date().toISOString(),
                });
                itemComments = [newComment, ...itemComments];
                renderComments(itemComments);
                textInput.value = "";
            } catch {
                errorEl.textContent = "Erreur lors de l'envoi du commentaier.";
                errorEl.classList.remove('hidden');
            } finally {
                submitBtn.disabled = false;
            }
        })

    }

    btnNext.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage += 1;
            afficher();
        }
    })
    btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage -= 1;
            afficher();
        }
    })
    grid.addEventListener('click', (e) => {
        const favBtn = e.target.closest('.fav-btn');
        if (favBtn) {
            e.stopPropagation();
            const id = favBtn.dataset.id;
            favIds = favIds.includes(id)
                ? favIds.filter(favId => favId !== id)
                : [...favIds, id]

            updateFavorites()
            return;
        }
        const card = e.target.closest('.card');
        if (!card) return;

        const id = card.dataset.id;
        const item = allItems.find((i) =>String(i.id) === String(id))
        if (item) handleModalOpen(item)
            
    });
    favoriteList.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-fav');
        if (!removeBtn) return;

        favIds = favIds.filter(id => id !== removeBtn.dataset.id);
        updateFavorites()
    })
    openFavBtn.addEventListener('click', () => {
        favoriteSidebar.classList.toggle('hidden')
    })
    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target.id === 'detailModal') {
            closeModal();
        }
    })

    searchInput.addEventListener('input', handleFilters);
    filterInput.addEventListener('change', handleFilters);

    afficher()
    updateFavorites()
})