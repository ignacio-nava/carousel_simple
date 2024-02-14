// Import structures
import { navigationStructure } from "../structures/navigationStructure.js";
import { bulletsStructure } from "../structures/bulletsStructure.js";

export const constructorByTypes = {
    'classic': element => {
        element._restructure()

        element._setActiveItem(element.config.initialIndex, true)

        if (element.config.navigators) {
            element._buildElement(navigationStructure[element.config.navigators])
        }
        if (element.config.bullets) {
            element._buildElement(bulletsStructure[element.config.bullets])
        }

        ['mouseenter', 'mouseleave'].forEach(listener => (
            element.carousel.addEventListener(listener, e => (
                element._setNavigationHoverAnimation(e)
            ))
        ))
    },
    'slide': element => {

        element._restructure()
        const itemsCopy = [...element.carouselItems]
        for (let i = 0; i < itemsCopy.length; i++) {
            const item = itemsCopy[i]
            element.carouselItemsDiv.removeChild(item)
        }

        element.slider = document.createElement('div')
        element.slider.classList.add('slide-row')
        for (let i = 0; i < itemsCopy.length; i++) {
            const item = itemsCopy[i]
            item.setAttribute('data-index', i)
            element.slider.appendChild(item)
        }
        element.carouselItemsDiv.appendChild(element.slider)
        element.carouselItems = element.carouselItems[0].children
        
        if (element.config.navigators) {
            element._buildElement(navigationStructure[element.config.navigators])
        }

        ['mouseenter', 'mouseleave'].forEach(listener => (
            element.carouselItemsDiv.addEventListener(listener, e => (
                element._setNavigationHoverAnimation(e)
            ))
        ))
    }
}

export const carouselTypes = {
    classic: option => (
        option === false ? option : 'classic'
    ),
    slide: option => (
        option === false ? option : 'slide'
    )
}

export const navigationEvents = {
    mouseenter: navigator => {
        navigator.setAttribute('data-visible', 'true')
        navigator.addEventListener('mouseenter', e => {
            e.target.setAttribute('data-visible', 'true')
        })
    },
    mouseleave: navigator => navigator.removeAttribute('data-visible')
}