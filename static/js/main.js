document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    const logoLink = document.querySelector('.logo a');

    // Footer 링크 클릭 이벤트 처리
    const footerLinks = document.querySelectorAll('.footer-links a, .social-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('준비중입니다.');
        });
    });

    // 스크롤 이벤트 처리
    window.addEventListener('scroll', function() {
        // 햄버거 메뉴가 열려있으면 헤더 스타일을 변경하지 않음
        if (navLinks.classList.contains('active')) {
            return;
        }

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 모든 앵커 링크 클릭 이벤트 처리
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            // 클릭 즉시 헤더 스타일 변경
            header.classList.add('scrolled');
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }

            // 모바일 메뉴가 열려있으면 닫기
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // 햄버거 메뉴 클릭 이벤트
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // 모바일 메뉴가 열려있을 때는 헤더를 항상 흰색으로 설정
        if (navLinks.classList.contains('active')) {
            header.classList.add('scrolled');
        } else {
            // 메뉴가 닫혔을 때는 스크롤 위치에 따라 헤더 스타일 결정
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // 메뉴 링크 클릭 시 메뉴 닫기
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            // 메뉴가 닫힌 후 스크롤 위치에 따라 헤더 스타일 결정
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    });
});

// Hero section animation on scroll
function animateHeroElements() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const h1 = heroContent.querySelector('h1');
    const p = heroContent.querySelector('p');
    const button = heroContent.querySelector('.cta-button');

    // 먼저 reset 클래스를 추가하여 초기 상태로 되돌림
    [h1, p, button].forEach(el => {
        if (el) {
            el.classList.remove('animate');
            el.classList.add('reset');
        }
    });

    // 다음 프레임에서 reset 클래스를 제거하고 animate 클래스를 추가
    requestAnimationFrame(() => {
        [h1, p, button].forEach(el => {
            if (el) el.classList.remove('reset');
        });

        // 순차적으로 animate 클래스 추가
        setTimeout(() => {
            if (h1) h1.classList.add('animate');
        }, 50);

        setTimeout(() => {
            if (p) p.classList.add('animate');
        }, 300);

        setTimeout(() => {
            if (button) button.classList.add('animate');
        }, 600);
    });
}

// Initial animation
document.addEventListener('DOMContentLoaded', animateHeroElements);

// Animation on scroll
let lastScrollTop = 0;
let isAnimating = false;

window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero');
    if (!heroSection || isAnimating) return;

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 스크롤이 0보다 크다가 다시 0이 될 때만 애니메이션 실행
    if (lastScrollTop > 0 && currentScrollTop === 0) {
        isAnimating = true;
        animateHeroElements();
        
        // 애니메이션 완료 후 isAnimating 플래그 해제
        setTimeout(() => {
            isAnimating = false;
        }, 1000);
    }

    lastScrollTop = currentScrollTop;
});

// 폼 보안 및 유효성 검사
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // 폼 제출 제한 (1분에 1회)
    let lastSubmitTime = 0;
    const submitCooldown = 60000; // 1분

    form.addEventListener('submit', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastSubmitTime < submitCooldown) {
            e.preventDefault();
            alert('잠시 후 다시 시도해주세요.');
            return;
        }

        // 입력값 검증
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const phone = form.querySelector('#phone').value;
        const message = form.querySelector('#message').value;

        // XSS 방지
        if (name.includes('<') || name.includes('>') ||
            email.includes('<') || email.includes('>') ||
            phone.includes('<') || phone.includes('>') ||
            message.includes('<') || message.includes('>')) {
            e.preventDefault();
            alert('잘못된 입력이 감지되었습니다.');
            return;
        }

        // 이메일 도메인 검증
        const emailDomain = email.split('@')[1];
        if (!emailDomain || !emailDomain.includes('.')) {
            e.preventDefault();
            alert('유효한 이메일 주소를 입력하세요.');
            return;
        }

        lastSubmitTime = currentTime;
    });

    // 입력 필드 실시간 유효성 검사
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.checkValidity()) {
                input.classList.remove('invalid');
            } else {
                input.classList.add('invalid');
            }
        });
    });
}); 