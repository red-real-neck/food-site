document.addEventListener('DOMContentLoaded', () => {

    //tabs switcher
    const tabsContent = document.querySelectorAll(".tabcontent"),
          tabs = document.querySelectorAll('.tabheader__item'),
          tabsWrapper = document.querySelector('.tabcontainer');

    const activeTabIndex = function (array) {
        let i;
        array.forEach((item, index) => {
            if (item.classList.contains('tabheader__item_active')) {
                i = index;
            }
        });
        return i;
    };

    tabsWrapper.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('tabheader__item')) {
            if (!event.target.classList.contains('.tabheader__item_active')) {
                let activeTabContentIndex;
                tabs.forEach((item) => {
                    item.classList.remove('tabheader__item_active');
                });
                tabsContent.forEach((item) => {
                    item.classList.remove('tabcontent_active');
                });
                event.target.classList.add('tabheader__item_active');
                activeTabContentIndex = activeTabIndex(tabs);
                tabsContent[activeTabContentIndex].classList.add('tabcontent_active');
            }
        }
    });

    //timer

    const deadLine = '2021-05-04';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor(t / (1000 * 60 * 60) % 24),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds

        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = document.querySelector('#days'),
            hours = document.querySelector('#hours'),
            minutes = document.querySelector('#minutes'),
            seconds = document.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadLine);

    // modal

    const btnModal = document.querySelectorAll(`[data-modal]`),
        modal = document.querySelector('.modal'),
        modalClose = document.querySelector('[data-close]');

    btnModal.forEach((item) => {
        item.addEventListener('click', function () {
            modal.style.display = 'block';
        });
    });
    modalClose.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    //cards

    class Card {
        constructor(img, alt, subtitle, descr, total, parrentSelector, ...classes) {
            this.img = img;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.total = total;
            this.parrentElement = document.querySelector(parrentSelector);
            this.classes = classes;
        }

        addCard() {
            const wrapper = document.createElement('div');
            if (this.classes.length === 0) {
                this.classes.push('menu__item');
            } else {
                this.classes.forEach(className => wrapper.classList.add(className));
            }
            wrapper.innerHTML =
                `<img src=${this.img} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.total}</span> грн/день</div>
                </div>`
                ;
            this.parrentElement.append(wrapper);
        }
    }

    const menuFitness = new Card(
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        '229',
        '[data-menu]',
        'menu__item'
    );

    menuFitness.addCard();

    const menuPremium = new Card('img/tabs/elite.jpg', 'elite', 'Меню “Премиум”', 'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!', '550', '[data-menu]', 'menu__item');

    menuPremium.addCard();

    const menuKek = new Card('img/tabs/elite.jpg', 'elite', 'Меню “Премиум”', 'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!', '550', '[data-menu]', 'menu__item');

    menuKek.addCard();

    //forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! Мы скоро с вами свяжемся.',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const formData = new FormData(form);

            fetch('server.php', {
                method: 'POST',
                body: formData,
            })
                .then(
                    response => {
                        if (response.status == 200) {
                            console.log('Данные отправились');
                            statusMessage.textContent = message.success;
                        }
                    },
                    (err) => {
                        console.log(err);
                        statusMessage.textContent = message.failure;
                    }
                );
        });
    }  

    //slider

    const sliders = document.querySelectorAll('.offer__slide'),
          nextBtn = document.querySelector('.offer__slider-next'),
          prevBtn = document.querySelector('.offer__slider-prev'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          inner = document.querySelector('.offer__slider-inner'),
          wrapper = document.querySelector('.offer__slider-wrapper'),
          innerWidth = window.getComputedStyle(wrapper).width;


    let slideIndex = 0;

    inner.style.overflow = 'hidden';



    if (sliders.length < 10) {
        total.textContent = `0${sliders.length}`;
    } else {
        total.textContent = sliders.length;
    }

    showSlides(slideIndex);

    function showSlides(n) {
        sliders.forEach(slide => {
            slide.style.display = 'none';
        }); 

        if (slideIndex >= sliders.length) {
            slideIndex = sliders.length - 1;
        }
        if (slideIndex < 0) {
            slideIndex = 0;
        }

        if (sliders.length < 10) {
            current.textContent = `0${slideIndex + 1}`;
        } else {
            current.textContent = slideIndex + 1;
        }
        
        sliders[slideIndex].style.display = 'block';
    }

    nextBtn.addEventListener('click', (e) => {
        showSlides(slideIndex += 1);
        console.log(slideIndex);
    });

    prevBtn.addEventListener('click', (e) => {
        showSlides(slideIndex -= 1);
        console.log(slideIndex);
    });

    //calculator

    const genderBtns = document.querySelector('#gendersbtn'),
          maleBtn = document.querySelector('#male'),
          femaleBtn = document.querySelector('#female'),
          parametersWrapper = document.querySelector('#parameters'),
          heightInput = document.querySelector('#height'),
          weightInput = document.querySelector('#weight'),
          ageInput = document.querySelector('#age'),
          activityWrapper = document.querySelector('#activity-wrapper'),
          activityBtns = document.querySelectorAll('.calculating__choose-btn'),
          lowBtn = document.querySelector('#low'),
          smallBtn = document.querySelector('#small'),
          mediumBtn = document.querySelector('#medium'),
          hightBtn = document.querySelector('#hight'),
          result = document.querySelector('#result');

    let isMale = false,
        activityKPI = 1.375;

        calculateBMR();

    genderBtns.addEventListener('click', event => {
        const target = event.target;
        if (target && target.id == 'male' && target.classList.contains('calculating__choose-item_active')) {
            console.log(activityKPI);
            return;
        } else if (target && target.id == 'male' && !(target.classList.contains('calculating__choose-item_active'))) {
            femaleBtn.classList.remove('calculating__choose-item_active');
            maleBtn.classList.add('calculating__choose-item_active');
            isMale = true;
            console.log(activityKPI);
            calculateBMR();
            return;
        } else if (target && target.id == 'female' && target.classList.contains('calculating__choose-item_active')) {
            console.log(activityKPI);
            return;
        } else {
            maleBtn.classList.remove('calculating__choose-item_active');
            femaleBtn.classList.add('calculating__choose-item_active');
            isMale = false;
            console.log(activityKPI);
        }
        calculateBMR();
    });

    activityWrapper.addEventListener('click', event => {
        const target = event.target;
        if (target && target.classList.contains('calculating__choose-btn')) {
            activityBtns.forEach((item) => {
                item.classList.remove('calculating__choose-item_active');
            });
    
            target.classList.add('calculating__choose-item_active');
    
            switch (target.id) {
                case 'low':
                    activityKPI = 1.2;
                    break;
                case 'small':
                    activityKPI = 1.375;
                    break;
                case 'medium':
                    activityKPI = 1.55;
                    break;
                case 'high':
                    activityKPI = 1.725;
                    break;
            }
            calculateBMR();
        }
    });

    parametersWrapper.addEventListener('input', () => {
        calculateBMR();
    });

    function calculateBMR() {
        let height = heightInput.value,
            weight = weightInput.value,
            age = ageInput.value;
            console.log(height);

        if (height == '' || weight == '' || age == '') {
            result.innerHTML = 'Введите все значения';
            return;
        } else {
            result.innerHTML = '<span></span> ккал';
        }

        if (isMale) {
            result.firstChild.textContent = Math.round(activityKPI * (88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)));
        } else {
            result.firstChild.textContent = Math.round(activityKPI * (447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)));
        }
    }
    
    
});

