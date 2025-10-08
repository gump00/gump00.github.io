// AOS 初始化
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ once: true, duration: 700 });
  
  // 初始化轮播图
  initCarousel();
  
  // 初始化EmailJS
  initEmailJS();
  
  // 初始化联系表单
  initContactForm();
});

/**
 * 轮播图功能：实现图片自动淡入淡出切换
 */
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  
  let currentIndex = 0;
  
  // 切换到下一张图片
  function nextSlide() {
    // 当前图片淡出
    slides[currentIndex].style.opacity = '0';
    
    // 更新索引
    currentIndex = (currentIndex + 1) % slides.length;
    
    // 下一张图片淡入
    slides[currentIndex].style.opacity = '1';
  }
  
  // 每3秒切换一次
  setInterval(nextSlide, 3000);
}

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

/**
 * 初始化EmailJS
 */
function initEmailJS() {
  // 使用提供的Public Key初始化EmailJS
  emailjs.init('Dt_lZINjtCyYFZ_kf');
}

/**
 * 初始化联系表单：处理表单提交和邮件发送
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMessage = document.getElementById('formMessage');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 获取表单数据
    const formData = {
      from_name: document.getElementById('from_name').value.trim(),
      from_phone: document.getElementById('from_phone').value.trim(),
      from_email: document.getElementById('from_email').value.trim(),
      message: document.getElementById('message').value.trim()
    };
    
    // 表单验证
    const validationError = validateForm(formData);
    if (validationError) {
      showMessage(validationError, 'error');
      return;
    }
    
    // 禁用提交按钮，防止重复提交
    submitBtn.disabled = true;
    submitBtn.textContent = '发送中...';
    formMessage.classList.add('hidden');
    
    try {
      // 发送邮件
      const response = await emailjs.send(
        'service_0yc0hps',  // Service ID
        'template_49x7dbu', // Template ID
        formData
      );
      
      // 发送成功
      showMessage('感谢您的咨询！我们会尽快与您联系。', 'success');
      
      // 清空表单
      contactForm.reset();
      
    } catch (error) {
      // 发送失败
      console.error('邮件发送失败:', error);
      showMessage('发送失败，请稍后重试或直接联系我们。', 'error');
    } finally {
      // 恢复提交按钮
      submitBtn.disabled = false;
      submitBtn.textContent = '提交';
    }
  });
  
  /**
   * 验证表单数据
   * @param {Object} data - 表单数据
   * @returns {string|null} - 返回错误消息，如果验证通过则返回null
   */
  function validateForm(data) {
    // 验证姓名
    if (!data.from_name || data.from_name.length < 2) {
      return '请输入有效的姓名（至少2个字符）';
    }
    
    // 验证电话号码
    if (!validatePhone(data.from_phone)) {
      return '请输入有效的电话号码（手机号或固定电话）';
    }
    
    // 验证邮箱
    if (!validateEmail(data.from_email)) {
      return '请输入有效的电子邮箱地址';
    }
    
    // 验证留言内容
    if (!data.message || data.message.length < 10) {
      return '请输入留言内容（至少10个字符）';
    }
    
    return null;
  }
  
  /**
   * 验证电话号码格式
   * @param {string} phone - 电话号码
   * @returns {boolean} - 格式是否正确
   */
  function validatePhone(phone) {
    // 移除所有空格和横杠
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // 中国手机号：1开头的11位数字，第二位是3-9
    const mobileRegex = /^1[3-9]\d{9}$/;
    
    // 固定电话：0开头，区号3-4位，号码7-8位
    // 格式：010-12345678 或 0731-1234567 或 直接01012345678
    const landlineRegex = /^0\d{2,3}\d{7,8}$/;
    
    // 400/800电话：10位数字
    const serviceRegex = /^(400|800)\d{7}$/;
    
    return mobileRegex.test(cleanPhone) || landlineRegex.test(cleanPhone) || serviceRegex.test(cleanPhone);
  }
  
  /**
   * 验证邮箱格式
   * @param {string} email - 邮箱地址
   * @returns {boolean} - 格式是否正确
   */
  function validateEmail(email) {
    // 标准邮箱格式验证
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  
  /**
   * 显示表单提交消息
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型 ('success' 或 'error')
   */
  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.classList.remove('hidden', 'text-green-600', 'text-red-600');
    formMessage.classList.add(type === 'success' ? 'text-green-600' : 'text-red-600');
    
    // 3秒后自动隐藏消息
    setTimeout(() => {
      formMessage.classList.add('hidden');
    }, 5000);
  }
}
