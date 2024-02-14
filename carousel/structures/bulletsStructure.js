export const bulletsStructure = {
    classic: {
        element: 'div',
        classes: [
            'carousel-bullets'
        ],
        setter: 'divBullets',
        callback: (object, element) => {
            for (let i=0; i < object.carouselItems.length; i++) {
                const bullet = document.createElement('div')
                bullet.setAttribute('data-index', i)
                object.carouselItems[i].getAttribute('data-status') == 'active' ?
                    bullet.setAttribute('data-active', 'true') :
                    bullet.setAttribute('data-active', 'false')
                bullet.addEventListener('click', e => {
                    const itemActiveIndex = e.target.getAttribute('data-index') * 1
                    object._setActiveItem(itemActiveIndex)
                })
                element.appendChild(bullet)
            }
        }
    }
}
