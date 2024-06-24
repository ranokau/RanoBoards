// Agrega funcionalidad de arrastrar y soltar
const tarjetas = document.querySelectorAll('.tarjeta');
const secciones = document.querySelectorAll('.seccion');

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', tarjeta.id);
    });
});

secciones.forEach(seccion => {
    seccion.addEventListener('dragover', e => {
        e.preventDefault();
    });

    seccion.addEventListener('drop', e => {
        const tarjetaId = e.dataTransfer.getData('text/plain');
        const tarjeta = document.getElementById(tarjetaId);
        seccion.appendChild(tarjeta);
    });
});
