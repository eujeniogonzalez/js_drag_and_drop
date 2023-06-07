const CSS_DRAGGING_CLASS_NAME = 'dragging';
const CSS_DRAGGABLE_ITEM_CLASS_NAME = 'draggable-item';

const container = document.querySelector('.container');
const items = container.querySelectorAll('.item');
const draggableItems = container.querySelectorAll(`.${CSS_DRAGGABLE_ITEM_CLASS_NAME}`);

let dragOverItem = null;
let notDraggingItems = null;

for (let i = 0; i < items.length; i++) {
    draggableItems[i].addEventListener('dragstart', (e) => draggableItemDragStartHandler(e, i));
    draggableItems[i].addEventListener('dragend', () => draggableItemDragEndHandler(i));

    items[i].addEventListener('dragover', itemDragOverHandler);
    items[i].addEventListener('drop', itemDropHandler);
}

// Helpers (start)
function rerenderItems(excludedIndex) {
    if (excludedIndex === -1) {
        return;
    }

    items.forEach((item, i) => {
        if (item.firstElementChild && !isElementDragging(item.firstElementChild)) {
            item.removeChild(item.firstElementChild);
        }

        if (excludedIndex !== i) {
            if (i < excludedIndex) {
                item.append(notDraggingItems[i]);
            } else if (i > excludedIndex) {
                item.append(notDraggingItems[i - 1]);
            }
        }
    });
}

function isElementDragging(element) {
    return element.classList.contains(CSS_DRAGGING_CLASS_NAME);
}
// Helpers (end)

// Handlers (start)
function draggableItemDragStartHandler(e, i) {
    e.dataTransfer.setData('id', e.target.id);
    setTimeout(() => draggableItems[i].classList.add(CSS_DRAGGING_CLASS_NAME));
}

function draggableItemDragEndHandler(i) {
    draggableItems[i].classList.remove(CSS_DRAGGING_CLASS_NAME);
}

function itemDragOverHandler(e) {
    e.preventDefault();

    if (dragOverItem === e.target) {
        return;
    }

    dragOverItem = e.target;

    notDraggingItems = Array.from(container.querySelectorAll(`.${CSS_DRAGGABLE_ITEM_CLASS_NAME}:not(.${CSS_DRAGGING_CLASS_NAME})`));

    const excludedIndex = Array.from(items).indexOf(dragOverItem);
    rerenderItems(excludedIndex);
}

function itemDropHandler(e) {
    let itemId = e.dataTransfer.getData('id');
    let draggingElement = document.getElementById(itemId);

    e.target.append(draggingElement);

    dragOverItem = null;
    notDraggingItems = null;
}
// Handlers (end)
