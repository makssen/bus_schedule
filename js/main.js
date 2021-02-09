const scheduleStart = document.querySelector('#minsk');
const scheduleEnd = document.querySelector('#zhuklug');
const footerHead = document.querySelector('.footer-header');




/* Вычисление ближайшего автобуса */

const nearestBus = (data) => {

    let startBus = [];
    let endBus = [];
    data.forEach(item => {
        startBus.push(item.start);
        endBus.push(item.end);
    });


    const createNearestBus = (bus, block) => {

        let nearest = [];
        let nextNearest = [];
        let today = new Date();

        bus.forEach(item => {
            item.forEach(time => {
                let bus = {
                    hours: +time.time.substring(0, 5).split(':')[0],
                    minutes: +time.time.substring(0, 5).split(':')[1],
                    full: time.time
                }
                nearest.push(bus);
            });
        });

        nearest.forEach(item => {
            let end = new Date();
            end = new Date(end.getFullYear(), end.getMonth(), end.getDate(), item.hours, item.minutes);
            if (end.getTime() >= today.getTime()) {
                nextNearest.push(item);
            }
        });

        nextNearest.sort((a, b) => a.hours - b.hours);
        nextNearest = nextNearest.slice(0, 5);

        nextNearest.forEach(item => {
            const span = document.createElement('span');
            span.classList.add('future');
            span.innerHTML = item.full;
            block.querySelector('.schedule-nearest').appendChild(span);
        });

    }

    createNearestBus(startBus, scheduleStart);
    createNearestBus(endBus, scheduleEnd);

}

//let timer = setInterval(nearestBus, 1000 * 60);

/* Получение списка автобусов */

const craeteSchedule = (data) => {

    const outputCraeteSchedule = (data, block) => {

        data.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('schedule-item');
            const spanBus = document.createElement('span');
            spanBus.classList.add('bus');
            spanBus.innerHTML = item.name;

            div.appendChild(spanBus);

            let timesStart = item.start;

            timesStart.forEach(time => {

                const spanTime = document.createElement('span');
                spanTime.classList.add('time');
                spanTime.innerHTML = time.time;
                spanTime.style.color = time.type === 'out' ? 'red' : '';

                div.appendChild(spanTime);

            });


            block.appendChild(div);

        });
    }

    outputCraeteSchedule(data, scheduleStart);
    outputCraeteSchedule(data, scheduleEnd);

}

const getData = () => {
    fetch('../db/schedule.json')
        .then(response => response.json())
        .then(response => {
            craeteSchedule(response);
            nearestBus(response);
        });
}


/* Вкладки (Табы) */

const showTab = () => {
    const tabs = document.querySelectorAll('.route-location');
    const bodys = document.querySelectorAll('.schedule');

    tabs.forEach(item => {
        item.addEventListener('click', () => {
            let currentTab = item;
            let currentBody = document.querySelector(`.schedule[id="${currentTab.dataset.tab}"]`);

            tabs.forEach(item => {
                item.classList.remove('active');
            });

            bodys.forEach(item => {
                item.classList.remove('active');
            });

            currentTab.classList.add('active');
            currentBody.classList.add('active');
        });
    });
}


const dateFooter = () => {
    let date = new Date();
    footerHead.innerHTML = `© makssen ${date.getFullYear()}`;
}


document.addEventListener('DOMContentLoaded', () => {
    getData();
    showTab();
    dateFooter();
});