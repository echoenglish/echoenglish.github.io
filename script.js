/* ========================================
   Echo English Studio - JavaScript
   网页交互功能
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initBackToTop();
    initFormHandler();
    initSmoothScroll();
});

/* ========================================
   导航栏功能
======================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    let lastScroll = 0;

    // 滚动时导航栏样式变化
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }

        lastScroll = currentScroll;
    });

    // 移动端汉堡菜单
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('mobile-active');

            // 切换汉堡菜单图标
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // 点击导航链接后关闭移动菜单
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.click();
            }
        });
    });
}

/* ========================================
   滚动动画
======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // 为区块添加入场动画
    const sections = document.querySelectorAll('.section-header, .about-content, .courses-grid, .pricing-grid, .contact-content');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/* ========================================
   数字计数动画
======================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateCounters = () => {
        if (hasAnimated) return;

        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.count);
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const start = 0;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // 使用 easeOutExpo 缓动函数
                const easeOutExpo = 1 - Math.pow(2, -10 * progress);
                const current = start + (target - start) * easeOutExpo;

                if (isDecimal) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };

            requestAnimationFrame(updateCounter);
        });

        hasAnimated = true;
    };

    // 当英雄区域可见时触发动画
    const heroSection = document.querySelector('.hero');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 500);
            }
        });
    }, { threshold: 0.5 });

    if (heroSection) {
        observer.observe(heroSection);
    }
}

/* ========================================
   返回顶部按钮
======================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================================
   PushPlus 配置
   请将下面的 TOKEN 替换为你的 PushPlus Token
   获取方式：微信关注 PushPlus 公众号 -> 功能 -> 我的Token
======================================== */
const PUSHPLUS_CONFIG = {
    token: 'f28b3398bfbe4fff9fb54dccfda37cb3',  // 替换为你的 Token
    template: 'html'  // 消息模板：html, txt, json
};

/* ========================================
   表单处理
======================================== */
function initFormHandler() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // 获取表单数据
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // 简单验证
            if (!data.parentName || !data.phone) {
                showNotification('请填写必填信息', 'error');
                return;
            }

            // 手机号验证
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(data.phone)) {
                showNotification('请输入正确的手机号码', 'error');
                return;
            }

            // 提交表单并发送微信通知
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
            submitBtn.disabled = true;

            // 发送 PushPlus 微信通知
            sendWechatNotification(data)
                .then(() => {
                    showNotification('提交成功！我们会尽快与您联系', 'success');
                    form.reset();
                })
                .catch((error) => {
                    console.error('推送通知失败:', error);
                    showNotification('提交成功！我们会尽快与您联系', 'success');
                    form.reset();
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });

        // 输入框焦点效果
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    }
}

/* ========================================
   发送微信通知 (PushPlus)
======================================== */
async function sendWechatNotification(data) {
    const token = PUSHPLUS_CONFIG.token;

    // 检查 Token 是否已配置
    if (!token || token === 'YOUR_PUSHPLUS_TOKEN_HERE') {
        console.warn('PushPlus Token 未配置，请先配置 Token');
        return Promise.resolve();
    }

    // 构建消息内容
    const currentTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const title = '【Echo English】新的课程咨询';
    const content = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px;">
            <div style="background: white; border-radius: 10px; padding: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h2 style="margin: 0 0 20px 0; color: #667eea; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                    📚 新课程咨询通知
                </h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                    <tr>
                        <td style="padding: 12px 0; color: #718096; width: 100px;">家长姓名</td>
                        <td style="padding: 12px 0; color: #1a202c; font-weight: 600;">${data.parentName || '未填写'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; color: #718096; border-top: 1px solid #e2e8f0;">联系电话</td>
                        <td style="padding: 12px 0; color: #667eea; font-weight: 600; border-top: 1px solid #e2e8f0;">${data.phone || '未填写'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; color: #718096; border-top: 1px solid #e2e8f0;">学生年龄</td>
                        <td style="padding: 12px 0; color: #1a202c; border-top: 1px solid #e2e8f0;">${data.studentAge || '未填写'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; color: #718096; border-top: 1px solid #e2e8f0;">课程类型</td>
                        <td style="padding: 12px 0; color: #1a202c; border-top: 1px solid #e2e8f0;">${data.courseType || '未选择'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; color: #718096; border-top: 1px solid #e2e8f0; vertical-align: top;">备注信息</td>
                        <td style="padding: 12px 0; color: #1a202c; border-top: 1px solid #e2e8f0;">${data.message || '无'}</td>
                    </tr>
                </table>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #e2e8f0; color: #a0aec0; font-size: 13px;">
                    📅 提交时间：${currentTime}
                </div>
            </div>
            <div style="text-align: center; margin-top: 15px; color: rgba(255,255,255,0.8); font-size: 12px;">
                Echo English Studio
            </div>
        </div>
    `;

    // 发送请求到 PushPlus API
    try {
        const response = await fetch('http://www.pushplus.plus/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                title: title,
                content: content,
                template: 'html'
            })
        });

        const result = await response.json();

        if (result.code === 200) {
            console.log('微信通知发送成功');
            return result;
        } else {
            console.error('微信通知发送失败:', result.msg);
            throw new Error(result.msg);
        }
    } catch (error) {
        console.error('发送通知时出错:', error);
        throw error;
    }
}

/* ========================================
   通知提示
======================================== */
function showNotification(message, type = 'info') {
    // 移除已存在的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // 添加样式
    const styles = `
        .notification {
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            padding: 16px 32px;
            border-radius: 12px;
            background: white;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            opacity: 0;
            transition: all 0.3s ease;
        }
        .notification.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .notification-content i {
            font-size: 20px;
        }
        .notification-content span {
            font-size: 15px;
            font-weight: 500;
            color: #1A202C;
        }
        .notification-success .notification-content i {
            color: #38A169;
        }
        .notification-error .notification-content i {
            color: #E53E3E;
        }
        .notification-info .notification-content i {
            color: #3182CE;
        }
    `;

    // 添加样式（如果不存在）
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // 自动隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/* ========================================
   平滑滚动
======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   视差滚动效果
======================================== */
function initParallax() {
    const shapes = document.querySelectorAll('.shape');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/* ========================================
   课程卡片悬停效果增强
======================================== */
document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

/* ========================================
   价格卡片悬停效果增强
======================================== */
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('popular')) {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        } else {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        }
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

/* ========================================
   页面加载完成动画
======================================== */
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // 延迟显示滚动指示器
    setTimeout(() => {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
        }
    }, 1000);
});

/* ========================================
   移动端菜单样式
======================================== */
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 24px;
            gap: 0;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        }

        .nav-links.mobile-active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
            display: flex;
        }

        .nav-links.mobile-active li {
            padding: 16px 0;
            border-bottom: 1px solid #E2E8F0;
        }

        .nav-links.mobile-active li:last-child {
            border-bottom: none;
        }

        .nav-links.mobile-active a {
            font-size: 16px;
            display: block;
        }

        .nav-cta {
            display: none;
        }

        .nav-links.mobile-active + .nav-cta {
            display: block;
            position: fixed;
            bottom: 24px;
            left: 24px;
            right: 24px;
            text-align: center;
            z-index: 1000;
        }
    }
`;

const mobileStyleSheet = document.createElement('style');
mobileStyleSheet.textContent = mobileMenuStyles;
document.head.appendChild(mobileStyleSheet);
