// Import types of carousel availables
import { 
    constructorByTypes, 
    carouselTypes,
    navigationEvents
 } from "./types/types.js";

// Main Object 
/** @class Carousel representing a carousel */
export class Carousel {

    /**
    * Creates an instance of Carousel.
    * @author: - ignacionava
    * @param { string } selector - The HTML element where to build the carousel.
    * @param { number } [timerAuto=7000] - Time slide is ms. Default: 7000.
    */
    constructor(selector, timerAuto=7000) {
        this.carousel = document.querySelector(selector)
        this.timerAuto = timerAuto
    }

    /**
    * Inserts the carousel in the element.
    * @param {Object} config - The configuration of the carousel.
    * - type: Type of carousel ('classic' or 'slide'). By default: 'classic'.
    * - initialIndex: Select the starting element or slide. By default: 0 (only works with 'classic').
    * - navigators: Turn on/off navigators. By default: true.
    * - bullets: Turn on/off bullets. By default: true.
    * @param {string} [config.type]
    * @param {number} [config.initialIndex]
    * @param {boolean} [config.navigators]
    * @param {boolean} [config.bullets]
    */
    async build(config={}) {
        this.carousel.classList.add('carousel')

        this.config = {
            type: carouselTypes.hasOwnProperty(config.type) ? 
                config.type : 'classic'
        }
        this.config = {
            ...this.config,
            initialIndex: config.initialIndex || 0,
            navigators: carouselTypes[this.config.type](config.navigators),
            bullets: carouselTypes[this.config.type](config.bullets)
        }
        
        await constructorByTypes[this.config.type](this)
    }

    /**
     * Restructure carousel elements. Set carouselItemsDiv and carouselItems.
     * (1) Create an empty child (First Child) and append to main carousel element.
     * (2) Remove all carousel items and append to First Child.
     * @private
     */
    _restructure() {
        // (1)
        this.carouselItemsDiv = document.createElement('div')
        this.carouselItemsDiv.classList.add(`carousel-${this.config.type}`)
        this.controlHeight = this.carousel.children[0].clientHeight
        this.carouselItemsDiv.style = `--height-child: ${this.controlHeight}px`
        this.carousel.appendChild(this.carouselItemsDiv)

        // (2)
        const childCount = this.carousel.childElementCount
        for (let i = childCount - 2; i >= 0 ; i--) {
            const item = this.carousel.children[i]
            item.classList.add(`carousel-item-${this.config.type}`)
            item.dataset.index = i
            this.carousel.removeChild(item)
            this.carouselItemsDiv.insertBefore(item, this.carouselItemsDiv.children[0])
        }

        this.carouselItems = this.carouselItemsDiv.children
    }

    /**
     * Create children element and append to parent.
     * @private
     * @param {object} obj - Object with the element structure.
     * @param {object} parent - HTML element where append children.
     */
    _buildElement(obj, parent=this.carousel) {

        const element = document.createElement(obj.element)
        obj.classes && obj.classes.forEach(c => (
            element.classList.add(c)
        ))

        obj.styles && obj.styles.forEach(s => (
            element.style.setProperty(s.name, s.value)
        ))

        obj.attibutes && obj.attibutes.forEach(attr => (
            element.setAttribute(attr.name, attr.value)
        ))

        if (obj.eventListeners) {
            for (let i = 0; i < obj.eventListeners.length; i++) {
                const {event, callback} = obj.eventListeners[i]
                element.addEventListener(event, e => this[callback](e))
            }
        }

        if (obj.innerHTML) element.innerHTML = obj.innerHTML

        obj.childrens && obj.childrens.forEach(children => (
            this._buildElement(children, element)
        ))

        obj.callback && obj.callback(this, element)

        if (obj.setter) this[obj.setter] = element

        parent.appendChild(element)
    }

    /**
     * Set the item as 'active'.
     * @private 
     * @param {number} newIndex - The new item index to set 'active'.
     * @param {boolean} [initial=false] - It checks if this is the initial event.
     */
    _setActiveItem(newIndex, initial=false) {
        // Normalize index to items length
        newIndex = (newIndex % this.carouselItems.length) >= 0 ?
            newIndex % this.carouselItems.length :
            this.carouselItems.length + (newIndex % this.carouselItems.length)

        // Remove active items, get oldIndex and side to animate
        let oldIndex;
        let side_to_animate;
        for (let i=0; i < this.carouselItems.length; i++) {
            if (this.carouselItems[i].getAttribute('data-status') == 'active') {
                oldIndex = this.carouselItems[i].getAttribute('data-index') * 1
                side_to_animate = this._setAnimationsName(oldIndex, newIndex)
            }

            if (i != newIndex) {
                this.carouselItems[i].setAttribute('data-status', 'moving')
                this.divBullets && this.divBullets.children[i].setAttribute('data-active', 'false')
            }
        }

        // Set active items
        this.carouselItems[newIndex].setAttribute('data-status', 'active')
        this.divBullets && this.divBullets.children[newIndex].setAttribute('data-active', 'true')

        // Overwrite animations
        this.carouselItems[newIndex].setAttribute('data-animation', `from-${side_to_animate}`)
        !initial && this.carouselItems[oldIndex].setAttribute('data-animation', `to-${side_to_animate}`)
    }

    /**
     * Hanlde click envent for navigators when type is classic.
     * @private
     * @param {MouseEvent} e - Click event.
     * @listens navigator#click
     */
    _navigatorClickListenerClassic(e) {
        const element = this._getNavigationRuler(e)

        const itemActiveIndex = [...this.carouselItems].filter(item => (
            item.getAttribute('data-status') == 'active'
        ))[0].getAttribute('data-index') * 1

        const arialLabel = element.getAttribute('aria-label') 
        let value = 0
        if (arialLabel == 'carousel-prev') {
            value--
        } else if (arialLabel == 'carousel-next') {
            value++
        }
        this._setActiveItem(itemActiveIndex + value)
    }

    /**
     * Hanlde click envent for navigators when type is slide.
     * @private
     * @param {MouseEvent} e - Click event.
     * @listens navigator#click
     */
    _navigatorClickListenerSlide(e) {
        const element = this._getNavigationRuler(e)
        
        const itemPerRow = Number(getComputedStyle(this.slider).getPropertyValue('--slide-items-per-row'))
        
        const translateXPositions = []
        for (let i = 0; i < this.slider.childElementCount; i += itemPerRow) {
            translateXPositions.push(i * -100)
        }
        
        let slideToLeft = Number(this.slider.style.getPropertyValue('--slide-to-left'))
        let currentTranslateX = translateXPositions.indexOf(slideToLeft)

        const arialLabel = element.getAttribute('aria-label')
        if (arialLabel == 'carousel-prev') {
            currentTranslateX--
        } else if (arialLabel == 'carousel-next') {
            currentTranslateX++
        }

        slideToLeft = translateXPositions[currentTranslateX]
        this.slider.style.setProperty('--slide-to-left', slideToLeft)

        const [prevNavigator, nextNavigator] = this
            .carouselItemsDiv
            .parentElement
            .querySelectorAll('.carousel-navigation-item')

        if (currentTranslateX < 1) {
            prevNavigator.style.setProperty('display', 'none')
            nextNavigator.style.setProperty('display', 'block')
        } else if (currentTranslateX >= translateXPositions.length - 1) {
            prevNavigator.style.setProperty('display', 'block')
            nextNavigator.style.setProperty('display', 'none')
        } else {
            prevNavigator.style.setProperty('display', 'block')
            nextNavigator.style.setProperty('display', 'block')
        }
    }

    /**
     * Identifies where animation has to be for type 'classic'.
     * @private
     * @param {number} oldIndex 
     * @param {number} newIndex 
     * @returns {string} Animation name ('left' or 'right').
     */
    _setAnimationsName(oldIndex, newIndex) {
        if (Math.abs(oldIndex - newIndex) > 1) {
            return oldIndex > newIndex ? 'left' : 'right'
        }
        return oldIndex < newIndex ? 'left' : 'right'
    }

    /**
     * Handle hover animations 'mouseenter' and 'mouseleave'
     * @private
     * @param {object} e - Object event. 
     */
    _setNavigationHoverAnimation(e) {
        const navigators = this
            .carousel
            .querySelectorAll('.carousel-navigation-item')

        for (let navigator of navigators) {
            navigationEvents[e.type](navigator)
        }
    }

    /**
     * Check if the element that activated the event is the 
     * one that has all the information needed for the animation.
     * @private
     * @param {object} e - Object event. 
     * @returns HTML element
     */
    _getNavigationRuler(e) {
        return e.target.localName === 'span' ? 
            e.target.parentElement.parentElement : 
            e.target.parentElement
    }
}