export const navigationStructure = {
    classic: {
        element: 'div',
        classes: [
            'carousel-navigation'
        ],
        childrens: [
            {
                element: 'div',
                classes: [
                    'carousel-navigation-item',
                    'carousel-left',
                    'half-right'
                ],
                styles: [
                    {
                        name: '--side-shadow',
                        value: '-1'
                    }
                ],
                attibutes: [
                    {
                        name: 'aria-label',
                        value: 'carousel-prev'
                    }
                ],
                eventListeners: [
                    {
                        event: 'click',
                        callback: '_navigatorClickListenerClassic'
                    }
                ],
                childrens: [
                    {
                        element: 'div',
                        childrens: [
                            {
                                element: 'span',
                                classes: [
                                    'carousel-navigation-arrow'
                                ],
                                styles: [
                                    {
                                        name: '--right-position',
                                        value: '12px'
                                    }
                                ],
                                innerHTML: '&lt'
                            }
                        ]
                    }
                ]
            },
            {
                element: 'div',
                classes: [
                    'carousel-navigation-item',
                    'carousel-right',
                    'half-left'
                ],
                attibutes: [
                    {
                        name: 'aria-label',
                        value: 'carousel-next'
                    }
                ],
                eventListeners: [
                    {
                        event: 'click',
                        callback: '_navigatorClickListenerClassic'
                    }
                ],
                callback: (object, element) => ((
                    setInterval(() => {
                        const isHover = element.getAttribute('data-visible')
                        if (!isHover) element.children[0].click()
                    }, object.timerAuto)
                )),
                childrens: [
                    {
                        element: 'div',
                        childrens: [
                            {
                                element: 'span',
                                classes: [
                                    'carousel-navigation-arrow'
                                ],
                                styles: [
                                    {
                                        name: '--left-position',
                                        value: '12px'
                                    }
                                ],
                                innerHTML: '&gt'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    slide: {
        element: 'div',
        classes: [
            'carousel-navigation'
        ],
        callback: (object, element) => {
            element.style = `--size-product-card-height: ${object.controlHeight}px`
        },
        childrens: [
            {
                element: 'div',
                classes: [
                    'carousel-navigation-item',
                    'carousel-left',
                    'card-top-fixed',
                    'card-left-fixed',
                    'half-left'
                ],
                attibutes: [
                    {
                        name: 'aria-label',
                        value: 'carousel-prev'
                    }
                ],
                styles: [
                    {
                        name: '--side-shadow',
                        value: '-1'
                    },
                    {
                        name: 'display',
                        value: 'none'
                    }
                ],
                eventListeners: [
                    {
                        event: 'click',
                        callback: '_navigatorClickListenerSlide'
                    }
                ],
                childrens: [
                    {
                        element: 'div',
                        childrens: [
                            {
                                element: 'span',
                                classes: [
                                    'carousel-navigation-arrow'
                                ],
                                styles: [
                                    {
                                        name: '--left-position',
                                        value: '50%'
                                    },
                                    {
                                        name: 'transform',
                                        value: 'translate(-50%, -50%)'
                                    }
                                ],
                                innerHTML: '&lt'
                            }
                        ]
                    }
                ]
            },
            {
                element: 'div',
                classes: [
                    'carousel-navigation-item',
                    'carousel-right',
                    'card-top-fixed',
                    'card-right-fixed',
                    'half-right'
                ],
                attibutes: [
                    {
                        name: 'aria-label',
                        value: 'carousel-next'
                    }
                ],
                eventListeners: [
                    {
                        event: 'click',
                        callback: '_navigatorClickListenerSlide'
                    }
                ],
                childrens: [
                    {
                        element: 'div',
                        childrens: [
                            {
                                element: 'span',
                                classes: [
                                    'carousel-navigation-arrow'
                                ],
                                styles: [
                                    {
                                        name: '--left-position',
                                        value: '50%'
                                    },
                                    {
                                        name: 'transform',
                                        value: 'translate(-50%, -50%)'
                                    }
                                ],
                                innerHTML: '&gt'
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
