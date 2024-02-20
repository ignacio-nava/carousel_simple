// Import structures
import { navigationStructure } from "../structures/navigationStructure.js";
import { bulletsStructure } from "../structures/bulletsStructure.js";

// Import actions
import { moveCarouselLoop } from "../tools/actions.js";

export const constructorByTypes = {
    classic: element => {
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
    slide: element => {
        element._restructure()

        element.slider = document.createElement('div')
        element.slider.classList.add('flex-row')

        const itemsCopy = [...element.carouselItems]
        for (let i = 0; i < itemsCopy.length; i++) {
            const item = itemsCopy[i]
            element.carouselItemsDiv.removeChild(item)
            element.slider.appendChild(item)
        }
        
        element.carouselItemsDiv.appendChild(element.slider)
        
        if (element.config.navigators) {
            element._buildElement(navigationStructure[element.config.navigators])
        }

        ['mouseenter', 'mouseleave'].forEach(listener => (
            element.carouselItemsDiv.addEventListener(listener, e => (
                element._setNavigationHoverAnimation(e)
            ))
        ))
    },
    loop: element => {
        element._restructure()

        element.loop = document.createElement('div')
        element.loop.classList = 'loop-container flex-row'

        element.itemsContainer = document.createElement('div')
        element.itemsContainerClone = document.createElement('div')
        
        const itemsCopy = [...element.carouselItems]
        for (let i = 0; i < itemsCopy.length; i++) {
            const item = itemsCopy[i]
            element.carouselItemsDiv.removeChild(item)
            element.itemsContainer.appendChild(item)
            element.itemsContainerClone.appendChild(item.cloneNode(true))
        }

        element.itemsContainer.dataset.identity = 'original'
        element.itemsContainer.classList = 'loop-item-container flex-row'
        element.itemsContainerClone.dataset.identity = 'clone'
        element.itemsContainerClone.classList = 'loop-item-container flex-row'

        element.loop.appendChild(element.itemsContainer)
        element.loop.appendChild(element.itemsContainerClone)
        element.loop.style = `--items-count-loop: ${element.itemsContainer.childElementCount}`
        element.carouselItemsDiv.appendChild(element.loop)

        moveCarouselLoop(element)
    }
}

export const carouselTypes = {
    classic: option => (
        option === false ? option : 'classic'
    ),
    slide: option => (
        option === false ? option : 'slide'
    ),
    loop: option => (
        option === false ? option : 'loop'
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