/* ============================================
   PREDATOR FUN PARK - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // =====================
  // Preloader
  // =====================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        preloader.classList.add('loaded');
      }, 500);
    });
    // fallback
    setTimeout(function () {
      preloader.classList.add('loaded');
    }, 3000);
  }

  // =====================
  // Navbar Scroll Effect
  // =====================
  const navbar = document.querySelector('.navbar-predator');
  if (navbar) {
    function handleNavScroll() {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();
  }

  // Close mobile nav on click
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapse = document.querySelector('.navbar-collapse');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // =====================
  // Scroll to Top Button
  // =====================
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =====================
  // Animate on Scroll
  // =====================
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length > 0) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    animateElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // =====================
  // Counter Animation
  // =====================
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseInt(target.getAttribute('data-count'));
          let current = 0;
          const step = countTo / 60;
          const timer = setInterval(function () {
            current += step;
            if (current >= countTo) {
              current = countTo;
              clearInterval(timer);
            }
            target.textContent = Math.floor(current) + (target.getAttribute('data-suffix') || '');
          }, 16);
          counterObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  // =====================
  // TOC Toggle (Blog Detail)
  // =====================
  const tocToggle = document.querySelector('.toc-toggle');
  const tocBody = document.querySelector('.toc-body');
  if (tocToggle && tocBody) {
    tocToggle.addEventListener('click', function () {
      tocBody.classList.toggle('d-none');
      tocToggle.classList.toggle('collapsed');
    });
  }

  // =====================
  // Auto Generate TOC
  // =====================
  const tocList = document.getElementById('tocList');
  const articleBody = document.querySelector('.article-body');
  if (tocList && articleBody) {
    const headings = articleBody.querySelectorAll('h2, h3');
    let tocHTML = '';
    let h2Index = 0;
    headings.forEach(function (heading) {
      if (!heading.id) {
        heading.id = heading.textContent.trim().toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      if (heading.tagName === 'H2') {
        h2Index++;
        tocHTML += '<li><a href="#' + heading.id + '">' + h2Index + '. ' + heading.textContent + '</a><ul>';
      } else {
        tocHTML += '<li><a href="#' + heading.id + '">' + heading.textContent + '</a></li>';
      }
    });
    // Close any open ul tags
    const h2Count = articleBody.querySelectorAll('h2').length;
    for (let i = 0; i < h2Count; i++) {
      tocHTML += '</ul></li>';
    }
    tocList.innerHTML = tocHTML;
  }

  // =====================
  // Reading Progress Bar
  // =====================
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar && articleBody) {
    window.addEventListener('scroll', function () {
      const articleTop = articleBody.offsetTop;
      const articleHeight = articleBody.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const progress = Math.min(Math.max((scrollTop - articleTop + windowHeight) / articleHeight * 100, 0), 100);
      progressBar.style.width = progress + '%';
    });
  }

  // =====================
  // Share Buttons
  // =====================
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      let shareUrl = '';

      if (btn.classList.contains('wa')) {
        shareUrl = 'https://api.whatsapp.com/send?text=' + title + ' ' + url;
      } else if (btn.classList.contains('fb')) {
        shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
      } else if (btn.classList.contains('tw')) {
        shareUrl = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title;
      } else if (btn.classList.contains('li')) {
        shareUrl = 'https://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + title;
      } else if (btn.classList.contains('tg')) {
        shareUrl = 'https://t.me/share/url?url=' + url + '&text=' + title;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }
    });
  });

  // =====================
  // Smooth Scroll for anchors
  // =====================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 80;
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // =====================
  // Lazy load images
  // =====================
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

});
