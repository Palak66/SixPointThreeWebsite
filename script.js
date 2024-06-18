document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');

    const predefinedPositions = {
        drop1: { left: '50%', top: '25px', rotation: '0deg' },
        drop2: { left: '50%', top: '20px', rotation: '0deg' },
        drop3: { left: '50%', top: '30px', rotation: '0deg' }
    };

    draggables.forEach(draggable => {
        // Set random position and rotation
        const randomX = Math.random() * (window.innerWidth - 100);
        const randomY = Math.random() * (window.innerHeight - 100);
        const randomRotation = Math.random() * 360;

        draggable.style.left = `${randomX}px`;
        draggable.style.top = `${randomY}px`;
        draggable.style.transform = `rotate(${randomRotation}deg)`;

        // Add event listeners for dragging
        draggable.addEventListener('mousedown', startDrag);
        draggable.addEventListener('touchstart', startDragTouch, { passive: false });
    });

    function startDrag(e) {
        if (e.button !== 0) return; 

        const element = e.target.closest('.draggable');
        let shiftX = e.clientX - element.getBoundingClientRect().left;
        let shiftY = e.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            checkDrop(element);
        }, { once: true });

        element.ondragstart = function() {
            return false;
        };
    }

    function startDragTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const element = e.target.closest('.draggable');
        let shiftX = touch.clientX - element.getBoundingClientRect().left;
        let shiftY = touch.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }

        function onTouchMove(e) {
            const touch = e.touches[0];
            moveAt(touch.pageX, touch.pageY);
        }

        document.addEventListener('touchmove', onTouchMove);

        document.addEventListener('touchend', function onTouchEnd() {
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            checkDrop(element);
        }, { once: true });

        element.ondragstart = function() {
            return false;
        };
    }

    function checkDrop(element) {
        const elementRect = element.getBoundingClientRect();
        dropZones.forEach(zone => {
            const zoneRect = zone.getBoundingClientRect();
            if (
                elementRect.left + elementRect.width / 2 >= zoneRect.left &&
                elementRect.left + elementRect.width / 2 <= zoneRect.right &&
                elementRect.top + elementRect.height / 2 >= zoneRect.top &&
                elementRect.top + elementRect.height / 2 <= zoneRect.bottom
            ) {
                element.style.left = `${zoneRect.left + (zoneRect.width / 2 - elementRect.width / 2)}px`;
                element.style.top = `${zoneRect.top + (zoneRect.height / 2 - elementRect.height / 2)}px`;
                element.style.transform = `rotate(0deg)`;
            }
        });
    }
});