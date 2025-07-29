// スムーススクロール機能
function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// ページ読み込み時のアニメーション
document.addEventListener('DOMContentLoaded', function() {
    // 謝罪セクションのフェードイン
    const apologyContent = document.querySelector('.apology-content');
    setTimeout(() => {
        apologyContent.style.opacity = '0';
        apologyContent.style.transform = 'translateY(20px)';
        apologyContent.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
            apologyContent.style.opacity = '1';
            apologyContent.style.transform = 'translateY(0)';
        }, 100);
    }, 100);

    // スクロールボタンのアニメーション
    const scrollBtn = document.querySelector('.scroll-btn');
    setInterval(() => {
        scrollBtn.style.transform = 'translateY(5px)';
        setTimeout(() => {
            scrollBtn.style.transform = 'translateY(0)';
        }, 500);
    }, 2000);

    // 機能カードの表示アニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 機能カードを監視
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });
});