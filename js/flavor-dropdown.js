function initFlavorDropdowns(selector = 'select.sabor-select-large') {
    const cerrarTodos = () => {
        document.querySelectorAll('.flavor-select.open').forEach((selectWrap) => {
            selectWrap.classList.remove('open');
            const trigger = selectWrap.querySelector('.flavor-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    };

    document.querySelectorAll(selector).forEach((nativeSelect) => {
        if (!nativeSelect || nativeSelect.dataset.enhanced === 'true') return;

        const options = Array.from(nativeSelect.options);
        if (!options.length) return;

        nativeSelect.classList.add('apple-select-native');
        nativeSelect.dataset.enhanced = 'true';

        const wrap = document.createElement('div');
        wrap.className = 'flavor-select flavor-select-large';

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'flavor-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        const menu = document.createElement('ul');
        menu.className = 'flavor-menu';
        menu.setAttribute('role', 'listbox');

        const selectedOption = nativeSelect.options[nativeSelect.selectedIndex] || options[0];
        trigger.textContent = selectedOption.textContent || 'Selecciona un sabor';

        options.forEach((option, idx) => {
            const item = document.createElement('li');
            item.className = `flavor-option${option.selected ? ' active' : ''}`;
            item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', option.selected ? 'true' : 'false');
            item.dataset.value = option.value;
            item.textContent = option.textContent || '';

            item.onclick = (event) => {
                event.stopPropagation();
                nativeSelect.value = option.value;
                trigger.textContent = option.textContent || '';

                menu.querySelectorAll('.flavor-option').forEach((opt) => {
                    opt.classList.remove('active');
                    opt.setAttribute('aria-selected', 'false');
                });
                item.classList.add('active');
                item.setAttribute('aria-selected', 'true');

                wrap.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            };

            if (!nativeSelect.value && idx === 0) {
                item.classList.add('active');
                item.setAttribute('aria-selected', 'true');
            }

            menu.appendChild(item);
        });

        trigger.onclick = (event) => {
            event.stopPropagation();
            const wasOpen = wrap.classList.contains('open');
            cerrarTodos();
            if (!wasOpen) {
                wrap.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        };

        nativeSelect.parentNode.insertBefore(wrap, nativeSelect);
        wrap.appendChild(trigger);
        wrap.appendChild(menu);
        wrap.appendChild(nativeSelect);
    });

    document.addEventListener('click', cerrarTodos);
}

document.addEventListener('DOMContentLoaded', () => {
    initFlavorDropdowns();
});
