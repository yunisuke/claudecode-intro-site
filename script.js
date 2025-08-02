// ページ読み込み時のアニメーション
document.addEventListener('DOMContentLoaded', function() {

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

    // 詳細リンクのスムーススクロール
    const detailLinks = document.querySelectorAll('.detail-link');
    detailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // スクロール位置を計算（少し上にマージンを設定）
                const offsetTop = targetElement.offsetTop - 100;
                
                // スムーススクロール
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 詳細コンテンツをフェードイン
                setTimeout(() => {
                    targetElement.classList.add('visible');
                }, 300);
            }
        });
    });
    
    // 詳細セクションの監視
    const detailContents = document.querySelectorAll('.detail-content');
    detailContents.forEach(content => {
        observer.observe(content);
    });
});