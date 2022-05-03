 /**
 * v-prClick
 * Copyright (c) 2019 ruoyi
 */

import store from '@/store'

export default {
  inserted(el, binding) {
    el.addEventListener('click', (e) => {
        if (el.nodeName !== 'BUTTON') {
            el.style.cssText = "pointer-events: none"
            setTimeout(() => {
                el.style.cssText = "pointer-events: auto"
            }, binding.value || 3000)
        } else {
            if (!el.disabled) {
                el.classList.add('is-disabled');
                el.disabled = true
                setTimeout(() => {
                    el.classList.remove('is-disabled');
                    el.disabled = false
                }, binding.value || 3000)
            }
        }

    })
}
}
