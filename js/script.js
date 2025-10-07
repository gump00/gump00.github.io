// AOS 初始化
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ once: true, duration: 700 });
});

// 移动菜单切换
document.getElementById('menuBtn').addEventListener('click', () => {
  const m = document.getElementById('mobileNav');
  m.classList.toggle('hidden');
});

// 导航菜单激活状态管理
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // 滚动时更新激活状态
  const updateActiveNav = () => {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  // 监听滚动事件
  window.addEventListener('scroll', updateActiveNav);
  
  // 点击导航链接时关闭移动菜单
  const mobileNavLinks = document.querySelectorAll('#mobileNav a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobileNav').classList.add('hidden');
    });
  });
});
