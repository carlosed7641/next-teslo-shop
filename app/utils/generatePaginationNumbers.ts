export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {

    // Si el numero total de paginas es 7 o menos
    // vamos a mostrar todas las paginas sin puntos suspensivos
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1) // [1, 2, 3, 4, 5, 6, 7] 
    }

    // Si la pagina actual está entre las primeras 3 páginas
    // Mostrar las primeras 3, puntos suspensivos y las últimas 2 páginas
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages]
    }

    // Si la pagina actual está entre las últimas 3 páginas
    // Mostrar las primeras 2 páginas, puntos suspensivos y las últimas 3 páginas
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
    }

    // Si la pagina actual está en otro lugar medio
    // Mostrar las primera página, puntos suspensivos, la página actual y vecinos

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}