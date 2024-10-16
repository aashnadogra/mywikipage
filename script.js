
document.addEventListener('DOMContentLoaded', function () {
    const tocContainer = document.querySelector('#toc ul');
    const allHeaders = document.querySelectorAll('section h1, section h2, section h3, section h4, section h5, section h6');

    const generateID = (text) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const buildToC = () => {
        const toc = [];
        const stack = [{ children: toc, level: 0 }];

        allHeaders.forEach(header => {
            const level = parseInt(header.tagName.substring(1));
            const text = header.textContent;
            const id = generateID(text);

            header.id = id; // Assign ID to the header for linking

            const tocItem = { text, id, children: [] };

            while (level <= stack[stack.length - 1].level && stack.length > 1) {
                stack.pop();
            }

            stack[stack.length - 1].children.push(tocItem);
            stack.push({ children: tocItem.children, level });
        });

        const createList = (items, parentUl, currentLevel) => {
            items.forEach(item => {
                const li = document.createElement('li');
                li.classList.add(`toc-level-${currentLevel}`);
                
                const a = document.createElement('a');
                a.href = `#${item.id}`;
                a.textContent = item.text;
                li.appendChild(a);
                parentUl.appendChild(li);

                if (item.children.length > 0) {
                    const ul = document.createElement('ul');
                    ul.classList.add('list-group', 'ms-3'); 
                    li.appendChild(ul);
                    createList(item.children, ul, currentLevel + 1);
                }
            });
        };

        createList(toc, tocContainer, 1);
    };

    const setupCollapsibles = () => {
        allHeaders.forEach(header => {
            header.addEventListener('click', function () {
                const content = header.nextElementSibling;
                if (content && content.classList.contains('content')) {
                    const isVisible = content.style.display === 'block';
                    content.style.display = isVisible ? 'none' : 'block';
                    header.classList.toggle('active-heading', !isVisible);
                }
            });
        });
    };

    const setupToCLinks = () => {
        const tocLinks = document.querySelectorAll('#toc a');
        tocLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const content = targetElement.nextElementSibling;
                    const isVisible = content.style.display === 'block';
                    content.style.display = isVisible ? 'none' : 'block';
                    targetElement.classList.toggle('active-heading', !isVisible);
                    
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };

    buildToC();
    setupCollapsibles();
    setupToCLinks();
});
