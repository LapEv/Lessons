window.addEventListener('DOMContentLoaded', function(){
    'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a){
        for(let i = a; i < tabContent.length; i++){
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);

    function showTabContent(b){
        if (tabContent[b].classList.contains('hide')){
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', (event) => {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')){
            for(let i = 0; i < tab.length; i++){
                if (target == tab[i]){
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

// Timer

    let deadline = '2019-06-25';

    function getTimeRemaining(endtime){
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000/60) % 60),
//            hours = Math.floor((t/(1000*60*60)));
            hours = Math.floor((t/1000/60/60) % 24),
            days = Math.floor((t/(1000*60*60*24)));
            if (seconds < 10) {seconds = '0' + seconds;}
            if (minutes < 10) {minutes = '0' + minutes;}
            if (hours < 10)   {hours   = '0' + hours;}
            switch(true){
                case days <= 0 : {
                    let daysclass = document.querySelector('.days'),
                        span = document.querySelectorAll('span')[1];
                        if (daysclass.style.display != 'none') daysclass.style.display = 'none';
                        if (span.style.display != 'none') span.style.display = 'none';
                    break;
                } 
                case days == 1 : days += ' день'; break;
                case days >= 2 && days <= 4 : days += ' дня'; break;
                case days >= 5 && days <= 20: days += ' дней'; break;
                case days >= 21 && days <= 21: days += ' день'; break;
                case days >= 22 && days <= 24: days += ' дня'; break;
                case days >= 25 && days <= 29: days += ' дней'; break;
            }
        return{
            'total' : t, 
            'days'  : days,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock(id, endtime){
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            days = timer.querySelector('.days'),
            timeInterval = setInterval(updateClock, 1000);
        
        function updateClock(){
            let t = getTimeRemaining(endtime);
            days.textContent = t.days;
            hours.textContent = t.hours;
            minutes.textContent = t.minutes;
            seconds.textContent = t.seconds;

            if (t.total <= 0){
                clearInterval(timeInterval);
            }
        }
    }
    setClock('timer', deadline);

// Modal
    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close'),
        moreElse = document.querySelectorAll('.description-btn');

    more.addEventListener('click', function(){
        overlay.style.display = 'block';
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden';
    });

    moreElse.forEach(element => {
        element.addEventListener('click', function(){
            overlay.style.display = 'block';
            this.classList.add('more-splash');
            document.body.style.overflow = 'hidden';
        });
    });

    //    moreElse.addEventListener('click', function(){
//        overlay.style.display = 'block';
//        this.classList.add('more-splash');
//        document.body.style.overflow = 'hidden';
//    });


    close.addEventListener('click', function(){
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
    });

    // Form

    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так!'
    };

    let form = document.querySelector('.main-form'),
        input = form.getElementsByTagName('input'),
        statusMessage = document.createElement('div');

        statusMessage.classList.add('status');

    let formData = new FormData(form);

    form.addEventListener('submit', function(event){
        event.preventDefault();
        form.appendChild(statusMessage);
        
        function postData(data){
            return new Promise(function(resolve,reject){
                let request = new XMLHttpRequest();
                request.open('POST','http://127.0.0.1:5500/server.php');
                request.setRequestHeader('Content-type','application/jsson; charset=UTF-8');

                request.onreadystatechange = function(){
                    if (request.readyState < 4){
                        resolve();
                    } else if (request.readyState === 4 && request.status == 200){
                        resolve();
                    } else {
                        reject();
                    }
                };
                request.send(data);
            });
        }
    
        function clearInput(){
            for (let i = 0; i < input.length; i++){
                input[i].value = '';
            }
        }
    
        postData(formData)
            .then(()=> statusMessage.innerHTML = message.loading)
            .then(()=> statusMessage.innerHTML = message.success)
            .catch(()=> statusMessage.innerHTML = message.failure)
            .then(clearInput);
    });

    // Slider

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');
    
    showSlides(slideIndex);
    
    function showSlides(n){

        if (n > slides.length){
            slideIndex = 1;
        }
        if (n < 1){
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');
        dots.forEach((item) => item.classList.remove('dot-active'));
        slides[slideIndex-1].style.display = 'block';
        dots[slideIndex-1].classList.add('dot-active');
    }

    function plusSlides(n){
        showSlides(slideIndex += n);
    }
    function currentSlide(n){
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function(){
        plusSlides(-1);
    });
    next.addEventListener('click', function(){
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function(event){
        for (let i = 0; i < dots.length + 1; i++){
            if (event.target.classList.contains('dot') && event.target == dots[i-1]){
                currentSlide(i);
            }
        }
    });

    //calc

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = 0,
        daysSum = 0;

    totalValue.innerHTML = 0;

    persons.addEventListener('change', function(){
        personsSum = +this.value;
        daysSum = restDays.value;
        let total = (daysSum + personsSum)*10000*place.options[place.selectedIndex].value;

        if (restDays.value == '' || this.value == ''){
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });
    restDays.addEventListener('change', function(){
        daysSum = +this.value;
        personsSum = persons.value;
        let total = (daysSum + personsSum)*10000*place.options[place.selectedIndex].value;

        if (persons.value == '' || this.value == ''){
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }
    });
    
    place.addEventListener('change', function(){
        if (restDays.value == '' || persons.value == ''){
            totalValue.innerHTML = 0;
        } else {
            let a = (restDays.value + persons.value)*10000;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value;
        }
    });
});