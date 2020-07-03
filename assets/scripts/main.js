let headerIsScrolled = false; 
let isVisible;
let songs = [];
let songsMp3 =[];
let song = new Audio();
let currentMusic = 0;
let isPlaySong = false;
let fillBar = document.getElementsByClassName('fill');
var seekBar = document.getElementsByClassName('seek-bar');



function scrub(e){
    const scrubTime =(e.offsetX / seekBar[0].offsetWidth) * song.duration;
    song.currentTime = scrubTime;
}

function paralaxElem(elem){

    if(window.pageYOffset + window.outerHeight >= $(elem).parent().offset().top  && window.pageYOffset <= $(elem).parent().offset().top + $(elem).parent().outerHeight()){
        $(elem).css('transform' , 'translate(0px,'+((window.pageYOffset)-($(elem).parent().offset().top))/5 +'px)');
    }
}
function nextSong(){
    let musicName = songs[currentMusic].textContent;
    song.src = 'assets/audio/'+ songsMp3[currentMusic];
    song.play();
    $('#play-pause-player')[0].innerHTML = '&#xe019;';
    $('#audio-player .snog-name')[0].innerHTML = musicName;
    isPlaySong = true;
}
function buttonPauseSong(){
    if(isPlaySong){
        song.pause();
        isPlaySong = false;
        $('#play-pause-player')[0].innerHTML = '&#xe01a;';
        
    }else{
        song.play();
        isPlaySong = true;
        $('#play-pause-player')[0].innerHTML = '&#xe019;';
    }
}

function playNowSong(){
    let musicName = $(this).parent().children('.music-name')[0].textContent;
    for(i=0 ;i<songs.length;i++){
        if(musicName == songs[i].textContent){
            currentMusic = i;
        }
    }
    song.src = 'assets/audio/'+ songsMp3[currentMusic];
    song.play();
    $('#play-pause-player')[0].innerHTML = '&#xe019;';
    $('#audio-player').css('transform' , 'translate(0,0)');
    $('#scroll-to-up').css('bottom' , '80px');
    $('#audio-player .snog-name')[0].innerHTML = musicName;
    isPlaySong = true;
}
 function touchHover() {
    $('[data-hover]').on('touchend click' ,function(e){
        if (e.type == "touchend") {
            e.preventDefault();
            var $this = $(this);
            var onHover = $this.attr('data-hover');
            var linkHref = $this.attr('href');
            if (linkHref && $this.hasClass(onHover)) {  
            location.href = linkHref;
            return false;
        }
        $this.toggleClass(onHover);
        } 
        
    });
    $(document).on('touchend',function(e){
        if (!$('[data-hover]').is(e.target) && $('[data-hover]').has(e.target).length === 0){
                if($('[data-hover]').hasClass('onhover')){
                    $('[data-hover]').removeClass('onhover');
                }
        }
    })
};
function headerScrolled(){
    if(($(window).scrollTop() >= $('header').offset().top + $('header').outerHeight(true)) && (window.pageYOffset + window.outerHeight <= $('footer').offset().top )){
        if(!headerIsScrolled){
            $('#scroll-to-up').removeClass('unvisible');
            $('#scroll-to-up').addClass('visible');
            $('nav').css({
                'top' : -$('nav').outerHeight(true)+'px',
                'position': 'fixed',
                'background-color': 'rgba(255, 158, 163,1)'
            })
            $('nav').animate({
                'top':0
            },500);
            if(isPlaySong){
                $('#audio-player').css('transform' , 'translate(0,0)');
                $('#scroll-to-up').css('bottom' , '80px');
            }
            
            headerIsScrolled = true;
        }
    }else{
        if(headerIsScrolled){
            $('nav').css({
                'position': 'absolute',
                'background': '',
                'background-color': 'rgba(255, 158, 163,0)'
            });
            $('#audio-player').css('transform' , 'translate(0,100%)');
            $('#scroll-to-up').css('bottom' , '20px');
            $('#scroll-to-up').addClass('unvisible');
            $('#scroll-to-up').removeClass('visible');
            headerIsScrolled = false;
        }
    }
}
function scrolltoId(e , elem) {
    e.preventDefault();
    var id = $(elem).attr('href'),
    top = $(id).offset().top;
    $('body , html').animate({
        scrollTop : top
    } , 1000);
}
$(document).ready(function(){
    songs = document.querySelectorAll('#favorite-music .slider-nav .slider__item .music-name');
    for(let i=0;i<songs.length;i++){
        songsMp3[i] = songs[i].textContent +'.mp3'
    }
    touchHover();
    $('#play-pause-player').on('click' , buttonPauseSong );
    $('#favorite-music .slider-nav .slider__item .play-now').on('click' , playNowSong);
    $('#pre-player').on('click',function(){
        currentMusic -= 1;
        if(currentMusic < 0){
            currentMusic = songs.length -1;
        }
        nextSong();
    });
    $('#next-player').on('click',function(){
        currentMusic++;
        if(currentMusic >= songs.length){
            currentMusic = 0;
        }
        nextSong();
    });
    song.addEventListener('timeupdate' ,function(){
        let position = song.currentTime / song.duration;
        fillBar[0].style.width = position * 100 +'%';
    });
    song.addEventListener('ended',function(){
        currentMusic++;
        if(currentMusic >= songs.length){
            currentMusic = 0;
        }
        nextSong();
    });
    seekBar[0].addEventListener('click',scrub);


    $('#favorite-music .slider-nav').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 300,
        infinite: true,
        centerMode: true,
        arrows: false,
        focusOnSelect: true,
        responsive:[
            {
                breakpoint:660,
                settings:{
                    slidesToShow: 1,
                    autoplay:true,
                    autoplaySpeed: 3000,
                }
            },{
                breakpoint:950,
                settings:{
                    slidesToShow: 2,
                }
            }
        ]
    });
    $('#favorite-music .slider-nav').on('afterChange', function(slick, currentSlide){
        let firstImg =  $('#favorite-music .background-slider').children('img');
        $('#favorite-music .background-slider').prepend(`<img src="${$('#favorite-music .slider__item.slick-center').children('.album').attr('src')}"alt="">`);
        firstImg.fadeOut(300,function(){
            $(this).remove();
        });
    });
    const cards = document.querySelectorAll('.card-3d');
    let ParalaxElems = document.getElementsByClassName('paralax');
    window.addEventListener('scroll', function() {
        for(let Item of ParalaxElems){
            paralaxElem(Item);
        }
    });
    for(let Item of cards){
        Item.addEventListener('mousemove' , cards3D);
        Item.addEventListener('mouseout' , resetRotate)
        Item.addEventListener('touchmove' , touchCards3D);
        Item.addEventListener('touchend' , resetRotate);
    }
    function cards3D(){
        const cardItem = this.querySelector('.card-item-3d');
        var centerCardItemH = cardItem.offsetHeight/2;
        var centerCardItemW = cardItem.offsetWidth/2;
        cardItem.style.transform  = 'rotateX('+-(event.offsetY - centerCardItemH)/10+'deg) rotateY('+(event.offsetX - centerCardItemW)/7+'deg)' ;
    }
    function touchCards3D(){
        event.preventDefault();
        const cardItem = this.querySelector('.card-item-3d');
        let offsetY = Math.floor(event.changedTouches[0].pageY - $(cardItem).offset().top);
        let offsetX = Math.floor(event.changedTouches[0].pageX - $(cardItem).offset().left);
        var centerCardItemH = cardItem.offsetHeight/2;
        var centerCardItemW = cardItem.offsetWidth/2;
        cardItem.style.transform  = 'rotateX('+-(offsetY - centerCardItemH)/(document.documentElement.clientHeight/70)+'deg) rotateY('+(offsetX - centerCardItemW)/(document.documentElement.clientHeight/70)+'deg)' ;
    }
    function resetRotate(){
        const cardItem = this.querySelector('.card-item-3d');
        cardItem.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }
        $('#about-me .background-photos-grid').masonry({
            itemSelector: '#about-me .grid-item-photo',
            columnWidth: '#about-me .grid-sizer',
            horizontalOrder: true,
            gutter:20,
        });
    $('#favorite-films .container .films img').on('load', function(){
        console.log('kek');
        $('#favorite-films .container .films').masonry({
            itemSelector: '#favorite-films .film ',
            columnWidth: '#favorite-films .film',
            gutter:20,
        });    
    })
    
    
    
    $('.scrolling').on('click' , function(event) {
        scrolltoId(event ,this);
    });
    $(window).scroll(function(){
        headerScrolled();
    });
    $('.scrolling-to-top').on('click' , function(event){
        event.preventDefault();
        $('html').animate({
            scrollTop : 0
        }, 1000)
    })
})