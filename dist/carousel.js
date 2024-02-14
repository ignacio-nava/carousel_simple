// carousel/structures/navigationStructure.js
var navigationStructure = {
  classic: {
    element: "div",
    classes: [
      "carousel-navigation"
    ],
    childrens: [
      {
        element: "div",
        classes: [
          "carousel-navigation-item",
          "carousel-left",
          "half-right"
        ],
        styles: [
          {
            name: "--side-shadow",
            value: "-1"
          }
        ],
        attibutes: [
          {
            name: "aria-label",
            value: "carousel-prev"
          }
        ],
        eventListeners: [
          {
            event: "click",
            callback: "_navigatorClickListenerClassic"
          }
        ],
        childrens: [
          {
            element: "div",
            childrens: [
              {
                element: "span",
                classes: [
                  "carousel-navigation-arrow"
                ],
                styles: [
                  {
                    name: "--right-position",
                    value: "12px"
                  }
                ],
                innerHTML: "&lt"
              }
            ]
          }
        ]
      },
      {
        element: "div",
        classes: [
          "carousel-navigation-item",
          "carousel-right",
          "half-left"
        ],
        attibutes: [
          {
            name: "aria-label",
            value: "carousel-next"
          }
        ],
        eventListeners: [
          {
            event: "click",
            callback: "_navigatorClickListenerClassic"
          }
        ],
        callback: (object, element) => setInterval(() => {
          const isHover = element.getAttribute("data-visible");
          if (!isHover)
            element.children[0].click();
        }, object.timerAuto),
        childrens: [
          {
            element: "div",
            childrens: [
              {
                element: "span",
                classes: [
                  "carousel-navigation-arrow"
                ],
                styles: [
                  {
                    name: "--left-position",
                    value: "12px"
                  }
                ],
                innerHTML: "&gt"
              }
            ]
          }
        ]
      }
    ]
  },
  slide: {
    element: "div",
    classes: [
      "carousel-navigation"
    ],
    callback: (object, element) => {
      element.style = `--size-product-card-height: ${object.controlHeight}px`;
    },
    childrens: [
      {
        element: "div",
        classes: [
          "carousel-navigation-item",
          "carousel-left",
          "card-top-fixed",
          "card-left-fixed",
          "half-left"
        ],
        attibutes: [
          {
            name: "aria-label",
            value: "carousel-prev"
          }
        ],
        styles: [
          {
            name: "--side-shadow",
            value: "-1"
          },
          {
            name: "display",
            value: "none"
          }
        ],
        eventListeners: [
          {
            event: "click",
            callback: "_navigatorClickListenerSlide"
          }
        ],
        childrens: [
          {
            element: "div",
            childrens: [
              {
                element: "span",
                classes: [
                  "carousel-navigation-arrow"
                ],
                styles: [
                  {
                    name: "--left-position",
                    value: "50%"
                  },
                  {
                    name: "transform",
                    value: "translate(-50%, -50%)"
                  }
                ],
                innerHTML: "&lt"
              }
            ]
          }
        ]
      },
      {
        element: "div",
        classes: [
          "carousel-navigation-item",
          "carousel-right",
          "card-top-fixed",
          "card-right-fixed",
          "half-right"
        ],
        attibutes: [
          {
            name: "aria-label",
            value: "carousel-next"
          }
        ],
        eventListeners: [
          {
            event: "click",
            callback: "_navigatorClickListenerSlide"
          }
        ],
        childrens: [
          {
            element: "div",
            childrens: [
              {
                element: "span",
                classes: [
                  "carousel-navigation-arrow"
                ],
                styles: [
                  {
                    name: "--left-position",
                    value: "50%"
                  },
                  {
                    name: "transform",
                    value: "translate(-50%, -50%)"
                  }
                ],
                innerHTML: "&gt"
              }
            ]
          }
        ]
      }
    ]
  }
};

// carousel/structures/bulletsStructure.js
var bulletsStructure = {
  classic: {
    element: "div",
    classes: [
      "carousel-bullets"
    ],
    setter: "divBullets",
    callback: (object, element) => {
      for (let i = 0; i < object.carouselItems.length; i++) {
        const bullet = document.createElement("div");
        bullet.setAttribute("data-index", i);
        object.carouselItems[i].getAttribute("data-status") == "active" ? bullet.setAttribute("data-active", "true") : bullet.setAttribute("data-active", "false");
        bullet.addEventListener("click", (e) => {
          const itemActiveIndex = e.target.getAttribute("data-index") * 1;
          object._setActiveItem(itemActiveIndex);
        });
        element.appendChild(bullet);
      }
    }
  }
};

// carousel/types/types.js
var constructorByTypes = {
  "classic": (element) => {
    element._restructure();
    element._setActiveItem(element.config.initialIndex, true);
    if (element.config.navigators) {
      element._buildElement(navigationStructure[element.config.navigators]);
    }
    if (element.config.bullets) {
      element._buildElement(bulletsStructure[element.config.bullets]);
    }
    ["mouseenter", "mouseleave"].forEach((listener) => element.carousel.addEventListener(listener, (e) => element._setNavigationHoverAnimation(e)));
  },
  "slide": (element) => {
    element._restructure();
    const itemsCopy = [...element.carouselItems];
    for (let i = 0; i < itemsCopy.length; i++) {
      const item = itemsCopy[i];
      element.carouselItemsDiv.removeChild(item);
    }
    element.slider = document.createElement("div");
    element.slider.classList.add("slide-row");
    for (let i = 0; i < itemsCopy.length; i++) {
      const item = itemsCopy[i];
      item.setAttribute("data-index", i);
      element.slider.appendChild(item);
    }
    element.carouselItemsDiv.appendChild(element.slider);
    element.carouselItems = element.carouselItems[0].children;
    if (element.config.navigators) {
      element._buildElement(navigationStructure[element.config.navigators]);
    }
    ["mouseenter", "mouseleave"].forEach((listener) => element.carouselItemsDiv.addEventListener(listener, (e) => element._setNavigationHoverAnimation(e)));
  }
};
var carouselTypes = {
  classic: (option) => option === false ? option : "classic",
  slide: (option) => option === false ? option : "slide"
};
var navigationEvents = {
  mouseenter: (navigator) => {
    navigator.setAttribute("data-visible", "true");
    navigator.addEventListener("mouseenter", (e) => {
      e.target.setAttribute("data-visible", "true");
    });
  },
  mouseleave: (navigator) => navigator.removeAttribute("data-visible")
};

// carousel/main.js
var Carousel = class {
  /**
  * Creates an instance of Carousel.
  * @author: - ignacionava y rufina
  * @param { string } selector - The HTML element where to build the carousel.
  * @param { number } [timerAuto=7000] - Time slide is ms. Default: 7000.
  */
  constructor(selector, timerAuto = 7e3) {
    this.carousel = document.querySelector(selector);
    this.timerAuto = timerAuto;
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
  async build(config = {}) {
    this.carousel.classList.add("carousel");
    this.config = {
      type: carouselTypes.hasOwnProperty(config.type) ? config.type : "classic"
    };
    this.config = {
      ...this.config,
      initialIndex: config.initialIndex || 0,
      navigators: carouselTypes[this.config.type](config.navigators),
      bullets: carouselTypes[this.config.type](config.bullets)
    };
    await constructorByTypes[this.config.type](this);
  }
  /**
   * Restructure carousel elements. Set carouselItemsDiv and carouselItems.
   * (1) Create an empty child (First Child) and append to main carousel element.
   * (2) Remove all carousel items and append to First Child.
   * @private
   */
  _restructure() {
    this.carouselItemsDiv = document.createElement("div");
    this.carouselItemsDiv.classList.add(`carousel-${this.config.type}`);
    this.controlHeight = this.carousel.children[0].clientHeight;
    this.carouselItemsDiv.style = `--height-child: ${this.controlHeight}px`;
    this.carousel.appendChild(this.carouselItemsDiv);
    const childCount = this.carousel.childElementCount;
    for (let i = childCount - 2; i >= 0; i--) {
      const item = this.carousel.children[i];
      item.classList.add(`carousel-item-${this.config.type}`);
      item.dataset.index = i;
      this.carousel.removeChild(item);
      this.carouselItemsDiv.insertBefore(item, this.carouselItemsDiv.children[0]);
    }
    this.carouselItems = this.carouselItemsDiv.children;
  }
  /**
   * Create children element and append to parent.
   * @private
   * @param {object} obj - Object with the element structure.
   * @param {object} parent - HTML element where append children.
   */
  _buildElement(obj, parent = this.carousel) {
    const element = document.createElement(obj.element);
    obj.classes && obj.classes.forEach((c) => element.classList.add(c));
    obj.styles && obj.styles.forEach((s) => element.style.setProperty(s.name, s.value));
    obj.attibutes && obj.attibutes.forEach((attr) => element.setAttribute(attr.name, attr.value));
    if (obj.eventListeners) {
      for (let i = 0; i < obj.eventListeners.length; i++) {
        const { event, callback } = obj.eventListeners[i];
        element.addEventListener(event, (e) => this[callback](e));
      }
    }
    if (obj.innerHTML)
      element.innerHTML = obj.innerHTML;
    obj.childrens && obj.childrens.forEach((children) => this._buildElement(children, element));
    obj.callback && obj.callback(this, element);
    if (obj.setter)
      this[obj.setter] = element;
    parent.appendChild(element);
  }
  /**
   * Set the item as 'active'.
   * @private 
   * @param {number} newIndex - The new item index to set 'active'.
   * @param {boolean} [initial=false] - It checks if this is the initial event.
   */
  _setActiveItem(newIndex, initial = false) {
    newIndex = newIndex % this.carouselItems.length >= 0 ? newIndex % this.carouselItems.length : this.carouselItems.length + newIndex % this.carouselItems.length;
    let oldIndex;
    let side_to_animate;
    for (let i = 0; i < this.carouselItems.length; i++) {
      if (this.carouselItems[i].getAttribute("data-status") == "active") {
        oldIndex = this.carouselItems[i].getAttribute("data-index") * 1;
        side_to_animate = this._setAnimationsName(oldIndex, newIndex);
      }
      if (i != newIndex) {
        this.carouselItems[i].setAttribute("data-status", "moving");
        this.divBullets && this.divBullets.children[i].setAttribute("data-active", "false");
      }
    }
    this.carouselItems[newIndex].setAttribute("data-status", "active");
    this.divBullets && this.divBullets.children[newIndex].setAttribute("data-active", "true");
    this.carouselItems[newIndex].setAttribute("data-animation", `from-${side_to_animate}`);
    !initial && this.carouselItems[oldIndex].setAttribute("data-animation", `to-${side_to_animate}`);
  }
  /**
   * Hanlde click envent for navigators when type is classic.
   * @private
   * @param {MouseEvent} e - Click event.
   * @listens navigator#click
   */
  _navigatorClickListenerClassic(e) {
    const element = this._getNavigationRuler(e);
    const itemActiveIndex = [...this.carouselItems].filter((item) => item.getAttribute("data-status") == "active")[0].getAttribute("data-index") * 1;
    const arialLabel = element.getAttribute("aria-label");
    let value = 0;
    if (arialLabel == "carousel-prev") {
      value--;
    } else if (arialLabel == "carousel-next") {
      value++;
    }
    this._setActiveItem(itemActiveIndex + value);
  }
  /**
   * Hanlde click envent for navigators when type is slide.
   * @private
   * @param {MouseEvent} e - Click event.
   * @listens navigator#click
   */
  _navigatorClickListenerSlide(e) {
    const element = this._getNavigationRuler(e);
    const itemPerRow = Number(getComputedStyle(this.slider).getPropertyValue("--slide-items-per-row"));
    const translateXPositions = [];
    for (let i = 0; i < this.slider.childElementCount; i += itemPerRow) {
      translateXPositions.push(i * -100);
    }
    let slideToLeft = Number(this.slider.style.getPropertyValue("--slide-to-left"));
    let currentTranslateX = translateXPositions.indexOf(slideToLeft);
    const arialLabel = element.getAttribute("aria-label");
    if (arialLabel == "carousel-prev") {
      currentTranslateX--;
    } else if (arialLabel == "carousel-next") {
      currentTranslateX++;
    }
    slideToLeft = translateXPositions[currentTranslateX];
    this.slider.style.setProperty("--slide-to-left", slideToLeft);
    const [prevNavigator, nextNavigator] = this.carouselItemsDiv.parentElement.querySelectorAll(".carousel-navigation-item");
    if (currentTranslateX < 1) {
      prevNavigator.style.setProperty("display", "none");
      nextNavigator.style.setProperty("display", "block");
    } else if (currentTranslateX >= translateXPositions.length - 1) {
      prevNavigator.style.setProperty("display", "block");
      nextNavigator.style.setProperty("display", "none");
    } else {
      prevNavigator.style.setProperty("display", "block");
      nextNavigator.style.setProperty("display", "block");
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
      return oldIndex > newIndex ? "left" : "right";
    }
    return oldIndex < newIndex ? "left" : "right";
  }
  /**
   * Handle hover animations 'mouseenter' and 'mouseleave'
   * @private
   * @param {object} e - Object event. 
   */
  _setNavigationHoverAnimation(e) {
    const navigators = this.carousel.querySelectorAll(".carousel-navigation-item");
    for (let navigator of navigators) {
      navigationEvents[e.type](navigator);
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
    return e.target.localName === "span" ? e.target.parentElement.parentElement : e.target.parentElement;
  }
};

// index.js
var carousel = new Carousel();
