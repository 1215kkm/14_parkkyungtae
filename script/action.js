$('html,body').animate({scrollTop:10})

function createFlame() {
    var flame = $('<div class="flame"></div>');
    $('body').append(flame);

    var startLeft = Math.random() * window.innerWidth;
    flame.css('left', startLeft + 'px');

    var flameDuration = 1000 + Math.random() * 2000; // 2초에서 4초 사이로 랜덤

    flame.animate({bottom: window.innerHeight + 'px',opacity: 0}, flameDuration, function () {
        $(this).remove();
    });
}

var bul = setInterval(createFlame, 10);

$(document).ready(function () {
    const hourHand = $('.hour-hand');
    const minuteHand = $('.minute-hand');
    const secondHand = $('.second-hand');
    
    // 초침 회전 구현 (1초마다 6도 회전)
    setInterval(function () {
        const currentRotation = parseInt(secondHand.attr('data-rotation') || '0', 10);
        const newRotation = currentRotation + 6;
        secondHand.css('transform', 'rotate(' + newRotation + 'deg)');
        secondHand.attr('data-rotation', newRotation % 360);
    }, 1000);

    // 시간 버튼 클릭 이벤트
    $('.time-button').on('click', function () {
        const time = $(this).data('time');
        $(this).addClass('on').siblings().removeClass('on');

    // 시침은 즉시 해당 시간으로 이동
    const hourRotation = time * 30 - 90;  // 시침은 한 시간당 30도씩 회전 (12시는 -90도 기준)
    $('.minute-hand').css('transform', 'rotate(' + hourRotation + 'deg)');

    // 분침은 해당 시간만큼 (시간 숫자 * 360도) 회전
    const minuteRotation = time * 360; // 분침은 해당 시간에 따라 360도씩 회전
    $('.hour-hand').css('transform', 'rotate(' + (minuteRotation - 90) + 'deg)');

    // 클릭한 버튼의 텍스트를 이용하여 해당하는 섹션으로 이동
    const sectionName = $(this).find('span').text().trim(); // 버튼 텍스트에서 섹션 이름 추출
    const targetSection = $(`section[data-sectionName="${sectionName}"]`);

        if (targetSection.length) {
            // 시계가 다 돌아간 후 (1초 후) 화면 이동 실행
            setTimeout(function() {
                $('html, body').animate({
                    scrollTop: targetSection.offset().top
                }, 1000, function() {
                    // 스크롤 애니메이션이 완료된 후 현재 스크롤 위치 갱신
                    currentScroll = window.scrollY;
                    targetScroll = window.scrollY;
                });
            }, 1500); // 1초 뒤 화면 이동
        }
    });

    // 각 시간 버튼에 대해 초기 회전 설정
    $('.time-button').each(function(i) {
        const angle = ((i + 1) * -30); // 각 버튼에 대해 30도씩 회전
        $(this).find('p').css('transform', `rotate(${angle}deg)`); // 원형으로 배치
    });

    // 스크롤 이벤트에서 시계의 위치와 상태 업데이트
    $(window).scroll(function () {
        let scrT = $(this).scrollTop();
        let winH = $(window).height();
        let section3Top = $('#section3').offset().top;
        
        if (scrT > section3Top + winH / 2) {
            $('.clock').addClass('on');
        } else {
            $('.clock').removeClass('on');
        }

        // 섹션에 따라 시계가 가리키는 시간 설정
        $('section').each(function () {
            const sectionTop = $(this).offset().top;
            const sectionName = $(this).data('sectionName');
            const sectionIndex = parseInt($(this).index());

            if (scrT >= sectionTop - winH / 2 && scrT < sectionTop + winH / 2) {
                // 섹션에 해당하는 시간을 설정하여 시계 바늘 조정
                const hourRotation = sectionIndex * 30 - 150;
                hourHand.css('transform', 'rotate(' + hourRotation + 'deg)');
                
                const minuteRotation = sectionIndex * 30 - 150;
                minuteHand.css('transform', 'rotate(' + minuteRotation + 'deg)');
            }
        });
    });





    let currentScroll = window.scrollY;
        let targetScroll = window.scrollY;
        let isScrolling = false;
        let isImageViewerOpen = false;

        // 휠 이벤트 리스너
        document.addEventListener('wheel', function(event) {
            if (isImageViewerOpen) return; // 이미지 뷰어가 열려 있으면 스크롤을 막음

            // 현재 스크롤 위치를 갱신
            currentScroll = window.scrollY;
            targetScroll += event.deltaY;
            targetScroll = Math.max(0, Math.min(document.body.scrollHeight - window.innerHeight, targetScroll));

            event.preventDefault();

            if (!isScrolling) {
                isScrolling = true;
                smoothScroll();
            }
        }, { passive: false });

        function smoothScroll() {
            const scrollStep = (targetScroll - currentScroll) / 10;
            currentScroll += scrollStep;

            window.scrollTo(0, currentScroll);

            if (Math.abs(targetScroll - currentScroll) > 1) {
                requestAnimationFrame(smoothScroll);
            } else {
                isScrolling = false;
            }
        }

        // 이미지 뷰어 닫기 이벤트
        $('.img_viewer').click(function(e) {
            if (!$(e.target).hasClass('viewImg')) {
                $(this).fadeOut(200);
                $('body').css({height: '', overflow: ''});
                isImageViewerOpen = false; // 이미지 뷰어가 닫혔음을 표시

                // 이미지 뷰어가 닫힐 때 스크롤 위치 갱신
                currentScroll = window.scrollY;
                targetScroll = window.scrollY;
            }
        });

        // 이미지 뷰어 열기 이벤트
        $('.viewBtn').click(function(e) {
            e.preventDefault();

            let imgSrc = $(this).find('img').attr('data-src');
            $('.img_viewer figure img').attr('src', imgSrc);
            $('.img_viewer').fadeIn(200).css({display: 'flex'});
            $('body').css({height:'100vh', overflow:'hidden'});
            isImageViewerOpen = true; // 이미지 뷰어가 열렸음을 표시
        })
});

