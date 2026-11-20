export function createCard(item, isFav = false) {
    return `<div data-id="${item.id}" class="card relative cursor-pointer bg-gray-800 rounded-xl overflow-hidden hover:-translate-y-3 shadow-md hover:shadow-xl hover:shadow-red-500 transition-all">
        <button data-id="${item.id}" type="button" class="fav-btn absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-gray-900/80 flex items-center justify-center text-lg">
            ${isFav ? '❤️' : '🤍'}
        </button>
        <img src="${item.image}" class="w-full h-60 sm:h-auto  object-cover">
        <div class="p-4 flex flex-col justify-between">
            <h3 class="text-white font-bold text-lg font-poppins">${item.title}</h3>
            <div class="flex justify-between items-center text-sm text-gray-400 mt-2">
                <span>${item.releaseYear}</span>
                <span class="uppercase text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">${item.type}</span>    
            </div>
        </div>
    </div>`;
}

export function renderFavorites(favItems) {
    const list = document.getElementById('favoriteList');
    const moviesCount = document.getElementById('moviesCount');
    const seriesCount = document.getElementById('seriesCount');

    const counts = favItems.reduce((acc, item) => {
        if (item.type === 'movie') acc.movies++
        if (item.type === 'series') acc.series++;
        return acc;
    }, { movies: 0, series: 0 })

    moviesCount.textContent = counts.movies;
    seriesCount.textContent = counts.series;

    list.innerHTML = favItems.length === 0
        ? `<li class="text-gray-500 text-sm text-center py-6">Aucun favori ajouté.</li>`
        : favItems.map(item => `
<li class="flex items-center justify-between gap-2 bg-gray-800 hover:bg-red-100/50 p-2 rounded-lg transition-all">
            <div class="flex items-center gap-3 overflow-hidden">
                <img src="${item.image}" alt="${item.title}" class="w-10 h-14 object-cover rounded shrink-0">
                <div class="overflow-hidden">
                    <p class="text-white text-sm font-bold truncate">${item.title}</p>
                    <p class="text-red-400 text-xs font-semibold uppercase">${item.type}</p>
                </div>
            </div>
            <button data-id="${item.id}" type="button" class="remove-fav text-gray-400 hover:text-red-500 font-bold text-lg px-2 shrink-0">&times;</button>
        </li>
        `).join('');
}

export function openModal(item) {
    const modal = document.getElementById('detailModal');
    const modalContent = document.getElementById('modalContent');
    const savedPseudo = localStorage.getItem("cinetrack_pseudo") || "";
    modalContent.classList.remove('sm:flex-row');
    modalContent.classList.add('flex-col', 'max-h-[90vh]', 'overflow-y-auto');

    const extraInfo = item.type === "movie"
        ? `<p class="font-bold"><span class="text-gray-400 font-semibold">Durée :</span> ${item.duration} min</p>`
        : `<p class="font-bold"><span class="text-gray-400 font-semibold">Saisons :</span> ${Array.isArray(item.seasons) ? item.seasons.join(', ') : item.seasons}</p>`;

    modalContent.innerHTML = `
<div class="flex flex-col sm:flex-row w-full">
    <img src="${item.image}" alt="${item.title}" class="w-full sm:w-2/5 h-72 sm:h-auto object-cover">

<div class="w-full sm:w-3/5 p-6 flex flex-col justify-between space-y-4">
    <div>
        <h2 class="text-3xl font-bebas tracking-wider text-red-500 pr-6">${item.title}</h2>
        <div class="flex items-center gap-2 mt-1">
            <span class="uppercase text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded font-bold">${item.type}</span>
            <span class="text-sm text-gray-400">${item.releaseYear}</span>
        </div>
    </div>

    <div class="space-y-1.5 text-sm">
        ${extraInfo}
        <p class="font-bold"><span class="text-gray-400 font-semibold">Genres: </span>${item.genres}</p>
        <p class="font-bold"><span class="text-gray-400 font-semibold">Realisateurs: </span>${item.directors}</p>
        <p class="font-bold"><span class="text-gray-400 font-semibold">Pays de production: </span>${item.productionCountries}</p>
    </div>

    <p class="text-gray-300 text-sm leading-relaxed border-t border-gray-700 pt-3">${item.description}</p>
</div>
</div>
        <div class="w-full p-6 border-t border-gray-800 bg-gray-900/70 space-y-5">
            <h3 class="text-2xl font-bebas tracking-wider text-red-500">Commentaires</h3>
            <form id="commentForm" class="space-y-3 bd-gray-800/70 p-4 rounded-xl border border-gray-700">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <input type="text" id="commentAuthor" value="${savedPseudo}" placeholder="Votre nom/pseudo *"
                        class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-red-500 focus:outline-none">
                </div>
                <div>
                    <textarea id="commentText" rows="2" placeholder="Ecriver votre commentaire... *"
                        class="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-red-500 focus:outline-none"></textarea>
                </div>
                <p id="commentError" class="text-red-400 text-xs hidden"></p>
                <div class="flex justify-end">
                    <button type="submit" id="commentSubmitBtn"
                        class="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                        Publier
                    </button>
                </div>
            </form>
            <div id="commentsLoader" class="text-center text-gray-400 text-sm py-3">Chargement des commentaires...</div>
            <div id="commentsList" class="space-y-3"></div>
        </div>

    `

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

export function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex')
}

export function renderAdminTable(list, tbody) {
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500 py-8">Aucun titre disponible.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(item => `
        <tr class="flex flex-col md:table-row bg-gray-800/40 md:bg-transparent rounded-xl md:rounded-none p-4 md:p-0 mb-4 mb-4 border border-gray-800 md:border-0 hover:bg-gray-800/60 transition-all">
            <td class= "py-1 md:py-3 md:px-4 flex items-center gap-3 md:table-cell">
                <img src="${item.image}" alt="${item.title}" class="w-12 h-16 object-cover rounded-lg bg-gray-800 shrink-0">
                <span class="font-semibold text-white md:hidden">${item.title}</span>
                </td>
            <td class="hidden md:table-cell py-3 px-4 font-semibold text-white">${item.title}</td>
            <td class="py-1 md:py-3 md:px-4 flex items-center justify-between md:table-cell">
            <span class="text-xs text-gray-400 md:hidden">Type :</span>    
            <span class="uppercase text-xs px-3 py-1 rounded bg-red-500/20 text-red-400 font-bold">${item.type}</span>
            </td>
            <td class="py-1 sm:py-3 md:px-4 flex items-center justify-between md:table-cell text-gray-300">
            <span class="text-xs text-gray-400 md:hidden">Annee: </span>
            <span class>${item.releaseYear}</span>
            </td>
            <td class="pt-3 mt-2 border-t border-gray-700/60 md:border-0 md:pt-3 md:mt-0 md:py-3 md:px-4 text-right">
                <div class="flex justify-end gap-2">
                    <button data-id="${item.id}" type="button" class="edit-btn flex-1 md:flex-initial bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-white px-3 py-2 md:py-1.5 rounded-lg text-xs font-semibold transition-all">Modifier</button>
                    <button data-id="${item.id}" type="button" class="delete-btn flex-1 md:flex-initial bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-2 md:py-1.5 rounded-lg text-xs font-semibold transition-all">Supprimer</button>
                </div>
            </td>
        </tr>
        `).join('');
}

export function showStatus(el, msg, isError = false) {
    el.textContent = msg;
    el.className = `p-4 rounded-xl font-semibold text-sm border ${isError ? "bg-red-500/20 text-red-400 border-red-500/40" : "bg-green-500/20 text-green-400 border-green-500/40"
        }`;
    setTimeout(() => el.classList.add("hidden"), 4000);
}

export function showFieldErrors(errors = {}) {
    const fields = ["title", "type", "releaseYear", "image", "duration", "seasons"];
    fields.forEach(field => {
        const errEl = document.getElementById(`err-${field}`);
        if (!errEl) return;

        if (errors[field]) {
            errEl.textContent = errors[field];
            errEl.classList.remove("hidden");
        } else {
            errEl.textContent="";
            errEl.classList.add("hidden");
        }
    });
}

export function renderComments(comments) {
    const listEl = document.getElementById('commentsList');
    if (!listEl) return;

    if (comments.length === 0) {
        listEl.innerHTML = `<p class= "text-gray-500 text-sm text-center py-4">Aucun commentaire.</p>`;
        return;
    }
    listEl.innerHTML = comments.map(e => {
        const dateStr = e.createdAt ? new Date(e.createdAt).toLocaleDateString('fr-FR') : "";
        return `
            <div class="bg-gray-800 border border-gray-700/70 rounded-xl p-3.5 space-y-1">
                <div class= "flex items-center justify-between">
                    <span class="font-bold text-sm text-white">${e.author}</span>
                    <span class="text-xs text-gray-400">${dateStr}</span>
                </div>
                <p class="text-gray-300 text-sm">${e.text}</p>
            </div>
        `
    }).join('');
}